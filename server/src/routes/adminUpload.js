import express from "express";
import multer from "multer";
import csvParser from "csv-parser";
import { Readable } from "stream";
import adminAuth from "../middleware/adminAuth.js";
import { getClient } from "../db/index.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 15 * 1024 * 1024 } });

const tableConfig = {
  subjects: {
    columns: ["subject_id", "name", "description"],
    conflictTarget: "subject_id"
  },
  topics: {
    columns: ["topic_id", "subject_id", "name", "description"],
    conflictTarget: "topic_id"
  },
  atomic_topics: {
    columns: ["atomic_topic_id", "topic_id", "name", "description"],
    conflictTarget: "atomic_topic_id"
  },
  questions: {
    columns: [
      "id",
      "subject_id",
      "topic_id",
      "text",
      "options",
      "correct_answer",
      "explanation",
      "difficulty",
      "is_demo"
    ],
    conflictTarget: "id"
  },
  exams: {
    columns: ["id", "title", "category", "price", "validity_days", "description"],
    conflictTarget: "id"
  },
  users: {
    columns: ["id", "name", "email", "password_hash", "role"],
    conflictTarget: "email"
  },
  demo_codes: {
    columns: ["topic_id", "demo_code"],
    conflictTarget: "topic_id"
  }
};

const parseCsv = (buffer) =>
  new Promise((resolve, reject) => {
    const rows = [];
    let headers = [];
    Readable.from(buffer)
      .pipe(
        csvParser({
          mapHeaders: ({ header }) => header?.trim()
        })
      )
      .on("headers", (parsedHeaders) => {
        headers = parsedHeaders;
      })
      .on("data", (data) => rows.push(data))
      .on("end", () => resolve({ rows, headers }))
      .on("error", reject);
  });

const normalizeValue = (value, column) => {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  if (column === "options") {
    if (typeof value === "object") return value;
    try {
      return JSON.parse(value);
    } catch (error) {
      throw new Error("Invalid JSON in options column");
    }
  }

  if (column === "is_demo") {
    if (typeof value === "boolean") return value;
    return ["true", "1", "yes", "y"].includes(String(value).trim().toLowerCase());
  }

  return value;
};

const buildUpsertQuery = (tableName, columns, conflictTarget) => {
  const updateColumns = columns.filter((column) => column !== conflictTarget);
  const updateSet = updateColumns
    .map((column) => `${column} = EXCLUDED.${column}`)
    .join(", ");
  const placeholders = columns.map((_, index) => `$${index + 1}`).join(", ");

  return `
    INSERT INTO ${tableName} (${columns.join(", ")})
    VALUES (${placeholders})
    ON CONFLICT (${conflictTarget})
    DO UPDATE SET ${updateSet}
  `;
};

router.post("/upload-csv", adminAuth, upload.single("file"), async (req, res) => {
  const { tableName } = req.body;

  if (!tableName || !tableConfig[tableName]) {
    return res.status(400).json({ message: "Invalid table name." });
  }

  if (!req.file) {
    return res.status(400).json({ message: "CSV file is required." });
  }

  try {
    const { columns, conflictTarget } = tableConfig[tableName];
    const { rows, headers } = await parseCsv(req.file.buffer);
    const missingColumns = columns.filter((column) => !headers.includes(column));

    if (missingColumns.length > 0) {
      return res.status(400).json({
        message: "CSV is missing required columns.",
        missingColumns
      });
    }

    const client = await getClient();
    const queryText = buildUpsertQuery(tableName, columns, conflictTarget);
    let insertedCount = 0;

    try {
      await client.query("BEGIN");

      for (let index = 0; index < rows.length; index += 1) {
        const row = rows[index];
        const values = columns.map((column) => normalizeValue(row[column], column));

        try {
          await client.query(queryText, values);
          insertedCount += 1;
        } catch (error) {
          await client.query("ROLLBACK");
          return res.status(400).json({
            message: "Failed to insert row.",
            rowNumber: index + 1,
            error: error.message
          });
        }
      }

      await client.query("COMMIT");
    } finally {
      client.release();
    }

    return res.json({ insertedCount });
  } catch (error) {
    console.error("CSV upload failed", error);
    return res.status(500).json({ message: "CSV upload failed." });
  }
});

export default router;

import express from "express";
import multer from "multer";
import xlsx from "xlsx";
import { getClient, query } from "../db/index.js";
import { authenticate, authorizeRole } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticate);
router.use(authorizeRole("admin"));

const upload = multer({ storage: multer.memoryStorage() });

router.post("/exams", async (req, res) => {
  const { name, description } = req.body;
  const result = await query(
    "insert into exams (name, description) values ($1, $2) returning *",
    [name, description]
  );
  res.status(201).json({ exam: result.rows[0] });
});

router.post("/topics", async (req, res) => {
  const { examId, title, shortDescription, fullDescription, price } = req.body;
  const result = await query(
    `insert into topics (exam_id, title, short_description, full_description, price)
     values ($1, $2, $3, $4, $5)
     returning *`,
    [examId, title, shortDescription, fullDescription, price || 0]
  );
  res.status(201).json({ topic: result.rows[0] });
});

router.post("/questions", async (req, res) => {
  const { topicId, questionText, options, correctAnswer, explanation, isDemoQuestion } = req.body;
  const result = await query(
    `insert into questions (topic_id, question_text, options, correct_answer, explanation, is_demo_question)
     values ($1, $2, $3, $4, $5, $6)
     returning *`,
    [topicId, questionText, options, correctAnswer, explanation, isDemoQuestion || false]
  );
  res.status(201).json({ question: result.rows[0] });
});

router.post("/import/questions", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Excel file is required" });
  }

  const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(sheet, { defval: "" });

  const client = await getClient();
  try {
    const inserted = [];
    await client.query("begin");
    for (const row of rows) {
      const topicId = row.TopicId || row.topicId;
      const questionText = row.Question || row.question;
      const options = [row.OptionA, row.OptionB, row.OptionC, row.OptionD].filter(Boolean);
      const correctAnswer = row.CorrectAnswer || row.correctAnswer;
      const explanation = row.Explanation || row.explanation || null;
      const demoValue = String(row.isDemoQuestion || row.IsDemoQuestion || "").toLowerCase();
      const isDemoQuestion = demoValue === "true" || demoValue === "1" || demoValue === "yes";

      if (!topicId || !questionText || options.length === 0 || !correctAnswer) {
        continue;
      }

      const result = await client.query(
        `insert into questions (topic_id, question_text, options, correct_answer, explanation, is_demo_question)
         values ($1, $2, $3, $4, $5, $6)
         returning id`,
        [topicId, questionText, options, correctAnswer, explanation, isDemoQuestion]
      );
      inserted.push(result.rows[0]);
    }
    await client.query("commit");
    res.status(201).json({ insertedCount: inserted.length });
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
  }
});

router.get("/users", async (req, res) => {
  const result = await query("select id, name, email, role from users order by created_at desc");
  res.json({ users: result.rows });
});

export default router;

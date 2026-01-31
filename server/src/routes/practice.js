import express from "express";
import { query } from "../db/index.js";

const router = express.Router();

router.get("/subjects", async (req, res) => {
  try {
    const result = await query(
      "select subject_id, name, description from subjects order by subject_id"
    );
    res.json({ subjects: result.rows });
  } catch (err) {
    console.error("Error fetching subjects:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/subjects/:subjectId/topics", async (req, res) => {
  try {
    const result = await query(
      "select topic_id, name, description from topics where subject_id = $1 order by topic_id",
      [req.params.subjectId]
    );
    res.json({ topics: result.rows });
  } catch (err) {
    console.error("Error fetching topics:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/topics/:topicId/demo-code", async (req, res) => {
  try {
    const result = await query(
      "select demo_code from demo_codes where topic_id = $1",
      [req.params.topicId]
    );
    const demoCode = result.rows[0]?.demo_code;
    if (!demoCode) {
      return res.status(404).json({ message: "Demo code not found" });
    }
    return res.json({ demoCode });
  } catch (err) {
    console.error("Error fetching demo code:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/questions", async (req, res) => {
  const { subjectId, topicId } = req.query;
  if (!subjectId || !topicId) {
    return res.status(400).json({ message: "subjectId and topicId are required" });
  }

  try {
    const result = await query(
      `select
        question_id,
        question,
        a,
        b,
        c,
        answer,
        solution,
        difficulty,
        question_type,
        mock,
        session
      from questions
      where subject_id = $1 and topic_id = $2
      order by question_id`,
      [subjectId, topicId]
    );
    return res.json({ questions: result.rows });
  } catch (err) {
    console.error("Error fetching questions:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;

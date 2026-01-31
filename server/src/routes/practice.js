import express from "express";
import { query } from "../db/index.js";
import activityLogger from "../middleware/activityLogger.js";

const router = express.Router();

router.use(activityLogger);

/* ==========================================
   ✅ GET SUBJECTS
========================================== */
router.get("/subjects", async (req, res) => {
  try {
    const result = await query(
      `SELECT subject_id, name, description
       FROM public.subjects
       ORDER BY subject_id`
    );

    res.json({ subjects: result.rows });
  } catch (err) {
    console.error("Error fetching subjects:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

/* ==========================================
   ✅ GET TOPICS BY SUBJECT
========================================== */
router.get("/subjects/:subjectId/topics", async (req, res) => {
  try {
    const result = await query(
      `SELECT topic_id, name, description
       FROM topics
       WHERE subject_id = $1
       ORDER BY topic_id`,
      [req.params.subjectId]
    );

    res.json({ topics: result.rows });
  } catch (err) {
    console.error("Error fetching topics:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

/* ==========================================
   ✅ GET DEMO CODE FOR TOPIC
========================================== */
router.get("/topics/:topicId/demo-code", async (req, res) => {
  try {
    const result = await query(
      `SELECT demo_code
       FROM public.demo_codes
       WHERE topic_id = $1`,
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

/* ==========================================
   ✅ GET QUESTIONS (Correct Columns)
========================================== */
router.get("/questions", async (req, res) => {
  const { subjectId, topicId } = req.query;

  if (!subjectId || !topicId) {
    return res.status(400).json({
      message: "subjectId and topicId are required",
    });
  }

  try {
    const result = await query(
      `SELECT
         id,
         text,
         options,
         correct_answer,
         explanation,
         difficulty,
         is_demo
       FROM public.questions
       WHERE subject_id = $1
         AND topic_id = $2
       ORDER BY id`,
      [subjectId, topicId]
    );

    return res.json({ questions: result.rows });
  } catch (err) {
    console.error("Error fetching questions:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;

import express from "express";
import { query } from "../db/index.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await query(
      "SELECT id, name, description FROM exams ORDER BY name;"
    );
    res.json({ exams: result.rows });
  } catch (err) {
    console.error("Error fetching exams:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});



router.get("/:id", async (req, res) => {
  const result = await query(
    "select id, name, description from exams where id = $1",
    [req.params.id]
  );
  const exam = result.rows[0];
  if (!exam) {
    return res.status(404).json({ message: "Exam not found" });
  }
  return res.json({ exam });
});

router.get("/:id/topics", async (req, res) => {
  const result = await query(
    "select id, title, short_description as \"shortDescription\", price from topics where exam_id = $1 order by title",
    [req.params.id]
  );
  res.json({ topics: result.rows });
});

router.get("/:id/demo", async (req, res) => {
  const result = await query(
    `select q.id,
            q.question_text as "questionText",
            q.options,
            q.correct_answer as "correctAnswer",
            q.explanation
       from questions q
       join topics t on t.id = q.topic_id
      where t.exam_id = $1 and q.is_demo_question = true`,
    [req.params.id]
  );
  res.json({ questions: result.rows });
});

router.post("/:id/subscribe", authenticate, async (req, res) => {
  const { durationDays } = req.body;
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + (durationDays || 30));
  await query(
    "insert into subscriptions (user_id, topic_id, expires_at) values ($1, $2, $3)",
    [req.user.sub, req.params.id, expiresAt]
  );
  res.json({ message: "Subscription activated", expiresAt });
});

export default router;

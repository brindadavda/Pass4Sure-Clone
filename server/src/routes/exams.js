import express from "express";
import { query } from "../db/index.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await query(
      "SELECT id, title, category, price, validity_days, description FROM exams ORDER BY title;"
    );
    res.json({ exams: result.rows });
  } catch (err) {
    console.error("Error fetching exams:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});



router.get("/:id", async (req, res) => {
  const result = await query(
    "select id, title, category, price, validity_days, description from exams where id = $1",
    [req.params.id]
  );
  const exam = result.rows[0];
  if (!exam) {
    return res.status(404).json({ message: "Exam not found" });
  }
  return res.json({ exam });
});

router.get("/:id/demo", async (req, res) => {
  const result = await query(
    "select id, text, options, explanation, difficulty from questions where exam_id = $1 and is_demo = true",
    [req.params.id]
  );
  res.json({ questions: result.rows });
});

router.post("/:id/subscribe", authenticate, async (req, res) => {
  const { durationDays } = req.body;
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + (durationDays || 30));
  await query(
    "insert into subscriptions (user_id, exam_id, expires_at) values ($1, $2, $3)",
    [req.user.sub, req.params.id, expiresAt]
  );
  res.json({ message: "Subscription activated", expiresAt });
});

export default router;

import express from "express";
import { query } from "../db/index.js";
import { authenticate, authorizeRole } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticate);
router.use(authorizeRole("admin"));

router.post("/exams", async (req, res) => {
  const { title, category, price, validityDays, description } = req.body;
  const result = await query(
    "insert into exams (title, category, price, validity_days, description) values ($1, $2, $3, $4, $5) returning *",
    [title, category, price, validityDays, description]
  );
  res.status(201).json({ exam: result.rows[0] });
});

router.post("/questions", async (req, res) => {
  const { examId, text, options, correctAnswer, explanation, difficulty, isDemo } = req.body;
  const result = await query(
    "insert into questions (exam_id, text, options, correct_answer, explanation, difficulty, is_demo) values ($1, $2, $3, $4, $5, $6, $7) returning *",
    [examId, text, options, correctAnswer, explanation, difficulty, isDemo || false]
  );
  res.status(201).json({ question: result.rows[0] });
});

router.get("/users", async (req, res) => {
  const result = await query("select id, name, email, role from users order by created_at desc");
  res.json({ users: result.rows });
});

export default router;

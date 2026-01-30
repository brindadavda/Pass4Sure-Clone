import express from "express";
import { query } from "../db/index.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.get("/exam/:examId", authenticate, async (req, res) => {
  const result = await query(
    "select id, text, options, explanation, difficulty from questions where exam_id = $1 order by id",
    [req.params.examId]
  );
  res.json({ questions: result.rows });
});

router.post("/response", authenticate, async (req, res) => {
  const { questionId, answer, isCorrect } = req.body;
  await query(
    "insert into user_responses (user_id, question_id, user_answer, is_correct) values ($1, $2, $3, $4)",
    [req.user.sub, questionId, answer, isCorrect]
  );
  res.json({ message: "Response recorded" });
});

export default router;

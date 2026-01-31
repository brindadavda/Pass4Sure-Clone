import express from "express";
import { query } from "../db/index.js";
const router = express.Router();

router.get("/exam/:examId", async (req, res) => {
  const result = await query(
    `select q.id,
            q.question_text as "questionText",
            q.options,
            q.correct_answer as "correctAnswer",
            q.explanation
       from questions q
       join topics t on t.id = q.topic_id
      where t.exam_id = $1
      order by q.id`,
    [req.params.examId]
  );
  res.json({ questions: result.rows });
});

router.post("/response", async (req, res) => {
  const { userId, questionId, answer, isCorrect } = req.body;
  if (!userId) {
    return res.json({ message: "Response captured locally" });
  }
  await query(
    "insert into user_responses (user_id, question_id, user_answer, is_correct) values ($1, $2, $3, $4)",
    [userId, questionId, answer, isCorrect]
  );
  res.json({ message: "Response recorded" });
});

export default router;

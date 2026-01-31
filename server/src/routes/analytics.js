import express from "express";
import { query } from "../db/index.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.get("/me", authenticate, async (req, res) => {
  const result = await query(
    "select q.topic_id, count(*) as total, sum(case when r.is_correct then 1 else 0 end) as correct from user_responses r join questions q on q.id = r.question_id where r.user_id = $1 group by q.topic_id",
    [req.user.sub]
  );
  res.json({ performance: result.rows });
});

router.get("/me/history", authenticate, async (req, res) => {
  const result = await query(
    "select r.question_id, r.user_answer, r.is_correct, r.created_at from user_responses r where r.user_id = $1 order by r.created_at desc limit 50",
    [req.user.sub]
  );
  res.json({ history: result.rows });
});

export default router;

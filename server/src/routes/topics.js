import express from "express";
import { query } from "../db/index.js";

const router = express.Router();

router.get("/:topicId", async (req, res) => {
  const result = await query(
    `select t.id,
            t.exam_id as "examId",
            t.title,
            t.short_description as "shortDescription",
            t.full_description as "fullDescription",
            t.price,
            e.name as "examName"
       from topics t
       join exams e on e.id = t.exam_id
      where t.id = $1`,
    [req.params.topicId]
  );
  const topic = result.rows[0];
  if (!topic) {
    return res.status(404).json({ message: "Topic not found" });
  }
  return res.json({ topic });
});

router.get("/:topicId/questions", async (req, res) => {
  const { demo, limit } = req.query;
  const isDemo = demo === "true";
  const parsedLimit = Number(limit);

  const queryText = `
    select id,
           question_text as "questionText",
           options,
           correct_answer as "correctAnswer",
           explanation
      from questions
     where topic_id = $1
       ${isDemo ? "and is_demo_question = true" : ""}
     order by id
     ${Number.isFinite(parsedLimit) && parsedLimit > 0 ? "limit $2" : ""}
  `;

  const values = [req.params.topicId];
  if (Number.isFinite(parsedLimit) && parsedLimit > 0) {
    values.push(parsedLimit);
  }

  const result = await query(queryText, values);
  res.json({ questions: result.rows });
});

export default router;

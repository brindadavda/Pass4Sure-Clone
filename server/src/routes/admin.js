import express from "express";
import { query } from "../db/index.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

router.use(adminAuth);

router.get("/subjects", async (req, res) => {
  const result = await query(
    "select subject_id, name, description from subjects order by subject_id"
  );
  res.json({ subjects: result.rows });
});

router.post("/subjects", async (req, res) => {
  const { subjectId, name, description } = req.body;
  const result = await query(
    "insert into subjects (subject_id, name, description) values ($1, $2, $3) returning *",
    [subjectId, name, description]
  );
  res.status(201).json({ subject: result.rows[0] });
});

router.put("/subjects/:id", async (req, res) => {
  const { name, description } = req.body;
  const result = await query(
    "update subjects set name = $1, description = $2 where subject_id = $3 returning *",
    [name, description, req.params.id]
  );
  res.json({ subject: result.rows[0] });
});

router.delete("/subjects/:id", async (req, res) => {
  await query("delete from subjects where subject_id = $1", [req.params.id]);
  res.status(204).send();
});

router.get("/topics", async (req, res) => {
  const result = await query(
    "select topic_id, subject_id, name, description from topics order by topic_id"
  );
  res.json({ topics: result.rows });
});

router.post("/topics", async (req, res) => {
  const { topicId, subjectId, name, description } = req.body;
  const result = await query(
    "insert into topics (topic_id, subject_id, name, description) values ($1, $2, $3, $4) returning *",
    [topicId, subjectId, name, description]
  );
  res.status(201).json({ topic: result.rows[0] });
});

router.put("/topics/:id", async (req, res) => {
  const { subjectId, name, description } = req.body;
  const result = await query(
    "update topics set subject_id = $1, name = $2, description = $3 where topic_id = $4 returning *",
    [subjectId, name, description, req.params.id]
  );
  res.json({ topic: result.rows[0] });
});

router.delete("/topics/:id", async (req, res) => {
  await query("delete from topics where topic_id = $1", [req.params.id]);
  res.status(204).send();
});

router.get("/atomic-topics", async (req, res) => {
  const result = await query(
    "select atomic_topic_id, topic_id, name, description from atomic_topics order by atomic_topic_id"
  );
  res.json({ atomicTopics: result.rows });
});

router.post("/atomic-topics", async (req, res) => {
  const { atomicTopicId, topicId, name, description } = req.body;
  const result = await query(
    "insert into atomic_topics (atomic_topic_id, topic_id, name, description) values ($1, $2, $3, $4) returning *",
    [atomicTopicId, topicId, name, description]
  );
  res.status(201).json({ atomicTopic: result.rows[0] });
});

router.put("/atomic-topics/:id", async (req, res) => {
  const { topicId, name, description } = req.body;
  const result = await query(
    "update atomic_topics set topic_id = $1, name = $2, description = $3 where atomic_topic_id = $4 returning *",
    [topicId, name, description, req.params.id]
  );
  res.json({ atomicTopic: result.rows[0] });
});

router.delete("/atomic-topics/:id", async (req, res) => {
  await query("delete from atomic_topics where atomic_topic_id = $1", [req.params.id]);
  res.status(204).send();
});

router.get("/questions", async (req, res) => {
  const result = await query(
    "select id, subject_id, topic_id, atomic_topic_id, text, options, correct_answer, explanation, difficulty, is_demo from questions order by id"
  );
  res.json({ questions: result.rows });
});

router.post("/questions", async (req, res) => {
  const {
    subjectId,
    topicId,
    atomicTopicId,
    text,
    options,
    correctAnswer,
    explanation,
    difficulty,
    isDemo
  } = req.body;

  const result = await query(
    "insert into questions (subject_id, topic_id, atomic_topic_id, text, options, correct_answer, explanation, difficulty, is_demo) values ($1, $2, $3, $4, $5, $6, $7, $8, $9) returning *",
    [subjectId, topicId, atomicTopicId, text, options, correctAnswer, explanation, difficulty, isDemo]
  );
  res.status(201).json({ question: result.rows[0] });
});

router.put("/questions/:uuid", async (req, res) => {
  const {
    subjectId,
    topicId,
    atomicTopicId,
    text,
    options,
    correctAnswer,
    explanation,
    difficulty,
    isDemo
  } = req.body;

  const result = await query(
    "update questions set subject_id = $1, topic_id = $2, atomic_topic_id = $3, text = $4, options = $5, correct_answer = $6, explanation = $7, difficulty = $8, is_demo = $9 where id = $10 returning *",
    [
      subjectId,
      topicId,
      atomicTopicId,
      text,
      options,
      correctAnswer,
      explanation,
      difficulty,
      isDemo,
      req.params.uuid
    ]
  );
  res.json({ question: result.rows[0] });
});

router.delete("/questions/:uuid", async (req, res) => {
  await query("delete from questions where id = $1", [req.params.uuid]);
  res.status(204).send();
});

router.get("/demo-codes", async (req, res) => {
  const result = await query(
    "select topic_id, demo_code from demo_codes order by topic_id"
  );
  res.json({ demoCodes: result.rows });
});

router.post("/demo-codes", async (req, res) => {
  const { topicId, demoCode } = req.body;
  const result = await query(
    "insert into demo_codes (topic_id, demo_code) values ($1, $2) returning *",
    [topicId, demoCode]
  );
  res.status(201).json({ demoCode: result.rows[0] });
});

router.put("/demo-codes/:topicId", async (req, res) => {
  const { demoCode } = req.body;
  const result = await query(
    "update demo_codes set demo_code = $1 where topic_id = $2 returning *",
    [demoCode, req.params.topicId]
  );
  res.json({ demoCode: result.rows[0] });
});

router.delete("/demo-codes/:topicId", async (req, res) => {
  await query("delete from demo_codes where topic_id = $1", [req.params.topicId]);
  res.status(204).send();
});

router.get("/users", async (req, res) => {
  const result = await query(
    "select id, name, email, role, created_at from users order by created_at desc"
  );
  res.json({ users: result.rows });
});

router.put("/users/:id/role", async (req, res) => {
  const { role } = req.body;
  const result = await query(
    "update users set role = $1 where id = $2 returning id, name, email, role",
    [role, req.params.id]
  );
  res.json({ user: result.rows[0] });
});

router.delete("/users/:id", async (req, res) => {
  await query("delete from users where id = $1", [req.params.id]);
  res.status(204).send();
});

router.get("/activity", async (req, res) => {
  const result = await query(
    `select ua.id,
            ua.activity_type,
            ua.page,
            ua.details,
            ua.created_at,
            u.id as user_id,
            u.name as user_name,
            u.email as user_email
     from user_activity ua
     left join users u on u.id = ua.user_id
     order by ua.created_at desc
     limit 200`
  );
  res.json({ activity: result.rows });
});

export default router;

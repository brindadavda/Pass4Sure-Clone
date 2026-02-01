import express from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { query } from "../db/index.js";
import { getChatbotReply } from "../chatbot/openaiClient.js";

const router = express.Router();

const ensureChatbotTable = async () => {
  await query(
    `CREATE TABLE IF NOT EXISTS chatbot_logs (
      id uuid primary key default gen_random_uuid(),
      user_id uuid null,
      message text not null,
      reply text not null,
      created_at timestamp default now()
    )`
  );
};

router.post("/message", async (req, res) => {
  const { message, context, userId } = req.body;
      user_id uuid references users(id) on delete set null,
      session_id text,
      user_message text not null,
      bot_reply text not null,
      created_at timestamp default now()
    )`
  );
  await query(`ALTER TABLE chatbot_logs ADD COLUMN IF NOT EXISTS user_id uuid`);
  await query(`ALTER TABLE chatbot_logs ADD COLUMN IF NOT EXISTS session_id text`);
  await query(`ALTER TABLE chatbot_logs ADD COLUMN IF NOT EXISTS user_message text`);
  await query(`ALTER TABLE chatbot_logs ADD COLUMN IF NOT EXISTS bot_reply text`);
  await query(`ALTER TABLE chatbot_logs ADD COLUMN IF NOT EXISTS message text`);
  await query(`ALTER TABLE chatbot_logs ADD COLUMN IF NOT EXISTS reply text`);
  await query(
    `ALTER TABLE chatbot_logs
     ADD CONSTRAINT chatbot_logs_user_id_fkey
     FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL`
  ).catch(() => {});
};

router.post("/message", async (req, res) => {
  const { message, context, sessionId: providedSessionId } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ message: "message is required" });
  }

  try {
    await ensureChatbotTable();
    const reply = await getChatbotReply({ message, context });
    const result = await query(
      `INSERT INTO chatbot_logs (user_id, message, reply)
       VALUES ($1, $2, $3)
       RETURNING id, user_id, message, reply, created_at`,
      [userId || null, message, reply]
    );

    return res.json({ reply, log: result.rows[0] });
    const authHeader = req.headers.authorization;
    let userId = null;
    if (authHeader) {
      try {
        const token = authHeader.replace("Bearer ", "");
        const payload = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
        userId = payload.sub || null;
      } catch (error) {
        userId = null;
      }
    }
    const sessionId =
      providedSessionId ||
      req.headers["x-session-id"] ||
      crypto.randomUUID();
    const reply = await getChatbotReply({ message, context });
    const result = await query(
      `INSERT INTO chatbot_logs (user_id, session_id, user_message, bot_reply)
       VALUES ($1, $2, $3, $4)
       RETURNING id, user_id, session_id, user_message, bot_reply, created_at`,
      [userId, sessionId, message, reply]
    );

    return res.json({ reply, sessionId, log: result.rows[0] });
  } catch (error) {
    console.error("Chatbot message failed", error);
    return res.status(500).json({ message: "Chatbot failed" });
  }
});

router.get("/logs", async (req, res) => {
  try {
    await ensureChatbotTable();
    const result = await query(
      `SELECT cl.id, cl.user_id, cl.message, cl.reply, cl.created_at, u.role as user_role
       FROM chatbot_logs cl
       LEFT JOIN users u ON cl.user_id = u.id
       ORDER BY cl.created_at DESC`
    );
    return res.json({ logs: result.rows });
  } catch (error) {
    console.error("Chatbot logs failed", error);
    return res.status(500).json({ message: "Unable to fetch logs" });
  }
});

export default router;

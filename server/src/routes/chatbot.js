import express from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { query } from "../db/index.js";
import { getChatbotReply } from "../chatbot/openaiClient.js";

const router = express.Router();

/* -----------------------------------
   Ensure chatbot_logs table exists
----------------------------------- */
const ensureChatbotTable = async () => {
  await query(`
    CREATE TABLE IF NOT EXISTS chatbot_logs (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

      user_id uuid REFERENCES users(id) ON DELETE SET NULL,
      session_id text,

      user_message text NOT NULL,
      bot_reply text NOT NULL,

      created_at timestamp DEFAULT now()
    )
  `);
};

/* -----------------------------------
   POST: Send message to chatbot
----------------------------------- */
router.post("/message", async (req, res) => {
  const { message, context, sessionId: providedSessionId } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ message: "message is required" });
  }

  try {
    await ensureChatbotTable();

    /* -------------------------------
       Extract userId from JWT token
    -------------------------------- */
    let userId = null;
    const authHeader = req.headers.authorization;

    if (authHeader) {
      try {
        const token = authHeader.replace("Bearer ", "");
        const payload = jwt.verify(
          token,
          process.env.JWT_SECRET || "dev-secret"
        );

        userId = payload.sub || null;
      } catch (err) {
        userId = null;
      }
    }

    /* -------------------------------
       Generate sessionId
    -------------------------------- */
    const sessionId =
      providedSessionId ||
      req.headers["x-session-id"] ||
      crypto.randomUUID();

    /* -------------------------------
       Get AI reply
    -------------------------------- */
    const reply = await getChatbotReply({ message, context });

    /* -------------------------------
       Save log into DB
    -------------------------------- */
    const result = await query(
      `
      INSERT INTO chatbot_logs (user_id, session_id, message, reply)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [userId, sessionId, message, reply]
    );

    return res.json({
      reply,
      sessionId,
      log: result.rows[0],
    });
  } catch (error) {
    console.error("Chatbot message failed:", error);
    return res.status(500).json({ message: "Chatbot failed" });
  }
});

/* -----------------------------------
   GET: Fetch chatbot logs (Admin)
----------------------------------- */
router.get("/logs", async (req, res) => {
  try {
    await ensureChatbotTable();

    const result = await query(`
      SELECT
        cl.id,
        cl.user_id,
        cl.session_id,
        cl.user_message,
        cl.bot_reply,
        cl.created_at,
        u.role as user_role
      FROM chatbot_logs cl
      LEFT JOIN users u ON cl.user_id = u.id
      ORDER BY cl.created_at DESC
    `);

    return res.json({ logs: result.rows });
  } catch (error) {
    console.error("Chatbot logs failed:", error);
    return res.status(500).json({ message: "Unable to fetch logs" });
  }
});

export default router;

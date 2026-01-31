import express from "express";
import { query } from "../db/index.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.get("/me", authenticate, async (req, res) => {
  const result = await query(
    "select s.id, t.title, s.expires_at from subscriptions s join topics t on t.id = s.topic_id where s.user_id = $1",
    [req.user.sub]
  );
  res.json({ subscriptions: result.rows });
});

router.post("/renew", authenticate, async (req, res) => {
  const { subscriptionId, extendDays } = req.body;
  await query(
    "update subscriptions set expires_at = expires_at + ($1 || ' days')::interval where id = $2 and user_id = $3",
    [extendDays || 30, subscriptionId, req.user.sub]
  );
  res.json({ message: "Subscription renewed" });
});

export default router;

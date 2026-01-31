import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { query } from "../db/index.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

router.post("/signup", async (req, res) => {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.flatten() });
  }

  const { name, email, password } = parsed.data;
  const passwordHash = await bcrypt.hash(password, 10);

  const existing = await query("select id from users where email = $1", [email]);
  if (existing.rowCount > 0) {
    return res.status(409).json({ message: "Email already registered" });
  }

  const result = await query(
    "insert into users (name, email, password_hash, role) values ($1, $2, $3, $4) returning id, name, email, role",
    [name, email, passwordHash, "user"]
  );

  return res.status(201).json({
    message: "Account created successfully",
    user: result.rows[0]
  });
});

router.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.flatten() });
  }

  const { email, password } = parsed.data;
  const result = await query("select id, name, email, role, password_hash from users where email = $1", [email]);
  const user = result.rows[0];

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || "dev-secret",
    { expiresIn: "7d" }
  );

  return res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role }
  });
});

router.get("/me", authenticate, async (req, res) => {
  const result = await query(
    "select id, name, email, role, created_at from users where id = $1",
    [req.user.sub]
  );
  const user = result.rows[0];
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  return res.json({ user });
});

router.post("/forgot-password", async (req, res) => {
  return res.json({ message: "Password reset link sent if account exists." });
});

export default router;

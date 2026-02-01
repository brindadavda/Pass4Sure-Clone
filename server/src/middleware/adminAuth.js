import jwt from "jsonwebtoken";
import { query } from "../db/index.js";

const adminAuth = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ message: "Missing authorization header" });
  }

  const token = header.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
    const result = await query("select id, role, email, name from users where id = $1", [payload.sub]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    req.user = { sub: user.id, email: user.email, role: user.role, name: user.name };
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default adminAuth;

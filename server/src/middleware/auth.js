import jwt from "jsonwebtoken";
import { logActivity } from "./activityLogger.js";

export const authenticate = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ message: "Missing authorization header" });
  }
  const token = header.replace("Bearer ", "");
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
    req.user = payload;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const logLogoutActivity = async (req, res, next) => {
  try {
    await logActivity({
      userId: req.user?.sub || null,
      activityType: "logout",
      page: req.originalUrl,
      details: {}
    });
  } catch (error) {
    console.error("Failed to log logout activity", error.message);
  }
  return next();
};

export const authorizeRole = (role) => (req, res, next) => {
  if (!req.user || req.user.role !== role) {
    return res.status(403).json({ message: "Forbidden" });
  }
  return next();
};

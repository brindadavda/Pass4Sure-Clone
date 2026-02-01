import jwt from "jsonwebtoken";
import { query } from "../db/index.js";

const resolveActivityType = (req) => {
  if (req.path.startsWith("/subjects") && req.method === "GET") {
    return "view_subjects";
  }
  if (req.path.includes("/topics") && req.method === "GET" && req.path.includes("/demo-code")) {
    return "demo_code";
  }
  if (req.path.includes("/topics") && req.method === "GET") {
    return "view_topics";
  }
  if (req.path.includes("/questions") && req.method === "GET") {
    return "start_practice";
  }
  return "practice_request";
};

export const logActivity = async ({ userId, activityType, page, details }) => {
  await query(
    "insert into user_activity (user_id, activity_type, page, details) values ($1, $2, $3, $4)",
    [userId, activityType, page, details]
  );
};

const activityLogger = async (req, res, next) => {
  let userId = null;

  const header = req.headers.authorization;
  if (header) {
    const token = header.replace("Bearer ", "");
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
      userId = payload.sub;
      req.user = req.user || payload;
    } catch (error) {
      userId = null;
    }
  }

  try {
    const activityType = resolveActivityType(req);
    await logActivity({
      userId,
      activityType,
      page: req.originalUrl,
      details: {
        method: req.method,
        params: req.params,
        query: req.query
      }
    });
  } catch (error) {
    console.error("Failed to log activity", error.message);
  }

  return next();
};

export default activityLogger;

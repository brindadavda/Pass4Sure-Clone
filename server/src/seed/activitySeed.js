import { query } from "../db/index.js";

const seedActivityTable = async () => {
  await query("ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user'");
  await query(
    `CREATE TABLE IF NOT EXISTS user_activity (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NULL,
      activity_type TEXT NOT NULL,
      page TEXT,
      details JSONB,
      created_at TIMESTAMP DEFAULT now()
    )`
  );
};

export default seedActivityTable;

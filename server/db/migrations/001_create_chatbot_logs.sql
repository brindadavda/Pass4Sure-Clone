CREATE TABLE IF NOT EXISTS chatbot_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  session_id TEXT,
  user_message TEXT NOT NULL,
  bot_reply TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE chatbot_logs ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE chatbot_logs ADD COLUMN IF NOT EXISTS session_id TEXT;
ALTER TABLE chatbot_logs ADD COLUMN IF NOT EXISTS user_message TEXT;
ALTER TABLE chatbot_logs ADD COLUMN IF NOT EXISTS bot_reply TEXT;
ALTER TABLE chatbot_logs ADD COLUMN IF NOT EXISTS message TEXT;
ALTER TABLE chatbot_logs ADD COLUMN IF NOT EXISTS reply TEXT;

DO $$
BEGIN
  ALTER TABLE chatbot_logs
    ADD CONSTRAINT chatbot_logs_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

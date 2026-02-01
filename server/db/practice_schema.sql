-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS pgcrypto;

------------------------------------------------
-- SUBJECTS TABLE
------------------------------------------------
CREATE TABLE IF NOT EXISTS subjects (
  subject_id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT
);

------------------------------------------------
-- TOPICS TABLE
------------------------------------------------
CREATE TABLE IF NOT EXISTS topics (
  topic_id INTEGER PRIMARY KEY,
  subject_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  description TEXT,

  CONSTRAINT fk_subject
    FOREIGN KEY (subject_id)
    REFERENCES subjects(subject_id)
    ON DELETE CASCADE
);

------------------------------------------------
-- ATOMIC TOPICS TABLE
------------------------------------------------
CREATE TABLE IF NOT EXISTS atomic_topics (
  atomic_topic_id INTEGER PRIMARY KEY,
  topic_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  description TEXT,

  CONSTRAINT fk_topic
    FOREIGN KEY (topic_id)
    REFERENCES topics(topic_id)
    ON DELETE CASCADE
);

------------------------------------------------
-- QUESTIONS TABLE (Correct Structure)
------------------------------------------------
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  subject_id INTEGER,
  topic_id INTEGER,

  text TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  difficulty TEXT,

  is_demo BOOLEAN NOT NULL DEFAULT false,

  CONSTRAINT fk_question_subject
    FOREIGN KEY (subject_id)
    REFERENCES subjects(subject_id)
    ON DELETE CASCADE,

  CONSTRAINT fk_question_topic
    FOREIGN KEY (topic_id)
    REFERENCES topics(topic_id)
    ON DELETE CASCADE
);

------------------------------------------------
-- DEMO CODES TABLE
------------------------------------------------
CREATE TABLE IF NOT EXISTS demo_codes (
  topic_id INTEGER PRIMARY KEY,
  demo_code TEXT NOT NULL,

  CONSTRAINT fk_demo_topic
    FOREIGN KEY (topic_id)
    REFERENCES topics(topic_id)
    ON DELETE CASCADE
);

------------------------------------------------
-- USERS ROLE EXTENSION
------------------------------------------------
ALTER TABLE users
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

------------------------------------------------
-- USER ACTIVITY TABLE
------------------------------------------------
CREATE TABLE IF NOT EXISTS user_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NULL,
  activity_type TEXT NOT NULL,
  page TEXT,
  details JSONB,
  created_at TIMESTAMP DEFAULT now()
);


-- Adjust the path to your CSV file
-- \copy <TABLE_NAME> FROM '<CSV FILE PATH>' DELIMITER ',' CSV HEADER;
-- example: \copy temp_questions FROM '/Pass4Sure-Clone-main/questions.csv' DELIMITER ',' CSV HEADER;

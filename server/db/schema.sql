create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique not null,
  password_hash text not null,
  role text not null default 'user',
  created_at timestamptz not null default now()
);

create table if not exists exams (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  price numeric(10,2) not null,
  validity_days integer not null,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists questions (
  id uuid primary key default gen_random_uuid(),
  exam_id uuid references exams(id) on delete cascade,
  text text not null,
  options jsonb not null,
  correct_answer text not null,
  explanation text,
  difficulty text,
  is_demo boolean not null default false
);

create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  exam_id uuid references exams(id) on delete cascade,
  expires_at timestamptz not null
);

create table if not exists user_responses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  question_id uuid references questions(id) on delete cascade,
  user_answer text,
  is_correct boolean,
  created_at timestamptz not null default now()
);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  amount numeric(10,2) not null,
  status text not null,
  payment_method text,
  created_at timestamptz not null default now()
);

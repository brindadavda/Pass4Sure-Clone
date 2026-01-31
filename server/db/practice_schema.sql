create table if not exists subjects (
  subject_id integer primary key,
  name text not null,
  description text
);

create table if not exists topics (
  topic_id integer primary key,
  subject_id integer not null references subjects(subject_id) on delete cascade,
  name text not null,
  description text
);

create table if not exists atomic_topics (
  atomic_topic_id integer primary key,
  topic_id integer not null references topics(topic_id) on delete cascade,
  name text not null,
  description text
);

create table if not exists questions (
  question_id text primary key,
  subject_id integer not null references subjects(subject_id) on delete cascade,
  topic_id integer not null references topics(topic_id) on delete cascade,
  atomic_topic_id integer references atomic_topics(atomic_topic_id) on delete set null,
  question text not null,
  a text not null,
  b text not null,
  c text not null,
  answer text not null,
  solution text,
  difficulty text,
  question_type text,
  mock text,
  session text
);

create table if not exists demo_codes (
  topic_id integer primary key references topics(topic_id) on delete cascade,
  demo_code text not null
);

insert into subjects (subject_id, name, description) values
  (4, 'NCFM Financial Markets', 'Placeholder description for NCFM Financial Markets.'),
  (5, 'NISM Capital Market', 'Placeholder description for NISM Capital Market.')
on conflict (subject_id) do nothing;

insert into topics (topic_id, subject_id, name, description) values
  (20, 4, 'Ethics and Standards', 'Placeholder topic description for Ethics and Standards.'),
  (21, 4, 'Market Fundamentals', 'Placeholder topic description for Market Fundamentals.'),
  (30, 5, 'Capital Market Basics', 'Placeholder topic description for Capital Market Basics.')
on conflict (topic_id) do nothing;

insert into atomic_topics (atomic_topic_id, topic_id, name, description) values
  (22, 20, 'Code of Ethics', 'Placeholder atomic topic description.')
on conflict (atomic_topic_id) do nothing;

insert into demo_codes (topic_id, demo_code) values
  (20, '5565')
on conflict (topic_id) do update set demo_code = excluded.demo_code;

insert into questions (
  question_id,
  subject_id,
  topic_id,
  atomic_topic_id,
  question,
  a,
  b,
  c,
  answer,
  solution,
  difficulty,
  question_type,
  mock,
  session
) values (
  'Q1',
  4,
  20,
  22,
  'Which of the following statements about a code of ethics is most accurate?',
  'does not need to include standards of conduct.',
  'must include principles-based standards of conduct.',
  'must include rules-based standards of conduct.',
  'B',
  'The Answer is B. Code of ethics must include principles-based standards of conduct.',
  'Easy',
  'Conceptual',
  'A',
  '1'
)
on conflict (question_id) do nothing;

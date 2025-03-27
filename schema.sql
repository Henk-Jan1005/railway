CREATE TABLE IF NOT EXISTS scoreboards (
  id SERIAL PRIMARY KEY,
  group_id TEXT UNIQUE NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS challenges (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  completed_by TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
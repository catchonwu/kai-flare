-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  lop_character TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

-- Thoughts table  
CREATE TABLE IF NOT EXISTS thoughts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  content TEXT NOT NULL,
  sentiment TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users (id)
);

-- Whispers table
CREATE TABLE IF NOT EXISTS whispers (
  id TEXT PRIMARY KEY,
  to_user_id TEXT NOT NULL,
  message TEXT NOT NULL,
  sentiment_match TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (to_user_id) REFERENCES users (id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_thoughts_user_id ON thoughts(user_id);
CREATE INDEX IF NOT EXISTS idx_thoughts_sentiment ON thoughts(sentiment);
CREATE INDEX IF NOT EXISTS idx_whispers_to_user_id ON whispers(to_user_id);
CREATE INDEX IF NOT EXISTS idx_whispers_is_read ON whispers(is_read);
CREATE TABLE user_history (
  user_history_id UUID NOT NULL,
  user_id UUID NOT NULL,
  game_id UUID NOT NULL,
  score INTEGER,
  win BOOLEAN,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE profile_pictures (
  profile_pictures_id SERIAL PRIMARY KEY,
  url VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE profile_pictures (
  profile_pictures_id UUID NOT NULL,
  url VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

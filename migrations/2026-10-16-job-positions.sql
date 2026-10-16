ALTER TABLE jobs
ADD COLUMN IF NOT EXISTS positions jsonb NOT NULL DEFAULT '[]'::jsonb;

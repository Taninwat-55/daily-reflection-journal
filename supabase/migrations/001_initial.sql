-- Journal entries table
CREATE TABLE entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  content_json JSONB,
  mood SMALLINT CHECK (mood >= 1 AND mood <= 5),
  tags TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  template TEXT CHECK (template IN ('morning', 'evening', 'freeform')) DEFAULT 'freeform',
  word_count INTEGER DEFAULT 0,
  entry_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own entries"
  ON entries FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER entries_updated_at
  BEFORE UPDATE ON entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Indexes
CREATE INDEX entries_date_idx ON entries (user_id, entry_date DESC);
CREATE INDEX entries_tags_idx ON entries USING GIN (tags);

-- Storage bucket for journal images (public bucket, auth enforced at path level)
INSERT INTO storage.buckets (id, name, public)
VALUES ('journal-images', 'journal-images', true)
ON CONFLICT (id) DO NOTHING;

-- Only authenticated users can upload to their own folder
CREATE POLICY "Users upload own images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'journal-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users delete own images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'journal-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Migration: 002_short_urls.sql
-- Creates a persistent short URL table to replace in-memory storage

CREATE TABLE IF NOT EXISTS short_urls (
  id SERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  long_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast code lookups
CREATE INDEX IF NOT EXISTS idx_short_urls_code ON short_urls(code);

-- Index to find existing URLs (deduplication)
CREATE INDEX IF NOT EXISTS idx_short_urls_long_url ON short_urls(long_url);

-- RLS Policies
ALTER TABLE short_urls ENABLE ROW LEVEL SECURITY;

-- Anyone can read short URLs (they're public redirects)
CREATE POLICY "Short URLs are publicly readable"
  ON short_urls FOR SELECT
  USING (true);

-- Anyone can create short URLs (anonymous usage)
CREATE POLICY "Anyone can create short URLs"
  ON short_urls FOR INSERT
  WITH CHECK (true);

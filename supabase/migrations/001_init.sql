-- Migration: 001_init.sql
-- Creates the core tables for වෙසක් ප්‍රභා

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Templates table
CREATE TABLE IF NOT EXISTS templates (
  id SERIAL PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_si TEXT NOT NULL,
  bg_url TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  text_color TEXT NOT NULL DEFAULT '#FFFBF0',
  accent_color TEXT NOT NULL DEFAULT '#F59E0B',
  text_position TEXT NOT NULL DEFAULT 'center' CHECK (text_position IN ('center', 'top', 'bottom')),
  animated BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Cards table
CREATE TABLE IF NOT EXISTS cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  template_id INTEGER REFERENCES templates(id),
  language TEXT NOT NULL CHECK (language IN ('si', 'en')),
  sender TEXT NOT NULL CHECK (char_length(sender) <= 80),
  recipient TEXT NOT NULL CHECK (char_length(recipient) <= 80),
  message TEXT CHECK (char_length(message) <= 300),
  image_url TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  share_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_cards_slug ON cards(slug);
CREATE INDEX IF NOT EXISTS idx_cards_user_id ON cards(user_id);
CREATE INDEX IF NOT EXISTS idx_cards_created_at ON cards(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cards_template_id ON cards(template_id);

-- RLS Policies
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- Anyone can read cards (they're shared via public URLs)
CREATE POLICY "Cards are publicly readable"
  ON cards FOR SELECT
  USING (true);

-- Anyone can insert cards (anonymous card creation)
CREATE POLICY "Anyone can create cards"
  ON cards FOR INSERT
  WITH CHECK (true);

-- Users can update only their own cards
CREATE POLICY "Users can update own cards"
  ON cards FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete only their own cards
CREATE POLICY "Users can delete own cards"
  ON cards FOR DELETE
  USING (auth.uid() = user_id);

-- Templates are publicly readable
CREATE POLICY "Templates are publicly readable"
  ON templates FOR SELECT
  USING (true);

-- Only admins can modify templates (via service role key)

-- Seed template data
INSERT INTO templates (name_en, name_si, bg_url, thumbnail_url, text_color, accent_color, text_position, animated) VALUES
  ('Golden Lotus', 'රන් නෙළුම', '/templates/t01-golden-lotus.png', '/templates/t01-golden-lotus.png', '#FFFBF0', '#F59E0B', 'center', false),
  ('Vesak Lantern', 'වෙසක් කූඩුව', '/templates/t02-vesak-lantern.png', '/templates/t02-vesak-lantern.png', '#FFFBF0', '#FCD34D', 'center', true),
  ('Bodhi Tree', 'බෝ ගස', '/templates/t03-bodhi-tree.png', '/templates/t03-bodhi-tree.png', '#FFFBF0', '#34D399', 'bottom', false),
  ('Night Pandal', 'රාත්‍රී තෝරණය', '/templates/t04-night-pandal.png', '/templates/t04-night-pandal.png', '#FFFBF0', '#F59E0B', 'center', false),
  ('White Dagoba', 'සුදු දාගැබ', '/templates/t05-white-dagoba.png', '/templates/t05-white-dagoba.png', '#1F2937', '#F59E0B', 'center', false),
  ('Mandala of Light', 'ආලෝක මංඩලය', '/templates/t06-mandala-light.png', '/templates/t06-mandala-light.png', '#FFFBF0', '#F59E0B', 'center', false),
  ('Dansal & Dana', 'දානසාල', '/templates/t07-dansal.png', '/templates/t07-dansal.png', '#FFFBF0', '#FCD34D', 'center', false),
  ('Sacred Art', 'බුද්ධ පාද', '/templates/t08-buddha-footprint.png', '/templates/t08-buddha-footprint.png', '#FFFBF0', '#F59E0B', 'center', false);

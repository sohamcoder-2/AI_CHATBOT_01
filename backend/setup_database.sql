-- Mental Health Chatbot Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Create chat_sessions table
CREATE TABLE IF NOT EXISTS chat_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  last_active_at timestamptz DEFAULT now(),
  user_ip text DEFAULT ''
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES chat_sessions(id) ON DELETE CASCADE,
  message_type text NOT NULL CHECK (message_type IN ('user', 'bot')),
  message_text text NOT NULL,
  detected_mood text DEFAULT 'neutral',
  confidence_score numeric DEFAULT 0.0 CHECK (confidence_score >= 0 AND confidence_score <= 1),
  created_at timestamptz DEFAULT now()
);

-- Create mood_analytics table
CREATE TABLE IF NOT EXISTS mood_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES chat_sessions(id) ON DELETE CASCADE,
  mood text NOT NULL,
  count integer DEFAULT 1,
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_mood_analytics_session_id ON mood_analytics(session_id);
CREATE INDEX IF NOT EXISTS idx_sessions_last_active ON chat_sessions(last_active_at);

-- Enable Row Level Security
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Allow public access for anonymous mental health support
DROP POLICY IF EXISTS "Allow public insert on chat_sessions" ON chat_sessions;
CREATE POLICY "Allow public insert on chat_sessions"
  ON chat_sessions FOR INSERT
  TO anon
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read own session" ON chat_sessions;
CREATE POLICY "Allow public read own session"
  ON chat_sessions FOR SELECT
  TO anon
  USING (true);

DROP POLICY IF EXISTS "Allow public update own session" ON chat_sessions;
CREATE POLICY "Allow public update own session"
  ON chat_sessions FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public insert on chat_messages" ON chat_messages;
CREATE POLICY "Allow public insert on chat_messages"
  ON chat_messages FOR INSERT
  TO anon
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read chat_messages" ON chat_messages;
CREATE POLICY "Allow public read chat_messages"
  ON chat_messages FOR SELECT
  TO anon
  USING (true);

DROP POLICY IF EXISTS "Allow public insert on mood_analytics" ON mood_analytics;
CREATE POLICY "Allow public insert on mood_analytics"
  ON mood_analytics FOR INSERT
  TO anon
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read mood_analytics" ON mood_analytics;
CREATE POLICY "Allow public read mood_analytics"
  ON mood_analytics FOR SELECT
  TO anon
  USING (true);

DROP POLICY IF EXISTS "Allow public update mood_analytics" ON mood_analytics;
CREATE POLICY "Allow public update mood_analytics"
  ON mood_analytics FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);
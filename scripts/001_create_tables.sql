-- PlayWin Database Schema
-- Create scores table
CREATE TABLE IF NOT EXISTS public.scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  score INT NOT NULL CHECK (score >= 1 AND score <= 45),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create charities table
CREATE TABLE IF NOT EXISTS public.charities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT
);

-- Create user_charity table
CREATE TABLE IF NOT EXISTS public.user_charity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  charity_id UUID NOT NULL REFERENCES public.charities(id) ON DELETE CASCADE,
  percentage INT NOT NULL DEFAULT 10 CHECK (percentage >= 0 AND percentage <= 100),
  UNIQUE(user_id)
);

-- Enable RLS on all tables
ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.charities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_charity ENABLE ROW LEVEL SECURITY;

-- Scores policies
CREATE POLICY "Users can view their own scores" ON public.scores
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own scores" ON public.scores
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own scores" ON public.scores
  FOR DELETE USING (auth.uid() = user_id);

-- Charities policies (everyone can view)
CREATE POLICY "Everyone can view charities" ON public.charities
  FOR SELECT USING (true);

-- User charity policies
CREATE POLICY "Users can view their own charity selection" ON public.user_charity
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own charity selection" ON public.user_charity
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own charity selection" ON public.user_charity
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own charity selection" ON public.user_charity
  FOR DELETE USING (auth.uid() = user_id);

-- Insert sample charities
INSERT INTO public.charities (name, description) VALUES
  ('Red Cross', 'Humanitarian organization providing emergency assistance'),
  ('UNICEF', 'Working for children''s rights and wellbeing worldwide'),
  ('Doctors Without Borders', 'Medical humanitarian organization'),
  ('World Wildlife Fund', 'Conservation organization protecting wildlife'),
  ('Habitat for Humanity', 'Building homes and communities');

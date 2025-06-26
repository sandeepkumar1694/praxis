/*
  # AI Task Generation System Schema

  1. New Tables
    - `daily_tasks`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `level` (enum: basic, intermediate, pro)
      - `time_limit_minutes` (integer)
      - `expected_output_format` (jsonb)
      - `test_cases` (jsonb)
      - `generated_by_ai` (boolean, default true)
      - `company_context` (text)
      - `created_at` (timestamptz)
      - `expires_at` (timestamptz)

    - `user_submissions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `task_id` (uuid, references daily_tasks)
      - `chosen_at` (timestamptz)
      - `submitted_at` (timestamptz)
      - `submission_code` (text)
      - `status` (enum)
      - `score` (integer)
      - `ai_feedback` (jsonb)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add appropriate policies for user access
    - Ensure users can only access their own submissions

  3. Indexes
    - Add indexes for performance optimization
*/

-- Create custom types
CREATE TYPE task_level AS ENUM ('basic', 'intermediate', 'pro');
CREATE TYPE submission_status AS ENUM ('chosen', 'in_progress', 'submitted', 'scoring', 'scored', 'expired', 'error');

-- Create daily_tasks table
CREATE TABLE IF NOT EXISTS public.daily_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  level task_level NOT NULL,
  time_limit_minutes integer NOT NULL,
  expected_output_format jsonb,
  test_cases jsonb,
  generated_by_ai boolean DEFAULT true,
  company_context text,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz NOT NULL
);

-- Create user_submissions table
CREATE TABLE IF NOT EXISTS public.user_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  task_id uuid REFERENCES public.daily_tasks(id) ON DELETE CASCADE NOT NULL,
  chosen_at timestamptz DEFAULT now(),
  submitted_at timestamptz,
  submission_code text,
  status submission_status DEFAULT 'chosen',
  score integer CHECK (score >= 0 AND score <= 100),
  ai_feedback jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.daily_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_submissions ENABLE ROW LEVEL SECURITY;

-- Policies for daily_tasks (public read access for authenticated users)
CREATE POLICY "Authenticated users can read active tasks"
  ON public.daily_tasks
  FOR SELECT
  TO authenticated
  USING (expires_at > now());

-- Policies for user_submissions (users can only access their own submissions)
CREATE POLICY "Users can read own submissions"
  ON public.user_submissions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own submissions"
  ON public.user_submissions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own submissions"
  ON public.user_submissions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_daily_tasks_expires_at ON public.daily_tasks(expires_at);
CREATE INDEX IF NOT EXISTS idx_daily_tasks_created_at ON public.daily_tasks(created_at);
CREATE INDEX IF NOT EXISTS idx_user_submissions_user_id ON public.user_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_submissions_task_id ON public.user_submissions(task_id);
CREATE INDEX IF NOT EXISTS idx_user_submissions_status ON public.user_submissions(status);
CREATE INDEX IF NOT EXISTS idx_user_submissions_created_at ON public.user_submissions(created_at);

-- Create unique constraint to prevent duplicate submissions per user per day
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_submissions_one_per_user_per_day 
  ON public.user_submissions(user_id, DATE(created_at));

-- Create trigger for updated_at
CREATE TRIGGER update_user_submissions_updated_at
    BEFORE UPDATE ON public.user_submissions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
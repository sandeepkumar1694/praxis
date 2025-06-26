/*
  # Daily Tasks and User Submissions Schema

  1. New Tables
    - `daily_tasks`
      - `id` (uuid, primary key)
      - `title` (text, not null)
      - `description` (text, not null)
      - `level` (enum: basic, intermediate, pro)
      - `time_limit_minutes` (integer, not null)
      - `expected_output_format` (jsonb)
      - `test_cases` (jsonb)
      - `generated_by_ai` (boolean, default true)
      - `company_context` (text)
      - `created_at` (timestamptz, default now)
      - `expires_at` (timestamptz, not null)

    - `user_submissions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `task_id` (uuid, foreign key to daily_tasks)
      - `chosen_at` (timestamptz, default now)
      - `submitted_at` (timestamptz)
      - `submission_code` (text)
      - `status` (enum: chosen, in_progress, submitted, scoring, scored, expired, error)
      - `score` (integer, 0-100)
      - `ai_feedback` (jsonb)
      - `created_at` (timestamptz, default now)
      - `updated_at` (timestamptz, default now)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to read tasks and manage their submissions
    - Unique constraint to prevent duplicate active submissions per user per task

  3. Indexes
    - Performance indexes for common queries
    - Composite indexes for user+task combinations
*/

-- Create custom types using DO block to avoid IF NOT EXISTS syntax error
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'task_level') THEN
        CREATE TYPE task_level AS ENUM ('basic', 'intermediate', 'pro');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'submission_status') THEN
        CREATE TYPE submission_status AS ENUM ('chosen', 'in_progress', 'submitted', 'scoring', 'scored', 'expired', 'error');
    END IF;
END $$;

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
CREATE INDEX IF NOT EXISTS idx_daily_tasks_level ON public.daily_tasks(level);
CREATE INDEX IF NOT EXISTS idx_user_submissions_user_id ON public.user_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_submissions_task_id ON public.user_submissions(task_id);
CREATE INDEX IF NOT EXISTS idx_user_submissions_status ON public.user_submissions(status);
CREATE INDEX IF NOT EXISTS idx_user_submissions_created_at ON public.user_submissions(created_at);

-- Create composite index for user + task combination
CREATE INDEX IF NOT EXISTS idx_user_submissions_user_task ON public.user_submissions(user_id, task_id);

-- Create unique constraint to prevent duplicate active submissions per user per task
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_submissions_unique_active_task
  ON public.user_submissions(user_id, task_id)
  WHERE status IN ('chosen', 'in_progress', 'submitted', 'scoring');

-- Create trigger for updated_at (using existing function from profiles migration)
CREATE TRIGGER update_user_submissions_updated_at
    BEFORE UPDATE ON public.user_submissions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
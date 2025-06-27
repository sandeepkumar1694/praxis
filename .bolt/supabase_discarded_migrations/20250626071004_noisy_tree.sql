/*
  # AI Task Generation System

  1. New Tables
    - `daily_tasks`
      - Stores AI-generated coding challenges
      - Includes task details, difficulty levels, time limits
      - Has expiration dates for daily rotation
    - `user_submissions`
      - Tracks user task selections and submissions
      - Stores submitted code and AI evaluations
      - Links users to their chosen tasks

  2. Security
    - Enable RLS on both tables
    - Users can read active tasks
    - Users can only access their own submissions

  3. Constraints and Indexes
    - Performance indexes for common queries
    - Business logic constraints
    - Foreign key relationships
*/

-- Create custom types
CREATE TYPE IF NOT EXISTS task_level AS ENUM ('basic', 'intermediate', 'pro');
CREATE TYPE IF NOT EXISTS submission_status AS ENUM ('chosen', 'in_progress', 'submitted', 'scoring', 'scored', 'expired', 'error');

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
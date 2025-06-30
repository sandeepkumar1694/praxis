/*
  # Weekly Tasks and User Performance Schema

  1. New Tables
    - `weekly_challenges`
      - `id` (uuid, primary key)
      - `title` (text, not null)
      - `description` (text, not null)
      - `difficulty` (enum: easy, medium, hard)
      - `points` (integer, not null)
      - `requirements` (jsonb)
      - `start_date` (timestamptz, not null)
      - `end_date` (timestamptz, not null)
      - `created_at` (timestamptz, default now)

    - `user_weekly_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `challenge_id` (uuid, foreign key to weekly_challenges)
      - `progress` (integer, default 0)
      - `completed` (boolean, default false)
      - `completed_at` (timestamptz)
      - `created_at` (timestamptz, default now)
      - `updated_at` (timestamptz, default now)

    - `user_achievements`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `achievement_id` (text, not null)
      - `unlocked_at` (timestamptz, default now)
      - `progress` (integer, default 0)
      - `metadata` (jsonb)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data

  3. Indexes
    - Performance indexes for common queries
*/

-- Create custom types
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'challenge_difficulty') THEN
        CREATE TYPE challenge_difficulty AS ENUM ('easy', 'medium', 'hard');
    END IF;
END $$;

-- Create weekly_challenges table
CREATE TABLE IF NOT EXISTS public.weekly_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  difficulty challenge_difficulty NOT NULL,
  points integer NOT NULL,
  requirements jsonb,
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create user_weekly_progress table
CREATE TABLE IF NOT EXISTS public.user_weekly_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  challenge_id uuid REFERENCES public.weekly_challenges(id) ON DELETE CASCADE NOT NULL,
  progress integer DEFAULT 0,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, challenge_id)
);

-- Create user_achievements table
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  achievement_id text NOT NULL,
  unlocked_at timestamptz DEFAULT now(),
  progress integer DEFAULT 0,
  metadata jsonb,
  UNIQUE(user_id, achievement_id)
);

-- Enable Row Level Security
ALTER TABLE public.weekly_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_weekly_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- Policies for weekly_challenges (public read access for authenticated users)
CREATE POLICY "Authenticated users can read weekly challenges"
  ON public.weekly_challenges
  FOR SELECT
  TO authenticated
  USING (end_date > now());

-- Policies for user_weekly_progress (users can only access their own progress)
CREATE POLICY "Users can read own weekly progress"
  ON public.user_weekly_progress
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own weekly progress"
  ON public.user_weekly_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own weekly progress"
  ON public.user_weekly_progress
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for user_achievements (users can only access their own achievements)
CREATE POLICY "Users can read own achievements"
  ON public.user_achievements
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements"
  ON public.user_achievements
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_weekly_challenges_dates ON public.weekly_challenges(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_user_weekly_progress_user_id ON public.user_weekly_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_weekly_progress_challenge_id ON public.user_weekly_progress(challenge_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON public.user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_achievement_id ON public.user_achievements(achievement_id);

-- Create trigger for updated_at on user_weekly_progress
CREATE TRIGGER update_user_weekly_progress_updated_at
    BEFORE UPDATE ON public.user_weekly_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add completed_by metadata to user_submissions for better tracking
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_submissions' AND column_name = 'completed_by'
    ) THEN
        ALTER TABLE public.user_submissions 
        ADD COLUMN completed_by uuid REFERENCES auth.users(id);
    END IF;
END $$;

-- Update existing completed submissions to have completed_by set
UPDATE public.user_submissions 
SET completed_by = user_id 
WHERE status = 'scored' AND completed_by IS NULL;

-- Create index for completed_by
CREATE INDEX IF NOT EXISTS idx_user_submissions_completed_by ON public.user_submissions(completed_by) WHERE completed_by IS NOT NULL;
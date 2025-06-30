/*
  # Fix Profile Creation Issues

  1. Updates
    - Improve the handle_new_user function to be more robust
    - Add better error handling for profile creation
    - Ensure profiles are created even if user metadata is missing

  2. Security
    - Keep existing RLS policies
    - Maintain data integrity
*/

-- Update the handle_new_user function to be more robust
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert profile with better error handling
  INSERT INTO public.profiles (id, full_name, avatar_url, onboarding_complete)
  VALUES (
    NEW.id,
    COALESCE(
      NULLIF(TRIM(NEW.raw_user_meta_data->>'full_name'), ''),
      NULLIF(TRIM(NEW.raw_user_meta_data->>'name'), ''),
      SPLIT_PART(NEW.email, '@', 1)
    ),
    NULLIF(TRIM(NEW.raw_user_meta_data->>'avatar_url'), ''),
    false
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = COALESCE(
      EXCLUDED.full_name,
      profiles.full_name,
      SPLIT_PART(NEW.email, '@', 1)
    ),
    avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url),
    updated_at = now();
    
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the user creation
    RAISE WARNING 'Failed to create/update profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
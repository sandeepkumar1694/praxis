import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Get current week's challenges
    const now = new Date();
    const { data: challenges, error: challengesError } = await supabase
      .from('weekly_challenges')
      .select('*')
      .lte('start_date', now.toISOString())
      .gte('end_date', now.toISOString())
      .order('created_at', { ascending: false });

    if (challengesError) {
      throw new Error(`Failed to fetch challenges: ${challengesError.message}`);
    }

    // Get user's progress for these challenges
    const { data: progress, error: progressError } = await supabase
      .from('user_weekly_progress')
      .select('*')
      .eq('user_id', user.id)
      .in('challenge_id', challenges?.map(c => c.id) || []);

    if (progressError && progressError.code !== 'PGRST116') {
      throw new Error(`Failed to fetch progress: ${progressError.message}`);
    }

    // Combine challenges with user progress
    const challengesWithProgress = challenges?.map(challenge => {
      const userProgress = progress?.find(p => p.challenge_id === challenge.id);
      return {
        ...challenge,
        progress: userProgress?.progress || 0,
        completed: userProgress?.completed || false,
        completed_at: userProgress?.completed_at
      };
    }) || [];

    return new Response(
      JSON.stringify({
        challenges: challengesWithProgress
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in get-weekly-challenges:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch weekly challenges',
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
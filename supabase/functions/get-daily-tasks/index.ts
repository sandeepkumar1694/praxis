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

    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

    // Fetch active tasks for today
    const { data: tasks, error: tasksError } = await supabase
      .from('daily_tasks')
      .select('*')
      .gte('expires_at', new Date().toISOString())
      .gte('created_at', todayStart.toISOString())
      .lt('created_at', todayEnd.toISOString())
      .order('level', { ascending: true });

    if (tasksError) {
      throw new Error(`Failed to fetch tasks: ${tasksError.message}`);
    }

    // Check if user has any submission for today
    const { data: userSubmission, error: submissionError } = await supabase
      .from('user_submissions')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', todayStart.toISOString())
      .lt('created_at', todayEnd.toISOString())
      .single();

    // submissionError is expected if no submission exists
    const submission = submissionError ? null : userSubmission;

    // If no tasks exist, try to generate them
    if (!tasks || tasks.length === 0) {
      // Call generate-daily-tasks function
      const generateResponse = await fetch(
        `${Deno.env.get('SUPABASE_URL')}/functions/v1/generate-daily-tasks`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (generateResponse.ok) {
        const generateData = await generateResponse.json();
        return new Response(
          JSON.stringify({
            tasks: generateData.tasks || [],
            userSubmission: submission,
            message: 'Generated new tasks for today'
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
    }

    return new Response(
      JSON.stringify({
        tasks: tasks || [],
        userSubmission: submission
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in get-daily-tasks:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch daily tasks',
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
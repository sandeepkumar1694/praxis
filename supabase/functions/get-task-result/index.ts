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

  if (req.method !== "GET") {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
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

    // Get submission ID from URL
    const url = new URL(req.url);
    const submissionId = url.searchParams.get('submissionId');
    
    if (!submissionId) {
      return new Response(
        JSON.stringify({ error: 'Submission ID is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Fetch submission with task details
    const { data: submission, error: submissionError } = await supabase
      .from('user_submissions')
      .select(`
        *,
        daily_tasks (
          id,
          title,
          description,
          level,
          time_limit_minutes,
          company_context
        )
      `)
      .eq('id', submissionId)
      .eq('user_id', user.id)
      .single();

    if (submissionError || !submission) {
      return new Response(
        JSON.stringify({ error: 'Submission not found or access denied' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Check if submission has been scored
    if (submission.status !== 'scored') {
      return new Response(
        JSON.stringify({ 
          error: 'Submission not yet scored',
          status: submission.status
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({
        submission: {
          id: submission.id,
          task_id: submission.task_id,
          chosen_at: submission.chosen_at,
          submitted_at: submission.submitted_at,
          submission_code: submission.submission_code,
          status: submission.status,
          score: submission.score,
          ai_feedback: submission.ai_feedback
        },
        task: submission.daily_tasks
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in get-task-result:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch task result',
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
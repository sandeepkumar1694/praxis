import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface ChooseTaskRequest {
  taskId: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  if (req.method !== "POST") {
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

    // Parse request body
    const { taskId }: ChooseTaskRequest = await req.json();
    
    if (!taskId) {
      return new Response(
        JSON.stringify({ error: 'Task ID is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

    // Check if user already has a submission for today
    const { data: existingSubmission, error: checkError } = await supabase
      .from('user_submissions')
      .select('id')
      .eq('user_id', user.id)
      .gte('created_at', todayStart.toISOString())
      .lt('created_at', todayEnd.toISOString())
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows found
      throw new Error(`Failed to check existing submissions: ${checkError.message}`);
    }

    if (existingSubmission) {
      return new Response(
        JSON.stringify({ error: 'You have already chosen a task for today' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Verify the task exists and is active
    const { data: task, error: taskError } = await supabase
      .from('daily_tasks')
      .select('id, expires_at')
      .eq('id', taskId)
      .single();

    if (taskError || !task) {
      return new Response(
        JSON.stringify({ error: 'Task not found' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Check if task is still active
    if (new Date(task.expires_at) <= new Date()) {
      return new Response(
        JSON.stringify({ error: 'Task has expired' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Create the submission
    const { data: submission, error: submitError } = await supabase
      .from('user_submissions')
      .insert({
        user_id: user.id,
        task_id: taskId,
        status: 'chosen'
      })
      .select()
      .single();

    if (submitError) {
      throw new Error(`Failed to create submission: ${submitError.message}`);
    }

    return new Response(
      JSON.stringify({ 
        submission,
        message: 'Task chosen successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in choose-task:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to choose task',
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
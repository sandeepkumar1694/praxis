import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface CreateSessionRequest {
  replica_id?: string;
  persona_id?: string;
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
    const { replica_id, persona_id }: CreateSessionRequest = await req.json();

    const tavusApiKey = Deno.env.get('TAVUS_API_KEY');
    if (!tavusApiKey) {
      return new Response(
        JSON.stringify({ error: 'Tavus API key not configured' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Create session with Tavus API
    const tavusResponse = await fetch('https://tavusapi.com/v2/conversations', {
      method: 'POST',
      headers: {
        'x-api-key': tavusApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        replica_id: replica_id || Deno.env.get('TAVUS_REPLICA_ID'),
        persona_id: persona_id || Deno.env.get('TAVUS_PERSONA_ID'),
        callback_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/tavus-webhook`,
        conversation_name: `Interview Session - ${user.email}`,
        conversational_context: "You are an AI interviewer conducting a professional technical interview. Be engaging, ask thoughtful questions, and provide helpful feedback.",
      }),
    });

    if (!tavusResponse.ok) {
      const errorData = await tavusResponse.json().catch(() => ({}));
      throw new Error(errorData.error || `Tavus API error: ${tavusResponse.status}`);
    }

    const sessionData = await tavusResponse.json();

    // Return session information
    const session = {
      session_id: sessionData.conversation_id,
      session_url: sessionData.conversation_url,
      status: 'initializing',
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
    };

    return new Response(
      JSON.stringify(session),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in tavus-create-session:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to create Tavus session',
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
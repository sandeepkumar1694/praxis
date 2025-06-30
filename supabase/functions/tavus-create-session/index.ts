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

    const replicaId = replica_id || Deno.env.get('TAVUS_REPLICA_ID') || 'r9d30b0e55ac';
    const personaIdToUse = persona_id || Deno.env.get('TAVUS_PERSONA_ID');

    // Create session with Tavus API
    const requestBody: any = {
      replica_id: replicaId,
      conversation_name: `Full Stack Technical Interview - ${user.email?.split('@')[0] || 'User'}`,
      callback_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/tavus-webhook`,
      properties: {
        max_call_duration: 3600,
        participant_left_timeout: 60,
        participant_absent_timeout: 300,
        enable_recording: false,
        enable_transcription: true,
      }
    };

    // Add persona_id if available
    if (personaIdToUse) {
      requestBody.persona_id = personaIdToUse;
    }

    console.log('Creating Tavus conversation with:', JSON.stringify(requestBody));

    const tavusResponse = await fetch('https://tavusapi.com/v2/conversations', {
      method: 'POST',
      headers: {
        'x-api-key': tavusApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!tavusResponse.ok) {
      const errorText = await tavusResponse.text();
      console.error('Tavus API error response:', errorText);
      
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: errorText };
      }
      
      throw new Error(errorData.error || `Tavus API error: ${tavusResponse.status}`);
    }

    const sessionData = await tavusResponse.json();
    console.log('Tavus conversation created:', JSON.stringify(sessionData));

    // Return session information in our expected format
    const session = {
      session_id: sessionData.conversation_id,
      session_url: sessionData.conversation_url,
      status: sessionData.status || 'initializing',
      created_at: sessionData.created_at || new Date().toISOString(),
      expires_at: sessionData.expires_at || new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
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
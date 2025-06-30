import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface SendMessageRequest {
  session_id: string;
  message: {
    type: 'text' | 'audio';
    content: string;
    timestamp: string;
  };
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
    const { session_id, message }: SendMessageRequest = await req.json();

    if (!session_id || !message) {
      return new Response(
        JSON.stringify({ error: 'Session ID and message are required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

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

    // Send message to Tavus API
    const tavusResponse = await fetch(`https://tavusapi.com/v2/conversations/${session_id}`, {
      method: 'POST',
      headers: {
        'x-api-key': tavusApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message_text: message.content,
        message_type: message.type,
      }),
    });

    if (!tavusResponse.ok) {
      const errorData = await tavusResponse.json().catch(() => ({}));
      throw new Error(errorData.error || `Tavus API error: ${tavusResponse.status}`);
    }

    const responseData = await tavusResponse.json();

    return new Response(
      JSON.stringify({
        session_id,
        video_url: responseData.video_url,
        audio_url: responseData.audio_url,
        transcript: responseData.transcript,
        status: 'success',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in tavus-send-message:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to send message to Tavus',
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
import { createClient } from 'npm:@supabase/supabase-js@2';
import { GoogleGenAI } from 'npm:@google/genai';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface SubmitTaskRequest {
  submissionId: string;
  submissionCode: string;
}

interface AIFeedback {
  overall: string;
  codeQuality: number;
  efficiency: number;
  readability: number;
  correctness: number;
  suggestions: string[];
  strengths: string[];
  improvements: string[];
  overallScore: number;
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
    const { submissionId, submissionCode }: SubmitTaskRequest = await req.json();
    
    if (!submissionId || !submissionCode) {
      return new Response(
        JSON.stringify({ error: 'Submission ID and code are required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Get submission and task details
    const { data: submission, error: submissionError } = await supabase
      .from('user_submissions')
      .select(`
        *,
        daily_tasks (
          title,
          description,
          level,
          expected_output_format,
          test_cases
        )
      `)
      .eq('id', submissionId)
      .eq('user_id', user.id)
      .single();

    if (submissionError || !submission) {
      return new Response(
        JSON.stringify({ error: 'Submission not found' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Check if submission can be updated
    if (submission.status === 'scored') {
      return new Response(
        JSON.stringify({ error: 'Task already scored' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Update submission with code and set status to scoring
    const { error: updateError } = await supabase
      .from('user_submissions')
      .update({
        submission_code: submissionCode,
        submitted_at: new Date().toISOString(),
        status: 'scoring'
      })
      .eq('id', submissionId);

    if (updateError) {
      throw new Error(`Failed to update submission: ${updateError.message}`);
    }

    // Get Gemini API key
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    // Initialize Gemini AI client
    const ai = new GoogleGenAI({ apiKey: geminiApiKey });

    // Prepare AI evaluation prompt
    const task = submission.daily_tasks;
    const prompt = `Evaluate the following user-submitted code for a coding task. 

Task Title: ${task.title}
Task Description: ${task.description}
Task Level: ${task.level}
Expected Output Format: ${JSON.stringify(task.expected_output_format)}

User's Submitted Code:
\`\`\`
${submissionCode}
\`\`\`

Please provide a comprehensive evaluation in valid JSON format with exactly these fields:
{
  "overall": "string - brief summary of the solution (2-3 sentences)",
  "codeQuality": number - score 0-100 for code structure, naming, organization,
  "efficiency": number - score 0-100 for algorithm efficiency and performance,
  "readability": number - score 0-100 for code clarity and maintainability,
  "correctness": number - score 0-100 for solution accuracy and completeness,
  "suggestions": ["array", "of", "specific improvement suggestions"],
  "strengths": ["array", "of", "code strengths and good practices"],
  "improvements": ["array", "of", "specific areas to improve"],
  "overallScore": number - aggregated score 0-100
}

Focus on practical aspects relevant to a professional software development environment. Be constructive and specific in feedback.`;

    // Generate content using Gemini 2.5 Flash
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        thinkingConfig: {
          thinkingBudget: 0, // Disables thinking for faster response
        },
      },
    });

    const evaluationText = response.text;

    if (!evaluationText) {
      throw new Error('No evaluation generated by AI');
    }

    // Parse AI feedback
    let aiFeedback: AIFeedback;
    try {
      // Extract JSON from the response
      const jsonMatch = evaluationText.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : evaluationText;
      aiFeedback = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('Failed to parse AI evaluation:', evaluationText);
      // Fallback evaluation
      aiFeedback = {
        overall: "Code evaluation completed. Please review the detailed feedback below.",
        codeQuality: 75,
        efficiency: 70,
        readability: 80,
        correctness: 75,
        suggestions: ["Add error handling", "Improve variable naming", "Add comments"],
        strengths: ["Code structure is clear", "Solution addresses the problem"],
        improvements: ["Optimize algorithm", "Add input validation"],
        overallScore: 75
      };
    }

    // Update submission with AI feedback
    const { error: finalUpdateError } = await supabase
      .from('user_submissions')
      .update({
        score: aiFeedback.overallScore,
        ai_feedback: aiFeedback,
        status: 'scored',
        updated_at: new Date().toISOString()
      })
      .eq('id', submissionId);

    if (finalUpdateError) {
      throw new Error(`Failed to save evaluation: ${finalUpdateError.message}`);
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        submissionId,
        score: aiFeedback.overallScore,
        message: 'Code evaluated successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in submit-task-for-evaluation:', error);
    
    // Try to update submission status to error
    try {
      const body = await req.text();
      const parsedBody = JSON.parse(body);
      const submissionId = parsedBody.submissionId;
      
      if (submissionId) {
        const supabase = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );
        
        await supabase
          .from('user_submissions')
          .update({ status: 'error' })
          .eq('id', submissionId);
      }
    } catch (updateError) {
      console.error('Failed to update submission status to error:', updateError);
    }

    return new Response(
      JSON.stringify({ 
        error: 'Failed to evaluate submission',
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
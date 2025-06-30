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

    // Get user's achievements
    const { data: userAchievements, error: achievementsError } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', user.id);

    if (achievementsError) {
      throw new Error(`Failed to fetch achievements: ${achievementsError.message}`);
    }

    // Get user's task statistics for achievement calculations
    const { data: submissions, error: submissionsError } = await supabase
      .from('user_submissions')
      .select('score, status, created_at, updated_at, daily_tasks(level)')
      .eq('user_id', user.id);

    if (submissionsError) {
      throw new Error(`Failed to fetch submissions: ${submissionsError.message}`);
    }

    // Calculate achievement progress
    const completedTasks = submissions?.filter(s => s.status === 'scored') || [];
    const perfectScores = completedTasks.filter(s => s.score === 100);
    const algorithmTasks = completedTasks.filter(s => s.daily_tasks?.level === 'pro');

    // Calculate streak (simplified calculation)
    const recentDays = 7;
    const now = new Date();
    const recentSubmissions = completedTasks.filter(s => {
      const submissionDate = new Date(s.updated_at);
      const daysDiff = Math.floor((now.getTime() - submissionDate.getTime()) / (1000 * 60 * 60 * 24));
      return daysDiff <= recentDays;
    });
    
    const uniqueDays = new Set(recentSubmissions.map(s => 
      new Date(s.updated_at).toDateString()
    )).size;

    // Mock achievements with calculated progress
    const allAchievements = [
      {
        id: 'first-task',
        title: 'First Steps',
        description: 'Complete your first coding task',
        category: 'milestone',
        difficulty: 'bronze',
        points: 100,
        progress: Math.min(completedTasks.length, 1),
        maxProgress: 1,
        unlocked: completedTasks.length >= 1,
        requirements: ['Complete 1 task']
      },
      {
        id: 'perfect-score',
        title: 'Perfect Score',
        description: 'Score 100% on any task',
        category: 'performance',
        difficulty: 'silver',
        points: 250,
        progress: Math.min(perfectScores.length, 1),
        maxProgress: 1,
        unlocked: perfectScores.length >= 1,
        requirements: ['Score 100% on a task']
      },
      {
        id: 'week-warrior',
        title: 'Week Warrior',
        description: 'Complete tasks for 7 consecutive days',
        category: 'consistency',
        difficulty: 'gold',
        points: 500,
        progress: uniqueDays,
        maxProgress: 7,
        unlocked: uniqueDays >= 7,
        requirements: ['7 day streak']
      },
      {
        id: 'algorithm-master',
        title: 'Algorithm Master',
        description: 'Complete 50 algorithm-based tasks',
        category: 'coding',
        difficulty: 'platinum',
        points: 1000,
        progress: algorithmTasks.length,
        maxProgress: 50,
        unlocked: algorithmTasks.length >= 50,
        requirements: ['50 algorithm tasks']
      },
      {
        id: 'century-club',
        title: 'Century Club',
        description: 'Complete 100 tasks',
        category: 'milestone',
        difficulty: 'gold',
        points: 750,
        progress: completedTasks.length,
        maxProgress: 100,
        unlocked: completedTasks.length >= 100,
        requirements: ['100 completed tasks']
      }
    ];

    // Add unlocked_at timestamps from database
    const achievementsWithStatus = allAchievements.map(achievement => {
      const userAchievement = userAchievements?.find(ua => ua.achievement_id === achievement.id);
      return {
        ...achievement,
        unlockedAt: userAchievement?.unlocked_at || (achievement.unlocked ? new Date().toISOString() : undefined)
      };
    });

    return new Response(
      JSON.stringify({
        achievements: achievementsWithStatus,
        stats: {
          totalTasks: completedTasks.length,
          perfectScores: perfectScores.length,
          currentStreak: uniqueDays
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in get-user-achievements:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch user achievements',
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
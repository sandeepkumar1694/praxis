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

    // Get time range from query params
    const url = new URL(req.url);
    const timeRange = url.searchParams.get('timeRange') || '3months';

    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    
    switch (timeRange) {
      case '1month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case '6months':
        startDate.setMonth(now.getMonth() - 6);
        break;
      case '1year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default: // 3months
        startDate.setMonth(now.getMonth() - 3);
    }

    // Fetch user submissions for the time range
    const { data: submissions, error: submissionsError } = await supabase
      .from('user_submissions')
      .select(`
        *,
        daily_tasks (
          title,
          level,
          time_limit_minutes
        )
      `)
      .eq('user_id', user.id)
      .eq('status', 'scored')
      .gte('updated_at', startDate.toISOString())
      .order('updated_at', { ascending: true });

    if (submissionsError) {
      throw new Error(`Failed to fetch submissions: ${submissionsError.message}`);
    }

    // Process data for analytics
    const completedTasks = submissions || [];
    const totalTasks = completedTasks.length;
    const averageScore = totalTasks > 0 
      ? Math.round(completedTasks.reduce((sum, s) => sum + (s.score || 0), 0) / totalTasks)
      : 0;

    // Group by month for chart data
    const monthlyData = [];
    const monthMap = new Map();

    completedTasks.forEach(task => {
      const date = new Date(task.updated_at);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      
      if (!monthMap.has(monthKey)) {
        monthMap.set(monthKey, {
          month: monthName,
          scores: [],
          tasks: 0
        });
      }
      
      const monthData = monthMap.get(monthKey);
      monthData.scores.push(task.score || 0);
      monthData.tasks++;
    });

    monthMap.forEach((data, key) => {
      monthlyData.push({
        month: data.month,
        score: Math.round(data.scores.reduce((sum, s) => sum + s, 0) / data.scores.length),
        tasks: data.tasks
      });
    });

    // Skill breakdown analysis
    const skillBreakdown = {
      'JavaScript': { scores: [], tasks: 0 },
      'React': { scores: [], tasks: 0 },
      'Node.js': { scores: [], tasks: 0 },
      'Database': { scores: [], tasks: 0 },
      'Algorithms': { scores: [], tasks: 0 }
    };

    // Simple categorization based on task level and content
    completedTasks.forEach(task => {
      const score = task.score || 0;
      const title = task.daily_tasks?.title?.toLowerCase() || '';
      
      if (title.includes('javascript') || title.includes('js')) {
        skillBreakdown['JavaScript'].scores.push(score);
        skillBreakdown['JavaScript'].tasks++;
      } else if (title.includes('react') || title.includes('component')) {
        skillBreakdown['React'].scores.push(score);
        skillBreakdown['React'].tasks++;
      } else if (title.includes('node') || title.includes('api') || title.includes('server')) {
        skillBreakdown['Node.js'].scores.push(score);
        skillBreakdown['Node.js'].tasks++;
      } else if (title.includes('database') || title.includes('sql') || title.includes('query')) {
        skillBreakdown['Database'].scores.push(score);
        skillBreakdown['Database'].tasks++;
      } else if (task.daily_tasks?.level === 'pro') {
        skillBreakdown['Algorithms'].scores.push(score);
        skillBreakdown['Algorithms'].tasks++;
      } else {
        // Default to JavaScript for uncategorized tasks
        skillBreakdown['JavaScript'].scores.push(score);
        skillBreakdown['JavaScript'].tasks++;
      }
    });

    // Calculate averages and trends for skills
    const processedSkillBreakdown = {};
    Object.entries(skillBreakdown).forEach(([skill, data]) => {
      const avgScore = data.scores.length > 0 
        ? Math.round(data.scores.reduce((sum, s) => sum + s, 0) / data.scores.length)
        : 0;
      
      // Simple trend calculation (recent vs earlier scores)
      const half = Math.floor(data.scores.length / 2);
      const earlierAvg = half > 0 ? data.scores.slice(0, half).reduce((sum, s) => sum + s, 0) / half : avgScore;
      const recentAvg = half > 0 ? data.scores.slice(half).reduce((sum, s) => sum + s, 0) / (data.scores.length - half) : avgScore;
      
      let trend = 'stable';
      if (recentAvg > earlierAvg + 5) trend = 'up';
      else if (recentAvg < earlierAvg - 5) trend = 'down';

      processedSkillBreakdown[skill] = {
        score: avgScore,
        tasks: data.tasks,
        trend
      };
    });

    // Recent performance (last 10 tasks)
    const recentPerformance = completedTasks
      .slice(-10)
      .reverse()
      .map(task => ({
        date: task.updated_at,
        taskTitle: task.daily_tasks?.title || 'Unknown Task',
        score: task.score || 0,
        level: task.daily_tasks?.level || 'basic'
      }));

    // Calculate improvement rate
    const lastMonthStart = new Date();
    lastMonthStart.setMonth(now.getMonth() - 1);
    
    const lastMonthTasks = completedTasks.filter(task => 
      new Date(task.updated_at) >= lastMonthStart
    );
    
    const previousMonthStart = new Date();
    previousMonthStart.setMonth(now.getMonth() - 2);
    
    const previousMonthTasks = completedTasks.filter(task => {
      const taskDate = new Date(task.updated_at);
      return taskDate >= previousMonthStart && taskDate < lastMonthStart;
    });

    const lastMonthAvg = lastMonthTasks.length > 0 
      ? lastMonthTasks.reduce((sum, s) => sum + (s.score || 0), 0) / lastMonthTasks.length
      : 0;
    
    const previousMonthAvg = previousMonthTasks.length > 0 
      ? previousMonthTasks.reduce((sum, s) => sum + (s.score || 0), 0) / previousMonthTasks.length
      : 0;

    const improvementRate = previousMonthAvg > 0 
      ? Math.round(((lastMonthAvg - previousMonthAvg) / previousMonthAvg) * 100)
      : 0;

    const performanceData = {
      totalTasks,
      averageScore,
      improvementRate,
      skillBreakdown: processedSkillBreakdown,
      monthlyData,
      recentPerformance
    };

    return new Response(
      JSON.stringify(performanceData),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in get-performance-data:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch performance data',
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
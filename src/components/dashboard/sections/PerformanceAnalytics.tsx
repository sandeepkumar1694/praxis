import React, { useState, useRef, useEffect } from 'react';
import { BarChart3, Calendar, TrendingUp, Info } from 'lucide-react';

interface AnalyticsData {
  chartData: {
    month: string;
    score: number;
    tasks: number;
  }[];
  insights: {
    bestMonth: string;
    improvement: number;
    totalTasks: number;
  };
}

interface PerformanceAnalyticsProps {
  data?: AnalyticsData;
}

const PerformanceAnalytics: React.FC<PerformanceAnalyticsProps> = ({ data }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (chartRef.current) {
      observer.observe(chartRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const mockData: AnalyticsData = data || {
    chartData: [
      { month: 'Jan', score: 78, tasks: 12 },
      { month: 'Feb', score: 82, tasks: 15 },
      { month: 'Mar', score: 85, tasks: 18 },
      { month: 'Apr', score: 88, tasks: 22 },
      { month: 'May', score: 91, tasks: 25 },
      { month: 'Jun', score: 94, tasks: 28 },
    ],
    insights: {
      bestMonth: 'June',
      improvement: 16,
      totalTasks: 120
    }
  };

  const maxScore = Math.max(...mockData.chartData.map(d => d.score));
  const minScore = Math.min(...mockData.chartData.map(d => d.score));

  return (
    <div className="bg-dashboard-card rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-poppins font-bold text-white mb-2">
            Performance Analytics
          </h2>
          <p className="text-white/60">
            6-month performance trend and insights
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200">
            <Calendar size={20} />
          </button>
          <button className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200">
            <BarChart3 size={20} />
          </button>
        </div>
      </div>

      {/* Chart */}
      <div ref={chartRef} className="mb-8">
        <div className="relative h-64 bg-white/5 rounded-xl p-6 overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 600 200">
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map((y, i) => (
              <line
                key={i}
                x1="0"
                y1={200 - (y * 2)}
                x2="600"
                y2={200 - (y * 2)}
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
              />
            ))}

            {/* Chart path */}
            <path
              d={mockData.chartData.map((point, i) => {
                const x = (i / (mockData.chartData.length - 1)) * 500 + 50;
                const y = 200 - ((point.score / 100) * 180) - 10;
                return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
              }).join(' ')}
              stroke="url(#chartGradient)"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={isVisible ? "none" : "1000"}
              strokeDashoffset={isVisible ? "0" : "1000"}
              className="transition-all duration-2000 ease-out"
            />

            {/* Data points */}
            {mockData.chartData.map((point, i) => {
              const x = (i / (mockData.chartData.length - 1)) * 500 + 50;
              const y = 200 - ((point.score / 100) * 180) - 10;
              
              return (
                <g key={i}>
                  <circle
                    cx={x}
                    cy={y}
                    r={hoveredPoint === i ? "6" : "4"}
                    fill="#00A8FF"
                    className="transition-all duration-200 cursor-pointer"
                    onMouseEnter={() => setHoveredPoint(i)}
                    onMouseLeave={() => setHoveredPoint(null)}
                    style={{
                      opacity: isVisible ? 1 : 0,
                      transform: `scale(${isVisible ? 1 : 0})`,
                      transition: `all 0.3s ease-out ${i * 100}ms`
                    }}
                  />
                  
                  {/* Tooltip */}
                  {hoveredPoint === i && (
                    <g>
                      <rect
                        x={x - 35}
                        y={y - 40}
                        width="70"
                        height="30"
                        fill="rgba(0,0,0,0.8)"
                        rx="4"
                      />
                      <text
                        x={x}
                        y={y - 28}
                        textAnchor="middle"
                        fill="white"
                        fontSize="12"
                        fontWeight="bold"
                      >
                        {point.score}
                      </text>
                      <text
                        x={x}
                        y={y - 16}
                        textAnchor="middle"
                        fill="#05FDD1"
                        fontSize="10"
                      >
                        {point.tasks} tasks
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* X-axis labels */}
            {mockData.chartData.map((point, i) => {
              const x = (i / (mockData.chartData.length - 1)) * 500 + 50;
              return (
                <text
                  key={i}
                  x={x}
                  y="195"
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.6)"
                  fontSize="12"
                >
                  {point.month}
                </text>
              );
            })}

            <defs>
              <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00A8FF" />
                <stop offset="100%" stopColor="#05FDD1" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all duration-300">
          <div className="flex items-center space-x-3 mb-2">
            <TrendingUp size={16} className="text-accent" />
            <span className="text-white/80 text-sm">Best Performance</span>
          </div>
          <div className="text-xl font-bold text-white">{mockData.insights.bestMonth}</div>
          <div className="text-xs text-white/60">Highest scoring month</div>
        </div>

        <div className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all duration-300">
          <div className="flex items-center space-x-3 mb-2">
            <BarChart3 size={16} className="text-primary" />
            <span className="text-white/80 text-sm">Improvement</span>
          </div>
          <div className="text-xl font-bold text-white">+{mockData.insights.improvement}%</div>
          <div className="text-xs text-white/60">Since January</div>
        </div>

        <div className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all duration-300">
          <div className="flex items-center space-x-3 mb-2">
            <Info size={16} className="text-purple-400" />
            <span className="text-white/80 text-sm">Total Tasks</span>
          </div>
          <div className="text-xl font-bold text-white">{mockData.insights.totalTasks}</div>
          <div className="text-xs text-white/60">Completed this period</div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceAnalytics;
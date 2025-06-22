import React, { useState, useEffect } from 'react';
import { Radar, Eye, ChevronRight } from 'lucide-react';

interface SkillData {
  name: string;
  current: number;
  target: number;
  color: string;
}

interface SkillsAssessmentProps {
  data?: SkillData[];
}

const SkillsAssessment: React.FC<SkillsAssessmentProps> = ({ data }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const mockData: SkillData[] = data || [
    { name: 'JavaScript', current: 92, target: 95, color: '#00A8FF' },
    { name: 'React', current: 88, target: 90, color: '#05FDD1' },
    { name: 'Node.js', current: 85, target: 90, color: '#8B5CF6' },
    { name: 'Python', current: 78, target: 85, color: '#10B981' },
    { name: 'Database', current: 82, target: 87, color: '#F59E0B' },
    { name: 'DevOps', current: 75, target: 80, color: '#EF4444' },
    { name: 'Testing', current: 80, target: 85, color: '#6366F1' },
    { name: 'Security', current: 70, target: 80, color: '#EC4899' },
  ];

  const center = 150;
  const radius = 120;
  const levels = [20, 40, 60, 80, 100];

  const getPoint = (angle: number, distance: number) => {
    const radian = (angle - 90) * (Math.PI / 180);
    return {
      x: center + distance * Math.cos(radian),
      y: center + distance * Math.sin(radian)
    };
  };

  const createPath = (values: number[]) => {
    return values.map((value, i) => {
      const angle = (360 / values.length) * i;
      const distance = (value / 100) * radius;
      const point = getPoint(angle, distance);
      return `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`;
    }).join(' ') + ' Z';
  };

  return (
    <div className="bg-dashboard-card rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-poppins font-bold text-white mb-2">
            Skills Assessment
          </h2>
          <p className="text-white/60">
            Current skill levels and growth targets
          </p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-primary/20 text-primary hover:bg-primary/30 rounded-lg transition-all duration-200">
          <Eye size={16} />
          <span className="text-sm font-medium">View Details</span>
          <ChevronRight size={14} />
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Radar Chart */}
        <div className="flex items-center justify-center">
          <div className="relative">
            <svg width="300" height="300" viewBox="0 0 300 300">
              {/* Grid circles */}
              {levels.map((level, i) => (
                <circle
                  key={i}
                  cx={center}
                  cy={center}
                  r={(level / 100) * radius}
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="1"
                />
              ))}

              {/* Grid lines */}
              {mockData.map((_, i) => {
                const angle = (360 / mockData.length) * i;
                const point = getPoint(angle, radius);
                return (
                  <line
                    key={i}
                    x1={center}
                    y1={center}
                    x2={point.x}
                    y2={point.y}
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Target path */}
              <path
                d={createPath(mockData.map(skill => skill.target))}
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="2"
                strokeDasharray="5,5"
              />

              {/* Current performance path */}
              <path
                d={createPath(mockData.map(skill => skill.current))}
                fill="rgba(0,168,255,0.1)"
                stroke="#00A8FF"
                strokeWidth="3"
                strokeDasharray={isVisible ? "none" : "1000"}
                strokeDashoffset={isVisible ? "0" : "1000"}
                className="transition-all duration-2000 ease-out"
              />

              {/* Data points */}
              {mockData.map((skill, i) => {
                const angle = (360 / mockData.length) * i;
                const currentPoint = getPoint(angle, (skill.current / 100) * radius);
                const targetPoint = getPoint(angle, (skill.target / 100) * radius);
                
                return (
                  <g key={i}>
                    {/* Target point */}
                    <circle
                      cx={targetPoint.x}
                      cy={targetPoint.y}
                      r="3"
                      fill="rgba(255,255,255,0.4)"
                    />
                    {/* Current point */}
                    <circle
                      cx={currentPoint.x}
                      cy={currentPoint.y}
                      r={selectedSkill === skill.name ? "6" : "4"}
                      fill={skill.color}
                      className="cursor-pointer transition-all duration-200"
                      onMouseEnter={() => setSelectedSkill(skill.name)}
                      onMouseLeave={() => setSelectedSkill(null)}
                      style={{
                        opacity: isVisible ? 1 : 0,
                        transform: `scale(${isVisible ? 1 : 0})`,
                        transition: `all 0.3s ease-out ${i * 50}ms`
                      }}
                    />
                    
                    {/* Skill labels */}
                    {(() => {
                      const labelPoint = getPoint(angle, radius + 25);
                      return (
                        <text
                          x={labelPoint.x}
                          y={labelPoint.y + 4}
                          textAnchor="middle"
                          fill="white"
                          fontSize="12"
                          fontWeight={selectedSkill === skill.name ? "bold" : "normal"}
                          className="transition-all duration-200"
                        >
                          {skill.name}
                        </text>
                      );
                    })()}
                  </g>
                );
              })}

              {/* Center point */}
              <circle cx={center} cy={center} r="3" fill="#05FDD1" />
            </svg>
          </div>
        </div>

        {/* Skills List */}
        <div className="space-y-3">
          {mockData.map((skill, index) => (
            <div
              key={skill.name}
              className={`group p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer ${
                selectedSkill === skill.name ? 'bg-white/10 border border-white/20' : ''
              }`}
              onMouseEnter={() => setSelectedSkill(skill.name)}
              onMouseLeave={() => setSelectedSkill(null)}
              style={{
                animationDelay: `${index * 50}ms`,
                animation: isVisible ? 'fadeInRight 0.6s ease-out forwards' : 'none'
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: skill.color }}
                  />
                  <span className="font-medium text-white">{skill.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-white font-bold">{skill.current}%</span>
                  <span className="text-white/60 text-sm ml-1">/ {skill.target}%</span>
                </div>
              </div>
              
              <div className="relative">
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ 
                      width: isVisible ? `${skill.current}%` : '0%',
                      backgroundColor: skill.color,
                      transitionDelay: `${index * 50}ms`
                    }}
                  />
                </div>
                {/* Target indicator */}
                <div 
                  className="absolute top-0 w-0.5 h-2 bg-white/60"
                  style={{ left: `${skill.target}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillsAssessment;
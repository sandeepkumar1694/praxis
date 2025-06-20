import React from 'react';

interface Stat {
  value: string;
  label: string;
}

interface StatsGridProps {
  stats: Stat[];
  columns?: 1 | 2 | 3 | 4;
  variant?: 'default' | 'centered';
}

const StatsGrid: React.FC<StatsGridProps> = ({ 
  stats, 
  columns = 3,
  variant = 'default' 
}) => {
  const gridClass = `grid grid-cols-1 md:grid-cols-${columns} gap-8`;
  const containerClass = variant === 'centered' ? 'max-w-2xl mx-auto' : '';

  return (
    <div className={`${gridClass} ${containerClass}`}>
      {stats.map((stat, index) => (
        <div key={index} className="text-center">
          <div className="text-3xl font-poppins font-bold text-primary mb-2">
            {stat.value}
          </div>
          <div className="text-text-secondary">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;
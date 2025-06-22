import React, { useState } from 'react';
import { PlayCircle, Clock, CheckCircle, AlertCircle, Plus, Filter } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  progress: number;
  difficulty: string;
  estimatedTime: string;
}

interface ActiveTasksProps {
  data?: Task[];
}

const ActiveTasks: React.FC<ActiveTasksProps> = ({ data }) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const mockData: Task[] = data || [
    {
      id: '1',
      title: 'Build Authentication System',
      description: 'Implement secure user authentication with JWT tokens and refresh mechanisms',
      status: 'in_progress',
      priority: 'high',
      dueDate: '2025-01-25',
      progress: 65,
      difficulty: 'Advanced',
      estimatedTime: '4-6 hours'
    },
    {
      id: '2',
      title: 'API Rate Limiting',
      description: 'Design and implement rate limiting for the REST API endpoints',
      status: 'not_started',
      priority: 'medium',
      dueDate: '2025-01-28',
      progress: 0,
      difficulty: 'Intermediate',
      estimatedTime: '2-3 hours'
    },
    {
      id: '3',
      title: 'Database Optimization',
      description: 'Optimize slow queries and implement proper indexing strategies',
      status: 'completed',
      priority: 'high',
      dueDate: '2025-01-20',
      progress: 100,
      difficulty: 'Advanced',
      estimatedTime: '3-4 hours'
    },
    {
      id: '4',
      title: 'Unit Test Coverage',
      description: 'Increase test coverage to 80% for all critical components',
      status: 'overdue',
      priority: 'low',
      dueDate: '2025-01-22',
      progress: 30,
      difficulty: 'Beginner',
      estimatedTime: '2-3 hours'
    },
    {
      id: '5',
      title: 'Frontend Performance',
      description: 'Optimize React components and implement lazy loading',
      status: 'not_started',
      priority: 'medium',
      dueDate: '2025-01-30',
      progress: 0,
      difficulty: 'Intermediate',
      estimatedTime: '3-4 hours'
    }
  ];

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="text-green-400" />;
      case 'in_progress':
        return <PlayCircle size={16} className="text-blue-400" />;
      case 'overdue':
        return <AlertCircle size={16} className="text-red-400" />;
      default:
        return <Clock size={16} className="text-yellow-400" />;
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-green-500/20 text-green-400 border-green-500/30';
    }
  };

  const filteredTasks = mockData.filter(task => {
    if (filter === 'active') return task.status === 'in_progress' || task.status === 'not_started';
    if (filter === 'completed') return task.status === 'completed';
    return true;
  });

  return (
    <div className="bg-dashboard-card rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-poppins font-bold text-white mb-2">
            Active Tasks
          </h2>
          <p className="text-white/60">
            Your current challenges and progress
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex bg-white/5 rounded-lg p-1">
            {(['all', 'active', 'completed'] as const).map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                className={`px-3 py-1 text-sm font-medium rounded transition-all duration-200 ${
                  filter === filterOption
                    ? 'bg-primary text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
              </button>
            ))}
          </div>
          <button className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
        {filteredTasks.map((task, index) => (
          <div
            key={task.id}
            className="group bg-white/5 rounded-xl p-6 hover:bg-white/10 hover:transform hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-transparent hover:border-white/20"
            style={{
              animationDelay: `${index * 50}ms`,
              animation: 'fadeInUp 0.6s ease-out forwards'
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-3 flex-1">
                <div className="mt-1">
                  {getStatusIcon(task.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white mb-1 group-hover:text-primary transition-colors duration-200">
                    {task.title}
                  </h3>
                  <p className="text-sm text-white/60 leading-relaxed mb-3">
                    {task.description}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-white/60">
                    <span className="flex items-center space-x-1">
                      <Clock size={12} />
                      <span>{task.estimatedTime}</span>
                    </span>
                    <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                    <span className="text-accent">{task.difficulty}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            {task.progress > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/60">Progress</span>
                  <span className="text-white font-medium">{task.progress}%</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${task.progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Add New Task Button */}
        <button className="w-full p-6 border-2 border-dashed border-white/20 rounded-xl text-white/60 hover:text-white hover:border-white/40 hover:bg-white/5 transition-all duration-300 group">
          <div className="flex items-center justify-center space-x-2">
            <Plus size={20} className="group-hover:scale-110 transition-transform duration-200" />
            <span className="font-medium">Start New Challenge</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default ActiveTasks;
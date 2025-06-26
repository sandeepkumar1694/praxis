import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Code, Send, ArrowLeft, AlertCircle } from 'lucide-react';
import { DailyTask, UserSubmission } from '../../types/tasks';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import LoadingSpinner from '../ui/LoadingSpinner';

const TaskCompletion: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const { user } = useAuth();
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();
  
  const [task, setTask] = useState<DailyTask | null>(null);
  const [submission, setSubmission] = useState<UserSubmission | null>(null);
  const [code, setCode] = useState('');
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Mock task data
  const mockTasks: Record<string, DailyTask> = {
    '1': {
      id: '1',
      level: 'basic',
      title: 'Array Sum Calculator',
      description: 'Create a function that takes an array of numbers and returns their sum. Handle edge cases like empty arrays and non-numeric values.',
      timeLimit: 30,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    },
    '2': {
      id: '2',
      level: 'intermediate',
      title: 'API Rate Limiter',
      description: 'Implement a rate limiter that allows a maximum of N requests per time window. Include proper error handling and cleanup mechanisms.',
      timeLimit: 60,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    },
    '3': {
      id: '3',
      level: 'pro',
      title: 'Distributed Cache System',
      description: 'Design and implement a distributed cache system with consistent hashing, replication, and failure recovery mechanisms.',
      timeLimit: 120,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    },
  };

  useEffect(() => {
    loadTaskAndSubmission();
  }, [taskId]);

  useEffect(() => {
    if (submission && submission.chosenAt && task) {
      const startTime = new Date(submission.chosenAt).getTime();
      const timeLimit = task.timeLimit * 60 * 1000; // Convert to milliseconds
      
      const timer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, timeLimit - elapsed);
        
        setTimeLeft(remaining);
        
        if (remaining === 0) {
          clearInterval(timer);
          handleTimeExpired();
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [submission, task]);

  const loadTaskAndSubmission = async () => {
    try {
      setLoading(true);
      
      if (!taskId || !mockTasks[taskId]) {
        showError('Task not found');
        navigate('/tasks');
        return;
      }

      // Load task
      setTask(mockTasks[taskId]);
      
      // Load user submission
      const submissionData = localStorage.getItem(`task_submission_${user?.id}_${new Date().toDateString()}`);
      if (submissionData) {
        const parsedSubmission = JSON.parse(submissionData);
        if (parsedSubmission.taskId === taskId) {
          setSubmission(parsedSubmission);
          setCode(parsedSubmission.submissionCode || '');
          
          // If already submitted, redirect to results
          if (parsedSubmission.status === 'scored') {
            navigate(`/tasks/result/${parsedSubmission.id}`);
            return;
          }
        } else {
          showError('You have not selected this task');
          navigate('/tasks');
          return;
        }
      } else {
        showError('No active task found');
        navigate('/tasks');
        return;
      }
    } catch (error) {
      showError('Failed to load task');
      navigate('/tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleTimeExpired = () => {
    showError('Time is up! Your current code will be submitted automatically.');
    handleSubmit();
  };

  const handleSubmit = async () => {
    if (!code.trim()) {
      showError('Please write some code before submitting');
      return;
    }

    try {
      setSubmitting(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const updatedSubmission: UserSubmission = {
        ...submission!,
        submissionCode: code,
        submittedAt: new Date().toISOString(),
        status: 'submitted',
        updatedAt: new Date().toISOString(),
      };
      
      // Mock AI scoring
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const scoredSubmission: UserSubmission = {
        ...updatedSubmission,
        status: 'scored',
        score: Math.floor(Math.random() * 30) + 70, // Random score between 70-100
        aiFeedback: {
          overall: 'Good solution with room for improvement. Your code demonstrates understanding of the core concepts.',
          codeQuality: Math.floor(Math.random() * 20) + 80,
          efficiency: Math.floor(Math.random() * 25) + 75,
          readability: Math.floor(Math.random() * 20) + 80,
          correctness: Math.floor(Math.random() * 15) + 85,
          suggestions: [
            'Consider adding input validation for edge cases',
            'Add more descriptive variable names',
            'Include error handling for potential failures'
          ],
          strengths: [
            'Clean code structure',
            'Good use of modern JavaScript features',
            'Proper function organization'
          ],
          improvements: [
            'Add comprehensive error handling',
            'Optimize algorithm for better performance',
            'Include more detailed comments'
          ]
        },
        updatedAt: new Date().toISOString(),
      };
      
      // Save to localStorage
      localStorage.setItem(
        `task_submission_${user?.id}_${new Date().toDateString()}`, 
        JSON.stringify(scoredSubmission)
      );
      
      showSuccess('Code submitted successfully! Redirecting to results...');
      
      setTimeout(() => {
        navigate(`/tasks/result/${scoredSubmission.id}`);
      }, 1500);
      
    } catch (error) {
      showError('Failed to submit code');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (!timeLeft || !task) return 'text-white';
    const percentage = timeLeft / (task.timeLimit * 60 * 1000);
    if (percentage > 0.5) return 'text-green-400';
    if (percentage > 0.25) return 'text-yellow-400';
    return 'text-red-400';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dashboard-bg">
        <div className="container mx-auto px-6 py-8 max-w-6xl">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <LoadingSpinner size="lg" color="text-primary" />
              <p className="mt-4 text-white/60">Loading task...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!task || !submission) {
    return null;
  }

  return (
    <div className="min-h-screen bg-dashboard-bg">
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/tasks')}
            className="flex items-center space-x-2 text-white/60 hover:text-white mb-4 transition-colors duration-200"
          >
            <ArrowLeft size={16} />
            <span>Back to Tasks</span>
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-poppins font-bold text-white mb-2">
                {task.title}
              </h1>
              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                  task.level === 'basic' ? 'bg-green-500/20 text-green-400' :
                  task.level === 'intermediate' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-purple-500/20 text-purple-400'
                }`}>
                  {task.level.toUpperCase()}
                </span>
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center space-x-2 mb-2">
                <Clock size={20} className={getTimeColor()} />
                <span className={`text-2xl font-mono font-bold ${getTimeColor()}`}>
                  {timeLeft !== null ? formatTime(timeLeft) : '--:--'}
                </span>
              </div>
              <p className="text-white/60 text-sm">Time remaining</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Task Description */}
          <div className="space-y-6">
            <div className="bg-dashboard-card rounded-2xl p-6 border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <Code size={20} />
                <span>Task Description</span>
              </h2>
              <p className="text-white/80 leading-relaxed">
                {task.description}
              </p>
            </div>

            {/* Tips */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-blue-400 mb-3 flex items-center space-x-2">
                <AlertCircle size={18} />
                <span>Tips</span>
              </h3>
              <ul className="space-y-2 text-blue-300/80 text-sm">
                <li>• Start with a basic solution, then optimize</li>
                <li>• Add comments to explain your approach</li>
                <li>• Consider edge cases and error handling</li>
                <li>• Test your solution with different inputs</li>
              </ul>
            </div>
          </div>

          {/* Code Editor */}
          <div className="space-y-6">
            <div className="bg-dashboard-card rounded-2xl border border-white/10 overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <h2 className="text-lg font-semibold text-white">Code Editor</h2>
                <div className="text-sm text-white/60">
                  {code.length} characters
                </div>
              </div>
              
              <div className="p-0">
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="// Write your solution here..."
                  className="w-full h-96 p-6 bg-gray-900 text-white font-mono text-sm resize-none focus:outline-none border-none"
                  style={{ 
                    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                    lineHeight: '1.5'
                  }}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSubmit}
                disabled={submitting || !code.trim()}
                className="group px-8 py-3 bg-primary text-white rounded-lg font-medium hover:bg-blue-600 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
              >
                {submitting ? (
                  <>
                    <LoadingSpinner size="sm" color="text-white" />
                    <span>Submitting & Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    <span>Submit Solution</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCompletion;
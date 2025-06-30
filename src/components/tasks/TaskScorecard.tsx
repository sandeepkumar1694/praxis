import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Award, TrendingUp, CheckCircle, AlertCircle, ArrowLeft, BarChart3, Eye, Code } from 'lucide-react';
import { UserSubmission, DailyTask, TaskResultResponse } from '../../types/tasks';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { taskAPI } from '../../lib/api';
import LoadingSpinner from '../ui/LoadingSpinner';
import AuthenticatedLayout from '../layout/AuthenticatedLayout';

const TaskScorecard: React.FC = () => {
  const { submissionId } = useParams<{ submissionId: string }>();
  const { user } = useAuth();
  const { showError } = useNotification();
  const navigate = useNavigate();
  
  const [submission, setSubmission] = useState<UserSubmission | null>(null);
  const [task, setTask] = useState<DailyTask | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCode, setShowCode] = useState(false);

  useEffect(() => {
    loadSubmissionResult();
  }, [submissionId]);

  const loadSubmissionResult = async () => {
    try {
      setLoading(true);
      
      if (!submissionId) {
        showError('Submission not found');
        navigate('/tasks');
        return;
      }
      
      const result: TaskResultResponse = await taskAPI.getTaskResult(submissionId);
      setSubmission(result.submission);
      setTask(result.task);
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Failed to load submission result');
      navigate('/tasks');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 70) return 'text-blue-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 90) return 'from-green-500 to-emerald-500';
    if (score >= 70) return 'from-blue-500 to-cyan-500';
    if (score >= 50) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  if (loading) {
    return (
      <AuthenticatedLayout>
        <div className="container mx-auto px-6 py-8 max-w-6xl">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <LoadingSpinner size="lg" color="text-primary" />
              <p className="mt-4 text-white/60">Loading your results...</p>
            </div>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  if (!submission || !task || !submission.aiFeedback) {
    return null;
  }

  const { ai_feedback } = submission;
  
  if (!ai_feedback) {
    return (
      <AuthenticatedLayout>
        <div className="container mx-auto px-6 py-8 max-w-6xl">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-white/60">Evaluation not available</p>
            </div>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
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
          
          <div className="flex items-center space-x-4">
            <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${getScoreGradient(submission.score!)} flex items-center justify-center`}>
              <Award size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-poppins font-bold text-white mb-2">
                Task Results
              </h1>
              <p className="text-white/60">{task.title}</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Overall Score */}
          <div className="lg:col-span-1">
            <div className="bg-dashboard-card rounded-2xl p-8 border border-white/10 text-center">
              <h2 className="text-xl font-semibold text-white mb-6">Overall Score</h2>
              
              <div className="relative w-48 h-48 mx-auto mb-6">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="url(#scoreGradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${submission.score! * 2.83} 283`}
                    className="transition-all duration-2000 ease-out"
                  />
                  <defs>
                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#00A8FF" />
                      <stop offset="100%" stopColor="#05FDD1" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className={`text-5xl font-bold ${getScoreColor(submission.score!)}`}>
                    {submission.score}
                  </div>
                  <div className="text-white/60 text-sm">out of 100</div>
                </div>
              </div>

              <p className="text-white/80 text-center">
                {ai_feedback.overall}
              </p>
            </div>
          </div>

          {/* Detailed Metrics */}
          <div className="lg:col-span-2 space-y-6">
            {/* Metric Scores */}
            <div className="bg-dashboard-card rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <BarChart3 size={20} />
                <span>Detailed Breakdown</span>
              </h3>
              
              <div className="grid grid-cols-2 gap-6">
                {[
                  { label: 'Code Quality', score: ai_feedback.codeQuality, icon: Code },
                  { label: 'Efficiency', score: ai_feedback.efficiency, icon: TrendingUp },
                  { label: 'Readability', score: ai_feedback.readability, icon: Eye },
                  { label: 'Correctness', score: ai_feedback.correctness, icon: CheckCircle },
                ].map((metric, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <metric.icon size={16} className="text-white/60" />
                        <span className="text-white font-medium">{metric.label}</span>
                      </div>
                      <span className={`font-bold ${getScoreColor(metric.score)}`}>
                        {metric.score}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${getScoreGradient(metric.score)} rounded-full transition-all duration-1000 ease-out`}
                        style={{ width: `${metric.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strengths and Improvements */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-green-400 mb-4 flex items-center space-x-2">
                  <CheckCircle size={18} />
                  <span>Strengths</span>
                </h3>
                <ul className="space-y-2">
                  {ai_feedback.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start space-x-2 text-green-300/80">
                      <CheckCircle size={14} className="mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-yellow-400 mb-4 flex items-center space-x-2">
                  <AlertCircle size={18} />
                  <span>Areas for Improvement</span>
                </h3>
                <ul className="space-y-2">
                  {ai_feedback.improvements.map((improvement, index) => (
                    <li key={index} className="flex items-start space-x-2 text-yellow-300/80">
                      <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{improvement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Suggestions */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-blue-400 mb-4 flex items-center space-x-2">
                <TrendingUp size={18} />
                <span>AI Suggestions</span>
              </h3>
              <ul className="space-y-3">
                {ai_feedback.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start space-x-3 text-blue-300/80">
                    <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-400 text-xs font-bold">{index + 1}</span>
                    </div>
                    <span className="text-sm">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Submitted Code */}
            {submission.submission_code && (
              <div className="bg-dashboard-card rounded-2xl border border-white/10 overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                  <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                    <Code size={18} />
                    <span>Your Submitted Code</span>
                  </h3>
                  <button
                    onClick={() => setShowCode(!showCode)}
                    className="text-primary hover:text-blue-400 transition-colors duration-200"
                  >
                    {showCode ? 'Hide' : 'Show'} Code
                  </button>
                </div>
                
                {showCode && (
                  <div className="p-0">
                    <pre className="p-6 bg-gray-900 text-white font-mono text-sm overflow-x-auto">
                      <code>{submission.submission_code}</code>
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => navigate('/tasks')}
            className="px-8 py-3 bg-primary text-white rounded-lg font-medium hover:bg-blue-600 transition-all duration-200 hover:scale-105"
          >
            Back to Daily Tasks
          </button>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default TaskScorecard;
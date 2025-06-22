import React, { useState } from 'react';
import { ArrowLeft, Mail } from 'lucide-react';
import AuthLayout from './AuthLayout';
import AuthCard from './AuthCard';
import { useAuth } from '../../contexts/AuthContext';
import { validateEmail } from '../../utils/auth';
import LoadingSpinner from '../ui/LoadingSpinner';

interface ForgotPasswordProps {
  onBack?: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBack }) => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const { error: resetError } = await resetPassword(email);

    if (resetError) {
      setError('Failed to send reset email. Please try again.');
    } else {
      setIsSuccess(true);
    }

    setIsSubmitting(false);
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.location.href = '/auth/login';
    }
  };

  if (isSuccess) {
    return (
      <AuthLayout>
        <AuthCard title="Check Your Email" showSocialAuth={false}>
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Mail size={32} className="text-primary" />
            </div>
            <p className="text-text-secondary">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <p className="text-sm text-text-secondary">
              Check your email and click the link to reset your password. 
              If you don't see the email, check your spam folder.
            </p>
            <button
              onClick={handleBack}
              className="w-full h-11 bg-primary text-white rounded-md font-inter font-medium text-base hover:brightness-95 transition-all duration-200 mt-6"
            >
              Back to Login
            </button>
          </div>
        </AuthCard>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <AuthCard title="Reset Password" showSocialAuth={false}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-center mb-6">
            <p className="text-text-secondary">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
              autoComplete="email"
              className={`w-full h-11 px-4 border rounded-md font-inter focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200 ${
                error ? 'border-red-500' : 'border-secondary'
              }`}
              placeholder="Enter your email"
              aria-describedby={error ? 'email-error' : undefined}
            />
            {error && (
              <p id="email-error" className="mt-1 text-sm text-red-500">
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 bg-primary text-white rounded-md font-inter font-medium text-base hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center space-x-2">
                <LoadingSpinner size="sm" color="text-white" />
                <span>Sending...</span>
              </div>
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>

        <div className="text-center mt-6">
          <button
            onClick={handleBack}
            className="inline-flex items-center space-x-2 text-sm text-text-secondary hover:text-primary transition-colors duration-200"
          >
            <ArrowLeft size={16} />
            <span>Back to Login</span>
          </button>
        </div>
      </AuthCard>
    </AuthLayout>
  );
};

export default ForgotPassword;
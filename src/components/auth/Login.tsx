import React, { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import AuthCard from './AuthCard';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { validateEmail, getAuthErrorMessage } from '../../utils/auth';
import LoadingSpinner from '../ui/LoadingSpinner';

interface LoginProps {
  onToggleAuth?: () => void;
}

const Login: React.FC<LoginProps> = ({ onToggleAuth }) => {
  const { signIn, signInWithGoogle, signInWithGitHub, user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already authenticated
  if (user) {
    const from = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    const { error } = await signIn(formData.email, formData.password);
    
    if (error) {
      setErrors({ submit: 'Invalid email or password. Please try again.' });
    } else {
      // Navigate to dashboard after successful login
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    }

    setIsSubmitting(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
  };

  const handleGitHubSignIn = async () => {
    await signInWithGitHub();
  };

  if (loading) {
    return (
      <AuthLayout>
        <div className="flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <AuthCard 
        title="Welcome Back" 
        onGoogleAuth={handleGoogleSignIn}
        onGithubAuth={handleGitHubSignIn}
      >
        <form onSubmit={handleSubmit} method="POST" className="space-y-4">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              autoComplete="email"
              className={`w-full h-11 px-4 border rounded-md font-inter focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200 ${
                errors.email ? 'border-red-500' : 'border-secondary'
              }`}
              placeholder="Enter your email"
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && (
              <p id="email-error" className="mt-1 text-sm text-red-500">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                autoComplete="current-password"
                className={`w-full h-11 px-4 pr-12 border rounded-md font-inter focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200 ${
                  errors.password ? 'border-red-500' : 'border-secondary'
                }`}
                placeholder="Enter your password"
                aria-describedby={errors.password ? 'password-error' : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors duration-200"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p id="password-error" className="mt-1 text-sm text-red-500">
                {errors.password}
              </p>
            )}
          </div>

          {/* Forgot Password Link */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => window.location.href = '/auth/forgot-password'}
              className="text-sm text-primary hover:underline font-medium"
            >
              Forgot Password?
            </button>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="text-sm text-red-500 text-center">
              {errors.submit}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || loading}
            className="w-full h-11 bg-primary text-white rounded-md font-inter font-medium text-base hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center space-x-2">
                <LoadingSpinner size="sm" color="text-white" />
                <span>Signing In...</span>
              </div>
            ) : (
              'Log In'
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center mt-6">
          <p className="text-sm font-inter text-text-secondary">
            Need an account?{' '}
            {onToggleAuth ? (
              <button
                onClick={onToggleAuth}
                className="text-primary hover:underline font-medium"
              >
                Sign Up
              </button>
            ) : (
              <a
                href="/auth/signup"
                className="text-primary hover:underline font-medium"
              >
                Sign Up
              </a>
            )}
          </p>
        </div>
      </AuthCard>
    </AuthLayout>
  );
};

export default Login;
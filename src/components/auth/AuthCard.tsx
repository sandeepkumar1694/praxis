import React, { useState } from 'react';
import { Github } from 'lucide-react';
import LoadingSpinner from '../ui/LoadingSpinner';

interface AuthCardProps {
  children: React.ReactNode;
  title: string;
  showSocialAuth?: boolean;
  onGoogleAuth?: () => Promise<void>;
  onGithubAuth?: () => Promise<void>;
}

const AuthCard: React.FC<AuthCardProps> = ({ 
  children, 
  title, 
  showSocialAuth = true,
  onGoogleAuth,
  onGithubAuth 
}) => {
  const [socialLoading, setSocialLoading] = useState<'google' | 'github' | null>(null);

  const handleGoogleAuth = async () => {
    if (onGoogleAuth) {
      setSocialLoading('google');
      await onGoogleAuth();
      setSocialLoading(null);
    }
  };

  const handleGithubAuth = async () => {
    if (onGithubAuth) {
      setSocialLoading('github');
      await onGithubAuth();
      setSocialLoading(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md mx-auto">
      {/* Logo Section */}
      <div className="flex justify-center mb-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-gray-800 to-gray-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <span className="text-xl font-poppins font-bold text-text-primary">Praxis</span>
        </div>
      </div>

      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-poppins font-bold text-text-primary">{title}</h1>
      </div>

      {/* Social Authentication */}
      {showSocialAuth && (
        <>
          <div className="space-y-3 mb-6">
            <button 
              onClick={handleGoogleAuth}
              disabled={socialLoading !== null}
              className="w-full h-11 bg-white border border-secondary rounded-md flex items-center justify-center space-x-3 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {socialLoading === 'google' ? (
                <LoadingSpinner size="sm" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              <span className="text-gray-700 font-medium">
                {socialLoading === 'google' ? 'Connecting...' : 'Continue with Google'}
              </span>
            </button>

            <button 
              onClick={handleGithubAuth}
              disabled={socialLoading !== null}
              className="w-full h-11 bg-gray-900 text-white rounded-md flex items-center justify-center space-x-3 hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {socialLoading === 'github' ? (
                <LoadingSpinner size="sm" color="text-white" />
              ) : (
                <Github size={20} />
              )}
              <span className="font-medium">
                {socialLoading === 'github' ? 'Connecting...' : 'Continue with GitHub'}
              </span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center mb-6">
            <div className="border-t border-secondary w-full"></div>
            <span className="bg-white px-4 text-sm text-text-secondary font-inter">OR</span>
            <div className="border-t border-secondary w-full"></div>
          </div>
        </>
      )}

      {/* Form Content */}
      {children}
    </div>
  );
};

export default AuthCard;
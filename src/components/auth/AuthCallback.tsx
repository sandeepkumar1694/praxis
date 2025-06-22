import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useNotification } from '../../contexts/NotificationContext';
import LoadingSpinner from '../ui/LoadingSpinner';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { showError, showSuccess } = useNotification();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          showError('Authentication failed. Please try again.');
          navigate('/auth/login');
          return;
        }

        if (data.session) {
          showSuccess('Successfully signed in!');
          
          // Check if user has completed onboarding
          const { data: profile } = await supabase
            .from('profiles')
            .select('onboarding_complete')
            .eq('id', data.session.user.id)
            .single();

          if (profile?.onboarding_complete) {
            navigate('/dashboard');
          } else {
            navigate('/onboarding');
          }
        } else {
          navigate('/auth/login');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        showError('Authentication failed. Please try again.');
        navigate('/auth/login');
      }
    };

    handleAuthCallback();
  }, [navigate, showError, showSuccess]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-blue-50">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-text-secondary">Completing authentication...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../ui/LoadingSpinner';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  requireOnboarding?: boolean;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  requireOnboarding = false,
  redirectTo = '/auth/login',
}) => {
  const { user, loading, initialized } = useAuth();
  const location = useLocation();

  // Add timeout fallback to prevent infinite loading
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      if (!initialized && loading) {
        console.error('Auth initialization timeout - forcing redirect to login');
        window.location.href = '/auth/login';
      }
    }, 10000); // 10 second timeout

    return () => clearTimeout(timeout);
  }, [initialized, loading]);
  // Show loading spinner while auth is initializing
  if (!initialized || loading) {
    console.log('ProtectedRoute loading state:', { initialized, loading, user: !!user });
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-blue-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading your session...</p>
          {process.env.NODE_ENV === 'development' && (
            <p className="mt-2 text-xs text-gray-400">
              Debug: initialized={String(initialized)}, loading={String(loading)}, user={String(!!user)}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Check authentication requirement
  if (requireAuth && !user) {
    console.log('User not authenticated, redirecting to:', redirectTo);
    // Save the attempted location for redirect after login
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check onboarding requirement
  if (requireOnboarding && user && !user.profile?.onboarding_complete) {
    console.log('User needs onboarding, current path:', location.pathname);
    // Only redirect to onboarding if we're not already there
    if (location.pathname !== '/onboarding') {
      return <Navigate to="/onboarding" replace />;
    }
  }

  // If user is authenticated but trying to access auth pages, redirect to dashboard
  if (user && !requireAuth && (location.pathname.startsWith('/auth') || location.pathname === '/')) {
    console.log('Authenticated user accessing public page, redirecting...');
    if (user.profile?.onboarding_complete) {
      return <Navigate to="/tasks" replace />;
    } else {
      return <Navigate to="/onboarding" replace />;
    }
  }

  console.log('ProtectedRoute rendering children for path:', location.pathname);
  return <>{children}</>;
};

export default ProtectedRoute;
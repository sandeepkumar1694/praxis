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

  // Show loading spinner while auth is initializing
  if (!initialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-blue-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Check authentication requirement
  if (requireAuth && !user) {
    // Save the attempted location for redirect after login
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check onboarding requirement
  if (requireOnboarding && user && !user.profile?.onboarding_complete) {
    // Only redirect to onboarding if we're not already there
    if (location.pathname !== '/onboarding') {
      return <Navigate to="/onboarding" replace />;
    }
  }

  // If user is authenticated but trying to access auth pages, redirect to dashboard
  if (user && !requireAuth && (location.pathname.startsWith('/auth') || location.pathname === '/')) {
    if (user.profile?.onboarding_complete) {
      return <Navigate to="/dashboard" replace />;
    } else {
    if (location.pathname !== '/onboarding') {
      return <Navigate to="/onboarding" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
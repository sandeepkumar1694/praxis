import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { AuthContextType, AuthState, Profile, AuthUser } from '../types/auth';
import { getAuthErrorMessage } from '../utils/auth';
import { useNotification } from './NotificationContext';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    initialized: false,
  });

  const { showError, showSuccess } = useNotification();

  // Fetch user profile from database
  const fetchProfile = async (userId: string): Promise<Profile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  };

  // Update auth state - this should be fast and not affect initialization
  const setAuthUser = (user: User | null, session: Session | null, profile?: Profile | null) => {
    if (user) {
      const authUser: AuthUser = { ...user, profile: profile || undefined };
      setAuthState(prev => ({
        ...prev,
        user: authUser,
        session,
      }));
    } else {
      setAuthState(prev => ({
        ...prev,
        user: null,
        session: null,
      }));
    }
  };

  // Fetch profile separately and update user data
  const updateUserProfile = async (user: User) => {
    try {
      const profile = await fetchProfile(user.id);
      setAuthState(prev => ({
        ...prev,
        user: prev.user ? { ...prev.user, profile: profile || undefined } : null,
      }));
    } catch (error) {
      console.error('Failed to update user profile:', error);
      // Don't throw error - user can still use the app without profile data
    }
  };

  // Initialize auth state - this should complete quickly
  useEffect(() => {
    const initializeSession = async () => {
      try {
        console.log('Initializing auth session...');
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        // Always mark as initialized and not loading after session check
        setAuthState(prev => ({
          ...prev,
          loading: false,
          initialized: true,
        }));
        
        if (error) {
          console.warn('Session initialization error (non-critical):', error);
          setAuthUser(null, null);
          return;
        }
        
        if (session?.user) {
          console.log('Session found for user:', session.user.email);
          // Set user immediately without profile
          setAuthUser(session.user, session);
          
          // Fetch profile in background without blocking
          updateUserProfile(session.user).catch(error => {
            console.warn('Background profile fetch failed:', error);
          });
        } else {
          console.log('No session found');
          setAuthUser(null, null);
        }
        
      } catch (error) {
        console.error('Failed to initialize session:', error);
        // Still mark as initialized even on error
        setAuthState(prev => ({
          ...prev,
          loading: false,
          initialized: true,
          user: null,
          session: null,
        }));
      }
    };
    
    initializeSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session?.user) {
          setAuthUser(session.user, session);
          // Update profile in background
          updateUserProfile(session.user).catch(error => {
            console.warn('Background profile update failed:', error);
          });
        }
      } else if (event === 'SIGNED_OUT') {
        setAuthUser(null, null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Sign up with email and password
  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }));

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;

      showSuccess('Account created successfully! Please check your email to verify your account.');
      return { error: null };
    } catch (error) {
      const authError = error as AuthError;
      console.error('Sign up error:', authError);
      showError(getAuthErrorMessage(authError));
      return { error: authError };
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }));

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      showSuccess('Welcome back!');
      return { error: null };
    } catch (error) {
      const authError = error as AuthError;
      console.error('Sign in error:', authError);
      showError(getAuthErrorMessage(authError));
      return { error: authError };
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }));

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      return { error: null };
    } catch (error) {
      const authError = error as AuthError;
      console.error('Google sign in error:', authError);
      showError(getAuthErrorMessage(authError));
      return { error: authError };
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  };

  // Sign in with GitHub
  const signInWithGitHub = async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }));

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      return { error: null };
    } catch (error) {
      const authError = error as AuthError;
      console.error('GitHub sign in error:', authError);
      showError(getAuthErrorMessage(authError));
      return { error: authError };
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }));

      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      showSuccess('Signed out successfully');
      return { error: null };
    } catch (error) {
      const authError = error as AuthError;
      console.error('Sign out error:', authError);
      showError(getAuthErrorMessage(authError));
      return { error: authError };
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;

      showSuccess('Password reset email sent! Check your inbox.');
      return { error: null };
    } catch (error) {
      const authError = error as AuthError;
      console.error('Password reset error:', authError);
      showError(getAuthErrorMessage(authError));
      return { error: authError };
    }
  };

  // Update user profile
  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      if (!authState.user) {
        throw new Error('No authenticated user');
      }

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', authState.user.id);

      if (error) throw error;

      // Refresh the profile data
      const updatedProfile = await fetchProfile(authState.user.id);
      if (updatedProfile) {
        setAuthState(prev => ({
          ...prev,
          user: prev.user ? { ...prev.user, profile: updatedProfile } : null,
        }));
      }
      
      showSuccess('Profile updated successfully');
      return { error: null };
    } catch (error) {
      console.error('Profile update error:', error);
      showError('Failed to update profile');
      return { error: error as Error };
    }
  };

  // Refresh profile data
  const refreshProfile = async () => {
    if (authState.user) {
      await updateUserProfile(authState.user);
    }
  };

  const value: AuthContextType = {
    ...authState,
    signUp,
    signIn,
    signInWithGoogle,
    signInWithGitHub,
    signOut,
    resetPassword,
    updateProfile,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
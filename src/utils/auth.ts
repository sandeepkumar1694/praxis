import { AuthError } from '@supabase/supabase-js';

/**
 * Utility functions for authentication
 */

export const getAuthErrorMessage = (error: AuthError): string => {
  switch (error.message) {
    case 'Invalid login credentials':
      return 'Invalid email or password. Please check your credentials and try again.';
    case 'Email not confirmed':
      return 'Please check your email and click the verification link before signing in.';
    case 'User already registered':
      return 'An account with this email already exists. Please sign in instead.';
    case 'Password should be at least 6 characters':
      return 'Password must be at least 6 characters long.';
    case 'Unable to validate email address: invalid format':
      return 'Please enter a valid email address.';
    case 'Email rate limit exceeded':
      return 'Too many requests. Please wait a moment before trying again.';
    case 'Invalid email or password':
      return 'Invalid email or password. Please check your credentials and try again.';
    default:
      return error.message || 'An unexpected error occurred. Please try again.';
  }
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { isValid: boolean; message?: string } => {
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long' };
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter' };
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter' };
  }
  
  if (!/(?=.*\d)/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one number' };
  }
  
  return { isValid: true };
};

export const getRedirectUrl = (): string => {
  const currentUrl = window.location.origin;
  return `${currentUrl}/auth/callback`;
};

export const isValidRedirectUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    const allowedDomains = [
      'localhost',
      '127.0.0.1',
      window.location.hostname
    ];
    
    return allowedDomains.includes(urlObj.hostname);
  } catch {
    return false;
  }
};
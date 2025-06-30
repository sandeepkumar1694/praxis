import { useState, useCallback, useEffect, useRef } from 'react';
import { TavusSessionState, TavusSession, TavusMessage } from '../types/tavus';
import { tavusAPI } from '../services/tavusApi';
import { useNotification } from '../contexts/NotificationContext';

export const useTavusSession = () => {
  const { showError, showSuccess } = useNotification();
  const [sessionState, setSessionState] = useState<TavusSessionState>({
    session: null,
    loading: false,
    error: null,
    connected: false,
    recording: false,
  });

  const sessionRef = useRef<TavusSession | null>(null);
  const statusCheckInterval = useRef<NodeJS.Timeout>();

  const startSession = useCallback(async (replicaId?: string, personaId?: string) => {
    setSessionState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await tavusAPI.createSession(replicaId, personaId);
      
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to create session');
      }

      const session = response.data;
      sessionRef.current = session;
      
      setSessionState(prev => ({
        ...prev,
        session,
        loading: false,
        connected: true,
      }));

      showSuccess('Avatar session started successfully!');
      
      // Start status checking
      startStatusChecking(session.session_id);
      
      return session;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to start session';
      setSessionState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      showError(errorMessage);
      throw error;
    }
  }, [showError, showSuccess]);

  const endSession = useCallback(async () => {
    if (!sessionRef.current) return;

    setSessionState(prev => ({ ...prev, loading: true }));

    try {
      await tavusAPI.endSession(sessionRef.current.session_id);
      
      // Clear status checking
      if (statusCheckInterval.current) {
        clearInterval(statusCheckInterval.current);
      }

      sessionRef.current = null;
      setSessionState({
        session: null,
        loading: false,
        error: null,
        connected: false,
        recording: false,
      });

      showSuccess('Avatar session ended');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to end session';
      setSessionState(prev => ({ ...prev, loading: false, error: errorMessage }));
      showError(errorMessage);
    }
  }, [showError, showSuccess]);

  const sendMessage = useCallback(async (message: TavusMessage) => {
    if (!sessionRef.current) {
      throw new Error('No active session');
    }

    try {
      const response = await tavusAPI.sendMessage(sessionRef.current.session_id, message);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to send message');
      }

      return response.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
      showError(errorMessage);
      throw error;
    }
  }, [showError]);

  const sendAudio = useCallback(async (audioBlob: Blob) => {
    if (!sessionRef.current) {
      throw new Error('No active session');
    }

    try {
      const response = await tavusAPI.uploadAudio(sessionRef.current.session_id, audioBlob);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to send audio');
      }

      return response.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send audio';
      showError(errorMessage);
      throw error;
    }
  }, [showError]);

  const startStatusChecking = useCallback((sessionId: string) => {
    statusCheckInterval.current = setInterval(async () => {
      try {
        const response = await tavusAPI.getSessionStatus(sessionId);
        
        if (response.success && response.data) {
          const session = response.data;
          sessionRef.current = session;
          
          setSessionState(prev => ({
            ...prev,
            session,
            connected: session.status === 'ready' || session.status === 'active',
          }));

          // If session ended or errored, stop checking
          if (session.status === 'ended' || session.status === 'error') {
            if (statusCheckInterval.current) {
              clearInterval(statusCheckInterval.current);
            }
            
            if (session.status === 'error') {
              setSessionState(prev => ({
                ...prev,
                error: 'Session encountered an error',
                connected: false,
              }));
            }
          }
        }
      } catch (error) {
        console.error('Status check failed:', error);
      }
    }, 5000); // Check every 5 seconds
  }, []);

  const setRecording = useCallback((recording: boolean) => {
    setSessionState(prev => ({ ...prev, recording }));
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (statusCheckInterval.current) {
        clearInterval(statusCheckInterval.current);
      }
      
      // End session on cleanup
      if (sessionRef.current) {
        tavusAPI.endSession(sessionRef.current.session_id).catch(console.error);
      }
    };
  }, []);

  return {
    ...sessionState,
    startSession,
    endSession,
    sendMessage,
    sendAudio,
    setRecording,
  };
};
import { useState, useEffect, useCallback } from 'react';
import { AudioPermissionState } from '../types/tavus';

export const useAudioPermissions = () => {
  const [permissionState, setPermissionState] = useState<AudioPermissionState>({
    granted: false,
    denied: false,
    loading: false,
    error: null,
  });

  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  const requestPermission = useCallback(async () => {
    setPermissionState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      setMediaStream(stream);
      setPermissionState({
        granted: true,
        denied: false,
        loading: false,
        error: null,
      });

      return stream;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Microphone access denied';
      
      setPermissionState({
        granted: false,
        denied: true,
        loading: false,
        error: errorMessage,
      });

      throw error;
    }
  }, []);

  const stopStream = useCallback(() => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    }
  }, [mediaStream]);

  const checkPermission = useCallback(async () => {
    try {
      const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      
      setPermissionState(prev => ({
        ...prev,
        granted: permission.state === 'granted',
        denied: permission.state === 'denied',
      }));

      permission.addEventListener('change', () => {
        setPermissionState(prev => ({
          ...prev,
          granted: permission.state === 'granted',
          denied: permission.state === 'denied',
        }));
      });
    } catch (error) {
      // Permission API not supported, will need to request directly
      console.warn('Permissions API not supported');
    }
  }, []);

  useEffect(() => {
    checkPermission();
    
    // Cleanup on unmount
    return () => {
      stopStream();
    };
  }, [checkPermission, stopStream]);

  return {
    ...permissionState,
    mediaStream,
    requestPermission,
    stopStream,
    checkPermission,
  };
};
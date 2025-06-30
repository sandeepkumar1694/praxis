import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Play, Pause, Mic, MicOff, Volume2, VolumeX, MessageCircle, Loader } from 'lucide-react';
import { useTavusSession } from '../../hooks/useTavusSession';
import { useAudioPermissions } from '../../hooks/useAudioPermissions';
import { useNotification } from '../../contexts/NotificationContext';

interface TavusAvatarProps {
  replicaId?: string;
  personaId?: string;
  className?: string;
  autoStart?: boolean;
}

const TavusAvatar: React.FC<TavusAvatarProps> = ({
  replicaId,
  personaId,
  className = '',
  autoStart = false,
}) => {
  const { showError, showInfo } = useNotification();
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);

  const {
    session,
    loading: sessionLoading,
    error: sessionError,
    connected,
    recording,
    startSession,
    endSession,
    sendMessage,
    sendAudio,
    setRecording,
  } = useTavusSession();

  const {
    granted: audioGranted,
    denied: audioDenied,
    loading: audioLoading,
    error: audioError,
    mediaStream,
    requestPermission,
    stopStream,
  } = useAudioPermissions();

  // Handle video loading
  const handleVideoLoad = useCallback(() => {
    setIsVideoLoaded(true);
  }, []);

  const handleVideoError = useCallback(() => {
    setIsVideoLoaded(false);
    showError('Failed to load avatar video');
  }, [showError]);

  // Auto start session if requested
  useEffect(() => {
    if (autoStart && !session && !sessionLoading) {
      startSession(replicaId, personaId);
    }
  }, [autoStart, session, sessionLoading, startSession, replicaId, personaId]);

  // Load video when session is ready
  useEffect(() => {
    if (session?.session_url && videoRef.current) {
      videoRef.current.src = session.session_url;
      videoRef.current.load();
    }
  }, [session?.session_url]);

  // Volume control
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handleStartSession = async () => {
    try {
      await startSession(replicaId, personaId);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleEndSession = async () => {
    try {
      // Stop any ongoing recording
      if (isRecordingAudio) {
        stopRecording();
      }
      
      stopStream();
      await endSession();
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const startRecording = async () => {
    if (!audioGranted) {
      try {
        await requestPermission();
      } catch (error) {
        showError('Microphone access is required for voice interaction');
        return;
      }
    }

    if (!mediaStream) {
      showError('No audio stream available');
      return;
    }

    try {
      audioChunksRef.current = [];
      mediaRecorderRef.current = new MediaRecorder(mediaStream);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        
        if (audioBlob.size > 0 && session) {
          try {
            await sendAudio(audioBlob);
            showInfo('Audio message sent to avatar');
          } catch (error) {
            // Error handling is done in the hook
          }
        }
        
        setIsRecordingAudio(false);
        setRecording(false);
      };

      mediaRecorderRef.current.start();
      setIsRecordingAudio(true);
      setRecording(true);
      
    } catch (error) {
      showError('Failed to start recording');
      setIsRecordingAudio(false);
      setRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const handleSendText = async () => {
    if (!textInput.trim() || !session) return;

    try {
      await sendMessage({
        type: 'text',
        content: textInput.trim(),
        timestamp: new Date().toISOString(),
      });
      
      setTextInput('');
      showInfo('Text message sent to avatar');
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const getStatusColor = () => {
    if (sessionError) return 'bg-red-500';
    if (!session) return 'bg-gray-400';
    if (connected) return 'bg-green-500';
    return 'bg-yellow-500';
  };

  const getStatusText = () => {
    if (sessionError) return 'Error';
    if (sessionLoading) return 'Connecting...';
    if (!session) return 'Disconnected';
    if (connected) return 'Connected';
    return 'Initializing...';
  };

  return (
    <div className={`bg-dashboard-card rounded-2xl border border-white/10 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${getStatusColor()}`} />
          <h3 className="text-lg font-semibold text-white">AI Avatar</h3>
          <span className="text-sm text-white/60">{getStatusText()}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Volume Control */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-16 h-1 bg-white/20 rounded-lg appearance-none slider"
            />
          </div>
        </div>
      </div>

      {/* Video Container */}
      <div className="relative aspect-video bg-gray-900">
        {sessionLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-center">
              <Loader size={48} className="text-primary animate-spin mx-auto mb-4" />
              <p className="text-white/80">Initializing avatar...</p>
            </div>
          </div>
        )}

        {sessionError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-center max-w-md px-6">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-400 text-2xl">⚠️</span>
              </div>
              <p className="text-white mb-4">Avatar session error</p>
              <p className="text-white/60 text-sm mb-6">{sessionError}</p>
              <button
                onClick={handleStartSession}
                className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-blue-600 transition-colors duration-200"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {!session && !sessionLoading && !sessionError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Play size={40} className="text-primary" />
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">Start Avatar Session</h4>
              <p className="text-white/60 mb-6">Click below to begin your interview with our AI avatar</p>
              <button
                onClick={handleStartSession}
                disabled={sessionLoading}
                className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-blue-600 transition-all duration-200 hover:scale-105 disabled:opacity-50"
              >
                Start Session
              </button>
            </div>
          </div>
        )}

        {session && (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted={false}
            onLoadedData={handleVideoLoad}
            onError={handleVideoError}
            className={`w-full h-full object-cover ${isVideoLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
          />
        )}

        {/* Recording Indicator */}
        {isRecordingAudio && (
          <div className="absolute top-4 right-4">
            <div className="flex items-center space-x-2 px-3 py-2 bg-red-500/90 rounded-full">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span className="text-white text-sm font-medium">Recording</span>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      {session && connected && (
        <div className="p-6 space-y-4">
          {/* Audio Controls */}
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={isRecordingAudio ? stopRecording : startRecording}
              disabled={!audioGranted && !audioLoading}
              className={`p-4 rounded-full font-medium transition-all duration-200 hover:scale-105 ${
                isRecordingAudio
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-primary text-white hover:bg-blue-600'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              title={isRecordingAudio ? 'Stop recording' : 'Start recording'}
            >
              {audioLoading ? (
                <Loader size={24} className="animate-spin" />
              ) : isRecordingAudio ? (
                <Pause size={24} />
              ) : (
                <Mic size={24} />
              )}
            </button>

            <button
              onClick={handleEndSession}
              className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all duration-200"
            >
              End Session
            </button>
          </div>

          {/* Audio Permission Warning */}
          {!audioGranted && audioDenied && (
            <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
              <p className="text-yellow-400 text-sm">
                Microphone access is required for voice interaction. 
                <button
                  onClick={requestPermission}
                  className="ml-2 underline hover:no-underline"
                >
                  Grant permission
                </button>
              </p>
            </div>
          )}

          {/* Text Input */}
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendText()}
              placeholder="Type a message to the avatar..."
              className="flex-1 h-11 px-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-200"
            />
            <button
              onClick={handleSendText}
              disabled={!textInput.trim()}
              className="p-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Send message"
            >
              <MessageCircle size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TavusAvatar;
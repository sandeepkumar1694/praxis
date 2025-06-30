import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Play, Pause, Mic, MicOff, Volume2, VolumeX, MessageCircle, Loader, ExternalLink } from 'lucide-react';
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
  const { showError, showInfo, showSuccess } = useNotification();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  const [isTavusLoaded, setIsTavusLoaded] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [conversationStarted, setConversationStarted] = useState(false);

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

  // Handle iframe loading
  const handleIframeLoad = useCallback(() => {
    setIsTavusLoaded(true);
    showSuccess('Avatar interface loaded successfully!');
  }, [showSuccess]);

  const handleIframeError = useCallback(() => {
    setIsTavusLoaded(false);
    showError('Failed to load avatar interface');
  }, [showError]);

  // Auto start session if requested
  useEffect(() => {
    if (autoStart && !session && !sessionLoading) {
      startSession(replicaId, personaId);
    }
  }, [autoStart, session, sessionLoading, startSession, replicaId, personaId]);

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
      setConversationStarted(false);
      setIsTavusLoaded(false);
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

  const handleStartConversation = () => {
    setConversationStarted(true);
    showInfo('Conversation started! You can now interact with Sarah Chen.');
  };

  const openInNewTab = () => {
    if (session?.session_url) {
      window.open(session.session_url, '_blank', 'width=800,height=600');
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
          <h3 className="text-lg font-semibold text-white">AI Technical Interviewer</h3>
          <span className="text-sm text-white/60">{getStatusText()}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          {session?.session_url && (
            <button
              onClick={openInNewTab}
              className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
              title="Open in new window"
            >
              <ExternalLink size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative aspect-video bg-gray-900">
        {sessionLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-center">
              <Loader size={48} className="text-primary animate-spin mx-auto mb-4" />
              <p className="text-white/80">Initializing avatar session...</p>
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

        {session && !conversationStarted && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80">
            <div className="text-center max-w-md px-6">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle size={32} className="text-green-400" />
              </div>
              <h4 className="text-xl font-semibold text-white mb-4">Session Ready!</h4>
              <p className="text-white/80 mb-6">
                Your interview session with Sarah Chen is ready. Click the button below to open 
                the interactive avatar interface in a new window.
              </p>
              <button
                onClick={handleStartConversation}
                className="px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-all duration-200 hover:scale-105"
              >
                Start Conversation
              </button>
            </div>
          </div>
        )}

        {session && conversationStarted && (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20">
            {session.session_url ? (
              <iframe
                ref={iframeRef}
                src={session.session_url}
                className="w-full h-full border-0"
                onLoad={handleIframeLoad}
                onError={handleIframeError}
                allow="camera; microphone; fullscreen"
                title="Tavus AI Interviewer"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle size={40} className="text-blue-400" />
                  </div>
                  <h4 className="text-xl font-semibold text-white mb-4">
                    Interview in Progress
                  </h4>
                  <p className="text-white/80 mb-6">
                    Your technical interview with Sarah Chen is active. Use the controls below to interact.
                  </p>
                  {session.session_url && (
                    <button
                      onClick={openInNewTab}
                      className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-blue-600 transition-all duration-200 flex items-center space-x-2 mx-auto"
                    >
                      <ExternalLink size={20} />
                      <span>Open Avatar Interface</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
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
      {session && conversationStarted && (
        <div className="p-6 space-y-4">
          {/* Session Info */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <h4 className="text-blue-400 font-semibold mb-2">Interview Session Active</h4>
            <p className="text-blue-300/80 text-sm mb-3">
              You're now connected with Sarah Chen, Senior Engineering Manager. 
              The interview interface will open in a new window for the best experience.
            </p>
            <div className="flex items-center space-x-3">
              <button
                onClick={openInNewTab}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors duration-200 flex items-center space-x-2"
              >
                <ExternalLink size={16} />
                <span>Open Interview Window</span>
              </button>
              <button
                onClick={handleEndSession}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors duration-200"
              >
                End Session
              </button>
            </div>
          </div>

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

          {/* Usage Instructions */}
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-2">How to Use:</h4>
            <ul className="text-white/60 text-sm space-y-1">
              <li>• Click "Open Interview Window" for the best experience</li>
              <li>• Speak naturally with Sarah Chen about your technical experience</li>
              <li>• The AI will adapt questions based on your responses</li>
              <li>• Use the microphone button for voice recording (alternative)</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default TavusAvatar;
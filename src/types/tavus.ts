export interface TavusSession {
  session_id: string;
  session_url: string;
  status: 'initializing' | 'ready' | 'active' | 'ended' | 'error';
  created_at: string;
  expires_at: string;
}

export interface TavusMessage {
  type: 'text' | 'audio';
  content: string;
  timestamp: string;
}

export interface TavusResponse {
  session_id: string;
  video_url?: string;
  audio_url?: string;
  transcript?: string;
  status: string;
}

export interface AudioPermissionState {
  granted: boolean;
  denied: boolean;
  loading: boolean;
  error: string | null;
}

export interface TavusSessionState {
  session: TavusSession | null;
  loading: boolean;
  error: string | null;
  connected: boolean;
  recording: boolean;
}

export interface TavusApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}
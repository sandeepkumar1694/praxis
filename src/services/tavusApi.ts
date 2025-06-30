import { supabase } from '../lib/supabase';
import { TavusSession, TavusMessage, TavusResponse, TavusApiResponse } from '../types/tavus';

class TavusAPIService {
  private baseUrl: string;

  constructor() {
    // Use Supabase Edge Functions for API calls
    this.baseUrl = `${supabase.supabaseUrl}/functions/v1`;
  }

  private async getAuthHeaders(): Promise<HeadersInit> {
    const { data: { session } } = await supabase.auth.getSession();
    return {
      'Authorization': `Bearer ${session?.access_token}`,
      'Content-Type': 'application/json',
    };
  }

  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<TavusApiResponse<T>> {
    try {
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error(`Tavus API Error (${endpoint}):`, error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }

  async createSession(replicaId?: string, personaId?: string): Promise<TavusApiResponse<TavusSession>> {
    return this.makeRequest<TavusSession>('/tavus-create-session', {
      method: 'POST',
      body: JSON.stringify({
        replica_id: replicaId,
        persona_id: personaId,
      }),
    });
  }

  async sendMessage(sessionId: string, message: TavusMessage): Promise<TavusApiResponse<TavusResponse>> {
    return this.makeRequest<TavusResponse>('/tavus-send-message', {
      method: 'POST',
      body: JSON.stringify({
        session_id: sessionId,
        message,
      }),
    });
  }

  async getSessionStatus(sessionId: string): Promise<TavusApiResponse<TavusSession>> {
    return this.makeRequest<TavusSession>(`/tavus-session-status?session_id=${sessionId}`);
  }

  async endSession(sessionId: string): Promise<TavusApiResponse<void>> {
    return this.makeRequest<void>('/tavus-end-session', {
      method: 'DELETE',
      body: JSON.stringify({ session_id: sessionId }),
    });
  }

  async uploadAudio(sessionId: string, audioBlob: Blob): Promise<TavusApiResponse<TavusResponse>> {
    try {
      const headers = await this.getAuthHeaders();
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');
      formData.append('session_id', sessionId);

      const response = await fetch(`${this.baseUrl}/tavus-upload-audio`, {
        method: 'POST',
        headers: {
          'Authorization': headers.Authorization as string,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Audio upload error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to upload audio' 
      };
    }
  }
}

export const tavusAPI = new TavusAPIService();
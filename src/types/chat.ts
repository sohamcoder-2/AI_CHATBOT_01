export interface ChatMessage {
  id: string;
  session_id: string;
  message_type: 'user' | 'bot';
  message_text: string;
  detected_mood?: string;
  confidence_score?: number;
  created_at: string;
}

export interface ChatResponse {
  success: boolean;
  response: string;
  mood: string;
  confidence: number;
  is_crisis: boolean;
}

export interface Session {
  id: string;
  session_id: string;
  created_at: string;
  last_active_at: string;
}
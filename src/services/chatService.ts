import { supabase } from '../lib/supabase';
import { ChatMessage, ChatResponse } from '../types/chat';

export class ChatService {
  static async createSession(): Promise<string | null> {
    try {
      const sessionId = crypto.randomUUID();

      const { error } = await supabase
        .from('chat_sessions')
        .insert({
          session_id: sessionId,
          user_ip: '',
          created_at: new Date().toISOString(),
          last_active_at: new Date().toISOString()
        })
        .select()
        .maybeSingle();

      if (error) throw error;
      return sessionId;
    } catch (error) {
      console.error('Error creating session:', error);
      return null;
    }
  }

  static async sendMessage(sessionId: string, message: string): Promise<ChatResponse | null> {
    try {
      const session = await supabase
        .from('chat_sessions')
        .select('id')
        .eq('session_id', sessionId)
        .maybeSingle();

      if (!session.data) throw new Error('Session not found');

      const mood = this.analyzeMood(message);
      const isCrisis = this.detectCrisis(message);

      await supabase
        .from('chat_messages')
        .insert({
          session_id: session.data.id,
          message_type: 'user',
          message_text: message,
          detected_mood: mood,
          confidence_score: 0.7,
          created_at: new Date().toISOString()
        });

      await supabase
        .from('chat_sessions')
        .update({ last_active_at: new Date().toISOString() })
        .eq('session_id', sessionId);

      const response = this.generateResponse(mood, isCrisis);

      await supabase
        .from('chat_messages')
        .insert({
          session_id: session.data.id,
          message_type: 'bot',
          message_text: response,
          detected_mood: 'neutral',
          confidence_score: 0.0,
          created_at: new Date().toISOString()
        });

      await this.updateMoodAnalytics(session.data.id, mood);

      return {
        success: true,
        response,
        mood,
        confidence: 0.7,
        is_crisis: isCrisis
      };
    } catch (error) {
      console.error('Error sending message:', error);
      return null;
    }
  }

  static async getChatHistory(sessionId: string): Promise<ChatMessage[]> {
    try {
      const session = await supabase
        .from('chat_sessions')
        .select('id')
        .eq('session_id', sessionId)
        .maybeSingle();

      if (!session.data) return [];

      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', session.data.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching chat history:', error);
      return [];
    }
  }

  private static detectCrisis(text: string): boolean {
    const crisisKeywords = [
      'suicide', 'suicidal', 'kill myself', 'end my life', 'want to die',
      'hurt myself', 'self harm', 'no reason to live', 'better off dead',
      'end it all', 'take my life'
    ];
    const lowerText = text.toLowerCase();
    return crisisKeywords.some(keyword => lowerText.includes(keyword));
  }

  private static analyzeMood(text: string): string {
    if (this.detectCrisis(text)) return 'crisis';

    const lowerText = text.toLowerCase();
    const moodKeywords = {
      happy: ['happy', 'joy', 'great', 'wonderful', 'excited', 'amazing', 'good', 'glad'],
      sad: ['sad', 'depressed', 'down', 'unhappy', 'miserable', 'crying', 'lonely', 'hopeless'],
      anxious: ['anxious', 'anxiety', 'nervous', 'worried', 'panic', 'fear', 'scared', 'overwhelmed'],
      stressed: ['stressed', 'pressure', 'overworked', 'exhausted', 'tired', 'burnt out'],
      angry: ['angry', 'furious', 'mad', 'frustrated', 'irritated', 'annoyed']
    };

    for (const [mood, keywords] of Object.entries(moodKeywords)) {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        return mood;
      }
    }

    return 'neutral';
  }

  private static generateResponse(mood: string, isCrisis: boolean): string {
    if (isCrisis) {
      return "I'm really concerned about what you've shared. Your life matters, and help is available right now. Please reach out to a crisis helpline immediately:\n\n🆘 EMERGENCY RESOURCES:\n• National Suicide Prevention Lifeline: 988 (US)\n• Crisis Text Line: Text HOME to 741741\n• International Association for Suicide Prevention: https://www.iasp.info/resources/Crisis_Centres/\n\nPlease talk to someone who can provide immediate professional help. You don't have to go through this alone.";
    }

    const responses: Record<string, string[]> = {
      happy: [
        "That's wonderful to hear! It's great that you're feeling positive. What's been making you feel this way?",
        "I'm so glad you're feeling happy! Positive emotions are precious. Would you like to share what's going well?"
      ],
      sad: [
        "I'm sorry you're feeling this way. It's okay to feel sad, and your feelings are valid. Would you like to talk about what's on your mind?",
        "I hear you, and I'm here for you. Sadness is a natural emotion. Remember, it's okay to not be okay sometimes."
      ],
      anxious: [
        "Anxiety can be really challenging. Let's take a moment together. Try taking a deep breath in for 4 counts, hold for 4, and exhale for 4. Would you like to talk about what's causing your anxiety?\n\n💡 Coping Strategy: Try the 5-4-3-2-1 grounding technique - Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, and 1 you taste.",
        "I understand that you're feeling anxious. Remember, you're not alone in this. Have you tried any grounding techniques like focusing on your five senses?\n\n💡 Coping Strategy: Practice box breathing - Breathe in for 4 counts, hold for 4, breathe out for 4, hold for 4. Repeat 4 times."
      ],
      stressed: [
        "Stress can be really tough to handle. Remember to be kind to yourself. Have you been able to take any breaks today?\n\n💡 Coping Strategy: Take a 5-minute break. Step away from what's stressing you, stretch, or take a short walk.",
        "I hear that you're feeling stressed. It's important to acknowledge when things feel like too much. What's been weighing on you?\n\n💡 Coping Strategy: Make a to-do list and prioritize. Break large tasks into smaller, manageable steps."
      ],
      angry: [
        "I can sense you're feeling frustrated or angry. Those feelings are valid. Would you like to talk about what's upsetting you?\n\n💡 Coping Strategy: Take a timeout. Step away from the situation and give yourself space to cool down.",
        "Anger is a natural emotion. It's okay to feel this way. Taking a few deep breaths might help. What's triggering these feelings?"
      ],
      neutral: [
        "I'm here to listen. How are you feeling today?",
        "Thank you for sharing with me. What's on your mind?",
        "I'm here to support you. How can I help you today?"
      ]
    };

    const moodResponses = responses[mood] || responses.neutral;
    return moodResponses[Math.floor(Math.random() * moodResponses.length)];
  }

  private static async updateMoodAnalytics(sessionUuid: string, mood: string): Promise<void> {
    try {
      const existing = await supabase
        .from('mood_analytics')
        .select('*')
        .eq('session_id', sessionUuid)
        .eq('mood', mood)
        .maybeSingle();

      if (existing.data) {
        await supabase
          .from('mood_analytics')
          .update({
            count: existing.data.count + 1,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.data.id);
      } else {
        await supabase
          .from('mood_analytics')
          .insert({
            session_id: sessionUuid,
            mood,
            count: 1,
            updated_at: new Date().toISOString()
          });
      }
    } catch (error) {
      console.error('Error updating mood analytics:', error);
    }
  }
}
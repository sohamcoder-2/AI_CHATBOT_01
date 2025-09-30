import { ChatMessage as ChatMessageType } from '../types/chat';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  message: ChatMessageType;
}

const moodColors: Record<string, string> = {
  happy: 'bg-green-100 border-green-300',
  sad: 'bg-blue-100 border-blue-300',
  anxious: 'bg-yellow-100 border-yellow-300',
  stressed: 'bg-orange-100 border-orange-300',
  angry: 'bg-red-100 border-red-300',
  crisis: 'bg-red-200 border-red-500',
  neutral: 'bg-gray-100 border-gray-300'
};

export function ChatMessage({ message }: ChatMessageProps) {
  const isBot = message.message_type === 'bot';
  const moodClass = message.detected_mood ? moodColors[message.detected_mood] : '';

  return (
    <div className={`flex gap-3 ${isBot ? 'justify-start' : 'justify-end'} mb-4 animate-fade-in`}>
      {isBot && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
      )}

      <div className={`max-w-[75%] ${isBot ? 'order-2' : 'order-1'}`}>
        <div
          className={`rounded-2xl px-4 py-3 ${
            isBot
              ? 'bg-white border border-gray-200 shadow-sm'
              : `border ${moodClass || 'bg-teal-600 text-white'}`
          }`}
        >
          <p className={`text-sm leading-relaxed whitespace-pre-wrap ${isBot ? 'text-gray-800' : 'text-gray-900'}`}>
            {message.message_text}
          </p>
        </div>

        {message.detected_mood && message.detected_mood !== 'neutral' && !isBot && (
          <div className="mt-1 text-xs text-gray-500 px-2">
            Mood detected: {message.detected_mood}
          </div>
        )}

        <div className="mt-1 text-xs text-gray-400 px-2">
          {new Date(message.created_at).toLocaleTimeString()}
        </div>
      </div>

      {!isBot && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
      )}
    </div>
  );
}
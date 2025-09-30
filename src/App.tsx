import { useState, useEffect, useRef } from 'react';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { DisclaimerModal } from './components/DisclaimerModal';
import { EmergencyBanner } from './components/EmergencyBanner';
import { ChatService } from './services/chatService';
import { ChatMessage as ChatMessageType } from './types/chat';
import { Brain, Sparkles } from 'lucide-react';

function App() {
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCrisisBanner, setShowCrisisBanner] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showDisclaimer && !sessionId) {
      initializeSession();
    }
  }, [showDisclaimer]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeSession = async () => {
    const newSessionId = await ChatService.createSession();
    if (newSessionId) {
      setSessionId(newSessionId);

      const welcomeMessage: ChatMessageType = {
        id: crypto.randomUUID(),
        session_id: newSessionId,
        message_type: 'bot',
        message_text: "Hello! I'm here to listen and support you. How are you feeling today? Feel free to share what's on your mind - this is a safe space.",
        detected_mood: 'neutral',
        confidence_score: 0,
        created_at: new Date().toISOString()
      };
      setMessages([welcomeMessage]);
    }
  };

  const handleAcceptDisclaimer = () => {
    setShowDisclaimer(false);
  };

  const handleSendMessage = async (messageText: string) => {
    if (!sessionId) return;

    const userMessage: ChatMessageType = {
      id: crypto.randomUUID(),
      session_id: sessionId,
      message_type: 'user',
      message_text: messageText,
      created_at: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    const response = await ChatService.sendMessage(sessionId, messageText);

    if (response) {
      if (response.is_crisis) {
        setShowCrisisBanner(true);
      }

      const botMessage: ChatMessageType = {
        id: crypto.randomUUID(),
        session_id: sessionId,
        message_type: 'bot',
        message_text: response.response,
        detected_mood: response.mood,
        created_at: new Date().toISOString()
      };

      setMessages((prev) => [...prev, botMessage]);
    } else {
      const errorMessage: ChatMessageType = {
        id: crypto.randomUUID(),
        session_id: sessionId,
        message_type: 'bot',
        message_text: "I'm having trouble responding right now. Please try again in a moment.",
        created_at: new Date().toISOString()
      };
      setMessages((prev) => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  if (showDisclaimer) {
    return <DisclaimerModal onAccept={handleAcceptDisclaimer} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-md">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Mental Health Support Chat</h1>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              AI-powered empathetic support
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto px-4 py-6">
          {showCrisisBanner && <EmergencyBanner />}

          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {isLoading && (
            <div className="flex justify-start gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-teal-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-teal-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-teal-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
      </main>

      <footer className="bg-white border-t border-gray-200 py-3">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-xs text-gray-500">
            This is an AI chatbot and not a substitute for professional mental health care.
            In crisis? Call 988 or text HOME to 741741
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;

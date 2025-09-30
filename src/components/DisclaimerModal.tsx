import { AlertCircle } from 'lucide-react';

interface DisclaimerModalProps {
  onAccept: () => void;
}

export function DisclaimerModal({ onAccept }: DisclaimerModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-fade-in">
        <div className="flex items-start gap-4 mb-4">
          <div className="flex-shrink-0 w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Important Disclaimer</h2>
            <div className="text-sm text-gray-600 space-y-3 leading-relaxed">
              <p>
                This AI Mental Health Chatbot is a college project designed to provide empathetic support
                and coping strategies. However, please understand:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>This is <strong>NOT a replacement for professional therapy</strong> or medical advice</li>
                <li>This bot cannot diagnose mental health conditions</li>
                <li>In case of emergency or crisis, please contact professional help immediately</li>
                <li>Your conversations are stored anonymously for educational purposes</li>
              </ul>
              <p className="font-medium text-gray-800">
                If you're experiencing a mental health crisis, please contact:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>National Suicide Prevention Lifeline: <strong>988</strong></li>
                <li>Crisis Text Line: Text <strong>HOME to 741741</strong></li>
                <li>Your local emergency services: <strong>911</strong></li>
              </ul>
            </div>
          </div>
        </div>

        <button
          onClick={onAccept}
          className="w-full mt-6 px-6 py-3 bg-teal-600 text-white rounded-full hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all font-medium"
        >
          I Understand - Continue
        </button>
      </div>
    </div>
  );
}
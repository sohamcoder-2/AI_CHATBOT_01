import { AlertTriangle, Phone } from 'lucide-react';

export function EmergencyBanner() {
  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-red-800 mb-1">Crisis Detected</h3>
          <p className="text-sm text-red-700 mb-2">
            If you're in immediate danger or having thoughts of harming yourself, please get help right now:
          </p>
          <div className="space-y-1 text-sm">
            <a
              href="tel:988"
              className="flex items-center gap-2 text-red-800 hover:text-red-900 font-medium"
            >
              <Phone className="w-4 h-4" />
              Call 988 - Suicide & Crisis Lifeline
            </a>
            <p className="text-red-700">
              Or text <strong>HOME</strong> to <strong>741741</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
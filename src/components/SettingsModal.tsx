import React from 'react';
import { 
  X, 
  ShieldCheck, 
  Type, 
  Sparkles, 
  Volume2, 
  Trash2, 
  Check, 
  Eye,
  Lock
} from 'lucide-react';
import { AppSettings } from '../types';
import { saveAppSettings, clearAllSessions } from '../services/storageService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  const handleFontSizeChange = (size: 'normal' | 'large' | 'extra-large') => {
    const updated = { ...settings, fontSize: size };
    onUpdateSettings(updated);
    saveAppSettings(updated);
  };

  const handleToggle = (key: keyof AppSettings) => {
    const updated = { ...settings, [key]: !settings[key] };
    onUpdateSettings(updated);
    saveAppSettings(updated);
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all saved family sessions from this browser?')) {
      clearAllSessions();
      alert('All local data cleared.');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border-2 border-[#E7DFD5] max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E7DFD5] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#DCFCE7] text-[#15803D] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#292524]">
                Settings & Family Privacy
              </h3>
              <p className="text-xs text-[#78716C]">
                Accessibility & on-device security
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-[#F5EFE6]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Privacy Card */}
        <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E7DFD5] space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#15803D]">
            <Lock className="w-3.5 h-3.5" />
            <span>100% On-Device Privacy</span>
          </div>
          <p className="text-xs text-[#57534E] leading-relaxed">
            Your family’s conversations, answers, and reflection takeaways are stored strictly in this browser’s private LocalStorage. We never sell, track, or share your family data.
          </p>
        </div>

        {/* Accessibility: Font Size */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#292524] uppercase tracking-wider">
            <Type className="w-4 h-4 text-[#9333EA]" />
            <span>Reading Font Size</span>
          </div>
          <p className="text-xs text-[#78716C]">
            Make text easier to read for grandparents or younger readers on a shared screen.
          </p>
          <div className="grid grid-cols-3 gap-2 pt-1">
            {[
              { id: 'normal', label: 'Standard (16px)' },
              { id: 'large', label: 'Large (18px)' },
              { id: 'extra-large', label: 'Extra Large (20px)' },
            ].map((size) => (
              <button
                key={size.id}
                onClick={() => handleFontSizeChange(size.id as any)}
                className={`p-2.5 rounded-xl text-xs font-bold border-2 transition-all ${
                  settings.fontSize === size.id
                    ? 'bg-[#EDE9FE] border-[#9333EA] text-[#6D28D9]'
                    : 'bg-white border-[#E7DFD5] text-[#57534E] hover:bg-[#F5EFE6]'
                }`}
              >
                {size.label}
              </button>
            ))}
          </div>
        </div>

        {/* Toggles */}
        <div className="space-y-3 pt-1 border-t border-[#F5F2EB]">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-[#292524]">
                Reduced Motion
              </div>
              <div className="text-[11px] text-[#78716C]">
                Turn off card transitions for gentler visuals
              </div>
            </div>
            <button
              onClick={() => handleToggle('reducedMotion')}
              className={`w-11 h-6 rounded-full transition-colors p-0.5 border ${
                settings.reducedMotion ? 'bg-[#9333EA] border-[#7E22CE]' : 'bg-stone-200 border-stone-300'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  settings.reducedMotion ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-[#292524]">
                High Contrast Pastels
              </div>
              <div className="text-[11px] text-[#78716C]">
                Sharper borders and darker text on cards
              </div>
            </div>
            <button
              onClick={() => handleToggle('highContrast')}
              className={`w-11 h-6 rounded-full transition-colors p-0.5 border ${
                settings.highContrast ? 'bg-[#9333EA] border-[#7E22CE]' : 'bg-stone-200 border-stone-300'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  settings.highContrast ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Clear Data */}
        <div className="pt-2 border-t border-[#E7DFD5] flex items-center justify-between">
          <button
            onClick={handleClearData}
            className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Saved Data</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#9333EA] text-white font-bold text-xs hover:bg-[#7E22CE] transition-colors"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};

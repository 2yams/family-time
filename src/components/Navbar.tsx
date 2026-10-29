import React from 'react';
import { Sparkles, BookOpen, BookmarkCheck, Settings, HeartHandshake } from 'lucide-react';
import { AppSettings } from '../types';

interface NavbarProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  onOpenSettings: () => void;
  settings: AppSettings;
  activeSessionInProgress: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  onNavigate,
  onOpenSettings,
  activeSessionInProgress,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF6F0]/95 backdrop-blur-md border-b-2 border-[#EADFCF] px-4 py-3 sm:px-6 shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        {/* Brand */}
        <button
          onClick={() => onNavigate('welcome')}
          className="flex items-center gap-2.5 text-left group transition-transform active:scale-95"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FBCFE8] via-[#DDD6FE] to-[#BAE6FD] border-2 border-[#C4B5FD] flex items-center justify-center shadow-sm">
            <HeartHandshake className="w-6 h-6 text-[#6B21A8]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#2E282A]">
                Generation Gap
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold rounded-full bg-[#E9D5FF] text-[#6B21A8] border border-[#D8B4FE]">
                Family Bridge
              </span>
            </div>
            <p className="text-xs text-[#78716C] -mt-0.5 hidden xs:block">
              Listening across ages with empathy
            </p>
          </div>
        </button>

        {/* Navigation links */}
        <nav className="flex items-center gap-1.5 sm:gap-2">
          {activeSessionInProgress && currentScreen !== 'session' && (
            <button
              onClick={() => onNavigate('session')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FEE2E2] border-2 border-[#FCA5A5] text-[#991B1B] text-xs sm:text-sm font-bold animate-pulse hover:bg-[#FECACA] transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
              Resume Session
            </button>
          )}

          <button
            onClick={() => onNavigate('library')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all border ${
              currentScreen === 'library'
                ? 'bg-[#E0F2FE] border-[#7DD3FC] text-[#0369A1] shadow-xs'
                : 'bg-white/80 border-[#E5E0D8] text-[#57534E] hover:bg-[#F3E8FF] hover:border-[#D8B4FE]'
            }`}
            title="Browse Question Library"
          >
            <BookOpen className="w-4 h-4 text-[#0284C7]" />
            <span className="hidden sm:inline">Questions</span>
          </button>

          <button
            onClick={() => onNavigate('saved')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all border ${
              currentScreen === 'saved'
                ? 'bg-[#DCFCE7] border-[#86EFAC] text-[#15803D] shadow-xs'
                : 'bg-white/80 border-[#E5E0D8] text-[#57534E] hover:bg-[#DCFCE7] hover:border-[#86EFAC]'
            }`}
            title="Saved Discoveries"
          >
            <BookmarkCheck className="w-4 h-4 text-[#16A34A]" />
            <span className="hidden sm:inline">Discoveries</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl bg-white/80 border border-[#E5E0D8] text-[#57534E] hover:bg-[#FEF3C7] hover:border-[#FCD34D] transition-colors"
            title="Settings & Privacy"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </nav>
      </div>
    </header>
  );
};

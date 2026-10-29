import React from 'react';
import { Sparkles, BookOpen, BookmarkCheck, Settings, HeartHandshake, Home, Trophy } from 'lucide-react';
import { AppSettings } from '../types';

interface NavbarProps {
  currentScreen: string;
  activeApp: 'portal' | 'generation_gap' | 'football' | 'heritage' | 'flip_find' | 'slang_riddle';
  onNavigate: (screen: string) => void;
  onGoToPortal: () => void;
  onOpenSettings: () => void;
  settings: AppSettings;
  activeSessionInProgress: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  activeApp,
  onNavigate,
  onGoToPortal,
  onOpenSettings,
  activeSessionInProgress,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF6F0]/95 backdrop-blur-md border-b-2 border-[#EADFCF] px-4 py-3 sm:px-6 shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        {/* Brand / Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onGoToPortal}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-2xl bg-white border border-[#E7DFD5] text-[#292524] hover:bg-[#FAF8F5] transition-all text-xs font-black shadow-xs"
            title="Return to Competition Games Portal"
          >
            <Home className="w-4 h-4 text-[#9333EA]" />
            <span className="hidden xs:inline">Game Portal</span>
          </button>

          <button
            onClick={() => {
              if (activeApp === 'generation_gap') onNavigate('welcome');
              else onGoToPortal();
            }}
            className="flex items-center gap-2.5 text-left group transition-transform active:scale-95"
          >
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#FBCFE8] via-[#DDD6FE] to-[#BAE6FD] border-2 border-[#C4B5FD] flex items-center justify-center shadow-xs">
              {activeApp === 'football' ? (
                <span className="text-lg">⚽</span>
              ) : activeApp === 'heritage' ? (
                <span className="text-lg">🦅</span>
              ) : activeApp === 'flip_find' ? (
                <span className="text-lg">🎴</span>
              ) : activeApp === 'slang_riddle' ? (
                <span className="text-lg">💬</span>
              ) : (
                <HeartHandshake className="w-5 h-5 text-[#6B21A8]" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-xl font-bold tracking-tight text-[#2E282A]">
                  {activeApp === 'football'
                    ? 'AI Football Shootout'
                    : activeApp === 'heritage'
                    ? 'Falcon Quest'
                    : activeApp === 'flip_find'
                    ? 'Flip & Find'
                    : activeApp === 'slang_riddle'
                    ? 'Slang & Riddle Duel'
                    : activeApp === 'portal'
                    ? 'Family AI Game Day'
                    : 'Generation Gap'}
                </span>
                <span className="hidden md:inline-block px-2 py-0.5 text-[10px] font-black rounded-full bg-[#E9D5FF] text-[#6B21A8] border border-[#D8B4FE]">
                  ADU Competition
                </span>
              </div>
            </div>
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex items-center gap-1.5 sm:gap-2">
          {activeApp === 'generation_gap' && (
            <>
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
            </>
          )}

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

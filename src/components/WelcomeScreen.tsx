import React from 'react';
import { 
  Play, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  Users, 
  MessageSquareHeart, 
  Hourglass, 
  Footprints, 
  BookHeart,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { MODES } from '../data/questionLibrary';

interface WelcomeScreenProps {
  onStartSession: () => void;
  onLaunchDemo: () => void;
  onBrowseLibrary: () => void;
  onViewSaved: () => void;
  savedCount: number;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onStartSession,
  onLaunchDemo,
  onBrowseLibrary,
  onViewSaved,
  savedCount,
}) => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-10 space-y-10">
      {/* Hero Section */}
      <section className="text-center space-y-5 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EDE9FE] border border-[#DDD6FE] text-[#6D28D9] text-xs sm:text-sm font-bold shadow-xs">
          <Sparkles className="w-4 h-4 text-[#7C3AED]" />
          <span>Interactive Family Perspective Experience</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#2B2627] tracking-tight leading-[1.15]">
          Different generations.{' '}
          <span className="text-[#9333EA] underline decoration-[#F0ABFC] decoration-wavy decoration-2">
            Different perspectives.
          </span>{' '}
          One family learning to understand each other.
        </h1>

        <p className="text-base sm:text-xl text-[#57534E] leading-relaxed max-w-2xl mx-auto">
          Growing up under the same roof doesn’t mean experiencing the world the same way. 
          Generation Gap turns <span className="font-semibold text-[#44403C]">“You don’t understand me”</span> into{' '}
          <span className="font-semibold text-[#9333EA]">“I never knew you felt that way.”</span>
        </p>

        {/* Primary Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <button
            onClick={onStartSession}
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#9333EA] text-white hover:bg-[#7E22CE] font-bold text-base sm:text-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2.5"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Start a Family Session</span>
          </button>

          <button
            onClick={onLaunchDemo}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#FEF3C7] border-2 border-[#FCD34D] text-[#92400E] hover:bg-[#FDE68A] font-bold text-base shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <Eye className="w-5 h-5 text-[#B45309]" />
            <span>Try Instant Live Demo</span>
          </button>
        </div>

        {/* Safe Reassurance Bar */}
        <div className="pt-3 flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm text-[#78716C]">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
            100% Private & Local to this device
          </span>
          <span className="hidden sm:inline text-[#D6D3D1]">•</span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#0284C7]" />
            Pass button at every single prompt
          </span>
          <span className="hidden sm:inline text-[#D6D3D1]">•</span>
          <span className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-[#D97706]" />
            Designed for 1 shared phone or tablet
          </span>
        </div>
      </section>

      {/* The 4 Conversation Modes */}
      <section className="space-y-4">
        <div className="text-center space-y-1">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#292524]">
            Four Thoughtful Ways to Connect
          </h2>
          <p className="text-sm sm:text-base text-[#78716C]">
            Choose a mode tailored for your family’s mood and curiosity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MODES.map((mode) => (
            <div
              key={mode.id}
              className="p-5 sm:p-6 rounded-3xl border-2 transition-all hover:shadow-md flex flex-col justify-between"
              style={{
                backgroundColor: mode.pastelBg,
                borderColor: mode.pastelBorder,
              }}
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span
                    className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/70"
                    style={{ color: mode.accentColor }}
                  >
                    {mode.tagline}
                  </span>
                  {mode.id === 'same_question' && <MessageSquareHeart className="w-5 h-5 text-[#9333EA]" />}
                  {mode.id === 'then_vs_now' && <Hourglass className="w-5 h-5 text-[#D97706]" />}
                  {mode.id === 'walk_in_shoes' && <Footprints className="w-5 h-5 text-[#0284C7]" />}
                  {mode.id === 'untold_stories' && <BookHeart className="w-5 h-5 text-[#16A34A]" />}
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-[#292524]">
                  {mode.name}
                </h3>
                <p className="text-sm text-[#57534E] leading-relaxed">
                  {mode.description}
                </p>
              </div>

              <div className="pt-4 mt-2 border-t border-black/5 flex items-center justify-between text-xs font-bold" style={{ color: mode.accentColor }}>
                <span>Curated & Respectful</span>
                <span className="flex items-center gap-1 group-hover:underline">
                  Select in setup <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Signature Interaction Highlight */}
      <section className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#E7DFD5] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1 max-w-xl">
            <span className="px-3 py-1 text-xs font-bold rounded-full bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0]">
              Signature Interaction
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-[#292524]">
              The Perspective Reveal
            </h3>
            <p className="text-sm text-[#57534E] leading-relaxed">
              Family members type or speak privately on the shared device. 
              Only when everyone is ready does the screen reveal side-by-side answers, 
              gently highlighting shared core values, surprising overlaps, and respectful conversation sparks.
            </p>
          </div>

          <button
            onClick={onLaunchDemo}
            className="shrink-0 px-5 py-2.5 rounded-2xl bg-[#F3E8FF] border-2 border-[#D8B4FE] text-[#7E22CE] hover:bg-[#E9D5FF] font-bold text-sm shadow-xs transition-colors flex items-center gap-2"
          >
            <span>Preview the Reveal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mini Preview Mockup */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3.5 rounded-2xl bg-[#FEF3C7] border border-[#FDE68A] text-xs space-y-1.5">
            <div className="font-bold text-[#92400E] flex items-center gap-1.5">
              <span>👵 Eleanor (Grandparent)</span>
            </div>
            <p className="text-[#78350F] italic">
              "Quiet loyalty and sitting together without needing noise."
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#E0F2FE] border border-[#BAE6FD] text-xs space-y-1.5">
            <div className="font-bold text-[#0369A1] flex items-center gap-1.5">
              <span>👨 Marcus (Parent)</span>
            </div>
            <p className="text-[#075985] italic">
              "Reliability at 2 AM, and honest advice with complete trust."
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FCE7F3] border border-[#FBCFE8] text-xs space-y-1.5">
            <div className="font-bold text-[#9D174D] flex items-center gap-1.5">
              <span>👧 Maya (Teen)</span>
            </div>
            <p className="text-[#831843] italic">
              "Listening without judging and sending memes to brighten a day."
            </p>
          </div>
        </div>
      </section>

      {/* Quick Links Footer */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-4 border-t border-[#E5E0D8]">
        <button
          onClick={onBrowseLibrary}
          className="text-xs sm:text-sm font-bold text-[#6B21A8] hover:underline"
        >
          📖 Explore All 40+ Curated Questions
        </button>
        <span className="text-[#D6D3D1]">•</span>
        <button
          onClick={onViewSaved}
          className="text-xs sm:text-sm font-bold text-[#15803D] hover:underline"
        >
          📂 View Saved Discoveries ({savedCount})
        </button>
      </div>
    </div>
  );
};

import React from 'react';
import { 
  Trophy, 
  Sparkles, 
  HeartHandshake, 
  Play, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  Users, 
  Award,
  Zap,
  BookHeart,
  MessageSquare
} from 'lucide-react';

interface CompetitionPortalProps {
  onSelectApp: (app: 'generation_gap' | 'football' | 'heritage' | 'flip_find' | 'slang_riddle') => void;
}

export const CompetitionPortal: React.FC<CompetitionPortalProps> = ({ onSelectApp }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 space-y-10 animate-in fade-in">
      {/* University & Competition Branding Header */}
      <section className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FEF3C7] border border-[#FCD34D] text-[#92400E] text-xs sm:text-sm font-black shadow-xs">
          <span>🏆 Abu Dhabi University • Family AI Game Day Competition</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-[#292524] tracking-tight leading-tight">
          A family chooses the fun.{' '}
          <span className="text-[#9333EA] underline decoration-[#F0ABFC] decoration-wavy decoration-2">
            Your app hosts it
          </span>{' '}
          and judges fairly.
        </h1>

        <p className="text-base sm:text-lg text-[#57534E] leading-relaxed max-w-2xl mx-auto">
          Welcome to our competition showcase! Explore our family experiences inspired by culture, sports, generational understanding, and friendly multiplayer duels.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-bold text-[#78716C] pt-1">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#15803D]" />
            Single Shared Device (Hotseat Play)
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-[#D97706]" />
            Timing Mechanics & Physics
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#9333EA]" />
            100% Error-Free & Aesthetic
          </span>
        </div>
      </section>

      {/* CORE GAMES GRID */}
      <section className="space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-[#292524]">
            Select an Experience to Play
          </h2>
          <p className="text-xs sm:text-sm text-[#78716C]">
            All games run on this single shared screen for family game night.
          </p>
        </div>

        {/* PRIMARY 3 GAMES IN MAIN GROUP */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* 1. GENERATION GAP */}
          <div className="p-6 rounded-3xl bg-[#F3E8FF] border-2 border-[#D8B4FE] flex flex-col justify-between shadow-xs hover:shadow-md transition-all hover:-translate-y-1">
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-white/80 text-[#9333EA] border border-[#D8B4FE]">
                  Perspective & Stories
                </span>
                <span className="text-2xl">🤝</span>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-xl font-black text-[#292524]">
                  Generation Gap
                </h3>
                <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
                  Turn "You don't understand me" into "I never knew you felt that way." Thoughtful question library, turn-by-turn answering, and signature side-by-side perspective reveal.
                </p>
              </div>

              <div className="space-y-1 text-xs text-[#6B21A8] font-bold pt-2 border-t border-[#D8B4FE]/60">
                <div>• 4 Conversation Modes</div>
                <div>• 40+ Curated Question Library</div>
                <div>• Neutral AI Perspective Synthesis</div>
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={() => onSelectApp('generation_gap')}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#9333EA] hover:bg-[#7E22CE] text-white font-black text-sm shadow-sm transition-all flex items-center justify-center gap-2 group"
              >
                <span>Open Generation Gap</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* 2. TIMING FOOTBALL DUEL (LOCAL MULTIPLAYER) */}
          <div className="p-6 rounded-3xl bg-[#DCFCE7] border-2 border-[#BBF7D0] flex flex-col justify-between shadow-xs hover:shadow-md transition-all hover:-translate-y-1">
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-white/80 text-[#15803D] border border-[#BBF7D0]">
                  Local Multiplayer Duel
                </span>
                <span className="text-2xl">⚽</span>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-xl font-black text-[#292524]">
                  Timing Football Shootout
                </h3>
                <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
                  Real timing-based challenge! Time your aim needle and power meter into the green sweet spot for 100+ km/h rockets. Opponent dives as Goalkeeper!
                </p>
              </div>

              <div className="space-y-1 text-xs text-[#15803D] font-bold pt-2 border-t border-[#BBF7D0]/60">
                <div>• Oscillating Aim & Power Gauges</div>
                <div>• True Velocity Math (km/h)</div>
                <div>• Striker vs. Keeper Local Hotseat</div>
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={() => onSelectApp('football')}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#15803D] hover:bg-[#166534] text-white font-black text-sm shadow-sm transition-all flex items-center justify-center gap-2 group"
              >
                <span>Play Football Shootout</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* 3. FALCON HERITAGE QUEST */}
          <div className="p-6 rounded-3xl bg-[#FEF3C7] border-2 border-[#FCD34D] flex flex-col justify-between shadow-xs hover:shadow-md transition-all hover:-translate-y-1">
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-white/80 text-[#92400E] border border-[#FCD34D]">
                  Culture & Heritage
                </span>
                <span className="text-2xl">🦅</span>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-xl font-black text-[#292524]">
                  Falcon Heritage Quest
                </h3>
                <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
                  An original family competition celebrating Emirati heritage! Fast-paced falcon reflexes, Gahwa coffee etiquette, and pearl diver sea chants.
                </p>
              </div>

              <div className="space-y-1 text-xs text-[#92400E] font-bold pt-2 border-t border-[#FCD34D]/60">
                <div>• Falconry & Heritage Trivia</div>
                <div>• Millisecond Reaction Timing</div>
                <div>• Cultural Fair-Play Judge & MVP</div>
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={() => onSelectApp('heritage')}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#D97706] hover:bg-[#B45309] text-white font-black text-sm shadow-sm transition-all flex items-center justify-center gap-2 group"
              >
                <span>Launch Falcon Quest</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* ADDITIONAL GAMES SECTION BELOW FALCON QUEST */}
        <div className="pt-4 space-y-4">
          <div className="text-center space-y-1">
            <span className="text-xs font-black uppercase tracking-wider text-[#9333EA] bg-[#EDE9FE] px-3 py-1 rounded-full border border-[#DDD6FE]">
              ⭐ More Family Party Fun
            </span>
            <h3 className="text-lg sm:text-xl font-black text-[#292524]">
              Cozy Multi-Generational Games
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* 4. FAMILY FLIP & FIND (THE GENERATION MATCH GAME) */}
            <div className="p-6 rounded-3xl bg-[#FFFDF6] border-2 border-[#E7DFD5] flex flex-col justify-between shadow-xs hover:shadow-md transition-all">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#EDE9FE] text-[#6D28D9] border border-[#DDD6FE]">
                    12-Card Memory Match
                  </span>
                  <span className="text-2xl">🎴</span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-lg font-black text-[#292524]">
                    Family Flip & Find
                  </h4>
                  <p className="text-xs text-[#57534E] leading-relaxed">
                    Match Then & Now cards on a 3x4 grid (Boombox + Earbuds, Arcade + VR). Unlocks a warm <strong>Story Spark Card</strong> with a prompt for the room and adds to the Family Trophy Shelf!
                  </p>
                </div>

                <div className="space-y-1 text-xs text-[#15803D] font-bold">
                  <div>• 3 Thematic Decks (Tech, School, Traditions)</div>
                  <div>• Instant 1-Click Quick Play</div>
                  <div>• Exportable Family Memory Journal</div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => onSelectApp('flip_find')}
                  className="w-full py-3 px-4 rounded-2xl bg-[#9333EA] hover:bg-[#7E22CE] text-white font-black text-sm shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <span>Play Family Flip & Find</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 5. GENERATION SLANG & RIDDLE DUEL */}
            <div className="p-6 rounded-3xl bg-[#FFFDF6] border-2 border-[#E7DFD5] flex flex-col justify-between shadow-xs hover:shadow-md transition-all">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#FEF3C7] text-[#92400E] border border-[#FCD34D]">
                    Fast Word Duel
                  </span>
                  <span className="text-2xl">💬</span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-lg font-black text-[#292524]">
                    Generation Slang & Riddle Duel
                  </h4>
                  <p className="text-xs text-[#57534E] leading-relaxed">
                    Teens try to decipher classic 80s/90s sayings ("Be kind, rewind", "Drop a dime"), while parents & grandparents crack modern emoji slang ("No cap", "Let him cook")!
                  </p>
                </div>

                <div className="space-y-1 text-xs text-[#92400E] font-bold">
                  <div>• 30-Second Rapid-Fire Rounds</div>
                  <div>• Interactive Clues & Hints</div>
                  <div>• Generational Translator Fun</div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => onSelectApp('slang_riddle')}
                  className="w-full py-3 px-4 rounded-2xl bg-[#D97706] hover:bg-[#B45309] text-white font-black text-sm shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <span>Play Slang & Riddle Duel</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Sparkles, 
  ArrowLeft, 
  Play, 
  RotateCcw, 
  Clock, 
  Users, 
  Check, 
  X, 
  Lightbulb, 
  Award,
  HelpCircle,
  Zap
} from 'lucide-react';

interface Riddle {
  id: string;
  era: 'retro' | 'modern';
  phraseOrEmoji: string;
  meaning: string;
  hint: string;
  eraLabel: string;
  exampleContext: string;
}

const RIDDLE_DATA: Riddle[] = [
  // Retro Slang & Sayings (Teens & Kids guess what older relatives mean!)
  {
    id: 'r1',
    era: 'retro',
    phraseOrEmoji: '📼 "Be kind, rewind"',
    meaning: 'Rewinding VHS movie tapes before returning them to the rental store',
    hint: 'Think Blockbuster video stores and rental tapes!',
    eraLabel: '1980s-1990s Saying',
    exampleContext: 'Printed on stickers on top of VHS cassette tapes.',
  },
  {
    id: 'r2',
    era: 'retro',
    phraseOrEmoji: '☎️ "Don\'t touch that dial!"',
    meaning: 'Tuning old cathode-ray TVs by hand turning a clunky mechanical knob',
    hint: 'Before TV remotes had 50 buttons, what did you physically turn?',
    eraLabel: '1970s-1980s TV Era',
    exampleContext: 'TV hosts shouted this before cutting to commercial breaks.',
  },
  {
    id: 'r3',
    era: 'retro',
    phraseOrEmoji: '🪙 "Drop a dime"',
    meaning: 'Making a phone call on a payphone (or reporting something)',
    hint: 'How much did a payphone call use to cost in silver coins?',
    eraLabel: '1970s Payphone Slang',
    exampleContext: 'Walking up to a street corner phone booth with a dime.',
  },
  {
    id: 'r4',
    era: 'retro',
    phraseOrEmoji: '📻 "Sounds like a broken record"',
    meaning: 'Repeating the exact same thing over and over again',
    hint: 'What happened when a vinyl needle got stuck in a scratch groove?',
    eraLabel: 'Vinyl Record Era',
    exampleContext: 'Parents telling kids: "I sound like a broken record, clean your room!"',
  },
  {
    id: 'r5',
    era: 'retro',
    phraseOrEmoji: '🖐️ "Talk to the hand!"',
    meaning: 'I am not listening to you anymore!',
    hint: 'A famous 90s dismissal gesture with an open palm.',
    eraLabel: '1990s Pop Culture',
    exampleContext: '"Talk to the hand, because the face don\'t want to hear it!"',
  },

  // Modern Slang & Emoji Riddles (Parents & Grandparents guess what younger folks mean!)
  {
    id: 'm1',
    era: 'modern',
    phraseOrEmoji: '🧢 "No cap"',
    meaning: 'For real / not lying / total honesty',
    hint: 'If "cap" means a fake story or exaggeration, what does "no cap" mean?',
    eraLabel: 'Gen Z / Gen Alpha Slang',
    exampleContext: '"That was the best dessert of my entire life, no cap!"',
  },
  {
    id: 'm2',
    era: 'modern',
    phraseOrEmoji: '🍳 "Let him cook"',
    meaning: 'Give someone space to do their thing or show their skills',
    hint: 'Not about the kitchen; it means let them work their magic!',
    eraLabel: 'Modern Internet Slang',
    exampleContext: 'When someone starts explaining a clever plan.',
  },
  {
    id: 'm3',
    era: 'modern',
    phraseOrEmoji: '🧠 "Living rent-free in my head"',
    meaning: 'Obsessively thinking about a song, funny video, or moment',
    hint: 'Paying zero rent, but staying in your brain all day!',
    eraLabel: 'Social Media Era',
    exampleContext: '"That catchy TV theme song is living rent-free in my mind."',
  },
  {
    id: 'm4',
    era: 'modern',
    phraseOrEmoji: '👻 "Ghosting"',
    meaning: 'Suddenly disappearing and not replying to texts or calls',
    hint: 'Like a ghost vanishing into thin air without warning.',
    eraLabel: 'Digital Messaging Era',
    exampleContext: 'When someone stops answering messages out of nowhere.',
  },
  {
    id: 'm5',
    era: 'modern',
    phraseOrEmoji: '✨ "Main character energy"',
    meaning: 'Carrying yourself with confidence like the star of a movie',
    hint: 'Not a background extra, but the hero of the story!',
    eraLabel: 'Modern Youth Slang',
    exampleContext: '"Grandma walking in with her stylish sunglasses has main character energy."',
  },
];

interface EmojiSlangRiddleProps {
  onBackToPortal: () => void;
}

export const EmojiSlangRiddle: React.FC<EmojiSlangRiddleProps> = ({ onBackToPortal }) => {
  const [gameState, setGameState] = useState<'SETUP' | 'PLAYING' | 'RESULTS'>('SETUP');

  const [teamOldSchool, setTeamOldSchool] = useState<string>('Old School Pioneers');
  const [teamNewWave, setTeamNewWave] = useState<string>('New Wave Trendsetters');

  const [scoreOldSchool, setScoreOldSchool] = useState<number>(0);
  const [scoreNewWave, setScoreNewWave] = useState<number>(0);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [revealedAnswer, setRevealedAnswer] = useState<boolean>(false);

  const [timerSeconds, setTimerSeconds] = useState<number>(30);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Active Riddle
  const activeRiddle = RIDDLE_DATA[currentIndex % RIDDLE_DATA.length];
  // If it's a retro riddle, the New Wave team guesses! If modern, Old School guesses!
  const guessingTeam = activeRiddle.era === 'retro' ? teamNewWave : teamOldSchool;
  const defendingTeam = activeRiddle.era === 'retro' ? teamOldSchool : teamNewWave;

  useEffect(() => {
    let interval: any = null;
    if (gameState === 'PLAYING' && isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((t) => Math.max(0, t - 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState, isTimerRunning, timerSeconds]);

  const startNextRiddle = (nextIdx: number) => {
    if (nextIdx >= RIDDLE_DATA.length) {
      setGameState('RESULTS');
      return;
    }
    setCurrentIndex(nextIdx);
    setShowHint(false);
    setRevealedAnswer(false);
    setTimerSeconds(30);
    setIsTimerRunning(true);
  };

  const handleStartGame = () => {
    setScoreOldSchool(0);
    setScoreNewWave(0);
    setCurrentIndex(0);
    setGameState('PLAYING');
    startNextRiddle(0);
  };

  const handleAwardPoint = (isCorrect: boolean) => {
    setIsTimerRunning(false);
    setRevealedAnswer(true);

    if (isCorrect) {
      if (activeRiddle.era === 'retro') {
        setScoreNewWave((s) => s + 100);
      } else {
        setScoreOldSchool((s) => s + 100);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E7DFD5] pb-4">
        <button
          onClick={onBackToPortal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E7DFD5] text-xs sm:text-sm font-bold text-[#57534E] hover:bg-[#F5EFE6] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Competition Portal</span>
        </button>

        <div className="text-center">
          <span className="text-xs font-black uppercase tracking-wider text-[#D97706]">
            Fast Family Party Game
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-[#292524] flex items-center justify-center gap-2">
            <span>💬</span> Generation Slang & Riddle Duel
          </h1>
        </div>

        <div className="w-16" />
      </div>

      {/* 1. SETUP */}
      {gameState === 'SETUP' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#E7DFD5] space-y-6 shadow-xs">
          <div className="text-center space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black text-[#292524]">
              Can You Speak Each Other’s Generation?
            </h2>
            <p className="text-xs sm:text-sm text-[#78716C] max-w-lg mx-auto">
              Teens decipher nostalgic retro phrases (like "Be kind, rewind"), while parents and grandparents crack modern emoji slang (like "No cap" or "Let him cook")!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-[#EDE9FE] border-2 border-[#DDD6FE] space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#6D28D9]">
                Team 1: Old School
              </span>
              <input
                type="text"
                value={teamOldSchool}
                onChange={(e) => setTeamOldSchool(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#DDD6FE] font-bold text-sm text-[#6D28D9]"
              />
              <p className="text-[11px] text-[#7C3AED]">
                Guesses modern internet slang and emoji expressions!
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#DCFCE7] border-2 border-[#BBF7D0] space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#15803D]">
                Team 2: New Wave
              </span>
              <input
                type="text"
                value={teamNewWave}
                onChange={(e) => setTeamNewWave(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#BBF7D0] font-bold text-sm text-[#15803D]"
              />
              <p className="text-[11px] text-[#16A34A]">
                Guesses vintage sayings, TV habits, and cassette slang!
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleStartGame}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#9333EA] hover:bg-[#7E22CE] text-white font-black text-base shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Start Riddle Duel!</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. PLAYING SCREEN */}
      {gameState === 'PLAYING' && (
        <div className="space-y-4">
          {/* Live Scoreboard */}
          <div className="p-4 rounded-3xl bg-white border-2 border-[#E7DFD5] shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-[#EDE9FE] text-[#6D28D9] font-black text-xl flex items-center justify-center">
                {scoreOldSchool}
              </div>
              <div>
                <div className="text-xs font-bold text-[#6D28D9]">{teamOldSchool}</div>
                <div className="text-[10px] text-[#78716C]">Old School</div>
              </div>
            </div>

            <div className="text-center">
              <span className="text-[10px] font-black uppercase text-[#9333EA] bg-[#FAF8F5] px-2 py-0.5 rounded-full border border-[#E7DFD5]">
                Card {currentIndex + 1} of {RIDDLE_DATA.length}
              </span>
              <div className="text-xl font-black text-[#292524] flex items-center justify-center gap-1 mt-0.5">
                <Clock className="w-4 h-4 text-[#D97706]" />
                <span>{timerSeconds}s</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 flex-row-reverse text-right">
              <div className="w-10 h-10 rounded-2xl bg-[#DCFCE7] text-[#15803D] font-black text-xl flex items-center justify-center">
                {scoreNewWave}
              </div>
              <div>
                <div className="text-xs font-bold text-[#15803D]">{teamNewWave}</div>
                <div className="text-[10px] text-[#78716C]">New Wave</div>
              </div>
            </div>
          </div>

          {/* Turn Banner */}
          <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E7DFD5] flex items-center justify-between text-xs font-bold">
            <div className="flex items-center gap-2">
              <span className="text-stone-400">Guessing Now:</span>
              <span className="text-[#9333EA] font-extrabold text-sm">{guessingTeam}</span>
            </div>
            <div className="text-[#78716C]">{activeRiddle.eraLabel}</div>
          </div>

          {/* Mystery Riddle Card */}
          <div
            className={`p-8 rounded-3xl border-4 text-center space-y-5 shadow-xs transition-colors ${
              activeRiddle.era === 'retro'
                ? 'bg-[#FEF3C7] border-[#FCD34D]'
                : 'bg-[#E0F2FE] border-[#BAE6FD]'
            }`}
          >
            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-white/80 text-xs font-black uppercase tracking-wider text-[#57534E]">
                {activeRiddle.era === 'retro' ? '🕰️ Vintage Slang Riddle' : '📱 Modern Emoji Slang'}
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-[#292524] pt-2">
                {activeRiddle.phraseOrEmoji}
              </h2>
            </div>

            {/* Hint Box */}
            {showHint && (
              <div className="max-w-md mx-auto p-3.5 rounded-2xl bg-white/90 border border-black/10 text-xs text-[#57534E] font-medium animate-in fade-in">
                💡 <span className="font-bold">Hint:</span> {activeRiddle.hint}
              </div>
            )}

            {/* Reveal Answer Box */}
            {revealedAnswer && (
              <div className="max-w-md mx-auto p-4 rounded-2xl bg-white border-2 border-[#9333EA] text-center space-y-1 animate-in zoom-in-95">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#9333EA]">
                  Official Meaning:
                </span>
                <p className="text-sm sm:text-base font-black text-[#292524]">
                  "{activeRiddle.meaning}"
                </p>
                <p className="text-xs text-[#78716C] italic pt-1">
                  Context: {activeRiddle.exampleContext}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              {!showHint && !revealedAnswer && (
                <button
                  onClick={() => setShowHint(true)}
                  className="px-4 py-2 rounded-xl bg-white border border-[#E7DFD5] text-xs font-bold text-[#57534E] hover:bg-[#FAF8F5]"
                >
                  Need a Hint? 💡
                </button>
              )}

              {!revealedAnswer ? (
                <>
                  <button
                    onClick={() => handleAwardPoint(true)}
                    className="px-6 py-3 rounded-2xl bg-[#15803D] hover:bg-[#166534] text-white font-black text-sm shadow-sm flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Guessed Correctly! (+100 PTS)</span>
                  </button>
                  <button
                    onClick={() => handleAwardPoint(false)}
                    className="px-4 py-3 rounded-2xl bg-white border-2 border-[#E7DFD5] text-[#78716C] hover:bg-[#FAF8F5] font-bold text-xs"
                  >
                    Reveal & Pass
                  </button>
                </>
              ) : (
                <button
                  onClick={() => startNextRiddle(currentIndex + 1)}
                  className="px-8 py-3 rounded-2xl bg-[#9333EA] hover:bg-[#7E22CE] text-white font-black text-sm shadow-md"
                >
                  Next Riddle Card →
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. FINAL RESULTS */}
      {gameState === 'RESULTS' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#E7DFD5] space-y-6 shadow-xs animate-in zoom-in-95 text-center">
          <div className="space-y-2">
            <span className="px-3.5 py-1 rounded-full bg-[#FEF3C7] border border-[#FCD34D] text-[#92400E] text-xs font-black uppercase">
              🎉 Slang Duel Concluded
            </span>
            <h2 className="text-3xl font-black text-[#292524]">
              {scoreOldSchool > scoreNewWave
                ? `🏆 ${teamOldSchool} Knows Both Worlds!`
                : scoreNewWave > scoreOldSchool
                ? `🏆 ${teamNewWave} Cracks the Vintage Code!`
                : '🤝 An Absolute Draw! Both Generations Connected!'}
            </h2>
            <div className="text-2xl font-black text-[#9333EA]">
              {scoreOldSchool} PTS - {scoreNewWave} PTS
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              onClick={handleStartGame}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white border-2 border-[#E7DFD5] text-[#292524] hover:bg-[#FAF8F5] font-bold text-sm"
            >
              Play Again
            </button>
            <button
              onClick={onBackToPortal}
              className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-[#9333EA] text-white hover:bg-[#7E22CE] font-bold text-sm shadow-md"
            >
              Back to Competition Games Portal →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

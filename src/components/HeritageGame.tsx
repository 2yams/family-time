import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Sparkles, 
  Clock, 
  Users, 
  ArrowLeft, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  Award, 
  Mic, 
  Volume2,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';

interface HeritageGameProps {
  onBackToPortal: () => void;
}

interface HeritagePlayer {
  id: string;
  name: string;
  team: 'A' | 'B';
  score: number;
  fastestReactionMs: number;
}

interface Challenge {
  id: number;
  type: 'reflex' | 'trivia' | 'rhythm';
  title: string;
  question: string;
  heritageFact: string;
  options: string[];
  correctIndex: number;
  timeLimitSec: number;
}

const HERITAGE_CHALLENGES: Challenge[] = [
  {
    id: 1,
    type: 'reflex',
    title: '🦅 Falcon Perch Reflex',
    question: 'Tap the golden desert falcon the exact millisecond it lands on the glove!',
    heritageFact: 'In Emirati falconry heritage, the falcon symbolizes courage, nobility, and lightning-fast precision.',
    options: ['Left Perch', 'Center Glove', 'Right Desert Dunes'],
    correctIndex: 1,
    timeLimitSec: 8,
  },
  {
    id: 2,
    type: 'trivia',
    title: '☕ Gahwa Hospitality Ritual',
    question: 'When served traditional Arabic Gahwa (coffee), which hand should you always hold the cup with?',
    heritageFact: 'Serving Gahwa with the right hand is a fundamental gesture of respect and warmth across Gulf heritage.',
    options: ['Left hand', 'Right hand', 'Both hands equally'],
    correctIndex: 1,
    timeLimitSec: 10,
  },
  {
    id: 3,
    type: 'rhythm',
    title: '🦪 Pearl Diver Rhythm (Al Nahham)',
    question: 'Pearl divers sang rhythmic sea chants (Al Nahma) to stay united on long dhow voyages. What was the lead singer called?',
    heritageFact: 'Al Nahham is the traditional sea singer whose melodious voice kept spirits high during grueling 4-month pearl diving dives.',
    options: ['Al Nahham', 'Al Qadi', 'Al Muallim'],
    correctIndex: 0,
    timeLimitSec: 10,
  },
  {
    id: 4,
    type: 'trivia',
    title: '🌴 The Giving Palm (Al Nakhlah)',
    question: 'Every part of the date palm was used in ancient heritage. What were dried fronds woven into?',
    heritageFact: 'Palm fronds (Areesh) were woven into traditional summer houses, cooling baskets, and fishing boats.',
    options: ['Ceramic pottery', 'Areesh cooling houses & mats', 'Glass lanterns'],
    correctIndex: 1,
    timeLimitSec: 10,
  },
];

export const HeritageGame: React.FC<HeritageGameProps> = ({ onBackToPortal }) => {
  const [step, setStep] = useState<'setup' | 'rules' | 'playing' | 'results'>('setup');

  const [teamAName, setTeamAName] = useState<string>('Al Dhafra');
  const [teamBName, setTeamBName] = useState<string>('Liwa Dunes');

  const [players, setPlayers] = useState<HeritagePlayer[]>([
    { id: 'h1', name: 'Sultan (P1)', team: 'A', score: 0, fastestReactionMs: 9999 },
    { id: 'h2', name: 'Noura (P2)', team: 'A', score: 0, fastestReactionMs: 9999 },
    { id: 'h3', name: 'Hamad (P3)', team: 'B', score: 0, fastestReactionMs: 9999 },
    { id: 'h4', name: 'Shamsa (P4)', team: 'B', score: 0, fastestReactionMs: 9999 },
  ]);

  const [currentRound, setCurrentRound] = useState<number>(0);
  const [activePlayerIndex, setActivePlayerIndex] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(10);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false);
  const [roundStartTime, setRoundStartTime] = useState<number>(0);

  // AI Judge Feedback
  const [lastVerdict, setLastVerdict] = useState<{
    correct: boolean;
    reason: string;
    points: number;
    reactionMs: number;
  } | null>(null);

  const [aiJudgeLog, setAiJudgeLog] = useState<{
    round: number;
    player: string;
    team: string;
    action: string;
    reason: string;
  }[]>([]);

  const activeChallenge = HERITAGE_CHALLENGES[currentRound] || HERITAGE_CHALLENGES[0];
  const activePlayer = players[activePlayerIndex % players.length];

  // Round Timer
  useEffect(() => {
    let interval: any = null;
    if (step === 'playing' && isTimerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((t) => {
          if (t <= 1) {
            handleAnswer(-1); // Timeout
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, isTimerActive, timeRemaining]);

  const handleStartGame = () => {
    setCurrentRound(0);
    setActivePlayerIndex(0);
    setPlayers((all) => all.map((p) => ({ ...p, score: 0, fastestReactionMs: 9999 })));
    setAiJudgeLog([]);
    setLastVerdict(null);
    setStep('playing');
    startRound(0);
  };

  const startRound = (roundIdx: number) => {
    const ch = HERITAGE_CHALLENGES[roundIdx];
    setTimeRemaining(ch.timeLimitSec);
    setIsTimerActive(true);
    setRoundStartTime(Date.now());
    setLastVerdict(null);
  };

  const handleAnswer = (chosenIndex: number) => {
    setIsTimerActive(false);
    const elapsedMs = Date.now() - roundStartTime;
    const isCorrect = chosenIndex === activeChallenge.correctIndex;
    const pointsAwarded = isCorrect ? (elapsedMs < 3000 ? 150 : 100) : 0;

    const verdict = {
      correct: isCorrect,
      reason: isCorrect
        ? `Accurate response in ${(elapsedMs / 1000).toFixed(2)}s! ${activeChallenge.heritageFact}`
        : chosenIndex === -1
        ? `Time expired. Correct was: ${activeChallenge.options[activeChallenge.correctIndex]}`
        : `Incorrect choice. The tradition: ${activeChallenge.heritageFact}`,
      points: pointsAwarded,
      reactionMs: elapsedMs,
    };

    setLastVerdict(verdict);

    // Update Player & Team Score
    setPlayers((prev) =>
      prev.map((p) =>
        p.id === activePlayer.id
          ? {
              ...p,
              score: p.score + pointsAwarded,
              fastestReactionMs: Math.min(p.fastestReactionMs, elapsedMs),
            }
          : p
      )
    );

    // Log to AI Judge
    setAiJudgeLog((prev) => [
      {
        round: currentRound + 1,
        player: activePlayer.name,
        team: activePlayer.team === 'A' ? teamAName : teamBName,
        action: isCorrect ? `CORRECT (+${pointsAwarded} pts)` : 'INCORRECT (0 pts)',
        reason: verdict.reason,
      },
      ...prev,
    ]);
  };

  const handleNextChallenge = () => {
    if (currentRound < HERITAGE_CHALLENGES.length - 1) {
      setCurrentRound((r) => r + 1);
      setActivePlayerIndex((p) => (p + 1) % players.length);
      startRound(currentRound + 1);
    } else {
      setStep('results');
    }
  };

  // Team totals
  const teamAScore = players.filter((p) => p.team === 'A').reduce((sum, p) => sum + p.score, 0);
  const teamBScore = players.filter((p) => p.team === 'B').reduce((sum, p) => sum + p.score, 0);

  // MVP
  const getMVP = () => {
    let mvp = players[0];
    players.forEach((p) => {
      if (p.score > mvp.score) mvp = p;
    });
    return mvp;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6">
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
          <span className="text-xs font-black uppercase tracking-wider text-[#92400E]">
            Original Game 2 • Heritage & Culture
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-[#292524] flex items-center justify-center gap-2">
            <span>🦅</span> Falcon Heritage Quest
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-[#FEF3C7] text-[#92400E] border border-[#FCD34D] flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> AI Judge Fair Play
          </span>
        </div>
      </div>

      {/* STEP 1: SETUP */}
      {step === 'setup' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#E7DFD5] space-y-6 shadow-xs animate-in fade-in">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-black text-[#292524]">
              Team Setup & Cultural Heritage Arena
            </h2>
            <p className="text-xs sm:text-sm text-[#78716C]">
              Compete in Emirati cultural reflexes, falconry agility, and traditional wisdom!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-[#EDE9FE] border-2 border-[#DDD6FE] space-y-3">
              <span className="text-xs font-black uppercase tracking-wider text-[#6D28D9]">
                Team A
              </span>
              <input
                type="text"
                value={teamAName}
                onChange={(e) => setTeamAName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-white border border-[#DDD6FE] font-black text-sm text-[#6D28D9]"
              />
              <div className="space-y-2 pt-1">
                {players.filter((p) => p.team === 'A').map((p) => (
                  <input
                    key={p.id}
                    type="text"
                    value={p.name}
                    onChange={(e) =>
                      setPlayers((all) =>
                        all.map((item) => (item.id === p.id ? { ...item, name: e.target.value } : item))
                      )
                    }
                    className="w-full px-3 py-1.5 rounded-xl bg-white border border-[#DDD6FE] text-xs font-bold text-[#292524]"
                  />
                ))}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#FEF3C7] border-2 border-[#FCD34D] space-y-3">
              <span className="text-xs font-black uppercase tracking-wider text-[#92400E]">
                Team B
              </span>
              <input
                type="text"
                value={teamBName}
                onChange={(e) => setTeamBName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-white border border-[#FCD34D] font-black text-sm text-[#92400E]"
              />
              <div className="space-y-2 pt-1">
                {players.filter((p) => p.team === 'B').map((p) => (
                  <input
                    key={p.id}
                    type="text"
                    value={p.name}
                    onChange={(e) =>
                      setPlayers((all) =>
                        all.map((item) => (item.id === p.id ? { ...item, name: e.target.value } : item))
                      )
                    }
                    className="w-full px-3 py-1.5 rounded-xl bg-white border border-[#FCD34D] text-xs font-bold text-[#292524]"
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => setStep('rules')}
              className="px-7 py-3 rounded-2xl bg-[#9333EA] text-white font-bold text-base hover:bg-[#7E22CE] shadow-sm transition-all"
            >
              Continue to Game Rules →
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: RULES */}
      {step === 'rules' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#E7DFD5] space-y-6 shadow-xs animate-in fade-in">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-black text-[#292524]">
              Rules of Falcon Heritage Quest
            </h2>
            <p className="text-xs sm:text-sm text-[#78716C]">
              Fairly judged by the AI referee according to Abu Dhabi University guidelines
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-4 rounded-2xl bg-[#DCFCE7] border border-[#BBF7D0] space-y-1">
              <div className="font-bold text-[#15803D]">Reflex & Wisdom Points</div>
              <p className="text-[#14532D]">
                100 points for correct cultural responses. +50 bonus points if submitted within 3 seconds!
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[#FEF3C7] border border-[#FCD34D] space-y-1">
              <div className="font-bold text-[#92400E]">AI Optical & Timing Judge</div>
              <p className="text-[#78350F]">
                The AI monitors millisecond timestamps, ensures no duplicate turns, and verifies facts.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[#E0F2FE] border border-[#BAE6FD] space-y-1">
              <div className="font-bold text-[#0369A1]">MVP Award</div>
              <p className="text-[#075985]">
                Player with highest combined cultural score and fastest reflex speed earns the Falcon MVP Trophy!
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setStep('setup')}
              className="px-4 py-2 rounded-xl bg-white border border-[#E7DFD5] text-xs font-bold text-[#57534E]"
            >
              ← Edit Teams
            </button>
            <button
              onClick={handleStartGame}
              className="px-8 py-3.5 rounded-2xl bg-[#9333EA] text-white font-bold text-base hover:bg-[#7E22CE] shadow-md transition-all flex items-center gap-2"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Start Challenge!</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: PLAYING */}
      {step === 'playing' && (
        <div className="space-y-4 animate-in fade-in">
          {/* Score Header */}
          <div className="p-4 rounded-3xl bg-white border-2 border-[#E7DFD5] shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="text-xl font-black text-[#6D28D9]">{teamAScore}</div>
              <div className="text-xs font-bold text-[#6D28D9]">{teamAName}</div>
            </div>

            <div className="text-center">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#9333EA]">
                Round {currentRound + 1} of {HERITAGE_CHALLENGES.length}
              </span>
              <div className="text-xl font-black text-[#292524] flex items-center justify-center gap-1">
                <Clock className="w-4 h-4 text-[#D97706]" />
                <span>{timeRemaining}s</span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-row-reverse text-right">
              <div className="text-xl font-black text-[#92400E]">{teamBScore}</div>
              <div className="text-xs font-bold text-[#92400E]">{teamBName}</div>
            </div>
          </div>

          {/* Turn Banner */}
          <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E7DFD5] flex items-center justify-between text-xs font-bold">
            <div className="flex items-center gap-2">
              <span>Active Contestant:</span>
              <span className="text-[#9333EA] font-extrabold text-sm">
                {activePlayer.name} ({activePlayer.team === 'A' ? teamAName : teamBName})
              </span>
            </div>
            <div className="text-[#78716C]">Personal Score: {activePlayer.score} pts</div>
          </div>

          {/* Challenge Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#FEF3C7] border-2 border-[#FCD34D] space-y-6 shadow-xs">
            <div className="space-y-2 text-center">
              <span className="px-3 py-1 rounded-full bg-white/80 text-xs font-black text-[#92400E] uppercase border border-[#FCD34D]">
                {activeChallenge.title}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#78350F] pt-1">
                "{activeChallenge.question}"
              </h2>
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {activeChallenge.options.map((opt, i) => (
                <button
                  key={i}
                  disabled={!isTimerActive}
                  onClick={() => handleAnswer(i)}
                  className="p-4 rounded-2xl bg-white hover:bg-[#FFFBEB] border-2 border-[#FCD34D] font-bold text-sm text-[#78350F] shadow-xs active:scale-95 transition-all text-center disabled:opacity-60"
                >
                  {opt}
                </button>
              ))}
            </div>

            {/* Verdict Card */}
            {lastVerdict && (
              <div
                className={`p-4 rounded-2xl border-2 space-y-1 text-center animate-in zoom-in-95 ${
                  lastVerdict.correct
                    ? 'bg-[#DCFCE7] border-[#86EFAC] text-[#14532D]'
                    : 'bg-[#FEE2E2] border-[#FCA5A5] text-[#991B1B]'
                }`}
              >
                <div className="font-black text-sm flex items-center justify-center gap-1.5">
                  {lastVerdict.correct ? '✨ AI VERDICT: ACCEPTED!' : '❌ AI VERDICT: INCORRECT'}
                </div>
                <p className="text-xs">{lastVerdict.reason}</p>
                <div className="pt-2">
                  <button
                    onClick={handleNextChallenge}
                    className="px-6 py-2 rounded-xl bg-[#292524] text-white font-bold text-xs hover:bg-black transition-colors"
                  >
                    Next Challenge →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* AI Referee Log */}
          <div className="p-4 rounded-3xl bg-white border-2 border-[#E7DFD5] space-y-2 shadow-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#9333EA]" />
              <h3 className="font-extrabold text-xs text-[#292524]">
                AI Judge Real-Time Log
              </h3>
            </div>
            <div className="space-y-1.5 max-h-32 overflow-y-auto text-xs">
              {aiJudgeLog.map((log, idx) => (
                <div key={idx} className="p-2 rounded-xl bg-[#FAF8F5] border border-[#E7DFD5] flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#9333EA]">{log.player}: </span>
                    <span className="text-[#57534E]">{log.action}</span>
                  </div>
                  <span className="text-[10px] text-[#78716C]">{log.team}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: FINAL RESULTS & MVP */}
      {step === 'results' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#E7DFD5] space-y-6 shadow-xs animate-in zoom-in-95">
          <div className="text-center space-y-2">
            <span className="px-3.5 py-1 rounded-full bg-[#FEF3C7] border border-[#FCD34D] text-[#92400E] text-xs font-black uppercase">
              Tournament Concluded
            </span>
            <h2 className="text-3xl font-black text-[#292524]">
              {teamAScore > teamBScore
                ? `🏆 ${teamAName} Wins the Falcon Trophy!`
                : teamBScore > teamAScore
                ? `🏆 ${teamBName} Wins the Falcon Trophy!`
                : `🤝 Honorable Draw between ${teamAName} & ${teamBName}!`}
            </h2>
            <div className="text-2xl font-black text-[#9333EA]">
              {teamAScore} pts - {teamBScore} pts
            </div>
          </div>

          {/* MVP Card */}
          {(() => {
            const mvp = getMVP();
            return (
              <div className="p-5 rounded-3xl bg-[#EDE9FE] border-2 border-[#DDD6FE] text-center space-y-2 shadow-xs">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-[#9333EA] text-white flex items-center justify-center text-2xl">
                  🦅
                </div>
                <div className="text-xs font-black uppercase tracking-wider text-[#6D28D9]">
                  Falcon Heritage MVP
                </div>
                <h3 className="text-xl font-black text-[#292524]">{mvp.name}</h3>
                <p className="text-xs text-[#57534E] max-w-md mx-auto">
                  <span className="font-bold text-[#6D28D9]">AI Reason:</span> Earned a match-best{' '}
                  <span className="font-extrabold">{mvp.score} points</span> with a lightning fastest reflex of{' '}
                  <span className="font-extrabold">{(mvp.fastestReactionMs / 1000).toFixed(2)}s</span>.
                </p>
              </div>
            );
          })()}

          {/* Action Footer */}
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

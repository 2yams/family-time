import React, { useState, useEffect, useRef } from 'react';
import { 
  Trophy, 
  Play, 
  RotateCcw, 
  ArrowLeft, 
  Clock, 
  Users, 
  Award, 
  Zap, 
  Target, 
  Shield, 
  Sparkles,
  Swords,
  ChevronRight
} from 'lucide-react';

interface FootballGameProps {
  onBackToPortal: () => void;
}

interface Player {
  id: string;
  name: string;
  team: 'A' | 'B';
  score: number;
  shotsTaken: number;
  savesMade: number;
  topSpeedKmh: number;
}

type ShotPhase = 'aiming' | 'power' | 'kicking' | 'resolved';

export const FootballGame: React.FC<FootballGameProps> = ({ onBackToPortal }) => {
  // Setup state
  const [step, setStep] = useState<'setup' | 'playing' | 'results'>('setup');
  const [matchMode, setMatchMode] = useState<'turn_based' | 'penalty_shootout'>('penalty_shootout');
  const [roundsTotal, setRoundsTotal] = useState<number>(5);

  // Players
  const [playerA, setPlayerA] = useState<Player>({
    id: 'p1',
    name: 'Dad & Maya (Team Blue)',
    team: 'A',
    score: 0,
    shotsTaken: 0,
    savesMade: 0,
    topSpeedKmh: 0,
  });

  const [playerB, setPlayerB] = useState<Player>({
    id: 'p2',
    name: 'Grandma & Leo (Team Orange)',
    team: 'B',
    score: 0,
    shotsTaken: 0,
    savesMade: 0,
    topSpeedKmh: 0,
  });

  // Gameplay Round State
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [strikerTeam, setStrikerTeam] = useState<'A' | 'B'>('A');
  const [shotPhase, setShotPhase] = useState<ShotPhase>('aiming');

  // Interactive Timing Mechanics
  // 1. Aim needle oscillates left to right (0% to 100%)
  const [aimPosition, setAimPosition] = useState<number>(50);
  const [aimDirection, setAimDirection] = useState<'right' | 'left'>('right');
  const [lockedAim, setLockedAim] = useState<number>(50);

  // 2. Power bar oscillates 0% to 100%
  const [powerLevel, setPowerLevel] = useState<number>(20);
  const [powerDirection, setPowerDirection] = useState<'up' | 'down'>('up');
  const [lockedPower, setLockedPower] = useState<number>(50);

  // 3. Goalkeeper Choice (Local 2nd Player can tap a dive sector or AI auto-picks)
  const [keeperDive, setKeeperDive] = useState<'left' | 'center' | 'right' | null>(null);

  // Ball animation state
  const [ballCoords, setBallCoords] = useState<{ x: number; y: number }>({ x: 50, y: 82 });
  const [ballScale, setBallScale] = useState<number>(1);
  const [keeperCoords, setKeeperCoords] = useState<number>(50); // percentage

  // Result of current kick
  const [shotVerdict, setShotVerdict] = useState<{
    result: 'goal' | 'saved' | 'missed';
    message: string;
    speedKmh: number;
    detail: string;
  } | null>(null);

  const [matchLog, setMatchLog] = useState<{
    round: number;
    striker: string;
    team: 'A' | 'B';
    speedKmh: number;
    result: string;
    notes: string;
  }[]>([]);

  // Oscillation timers for Aim and Power
  useEffect(() => {
    let animId: any = null;
    if (step === 'playing' && shotPhase === 'aiming') {
      animId = setInterval(() => {
        setAimPosition((prev) => {
          if (prev >= 92) {
            setAimDirection('left');
            return 91;
          }
          if (prev <= 8) {
            setAimDirection('right');
            return 9;
          }
          return aimDirection === 'right' ? prev + 3 : prev - 3;
        });
      }, 25);
    }
    return () => clearInterval(animId);
  }, [step, shotPhase, aimDirection]);

  useEffect(() => {
    let animId: any = null;
    if (step === 'playing' && shotPhase === 'power') {
      animId = setInterval(() => {
        setPowerLevel((prev) => {
          if (prev >= 95) {
            setPowerDirection('down');
            return 94;
          }
          if (prev <= 5) {
            setPowerDirection('up');
            return 6;
          }
          return powerDirection === 'up' ? prev + 4.5 : prev - 4.5;
        });
      }, 20);
    }
    return () => clearInterval(animId);
  }, [step, shotPhase, powerDirection]);

  // Start new match
  const handleStartGame = () => {
    setCurrentRound(1);
    setStrikerTeam('A');
    setShotPhase('aiming');
    setAimPosition(50);
    setPowerLevel(30);
    setLockedAim(50);
    setLockedPower(50);
    setKeeperDive(null);
    setShotVerdict(null);
    setMatchLog([]);
    setBallCoords({ x: 50, y: 82 });
    setBallScale(1);
    setKeeperCoords(50);

    setPlayerA((prev) => ({ ...prev, score: 0, shotsTaken: 0, savesMade: 0, topSpeedKmh: 0 }));
    setPlayerB((prev) => ({ ...prev, score: 0, shotsTaken: 0, savesMade: 0, topSpeedKmh: 0 }));

    setStep('playing');
  };

  // Step 1: Lock Aim
  const handleLockAim = () => {
    if (shotPhase !== 'aiming') return;
    setLockedAim(aimPosition);
    setShotPhase('power');
  };

  // Step 2: Lock Power & Kick
  const handleLockPower = (selectedKeeperDive?: 'left' | 'center' | 'right') => {
    if (shotPhase !== 'power') return;
    setLockedPower(powerLevel);
    setShotPhase('kicking');

    // Keeper dive decision (if not chosen by 2nd player, pick based on smart local odds)
    const diveChoice =
      selectedKeeperDive ||
      (Math.random() < 0.35 ? 'center' : Math.random() < 0.68 ? 'left' : 'right');
    setKeeperDive(diveChoice);

    // Calculate dynamic trajectory
    executeKickAnimation(lockedAim, powerLevel, diveChoice);
  };

  // Calculate real ball physics: trajectory, curve, and realistic velocity in km/h
  const executeKickAnimation = (aim: number, power: number, keeper: 'left' | 'center' | 'right') => {
    // Speed formula: base 45 km/h + up to 60 km/h based on power sweet spot (sweet spot is 70-88%)
    let speed = Math.round(45 + (power / 100) * 55 + (Math.random() * 8));
    if (power > 92) {
      speed += 10; // blasting shot!
    }

    // Determine target coordinate on net
    // aim: 0 = far left, 50 = dead center, 100 = far right
    const targetX = 18 + (aim / 100) * 64; // between 18% and 82% of field width
    const targetY = 22 + (1 - power / 100) * 12; // higher power = top corners

    // Keeper position
    let kTargetX = 50;
    if (keeper === 'left') kTargetX = 28;
    if (keeper === 'right') kTargetX = 72;

    setKeeperCoords(kTargetX);

    // Animate ball moving to net
    setBallCoords({ x: targetX, y: targetY });
    setBallScale(0.48); // Perspective shrink

    setTimeout(() => {
      // Evaluate result
      const isOffTarget = aim < 12 || aim > 88;
      const isOverBar = power > 95 && Math.random() < 0.65; // Overpowered sky ball

      const activeStriker = strikerTeam === 'A' ? playerA : playerB;
      const defendingTeam = strikerTeam === 'A' ? playerB : playerA;

      let verdict: 'goal' | 'saved' | 'missed';
      let message = '';
      let detail = '';

      if (isOverBar) {
        verdict = 'missed';
        message = '🚀 OVER THE CROSSBAR!';
        detail = `Power too high (${powerLevel}%). Ball launched into the stands at ${speed} km/h!`;
      } else if (isOffTarget) {
        verdict = 'missed';
        message = '❌ WIDE OF THE POST!';
        detail = `Aim was too far off-center (${aim}%). Missed the net cleanly.`;
      } else {
        // Check keeper coverage
        // Keeper saves if keeper dive matches shot sector (tolerance ~18%)
        const distanceToKeeper = Math.abs(targetX - kTargetX);
        const keeperSaved = distanceToKeeper < 18;

        if (keeperSaved) {
          verdict = 'saved';
          message = '🧤 SPECTACULAR SAVE!';
          detail = `Keeper guessed ${keeper} and blocked the ${speed} km/h strike!`;
        } else {
          verdict = 'goal';
          const cornerName = targetX < 40 ? 'Bottom/Top Left' : targetX > 60 ? 'Top Right Corner' : 'Center Rocket';
          message = '⚽ GOALLLLL!';
          detail = `Slammed into the ${cornerName} at ${speed} km/h! Unstoppable!`;
        }
      }

      setShotVerdict({
        result: verdict,
        message,
        speedKmh: speed,
        detail,
      });

      // Update Player Stats
      if (strikerTeam === 'A') {
        setPlayerA((p) => ({
          ...p,
          score: verdict === 'goal' ? p.score + 1 : p.score,
          shotsTaken: p.shotsTaken + 1,
          topSpeedKmh: Math.max(p.topSpeedKmh, speed),
        }));
        if (verdict === 'saved') {
          setPlayerB((p) => ({ ...p, savesMade: p.savesMade + 1 }));
        }
      } else {
        setPlayerB((p) => ({
          ...p,
          score: verdict === 'goal' ? p.score + 1 : p.score,
          shotsTaken: p.shotsTaken + 1,
          topSpeedKmh: Math.max(p.topSpeedKmh, speed),
        }));
        if (verdict === 'saved') {
          setPlayerA((p) => ({ ...p, savesMade: p.savesMade + 1 }));
        }
      }

      setMatchLog((prev) => [
        {
          round: currentRound,
          striker: activeStriker.name,
          team: strikerTeam,
          speedKmh: speed,
          result: verdict.toUpperCase(),
          notes: detail,
        },
        ...prev,
      ]);

      setShotPhase('resolved');
    }, 450);
  };

  const handleNextTurn = () => {
    // Reset ball position
    setBallCoords({ x: 50, y: 82 });
    setBallScale(1);
    setKeeperCoords(50);
    setShotVerdict(null);
    setKeeperDive(null);

    // Switch teams
    if (strikerTeam === 'A') {
      setStrikerTeam('B');
      setShotPhase('aiming');
    } else {
      // Completed a full round of both teams
      if (currentRound >= roundsTotal) {
        setStep('results');
      } else {
        setCurrentRound((r) => r + 1);
        setStrikerTeam('A');
        setShotPhase('aiming');
      }
    }
  };

  const currentStriker = strikerTeam === 'A' ? playerA : playerB;
  const currentGoalkeeper = strikerTeam === 'A' ? playerB : playerA;

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
          <span className="text-xs font-black uppercase tracking-wider text-[#15803D]">
            Hotseat Local Multiplayer • 2 Players / 2 Teams
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-[#292524] flex items-center justify-center gap-2">
            <span>⚽</span> Timing Football Shootout
          </h1>
        </div>

        <div className="w-16" />
      </div>

      {/* SETUP SCREEN */}
      {step === 'setup' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#E7DFD5] space-y-6 shadow-xs">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-black text-[#292524]">
              Family Penalty Duel Setup
            </h2>
            <p className="text-xs sm:text-sm text-[#78716C]">
              Pass the device back and forth! One person strikes with timing precision, while the other dives as goalkeeper.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Team 1 */}
            <div className="p-5 rounded-2xl bg-[#E0F2FE] border-2 border-[#BAE6FD] space-y-3">
              <span className="text-xs font-black uppercase tracking-wider text-[#0369A1]">
                Team 1 (Blue Strikers)
              </span>
              <input
                type="text"
                value={playerA.name}
                onChange={(e) => setPlayerA({ ...playerA, name: e.target.value })}
                placeholder="e.g. Dad & Maya"
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#BAE6FD] font-bold text-sm text-[#0369A1]"
              />
              <p className="text-[11px] text-[#075985]">
                Takes the first kick in each round!
              </p>
            </div>

            {/* Team 2 */}
            <div className="p-5 rounded-2xl bg-[#FEF3C7] border-2 border-[#FCD34D] space-y-3">
              <span className="text-xs font-black uppercase tracking-wider text-[#92400E]">
                Team 2 (Orange Defenders)
              </span>
              <input
                type="text"
                value={playerB.name}
                onChange={(e) => setPlayerB({ ...playerB, name: e.target.value })}
                placeholder="e.g. Grandma & Leo"
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#FCD34D] font-bold text-sm text-[#92400E]"
              />
              <p className="text-[11px] text-[#78350F]">
                Guards the goal first, then steps up to strike!
              </p>
            </div>
          </div>

          {/* Number of Rounds */}
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E7DFD5] flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-[#292524]">Shootout Length</div>
              <div className="text-[11px] text-[#78716C]">Number of penalty rounds per team</div>
            </div>
            <div className="flex gap-2">
              {[3, 5, 7].map((num) => (
                <button
                  key={num}
                  onClick={() => setRoundsTotal(num)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                    roundsTotal === num
                      ? 'bg-[#9333EA] text-white border-[#7E22CE]'
                      : 'bg-white border-[#E7DFD5] text-[#57534E]'
                  }`}
                >
                  {num} Rounds
                </button>
              ))}
            </div>
          </div>

          {/* How Timing Works */}
          <div className="p-4 rounded-2xl bg-[#DCFCE7] border border-[#BBF7D0] space-y-1.5 text-xs text-[#14532D]">
            <div className="font-bold flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-[#15803D]" />
              <span>Skill-Based Timing Rules:</span>
            </div>
            <p>
              1. Tap <strong>"Lock Aim"</strong> when the horizontal target needle is pointing inside the net corners.
            </p>
            <p>
              2. Tap <strong>"Power Strike!"</strong> when the power gauge reaches the green sweet spot for maximum ball velocity (up to 110 km/h)!
            </p>
            <p>
              3. The defending player can secretly choose to dive Left, Stay Center, or dive Right!
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleStartGame}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#15803D] hover:bg-[#166534] text-white font-black text-base shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Kick Off Family Shootout!</span>
            </button>
          </div>
        </div>
      )}

      {/* GAMEPLAY SCREEN */}
      {step === 'playing' && (
        <div className="space-y-4">
          {/* Live Scoreboard */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white border-2 border-[#E7DFD5] shadow-xs flex items-center justify-between">
            {/* Team A */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#E0F2FE] border-2 border-[#BAE6FD] flex items-center justify-center text-2xl font-black text-[#0369A1]">
                {playerA.score}
              </div>
              <div>
                <div className="text-xs font-bold text-[#0369A1]">{playerA.name}</div>
                <div className="text-[11px] text-[#78716C]">
                  {playerA.shotsTaken > 0 ? `Max: ${playerA.topSpeedKmh} km/h` : 'Ready'}
                </div>
              </div>
            </div>

            {/* Round info */}
            <div className="text-center">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#9333EA] bg-[#EDE9FE] px-2.5 py-0.5 rounded-full border border-[#DDD6FE]">
                Round {currentRound} of {roundsTotal}
              </span>
              <div className="text-xs font-bold text-[#57534E] mt-1">
                {strikerTeam === 'A' ? 'Team 1 Kicking' : 'Team 2 Kicking'}
              </div>
            </div>

            {/* Team B */}
            <div className="flex items-center gap-3 flex-row-reverse text-right">
              <div className="w-12 h-12 rounded-2xl bg-[#FEF3C7] border-2 border-[#FCD34D] flex items-center justify-center text-2xl font-black text-[#92400E]">
                {playerB.score}
              </div>
              <div>
                <div className="text-xs font-bold text-[#92400E]">{playerB.name}</div>
                <div className="text-[11px] text-[#78716C]">
                  {playerB.shotsTaken > 0 ? `Max: ${playerB.topSpeedKmh} km/h` : 'Ready'}
                </div>
              </div>
            </div>
          </div>

          {/* Turn Banner with Striker vs Keeper indicator */}
          <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E7DFD5] flex flex-col sm:flex-row items-center justify-between text-xs font-bold gap-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-lg bg-[#9333EA] text-white text-[10px]">STRIKER</span>
              <span className="text-[#292524] text-sm">{currentStriker.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-lg bg-[#57534E] text-white text-[10px]">GOALKEEPER</span>
              <span className="text-[#57534E] text-sm">{currentGoalkeeper.name}</span>
            </div>
          </div>

          {/* Interactive Visual Football Field */}
          <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-3xl bg-gradient-to-b from-[#A7F3D0] to-[#6EE7B7] border-4 border-[#059669] overflow-hidden shadow-inner flex flex-col justify-between p-4 select-none">
            {/* The Goal */}
            <div className="relative w-4/5 sm:w-3/5 mx-auto h-24 border-4 border-dashed border-white bg-white/20 rounded-t-2xl flex items-center justify-center">
              {/* Left, Center, Right Aim Targets */}
              <div className="absolute inset-0 grid grid-cols-3 divide-x-2 divide-dashed divide-white/40 pointer-events-none">
                <div className="flex items-start justify-center pt-1 text-[10px] font-bold text-white/80">LEFT</div>
                <div className="flex items-start justify-center pt-1 text-[10px] font-bold text-white/80">CENTER</div>
                <div className="flex items-start justify-center pt-1 text-[10px] font-bold text-white/80">RIGHT</div>
              </div>

              {/* Goalkeeper with real position */}
              <div
                className="absolute bottom-1 transition-all duration-300 text-3xl select-none"
                style={{ left: `${keeperCoords}%`, transform: 'translateX(-50%)' }}
              >
                🧤
              </div>
            </div>

            {/* Penalty Spot */}
            <div className="w-4 h-4 rounded-full bg-white mx-auto shadow-sm" />

            {/* The Ball */}
            <div
              className="absolute text-4xl transition-all duration-400 ease-out pointer-events-none drop-shadow-lg z-20"
              style={{
                left: `${ballCoords.x}%`,
                top: `${ballCoords.y}%`,
                transform: `translate(-50%, -50%) scale(${ballScale})`,
              }}
            >
              ⚽
            </div>

            {/* Verdict Alert overlay */}
            {shotVerdict && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-30 animate-in zoom-in-95">
                <div className="p-6 rounded-3xl bg-white text-center space-y-2.5 max-w-sm mx-4 shadow-2xl border-4 border-[#9333EA]">
                  <div className="text-2xl font-black text-[#292524]">{shotVerdict.message}</div>
                  <div className="text-xs font-bold text-[#15803D] bg-[#DCFCE7] px-3 py-1 rounded-xl inline-block">
                    Velocity: {shotVerdict.speedKmh} km/h
                  </div>
                  <p className="text-xs text-[#57534E] leading-relaxed">{shotVerdict.detail}</p>
                  <button
                    onClick={handleNextTurn}
                    className="w-full py-3 rounded-2xl bg-[#9333EA] text-white font-black text-sm hover:bg-[#7E22CE] shadow-sm transition-all"
                  >
                    Next Turn →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* CONTROLS AREA: TIMING AIM & POWER GAUGES */}
          {!shotVerdict && (
            <div className="p-5 sm:p-6 rounded-3xl bg-white border-2 border-[#E7DFD5] space-y-4 shadow-xs">
              {/* PHASE 1: OSCILLATING AIM GAUGE */}
              {shotPhase === 'aiming' && (
                <div className="space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#9333EA] uppercase tracking-wider flex items-center gap-1.5">
                      <Target className="w-4 h-4" /> Step 1: Time Your Shot Angle
                    </span>
                    <span className="text-xs text-[#78716C]">Tap when needle enters net zone</span>
                  </div>

                  {/* Visual gauge */}
                  <div className="relative h-9 rounded-2xl bg-[#FAF8F5] border-2 border-[#E7DFD5] overflow-hidden flex items-center">
                    {/* Goal sector highlight */}
                    <div className="absolute inset-y-0 left-[18%] right-[18%] bg-[#A7F3D0]/60 border-x-2 border-dashed border-[#059669]" />
                    <div className="absolute inset-y-0 left-[42%] right-[42%] bg-[#FEF3C7]/80" />

                    {/* Moving needle */}
                    <div
                      className="absolute top-0 bottom-0 w-2.5 bg-[#9333EA] shadow-md rounded-full transition-none"
                      style={{ left: `${aimPosition}%`, transform: 'translateX(-50%)' }}
                    />
                  </div>

                  <div className="flex justify-between text-[11px] font-bold text-[#78716C] px-1">
                    <span>Far Left (Wide)</span>
                    <span className="text-[#059669]">Goal Sector</span>
                    <span>Far Right (Wide)</span>
                  </div>

                  <button
                    onClick={handleLockAim}
                    className="w-full py-4 rounded-2xl bg-[#9333EA] hover:bg-[#7E22CE] text-white font-black text-base shadow-md active:scale-98 transition-all flex items-center justify-center gap-2"
                  >
                    <Target className="w-5 h-5" />
                    <span>Lock Aim Angle!</span>
                  </button>
                </div>
              )}

              {/* PHASE 2: OSCILLATING POWER GAUGE & KEEPER DIVE SELECTION */}
              {shotPhase === 'power' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#15803D] uppercase tracking-wider flex items-center gap-1.5">
                      <Zap className="w-4 h-4" /> Step 2: Power Meter Sweet Spot!
                    </span>
                    <span className="text-xs text-[#78716C]">Aim Locked at {lockedAim}%</span>
                  </div>

                  {/* Power Gauge */}
                  <div className="relative h-9 rounded-2xl bg-[#FAF8F5] border-2 border-[#E7DFD5] overflow-hidden flex items-center">
                    {/* Sweet spot zone (65% to 88%) */}
                    <div className="absolute inset-y-0 left-[65%] w-[23%] bg-[#A7F3D0] border-x-2 border-[#059669]" />
                    {/* Danger red zone (93%+) */}
                    <div className="absolute inset-y-0 right-0 w-[8%] bg-[#FCA5A5]" />

                    {/* Moving level bar */}
                    <div
                      className="h-full bg-gradient-to-r from-[#BAE6FD] via-[#FCD34D] to-[#EF4444] transition-none"
                      style={{ width: `${powerLevel}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[11px] font-bold text-[#78716C] px-1">
                    <span>Gentle (Low Speed)</span>
                    <span className="text-[#059669]">⭐ Sweet Spot (90+ km/h)</span>
                    <span className="text-[#EF4444]">Danger (Over Bar)</span>
                  </div>

                  {/* Goalkeeper Hotseat Dive Choice */}
                  <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E7DFD5] space-y-2">
                    <div className="text-xs font-bold text-[#57534E] flex items-center justify-between">
                      <span>🧤 {currentGoalkeeper.name} (Keeper): Choose Dive Sector</span>
                      <span className="text-[10px] text-[#78716C]">Or tap Fire for auto-dive</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => handleLockPower('left')}
                        className="py-2.5 rounded-xl bg-white hover:bg-[#E0F2FE] border border-[#E7DFD5] text-xs font-bold text-[#0369A1]"
                      >
                        Dive Left
                      </button>
                      <button
                        onClick={() => handleLockPower('center')}
                        className="py-2.5 rounded-xl bg-white hover:bg-[#FEF3C7] border border-[#E7DFD5] text-xs font-bold text-[#92400E]"
                      >
                        Stay Center
                      </button>
                      <button
                        onClick={() => handleLockPower('right')}
                        className="py-2.5 rounded-xl bg-white hover:bg-[#E0F2FE] border border-[#E7DFD5] text-xs font-bold text-[#0369A1]"
                      >
                        Dive Right
                      </button>
                    </div>
                  </div>

                  {/* Striker Tap Button */}
                  <button
                    onClick={() => handleLockPower()}
                    className="w-full py-4 rounded-2xl bg-[#15803D] hover:bg-[#166534] text-white font-black text-base shadow-md active:scale-98 transition-all flex items-center justify-center gap-2"
                  >
                    <Zap className="w-5 h-5 fill-current" />
                    <span>STRIKE THE BALL!</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Match Log */}
          {matchLog.length > 0 && (
            <div className="p-4 rounded-3xl bg-white border-2 border-[#E7DFD5] space-y-2 shadow-xs">
              <div className="text-xs font-bold text-[#292524] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#9333EA]" />
                <span>Shootout Match Feed</span>
              </div>
              <div className="space-y-1.5 max-h-32 overflow-y-auto text-xs">
                {matchLog.map((log, i) => (
                  <div
                    key={i}
                    className={`p-2 rounded-xl border flex items-center justify-between ${
                      log.result === 'GOAL'
                        ? 'bg-[#DCFCE7] border-[#86EFAC] text-[#14532D]'
                        : 'bg-[#FAF8F5] border-[#E7DFD5] text-[#57534E]'
                    }`}
                  >
                    <div>
                      <span className="font-bold">{log.striker}: </span>
                      <span>{log.result} ({log.speedKmh} km/h)</span>
                    </div>
                    <span className="text-[10px] text-[#78716C]">{log.notes}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* FINAL RESULTS SCREEN */}
      {step === 'results' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#E7DFD5] space-y-6 shadow-xs animate-in zoom-in-95 text-center">
          <div className="space-y-2">
            <span className="px-3.5 py-1 rounded-full bg-[#FEF3C7] border border-[#FCD34D] text-[#92400E] text-xs font-black uppercase">
              🏆 Penalty Shootout Concluded
            </span>
            <h2 className="text-3xl font-black text-[#292524]">
              {playerA.score > playerB.score
                ? `${playerA.name} Triumphs!`
                : playerB.score > playerA.score
                ? `${playerB.name} Triumphs!`
                : '🤝 An Incredible Tie! Sudden Death Needed!'}
            </h2>
            <div className="text-3xl font-black text-[#9333EA]">
              {playerA.name}: {playerA.score} - {playerB.score} :{playerB.name}
            </div>
          </div>

          {/* Golden Boot & Golden Glove Awards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-left">
            <div className="p-4 rounded-2xl bg-[#EDE9FE] border border-[#DDD6FE] space-y-1.5">
              <div className="font-black text-[#6D28D9] flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-[#9333EA]" />
                <span>Rocket Strike Award (Top Velocity)</span>
              </div>
              <p className="text-[#4C1D95]">
                Fastest recorded blast:{' '}
                <strong className="text-base">
                  {Math.max(playerA.topSpeedKmh, playerB.topSpeedKmh)} km/h
                </strong>{' '}
                by{' '}
                {playerA.topSpeedKmh >= playerB.topSpeedKmh ? playerA.name : playerB.name}!
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#DCFCE7] border border-[#BBF7D0] space-y-1.5">
              <div className="font-black text-[#15803D] flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-[#16A34A]" />
                <span>Golden Glove (Best Defense)</span>
              </div>
              <p className="text-[#14532D]">
                Total goalkeeper stops made:{' '}
                <strong>{playerA.savesMade + playerB.savesMade} saves</strong> across all rounds.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              onClick={handleStartGame}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white border-2 border-[#E7DFD5] text-[#292524] hover:bg-[#FAF8F5] font-bold text-sm"
            >
              Play Another Shootout
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

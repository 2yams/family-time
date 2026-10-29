import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Sparkles, 
  ArrowLeft, 
  RotateCcw, 
  Users, 
  Check, 
  Copy, 
  BookHeart, 
  Award, 
  Play, 
  MessageSquare,
  HelpCircle,
  Eye,
  Gift
} from 'lucide-react';

interface Player {
  id: string;
  name: string;
  emoji: string;
  color: string;
  score: number;
}

export interface GenerationCard {
  id: string;
  pairId: string;
  title: string;
  eraLabel: string; // e.g. "Then" or "Now"
  emoji: string;
  prompt: string;
}

// Built-in Static Deck Data
export const DECK_TOYS_AND_TECH: GenerationCard[] = [
  { id: '1a', pairId: 'music', title: 'Boombox', eraLabel: 'Then (1980s)', emoji: '📻', prompt: 'What was your favorite song or album when you were a teenager?' },
  { id: '1b', pairId: 'music', title: 'Earbuds', eraLabel: 'Now (2020s)', emoji: '🎧', prompt: 'Show or tell the family what song or artist you listen to most these days!' },
  { id: '2a', pairId: 'games', title: 'Arcade Cabinet', eraLabel: 'Then (1980s)', emoji: '🕹️', prompt: 'What game did you spend all your pocket money or allowance playing?' },
  { id: '2b', pairId: 'games', title: 'VR Headset', eraLabel: 'Now (2020s)', emoji: '🥽', prompt: 'What piece of modern tech felt like science fiction when you were young?' },
  { id: '3a', pairId: 'photos', title: 'Film Camera', eraLabel: 'Then (1990s)', emoji: '📸', prompt: 'Did you have to wait for photo film to develop? Share a funny photo memory!' },
  { id: '3b', pairId: 'photos', title: 'Smartphone', eraLabel: 'Now (2020s)', emoji: '📱', prompt: 'What is one of the oldest or funniest photos on your phone right now?' },
  { id: '4a', pairId: 'travel', title: 'Paper Map', eraLabel: 'Then (1970s)', emoji: '🗺️', prompt: 'Did your family ever get completely lost on a road trip before GPS existed?' },
  { id: '4b', pairId: 'travel', title: 'Satellite GPS', eraLabel: 'Now (2020s)', emoji: '🛰️', prompt: 'What is your favorite family trip or vacation memory of all time?' },
  { id: '5a', pairId: 'mail', title: 'Handwritten Letter', eraLabel: 'Then (1960s)', emoji: '✉️', prompt: 'Who was the first person you ever wrote a physical letter or postcard to?' },
  { id: '5b', pairId: 'mail', title: 'Instant Chat', eraLabel: 'Now (2020s)', emoji: '💬', prompt: 'Who is the person you text or share funny videos with the most every day?' },
  { id: '6a', pairId: 'books', title: 'Library Catalog', eraLabel: 'Then (1980s)', emoji: '📚', prompt: 'What was your favorite book or bedtime story growing up as a child?' },
  { id: '6b', pairId: 'books', title: 'E-Reader', eraLabel: 'Now (2020s)', emoji: '📖', prompt: 'What story or movie can you enjoy over and over without getting bored?' },
];

export const DECK_SCHOOL_AND_LIFE: GenerationCard[] = [
  { id: 's1a', pairId: 'chalk', title: 'Chalkboard', eraLabel: 'Then', emoji: '⬛', prompt: 'Do you remember chalk dust and clapping erasers in the classroom?' },
  { id: 's1b', pairId: 'chalk', title: 'Smart Tablet', eraLabel: 'Now', emoji: '📲', prompt: 'What is your favorite school subject or hobby right now?' },
  { id: 's2a', pairId: 'clock', title: 'Wind-up Clock', eraLabel: 'Then', emoji: '⏰', prompt: 'Did you have a loud ticking alarm clock or did a parent wake you up?' },
  { id: 's2b', pairId: 'clock', title: 'Phone Alarm', eraLabel: 'Now', emoji: '🔔', prompt: 'How many alarms do you set in the morning before getting out of bed?' },
  { id: 's3a', pairId: 'phone', title: 'Rotary Phone', eraLabel: 'Then', emoji: '☎️', prompt: 'Did your house have a telephone cord you had to stretch around corners?' },
  { id: 's3b', pairId: 'phone', title: 'Video Call', eraLabel: 'Now', emoji: '🤳', prompt: 'Who is a family member or friend you love video calling?' },
  { id: 's4a', pairId: 'encyclopedia', title: 'Encyclopedia', eraLabel: 'Then', emoji: '📙', prompt: 'Where did you look up facts before the internet existed?' },
  { id: 's4b', pairId: 'encyclopedia', title: 'Search Engine', eraLabel: 'Now', emoji: '🔍', prompt: 'What is the strangest question you searched online this week?' },
  { id: 's5a', pairId: 'typewriter', title: 'Typewriter', eraLabel: 'Then', emoji: '⌨️', prompt: 'Did you ever use white-out correction tape on a typing mistake?' },
  { id: 's5b', pairId: 'typewriter', title: 'Laptop', eraLabel: 'Now', emoji: '💻', prompt: 'How fast can you type or text with your thumbs?' },
  { id: 's6a', pairId: 'cassette', title: 'Mixtape Cassette', eraLabel: 'Then', emoji: '📼', prompt: 'Did you ever record songs off the radio using a blank cassette tape?' },
  { id: 's6b', pairId: 'cassette', title: 'Streaming Playlist', eraLabel: 'Now', emoji: '🎵', prompt: 'What song immediately puts you in a joyful mood?' },
];

export const DECK_FOOD_AND_TRADITIONS: GenerationCard[] = [
  { id: 'f1a', pairId: 'recipe', title: 'Handwritten Recipe Box', eraLabel: 'Then', emoji: '📝', prompt: 'Is there a family dish or secret recipe passed down by grandparents?' },
  { id: 'f1b', pairId: 'recipe', title: 'Cooking Video App', eraLabel: 'Now', emoji: '🍳', prompt: 'What is your absolute favorite comfort meal to eat together?' },
  { id: 'f2a', pairId: 'dinner', title: 'Sunday Family Table', eraLabel: 'Then', emoji: '🍲', prompt: 'What did family dinners look like when you were 10 years old?' },
  { id: 'f2b', pairId: 'dinner', title: 'Takeout Night', eraLabel: 'Now', emoji: '🥡', prompt: 'If the family could order dinner from anywhere tonight, what would you pick?' },
  { id: 'f3a', pairId: 'boardgame', title: 'Classic Board Game', eraLabel: 'Then', emoji: '🎲', prompt: 'What board game caused the most laughter (or friendly arguments) at home?' },
  { id: 'f3b', pairId: 'boardgame', title: 'Party Video Game', eraLabel: 'Now', emoji: '🎮', prompt: 'What game is the most fun for the whole family to play together?' },
  { id: 'f4a', pairId: 'album', title: 'Heavy Photo Album', eraLabel: 'Then', emoji: '🖼️', prompt: 'Do you remember flipping through sticky plastic photo album pages?' },
  { id: 'f4b', pairId: 'album', title: 'Shared Cloud Album', eraLabel: 'Now', emoji: '☁️', prompt: 'What is one family photo you think everyone cherishes?' },
  { id: 'f5a', pairId: 'craft', title: 'Handmade Knitting', eraLabel: 'Then', emoji: '🧶', prompt: 'Did anyone in your family knit sweaters, quilts, or handmade gifts?' },
  { id: 'f5b', pairId: 'craft', title: 'Custom Print Merch', eraLabel: 'Now', emoji: '👕', prompt: 'What is the most thoughtful gift a family member ever gave you?' },
  { id: 'f6a', pairId: 'holiday', title: 'Holiday Feast Ritual', eraLabel: 'Then', emoji: '🎉', prompt: 'What holiday tradition do you hope this family never stops doing?' },
  { id: 'f6b', pairId: 'holiday', title: 'Family Selfie Tradition', eraLabel: 'Now', emoji: '✨', prompt: 'What is a funny family habit or expression unique to your home?' },
];

interface TrophyRecord {
  pairId: string;
  matchedBy: string;
  cards: [GenerationCard, GenerationCard];
  prompt: string;
  storyNote: string;
}

interface FamilyFlipAndFindProps {
  onBackToPortal: () => void;
}

export const FamilyFlipAndFind: React.FC<FamilyFlipAndFindProps> = ({ onBackToPortal }) => {
  // Screen state machine: 'SETUP' | 'GAMEPLAY' | 'STORY_PROMPT' | 'VICTORY'
  const [gameState, setGameState] = useState<'SETUP' | 'GAMEPLAY' | 'STORY_PROMPT' | 'VICTORY'>('SETUP');

  // Players
  const [players, setPlayers] = useState<Player[]>([
    { id: 'p1', name: 'Grandma Eleanor', emoji: '👵', color: '#DDD6FE', score: 0 },
    { id: 'p2', name: 'Dad Marcus', emoji: '👨', color: '#BBF7D0', score: 0 },
    { id: 'p3', name: 'Maya', emoji: '👧', color: '#FBCFE8', score: 0 },
  ]);

  const [activePlayerIndex, setActivePlayerIndex] = useState<number>(0);
  const [selectedDeckKey, setSelectedDeckKey] = useState<'tech' | 'school' | 'traditions'>('tech');

  // 12-Card Grid
  const [gridCards, setGridCards] = useState<GenerationCard[]>([]);
  const [flippedIndexes, setFlippedIndexes] = useState<number[]>([]);
  const [matchedPairIds, setMatchedPairIds] = useState<string[]>([]);

  // Story Spark Modal state
  const [activeMatchedPair, setActiveMatchedPair] = useState<[GenerationCard, GenerationCard] | null>(null);
  const [storyNoteInput, setStoryNoteInput] = useState<string>('');
  const [sharedAloudDone, setSharedAloudDone] = useState<boolean>(false);

  // Trophy Shelf
  const [trophyVault, setTrophyVault] = useState<TrophyRecord[]>([]);
  const [copiedJournal, setCopiedJournal] = useState<boolean>(false);

  // Shuffle & setup cards
  const startNewGame = (deckChoice: 'tech' | 'school' | 'traditions' = selectedDeckKey) => {
    let rawDeck = DECK_TOYS_AND_TECH;
    if (deckChoice === 'school') rawDeck = DECK_SCHOOL_AND_LIFE;
    if (deckChoice === 'traditions') rawDeck = DECK_FOOD_AND_TRADITIONS;

    // Shuffle 12 cards cleanly
    const shuffled = [...rawDeck].sort(() => Math.random() - 0.5);

    setGridCards(shuffled);
    setFlippedIndexes([]);
    setMatchedPairIds([]);
    setActivePlayerIndex(0);
    setTrophyVault([]);
    setActiveMatchedPair(null);
    setStoryNoteInput('');
    setSharedAloudDone(false);

    // Reset player scores
    setPlayers((prev) => prev.map((p) => ({ ...p, score: 0 })));

    setGameState('GAMEPLAY');
  };

  // Quick Play demo button
  const handleQuickPlayDemo = () => {
    setPlayers([
      { id: 'p1', name: 'Grandma Eleanor', emoji: '👵', color: '#DDD6FE', score: 0 },
      { id: 'p2', name: 'Dad Marcus', emoji: '👨', color: '#BBF7D0', score: 0 },
      { id: 'p3', name: 'Maya (15)', emoji: '👧', color: '#FBCFE8', score: 0 },
    ]);
    setSelectedDeckKey('tech');
    startNewGame('tech');
  };

  // Card click logic with rock-solid state locking
  const handleCardClick = (index: number) => {
    // Zero-bug state locking:
    // 1. If 2 cards already flipped, ignore.
    // 2. If this card is already flipped, ignore.
    // 3. If this card's pair is already matched, ignore.
    const card = gridCards[index];
    if (flippedIndexes.length >= 2) return;
    if (flippedIndexes.includes(index)) return;
    if (matchedPairIds.includes(card.pairId)) return;

    const nextFlipped = [...flippedIndexes, index];
    setFlippedIndexes(nextFlipped);

    // If second card flipped, check for match
    if (nextFlipped.length === 2) {
      const cardA = gridCards[nextFlipped[0]];
      const cardB = gridCards[nextFlipped[1]];

      if (cardA.pairId === cardB.pairId) {
        // MATCH!
        setTimeout(() => {
          setMatchedPairIds((prev) => [...prev, cardA.pairId]);
          setActiveMatchedPair([cardA, cardB]);
          setStoryNoteInput('');
          setSharedAloudDone(false);
          setGameState('STORY_PROMPT');
        }, 500);
      } else {
        // NO MATCH -> pause 1.1s and flip back face-down
        setTimeout(() => {
          setFlippedIndexes([]);
          // Advance turn to next player
          setActivePlayerIndex((curr) => (curr + 1) % players.length);
        }, 1100);
      }
    }
  };

  // Collect Trophy and award score
  const handleCollectTrophy = () => {
    if (!activeMatchedPair) return;

    const activePlayer = players[activePlayerIndex];
    const promptText = activeMatchedPair[0].prompt || activeMatchedPair[1].prompt;
    const finalNote = storyNoteInput.trim() || (sharedAloudDone ? 'Shared aloud with the family!' : 'Story shared.');

    // Add to trophy vault
    const newRecord: TrophyRecord = {
      pairId: activeMatchedPair[0].pairId,
      matchedBy: activePlayer.name,
      cards: activeMatchedPair,
      prompt: promptText,
      storyNote: finalNote,
    };

    setTrophyVault((prev) => [...prev, newRecord]);

    // Award 100 points
    setPlayers((prev) =>
      prev.map((p, idx) => (idx === activePlayerIndex ? { ...p, score: p.score + 100 } : p))
    );

    // Reset flipped indexes
    setFlippedIndexes([]);
    setActiveMatchedPair(null);

    // Check if game won (all 6 pairs matched)
    if (matchedPairIds.length >= 6) {
      setGameState('VICTORY');
    } else {
      // Pass turn to next player
      setActivePlayerIndex((curr) => (curr + 1) % players.length);
      setGameState('GAMEPLAY');
    }
  };

  // Export summary to clipboard
  const handleExportJournal = () => {
    const text = `--- FAMILY FLIP & FIND: GENERATION TROPHY VAULT ---
Deck: ${selectedDeckKey.toUpperCase()}
Date: ${new Date().toLocaleDateString()}

PLAYERS & FINAL SCORES:
${players.map((p) => `• ${p.name}: ${p.score} PTS`).join('\n')}

STORIES & MEMORIES SHARED:
${trophyVault
  .map(
    (t, i) =>
      `${i + 1}. [${t.cards[0].title} & ${t.cards[1].title}] (Found by ${t.matchedBy})\n   Prompt: "${t.prompt}"\n   Story: "${t.storyNote}"`
  )
  .join('\n\n')}
`;
    navigator.clipboard.writeText(text);
    setCopiedJournal(true);
    setTimeout(() => setCopiedJournal(false), 2500);
  };

  const currentPlayer = players[activePlayerIndex] || players[0];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-in fade-in">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-[#E7DFD5] pb-4">
        <button
          onClick={onBackToPortal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E7DFD5] text-xs sm:text-sm font-bold text-[#57534E] hover:bg-[#F5EFE6] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Competition Portal</span>
        </button>

        <div className="text-center">
          <span className="text-xs font-black uppercase tracking-wider text-[#9333EA]">
            Family Theme Party Game
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-[#292524] flex items-center justify-center gap-2">
            <span>🎴</span> Family Flip & Find
          </h1>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-bold text-[#15803D] bg-[#DCFCE7] px-2.5 py-1 rounded-xl border border-[#86EFAC]">
          <Trophy className="w-3.5 h-3.5" />
          <span>{trophyVault.length}/6 Pairs</span>
        </div>
      </div>

      {/* 1. SETUP SCREEN */}
      {gameState === 'SETUP' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#E7DFD5] space-y-6 shadow-xs">
          <div className="text-center space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black text-[#292524]">
              Match Generation Cards & Unlock Stories!
            </h2>
            <p className="text-xs sm:text-sm text-[#78716C] max-w-lg mx-auto">
              Flip matching Then & Now cards on a 12-card grid (like Boombox + Earbuds). Match a pair to unlock a cozy story prompt for the room!
            </p>
          </div>

          {/* Quick Play Button */}
          <div className="p-4 rounded-2xl bg-[#FEF3C7] border-2 border-[#FCD34D] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="space-y-0.5 text-center sm:text-left">
              <span className="text-xs font-black uppercase tracking-wider text-[#92400E]">
                ⭐ 1-Click Instant Test
              </span>
              <p className="text-xs text-[#78350F]">
                Play immediately with Grandma Eleanor, Dad Marcus & Maya.
              </p>
            </div>
            <button
              onClick={handleQuickPlayDemo}
              className="px-5 py-2.5 rounded-xl bg-[#B45309] hover:bg-[#92400E] text-white text-xs sm:text-sm font-black shadow-xs transition-all flex items-center gap-1.5"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Quick Play (Demo Players)</span>
            </button>
          </div>

          {/* Players Customization */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-[#292524] flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#9333EA]" />
                <span>Family Players (2 to 4)</span>
              </span>
              <span className="text-xs text-[#78716C]">Hotseat pass-around</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {players.map((p, idx) => (
                <div
                  key={p.id}
                  className="p-3.5 rounded-2xl border-2 flex items-center gap-3"
                  style={{ backgroundColor: `${p.color}35`, borderColor: p.color }}
                >
                  <span className="text-2xl">{p.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <input
                      type="text"
                      value={p.name}
                      onChange={(e) =>
                        setPlayers((all) =>
                          all.map((item) => (item.id === p.id ? { ...item, name: e.target.value } : item))
                        )
                      }
                      className="w-full px-2 py-1 rounded-lg bg-white border border-[#E7DFD5] text-xs font-bold text-[#292524]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Deck Selection */}
          <div className="space-y-2.5">
            <span className="text-xs font-black uppercase tracking-wider text-[#292524]">
              Choose Thematic Deck:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  id: 'tech',
                  title: '🎮 Toys & Technology',
                  desc: 'Arcades vs VR, Boombox vs Earbuds, Paper Maps vs GPS',
                  bg: '#EDE9FE',
                  border: '#DDD6FE',
                },
                {
                  id: 'school',
                  title: '🏫 School & Growing Up',
                  desc: 'Chalkboard vs Tablet, Rotary Phones, Mixtapes',
                  bg: '#DCFCE7',
                  border: '#BBF7D0',
                },
                {
                  id: 'traditions',
                  title: '🍲 Food & Family Traditions',
                  desc: 'Family recipes, board game nights, handmade crafts',
                  bg: '#FEF3C7',
                  border: '#FCD34D',
                },
              ].map((deck) => (
                <button
                  key={deck.id}
                  onClick={() => setSelectedDeckKey(deck.id as any)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${
                    selectedDeckKey === deck.id ? 'ring-2 ring-[#9333EA] shadow-xs' : 'opacity-85 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: deck.bg, borderColor: deck.border }}
                >
                  <div className="font-black text-sm text-[#292524]">{deck.title}</div>
                  <div className="text-[11px] text-[#57534E] mt-1">{deck.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => startNewGame()}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#9333EA] hover:bg-[#7E22CE] text-white font-black text-base shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Shuffle & Start Game</span>
              <Play className="w-5 h-5 fill-current" />
            </button>
          </div>
        </div>
      )}

      {/* 2. GAMEPLAY SCREEN - THE 3x4 CARD MATCHING BOARD */}
      {gameState === 'GAMEPLAY' && (
        <div className="space-y-4">
          {/* Active Turn Header Bar */}
          <div className="p-4 rounded-3xl bg-white border-2 border-[#E7DFD5] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-2xl border flex items-center justify-center text-xl shadow-xs"
                style={{ backgroundColor: currentPlayer.color }}
              >
                {currentPlayer.emoji}
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#9333EA]">
                  Active Turn
                </span>
                <div className="text-base font-black text-[#292524]">
                  {currentPlayer.name}’s Turn
                </div>
              </div>
            </div>

            {/* Score pills */}
            <div className="flex items-center gap-2 flex-wrap">
              {players.map((p, idx) => (
                <div
                  key={p.id}
                  className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all ${
                    idx === activePlayerIndex ? 'ring-2 ring-[#9333EA] font-extrabold' : ''
                  }`}
                  style={{ backgroundColor: `${p.color}50`, borderColor: p.color }}
                >
                  {p.emoji} {p.name.split(' ')[0]}: <span className="font-black">{p.score}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3x4 Grid of Generation Cards */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4 p-4 sm:p-6 rounded-3xl bg-[#FAF8F5] border-2 border-[#E7DFD5] shadow-inner">
            {gridCards.map((card, index) => {
              const isFlipped = flippedIndexes.includes(index);
              const isMatched = matchedPairIds.includes(card.pairId);

              return (
                <button
                  key={card.id}
                  onClick={() => handleCardClick(index)}
                  disabled={isMatched || isFlipped || flippedIndexes.length >= 2}
                  className={`relative aspect-[3/4] rounded-2xl border-2 transition-all duration-300 transform perspective-1000 flex flex-col items-center justify-center p-2.5 select-none ${
                    isMatched
                      ? 'bg-[#DCFCE7] border-[#86EFAC] opacity-80 scale-95 shadow-xs'
                      : isFlipped
                      ? 'bg-white border-[#9333EA] shadow-md scale-102 rotate-y-180'
                      : 'bg-[#2A2E39] border-[#E7DFD5] hover:scale-103 active:scale-95 shadow-sm cursor-pointer'
                  }`}
                >
                  {/* FACE UP CONTENT */}
                  {isFlipped || isMatched ? (
                    <div className="flex flex-col items-center justify-between h-full w-full text-center py-1">
                      <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[#FAF8F5] text-[#9333EA] border border-[#DDD6FE]">
                        {card.eraLabel}
                      </span>
                      <div className="text-3xl sm:text-4xl my-auto animate-in zoom-in-75">
                        {card.emoji}
                      </div>
                      <div className="text-[11px] font-black text-[#292524] leading-tight line-clamp-2">
                        {card.title}
                      </div>
                    </div>
                  ) : (
                    /* FACE DOWN CARD BACK */
                    <div className="flex flex-col items-center justify-center gap-1.5 text-center">
                      <span className="text-xl sm:text-2xl text-[#FCD34D]">✨</span>
                      <span className="text-[9px] font-black tracking-widest text-[#FCD34D] uppercase">
                        FLIP
                      </span>
                    </div>
                  )}

                  {/* Matched Checkmark Badge */}
                  {isMatched && (
                    <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#15803D] text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                      ✓
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="text-center text-xs text-[#78716C] italic">
            Flip two cards. Match the older item with its modern counterpart to unlock a Story Spark!
          </div>
        </div>
      )}

      {/* 3. STORY SPARK MODAL (THE CORE FAMILY MOMENT) */}
      {gameState === 'STORY_PROMPT' && activeMatchedPair && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border-4 border-[#9333EA] max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="text-center space-y-1">
              <span className="px-3.5 py-1 rounded-full bg-[#DCFCE7] border border-[#86EFAC] text-[#15803D] text-xs font-black uppercase tracking-wider">
                🎉 Match Unlocked! +100 PTS
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-[#292524]">
                Story Spark for {currentPlayer.name}
              </h3>
            </div>

            {/* Matched Pair Display */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-[#EDE9FE] border border-[#DDD6FE] text-center space-y-1">
                <div className="text-3xl">{activeMatchedPair[0].emoji}</div>
                <div className="text-xs font-black text-[#6D28D9]">{activeMatchedPair[0].title}</div>
                <div className="text-[10px] text-[#7C3AED] font-bold">{activeMatchedPair[0].eraLabel}</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#DCFCE7] border border-[#BBF7D0] text-center space-y-1">
                <div className="text-3xl">{activeMatchedPair[1].emoji}</div>
                <div className="text-xs font-black text-[#15803D]">{activeMatchedPair[1].title}</div>
                <div className="text-[10px] text-[#16A34A] font-bold">{activeMatchedPair[1].eraLabel}</div>
              </div>
            </div>

            {/* The Story Prompt */}
            <div className="p-4 rounded-2xl bg-[#FEF3C7] border-2 border-[#FCD34D] text-center space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#92400E]">
                Conversation Prompt:
              </span>
              <p className="text-sm sm:text-base font-black text-[#78350F] leading-snug">
                "{activeMatchedPair[0].prompt || activeMatchedPair[1].prompt}"
              </p>
            </div>

            {/* Response Options */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#57534E]">
                <span>Option A: Type a short highlight</span>
                <span>or</span>
                <button
                  onClick={() => setSharedAloudDone(!sharedAloudDone)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1 ${
                    sharedAloudDone
                      ? 'bg-[#15803D] text-white border-[#166534]'
                      : 'bg-white border-[#E7DFD5] text-[#57534E] hover:bg-[#FAF8F5]'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{sharedAloudDone ? 'Shared Aloud ✓' : 'Option B: Shared Aloud!'}</span>
                </button>
              </div>

              <input
                type="text"
                value={storyNoteInput}
                onChange={(e) => setStoryNoteInput(e.target.value)}
                placeholder="Optional 1-sentence note for the Family Trophy Shelf..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E7DFD5] text-xs sm:text-sm text-[#292524] focus:outline-none focus:ring-2 focus:ring-[#9333EA]/30"
              />
            </div>

            <button
              onClick={handleCollectTrophy}
              className="w-full py-3.5 rounded-2xl bg-[#9333EA] hover:bg-[#7E22CE] text-white font-black text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Trophy className="w-4 h-4" />
              <span>Collect Card for Trophy Shelf (+100 PTS)</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. VICTORY CELEBRATION & TROPHY VAULT */}
      {gameState === 'VICTORY' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#E7DFD5] space-y-6 shadow-xs animate-in zoom-in-95 text-center">
          <div className="space-y-2">
            <span className="px-3.5 py-1 rounded-full bg-[#FEF3C7] border border-[#FCD34D] text-[#92400E] text-xs font-black uppercase">
              ✨ All 6 Pairs Matched!
            </span>
            <h2 className="text-3xl font-black text-[#292524]">
              {(() => {
                const winner = [...players].sort((a, b) => b.score - a.score)[0];
                return `🏆 Congratulations, ${winner.name}!`;
              })()}
            </h2>
            <p className="text-xs sm:text-sm text-[#78716C] max-w-md mx-auto">
              Every card has been found and 6 lovely family memories were shared and preserved!
            </p>
          </div>

          {/* Scores Pod */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {players.map((p) => (
              <div
                key={p.id}
                className="px-4 py-2 rounded-2xl border-2 flex items-center gap-2 text-xs font-bold"
                style={{ backgroundColor: `${p.color}40`, borderColor: p.color }}
              >
                <span className="text-lg">{p.emoji}</span>
                <span>{p.name}:</span>
                <span className="font-black text-sm">{p.score} PTS</span>
              </div>
            ))}
          </div>

          {/* Family Trophy Vault */}
          <div className="p-5 rounded-3xl bg-[#FAF8F5] border-2 border-[#E7DFD5] space-y-3 text-left">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-[#9333EA] flex items-center gap-1.5">
                <BookHeart className="w-4 h-4" />
                <span>Family Trophy Shelf & Memory Log</span>
              </span>
              <span className="text-xs text-[#78716C]">{trophyVault.length} Memories Saved</span>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {trophyVault.map((t, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-white border border-[#E7DFD5] space-y-1 text-xs">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-[#292524]">
                      {t.cards[0].emoji} {t.cards[0].title} & {t.cards[1].emoji} {t.cards[1].title}
                    </span>
                    <span className="text-[10px] text-[#9333EA] bg-[#EDE9FE] px-2 py-0.5 rounded-md">
                      Matched by {t.matchedBy}
                    </span>
                  </div>
                  <p className="text-[#78716C] italic text-[11px]">"{t.prompt}"</p>
                  <p className="text-[#15803D] font-semibold text-[11px]">→ {t.storyNote}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              onClick={handleExportJournal}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white border-2 border-[#E7DFD5] text-[#292524] hover:bg-[#FAF8F5] font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5"
            >
              <Copy className="w-4 h-4 text-[#9333EA]" />
              <span>{copiedJournal ? 'Copied to Clipboard! ✓' : 'Save & Export Journal'}</span>
            </button>

            <button
              onClick={() => startNewGame()}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#9333EA] hover:bg-[#7E22CE] text-white font-black text-sm shadow-md"
            >
              Play Another Deck →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

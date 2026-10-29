import React, { useState } from 'react';
import { 
  Sparkles, 
  Heart, 
  BookmarkCheck, 
  Copy, 
  Check, 
  Share2, 
  Plus, 
  Trash2, 
  Home, 
  Users,
  Lightbulb,
  BookHeart,
  MessageSquare
} from 'lucide-react';
import { SessionRecord, SharedDiscoveries, QuestionResponseData } from '../types';
import { saveSession } from '../services/storageService';

interface SummaryScreenProps {
  sessionData: {
    title: string;
    mode: any;
    category: any;
    durationMinutes: number;
    participants: any[];
    questionsData: QuestionResponseData[];
  };
  onGoHome: () => void;
  onViewSaved: () => void;
}

export const SummaryScreen: React.FC<SummaryScreenProps> = ({
  sessionData,
  onGoHome,
  onViewSaved,
}) => {
  const [sessionTitle, setSessionTitle] = useState<string>(
    sessionData.title || `Family Session • ${new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`
  );

  // Extract shared discoveries directly from questions answers & reflections
  const initialCommonGround: string[] = [];
  const initialNewPerspectives: string[] = [];
  const initialTraditions: string[] = [];

  sessionData.questionsData.forEach((qd) => {
    if (qd.aiHighlights?.sharedValues) {
      initialCommonGround.push(...qd.aiHighlights.sharedValues);
    }
    if (qd.aiHighlights?.differentInterpretations) {
      initialNewPerspectives.push(...qd.aiHighlights.differentInterpretations);
    }
    // If untold stories mode or traditions category
    if (qd.question.category === 'traditions' || qd.question.mode === 'untold_stories') {
      qd.answers.forEach((ans) => {
        if (!ans.passed && ans.answerText) {
          initialTraditions.push(`${ans.participantName}: ${ans.answerText.slice(0, 80)}...`);
        }
      });
    }
  });

  const [commonGround, setCommonGround] = useState<string[]>(
    initialCommonGround.length > 0
      ? Array.from(new Set(initialCommonGround)).slice(0, 4)
      : ['Honoring each other’s honesty and listening with open minds.']
  );

  const [newPerspectives, setNewPerspectives] = useState<string[]>(
    initialNewPerspectives.length > 0
      ? Array.from(new Set(initialNewPerspectives)).slice(0, 4)
      : ['Noticed how everyday responsibilities frame how each person relaxes and communicates.']
  );

  const [traditions, setTraditions] = useState<string[]>(
    initialTraditions.length > 0 ? Array.from(new Set(initialTraditions)).slice(0, 3) : []
  );

  const [customTakeaways, setCustomTakeaways] = useState<string[]>([
    'Taking time to ask rather than assume makes conversation much lighter.',
  ]);

  const [newTakeawayInput, setNewTakeawayInput] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const handleAddTakeaway = () => {
    if (!newTakeawayInput.trim()) return;
    setCustomTakeaways([...customTakeaways, newTakeawayInput.trim()]);
    setNewTakeawayInput('');
  };

  const handleRemoveTakeaway = (index: number) => {
    setCustomTakeaways(customTakeaways.filter((_, i) => i !== index));
  };

  const handleSaveToDevice = () => {
    const discoveries: SharedDiscoveries = {
      commonGround,
      newPerspectives,
      traditionsAndStories: traditions,
      customTakeaways,
    };

    const record: SessionRecord = {
      id: `session-${Date.now()}`,
      title: sessionTitle.trim() || 'Family Perspective Session',
      date: new Date().toISOString(),
      durationMinutes: sessionData.durationMinutes,
      mode: sessionData.mode,
      category: sessionData.category,
      participants: sessionData.participants,
      questionsData: sessionData.questionsData,
      discoveries,
    };

    saveSession(record);
    setIsSaved(true);
  };

  const handleCopySummary = () => {
    const text = `--- GENERATION GAP: SHARED DISCOVERIES ---
Session: ${sessionTitle}
Participants: ${sessionData.participants.map((p) => `${p.name} (${p.generationLabel})`).join(', ')}

COMMON GROUND:
${commonGround.map((item) => `• ${item}`).join('\n')}

NEW PERSPECTIVES:
${newPerspectives.map((item) => `• ${item}`).join('\n')}

${traditions.length > 0 ? `TRADITIONS & STORIES:\n${traditions.map((item) => `• ${item}`).join('\n')}\n` : ''}
TAKEAWAYS:
${customTakeaways.map((item) => `• ${item}`).join('\n')}
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10 space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#DCFCE7] border border-[#BBF7D0] text-[#15803D] text-xs font-black tracking-wide uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          Session Completed
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#292524]">
          Shared Discoveries
        </h1>
        <p className="text-sm text-[#78716C] max-w-xl mx-auto">
          Here is what you learned together. Review, edit, or add any personal takeaway before saving.
        </p>
      </div>

      {/* Editable Session Title */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border-2 border-[#E7DFD5] space-y-2 shadow-xs">
        <label className="block text-xs font-bold text-[#78716C] uppercase tracking-wider">
          Session Title:
        </label>
        <input
          type="text"
          value={sessionTitle}
          onChange={(e) => setSessionTitle(e.target.value)}
          className="w-full text-lg sm:text-xl font-black text-[#292524] bg-transparent border-b border-dashed border-[#E7DFD5] pb-1 focus:outline-none focus:border-[#9333EA]"
        />
        <div className="flex items-center gap-2 pt-1 flex-wrap">
          {sessionData.participants.map((p) => (
            <span
              key={p.id}
              className="px-2.5 py-1 rounded-xl text-xs font-bold border flex items-center gap-1"
              style={{ backgroundColor: `${p.avatarColor}40`, borderColor: p.avatarColor }}
            >
              <span>{p.emoji}</span>
              <span>{p.name}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Discoveries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Common Ground */}
        <div className="p-5 sm:p-6 rounded-3xl bg-[#EDE9FE] border-2 border-[#DDD6FE] space-y-3 shadow-xs">
          <div className="flex items-center gap-2 text-sm font-black text-[#6D28D9] uppercase tracking-wider">
            <Heart className="w-4 h-4 text-[#9333EA]" />
            <span>Things You Had In Common</span>
          </div>
          <ul className="text-xs sm:text-sm text-[#4C1D95] space-y-2 font-medium">
            {commonGround.map((item, i) => (
              <li key={i} className="flex items-start gap-2 bg-white/70 p-2.5 rounded-xl border border-white/60">
                <span className="text-[#9333EA] font-bold mt-0.5">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* New Perspectives */}
        <div className="p-5 sm:p-6 rounded-3xl bg-[#E0F2FE] border-2 border-[#BAE6FD] space-y-3 shadow-xs">
          <div className="flex items-center gap-2 text-sm font-black text-[#0369A1] uppercase tracking-wider">
            <Lightbulb className="w-4 h-4 text-[#0284C7]" />
            <span>New Perspectives Discovered</span>
          </div>
          <ul className="text-xs sm:text-sm text-[#075985] space-y-2 font-medium">
            {newPerspectives.map((item, i) => (
              <li key={i} className="flex items-start gap-2 bg-white/70 p-2.5 rounded-xl border border-white/60">
                <span className="text-[#0284C7] font-bold mt-0.5">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Traditions or Stories if any */}
      {traditions.length > 0 && (
        <div className="p-5 sm:p-6 rounded-3xl bg-[#FEF3C7] border-2 border-[#FCD34D] space-y-3 shadow-xs">
          <div className="flex items-center gap-2 text-sm font-black text-[#92400E] uppercase tracking-wider">
            <BookHeart className="w-4 h-4 text-[#D97706]" />
            <span>Family Traditions & Stories Shared</span>
          </div>
          <div className="space-y-2 text-xs sm:text-sm text-[#78350F]">
            {traditions.map((t, i) => (
              <div key={i} className="p-3 rounded-2xl bg-white/80 border border-white/80">
                {t}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Participant Chosen Takeaways */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border-2 border-[#E7DFD5] space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#9333EA]" />
            <h3 className="text-base font-black text-[#292524]">
              Family Takeaways & Next Steps
            </h3>
          </div>
          <span className="text-xs text-[#78716C]">In your own words</span>
        </div>

        <div className="space-y-2">
          {customTakeaways.map((takeaway, i) => (
            <div
              key={i}
              className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E7DFD5] flex items-center justify-between gap-3 text-xs sm:text-sm text-[#292524]"
            >
              <div className="flex items-center gap-2">
                <span className="text-[#9333EA] font-bold">•</span>
                <span>{takeaway}</span>
              </div>
              <button
                onClick={() => handleRemoveTakeaway(i)}
                className="p-1 text-stone-400 hover:text-red-500 rounded-lg"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Add Takeaway */}
        <div className="flex gap-2 pt-1">
          <input
            type="text"
            value={newTakeawayInput}
            onChange={(e) => setNewTakeawayInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTakeaway()}
            placeholder="Add a family takeaway or promise (e.g. Sunday dinner without phones)..."
            className="flex-1 px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-[#E7DFD5] text-xs sm:text-sm text-[#292524] placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#9333EA]/30"
          />
          <button
            onClick={handleAddTakeaway}
            className="px-4 py-2 rounded-xl bg-[#EDE9FE] border border-[#DDD6FE] text-[#6D28D9] hover:bg-[#DDD6FE] font-bold text-xs sm:text-sm flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-5 rounded-3xl bg-[#FAF8F5] border-2 border-[#E7DFD5] flex flex-col sm:flex-row items-center justify-between gap-3.5">
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopySummary}
            className="px-4 py-2.5 rounded-xl bg-white border border-[#E7DFD5] text-[#57534E] hover:bg-[#F5EFE6] font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Summary'}</span>
          </button>

          <button
            onClick={onViewSaved}
            className="px-4 py-2.5 rounded-xl bg-white border border-[#E7DFD5] text-[#57534E] hover:bg-[#F5EFE6] font-bold text-xs sm:text-sm transition-colors"
          >
            Saved Archive
          </button>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={handleSaveToDevice}
            disabled={isSaved}
            className={`flex-1 sm:flex-initial px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-xs ${
              isSaved
                ? 'bg-[#DCFCE7] border border-[#86EFAC] text-[#15803D]'
                : 'bg-[#15803D] text-white hover:bg-[#166534]'
            }`}
          >
            <BookmarkCheck className="w-4 h-4" />
            <span>{isSaved ? 'Saved to Device ✓' : 'Save Session'}</span>
          </button>

          <button
            onClick={onGoHome}
            className="px-5 py-2.5 rounded-xl bg-[#9333EA] text-white hover:bg-[#7E22CE] font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </button>
        </div>
      </div>
    </div>
  );
};

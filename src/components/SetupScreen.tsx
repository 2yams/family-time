import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Sparkles, 
  Clock, 
  Users, 
  Check, 
  ArrowRight, 
  ArrowLeft,
  Smile,
  Heart
} from 'lucide-react';
import { Participant, ConversationMode, QuestionCategory, AgeGroup } from '../types';
import { MODES, CATEGORIES } from '../data/questionLibrary';

interface SetupScreenProps {
  onBack: () => void;
  onProceedToQuestions: (config: {
    participants: Participant[];
    mode: ConversationMode;
    category: QuestionCategory | 'all';
    durationMinutes: number;
  }) => void;
}

const AGE_GROUP_PRESETS: {
  ageGroup: AgeGroup;
  label: string;
  defaultEmoji: string;
  defaultColor: string;
}[] = [
  { ageGroup: 'child', label: 'Child (under 12)', defaultEmoji: '🧒', defaultColor: '#FEF08A' },
  { ageGroup: 'teen', label: 'Teenager (13-19)', defaultEmoji: '👧', defaultColor: '#FBCFE8' },
  { ageGroup: 'young_adult', label: 'Young Adult (20s)', defaultEmoji: '🧑', defaultColor: '#BAE6FD' },
  { ageGroup: 'adult', label: 'Adult / Parent (30s-50s)', defaultEmoji: '👨', defaultColor: '#BBF7D0' },
  { ageGroup: 'senior', label: 'Senior / Grandparent (60s-70s)', defaultEmoji: '👵', defaultColor: '#DDD6FE' },
  { ageGroup: 'elder', label: 'Elder (80s+)', defaultEmoji: '🧓', defaultColor: '#FED7AA' },
];

export const SetupScreen: React.FC<SetupScreenProps> = ({
  onBack,
  onProceedToQuestions,
}) => {
  const [participants, setParticipants] = useState<Participant[]>([
    {
      id: 'p-1',
      name: 'Grandma Eleanor',
      ageGroup: 'senior',
      generationLabel: 'Senior / Grandparent',
      avatarColor: '#DDD6FE',
      emoji: '👵',
    },
    {
      id: 'p-2',
      name: 'Dad Marcus',
      ageGroup: 'adult',
      generationLabel: 'Adult / Parent',
      avatarColor: '#BBF7D0',
      emoji: '👨',
    },
    {
      id: 'p-3',
      name: 'Maya',
      ageGroup: 'teen',
      generationLabel: 'Teenager',
      avatarColor: '#FBCFE8',
      emoji: '👧',
    },
  ]);

  const [selectedMode, setSelectedMode] = useState<ConversationMode>('same_question');
  const [selectedCategory, setSelectedCategory] = useState<QuestionCategory | 'all'>('all');
  const [durationMinutes, setDurationMinutes] = useState<number>(20);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleAddParticipant = () => {
    if (participants.length >= 8) {
      setErrorMsg('Maximum 8 participants for a comfortable shared session.');
      return;
    }
    setErrorMsg('');
    const id = `p-${Date.now()}`;
    const preset = AGE_GROUP_PRESETS[participants.length % AGE_GROUP_PRESETS.length];
    setParticipants([
      ...participants,
      {
        id,
        name: `Family Member ${participants.length + 1}`,
        ageGroup: preset.ageGroup,
        generationLabel: preset.label,
        avatarColor: preset.defaultColor,
        emoji: preset.defaultEmoji,
      },
    ]);
  };

  const handleRemoveParticipant = (id: string) => {
    if (participants.length <= 2) {
      setErrorMsg('At least 2 participants are needed for a perspective exchange.');
      return;
    }
    setErrorMsg('');
    setParticipants(participants.filter((p) => p.id !== id));
  };

  const handleUpdateParticipant = (id: string, updates: Partial<Participant>) => {
    setParticipants(
      participants.map((p) => {
        if (p.id !== id) return p;
        const updated = { ...p, ...updates };
        if (updates.ageGroup) {
          const preset = AGE_GROUP_PRESETS.find((ag) => ag.ageGroup === updates.ageGroup);
          if (preset) {
            updated.generationLabel = preset.label;
            updated.emoji = preset.defaultEmoji;
            updated.avatarColor = preset.defaultColor;
          }
        }
        return updated;
      })
    );
  };

  const handleProceed = () => {
    // Validate
    const hasEmptyName = participants.some((p) => !p.name.trim());
    if (hasEmptyName) {
      setErrorMsg('Please give each participant a name or nickname.');
      return;
    }
    if (participants.length < 2) {
      setErrorMsg('Please include at least 2 family members.');
      return;
    }
    setErrorMsg('');
    onProceedToQuestions({
      participants,
      mode: selectedMode,
      category: selectedCategory,
      durationMinutes,
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E7DFD5] pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E7DFD5] text-xs sm:text-sm font-bold text-[#57534E] hover:bg-[#F5EFE6] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-[#9333EA]">
            Step 1 of 2
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-[#292524]">
            Session Setup
          </h1>
        </div>

        <div className="w-16" /> {/* Spacer */}
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-[#FEE2E2] border-2 border-[#FCA5A5] text-[#991B1B] text-xs sm:text-sm font-bold flex items-center gap-2">
          <span>⚠️</span>
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 1. Participants List */}
      <section className="p-5 sm:p-6 rounded-3xl bg-white border-2 border-[#E7DFD5] space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#292524]">
                Who is participating today?
              </h2>
              <p className="text-xs text-[#78716C]">
                Add 2 to 8 family members gathered around this device
              </p>
            </div>
          </div>

          <button
            onClick={handleAddParticipant}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#DCFCE7] border border-[#86EFAC] text-xs sm:text-sm font-bold text-[#15803D] hover:bg-[#BBF7D0] transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Member</span>
          </button>
        </div>

        <div className="space-y-3 pt-1">
          {participants.map((p, index) => (
            <div
              key={p.id}
              className="p-3.5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
              style={{ backgroundColor: `${p.avatarColor}20`, borderColor: `${p.avatarColor}` }}
            >
              <div className="flex items-center gap-3 flex-1">
                <div
                  className="w-10 h-10 rounded-2xl border-2 border-black/10 flex items-center justify-center text-xl shrink-0 shadow-xs"
                  style={{ backgroundColor: p.avatarColor }}
                >
                  {p.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <input
                    type="text"
                    value={p.name}
                    onChange={(e) => handleUpdateParticipant(p.id, { name: e.target.value })}
                    placeholder={`Member ${index + 1} Name`}
                    className="w-full px-3 py-1.5 rounded-xl bg-white border border-[#E7DFD5] font-bold text-sm text-[#292524] focus:outline-none focus:ring-2 focus:ring-[#9333EA]/30"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <select
                  value={p.ageGroup}
                  onChange={(e) => handleUpdateParticipant(p.id, { ageGroup: e.target.value as AgeGroup })}
                  className="px-3 py-1.5 rounded-xl bg-white border border-[#E7DFD5] text-xs font-semibold text-[#44403C] focus:outline-none focus:ring-2 focus:ring-[#9333EA]/30"
                >
                  {AGE_GROUP_PRESETS.map((preset) => (
                    <option key={preset.ageGroup} value={preset.ageGroup}>
                      {preset.label}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => handleRemoveParticipant(p.id)}
                  disabled={participants.length <= 2}
                  className={`p-1.5 rounded-xl border transition-colors ${
                    participants.length <= 2
                      ? 'opacity-30 cursor-not-allowed bg-white border-[#E7DFD5] text-stone-400'
                      : 'bg-white border-[#FCA5A5] text-[#EF4444] hover:bg-[#FEE2E2]'
                  }`}
                  title="Remove participant"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Choose Mode */}
      <section className="p-5 sm:p-6 rounded-3xl bg-white border-2 border-[#E7DFD5] space-y-4 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-[#292524]">
            Select Conversation Mode
          </h2>
          <p className="text-xs text-[#78716C]">
            How would you like to explore perspectives together?
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {MODES.map((mode) => {
            const isSelected = selectedMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setSelectedMode(mode.id)}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${
                  isSelected
                    ? 'ring-3 ring-[#9333EA]/40 shadow-sm'
                    : 'opacity-80 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: mode.pastelBg,
                  borderColor: isSelected ? mode.accentColor : mode.pastelBorder,
                }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-black uppercase tracking-wider" style={{ color: mode.accentColor }}>
                    {mode.tagline}
                  </span>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-[#9333EA] text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
                <h3 className="font-extrabold text-[#292524] text-sm sm:text-base">
                  {mode.name}
                </h3>
                <p className="text-xs text-[#57534E] mt-1 leading-relaxed">
                  {mode.description}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Choose Topic & Duration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Topic */}
        <section className="p-5 rounded-3xl bg-white border-2 border-[#E7DFD5] space-y-3 shadow-xs">
          <div>
            <h2 className="text-base font-bold text-[#292524]">
              Theme or Topic
            </h2>
            <p className="text-xs text-[#78716C]">
              Pick a focus or let the app mix categories
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-[#9333EA] text-white border-[#7E22CE]'
                  : 'bg-[#F5F2EB] text-[#57534E] border-[#E7DFD5] hover:bg-[#EAE4D7]'
              }`}
            >
              🎲 Surprise Mix
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                  selectedCategory === cat.id
                    ? 'ring-2 ring-[#9333EA] font-extrabold'
                    : 'hover:opacity-90'
                }`}
                style={{
                  backgroundColor: cat.pastelColor,
                  color: cat.textColor,
                  borderColor: cat.textColor + '40',
                }}
              >
                <span>{cat.emoji} {cat.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Duration */}
        <section className="p-5 rounded-3xl bg-white border-2 border-[#E7DFD5] space-y-3 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-[#292524]">
              Session Length
            </h2>
            <p className="text-xs text-[#78716C]">
              How much time does the family have right now?
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { mins: 10, label: 'Quick', questions: '2 questions', bg: '#DCFCE7' },
              { mins: 20, label: 'Standard', questions: '3-4 questions', bg: '#FEF3C7' },
              { mins: 30, label: 'Deep Dive', questions: '5-6 questions', bg: '#EDE9FE' },
            ].map((d) => (
              <button
                key={d.mins}
                onClick={() => setDurationMinutes(d.mins)}
                className={`p-3 rounded-2xl border-2 text-center transition-all ${
                  durationMinutes === d.mins
                    ? 'border-[#9333EA] ring-2 ring-[#9333EA]/30'
                    : 'border-[#E7DFD5] hover:border-[#D6CEBF]'
                }`}
                style={{ backgroundColor: d.bg }}
              >
                <div className="font-black text-sm text-[#292524]">{d.mins}m</div>
                <div className="text-[11px] font-bold text-[#57534E]">{d.label}</div>
                <div className="text-[10px] text-[#78716C]">{d.questions}</div>
              </button>
            ))}
          </div>

          <p className="text-[11px] text-[#78716C] italic text-center">
            You can pause, skip, or end the session whenever you like.
          </p>
        </section>
      </div>

      {/* Next CTA */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          onClick={handleProceed}
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#9333EA] text-white hover:bg-[#7E22CE] font-bold text-base shadow-md transition-all flex items-center justify-center gap-2 group"
        >
          <span>Choose Questions</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

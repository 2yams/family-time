import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  ArrowLeft, 
  Sparkles, 
  Play, 
  Clock, 
  Users,
  Filter
} from 'lucide-react';
import { Question, ConversationMode, QuestionCategory } from '../types';
import { CURATED_QUESTIONS, MODES, CATEGORIES } from '../data/questionLibrary';

interface LibraryScreenProps {
  onBack: () => void;
  onSelectQuestionForSession: (question: Question) => void;
}

export const LibraryScreen: React.FC<LibraryScreenProps> = ({
  onBack,
  onSelectQuestionForSession,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMode, setSelectedMode] = useState<ConversationMode | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<QuestionCategory | 'all'>('all');

  const filteredQuestions = CURATED_QUESTIONS.filter((q) => {
    const matchesSearch =
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (q.followUpPrompt && q.followUpPrompt.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesMode = selectedMode === 'all' || q.mode === selectedMode;
    const matchesCat = selectedCategory === 'all' || q.category === selectedCategory;

    return matchesSearch && matchesMode && matchesCat;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6">
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
          <h1 className="text-xl sm:text-2xl font-black text-[#292524]">
            Question Library
          </h1>
          <p className="text-xs text-[#78716C]">
            Carefully curated prompts designed for curiosity and mutual respect
          </p>
        </div>

        <div className="w-16" />
      </div>

      {/* Search & Filters */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border-2 border-[#E7DFD5] space-y-3.5 shadow-xs">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions by topic, memories, school, values..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#E7DFD5] text-xs sm:text-sm font-medium text-[#292524] placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#9333EA]/30"
          />
        </div>

        {/* Mode filter pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <button
            onClick={() => setSelectedMode('all')}
            className={`px-3 py-1 rounded-xl text-xs font-bold border transition-colors ${
              selectedMode === 'all'
                ? 'bg-[#9333EA] text-white border-[#7E22CE]'
                : 'bg-[#FAF8F5] text-[#57534E] border-[#E7DFD5] hover:bg-[#F5EFE6]'
            }`}
          >
            All Modes
          </button>
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedMode(m.id)}
              className={`px-3 py-1 rounded-xl text-xs font-bold border transition-colors ${
                selectedMode === m.id
                  ? 'ring-2 ring-[#9333EA] font-extrabold'
                  : 'hover:opacity-90'
              }`}
              style={{
                backgroundColor: m.pastelBg,
                borderColor: m.pastelBorder,
                color: m.accentColor,
              }}
            >
              {m.name}
            </button>
          ))}
        </div>

        {/* Category filter pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-[#F5F2EB]">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-colors ${
              selectedCategory === 'all'
                ? 'bg-[#292524] text-white border-[#292524]'
                : 'bg-[#FAF8F5] text-[#57534E] border-[#E7DFD5] hover:bg-[#F5EFE6]'
            }`}
          >
            All Categories
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-colors ${
                selectedCategory === c.id
                  ? 'ring-2 ring-black/40 font-extrabold'
                  : 'hover:opacity-90'
              }`}
              style={{
                backgroundColor: c.pastelColor,
                color: c.textColor,
                borderColor: c.textColor + '40',
              }}
            >
              <span>{c.emoji} {c.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="text-xs font-bold text-[#78716C] px-1">
        Showing {filteredQuestions.length} question{filteredQuestions.length !== 1 ? 's' : ''}
      </div>

      {/* Questions List */}
      <div className="space-y-3">
        {filteredQuestions.map((q) => {
          const cat = CATEGORIES.find((c) => c.id === q.category);
          const modeInfo = MODES.find((m) => m.id === q.mode);

          return (
            <div
              key={q.id}
              className="p-5 rounded-3xl bg-white border-2 border-[#E7DFD5] space-y-3 shadow-xs transition-transform hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-extrabold text-base text-[#292524]">
                    {q.title}
                  </h3>
                  {cat && (
                    <span
                      className="px-2 py-0.5 rounded-lg text-[10px] font-bold border"
                      style={{
                        backgroundColor: cat.pastelColor,
                        color: cat.textColor,
                        borderColor: cat.textColor + '30',
                      }}
                    >
                      {cat.emoji} {cat.name}
                    </span>
                  )}
                  {modeInfo && (
                    <span
                      className="px-2 py-0.5 rounded-lg text-[10px] font-bold border"
                      style={{
                        backgroundColor: modeInfo.pastelBg,
                        color: modeInfo.accentColor,
                        borderColor: modeInfo.pastelBorder,
                      }}
                    >
                      {modeInfo.name}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-[#78716C] bg-[#FAF8F5] px-2 py-0.5 rounded-lg border border-[#E7DFD5]">
                    {q.ageAppropriateness}
                  </span>
                  <button
                    onClick={() => onSelectQuestionForSession(q)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#9333EA] text-white hover:bg-[#7E22CE] font-bold text-xs shadow-xs transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Launch</span>
                  </button>
                </div>
              </div>

              {q.fictionalScenario && (
                <div className="p-2.5 rounded-xl bg-[#E0F2FE] border border-[#BAE6FD] text-xs font-semibold text-[#0369A1]">
                  {q.fictionalScenario}
                </div>
              )}

              {q.eraHint && (
                <div className="p-2.5 rounded-xl bg-[#FEF3C7] border border-[#FCD34D] text-xs font-semibold text-[#92400E]">
                  💡 Era Context: {q.eraHint}
                </div>
              )}

              <p className="text-sm sm:text-base text-[#292524] font-medium leading-relaxed">
                "{q.prompt}"
              </p>

              {q.followUpPrompt && (
                <p className="text-xs text-[#78716C] italic pt-1 border-t border-[#F5F2EB]">
                  Follow-up: {q.followUpPrompt}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

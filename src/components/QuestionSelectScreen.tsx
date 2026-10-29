import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Play, 
  Sparkles, 
  Plus, 
  Trash2, 
  RefreshCw, 
  Clock, 
  BookOpen, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Question, Participant, ConversationMode, QuestionCategory } from '../types';
import { CURATED_QUESTIONS, CATEGORIES } from '../data/questionLibrary';
import { generateAiQuestions } from '../services/aiService';

interface QuestionSelectScreenProps {
  initialQuestions: Question[];
  participants: Participant[];
  mode: ConversationMode;
  category: QuestionCategory | 'all';
  onBack: () => void;
  onStartSession: (selectedQuestions: Question[]) => void;
}

export const QuestionSelectScreen: React.FC<QuestionSelectScreenProps> = ({
  initialQuestions,
  participants,
  mode,
  category,
  onBack,
  onStartSession,
}) => {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string>('');
  const [customTopicInput, setCustomTopicInput] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  const totalMinutes = questions.reduce((sum, q) => sum + (q.estimatedMinutes || 4), 0);

  const handleRemoveQuestion = (id: string) => {
    if (questions.length <= 1) {
      alert('You need at least 1 question for your session.');
      return;
    }
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handleAddFromLibrary = (q: Question) => {
    if (questions.some((item) => item.id === q.id)) return;
    setQuestions([...questions, q]);
    setShowAddModal(false);
  };

  const handleGenerateAi = async () => {
    setIsGeneratingAi(true);
    setAiError('');
    try {
      const pSummary = participants.map((p) => ({
        name: p.name,
        generationLabel: p.generationLabel,
      }));
      const generated = await generateAiQuestions(
        mode,
        category,
        pSummary,
        customTopicInput.trim() || undefined
      );

      if (generated && generated.length > 0) {
        const fullQ: Question = {
          id: `ai-${Date.now()}`,
          mode,
          category: category === 'all' ? 'values' : category,
          title: generated[0].title || 'Generational Curiosity',
          prompt: generated[0].prompt || 'What is a life perspective you cherish?',
          followUpPrompt: generated[0].followUpPrompt || 'How did this belief form over the years?',
          estimatedMinutes: generated[0].estimatedMinutes || 5,
          ageAppropriateness: generated[0].ageAppropriateness || 'All Ages',
          fictionalScenario: generated[0].fictionalScenario,
          isAiGenerated: true,
        };
        setQuestions([...questions, fullQ]);
        setCustomTopicInput('');
      } else {
        setAiError('Could not generate a new question right now. You can pick any question from the built-in library below!');
      }
    } catch (err) {
      setAiError('AI generation unavailable. Please select from the curated library.');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* Top Header */}
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
            Step 2 of 2
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-[#292524]">
            Review Questions
          </h1>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-bold text-[#78716C] bg-white px-2.5 py-1 rounded-xl border border-[#E7DFD5]">
          <Clock className="w-3.5 h-3.5 text-[#D97706]" />
          <span>~{totalMinutes} mins total</span>
        </div>
      </div>

      {aiError && (
        <div className="p-3 rounded-2xl bg-[#FFFBEB] border-2 border-[#FDE68A] text-xs sm:text-sm text-[#92400E] font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-[#D97706] shrink-0" />
          <span>{aiError}</span>
        </div>
      )}

      {/* Selected Questions Deck */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-extrabold text-[#292524]">
            Session Deck ({questions.length} Question{questions.length !== 1 ? 's' : ''})
          </h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#EDE9FE] border border-[#DDD6FE] text-xs font-bold text-[#6D28D9] hover:bg-[#DDD6FE] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add from Library</span>
          </button>
        </div>

        <div className="space-y-3">
          {questions.map((q, index) => {
            const cat = CATEGORIES.find((c) => c.id === q.category);
            return (
              <div
                key={q.id}
                className="p-4 sm:p-5 rounded-3xl bg-white border-2 border-[#E7DFD5] space-y-2.5 shadow-xs relative group"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="w-6 h-6 rounded-full bg-[#9333EA] text-white text-xs font-black flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="font-extrabold text-sm sm:text-base text-[#292524]">
                      {q.title}
                    </span>
                    {cat && (
                      <span
                        className="px-2 py-0.5 rounded-md text-[11px] font-bold border"
                        style={{
                          backgroundColor: cat.pastelColor,
                          color: cat.textColor,
                          borderColor: cat.textColor + '30',
                        }}
                      >
                        {cat.emoji} {cat.name}
                      </span>
                    )}
                    {q.isAiGenerated && (
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#EDE9FE] text-[#7C3AED] border border-[#DDD6FE] flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> AI Tailored
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-[#78716C] bg-[#F5F2EB] px-2 py-0.5 rounded-md">
                      {q.ageAppropriateness}
                    </span>
                    <button
                      onClick={() => handleRemoveQuestion(q.id)}
                      disabled={questions.length <= 1}
                      className="p-1.5 rounded-lg border border-[#FCA5A5] text-[#EF4444] hover:bg-[#FEE2E2] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Remove question"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {q.fictionalScenario && (
                  <div className="p-2.5 rounded-xl bg-[#E0F2FE] border border-[#BAE6FD] text-xs font-semibold text-[#0369A1]">
                    {q.fictionalScenario}
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

      {/* AI Custom Question Generator Card */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[#FEF3C7] border-2 border-[#FCD34D] space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#B45309]" />
          <h3 className="font-extrabold text-sm sm:text-base text-[#92400E]">
            Generate Tailored Question with AI
          </h3>
        </div>
        <p className="text-xs text-[#78350F] leading-relaxed">
          Optionally describe a custom family interest, upcoming milestone, or hobby (e.g. "cooking family meals", "moving to a new city", "favorite pets"):
        </p>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={customTopicInput}
            onChange={(e) => setCustomTopicInput(e.target.value)}
            placeholder="e.g. High school memories, favorite hobbies..."
            className="flex-1 px-3 py-2 rounded-xl bg-white border border-[#FCD34D] text-xs sm:text-sm font-medium text-[#292524] focus:outline-none focus:ring-2 focus:ring-[#B45309]/30"
          />
          <button
            onClick={handleGenerateAi}
            disabled={isGeneratingAi}
            className="px-4 py-2 rounded-xl bg-[#B45309] text-white hover:bg-[#92400E] font-bold text-xs sm:text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-xs"
          >
            {isGeneratingAi ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Crafting Question...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Add AI Question</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Bottom Start Session CTA */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-[#78716C] text-center sm:text-left">
          Questions can be skipped or answered aloud during the session.
        </p>
        <button
          onClick={() => onStartSession(questions)}
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#9333EA] text-white hover:bg-[#7E22CE] font-bold text-base sm:text-lg shadow-md transition-all flex items-center justify-center gap-2 group"
        >
          <Play className="w-5 h-5 fill-current" />
          <span>Begin Perspective Session</span>
        </button>
      </div>

      {/* Add from Library Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border-2 border-[#E7DFD5] max-w-2xl w-full max-h-[85vh] flex flex-col shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-[#E7DFD5] flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-[#292524]">
                  Question Library
                </h3>
                <p className="text-xs text-[#78716C]">
                  Select a question to add to your session deck
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="px-3 py-1.5 rounded-xl bg-[#F5F2EB] text-xs font-bold text-[#57534E] hover:bg-[#EAE4D7]"
              >
                Close
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-2.5 flex-1">
              {CURATED_QUESTIONS.map((q) => {
                const isAlreadySelected = questions.some((item) => item.id === q.id);
                return (
                  <div
                    key={q.id}
                    className="p-3.5 rounded-2xl border border-[#E7DFD5] bg-[#FAF8F5] flex items-start justify-between gap-3 hover:bg-white transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#292524]">{q.title}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-white border border-[#E7DFD5] text-[#78716C] font-semibold">
                          {q.ageAppropriateness}
                        </span>
                      </div>
                      <p className="text-xs text-[#57534E]">"{q.prompt}"</p>
                    </div>

                    <button
                      onClick={() => handleAddFromLibrary(q)}
                      disabled={isAlreadySelected}
                      className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                        isAlreadySelected
                          ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                          : 'bg-[#9333EA] text-white hover:bg-[#7E22CE]'
                      }`}
                    >
                      {isAlreadySelected ? 'In Deck' : 'Add +'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

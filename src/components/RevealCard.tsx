import React from 'react';
import { Sparkles, MessageCircle, Heart, Lightbulb, Users, HelpCircle } from 'lucide-react';
import { Participant, ParticipantAnswer, Question } from '../types';
import { AiHighlights } from '../services/aiService';

interface RevealCardProps {
  question: Question;
  participants: Participant[];
  answers: ParticipantAnswer[];
  aiHighlights?: AiHighlights | null;
  onOpenReflection: () => void;
  onNextQuestion: () => void;
  isLastQuestion: boolean;
}

export const RevealCard: React.FC<RevealCardProps> = ({
  question,
  participants,
  answers,
  aiHighlights,
  onOpenReflection,
  onNextQuestion,
  isLastQuestion,
}) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="text-center space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EDE9FE] border border-[#DDD6FE] text-[#7C3AED] text-xs font-black tracking-wide uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          Perspective Reveal
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-[#292524]">
          How Everyone Sees It
        </h2>
        <p className="text-sm text-[#78716C] max-w-xl mx-auto">
          Every perspective comes from a unique life stage and era. There are no right or wrong answers.
        </p>
      </div>

      {/* The Question in context */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border-2 border-[#E7DFD5] text-center shadow-xs space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-[#9333EA]">
          {question.title}
        </span>
        <p className="text-lg sm:text-xl font-bold text-[#292524] leading-relaxed max-w-2xl mx-auto">
          "{question.prompt}"
        </p>
        {question.fictionalScenario && (
          <p className="text-xs text-[#0284C7] bg-[#E0F2FE] px-3 py-1 rounded-xl inline-block font-semibold">
            {question.fictionalScenario}
          </p>
        )}
      </div>

      {/* Side-by-Side Answers Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-[#292524] flex items-center gap-2">
            <Users className="w-4 h-4 text-[#9333EA]" />
            <span>Responses Side by Side</span>
          </h3>
          <span className="text-xs text-[#78716C]">
            {answers.length} Participant{answers.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {participants.map((p) => {
            const answer = answers.find((a) => a.participantId === p.id);
            const passed = answer?.passed;
            const isAloud = answer?.isAloud;
            const text = answer?.answerText;

            return (
              <div
                key={p.id}
                className="p-5 rounded-3xl border-2 flex flex-col justify-between shadow-xs transition-transform hover:-translate-y-0.5"
                style={{
                  backgroundColor: `${p.avatarColor}35`,
                  borderColor: p.avatarColor,
                }}
              >
                <div className="space-y-3">
                  {/* Participant Header */}
                  <div className="flex items-center gap-3 pb-2 border-b border-black/5">
                    <div
                      className="w-10 h-10 rounded-2xl border border-black/10 flex items-center justify-center text-xl shadow-xs shrink-0"
                      style={{ backgroundColor: p.avatarColor }}
                    >
                      {p.emoji}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm sm:text-base text-[#292524]">
                        {p.name}
                      </h4>
                      <span className="text-[11px] font-bold text-[#57534E]">
                        {p.generationLabel}
                      </span>
                    </div>
                  </div>

                  {/* Participant Answer Body */}
                  <div className="min-h-[90px] flex flex-col justify-center">
                    {passed ? (
                      <div className="p-3 rounded-2xl bg-white/70 border border-dashed border-[#D6D3D1] text-xs text-[#78716C] italic text-center">
                        🌿 Chose to reflect quietly on this question.
                      </div>
                    ) : isAloud ? (
                      <div className="p-3.5 rounded-2xl bg-white/80 border border-[#E7DFD5] text-xs sm:text-sm text-[#44403C] space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-[#0284C7]">
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Shared Aloud with Family</span>
                        </div>
                        {text ? (
                          <p className="italic">"{text}"</p>
                        ) : (
                          <p className="text-stone-500 italic">Spoken aloud during session.</p>
                        )}
                      </div>
                    ) : (
                      <div className="p-3.5 rounded-2xl bg-white/90 border border-black/5 text-xs sm:text-sm text-[#292524] font-medium leading-relaxed">
                        "{text || 'No response recorded.'}"
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2 text-[10px] text-right font-bold text-[#78716C]">
                  {passed ? 'Passed respectfully' : isAloud ? 'Aloud conversation' : 'Submitted on device'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Highlights & Synthesized Discoveries Card */}
      {aiHighlights && (
        <div className="p-6 sm:p-7 rounded-3xl bg-white border-2 border-[#E7DFD5] shadow-xs space-y-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-[#292524]">
                Perspective Synthesis
              </h3>
              <p className="text-xs text-[#78716C]">
                Gentle observations highlighting connection rather than division
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Shared Values */}
            <div className="p-4 rounded-2xl bg-[#EDE9FE] border border-[#DDD6FE] space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-black text-[#6D28D9] uppercase tracking-wider">
                <Heart className="w-3.5 h-3.5 text-[#9333EA]" />
                <span>Shared Values</span>
              </div>
              <ul className="text-xs sm:text-sm text-[#4C1D95] space-y-1.5 font-medium">
                {aiHighlights.sharedValues.map((val, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-[#9333EA] font-bold">•</span>
                    <span>{val}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Different Interpretations */}
            <div className="p-4 rounded-2xl bg-[#E0F2FE] border border-[#BAE6FD] space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-black text-[#0369A1] uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#0284C7]" />
                <span>Different Lenses</span>
              </div>
              <ul className="text-xs sm:text-sm text-[#075985] space-y-1.5 font-medium">
                {aiHighlights.differentInterpretations.map((val, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-[#0284C7] font-bold">•</span>
                    <span>{val}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Surprising Similarities */}
            <div className="p-4 rounded-2xl bg-[#DCFCE7] border border-[#BBF7D0] space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-black text-[#15803D] uppercase tracking-wider">
                <Users className="w-3.5 h-3.5 text-[#16A34A]" />
                <span>Common Ground</span>
              </div>
              <ul className="text-xs sm:text-sm text-[#14532D] space-y-1.5 font-medium">
                {aiHighlights.surprisingSimilarities.map((val, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-[#16A34A] font-bold">•</span>
                    <span>{val}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Discussion Spark */}
          {aiHighlights.discussionSpark && (
            <div className="p-4 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] flex items-start gap-3">
              <HelpCircle className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <div className="text-xs font-black uppercase tracking-wider text-[#B45309]">
                  Respectful Discussion Spark
                </div>
                <p className="text-sm font-semibold text-[#78350F]">
                  "{aiHighlights.discussionSpark}"
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <button
          onClick={onOpenReflection}
          className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-[#FEF3C7] border-2 border-[#FCD34D] text-[#92400E] hover:bg-[#FDE68A] font-bold text-sm shadow-xs transition-colors flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-[#B45309]" />
          <span>Gentle Reflection Prompts</span>
        </button>

        <button
          onClick={onNextQuestion}
          className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#9333EA] text-white hover:bg-[#7E22CE] font-bold text-base shadow-md transition-all flex items-center justify-center gap-2"
        >
          <span>{isLastQuestion ? 'Complete & View Summary' : 'Next Question →'}</span>
        </button>
      </div>
    </div>
  );
};

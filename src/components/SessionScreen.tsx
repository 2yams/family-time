import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Sparkles, 
  ArrowRight, 
  ChevronRight, 
  Eye, 
  EyeOff, 
  Lock, 
  Volume2, 
  VolumeX, 
  Pause, 
  Play, 
  RotateCcw,
  SkipForward,
  MessageCircle,
  HelpCircle,
  CheckCircle2,
  X
} from 'lucide-react';
import { Question, Participant, ParticipantAnswer, QuestionResponseData, ConversationMode, QuestionCategory } from '../types';
import { RevealCard } from './RevealCard';
import { ReflectionModal } from './ReflectionModal';
import { synthesizePerspectiveHighlights, AiHighlights } from '../services/aiService';

interface SessionScreenProps {
  questions: Question[];
  participants: Participant[];
  mode: ConversationMode;
  category: QuestionCategory | 'all';
  onCompleteSession: (recordedData: QuestionResponseData[]) => void;
  onExitSession: () => void;
}

type Stage = 'think' | 'answering' | 'reveal';

export const SessionScreen: React.FC<SessionScreenProps> = ({
  questions,
  participants,
  mode,
  category,
  onCompleteSession,
  onExitSession,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [stage, setStage] = useState<Stage>('think');

  // Think timer state
  const [thinkSeconds, setThinkSeconds] = useState<number>(45);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);

  // Turn-by-turn answering state
  const [currentParticipantIndex, setCurrentParticipantIndex] = useState<number>(0);
  const [currentTextAnswer, setCurrentTextAnswer] = useState<string>('');
  const [isAnsweringAloud, setIsAnsweringAloud] = useState<boolean>(false);
  const [isPrivacyLocked, setIsPrivacyLocked] = useState<boolean>(false); // Peek protection between turns

  // Stored answers for current question
  const [currentAnswers, setCurrentAnswers] = useState<ParticipantAnswer[]>([]);

  // AI highlights for current question reveal
  const [currentAiHighlights, setCurrentAiHighlights] = useState<AiHighlights | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);

  // Reflection modal
  const [isReflectionOpen, setIsReflectionOpen] = useState<boolean>(false);
  const [currentReflections, setCurrentReflections] = useState<{ prompt: string; notes?: string; completed: boolean }[]>([]);

  // All session recorded question data
  const [allSessionData, setAllSessionData] = useState<QuestionResponseData[]>([]);

  const currentQuestion = questions[currentQuestionIndex];
  const currentParticipant = participants[currentParticipantIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  // Think time countdown effect
  useEffect(() => {
    let interval: any = null;
    if (stage === 'think' && isTimerRunning && thinkSeconds > 0) {
      interval = setInterval(() => {
        setThinkSeconds((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [stage, isTimerRunning, thinkSeconds]);

  // Reset state when moving to a new question
  const startQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
    setStage('think');
    setThinkSeconds(45);
    setIsTimerRunning(true);
    setCurrentParticipantIndex(0);
    setCurrentTextAnswer('');
    setIsAnsweringAloud(false);
    setIsPrivacyLocked(false);
    setCurrentAnswers([]);
    setCurrentAiHighlights(null);
    setCurrentReflections([]);
  };

  const handleStartAnswering = () => {
    setStage('answering');
    setCurrentParticipantIndex(0);
    setCurrentTextAnswer('');
    setIsAnsweringAloud(false);
    setIsPrivacyLocked(false);
  };

  // Submit single participant answer
  const handleSubmitParticipantAnswer = (passed: boolean) => {
    const newAnswer: ParticipantAnswer = {
      participantId: currentParticipant.id,
      participantName: currentParticipant.name,
      answerText: passed ? '' : currentTextAnswer.trim(),
      isAloud: isAnsweringAloud,
      passed,
      submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedAnswers = [...currentAnswers, newAnswer];
    setCurrentAnswers(updatedAnswers);

    // Check if more participants
    if (currentParticipantIndex < participants.length - 1) {
      // Advance to next participant with privacy peek shield
      setCurrentParticipantIndex(currentParticipantIndex + 1);
      setCurrentTextAnswer('');
      setIsAnsweringAloud(false);
      setIsPrivacyLocked(true); // Require next person to tap to unlock
    } else {
      // Everyone has answered! Proceed to reveal
      triggerPerspectiveReveal(updatedAnswers);
    }
  };

  const triggerPerspectiveReveal = async (answers: ParticipantAnswer[]) => {
    setStage('reveal');
    setIsSynthesizing(true);
    try {
      const highlights = await synthesizePerspectiveHighlights(currentQuestion, answers);
      setCurrentAiHighlights(highlights);
    } catch (e) {
      console.warn('Synthesis error', e);
    } finally {
      setIsSynthesizing(false);
    }
  };

  const handleNextQuestionOrComplete = () => {
    // Record this question's data
    const recordedQuestion: QuestionResponseData = {
      questionId: currentQuestion.id,
      question: currentQuestion,
      answers: currentAnswers,
      aiHighlights: currentAiHighlights || undefined,
      reflectionAnswers: currentReflections,
    };

    const updatedSession = [...allSessionData, recordedQuestion];
    setAllSessionData(updatedSession);

    if (!isLastQuestion) {
      startQuestion(currentQuestionIndex + 1);
    } else {
      // Finish full session
      onCompleteSession(updatedSession);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* Session Progress Header */}
      <div className="flex items-center justify-between border-b border-[#E7DFD5] pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (confirm('Are you sure you want to pause or exit this family session? Current progress is saved in this session.')) {
                onExitSession();
              }
            }}
            className="p-1.5 rounded-xl bg-white border border-[#E7DFD5] text-stone-400 hover:text-stone-700 hover:bg-[#F5EFE6] transition-colors"
            title="Exit Session"
          >
            <X className="w-4 h-4" />
          </button>
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#9333EA]">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <div className="text-xs font-bold text-[#78716C] -mt-0.5">
              {currentQuestion.title}
            </div>
          </div>
        </div>

        {/* Stage Pills */}
        <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-2xl border border-[#E7DFD5] text-xs font-bold">
          <span className={`px-2 py-0.5 rounded-xl transition-colors ${stage === 'think' ? 'bg-[#FEF3C7] text-[#92400E]' : 'text-stone-400'}`}>
            1. Think
          </span>
          <span className="text-stone-300">→</span>
          <span className={`px-2 py-0.5 rounded-xl transition-colors ${stage === 'answering' ? 'bg-[#E0F2FE] text-[#0369A1]' : 'text-stone-400'}`}>
            2. Share
          </span>
          <span className="text-stone-300">→</span>
          <span className={`px-2 py-0.5 rounded-xl transition-colors ${stage === 'reveal' ? 'bg-[#DCFCE7] text-[#15803D]' : 'text-stone-400'}`}>
            3. Reveal
          </span>
        </div>
      </div>

      {/* STAGE 1: THINK TIME */}
      {stage === 'think' && (
        <div className="p-6 sm:p-10 rounded-3xl bg-white border-2 border-[#E7DFD5] text-center shadow-xs space-y-8 animate-in fade-in duration-200">
          <div className="space-y-3">
            <span className="px-3.5 py-1 rounded-full bg-[#EDE9FE] border border-[#DDD6FE] text-[#7C3AED] text-xs font-extrabold tracking-wide uppercase">
              Curiosity Prompt • {currentQuestion.ageAppropriateness}
            </span>

            <h2 className="text-2xl sm:text-4xl font-black text-[#292524] leading-snug max-w-2xl mx-auto pt-2">
              "{currentQuestion.prompt}"
            </h2>

            {currentQuestion.fictionalScenario && (
              <div className="max-w-xl mx-auto p-3.5 rounded-2xl bg-[#E0F2FE] border border-[#BAE6FD] text-xs sm:text-sm font-semibold text-[#0369A1]">
                {currentQuestion.fictionalScenario}
              </div>
            )}

            {currentQuestion.eraHint && (
              <div className="max-w-xl mx-auto p-3.5 rounded-2xl bg-[#FEF3C7] border border-[#FCD34D] text-xs sm:text-sm font-semibold text-[#92400E]">
                💡 Era Context: {currentQuestion.eraHint}
              </div>
            )}

            {currentQuestion.followUpPrompt && (
              <p className="text-sm text-[#78716C] italic max-w-lg mx-auto pt-2">
                Follow-up thought: "{currentQuestion.followUpPrompt}"
              </p>
            )}
          </div>

          {/* Contemplation Timer */}
          <div className="p-4 max-w-xs mx-auto rounded-2xl bg-[#FAF8F5] border border-[#E7DFD5] flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#9333EA]" />
              <div className="text-left">
                <div className="text-xs font-bold text-[#78716C]">Think Time</div>
                <div className="text-xl font-black text-[#292524]">
                  0:{thinkSeconds < 10 ? `0${thinkSeconds}` : thinkSeconds}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="p-2 rounded-xl bg-white border border-[#E7DFD5] text-[#57534E] hover:bg-[#F5EFE6]"
                title={isTimerRunning ? 'Pause timer' : 'Resume timer'}
              >
                {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              </button>
              <button
                onClick={() => setThinkSeconds((prev) => prev + 30)}
                className="px-2 py-1.5 rounded-xl bg-white border border-[#E7DFD5] text-xs font-bold text-[#57534E] hover:bg-[#F5EFE6]"
                title="Add 30 seconds"
              >
                +30s
              </button>
            </div>
          </div>

          {/* Proceed to Answer CTA */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleStartAnswering}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#9333EA] text-white hover:bg-[#7E22CE] font-bold text-base sm:text-lg shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Ready to Share Answers</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* STAGE 2: TURN-BY-TURN ANSWERING */}
      {stage === 'answering' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Privacy Lock / Pass-and-Play Shield */}
          {isPrivacyLocked ? (
            <div className="p-8 sm:p-12 rounded-3xl bg-white border-2 border-[#E7DFD5] text-center space-y-6 shadow-sm">
              <div
                className="w-20 h-20 mx-auto rounded-3xl border-2 border-black/10 flex items-center justify-center text-4xl shadow-xs"
                style={{ backgroundColor: currentParticipant.avatarColor }}
              >
                {currentParticipant.emoji}
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#9333EA]">
                  Pass the Phone / Tablet
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#292524]">
                  Hand the device to {currentParticipant.name}
                </h2>
                <p className="text-sm text-[#78716C] max-w-md mx-auto">
                  Previous family members’ answers are safely hidden to keep answers authentic and pressure-free.
                </p>
              </div>

              <button
                onClick={() => setIsPrivacyLocked(false)}
                className="px-8 py-3.5 rounded-2xl bg-[#9333EA] text-white hover:bg-[#7E22CE] font-bold text-base shadow-md transition-all inline-flex items-center gap-2"
              >
                <Eye className="w-5 h-5" />
                <span>I am {currentParticipant.name} (Tap to Unlock)</span>
              </button>
            </div>
          ) : (
            <div
              className="p-6 sm:p-8 rounded-3xl border-2 space-y-6 shadow-xs"
              style={{
                backgroundColor: `${currentParticipant.avatarColor}20`,
                borderColor: currentParticipant.avatarColor,
              }}
            >
              {/* Participant Header */}
              <div className="flex items-center justify-between pb-4 border-b border-black/10">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl border-2 border-black/10 flex items-center justify-center text-2xl shadow-xs shrink-0"
                    style={{ backgroundColor: currentParticipant.avatarColor }}
                  >
                    {currentParticipant.emoji}
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#78716C]">
                      Now answering ({currentParticipantIndex + 1} of {participants.length})
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-[#292524]">
                      {currentParticipant.name}
                    </h3>
                    <span className="text-xs font-semibold text-[#57534E]">
                      {currentParticipant.generationLabel}
                    </span>
                  </div>
                </div>

                {/* Mode toggle: Type privately vs Answer Aloud */}
                <button
                  onClick={() => setIsAnsweringAloud(!isAnsweringAloud)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 ${
                    isAnsweringAloud
                      ? 'bg-[#0284C7] text-white border-[#0369A1]'
                      : 'bg-white border-[#E7DFD5] text-[#57534E] hover:bg-[#F5EFE6]'
                  }`}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{isAnsweringAloud ? 'Speaking Aloud' : 'Typing Privately'}</span>
                </button>
              </div>

              {/* The Question reminder */}
              <div className="p-4 rounded-2xl bg-white/90 border border-black/5 space-y-1">
                <span className="text-xs font-bold text-[#9333EA] uppercase tracking-wide">
                  Question:
                </span>
                <p className="text-base sm:text-lg font-bold text-[#292524]">
                  "{currentQuestion.prompt}"
                </p>
                {currentQuestion.followUpPrompt && (
                  <p className="text-xs text-[#78716C] italic">
                    Follow-up: {currentQuestion.followUpPrompt}
                  </p>
                )}
              </div>

              {/* Input Area */}
              {isAnsweringAloud ? (
                <div className="p-5 rounded-2xl bg-white border border-[#BAE6FD] text-center space-y-3">
                  <div className="w-10 h-10 mx-auto rounded-full bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-base text-[#075985]">
                    Share your thought aloud with everyone
                  </h4>
                  <p className="text-xs text-[#57534E] max-w-md mx-auto">
                    Speak freely! You can also type a few bullet points below if you want them saved in the session record.
                  </p>
                  <textarea
                    rows={3}
                    value={currentTextAnswer}
                    onChange={(e) => setCurrentTextAnswer(e.target.value)}
                    placeholder="Optional summary notes of what you shared aloud..."
                    className="w-full p-3 rounded-xl bg-[#FAF8F5] border border-[#E7DFD5] text-sm text-[#292524] placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#9333EA]/30"
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#44403C]">
                    Your Private Answer (revealed only when everyone is ready):
                  </label>
                  <textarea
                    rows={4}
                    value={currentTextAnswer}
                    onChange={(e) => setCurrentTextAnswer(e.target.value)}
                    placeholder="Type your authentic thoughts here. There are no wrong answers..."
                    className="w-full p-3.5 rounded-2xl bg-white border border-[#E7DFD5] text-sm sm:text-base text-[#292524] placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#9333EA]/40 shadow-xs"
                  />
                </div>
              )}

              {/* Action Buttons: Pass or Save */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <button
                  onClick={() => handleSubmitParticipantAnswer(true)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white border border-[#E7DFD5] text-[#78716C] hover:text-[#292524] hover:bg-[#F5EFE6] font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-1.5"
                  title="Skip this question without penalty"
                >
                  <SkipForward className="w-4 h-4" />
                  <span>Pass this question</span>
                </button>

                <button
                  onClick={() => handleSubmitParticipantAnswer(false)}
                  disabled={!isAnsweringAloud && !currentTextAnswer.trim()}
                  className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-[#9333EA] text-white hover:bg-[#7E22CE] font-bold text-sm sm:text-base shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span>
                    {currentParticipantIndex === participants.length - 1
                      ? 'Submit & Reveal Answers 🎉'
                      : 'Next Family Member →'}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* STAGE 3: PERSPECTIVE REVEAL */}
      {stage === 'reveal' && (
        <RevealCard
          question={currentQuestion}
          participants={participants}
          answers={currentAnswers}
          aiHighlights={currentAiHighlights}
          onOpenReflection={() => setIsReflectionOpen(true)}
          onNextQuestion={handleNextQuestionOrComplete}
          isLastQuestion={isLastQuestion}
        />
      )}

      {/* Reflection Modal */}
      <ReflectionModal
        isOpen={isReflectionOpen}
        onClose={() => setIsReflectionOpen(false)}
        onSaveNotes={(notes) => setCurrentReflections(notes)}
      />
    </div>
  );
};

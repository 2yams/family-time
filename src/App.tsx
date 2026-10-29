import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { WelcomeScreen } from './components/WelcomeScreen';
import { SetupScreen } from './components/SetupScreen';
import { QuestionSelectScreen } from './components/QuestionSelectScreen';
import { SessionScreen } from './components/SessionScreen';
import { SummaryScreen } from './components/SummaryScreen';
import { SavedSessionsScreen } from './components/SavedSessionsScreen';
import { LibraryScreen } from './components/LibraryScreen';
import { SettingsModal } from './components/SettingsModal';
import { RevealCard } from './components/RevealCard';
import { ReflectionModal } from './components/ReflectionModal';
import { 
  Participant, 
  Question, 
  ConversationMode, 
  QuestionCategory, 
  QuestionResponseData, 
  AppSettings 
} from './types';
import { CURATED_QUESTIONS, DEMO_PRESET_SESSION } from './data/questionLibrary';
import { getSavedSessions, getAppSettings, saveAppSettings } from './services/storageService';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<string>('welcome');
  const [settings, setSettings] = useState<AppSettings>(getAppSettings());
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [savedCount, setSavedCount] = useState<number>(0);

  // Active Session Config
  const [sessionParticipants, setSessionParticipants] = useState<Participant[]>([]);
  const [sessionMode, setSessionMode] = useState<ConversationMode>('same_question');
  const [sessionCategory, setSessionCategory] = useState<QuestionCategory | 'all'>('all');
  const [sessionDuration, setSessionDuration] = useState<number>(20);
  const [sessionQuestions, setSessionQuestions] = useState<Question[]>([]);

  // Active or Completed Session Data
  const [activeSessionData, setActiveSessionData] = useState<{
    title: string;
    mode: ConversationMode;
    category: QuestionCategory | 'all';
    durationMinutes: number;
    participants: Participant[];
    questionsData: QuestionResponseData[];
  } | null>(null);

  // Demo Mode State
  const [isDemoActive, setIsDemoActive] = useState<boolean>(false);
  const [isDemoReflectionOpen, setIsDemoReflectionOpen] = useState<boolean>(false);

  useEffect(() => {
    setSavedCount(getSavedSessions().length);
  }, [currentScreen]);

  // Apply font size style
  const getFontSizeClass = () => {
    if (settings.fontSize === 'large') return 'text-[17px]';
    if (settings.fontSize === 'extra-large') return 'text-[19px]';
    return 'text-[15px]';
  };

  // 1. Start Session Setup flow
  const handleStartSession = () => {
    setIsDemoActive(false);
    setCurrentScreen('setup');
  };

  // 2. Setup -> Question Select flow
  const handleProceedToQuestions = (config: {
    participants: Participant[];
    mode: ConversationMode;
    category: QuestionCategory | 'all';
    durationMinutes: number;
  }) => {
    setSessionParticipants(config.participants);
    setSessionMode(config.mode);
    setSessionCategory(config.category);
    setSessionDuration(config.durationMinutes);

    // Pick 2, 4, or 6 questions based on duration
    const count = config.durationMinutes <= 10 ? 2 : config.durationMinutes <= 20 ? 4 : 5;

    // Filter questions by mode and category
    let pool = CURATED_QUESTIONS.filter((q) => {
      const modeMatch = q.mode === config.mode;
      const catMatch = config.category === 'all' || q.category === config.category;
      return modeMatch && catMatch;
    });

    if (pool.length === 0) {
      pool = CURATED_QUESTIONS.filter((q) => q.mode === config.mode);
    }
    if (pool.length === 0) {
      pool = CURATED_QUESTIONS;
    }

    const selected = pool.slice(0, count);
    setSessionQuestions(selected);
    setCurrentScreen('question_select');
  };

  // 3. Question Select -> Begin Live Session
  const handleBeginLiveSession = (questionsToUse: Question[]) => {
    setSessionQuestions(questionsToUse);
    setCurrentScreen('session');
  };

  // 4. Session completed -> Summary Screen
  const handleSessionFinished = (recordedData: QuestionResponseData[]) => {
    const title = `${sessionParticipants.map((p) => p.name.split(' ')[0]).join(' & ')}’s Perspective Session`;
    setActiveSessionData({
      title,
      mode: sessionMode,
      category: sessionCategory,
      durationMinutes: sessionDuration,
      participants: sessionParticipants,
      questionsData: recordedData,
    });
    setCurrentScreen('summary');
  };

  // 5. One-Click Instant Live Demo
  const handleLaunchDemo = () => {
    setIsDemoActive(true);
    setCurrentScreen('demo_reveal');
  };

  // 6. Direct launch from Question Library
  const handleSelectQuestionFromLibrary = (q: Question) => {
    setSessionParticipants([
      {
        id: 'p-1',
        name: 'Family Member 1',
        ageGroup: 'senior',
        generationLabel: 'Senior / Grandparent',
        avatarColor: '#DDD6FE',
        emoji: '👵',
      },
      {
        id: 'p-2',
        name: 'Family Member 2',
        ageGroup: 'teen',
        generationLabel: 'Teenager',
        avatarColor: '#FBCFE8',
        emoji: '👧',
      },
    ]);
    setSessionMode(q.mode);
    setSessionCategory(q.category);
    setSessionDuration(15);
    setSessionQuestions([q]);
    setCurrentScreen('session');
  };

  return (
    <div className={`min-h-screen flex flex-col bg-[#FAF6F0] text-[#2E282A] ${getFontSizeClass()} ${settings.highContrast ? 'contrast-105' : ''}`}>
      {/* Top Navigation */}
      <Navbar
        currentScreen={currentScreen}
        onNavigate={(screen) => {
          setIsDemoActive(false);
          setCurrentScreen(screen);
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        settings={settings}
        activeSessionInProgress={currentScreen === 'session'}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {currentScreen === 'welcome' && (
          <WelcomeScreen
            onStartSession={handleStartSession}
            onLaunchDemo={handleLaunchDemo}
            onBrowseLibrary={() => setCurrentScreen('library')}
            onViewSaved={() => setCurrentScreen('saved')}
            savedCount={savedCount}
          />
        )}

        {currentScreen === 'setup' && (
          <SetupScreen
            onBack={() => setCurrentScreen('welcome')}
            onProceedToQuestions={handleProceedToQuestions}
          />
        )}

        {currentScreen === 'question_select' && (
          <QuestionSelectScreen
            initialQuestions={sessionQuestions}
            participants={sessionParticipants}
            mode={sessionMode}
            category={sessionCategory}
            onBack={() => setCurrentScreen('setup')}
            onStartSession={handleBeginLiveSession}
          />
        )}

        {currentScreen === 'session' && (
          <SessionScreen
            questions={sessionQuestions}
            participants={sessionParticipants}
            mode={sessionMode}
            category={sessionCategory}
            onCompleteSession={handleSessionFinished}
            onExitSession={() => setCurrentScreen('welcome')}
          />
        )}

        {currentScreen === 'summary' && activeSessionData && (
          <SummaryScreen
            sessionData={activeSessionData}
            onGoHome={() => setCurrentScreen('welcome')}
            onViewSaved={() => setCurrentScreen('saved')}
          />
        )}

        {currentScreen === 'saved' && (
          <SavedSessionsScreen
            onBack={() => setCurrentScreen('welcome')}
            onStartNew={handleStartSession}
          />
        )}

        {currentScreen === 'library' && (
          <LibraryScreen
            onBack={() => setCurrentScreen('welcome')}
            onSelectQuestionForSession={handleSelectQuestionFromLibrary}
          />
        )}

        {/* Instant Live Demo Screen */}
        {currentScreen === 'demo_reveal' && (
          <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[#E7DFD5] pb-3">
              <button
                onClick={() => setCurrentScreen('welcome')}
                className="px-3 py-1.5 rounded-xl bg-white border border-[#E7DFD5] text-xs font-bold text-[#57534E] hover:bg-[#F5EFE6]"
              >
                ← Exit Demo
              </button>
              <div className="text-center">
                <span className="px-3 py-1 rounded-full bg-[#FEF3C7] border border-[#FCD34D] text-[#92400E] text-xs font-black uppercase">
                  ⭐ Live Competition Walkthrough
                </span>
              </div>
              <button
                onClick={handleStartSession}
                className="px-3 py-1.5 rounded-xl bg-[#9333EA] text-white text-xs font-bold hover:bg-[#7E22CE]"
              >
                Start Real Session
              </button>
            </div>

            <RevealCard
              question={DEMO_PRESET_SESSION.sampleQuestion}
              participants={DEMO_PRESET_SESSION.participants}
              answers={DEMO_PRESET_SESSION.sampleAnswers}
              aiHighlights={DEMO_PRESET_SESSION.sampleAiHighlights}
              onOpenReflection={() => setIsDemoReflectionOpen(true)}
              onNextQuestion={() => {
                // Move from demo to demo summary
                setActiveSessionData({
                  title: 'Demo Session: Eleanor, Marcus & Maya',
                  mode: 'same_question',
                  category: 'friendship',
                  durationMinutes: 10,
                  participants: DEMO_PRESET_SESSION.participants,
                  questionsData: [
                    {
                      questionId: DEMO_PRESET_SESSION.sampleQuestion.id,
                      question: DEMO_PRESET_SESSION.sampleQuestion,
                      answers: DEMO_PRESET_SESSION.sampleAnswers,
                      aiHighlights: DEMO_PRESET_SESSION.sampleAiHighlights,
                    },
                  ],
                });
                setCurrentScreen('summary');
              }}
              isLastQuestion={true}
            />

            <ReflectionModal
              isOpen={isDemoReflectionOpen}
              onClose={() => setIsDemoReflectionOpen(false)}
            />
          </div>
        )}
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={setSettings}
      />
    </div>
  );
}

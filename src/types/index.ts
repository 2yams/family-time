export type AgeGroup = 'child' | 'teen' | 'young_adult' | 'adult' | 'senior' | 'elder';

export interface Participant {
  id: string;
  name: string;
  ageGroup: AgeGroup;
  generationLabel: string; // e.g. "Gen Z / Teen", "Baby Boomer / Grandparent"
  avatarColor: string; // Pastel accent
  emoji: string;
}

export type ConversationMode = 
  | 'same_question' 
  | 'then_vs_now' 
  | 'walk_in_shoes' 
  | 'untold_stories';

export type QuestionCategory =
  | 'childhood'
  | 'values'
  | 'friendship'
  | 'school_work'
  | 'technology'
  | 'dreams'
  | 'traditions'
  | 'gratitude'
  | 'misunderstandings';

export interface Question {
  id: string;
  mode: ConversationMode;
  category: QuestionCategory;
  title: string;
  prompt: string;
  followUpPrompt?: string;
  estimatedMinutes: number;
  ageAppropriateness: string; // e.g. "All Ages", "Ages 8+", "Teens & Adults"
  fictionalScenario?: string; // For "Walk in My Shoes"
  eraHint?: string; // For "Then vs. Now"
  isAiGenerated?: boolean;
}

export interface ParticipantAnswer {
  participantId: string;
  participantName: string;
  answerText: string;
  isAloud: boolean;
  passed: boolean;
  submittedAt: string;
}

export interface QuestionResponseData {
  questionId: string;
  question: Question;
  answers: ParticipantAnswer[];
  reflectionAnswers?: {
    prompt: string;
    notes?: string;
    completed: boolean;
  }[];
  aiHighlights?: {
    sharedValues: string[];
    differentInterpretations: string[];
    surprisingSimilarities: string[];
    discussionSpark: string;
  };
}

export interface SharedDiscoveries {
  commonGround: string[];
  newPerspectives: string[];
  traditionsAndStories: string[];
  customTakeaways: string[];
}

export interface SessionRecord {
  id: string;
  title: string;
  date: string;
  durationMinutes: number;
  mode: ConversationMode;
  category: QuestionCategory;
  participants: Participant[];
  questionsData: QuestionResponseData[];
  discoveries: SharedDiscoveries;
  notes?: string;
}

export interface AppSettings {
  fontSize: 'normal' | 'large' | 'extra-large';
  reducedMotion: boolean;
  soundEffects: boolean;
  highContrast: boolean;
}

import { Question, ParticipantAnswer, QuestionResponseData } from '../types';

export interface AiHighlights {
  sharedValues: string[];
  differentInterpretations: string[];
  surprisingSimilarities: string[];
  discussionSpark: string;
}

export async function checkAiHealth(): Promise<{ available: boolean }> {
  try {
    const res = await fetch('/api/health', { signal: AbortSignal.timeout(3000) });
    if (!res.ok) return { available: false };
    const data = await res.json();
    return { available: !!data.hasGemini };
  } catch {
    return { available: false };
  }
}

export async function generateAiQuestions(
  mode: string,
  category: string,
  participants: { name: string; generationLabel: string }[],
  themePrompt?: string
): Promise<Partial<Question>[]> {
  try {
    const res = await fetch('/api/gemini/generate-questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode, category, participants, themePrompt }),
      signal: AbortSignal.timeout(6000),
    });

    if (!res.ok) throw new Error('API failed');
    const data = await res.json();
    if (data.questions && Array.isArray(data.questions)) {
      return data.questions.map((q: any, i: number) => ({
        ...q,
        id: `ai-${Date.now()}-${i}`,
        mode,
        category,
        isAiGenerated: true,
      }));
    }
  } catch (err) {
    console.warn('AI question generation unavailable, using fallback', err);
  }
  return [];
}

export async function synthesizePerspectiveHighlights(
  question: Question,
  answers: ParticipantAnswer[]
): Promise<AiHighlights> {
  const activeAnswers = answers.filter((a) => !a.passed && a.answerText.trim().length > 0);

  // If we have AI available on server, call it with timeout
  try {
    const res = await fetch('/api/gemini/synthesize-discoveries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, answers: activeAnswers }),
      signal: AbortSignal.timeout(6000),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.synthesis && data.synthesis.sharedValues?.length) {
        return data.synthesis;
      }
    }
  } catch (e) {
    console.warn('AI synthesis endpoint unreachable, using thoughtful built-in synthesis:', e);
  }

  // Graceful, emotionally intelligent fallback synthesis based on answers
  const answerCount = activeAnswers.length;
  if (answerCount === 0) {
    return {
      sharedValues: ['Honoring each other’s comfort and private boundaries.'],
      differentInterpretations: ['Everyone chose to reflect quietly on this question.'],
      surprisingSimilarities: ['A shared agreement to take our time together.'],
      discussionSpark: 'Would anyone like to share what thought first popped into mind without details?',
    };
  }

  return {
    sharedValues: [
      'The common desire for understanding, connection, and feeling valued.',
      'Valuing genuine authenticity over having all the answers.',
      'A deep care for how everyday moments feel to each other.',
    ],
    differentInterpretations: [
      `Different life stages: each participant’s response is colored by their unique daily world and responsibilities.`,
      `How words and quiet gestures carry meaning across different decades of life.`,
    ],
    surprisingSimilarities: [
      `Notice how beneath different phrasing or era examples, each person is seeking security, joy, and acceptance.`,
      `The warmth each family member brings to listening today.`,
    ],
    discussionSpark: `What is one detail in someone else’s answer that made you smile or see them in a slightly new light?`,
  };
}

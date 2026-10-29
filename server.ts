import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Gemini on server-side if key exists
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  try {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasGemini: !!ai,
    environment: process.env.NODE_ENV || 'development',
  });
});

// Endpoint: Generate respectful generational questions
app.post('/api/gemini/generate-questions', async (req: Request, res: Response) => {
  if (!ai) {
    return res.status(503).json({
      error: 'AI service not configured on server',
      fallback: true,
    });
  }

  const { mode, category, participants, themePrompt } = req.body;

  try {
    const prompt = `You are a respectful, emotionally intelligent family conversation facilitator.
Generate 2 thoughtful, age-appropriate conversation questions for a family session.
Mode: ${mode || 'same_question'}
Category/Theme: ${category || 'general'}
Participants: ${JSON.stringify(participants || [])}
Custom theme note: ${themePrompt || 'everyday life and shared understanding'}

CRITICAL GUIDELINES:
- Respectful, warm, curiosity-driven.
- Absolutely NO generational stereotypes or blaming (e.g. no "boomers are stubborn", "teens are lazy").
- Avoid intrusive questions about finances, trauma, health, or family disputes.
- Not a therapy session; keep it light, uplifting, and connective.
- Each question should have a short title, the question prompt, and a gentle follow-up question.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              prompt: { type: Type.STRING },
              followUpPrompt: { type: Type.STRING },
              estimatedMinutes: { type: Type.INTEGER },
              ageAppropriateness: { type: Type.STRING },
              fictionalScenario: { type: Type.STRING },
            },
            required: ['title', 'prompt', 'followUpPrompt', 'estimatedMinutes', 'ageAppropriateness'],
          },
        },
      },
    });

    const parsed = JSON.parse(response.text || '[]');
    return res.json({ questions: parsed });
  } catch (error) {
    console.error('Gemini question generation error:', error);
    return res.status(500).json({ error: 'Failed to generate questions with AI', fallback: true });
  }
});

// Endpoint: Synthesize perspective reveal insights (neutral, highlighting shared values)
app.post('/api/gemini/synthesize-discoveries', async (req: Request, res: Response) => {
  if (!ai) {
    return res.status(503).json({ error: 'AI service not configured', fallback: true });
  }

  const { question, answers } = req.body;

  try {
    const prompt = `Analyze these family responses to the question "${question?.prompt || ''}":
Responses: ${JSON.stringify(answers || [])}

TASK:
Provide neutral, respectful, gentle synthesis:
1. Shared values: Core human themes they all value.
2. Different interpretations: How their era, life stage, or daily realities frame their view.
3. Surprising similarities: Common ground that might surprise them.
4. Discussion spark: A respectful, open-ended question the family could talk about next.

CRITICAL RULES:
- Never label any response as correct or incorrect.
- Never diagnose or judge participants.
- Do not invent facts not present in the answers.
- Warm, respectful, family-friendly tone.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sharedValues: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            differentInterpretations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            surprisingSimilarities: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            discussionSpark: { type: Type.STRING },
          },
          required: ['sharedValues', 'differentInterpretations', 'surprisingSimilarities', 'discussionSpark'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ synthesis: parsed });
  } catch (error) {
    console.error('Gemini synthesis error:', error);
    return res.status(500).json({ error: 'Failed to synthesize perspectives', fallback: true });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Generation Gap server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Server startup error:', err);
});

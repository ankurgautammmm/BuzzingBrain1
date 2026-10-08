import express, { Request, Response } from 'express';
import { parseHandwritingCommand, generateHandwrittenNotes, chatWithScribbleTutor } from './geminiService';
import { NCERT_SYLLABUS, validateNcertSyllabus } from '../src/data/ncertSyllabus';

export const apiRouter = express.Router();

apiRouter.use(express.json());

// Health check
apiRouter.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get NCERT Syllabus Database
apiRouter.get('/syllabus', (_req: Request, res: Response) => {
  res.json({ syllabus: NCERT_SYLLABUS });
});

// Parse Command Only (for instant UI feedback & syllabus validation)
apiRouter.post('/handwriting/parse', (req: Request, res: Response) => {
  try {
    const { command } = req.body;
    if (!command || typeof command !== 'string') {
      return res.status(400).json({ error: 'Command string is required' });
    }

    const parsed = parseHandwritingCommand(command);
    const syllabusValidation = validateNcertSyllabus(parsed.classGrade, parsed.subject, parsed.chapter || parsed.topic);

    return res.json({
      parsed,
      syllabusValidation,
    });
  } catch (error) {
    console.error('Error in /handwriting/parse:', error);
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to parse command' });
  }
});

// Full Pipeline: Parse -> Validate Syllabus -> Retrieve NCERT Context -> AI Generation -> JSON Validation
apiRouter.post('/handwriting/generate', async (req: Request, res: Response) => {
  try {
    const { command, options } = req.body;
    if (!command || typeof command !== 'string') {
      return res.status(400).json({ error: 'Command string is required' });
    }

    // 1. Backend Command Parser
    const parsedCommand = parseHandwritingCommand(command);
    if (options) {
      if (options.penType) parsedCommand.penType = options.penType;
      if (options.paperType) parsedCommand.paperType = options.paperType;
      if (options.inkColor) parsedCommand.inkColor = options.inkColor;
      if (options.fontFamily) parsedCommand.fontFamily = options.fontFamily;
      if (options.thinkingMode) parsedCommand.thinkingMode = options.thinkingMode;
    }

    console.log(`[Handwriting Engine] Generating notes for: ${parsedCommand.classGrade} | ${parsedCommand.subject} | ${parsedCommand.chapter}`);

    // 2. Class / Subject / Chapter detection -> Syllabus validation -> NCERT retrieval -> AI generation -> JSON validation
    const result = await generateHandwrittenNotes(parsedCommand);

    return res.json({
      success: true,
      parsedCommand,
      ...result,
    });
  } catch (error) {
    console.error('Error in /handwriting/generate:', error);
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Generation failed',
      details: String(error)
    });
  }
});

// Multi-turn Chatbot endpoint
apiRouter.post('/chat', async (req: Request, res: Response) => {
  try {
    const { messages, contextNote } = req.body;
    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const reply = await chatWithScribbleTutor(messages, contextNote);
    return res.json({ reply });
  } catch (error) {
    console.error('Error in /chat:', error);
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Chat error' });
  }
});

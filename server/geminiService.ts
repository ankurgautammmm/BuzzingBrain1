import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { NoteContentPayload, HandwritingStyleConfig, CommandParseResult, PenType, InkColor, PaperType, HandwritingFont } from '../src/types';
import { validateNcertSyllabus, NCERT_SYLLABUS } from '../src/data/ncertSyllabus';
import { getCuratedChapterNote } from '../src/data/curatedChapterNotes';

// Shared server-side Gemini client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

/**
 * Backend Command Parser for /handwriting
 * Handles both key-value syntax (class:11 subject:Physics) and CLI flags (--class 10 --neet --formulas)
 * as well as plain topics (/handwriting photosynthesis)
 */
export function parseHandwritingCommand(rawInput: string): CommandParseResult {
  let cleaned = rawInput.trim();
  if (cleaned.startsWith('/handwriting')) {
    cleaned = cleaned.replace(/^\/handwriting\s*/i, '');
  } else if (cleaned.startsWith('/hw')) {
    cleaned = cleaned.replace(/^\/hw\s*/i, '');
  }

  // 1. Detect Note Modes (--short, --detailed, --exam, --revision, --formulas, --mindmap, --questions)
  let mode: any = 'detailed';
  if (/--short\b/i.test(cleaned)) { mode = 'short'; cleaned = cleaned.replace(/--short\b/gi, ''); }
  else if (/--detailed\b/i.test(cleaned)) { mode = 'detailed'; cleaned = cleaned.replace(/--detailed\b/gi, ''); }
  else if (/--exam\b/i.test(cleaned)) { mode = 'exam'; cleaned = cleaned.replace(/--exam\b/gi, ''); }
  else if (/--revision\b/i.test(cleaned)) { mode = 'revision'; cleaned = cleaned.replace(/--revision\b/gi, ''); }
  else if (/--formulas?\b/i.test(cleaned)) { mode = 'formulas'; cleaned = cleaned.replace(/--formulas?\b/gi, ''); }
  else if (/--mindmaps?\b/i.test(cleaned)) { mode = 'mindmap'; cleaned = cleaned.replace(/--mindmaps?\b/gi, ''); }
  else if (/--questions?\b/i.test(cleaned)) { mode = 'questions'; cleaned = cleaned.replace(/--questions?\b/gi, ''); }

  // 2. Detect Target Exam (--neet, --jee, --cbse)
  let targetExam: any = 'cbse';
  if (/--neet\b/i.test(cleaned)) { targetExam = 'neet'; cleaned = cleaned.replace(/--neet\b/gi, ''); }
  else if (/--jee\b/i.test(cleaned)) { targetExam = 'jee'; cleaned = cleaned.replace(/--jee\b/gi, ''); }
  else if (/--cbse\b/i.test(cleaned)) { targetExam = 'cbse'; cleaned = cleaned.replace(/--cbse\b/gi, ''); }

  // 3. Extract Class (--class 9, --class 10, -c 11, class:10)
  const cliClassMatch = cleaned.match(/(?:--class|-c)\s*([0-9]{1,2})/i);
  if (cliClassMatch) {
    cleaned = cleaned.replace(/(?:--class|-c)\s*[0-9]{1,2}/gi, '');
  }
  const kvClassMatch = cleaned.match(/\bclass:?\s*([0-9]{1,2}(?:th)?|[a-zA-Z0-9\s]+?)(?=\s+(?:subject|chapter|topic|style|paper|ink|pen|font|thinking):|$)/i);

  // 4. Extract other flags
  const subjectMatch = cleaned.match(/\bsubject:?\s*([a-zA-Z0-9\s]+?)(?=\s+(?:class|chapter|topic|style|paper|ink|pen|font|thinking):|$)/i);
  const chapterMatch = cleaned.match(/\bchapter:?\s*([a-zA-Z0-9\s,\-–':]+?)(?=\s+(?:class|subject|topic|style|paper|ink|pen|font|thinking):|$)/i);
  const topicMatch = cleaned.match(/\btopic:?\s*([a-zA-Z0-9\s,\-–':]+?)(?=\s+(?:class|subject|chapter|style|paper|ink|pen|font|thinking):|$)/i);
  const penMatch = cleaned.match(/\b(?:style|pen):?\s*(gel-pen|fountain-pen|ballpoint|pencil)/i);
  const paperMatch = cleaned.match(/\bpaper:?\s*(ruled-notebook|grid-math|vintage-parchment|clean-ivory|legal-pad)/i);
  const inkMatch = cleaned.match(/\b(?:color|ink):?\s*(royal-blue|classic-black|academic-red|emerald-green|pencil-gray)/i);
  const fontMatch = cleaned.match(/\bfont:?\s*(Caveat|Kalam|Patrick Hand|Indie Flower|Architects Daughter|Homemade Apple)/i);
  const thinkingMatch = cleaned.match(/\bthinking:?\s*(high|standard)/i);

  let classGrade = cliClassMatch ? `Class ${cliClassMatch[1]}` : (kvClassMatch ? kvClassMatch[1].trim() : '');
  let subject = subjectMatch ? subjectMatch[1].trim() : '';
  let chapter = chapterMatch ? chapterMatch[1].trim() : '';
  let topic = topicMatch ? topicMatch[1].trim() : '';

  // 5. Natural Language & Topic Discovery
  if (!chapter && !topic) {
    let cleanTopic = cleaned
      .replace(/\b(?:class|subject|chapter|topic|style|paper|ink|pen|font|thinking):[^\s]+/gi, '')
      .replace(/--[a-zA-Z0-9_-]+/gi, '')
      .trim();

    if (cleanTopic) {
      topic = cleanTopic;
      chapter = cleanTopic;

      // Intelligent topic-to-syllabus mapper
      const topicLower = cleanTopic.toLowerCase();
      if (!classGrade) {
        if (/photosynthesis|respiration|heart|digestion|nephron|life process|light|reflection|refraction|acid|base|metal|carbon/i.test(topicLower)) {
          classGrade = 'Class 10';
          subject = 'Science';
        } else if (/quadratic|real number|polynomial|arithmetic progression|trigonometry/i.test(topicLower)) {
          classGrade = 'Class 10';
          subject = 'Mathematics';
        } else if (/matter|tissue|motion|sound|gravitation|cell|force/i.test(topicLower)) {
          classGrade = 'Class 9';
          subject = 'Science';
        } else if (/electrostat|current electricity|wave optic|ray optic|charge|dipole|transistor|semiconductor/i.test(topicLower)) {
          classGrade = 'Class 12';
          subject = 'Physics';
        } else if (/solution|electrochem|kinetics|coordination|biomolecule|haloalkane|amine/i.test(topicLower)) {
          classGrade = 'Class 12';
          subject = 'Chemistry';
        } else if (/reproduction|genetics|dna|inheritance|evolution|biotech|ecology|population/i.test(topicLower)) {
          classGrade = 'Class 12';
          subject = 'Biology';
        } else if (/laws of motion|friction|vector|projectile|work energy|gravitation|thermodynamics/i.test(topicLower)) {
          classGrade = 'Class 11';
          subject = 'Physics';
        }
      }
    }
  }

  // Fallback defaults
  if (!classGrade) classGrade = 'Class 10';
  if (!subject) subject = 'Science';
  if (!chapter) chapter = 'Life Processes';
  if (!topic) topic = chapter;

  if (!classGrade.toLowerCase().startsWith('class')) {
    classGrade = `Class ${classGrade.replace(/th/i, '').trim()}`;
  }

  return {
    classGrade,
    subject,
    chapter,
    topic,
    mode,
    targetExam,
    penType: (penMatch ? penMatch[1].toLowerCase() : 'gel-pen') as PenType,
    paperType: (paperMatch ? paperMatch[1].toLowerCase() : (subject.toLowerCase().includes('math') ? 'grid-math' : 'ruled-notebook')) as PaperType,
    inkColor: (inkMatch ? inkMatch[1].toLowerCase() : 'royal-blue') as InkColor,
    fontFamily: (fontMatch ? fontMatch[1] : 'Kalam') as HandwritingFont,
    thinkingMode: (thinkingMatch && thinkingMatch[1].toLowerCase() === 'standard') ? 'standard' : 'high',
    rawCommand: rawInput,
  };
}

/**
 * Builds rich, authentic curriculum-grounded notes fallback matching the 2-page handwritten register layout.
 */
function buildCuratedNcertNote(
  validatedClass: string,
  validatedSubject: string,
  chapterName: string,
  _unitName?: string,
  _topicName?: string,
  _keyTopics?: string[]
): NoteContentPayload {
  return getCuratedChapterNote(validatedClass, validatedSubject, chapterName);
}

/**
 * Generate Authentic NCERT Handwritten Notes with Gemini & Resilient Fallbacks
 */
export async function generateHandwrittenNotes(command: CommandParseResult): Promise<{
  noteContent: NoteContentPayload;
  styleConfig: HandwritingStyleConfig;
  syllabusValidation: ReturnType<typeof validateNcertSyllabus>;
}> {
  // 1. Syllabus Validation
  const syllabusValidation = validateNcertSyllabus(command.classGrade, command.subject, command.chapter || command.topic);
  const validatedClass = syllabusValidation.normalizedClass;
  const validatedSubject = syllabusValidation.normalizedSubject;
  const chapterName = syllabusValidation.matchedChapter?.name || command.chapter;
  const unitName = syllabusValidation.matchedChapter?.unit || 'NCERT Curriculum Unit';
  const keyTopics = syllabusValidation.matchedChapter?.keyTopics || [];

  // 2. High-Yield Prompting tailored to real student notebook pages
  const requestedMode = command.mode || 'detailed';
  const targetExam = command.targetExam || 'cbse';

  const systemInstruction = `You are a CBSE & NCERT National Exam Topper and educational author for Buzzing Brain.
Your task is to generate AUTHENTIC, EXAM-ORIENTED, AND COMPREHENSIVE AI handwritten study notes that look like they were written by a top student in a real physical notebook.

Follow these strict rules:
1. Target syllabus: 2026–27 NCERT Syllabus for ${validatedClass} ${validatedSubject}. Preserve all official definitions, formulas, and concepts. Never invent facts.
2. Note Mode: ${requestedMode.toUpperCase()} (${requestedMode === 'formulas' ? 'Focus purely on formulas, variables, and worked numericals' : requestedMode === 'short' ? 'Concise one-shot high yield summary' : requestedMode === 'mindmap' ? 'Hierarchical visual flowchart mindmap' : requestedMode === 'questions' ? 'High probability board questions with step-wise model answers' : 'Complete in-depth chapter notes'}).
3. Exam Target: ${targetExam.toUpperCase()} (Adjust difficulty, depth, and tips accordingly).
4. Highlight System:
   - Blue pen: Normal explanations and derivations.
   - Yellow highlight: Key concept names and definitions.
   - Red pen: Warning / common student mistakes (warningMistakes array).
   - Green: Formula / key numerical results (formulaBlocks array).
   - Star: Important exam points (starredPoints array).
5. For Mathematical & Numerical content: Write formulas with clear variable definitions, step-by-step calculations, and boxed final answers with units.
6. For Science/Biology/Physics/Chemistry/Geography: Include clear hand-drawn diagram specifications with labels and explanation arrows.
7. Return strictly valid JSON matching the requested schema without markdown backticks.`;

  const userPrompt = `Generate authentic handwritten student notes for:
Topic / Chapter: ${chapterName}
Class: ${validatedClass}
Subject: ${validatedSubject}
Unit: ${unitName}
Topic Details: ${command.topic}
Prescribed Syllabus Topics: ${keyTopics.join(', ') || chapterName}
Mode: ${requestedMode}
Target: ${targetExam}

JSON Schema:
{
  "title": "${chapterName} : Handwritten Notes",
  "classGrade": "${validatedClass}",
  "subject": "${validatedSubject}",
  "chapter": "${chapterName}",
  "topic": "${command.topic}",
  "mode": "${requestedMode}",
  "targetExam": "${targetExam}",
  "syllabusContext": "Official NCERT ${validatedClass} ${validatedSubject} (2026–27 Session)",
  "examWeightageTip": "Expected board marks distribution and key question types",
  "sections": [
    {
      "heading": "Chapter / Concept Heading",
      "subheading": "In-depth Subtopic",
      "content": "Detailed theoretical explanation in student handwriting friendly tone.",
      "bullets": ["Point 1", "Point 2", "Point 3"],
      "importantFormulas": ["Core formula with variables"],
      "formulaBlocks": [
        {
          "title": "Governing Formula Name",
          "formula": "Standard formula notation",
          "variables": ["v = velocity in m/s", "t = time in s"],
          "exampleProblem": {
            "statement": "Sample numerical problem",
            "steps": ["Step 1: Given values", "Step 2: Formula substitution", "Step 3: Calculation"],
            "boxedAnswer": "Final Answer",
            "units": "SI units"
          }
        }
      ],
      "highlighterWords": ["Important Concept", "Key Term"],
      "warningMistakes": ["Common exam blunder or trap students make here"],
      "starredPoints": ["High yield examination question alert"],
      "postItNote": {
        "color": "yellow",
        "title": "Topper Memory Hack",
        "text": "Specific mnemonic or memory aid"
      },
      "marginAnnotation": "✎ NCERT Core",
      "diagram": {
        "title": "Hand-Drawn Diagram Title",
        "type": "biology_anatomy",
        "caption": "Accurate student diagram reproducible in exams",
        "asciiSketch": "Clean structured sketch",
        "keySteps": ["Step 1: Draw outline", "Step 2: Label arrows"],
        "labels": [
          {"label": "Part A", "arrow": "Left side"},
          {"label": "Part B", "arrow": "Right side"}
        ]
      }
    }
  ],
  "topperMnemonics": ["Mnemonic 1", "Mnemonic 2"],
  "ncertExamAlert": "Warning on where students commonly lose marks in board evaluations",
  "quickSummaryReview": ["Summary point 1", "Summary point 2", "Summary point 3"],
  "sampleQuestion": {
    "question": "Realistic CBSE Board Exam Question",
    "answer": "Complete step-by-step model answer"
  }
}`;

  let rawJsonText = '';

  try {
    if (command.thinkingMode === 'high') {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: userPrompt,
          config: {
            systemInstruction,
            thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
            responseMimeType: 'application/json',
          },
        });
        rawJsonText = response.text || '';
      } catch (highErr) {
        console.warn('High thinking failed, attempting standard gemini-3.8-flash:', highErr);
        const fallbackRes = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: userPrompt,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
          },
        });
        rawJsonText = fallbackRes.text || '';
      }
    } else {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: userPrompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
        },
      });
      rawJsonText = response.text || '';
    }
  } catch (apiErr) {
    console.warn('Gemini API call hit quota/error. Providing curated NCERT syllabus topper notes:', apiErr);
    rawJsonText = ''; // Triggers curated fallback
  }

  // 3. JSON Validation & Defensive Parsing
  let parsedPayload: NoteContentPayload;
  if (rawJsonText) {
    try {
      const cleanedJson = rawJsonText
        .replace(/^```json/i, '')
        .replace(/^```/i, '')
        .replace(/```$/i, '')
        .trim();
      parsedPayload = JSON.parse(cleanedJson);
    } catch (err) {
      console.error('Failed to parse Gemini JSON, falling back to curated schema:', err);
      parsedPayload = buildCuratedNcertNote(validatedClass, validatedSubject, chapterName, unitName, command.topic, keyTopics);
    }
  } else {
    parsedPayload = buildCuratedNcertNote(validatedClass, validatedSubject, chapterName, unitName, command.topic, keyTopics);
  }

  // 4. Build Default Style Config
  const styleConfig: HandwritingStyleConfig = {
    penType: command.penType,
    inkColor: command.inkColor,
    paperType: command.paperType,
    fontFamily: command.fontFamily,
    fontSize: 20,
    slantAngle: 0.3,
    inkPressure: 'medium',
    highlightColor: 'yellow',
    showMarginLine: true,
    showHoles: command.paperType === 'ruled-notebook',
  };

  return {
    noteContent: parsedPayload,
    styleConfig,
    syllabusValidation,
  };
}

/**
 * AI Study Buddy Multi-turn Chat using Gemini
 */
export async function chatWithScribbleTutor(
  messages: { role: 'user' | 'model'; text: string }[],
  contextNote?: NoteContentPayload
): Promise<string> {
  let contextPrompt = '';
  if (contextNote) {
    contextPrompt = `Current Active Note Context:
Title: ${contextNote.title} (${contextNote.classGrade} - ${contextNote.subject})
Chapter: ${contextNote.chapter} - Topic: ${contextNote.topic}
Summary: ${contextNote.quickSummaryReview.join(', ')}
`;
  }

  const systemInstruction = `You are "Buzzing Brain AI Tutor", an encouraging, brilliant AI study buddy and NCERT mentor for Buzzing Brain (Free Education for All).
You help school students (Classes 9, 10, 11, and 12) understand tough concepts in Physics, Chemistry, Biology, and Mathematics, prepare for CBSE Board examinations, solve NCERT Exemplar questions, and generate handwritten study notes commands.
Provide concise, easy-to-understand explanations with bullet points and mnemonics.
${contextPrompt}`;

  try {
    const contents = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
      }
    });

    return response.text || 'I am ready to help you with your NCERT notes!';
  } catch (err) {
    console.warn('Chat tutor hit quota or network limit, providing helpful response:', err);
    const lastUserMsg = messages[messages.length - 1]?.text || '';
    return `Namaste! Regarding your query on "${lastUserMsg.substring(0, 60)}":

Here are the key NCERT exam pointers:
• Focus on official definitions and SI units directly from the NCERT textbook.
• In CBSE examinations, step-by-step derivations with neat diagrams earn full marks.
• Review the chapter summary and NCERT in-text solved examples.

Free education for all on Buzzing Brain! Let me know if you would like me to synthesize complete handwritten notes for this topic.`;
  }
}

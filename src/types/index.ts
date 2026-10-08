/**
 * Core Type Definitions for NCERT ScribbleAI
 */

export type PenType = 'gel-pen' | 'fountain-pen' | 'ballpoint' | 'pencil';
export type InkColor = 'royal-blue' | 'classic-black' | 'academic-red' | 'emerald-green' | 'pencil-gray';
export type PaperType = 'ruled-notebook' | 'grid-math' | 'vintage-parchment' | 'clean-ivory' | 'legal-pad';
export type HandwritingFont = 'Caveat' | 'Kalam' | 'Patrick Hand' | 'Indie Flower' | 'Architects Daughter' | 'Homemade Apple';

export type NotesMode = 'short' | 'detailed' | 'exam' | 'revision' | 'formulas' | 'mindmap' | 'questions';
export type ExamTarget = 'cbse' | 'neet' | 'jee' | 'general';

export interface HandwritingStyleConfig {
  penType: PenType;
  inkColor: InkColor;
  paperType: PaperType;
  fontFamily: HandwritingFont;
  fontSize: number; // e.g. 18 - 24
  slantAngle: number; // -1 to 2 deg
  inkPressure: 'light' | 'medium' | 'deep';
  highlightColor: 'yellow' | 'pink' | 'green' | 'orange';
  showMarginLine: boolean;
  showHoles: boolean;
}

export interface DiagramSpec {
  title: string;
  type: 'flowchart' | 'chemistry_reaction' | 'ray_diagram' | 'cycle' | 'table' | 'geometry' | 'biology_anatomy';
  caption: string;
  asciiSketch?: string;
  svgData?: string;
  keySteps?: string[];
  labels?: { label: string; x?: number; y?: number; arrow?: string }[];
}

export interface NoteIllustration {
  title?: string;
  type?: 'sketch' | 'cell' | 'flow' | 'organism' | 'custom';
  items?: {
    name: string;
    caption?: string;
    color?: string;
    symbol?: string;
    sketchAscii?: string;
  }[];
}

export interface NoteComparisonTable {
  title?: string;
  headers: string[];
  rows: string[][];
}

export interface FormulaBlock {
  title: string;
  formula: string;
  variables?: string[];
  derivationSummary?: string;
  exampleProblem?: {
    statement: string;
    steps: string[];
    boxedAnswer: string;
    units: string;
  };
}

export interface NoteSection {
  heading: string;
  subheading?: string;
  content: string;
  bullets?: string[];
  importantFormulas?: string[];
  formulaBlocks?: FormulaBlock[];
  highlighterWords?: string[];
  starredPoints?: string[];
  warningMistakes?: string[]; // Red pen warnings / common errors
  postItNote?: {
    color: 'yellow' | 'pink' | 'blue' | 'green';
    title?: string;
    text: string;
  };
  marginAnnotation?: string;
  diagram?: DiagramSpec;
  comparisonTable?: NoteComparisonTable;
  illustration?: NoteIllustration;
}

export interface NotebookPage {
  pageNumber: number;
  totalCoursePages: number;
  pageHeader: string;
  pageKicker?: string;
  sections: NoteSection[];
  marginNotes?: string[];
  pageType?: 'concept' | 'diagram' | 'derivation' | 'revision' | 'exam_tips';
}

export interface NoteContentPayload {
  title: string;
  classGrade: string;
  subject: string;
  chapter: string;
  topic: string;
  mode?: NotesMode;
  targetExam?: ExamTarget;
  syllabusContext: string;
  examWeightageTip: string;
  sections: NoteSection[];
  pages?: NotebookPage[]; // Multi-page notebook architecture
  topperMnemonics?: string[];
  ncertExamAlert?: string;
  quickSummaryReview: string[];
  sampleQuestion?: {
    question: string;
    answer: string;
  };
}

export interface StudyNote {
  id: string;
  title: string;
  classGrade: string;
  subject: string;
  chapter: string;
  topic?: string;
  commandUsed: string;
  contentJson: string; // Serialized NoteContentPayload
  parsedContent?: NoteContentPayload;
  styleConfig: string; // Serialized HandwritingStyleConfig
  parsedStyle?: HandwritingStyleConfig;
  userId: string;
  userEmail?: string;
  userName?: string;
  isPublic: boolean;
  likesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  photoURL?: string;
  role: 'student' | 'admin';
  classPreference?: string;
  className?: string;
  age?: number | string;
  sex?: 'Male' | 'Female' | 'Other' | 'Prefer not to say' | string;
  mobileNumber?: string;
  targetExam?: string;
  acceptedTerms: boolean;
  onboardedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type ComplaintCategory = 
  | 'Syllabus Mismatch'
  | 'Generation Error'
  | 'Handwriting Rendering Issue'
  | 'Account Issue'
  | 'Other';

export type ComplaintStatus = 'pending' | 'in_review' | 'resolved';

export interface ComplaintTicket {
  id: string;
  ticketId: string;
  userId: string;
  userEmail: string;
  userName: string;
  category: ComplaintCategory;
  title: string;
  description: string;
  status: ComplaintStatus;
  adminNotes?: string;
  relatedNoteId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommandParseResult {
  classGrade: string;
  subject: string;
  chapter: string;
  topic: string;
  penType: PenType;
  inkColor: InkColor;
  paperType: PaperType;
  fontFamily: HandwritingFont;
  thinkingMode: 'standard' | 'high';
  rawCommand: string;
  mode?: NotesMode;
  targetExam?: ExamTarget;
  isContentText?: boolean;
  customContent?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

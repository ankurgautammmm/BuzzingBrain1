import React, { useRef, useState } from 'react';
import { 
  Printer, 
  Share2, 
  Bookmark, 
  BookmarkCheck, 
  Check, 
  Sparkles, 
  ZoomIn, 
  ZoomOut, 
  FileText,
  AlertTriangle,
  Lightbulb,
  BookOpen,
  ArrowRight,
  Download,
  RotateCcw,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Columns,
  Eye,
  Maximize2
} from 'lucide-react';
import { NoteContentPayload, HandwritingStyleConfig, NoteSection } from '../types';

interface HandwrittenNoteRendererProps {
  note: NoteContentPayload;
  styleConfig: HandwritingStyleConfig;
  onSaveToLibrary?: () => void;
  isSaved?: boolean;
  onOpenChatWithNote?: (note: NoteContentPayload) => void;
  rawNoteId?: string;
  isLoggedIn?: boolean;
  onRequireAuth?: () => void;
  onRegeneratePage?: (pageIndex: number) => void;
  onRegenerateSection?: (sectionIndex: number) => void;
}

export const HandwrittenNoteRenderer: React.FC<HandwrittenNoteRendererProps> = ({
  note,
  styleConfig,
  onSaveToLibrary,
  isSaved = false,
  onOpenChatWithNote,
  rawNoteId,
  isLoggedIn = false,
  onRequireAuth,
  onRegeneratePage,
  onRegenerateSection,
}) => {
  const noteRef = useRef<HTMLDivElement>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [copiedLink, setCopiedLink] = useState(false);
  const [currentFont, setCurrentFont] = useState(styleConfig.fontFamily || 'Kalam');
  const [currentInk, setCurrentInk] = useState(styleConfig.inkColor || 'royal-blue');
  const [paperType, setPaperType] = useState(styleConfig.paperType || 'ruled-notebook');

  // Notebook View Mode: 'spread' (2-page open notebook spread) | 'single' (browse page-by-page) | 'all' (all pages printable)
  const [layoutMode, setLayoutMode] = useState<'spread' | 'single' | 'all'>('spread');
  const [activeSinglePage, setActiveSinglePage] = useState<number>(1);

  // Class ink styling
  const getInkColorClass = (ink: string) => {
    switch (ink) {
      case 'royal-blue': return 'text-[#1e3a8a]';
      case 'classic-black': return 'text-[#18181b]';
      case 'academic-red': return 'text-[#881337]';
      case 'emerald-green': return 'text-[#064e3b]';
      case 'pencil-gray': return 'text-[#374151]';
      default: return 'text-[#1e3a8a]';
    }
  };

  const getHeadingInkClass = (ink: string) => {
    switch (ink) {
      case 'royal-blue': return 'text-[#172554] border-[#1e3a8a]';
      case 'classic-black': return 'text-[#09090b] border-[#18181b]';
      case 'academic-red': return 'text-[#4c0519] border-[#881337]';
      case 'emerald-green': return 'text-[#022c22] border-[#064e3b]';
      default: return 'text-[#172554] border-[#1e3a8a]';
    }
  };

  // Paper styling
  const getPaperBgStyle = () => {
    if (paperType === 'grid-math') {
      return {
        backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.15) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        backgroundColor: '#fafaf9',
      };
    }
    if (paperType === 'vintage-parchment') {
      return {
        backgroundImage: 'linear-gradient(rgba(180, 83, 9, 0.18) 1px, transparent 1px)',
        backgroundSize: '100% 32px',
        backgroundPosition: '0 12px',
        backgroundColor: '#fef3c7',
      };
    }
    if (paperType === 'clean-ivory') {
      return {
        backgroundColor: '#fffbeb',
      };
    }
    // Default: ruled notebook with blue lines
    return {
      backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.22) 1px, transparent 1px)',
      backgroundSize: '100% 32px',
      backgroundPosition: '0 12px',
      backgroundColor: '#fbf9f2',
    };
  };

  // Multi-page page partitioning
  // Divide sections logically across 2 or 4 pages
  const totalSections = note.sections.length;
  const leftPageSections = note.sections.slice(0, Math.ceil(totalSections / 2));
  const rightPageSections = note.sections.slice(Math.ceil(totalSections / 2));

  // Determine if topic is Photosynthesis, Quadratic equations, etc. for rich diagrams
  const isPhotosynthesis = /photosynthesis|chloroplast|light reaction/i.test(note.topic + ' ' + note.title + ' ' + note.chapter);
  const isQuadratic = /quadratic|parabola|discriminant|ax\^2/i.test(note.topic + ' ' + note.title + ' ' + note.chapter);
  const isPhysics = note.subject.toLowerCase().includes('physic') || /motion|force|charge|field|current|gravity/i.test(note.topic + ' ' + note.title);

  const handlePrint = () => {
    if (!isLoggedIn && onRequireAuth) {
      onRequireAuth();
      return;
    }
    const originalTitle = document.title;
    document.title = `${note.classGrade} - ${note.chapter} - Buzzing Brain Notes`;
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  };

  const handleDownloadPdf = () => {
    if (!isLoggedIn && onRequireAuth) {
      onRequireAuth();
      return;
    }
    const originalTitle = document.title;
    document.title = `${note.classGrade}_${note.subject}_${note.chapter}_TopperNotes`.replace(/[^a-zA-Z0-9_-]/g, '_');
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  };

  const handleCopyShare = () => {
    const shareText = `NCERT Handwritten Study Notes: ${note.title}\nClass: ${note.classGrade} | Subject: ${note.subject} | Chapter: ${note.chapter}\nGenerated on Buzzing Brain — Free Education for All.`;
    navigator.clipboard.writeText(shareText);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Render a specific section with realistic handwritten annotations
  const renderSectionBlock = (section: NoteSection, globalIdx: number) => {
    return (
      <div key={globalIdx} className="space-y-3 relative group">
        {/* Section Heading & Number */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2.5">
            <span className="w-7 h-7 rounded-full border-2 border-current flex items-center justify-center shrink-0 font-bold text-sm sm:text-base mt-0.5 bg-white/80 shadow-2xs">
              {globalIdx + 1}
            </span>
            <div>
              <span className="font-bold px-2 py-0.5 bg-amber-200/70 rounded-md text-amber-950 inline-block text-lg sm:text-xl underline decoration-wavy decoration-amber-500/60">
                {section.heading}
              </span>
              {section.subheading && (
                <span className="block text-xs sm:text-sm font-sans font-semibold text-slate-700 italic mt-0.5">
                  {section.subheading}
                </span>
              )}
            </div>
          </div>

          {/* Regenerate Section Quick Button */}
          {onRegenerateSection && (
            <button
              onClick={() => onRegenerateSection(globalIdx)}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg bg-black/10 hover:bg-black/20 text-slate-700 text-xs flex items-center gap-1 cursor-pointer print:hidden"
              title="Regenerate this section"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Blue Pen Main Explanation Content with Natural Margins */}
        <div className="p-3 bg-blue-50/70 border border-blue-300/80 rounded-xl relative shadow-2xs">
          <p className="text-lg sm:text-xl font-medium leading-relaxed">
            {section.content}
          </p>
        </div>

        {/* Bullet Points with Hand-drawn markers */}
        {section.bullets && section.bullets.length > 0 && (
          <ul className="space-y-1.5 pl-3 text-base sm:text-lg leading-snug">
            {section.bullets.map((b, bIdx) => (
              <li key={bIdx} className="flex items-start gap-2">
                <span className="text-pink-600 font-bold select-none text-xl leading-none">&bull;</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Formula Blocks with Boxed Notation & Worked Numerical */}
        {section.formulaBlocks && section.formulaBlocks.length > 0 && (
          <div className="space-y-3 my-2">
            {section.formulaBlocks.map((fb, fbIdx) => (
              <div key={fbIdx} className="p-3 bg-emerald-50/80 border-2 border-emerald-500 rounded-2xl shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs font-sans font-bold text-emerald-900 uppercase tracking-wide">
                  <span>🟢 Formula: {fb.title}</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-200/80">Key Result</span>
                </div>

                <div className="p-2.5 bg-white/90 border-2 border-dashed border-emerald-400 rounded-xl text-center">
                  <span className="font-mono text-lg sm:text-xl font-extrabold text-emerald-950 inline-block px-3 py-1 bg-emerald-100/50 rounded-lg">
                    {fb.formula}
                  </span>
                </div>

                {fb.variables && fb.variables.length > 0 && (
                  <div className="text-xs font-sans text-emerald-900 flex flex-wrap gap-x-3 gap-y-1 pt-1">
                    {fb.variables.map((v, vIdx) => (
                      <span key={vIdx} className="font-mono bg-emerald-100/60 px-1.5 py-0.5 rounded">
                        {v}
                      </span>
                    ))}
                  </div>
                )}

                {/* Boxed Worked Example Problem */}
                {fb.exampleProblem && (
                  <div className="mt-2 pt-2 border-t border-emerald-200/80 text-xs sm:text-sm font-sans space-y-1.5">
                    <span className="font-bold text-emerald-950 block">
                      Worked Numerical Example:
                    </span>
                    <p className="italic text-slate-800">
                      Q: {fb.exampleProblem.statement}
                    </p>
                    <div className="space-y-0.5 pl-2 border-l-2 border-emerald-400">
                      {fb.exampleProblem.steps.map((st, sIdx) => (
                        <div key={sIdx} className="text-slate-900 font-mono text-[11px] sm:text-xs">
                          {st}
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 text-right">
                      <span className="inline-block px-3 py-1 bg-emerald-200 text-emerald-950 font-mono font-black text-sm border-2 border-emerald-600 rounded-lg shadow-2xs">
                        Boxed Answer: {fb.exampleProblem.boxedAnswer} {fb.exampleProblem.units}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Standard Important Formulas Array if formulaBlocks not present */}
        {(!section.formulaBlocks || section.formulaBlocks.length === 0) && section.importantFormulas && section.importantFormulas.length > 0 && (
          <div className="p-3 bg-emerald-50/70 border-2 border-dashed border-emerald-500 rounded-xl my-2">
            <span className="text-xs font-bold text-emerald-900 font-sans block mb-1 uppercase tracking-wider">
              🟢 Governing Formulas &bull; NCERT Equations
            </span>
            <div className="space-y-1 font-mono text-base font-bold text-emerald-950">
              {section.importantFormulas.map((f, fIdx) => (
                <div key={fIdx} className="p-1 bg-white/70 rounded-md border border-emerald-200">
                  {f}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Yellow Highlighters: Important Concepts */}
        {section.highlighterWords && section.highlighterWords.length > 0 && (
          <div className="flex flex-wrap gap-1.5 my-2">
            {section.highlighterWords.map((hw, hIdx) => (
              <span
                key={hIdx}
                className="px-2 py-0.5 bg-yellow-200/80 border border-yellow-400/80 text-yellow-950 rounded-md font-bold text-sm shadow-2xs"
              >
                🟡 {hw}
              </span>
            ))}
          </div>
        )}

        {/* Red Pen Warnings: Common Mistakes */}
        {section.warningMistakes && section.warningMistakes.length > 0 && (
          <div className="p-2.5 bg-rose-50/90 border-2 border-rose-400 rounded-xl my-2 text-rose-950 text-sm font-sans flex items-start gap-2 shadow-2xs">
            <span className="text-rose-600 font-black text-base select-none">🔴</span>
            <div>
              <strong className="text-rose-900 block font-bold text-xs uppercase tracking-wider">
                Red Pen Alert: Common Student Mistake
              </strong>
              {section.warningMistakes.map((w, wIdx) => (
                <p key={wIdx} className="mt-0.5">{w}</p>
              ))}
            </div>
          </div>
        )}

        {/* Starred Exam Questions */}
        {section.starredPoints && section.starredPoints.length > 0 && (
          <div className="p-2.5 bg-amber-50/90 border border-amber-300 rounded-xl text-base font-semibold text-amber-950 flex items-start gap-2 shadow-2xs my-2">
            <span className="text-amber-600 font-bold text-lg select-none">★</span>
            <div>
              <span className="text-xs font-mono font-bold uppercase text-amber-800 block">
                Exam Topper Point
              </span>
              <span>{section.starredPoints[0]}</span>
            </div>
          </div>
        )}

        {/* Post-It Sticky Note Memory Hack */}
        {section.postItNote && (
          <div className="my-3 flex justify-end">
            <div className="w-full sm:w-64 bg-yellow-100 border border-yellow-300 rounded-xl p-3 shadow-md rotate-[-1.5deg] relative">
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-3 bg-amber-200/70 border border-amber-300/40 rounded-xs"></div>
              <div className="text-xs font-sans font-bold text-amber-900 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                {section.postItNote.title || 'Topper Memory Hack'}
              </div>
              <p className="text-sm text-amber-950 leading-snug">
                {section.postItNote.text}
              </p>
            </div>
          </div>
        )}

        {/* Margin Annotation */}
        {section.marginAnnotation && (
          <div className="text-right text-xs font-mono font-bold text-pink-700 italic">
            {section.marginAnnotation}
          </div>
        )}
      </div>
    );
  };

  // Scientific Diagrams & Visuals renderer
  const renderDiagramsSection = () => {
    return (
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between border-b border-slate-300 pb-1.5 text-xs font-sans font-bold text-slate-700 uppercase tracking-wider">
          <span>🎨 Hand-Drawn Exam Diagrams &amp; Flowcharts</span>
          <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded text-slate-800">Reproducible in Board Exams</span>
        </div>

        {/* Photosynthesis Specific Hand-Drawn Diagram */}
        {isPhotosynthesis && (
          <div className="p-4 bg-emerald-50/90 border-2 border-emerald-400 rounded-2xl shadow-sm space-y-3 font-sans">
            <div className="text-center">
              <h4 className="font-extrabold text-sm sm:text-base text-emerald-950">
                Leaf Cross-Section &amp; Chloroplast (Photosynthesis Apparatus)
              </h4>
              <p className="text-xs text-emerald-800 italic mt-0.5">
                Labelled diagram with guard cells, stomatal pore, and light reactions
              </p>
            </div>

            {/* SVG Visual of Leaf & Stomata */}
            <div className="flex justify-center py-2">
              <svg viewBox="0 0 460 180" className="w-full max-w-md h-auto bg-white/90 rounded-xl border border-emerald-300 shadow-2xs">
                {/* Upper Cuticle & Epidermis */}
                <rect x="20" y="20" width="420" height="20" fill="#dcfce7" stroke="#16a34a" strokeWidth="1.5" />
                <text x="230" y="34" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#166534">Upper Cuticle &amp; Epidermis</text>

                {/* Palisade Mesophyll with Chloroplasts */}
                <rect x="20" y="45" width="420" height="50" fill="#bbf7d0" stroke="#15803d" strokeWidth="1.5" />
                <text x="230" y="70" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#14532d">Palisade Mesophyll (Dense Chloroplasts: Light Absorption)</text>
                <circle cx="60" cy="80" r="4" fill="#16a34a" />
                <circle cx="120" cy="80" r="4" fill="#16a34a" />
                <circle cx="200" cy="80" r="4" fill="#16a34a" />
                <circle cx="300" cy="80" r="4" fill="#16a34a" />
                <circle cx="390" cy="80" r="4" fill="#16a34a" />

                {/* Spongy Mesophyll with Air Cavities */}
                <rect x="20" y="100" width="420" height="40" fill="#f0fdf4" stroke="#86efac" strokeWidth="1.5" />
                <text x="230" y="122" fontSize="10" textAnchor="middle" fill="#166534">Spongy Parenchyma &amp; Intercellular Air Spaces</text>

                {/* Stomata with Guard Cells at bottom */}
                <rect x="20" y="145" width="160" height="18" fill="#dcfce7" stroke="#16a34a" strokeWidth="1.5" />
                {/* Guard Cells Gap */}
                <ellipse cx="205" cy="154" rx="14" ry="8" fill="#4ade80" stroke="#15803d" strokeWidth="1.5" />
                <ellipse cx="245" cy="154" rx="14" ry="8" fill="#4ade80" stroke="#15803d" strokeWidth="1.5" />
                <rect x="270" y="145" width="170" height="18" fill="#dcfce7" stroke="#16a34a" strokeWidth="1.5" />

                {/* Pointer Arrows */}
                <path d="M 225,175 L 225,160" stroke="#b91c1c" strokeWidth="1.5" markerEnd="url(#arrow)" />
                <text x="225" y="178" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#b91c1c">Stomatal Pore (Gas Exchange: CO2 in, O2 out)</text>
              </svg>
            </div>

            {/* Word Equation & Chemical Equation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
              <div className="p-2.5 bg-white/80 rounded-xl border border-emerald-300">
                <span className="font-bold text-emerald-950 block">Word Equation:</span>
                <p className="font-mono text-emerald-900 mt-1">
                  Carbon dioxide + Water &minus;&minus;(Light/Chlorophyll)&minus;&minus;&rarr; Glucose + Oxygen + Water
                </p>
              </div>

              <div className="p-2.5 bg-white/80 rounded-xl border border-emerald-300">
                <span className="font-bold text-emerald-950 block">Balanced Chemical Equation:</span>
                <p className="font-mono text-emerald-900 font-bold mt-1">
                  6CO₂ + 12H₂O &rarr; C₆H₁₂O₆ + 6O₂ + 6H₂O
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Quadratic Equations Specific Mathematical Diagram */}
        {isQuadratic && (
          <div className="p-4 bg-amber-50/90 border-2 border-amber-400 rounded-2xl shadow-sm space-y-3 font-sans">
            <div className="text-center">
              <h4 className="font-extrabold text-sm sm:text-base text-amber-950">
                Parabola Curve &amp; Nature of Roots (Discriminant D = b² - 4ac)
              </h4>
              <p className="text-xs text-amber-800 italic mt-0.5">
                Graphical representation of roots for ax² + bx + c = 0
              </p>
            </div>

            {/* SVG Parabola Plot */}
            <div className="flex justify-center py-1">
              <svg viewBox="0 0 420 160" className="w-full max-w-md h-auto bg-white/90 rounded-xl border border-amber-300 shadow-2xs">
                {/* Axes */}
                <line x1="30" y1="120" x2="390" y2="120" stroke="#64748b" strokeWidth="1.5" />
                <line x1="120" y1="20" x2="120" y2="150" stroke="#64748b" strokeWidth="1.5" />
                <text x="385" y="115" fontSize="10" fill="#64748b">X</text>
                <text x="125" y="30" fontSize="10" fill="#64748b">Y</text>

                {/* Parabola Curve D > 0 (Two real roots) */}
                <path d="M 60,30 Q 180,180 300,30" fill="none" stroke="#2563eb" strokeWidth="2.5" />
                <circle cx="108" cy="120" r="4" fill="#dc2626" />
                <circle cx="252" cy="120" r="4" fill="#dc2626" />
                <text x="108" y="136" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#dc2626">Root α</text>
                <text x="252" y="136" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#dc2626">Root β</text>

                {/* Vertex */}
                <circle cx="180" cy="142" r="3" fill="#7c3aed" />
                <text x="180" y="156" fontSize="9" textAnchor="middle" fill="#7c3aed">Vertex: (-b/2a, -D/4a)</text>
              </svg>
            </div>

            {/* Formula & Discriminant Box */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-1">
              <div className="p-2 bg-emerald-100/70 border border-emerald-300 rounded-lg text-center">
                <strong className="block text-emerald-950 font-mono">D &gt; 0</strong>
                <span className="text-[11px] text-emerald-900">2 Distinct Real Roots</span>
              </div>
              <div className="p-2 bg-blue-100/70 border border-blue-300 rounded-lg text-center">
                <strong className="block text-blue-950 font-mono">D = 0</strong>
                <span className="text-[11px] text-blue-900">2 Equal Real Roots (-b/2a)</span>
              </div>
              <div className="p-2 bg-rose-100/70 border border-rose-300 rounded-lg text-center">
                <strong className="block text-rose-950 font-mono">D &lt; 0</strong>
                <span className="text-[11px] text-rose-900">No Real Roots (Imaginary)</span>
              </div>
            </div>
          </div>
        )}

        {/* General Flowchart or ASCII Sketch if present in note */}
        {note.sections.map((s, idx) => {
          if (!s.diagram) return null;
          return (
            <div key={idx} className="p-3 bg-white/80 border-2 border-slate-300 rounded-2xl shadow-xs space-y-2">
              <div className="text-xs font-bold text-slate-800 font-sans flex items-center justify-between">
                <span>{s.diagram.title}</span>
                <span className="text-[10px] text-slate-500 font-mono">{s.diagram.type}</span>
              </div>
              {s.diagram.caption && (
                <p className="text-xs text-slate-600 font-sans italic">{s.diagram.caption}</p>
              )}
              {s.diagram.asciiSketch && (
                <pre className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 font-mono text-[10px] sm:text-xs overflow-x-auto">
                  {s.diagram.asciiSketch}
                </pre>
              )}
              {s.diagram.keySteps && (
                <div className="space-y-0.5 text-xs font-sans text-slate-700 pt-1">
                  {s.diagram.keySteps.map((st, sIdx) => (
                    <div key={sIdx}>&bull; {st}</div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Exam tips & summary review renderer
  const renderExamTipsSection = () => {
    return (
      <div className="space-y-4 pt-2">
        {/* Board Alert */}
        {note.ncertExamAlert && (
          <div className="p-3 bg-rose-50/90 border-2 border-rose-400 rounded-2xl shadow-xs">
            <div className="text-xs font-bold text-rose-900 font-sans uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>NCERT Board Exam Evaluation Alert</span>
            </div>
            <p className="text-sm text-rose-950 leading-snug font-sans">
              {note.ncertExamAlert}
            </p>
          </div>
        )}

        {/* Quick Summary Review */}
        {note.quickSummaryReview && note.quickSummaryReview.length > 0 && (
          <div className="p-3.5 bg-amber-50/80 border-2 border-amber-300 rounded-2xl space-y-2 font-sans">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Quick Revision &bull; One-Shot High-Yield Points</span>
            </div>
            <ul className="space-y-1 text-xs sm:text-sm text-amber-950 pl-3">
              {note.quickSummaryReview.map((rev, rIdx) => (
                <li key={rIdx} className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">&bull;</span>
                  <span>{rev}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Sample Exam Question with Step-by-Step Answer */}
        {note.sampleQuestion && (
          <div className="p-3.5 bg-purple-50/80 border-2 border-purple-300 rounded-2xl space-y-2 font-sans">
            <div className="text-xs font-bold text-purple-900 uppercase tracking-wider flex items-center justify-between">
              <span>Representative CBSE Board Question</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-purple-200">5-Mark Long Answer</span>
            </div>
            <div className="p-2 bg-white/90 rounded-xl border border-purple-200 text-xs sm:text-sm font-semibold text-purple-950">
              Q: {note.sampleQuestion.question}
            </div>
            <div className="text-xs sm:text-sm text-slate-900 whitespace-pre-line leading-relaxed pl-2 border-l-2 border-purple-400">
              {note.sampleQuestion.answer}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto my-6 space-y-4">
      {/* 1. Control Toolbar */}
      <div className="astra-card border border-white/10 rounded-2xl p-3 sm:p-4 shadow-xl flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm print:hidden">
        {/* Left: View Mode Toggle & Page Selector */}
        <div className="flex items-center gap-2">
          {/* View Mode Buttons */}
          <div className="flex items-center gap-1 bg-black/40 border border-white/10 rounded-xl p-0.5">
            <button
              onClick={() => setLayoutMode('spread')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                layoutMode === 'spread' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="Two-Page Open Notebook Spread"
            >
              Spread View
            </button>
            <button
              onClick={() => setLayoutMode('single')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                layoutMode === 'single' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="Single Page Focused View"
            >
              Single Page
            </button>
            <button
              onClick={() => setLayoutMode('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                layoutMode === 'all' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="All Pages Printable Register"
            >
              All Pages
            </button>
          </div>

          {/* Single Page Navigation Controls */}
          {layoutMode === 'single' && (
            <div className="flex items-center gap-1 ml-2">
              <button
                onClick={() => setActiveSinglePage((p) => Math.max(1, p - 1))}
                disabled={activeSinglePage <= 1}
                className="p-1 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-xs text-amber-300 font-bold px-1.5">
                Page {activeSinglePage} of 4
              </span>
              <button
                onClick={() => setActiveSinglePage((p) => Math.min(4, p + 1))}
                disabled={activeSinglePage >= 4}
                className="p-1 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Quick Regenerate Page Button */}
          {onRegeneratePage && (
            <button
              onClick={() => onRegeneratePage(activeSinglePage)}
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 border border-white/10 text-xs transition-colors cursor-pointer"
              title="Regenerate this page"
            >
              <RotateCcw className="w-3 h-3 text-amber-400" />
              <span>Regen Page</span>
            </button>
          )}
        </div>

        {/* Right: Aesthetics & Export Actions */}
        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="hidden md:flex items-center gap-1 border border-white/10 rounded-xl p-0.5 bg-black/30">
            <button
              onClick={() => setZoomLevel((prev) => Math.max(70, prev - 10))}
              className="p-1 hover:bg-white/10 rounded text-slate-300 cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs px-1 text-slate-300 font-mono">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel((prev) => Math.min(130, prev + 10))}
              className="p-1 hover:bg-white/10 rounded text-slate-300 cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Ask AI Tutor */}
          {onOpenChatWithNote && (
            <button
              onClick={() => onOpenChatWithNote(note)}
              className="flex items-center gap-1 px-3 py-1.5 bg-purple-500/15 text-purple-300 hover:bg-purple-500/25 border border-purple-500/30 rounded-xl transition-colors font-medium text-xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>AI Tutor</span>
            </button>
          )}

          {/* Save to Library */}
          {onSaveToLibrary && (
            <button
              onClick={onSaveToLibrary}
              disabled={isSaved}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl transition-colors font-medium text-xs cursor-pointer ${
                isSaved 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                  : 'bg-amber-400/15 text-amber-300 hover:bg-amber-400/25 border border-amber-400/30'
              }`}
            >
              {isSaved ? (
                <>
                  <BookmarkCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Saved</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-3.5 h-3.5 text-amber-400" />
                  <span>Save to Notes</span>
                </>
              )}
            </button>
          )}

          {/* Share */}
          <button
            onClick={handleCopyShare}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-xs transition-colors cursor-pointer border border-white/10"
            title="Share Note"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copiedLink ? 'Copied!' : 'Share'}</span>
          </button>

          {/* Download PDF */}
          <button
            onClick={handleDownloadPdf}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer active:scale-95"
            title="Download Full Chapter Notes as PDF"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>

          {/* Print */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-200 text-slate-950 rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer active:scale-95"
            title="Print High-Res Note"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* 2. Page Navigation Strip for multi-page jump */}
      {layoutMode === 'single' && (
        <div className="flex flex-wrap items-center justify-center gap-2 print:hidden">
          {[
            { num: 1, label: 'Page 1: Concept Foundations' },
            { num: 2, label: 'Page 2: Formulas & Derivations' },
            { num: 3, label: 'Page 3: Diagrams & Flowcharts' },
            { num: 4, label: 'Page 4: Exam Tips & PYQs' },
          ].map((pg) => (
            <button
              key={pg.num}
              onClick={() => setActiveSinglePage(pg.num)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSinglePage === pg.num
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              {pg.label}
            </button>
          ))}
        </div>
      )}

      {/* 3. The Authentic Handwritten Open Notebook Spread */}
      <div 
        className="w-full flex justify-center overflow-x-auto pb-6"
        style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
      >
        <div
          ref={noteRef}
          style={{
            fontFamily: `"${currentFont}", cursive, sans-serif`,
          }}
          className={`w-full max-w-[1100px] min-h-[950px] bg-[#fbf9f2] rounded-3xl shadow-2xl border-4 border-[#e5dec9] relative p-4 sm:p-8 ${
            layoutMode === 'single' ? 'grid grid-cols-1' : 'grid grid-cols-1 md:grid-cols-2 gap-8'
          } ${getInkColorClass(currentInk)} print:shadow-none print:border-none print:w-full print:max-w-none print:p-4 print:bg-white`}
        >
          {/* Center Spine Stitch for Spread Mode */}
          {layoutMode === 'spread' && (
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-8 -translate-x-1/2 pointer-events-none z-20">
              <div className="w-full h-full bg-gradient-to-r from-black/10 via-black/25 to-black/10 shadow-inner flex flex-col justify-around py-8 items-center">
                {[...Array(14)].map((_, i) => (
                  <div key={i} className="w-2.5 h-1 bg-[#d1c7ad] rounded-full border border-black/20 shadow-xs" />
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* PAGE 1: Foundations & Definitions */}
          {/* ========================================================= */}
          {(layoutMode === 'spread' || layoutMode === 'all' || (layoutMode === 'single' && activeSinglePage === 1)) && (
            <div 
              className="relative pr-0 md:pr-4 min-h-[850px] flex flex-col justify-between"
              style={getPaperBgStyle()}
            >
              {/* Left Margin Red Double Line (Indian Register Style) */}
              <div className="absolute left-6 top-0 bottom-0 w-1 border-r border-[#f87171]/60 pointer-events-none" />

              <div className="pl-9 space-y-5">
                {/* Top Banner Row */}
                <div className="flex items-center justify-between pt-1 pb-3 text-base sm:text-lg font-bold">
                  <div className="inline-block px-3 py-0.5 rounded-lg bg-emerald-100/90 text-emerald-900 border-2 border-emerald-400 shadow-2xs rotate-[-1deg]">
                    {note.classGrade} {note.subject}
                  </div>

                  <div className="inline-block px-4 py-0.5 rounded-lg bg-pink-100/90 text-pink-900 border-2 border-pink-400 shadow-2xs rotate-[1deg]">
                    {note.chapter.length > 24 ? note.chapter.slice(0, 22) + '...' : note.chapter}
                  </div>
                </div>

                {/* Main Chapter Title Box */}
                <div className="text-center my-2">
                  <div className="inline-block px-5 py-2 rounded-2xl bg-rose-50/90 border-2 border-rose-400 shadow-md">
                    <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${getHeadingInkClass(currentInk)}`}>
                      {note.title}
                    </h1>
                  </div>
                </div>

                {/* Left Page Note Sections (Concepts & Definitions) */}
                <div className="space-y-5 text-lg sm:text-xl leading-relaxed">
                  {leftPageSections.map((section, idx) => renderSectionBlock(section, idx))}
                </div>
              </div>

              {/* Page 1 Bottom Footer */}
              <div className="pl-9 pt-4 flex items-center justify-between text-xs text-slate-500 font-sans border-t border-slate-300 mt-6">
                <span className="font-bold text-slate-700">Page 01 &bull; Core Foundations</span>
                <span className="font-mono">Buzzing Brain &bull; Free Education for All</span>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* PAGE 2: Derivations, Equations & Special Cases */}
          {/* ========================================================= */}
          {(layoutMode === 'spread' || layoutMode === 'all' || (layoutMode === 'single' && activeSinglePage === 2)) && (
            <div 
              className="relative pl-0 md:pl-4 min-h-[850px] flex flex-col justify-between"
              style={getPaperBgStyle()}
            >
              {/* Right Margin Red Line */}
              <div className="absolute left-6 top-0 bottom-0 w-1 border-r border-[#f87171]/60 pointer-events-none" />

              <div className="pl-9 space-y-5">
                {/* Right Page Header */}
                <div className="flex items-center justify-between pt-1 pb-3 text-xs sm:text-sm font-sans font-semibold text-slate-600">
                  <div className="flex items-center gap-1 border-b border-dashed border-slate-400 pb-0.5">
                    <span>Unit:</span>
                    <span className="font-mono text-slate-900">{note.syllabusContext}</span>
                  </div>
                  <div className="flex items-center gap-1 border-b border-dashed border-slate-400 pb-0.5">
                    <span>Page:</span>
                    <span className="font-mono text-slate-900">02</span>
                  </div>
                </div>

                {/* Right Page Sections */}
                <div className="space-y-5 text-lg sm:text-xl leading-relaxed">
                  {rightPageSections.map((section, idx) => 
                    renderSectionBlock(section, leftPageSections.length + idx)
                  )}
                </div>
              </div>

              {/* Page 2 Bottom Footer */}
              <div className="pl-9 pt-4 flex items-center justify-between text-xs text-slate-500 font-sans border-t border-slate-300 mt-6">
                <span className="font-bold text-slate-700">Page 02 &bull; Mathematical Proofs &amp; Equations</span>
                <span className="font-mono">YouTube: @BrainBuzz2702</span>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* PAGE 3: Scientific Diagrams & Flowcharts */}
          {/* ========================================================= */}
          {(layoutMode === 'all' || (layoutMode === 'single' && activeSinglePage === 3)) && (
            <div 
              className="relative pr-0 md:pr-4 min-h-[850px] flex flex-col justify-between"
              style={getPaperBgStyle()}
            >
              <div className="absolute left-6 top-0 bottom-0 w-1 border-r border-[#f87171]/60 pointer-events-none" />

              <div className="pl-9 space-y-5">
                <div className="flex items-center justify-between pt-1 pb-3 text-xs sm:text-sm font-sans font-semibold text-slate-600">
                  <div className="font-bold text-emerald-900">
                    Scientific Diagram Apparatus &bull; NCERT Standard
                  </div>
                  <div className="font-mono">Page 03</div>
                </div>

                {/* Diagrams Section */}
                {renderDiagramsSection()}
              </div>

              <div className="pl-9 pt-4 flex items-center justify-between text-xs text-slate-500 font-sans border-t border-slate-300 mt-6">
                <span className="font-bold text-slate-700">Page 03 &bull; Labeled Examination Diagrams</span>
                <span className="font-mono">Buzzing Brain</span>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* PAGE 4: Exam Tips & PYQs */}
          {/* ========================================================= */}
          {(layoutMode === 'all' || (layoutMode === 'single' && activeSinglePage === 4)) && (
            <div 
              className="relative pl-0 md:pl-4 min-h-[850px] flex flex-col justify-between"
              style={getPaperBgStyle()}
            >
              <div className="absolute left-6 top-0 bottom-0 w-1 border-r border-[#f87171]/60 pointer-events-none" />

              <div className="pl-9 space-y-5">
                <div className="flex items-center justify-between pt-1 pb-3 text-xs sm:text-sm font-sans font-semibold text-slate-600">
                  <div className="font-bold text-purple-900">
                    Exam Strategy &bull; High-Yield Board PYQs
                  </div>
                  <div className="font-mono">Page 04</div>
                </div>

                {/* Exam Tips Section */}
                {renderExamTipsSection()}
              </div>

              <div className="pl-9 pt-4 flex items-center justify-between text-xs text-slate-500 font-sans border-t border-slate-300 mt-6">
                <span className="font-bold text-slate-700">Page 04 &bull; Exam Tips &amp; Revision</span>
                <span className="font-mono">100% Free Open Education</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

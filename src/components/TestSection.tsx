import React, { useState, useEffect } from 'react';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  RotateCcw, 
  ArrowRight, 
  BookOpen, 
  HelpCircle, 
  Sparkles,
  Lock,
  ChevronRight,
  ChevronLeft,
  Filter,
  Check,
  Bookmark,
  AlertCircle
} from 'lucide-react';
import { CHAPTER_TESTS_CATALOG, ChapterTest, PracticeQuestion } from '../data/chapterTests';
import { UserProfile } from '../types';

interface TestSectionProps {
  user: UserProfile | null;
  onRequireAuth: () => void;
  activeClass: string;
  onGoToStudio?: (cmd: string) => void;
}

export const TestSection: React.FC<TestSectionProps> = ({
  user,
  onRequireAuth,
  activeClass,
  onGoToStudio,
}) => {
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>(activeClass || 'Class 11');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('All');
  const [activeTest, setActiveTest] = useState<ChapterTest | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number | string>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({});
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [timerActive, setTimerActive] = useState(false);

  // Live Timer Countdown
  useEffect(() => {
    if (!timerActive || testSubmitted || timeRemaining <= 0) return;
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimerActive(false);
          setTestSubmitted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerActive, testSubmitted, timeRemaining]);

  // Available tests filtered by class & subject
  const filteredTests = CHAPTER_TESTS_CATALOG.filter((t) => {
    const classMatch = selectedClassFilter === 'All' || t.classGrade === selectedClassFilter;
    const subjectMatch = selectedSubjectFilter === 'All' || t.subject.toLowerCase() === selectedSubjectFilter.toLowerCase();
    return classMatch && subjectMatch;
  });

  const startTest = (test: ChapterTest) => {
    if (!user) {
      onRequireAuth();
      return;
    }
    setActiveTest(test);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setMarkedForReview({});
    setTestSubmitted(false);
    setTimeRemaining(test.durationMinutes * 60);
    setTimerActive(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (testSubmitted) return;
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleToggleMarkForReview = (questionId: string) => {
    if (testSubmitted) return;
    setMarkedForReview((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const handleClearAnswer = (questionId: string) => {
    if (testSubmitted) return;
    setUserAnswers((prev) => {
      const copy = { ...prev };
      delete copy[questionId];
      return copy;
    });
  };

  const handleSubmitTest = () => {
    setTimerActive(false);
    setTestSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetTest = () => {
    setActiveTest(null);
    setUserAnswers({});
    setMarkedForReview({});
    setTestSubmitted(false);
  };

  // Score calculation
  const calculateScore = () => {
    if (!activeTest) return { score: 0, maxScore: 0, correctCount: 0, wrongCount: 0, unattemptedCount: 0 };
    let score = 0;
    let maxScore = 0;
    let correctCount = 0;
    let wrongCount = 0;
    let unattemptedCount = 0;

    activeTest.questions.forEach((q) => {
      maxScore += q.marks;
      const ans = userAnswers[q.id];
      if (ans === undefined) {
        unattemptedCount++;
      } else if (q.type === 'mcq' && ans === q.correctAnswer) {
        score += q.marks;
        correctCount++;
      } else {
        wrongCount++;
      }
    });

    return { score, maxScore, correctCount, wrongCount, unattemptedCount };
  };

  // Format MM:SS for countdown timer
  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 1. ACTIVE EXAMINATION INTERFACE (Dark Luxury CBT Arena)
  if (activeTest) {
    const q = activeTest.questions[currentQuestionIndex];
    const isAnswered = userAnswers[q.id] !== undefined;
    const isMarked = !!markedForReview[q.id];
    const scoreStats = testSubmitted ? calculateScore() : null;

    return (
      <div className="w-full max-w-6xl mx-auto py-8 space-y-8 text-slate-100">
        {/* Top Assessment HUD */}
        <div className="rounded-2xl bg-[#070a14] border border-white/[0.08] p-6 shadow-2xl flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 text-xs font-mono font-semibold">
              <span className="text-amber-400">{activeTest.classGrade} &bull; {activeTest.subject}</span>
              <span className="text-slate-600">/</span>
              <span className="text-violet-400">{activeTest.difficulty}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              {activeTest.title}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {!testSubmitted && (
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-mono text-sm font-bold transition-all ${
                timeRemaining <= 300 
                  ? 'bg-rose-500/10 border-rose-500/40 text-rose-300 animate-pulse' 
                  : 'bg-slate-900 border-white/10 text-amber-300'
              }`}>
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Time Remaining: {formatTimer(timeRemaining)}</span>
              </div>
            )}

            <button
              onClick={handleResetTest}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-white/10 transition-colors cursor-pointer"
            >
              Exit Arena
            </button>
          </div>
        </div>

        {/* Post-Submission Scorecard & Analytical Breakdown */}
        {testSubmitted && scoreStats && (
          <div className="rounded-2xl bg-[#070a14] border border-amber-400/30 p-8 md:p-12 text-center space-y-8 animate-in fade-in shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-400 flex items-center justify-center mx-auto">
              <Award className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Assessment Completed
              </h2>
              <p className="text-slate-400 text-sm max-w-md mx-auto">
                Here is your verified performance on <strong className="text-white">{activeTest.chapter}</strong>.
              </p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-white/[0.06] space-y-1">
                <div className="text-xs text-slate-400 font-mono">Score Obtained</div>
                <div className="text-2xl font-extrabold text-amber-400 font-mono">
                  {scoreStats.score} / {scoreStats.maxScore}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-white/[0.06] space-y-1">
                <div className="text-xs text-slate-400 font-mono">Accuracy</div>
                <div className="text-2xl font-extrabold text-white font-mono">
                  {scoreStats.maxScore > 0 ? Math.round((scoreStats.score / scoreStats.maxScore) * 100) : 0}%
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-white/[0.06] space-y-1">
                <div className="text-xs text-slate-400 font-mono">Correct Answers</div>
                <div className="text-2xl font-extrabold text-emerald-400 font-mono">
                  {scoreStats.correctCount}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-white/[0.06] space-y-1">
                <div className="text-xs text-slate-400 font-mono">Incorrect / Missed</div>
                <div className="text-2xl font-extrabold text-rose-400 font-mono">
                  {scoreStats.wrongCount + scoreStats.unattemptedCount}
                </div>
              </div>
            </div>

            {/* Single Prominent Action for Post-Test */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              {onGoToStudio && (
                <button
                  onClick={() => {
                    const cmd = `/handwriting class:${activeTest.classGrade.replace('Class ', '')} subject:${activeTest.subject} chapter:${activeTest.chapter} style:gel-pen paper:ruled ink:royal-blue thinking:high`;
                    onGoToStudio(cmd);
                  }}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm transition-all shadow-xl hover:shadow-amber-400/20 active:scale-[0.98] cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Review Chapter in Handwritten Notes Studio</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={() => {
                  setUserAnswers({});
                  setMarkedForReview({});
                  setTestSubmitted(false);
                  setCurrentQuestionIndex(0);
                  setTimeRemaining(activeTest.durationMinutes * 60);
                  setTimerActive(true);
                }}
                className="inline-flex items-center gap-2 px-6 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm border border-white/10 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-slate-400" />
                <span>Retake Examination</span>
              </button>
            </div>
          </div>
        )}

        {/* 2-Column Split Examination Arena */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (Question Card) */}
          <div className="lg:col-span-8 rounded-2xl bg-[#070a14] border border-white/[0.08] p-6 sm:p-8 space-y-6 shadow-xl">
            {/* Question Header & Kicker */}
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono px-3 py-1 rounded-lg bg-slate-900 border border-white/10 text-slate-300 font-bold">
                  Question {currentQuestionIndex + 1} of {activeTest.questions.length}
                </span>

                {q.boardYear && (
                  <span className="text-xs font-sans text-amber-400/90 font-medium">
                    {q.boardYear}
                  </span>
                )}
              </div>

              <div className="text-xs font-mono text-slate-400">
                Weightage: <strong className="text-amber-400 font-bold">+{q.marks} Marks</strong>
              </div>
            </div>

            {/* Question Statement */}
            <div className="space-y-4">
              <h2 className="text-lg sm:text-xl font-medium text-white whitespace-pre-line leading-relaxed">
                {q.question}
              </h2>
            </div>

            {/* Options List */}
            {q.type === 'mcq' && q.options && (
              <div className="space-y-3 pt-2">
                {q.options.map((optionText, optIndex) => {
                  const isSelected = userAnswers[q.id] === optIndex;
                  const isCorrect = testSubmitted && q.correctAnswer === optIndex;
                  const isWrongSelected = testSubmitted && isSelected && q.correctAnswer !== optIndex;

                  let borderClass = 'border-white/[0.08] bg-slate-900/40 hover:bg-slate-900 hover:border-white/20 text-slate-200';
                  let badgeClass = 'bg-slate-800 text-slate-400';

                  if (isSelected && !testSubmitted) {
                    borderClass = 'border-amber-400 bg-amber-400/10 text-white shadow-sm ring-1 ring-amber-400/50';
                    badgeClass = 'bg-amber-400 text-slate-950 font-bold';
                  } else if (testSubmitted) {
                    if (isCorrect) {
                      borderClass = 'border-emerald-500 bg-emerald-500/15 text-emerald-100';
                      badgeClass = 'bg-emerald-500 text-white font-bold';
                    } else if (isWrongSelected) {
                      borderClass = 'border-rose-500 bg-rose-500/15 text-rose-100';
                      badgeClass = 'bg-rose-500 text-white font-bold';
                    }
                  }

                  const optionLetters = ['A', 'B', 'C', 'D'];

                  return (
                    <button
                      key={optIndex}
                      type="button"
                      disabled={testSubmitted}
                      onClick={() => handleSelectOption(q.id, optIndex)}
                      className={`w-full p-4 rounded-xl border text-left transition-all flex items-start gap-3.5 cursor-pointer disabled:cursor-default ${borderClass}`}
                    >
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0 transition-colors ${badgeClass}`}>
                        {optionLetters[optIndex]}
                      </span>
                      <span className="text-sm font-medium leading-relaxed pt-0.5">
                        {optionText}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Explanation Card (Revealed after submission) */}
            {testSubmitted && (
              <div className="p-5 rounded-xl bg-slate-900/90 border border-white/10 space-y-2 mt-4">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>NCERT Verified Explanation</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {q.explanation}
                </p>
              </div>
            )}

            {/* In-Test Navigation Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/[0.08]">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none text-slate-300 hover:text-white text-xs font-semibold border border-white/10 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                {!testSubmitted && isAnswered && (
                  <button
                    type="button"
                    onClick={() => handleClearAnswer(q.id)}
                    className="px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-rose-300 text-xs font-medium transition-colors cursor-pointer"
                  >
                    Clear Choice
                  </button>
                )}

                {!testSubmitted && (
                  <button
                    type="button"
                    onClick={() => handleToggleMarkForReview(q.id)}
                    className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
                      isMarked 
                        ? 'bg-violet-500/20 border-violet-500/50 text-violet-300' 
                        : 'bg-slate-900 hover:bg-slate-800 border-white/10 text-slate-400'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>{isMarked ? 'Marked for Review' : 'Mark for Review'}</span>
                  </button>
                )}
              </div>

              <div>
                {currentQuestionIndex < activeTest.questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                    className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-[0.98] cursor-pointer"
                  >
                    <span>Save &amp; Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  !testSubmitted && (
                    <button
                      type="button"
                      onClick={handleSubmitTest}
                      className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-lg active:scale-[0.98] cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Submit Examination</span>
                    </button>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Right Column (Question Palette Grid) */}
          <div className="lg:col-span-4 rounded-2xl bg-[#070a14] border border-white/[0.08] p-6 space-y-6 shadow-xl">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Question Palette
              </h3>
              <p className="text-xs text-slate-400">
                Click any question number to navigate instantly.
              </p>
            </div>

            {/* Questions Grid */}
            <div className="grid grid-cols-5 gap-2.5">
              {activeTest.questions.map((ques, idx) => {
                const answered = userAnswers[ques.id] !== undefined;
                const marked = !!markedForReview[ques.id];
                const isCurrent = idx === currentQuestionIndex;

                let btnStyle = 'bg-slate-900 text-slate-400 border-white/5 hover:border-white/20';

                if (isCurrent) {
                  btnStyle = 'ring-2 ring-amber-400 text-white font-bold bg-amber-400/20 border-amber-400/40';
                } else if (marked) {
                  btnStyle = 'bg-violet-500/20 text-violet-300 border-violet-500/40 font-bold';
                } else if (answered) {
                  btnStyle = 'bg-amber-400 text-slate-950 font-bold';
                }

                return (
                  <button
                    key={ques.id}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`h-10 rounded-xl text-xs font-mono transition-all border cursor-pointer ${btnStyle}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Palette Status Legend */}
            <div className="space-y-2 pt-4 border-t border-white/[0.08] text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-amber-400"></span>
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-violet-500/30 border border-violet-500/60"></span>
                <span>Marked for Review</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-slate-900 border border-white/10"></span>
                <span>Unattempted</span>
              </div>
            </div>

            {!testSubmitted && (
              <div className="pt-2">
                <button
                  onClick={handleSubmitTest}
                  className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-xs border border-amber-400/30 transition-all cursor-pointer"
                >
                  Finalize &amp; Submit Test
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 2. TEST CATALOG & SELECTION ARENA (Dark Luxury Portal)
  return (
    <div className="w-full max-w-6xl mx-auto py-8 space-y-12 text-slate-100">
      {/* Header Banner: Real Photography + Clean Value Proposition */}
      <div className="rounded-2xl bg-[#060913] border border-white/[0.08] p-8 md:p-12 relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-8 space-y-4 text-left">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-semibold">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Computer-Based Examination Suite</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              NCERT Chapter Tests &amp; Assessments
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
              Authentic multiple-choice and conceptual problems aligned with the latest CBSE board pattern. Practice under realistic exam time limits with verified derivations and step-by-step marking schemes.
            </p>

            {!user && (
              <div className="pt-2">
                <button
                  onClick={onRequireAuth}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm transition-all shadow-lg active:scale-[0.98] cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>Log in or Sign Up to Begin Tests</span>
                </button>
              </div>
            )}
          </div>

          <div className="lg:col-span-4 hidden lg:block">
            <div className="rounded-2xl overflow-hidden border border-white/10 shadow-xl bg-slate-900">
              <img
                src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=700&q=80"
                alt="Student taking exam with paper and timer"
                className="w-full h-48 object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Class and Subject Filters: Clean Segmented Controls */}
      <div className="space-y-4">
        {/* Class Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold">
          {['All', 'Class 9', 'Class 10', 'Class 11', 'Class 12'].map((cls) => (
            <button
              key={cls}
              onClick={() => setSelectedClassFilter(cls)}
              className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                selectedClassFilter === cls
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                  : 'bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-white border border-white/[0.08]'
              }`}
            >
              {cls}
            </button>
          ))}
        </div>

        {/* Subject Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold">
          {['All', 'Physics', 'Chemistry', 'Biology', 'Science'].map((subj) => (
            <button
              key={subj}
              onClick={() => setSelectedSubjectFilter(subj)}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap text-xs ${
                selectedSubjectFilter === subj
                  ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40 font-bold'
                  : 'bg-transparent text-slate-400 hover:text-white border border-transparent'
              }`}
            >
              {subj}
            </button>
          ))}
        </div>
      </div>

      {/* Test Catalog Cards: Consistent Symmetrical Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTests.map((test) => (
          <div
            key={test.id}
            className="rounded-2xl bg-[#070a14] border border-white/[0.08] hover:border-amber-400/30 p-6 flex flex-col justify-between space-y-6 transition-all shadow-xl group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-amber-400 font-semibold">
                  {test.classGrade} &bull; {test.subject}
                </span>
                <span className="text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  {test.durationMinutes} mins
                </span>
              </div>

              <div>
                <h2 className="font-bold text-white text-lg group-hover:text-amber-300 transition-colors leading-snug">
                  {test.title}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Chapter: <strong className="text-slate-200">{test.chapter}</strong>
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono text-slate-400 pt-2 border-t border-white/[0.06]">
                <span>{test.questions.length} Questions</span>
                <span>&bull;</span>
                <span>{test.totalMarks} Marks</span>
                <span>&bull;</span>
                <span className="text-violet-400">{test.difficulty}</span>
              </div>
            </div>

            {/* Exactly One CTA Button per Test Card */}
            <div>
              <button
                onClick={() => startTest(test)}
                className="w-full py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-[0.98]"
              >
                <span>Begin Examination</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

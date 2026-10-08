import React from 'react';
import { 
  ArrowRight, 
  BookOpen, 
  PenTool, 
  Play, 
  CheckCircle2, 
  Award, 
  FileText,
  Sparkles,
  ExternalLink,
  ChevronRight,
  GraduationCap,
  Layers,
  HelpCircle
} from 'lucide-react';
import { UserProfile } from '../types';

interface AstraLandingPageProps {
  onGoToStudio: (sampleCommand?: string) => void;
  onGoToBooks: () => void;
  onGoToSyllabus?: () => void;
  onGoToYouTube: () => void;
  onGoToLibrary: () => void;
  onGoToTests: () => void;
  onSignIn: () => void;
  onSignUp: () => void;
  user: UserProfile | null;
}

export const AstraLandingPage: React.FC<AstraLandingPageProps> = ({
  onGoToStudio,
  onGoToBooks,
  onGoToSyllabus,
  onGoToYouTube,
  onGoToLibrary,
  onGoToTests,
  onSignIn,
  onSignUp,
  user,
}) => {
  const handlePrimaryCta = () => {
    if (!user) {
      onSignUp();
    } else {
      onGoToStudio();
    }
  };

  return (
    <div className="w-full text-slate-100 space-y-24 py-12 md:py-16">
      {/* 1. HERO SECTION: Dramatic Headline, Real Photography & Single Clear CTA */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Big Editorial Headline & Value Proposition */}
          <div className="lg:col-span-7 space-y-8 text-left">
            {/* Subtle Brand Tag */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/25 text-amber-300 text-xs font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              <span>Open Educational Initiative &bull; CBSE &amp; NCERT</span>
            </div>

            {/* Huge Headline */}
            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
              Free Education <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-violet-400">
                For Every Student.
              </span>
            </h1>

            {/* Clear, Honest Copy - No Fake Claims */}
            <p className="text-lg sm:text-xl text-slate-300 font-normal leading-relaxed max-w-xl">
              Complete, verified NCERT study notes formatted like a topper's two-page handwritten register. Ruled notebook paper, real equations, scientific diagrams, and chapter assessments — 100% open and free.
            </p>

            {/* Single Primary CTA + Quiet Secondary Link */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
              <button
                onClick={handlePrimaryCta}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-base transition-all shadow-xl hover:shadow-amber-400/25 active:scale-[0.98] cursor-pointer"
              >
                <span>{user ? 'Open Notes Studio' : 'Start Learning Free'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              {!user && (
                <button
                  onClick={onSignIn}
                  className="inline-flex items-center justify-center gap-1.5 px-5 py-4 text-sm font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  <span>Already have an account?</span>
                  <span className="text-amber-400 font-semibold underline underline-offset-4">Log In</span>
                </button>
              )}
            </div>

            {/* Honest Curriculum Footnote (No fake numbers) */}
            <div className="pt-4 border-t border-white/[0.08] flex flex-wrap items-center gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Class 9, 10, 11 &amp; 12 Complete Syllabus</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0" />
                <span>Print &amp; Download PDF Support</span>
              </div>
            </div>
          </div>

          {/* Right Column: Real Educational Photography Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-slate-900 group">
              {/* Real Student Study Photography from Unsplash */}
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80"
                alt="Students studying collaboratively with books and notebooks"
                className="w-full h-[420px] object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent"></div>
              
              {/* Overlay Quality Badge */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/10 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-white">Curriculum Grounded</span>
                  <span className="text-amber-400 font-mono">NCERT &bull; CBSE</span>
                </div>
                <p className="text-[12px] text-slate-300 leading-snug">
                  Aligned with official National Council of Educational Research and Training textbooks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE TOPPER REGISTER LAYOUT: Authentic Handwritten Notes Architecture */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="rounded-2xl bg-slate-900/60 border border-white/[0.08] p-8 md:p-12 space-y-10">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-amber-400">
              <PenTool className="w-4 h-4 text-amber-400" />
              <span>Two-Page Register Format</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Crafted like the register of a CBSE board topper.
            </h2>
            <p className="text-slate-400 text-base leading-relaxed">
              Every chapter note is built with structured ruled lines, left red margins, mathematical derivation blocks, scientific diagram blueprints, and examiner warnings.
            </p>
          </div>

          {/* 3-Column Feature Grid Aligned */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-slate-950/50 border border-white/[0.06] space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-lg bg-amber-400/10 text-amber-400 flex items-center justify-center font-bold">
                  01
                </div>
                <h3 className="text-lg font-bold text-white">Left Red Margin Notations</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Chapter unit titles, fundamental definitions, and unit dimensions systematically logged along the classical student margin.
                </p>
              </div>
              <div className="text-xs text-amber-400/90 font-mono pt-2 border-t border-white/[0.05]">
                Structure: Ruled A4 notebook
              </div>
            </div>

            <div className="p-6 rounded-xl bg-slate-950/50 border border-white/[0.06] space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-lg bg-violet-400/10 text-violet-400 flex items-center justify-center font-bold">
                  02
                </div>
                <h3 className="text-lg font-bold text-white">Diagrams &amp; Equations</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Clear schematics, reaction mechanisms, and step-by-step mathematical derivations with SI units clearly marked.
                </p>
              </div>
              <div className="text-xs text-violet-400/90 font-mono pt-2 border-t border-white/[0.05]">
                Visual: Blue &amp; black ink contrast
              </div>
            </div>

            <div className="p-6 rounded-xl bg-slate-950/50 border border-white/[0.06] space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-lg bg-amber-400/10 text-amber-400 flex items-center justify-center font-bold">
                  03
                </div>
                <h3 className="text-lg font-bold text-white">CBSE Examiner Alerts</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Highlighted callout boxes pointing out high-frequency board traps, common student blunders, and memory mnemonics.
                </p>
              </div>
              <div className="text-xs text-amber-400/90 font-mono pt-2 border-t border-white/[0.05]">
                Preparation: Solved Exemplars
              </div>
            </div>
          </div>

          {/* Single Focused CTA for Notes */}
          <div className="pt-4 flex justify-start">
            <button
              onClick={() => {
                if (!user) {
                  onSignUp();
                } else {
                  onGoToStudio('/handwriting class:11 subject:Physics chapter:Laws of Motion topic:Friction & Circular Motion style:gel-pen paper:ruled ink:royal-blue thinking:high');
                }
              }}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm border border-white/10 hover:border-amber-400/30 transition-all cursor-pointer"
            >
              <span>Explore Sample Note: Laws of Motion</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. CURRICULUM BREADTH: Real Science Photography + Grid Alignment */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="max-w-2xl space-y-4 text-left">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-violet-400">
            <BookOpen className="w-4 h-4 text-violet-400" />
            <span>Complete Academic Coverage</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Official NCERT Curriculum for Grades 9 through 12.
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            Every chapter indexed directly from the latest National Council of Educational Research and Training textbooks.
          </p>
        </div>

        {/* 2-Column High-End Split Grid with Real Photography */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Card 1: Senior Secondary (Class 11 & 12) */}
          <div className="rounded-2xl bg-slate-900/60 border border-white/[0.08] overflow-hidden flex flex-col justify-between">
            <div className="relative h-48 overflow-hidden bg-slate-950">
              <img
                src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80"
                alt="Chemistry laboratory glassware"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
              <div className="absolute bottom-4 left-6">
                <span className="px-3 py-1 rounded-md bg-amber-400/20 text-amber-300 font-mono text-xs font-bold border border-amber-400/30">
                  Classes 11 &amp; 12
                </span>
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-white">Higher Secondary Sciences</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Rigorous coverage for Physics (Mechanics, Optics, Electromagnetism), Chemistry (Physical, Inorganic, Organic), Biology, and Mathematics.
                </p>
                <div className="flex flex-wrap gap-2 pt-2 text-xs text-slate-300 font-mono">
                  <span className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08]">Physics</span>
                  <span className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08]">Chemistry</span>
                  <span className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08]">Biology</span>
                  <span className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08]">Mathematics</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Secondary Foundation (Class 9 & 10) */}
          <div className="rounded-2xl bg-slate-900/60 border border-white/[0.08] overflow-hidden flex flex-col justify-between">
            <div className="relative h-48 overflow-hidden bg-slate-950">
              <img
                src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80"
                alt="Open textbook and study desk"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
              <div className="absolute bottom-4 left-6">
                <span className="px-3 py-1 rounded-md bg-violet-400/20 text-violet-300 font-mono text-xs font-bold border border-violet-400/30">
                  Classes 9 &amp; 10
                </span>
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-white">Secondary Board Foundation</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Complete chapter-wise notes for Science (Life Processes, Chemical Reactions, Motion, Light) and Core Mathematics with full formula sheets.
                </p>
                <div className="flex flex-wrap gap-2 pt-2 text-xs text-slate-300 font-mono">
                  <span className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08]">Life Processes</span>
                  <span className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08]">Acids &amp; Bases</span>
                  <span className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08]">Optics</span>
                  <span className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08]">Cell Biology</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Single Focused CTA for Syllabus & Books */}
        <div className="pt-2 flex justify-start">
          <button
            onClick={onGoToSyllabus || onGoToBooks}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm transition-all shadow-md active:scale-[0.98] cursor-pointer"
          >
            <span>Explore 2026–27 Syllabus &amp; Embedded PDF</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 4. ONLINE TEST ARENA: Dark Luxury Assessment Portal Teaser */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="rounded-2xl bg-[#060913] border border-white/[0.08] p-8 md:p-12 relative overflow-hidden space-y-8">
          <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="max-w-2xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-amber-400">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Computer-Based Test Portal</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Test your conceptual clarity in exam conditions.
            </h2>
            <p className="text-slate-400 text-base leading-relaxed">
              Step into our dark, distraction-free test environment with timed countdowns, CBSE-format multiple choice questions, and comprehensive step-by-step solutions for every problem.
            </p>
          </div>

          {/* Test Features Horizontal Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10">
            <div className="p-5 rounded-xl bg-slate-900/60 border border-white/[0.06] space-y-2">
              <div className="text-amber-400 font-mono text-sm font-bold">Standardized Format</div>
              <div className="text-white font-bold text-base">CBSE &amp; Exemplar Marking</div>
              <p className="text-xs text-slate-400">Strict marks allocation and authentic assertion-reason questions.</p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/60 border border-white/[0.06] space-y-2">
              <div className="text-violet-400 font-mono text-sm font-bold">Live HUD Timer</div>
              <div className="text-white font-bold text-base">Countdown &amp; Question Grid</div>
              <p className="text-xs text-slate-400">Interactive question palette with review markers and time tracking.</p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/60 border border-white/[0.06] space-y-2">
              <div className="text-amber-400 font-mono text-sm font-bold">In-Depth Solutions</div>
              <div className="text-white font-bold text-base">Step-by-Step Derivations</div>
              <p className="text-xs text-slate-400">Review mathematical formulas and concepts immediately upon submission.</p>
            </div>
          </div>

          {/* Single Focused CTA for Test Portal */}
          <div className="pt-2 relative z-10 flex justify-start">
            <button
              onClick={onGoToTests}
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm transition-all shadow-xl hover:shadow-amber-400/20 active:scale-[0.98] cursor-pointer"
            >
              <span>Launch Test Arena</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 5. YOUTUBE LEARNING COMMUNITY: Direct Channel Integration */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="rounded-2xl bg-slate-900/60 border border-white/[0.08] p-8 md:p-12 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-amber-400">
                <Play className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>Synchronized Video Lectures</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Official YouTube Channel: @BrainBuzz2702
              </h2>
              <p className="text-slate-400 text-base leading-relaxed">
                Connect your handwritten study notes with official video lessons, chapter walk-throughs, and board exam tips curated specifically for CBSE students.
              </p>
            </div>

            <div className="lg:col-span-4 flex lg:justify-end">
              <button
                onClick={onGoToYouTube}
                className="inline-flex items-center gap-2.5 px-6 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-white/10 hover:border-amber-400/30 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 text-rose-500 fill-rose-500" />
                <span>Visit YouTube Channel</span>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER: Minimal, Dignified, Grounded */}
      <footer className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 border-t border-white/[0.08] text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            src="/BuzzingBrain_Video_Watermark_150x150.png"
            alt="Buzzing Brain"
            className="w-6 h-6 rounded-full border border-amber-400/50"
            onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
          />
          <span className="font-semibold text-slate-300">Buzzing Brain</span>
          <span>&bull;</span>
          <span>Open Educational Initiative</span>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <span>CBSE &amp; NCERT Aligned</span>
          <span>&bull;</span>
          <span>Handwritten Study Notes</span>
          <span>&bull;</span>
          <span>Online Test Arena</span>
        </div>
      </footer>
    </div>
  );
};

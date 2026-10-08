import React from 'react';
import { 
  BookOpen, 
  ShieldCheck, 
  AlertCircle, 
  LogIn, 
  LogOut, 
  Sparkles, 
  FileText, 
  Play, 
  Lock, 
  Search, 
  ExternalLink, 
  ChevronDown,
  Award
} from 'lucide-react';
import { UserProfile } from '../types';

export type NavTab = 'landing' | 'syllabus' | 'studio' | 'books' | 'tests' | 'youtube' | 'library' | 'admin' | 'terms' | 'privacy';

interface NavbarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  user: UserProfile | null;
  onSignIn: () => void;
  onSignUp?: () => void;
  onSignOut: () => void;
  activeClass: string;
  onClassChange: (newClass: string) => void;
  onOpenChat: () => void;
  onOpenComplaint: () => void;
  onOpenProfile?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  user,
  onSignIn,
  onSignUp,
  onSignOut,
  activeClass,
  onClassChange,
  onOpenChat,
  onOpenComplaint,
  onOpenProfile,
}) => {
  const isAdmin = user?.role === 'admin' || user?.email?.toLowerCase() === 'brainyyybuzz@gmail.com' || user?.email?.toLowerCase() === 'gautamankur0101@gmail.com';

  return (
    <header className="sticky top-0 z-40 bg-black/75 backdrop-blur-xl border-b border-white/10 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo & Brand - Using User's Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onTabChange('landing')}
              className="flex items-center gap-3 text-left group cursor-pointer"
            >
              <img
                src="/BuzzingBrain_Video_Watermark_150x150.png"
                alt="Buzzing Brain Logo"
                className="w-10 h-10 rounded-full border border-amber-400/80 shadow-md object-cover group-hover:scale-105 transition-transform"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="flex flex-col">
                <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                  <span>Buzzing Brain</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-amber-400/20 text-amber-300 font-semibold border border-amber-400/30">
                    Astra
                  </span>
                </span>
                <span className="text-[10px] text-slate-400 tracking-wider font-mono uppercase">
                  Free Education for All
                </span>
              </div>
            </button>

            {/* Quick Class Selector */}
            <div className="hidden xl:flex items-center bg-white/5 rounded-xl p-0.5 ml-3 text-xs font-semibold border border-white/10">
              {['Class 9', 'Class 10', 'Class 11', 'Class 12'].map((cls) => (
                <button
                  key={cls}
                  onClick={() => onClassChange(cls)}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    activeClass === cls
                      ? 'bg-white/20 text-white shadow-2xs font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {cls}
                </button>
              ))}
            </div>
          </div>

          {/* Desktop Navigation Links (Astra / OpenAI Layout) */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold text-slate-300">
            <button
              onClick={() => onTabChange('landing')}
              className={`px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
                currentTab === 'landing'
                  ? 'text-white bg-white/15'
                  : 'hover:text-white hover:bg-white/5'
              }`}
            >
              Free Education
            </button>

            <button
              onClick={() => onTabChange('syllabus')}
              className={`px-3 py-1.5 rounded-full transition-colors cursor-pointer flex items-center gap-1.5 ${
                currentTab === 'syllabus'
                  ? 'text-white bg-white/15'
                  : 'hover:text-white hover:bg-white/5'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Syllabus (2026–27)</span>
            </button>

            <button
              onClick={() => onTabChange('books')}
              className={`px-3 py-1.5 rounded-full transition-colors cursor-pointer flex items-center gap-1.5 ${
                currentTab === 'books'
                  ? 'text-white bg-white/15'
                  : 'hover:text-white hover:bg-white/5'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>NCERT Books</span>
            </button>

            <button
              onClick={() => onTabChange('tests')}
              className={`px-3 py-1.5 rounded-full transition-colors cursor-pointer flex items-center gap-1.5 ${
                currentTab === 'tests'
                  ? 'text-white bg-white/15'
                  : 'hover:text-white hover:bg-white/5'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Practice Tests</span>
            </button>

            <button
              onClick={() => onTabChange('studio')}
              className={`px-3 py-1.5 rounded-full transition-colors cursor-pointer flex items-center gap-1.5 ${
                currentTab === 'studio'
                  ? 'text-white bg-white/15'
                  : 'hover:text-white hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Handwritten Studio</span>
            </button>

            <button
              onClick={() => onTabChange('youtube')}
              className={`px-3 py-1.5 rounded-full transition-colors cursor-pointer flex items-center gap-1.5 ${
                currentTab === 'youtube'
                  ? 'text-white bg-white/15'
                  : 'hover:text-white hover:bg-white/5'
              }`}
            >
              <Play className="w-3 h-3 fill-rose-500 text-rose-500" />
              <span>YouTube</span>
            </button>

            <button
              onClick={() => onTabChange('library')}
              className={`px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
                currentTab === 'library'
                  ? 'text-white bg-white/15'
                  : 'hover:text-white hover:bg-white/5'
              }`}
            >
              Notes Library
            </button>

            <button
              onClick={() => onTabChange('admin')}
              className={`px-3 py-1.5 rounded-full transition-colors cursor-pointer flex items-center gap-1 ${
                currentTab === 'admin'
                  ? 'text-white bg-white/15'
                  : 'hover:text-white hover:bg-white/5'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
              <span>Admin</span>
              {isAdmin && <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>}
            </button>

            <button
              onClick={onOpenComplaint}
              className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/5 transition-colors cursor-pointer text-slate-400"
            >
              Grievances
            </button>
          </nav>

          {/* Right Action Buttons (ChatGPT 6 Astra Style: "Log in" and "Try Buzzing Brain") */}
          <div className="flex items-center gap-2.5">
            {/* Ask AI Study Buddy */}
            <button
              onClick={onOpenChat}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 hover:bg-purple-500/25 transition-all text-xs font-semibold cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>AI Tutor</span>
            </button>

            {/* User Log in or Profile */}
            {user ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onOpenProfile}
                  className="flex items-center gap-2 pl-2 border-l border-white/10 hover:opacity-85 transition-opacity cursor-pointer text-left"
                  title="View / Edit Student Profile (Class, Age, Mobile, Target Exam)"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName}
                      className="w-8 h-8 rounded-full border border-amber-400/60"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xs">
                      {user.displayName.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs font-bold text-white leading-none truncate max-w-[110px]">
                      {user.displayName}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {isAdmin ? 'Admin' : (user.classPreference || 'Student')}
                    </span>
                  </div>
                </button>

                <button
                  onClick={onSignOut}
                  className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-white/5 transition-colors"
                  title="Log Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={onSignIn}
                  className="px-3.5 py-1.5 rounded-full bg-transparent hover:bg-white/10 border border-white/20 text-white text-xs font-semibold transition-all cursor-pointer"
                >
                  Log in
                </button>
                <button
                  onClick={onSignUp || onSignIn}
                  className="px-3.5 py-1.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  Sign up
                </button>
              </div>
            )}

            {/* Astra White Pill CTA Button: "Try Buzzing Brain" */}
            <button
              onClick={() => onTabChange('studio')}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white hover:bg-slate-200 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer active:scale-95"
            >
              <span>Try Buzzing Brain</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Sub-Bar */}
        <div className="flex lg:hidden items-center justify-around py-2 border-t border-white/10 text-xs font-semibold overflow-x-auto gap-2 text-slate-300">
          <button
            onClick={() => onTabChange('landing')}
            className={`px-2 py-1 rounded-lg ${currentTab === 'landing' ? 'text-white font-bold bg-white/10' : ''}`}
          >
            Home
          </button>
          <button
            onClick={() => onTabChange('syllabus')}
            className={`px-2 py-1 rounded-lg ${currentTab === 'syllabus' ? 'text-amber-400 font-bold bg-white/10' : ''}`}
          >
            Syllabus
          </button>
          <button
            onClick={() => onTabChange('books')}
            className={`px-2 py-1 rounded-lg ${currentTab === 'books' ? 'text-amber-400 font-bold bg-white/10' : ''}`}
          >
            NCERT
          </button>
          <button
            onClick={() => onTabChange('tests')}
            className={`px-2 py-1 rounded-lg ${currentTab === 'tests' ? 'text-amber-400 font-bold bg-white/10' : ''}`}
          >
            Tests
          </button>
          <button
            onClick={() => onTabChange('studio')}
            className={`px-2 py-1 rounded-lg ${currentTab === 'studio' ? 'text-amber-400 font-bold bg-white/10' : ''}`}
          >
            Studio
          </button>
          <button
            onClick={() => onTabChange('youtube')}
            className={`px-2 py-1 rounded-lg ${currentTab === 'youtube' ? 'text-rose-400 font-bold bg-white/10' : ''}`}
          >
            YouTube
          </button>
          <button
            onClick={() => onTabChange('library')}
            className={`px-2 py-1 rounded-lg ${currentTab === 'library' ? 'text-white font-bold bg-white/10' : ''}`}
          >
            Library
          </button>
          <button
            onClick={() => onTabChange('admin')}
            className={`px-2 py-1 rounded-lg ${currentTab === 'admin' ? 'text-rose-400 font-bold bg-white/10' : ''}`}
          >
            Admin
          </button>
        </div>
      </div>
    </header>
  );
};

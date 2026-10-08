import React, { useState } from 'react';
import { 
  LogIn, 
  UserPlus, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  Mail, 
  KeyRound, 
  User, 
  GraduationCap, 
  AlertCircle,
  Eye,
  EyeOff,
  Zap,
  Check
} from 'lucide-react';
import { 
  signInWithGoogle, 
  signInWithEmail, 
  signUpWithEmail, 
  signInAsGuestStudent,
  loginAdminDirectly
} from '../services/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
  customTitle?: string;
  customDescription?: string;
  onOpenLegal?: (tab: 'terms' | 'privacy') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signin',
  customTitle,
  customDescription,
  onOpenLegal,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [classGrade, setClassGrade] = useState('Class 10');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync mode if initialMode changes
  React.useEffect(() => {
    setMode(initialMode);
    setErrorMessage(null);
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const formatAuthError = (err: any): string => {
    const code = err?.code || '';
    if (code === 'auth/email-already-in-use') {
      return 'An account with this email already exists. Please sign in instead.';
    }
    if (code === 'auth/invalid-email') {
      return 'Please enter a valid email address.';
    }
    if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
      return 'Incorrect email or password. Please verify and try again.';
    }
    if (code === 'auth/user-not-found') {
      return 'No account found with this email. Please sign up first.';
    }
    if (code === 'auth/weak-password') {
      return 'Password should be at least 6 characters long.';
    }
    if (code === 'auth/popup-blocked') {
      return 'Google sign-in popup was blocked by your browser. Please use Email/Password or 1-Click Instant Access below.';
    }
    if (code === 'auth/popup-closed-by-user') {
      return 'Sign-in popup was closed before finishing.';
    }
    return err?.message || 'Authentication failed. Please try again.';
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!email.trim() || !password) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }

    setIsLoading(true);
    try {
      await signInWithEmail(email, password);
      onClose();
    } catch (err: any) {
      setErrorMessage(formatAuthError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!displayName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!email.trim() || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (!agreeTerms) {
      setErrorMessage('Please accept the Terms & Conditions and Privacy Policy to proceed.');
      return;
    }

    setIsLoading(true);
    try {
      await signUpWithEmail(email, password, displayName, classGrade);
      onClose();
    } catch (err: any) {
      setErrorMessage(formatAuthError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setIsLoading(true);
    try {
      await signInWithGoogle();
      onClose();
    } catch (err: any) {
      setErrorMessage(formatAuthError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleInstantGuestSignIn = async () => {
    setErrorMessage(null);
    setIsLoading(true);
    try {
      const guestName = displayName.trim() || 'Student Scholar';
      await signInAsGuestStudent(guestName, classGrade);
      onClose();
    } catch (err: any) {
      setErrorMessage(formatAuthError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminQuickLogin = async () => {
    setErrorMessage(null);
    setIsLoading(true);
    try {
      await loginAdminDirectly();
      onClose();
    } catch (err: any) {
      setErrorMessage(formatAuthError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in overflow-y-auto">
      <div className="bg-slate-950 border border-white/20 rounded-3xl max-w-md w-full p-6 sm:p-7 text-left space-y-5 shadow-2xl relative my-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg text-sm cursor-pointer transition-colors"
        >
          ✕
        </button>

        {/* Header with Brand Watermark */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src="/BuzzingBrain_Video_Watermark_150x150.png"
              alt="Buzzing Brain"
              className="w-12 h-12 rounded-full border-2 border-amber-400/80 shadow-md object-cover"
            />
            <div className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-950 p-1 rounded-full shadow-xs">
              <Lock className="w-2.5 h-2.5 font-bold" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-1.5">
              <span>{customTitle || (mode === 'signin' ? 'Welcome Back!' : 'Join Buzzing Brain')}</span>
            </h3>
            <p className="text-xs text-slate-400">
              Free Education for All &bull; NCERT Handwritten Notes
            </p>
          </div>
        </div>

        {customDescription && (
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-xs text-amber-300 leading-relaxed">
            {customDescription}
          </div>
        )}

        {/* Tab Switcher: Sign In vs Sign Up */}
        <div className="flex p-1 rounded-2xl bg-white/5 border border-white/10 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 text-center rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              mode === 'signin'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 text-center rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              mode === 'signup'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Sign Up (New Student)</span>
          </button>
        </div>

        {/* Error Alert Display */}
        {errorMessage && (
          <div className="p-3 bg-rose-500/15 border border-rose-500/30 rounded-2xl text-xs text-rose-300 flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1 text-left leading-relaxed">{errorMessage}</div>
          </div>
        )}

        {/* SIGN IN FORM */}
        {mode === 'signin' && (
          <form onSubmit={handleEmailSignIn} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  required
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-950 font-bold rounded-2xl text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In with Password</span>
                </>
              )}
            </button>

            {/* Quick Fill Admin Button */}
            <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400">
              <span>Admin account?</span>
              <button
                type="button"
                onClick={() => {
                  setEmail('gautamankur0101@gmail.com');
                  setPassword('Zeenews@123');
                }}
                className="text-amber-400 hover:text-amber-300 underline font-medium cursor-pointer"
              >
                Auto-fill Admin (gautamankur0101@gmail.com)
              </button>
            </div>
          </form>
        )}

        {/* SIGN UP FORM */}
        {mode === 'signup' && (
          <form onSubmit={handleEmailSignUp} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Rohan Sharma"
                  required
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Academic Class
                </label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <select
                    value={classGrade}
                    onChange={(e) => setClassGrade(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    <option value="Class 9">Class 9</option>
                    <option value="Class 10">Class 10</option>
                    <option value="Class 11">Class 11</option>
                    <option value="Class 12">Class 12</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@mail.com"
                    required
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Create Password <span className="text-slate-500">(min. 6 characters)</span>
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Terms checkbox */}
            <label className="flex items-start gap-2 pt-1 text-xs text-slate-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 rounded border-white/20 bg-slate-900 text-amber-400 focus:ring-0"
              />
              <span className="text-[11px] leading-snug">
                I agree to the{' '}
                <button
                  type="button"
                  onClick={() => onOpenLegal && onOpenLegal('terms')}
                  className="text-amber-400 hover:underline"
                >
                  Terms &amp; Conditions
                </button>{' '}
                and{' '}
                <button
                  type="button"
                  onClick={() => onOpenLegal && onOpenLegal('privacy')}
                  className="text-amber-400 hover:underline"
                >
                  Privacy Policy
                </button>.
              </span>
            </label>

            <button
              type="submit"
              disabled={isLoading || !agreeTerms}
              className="w-full py-3 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-950 font-bold rounded-2xl text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              {isLoading ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Create Free Student Account</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Alternative Sign-In Options */}
        <div className="space-y-2.5 pt-2 border-t border-white/10">
          <div className="relative text-center my-1">
            <span className="bg-slate-950 px-2 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              Or Instant Sign In
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* Google Sign In */}
            <button
              type="button"
              disabled={isLoading}
              onClick={handleGoogleSignIn}
              className="py-2.5 px-3 bg-white hover:bg-slate-200 text-slate-950 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Google Sign-In</span>
            </button>

            {/* Instant Guest Access */}
            <button
              type="button"
              disabled={isLoading}
              onClick={handleInstantGuestSignIn}
              className="py-2.5 px-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
              title="Enter student portal immediately without email confirmation"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>1-Click Guest</span>
            </button>
          </div>

          {/* 1-Click Admin Access for gautamankur0101@gmail.com */}
          <button
            type="button"
            disabled={isLoading}
            onClick={handleAdminQuickLogin}
            className="w-full py-2.5 px-3 bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-amber-500/15 hover:from-amber-500/25 hover:via-orange-500/25 hover:to-amber-500/25 border border-amber-400/40 rounded-xl text-xs text-amber-300 font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 disabled:opacity-50 shadow-xs"
            title="Automatically log in as administrator (gautamankur0101@gmail.com)"
          >
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
            <span>⚡ 1-Click Admin Login (gautamankur0101@gmail.com)</span>
          </button>
        </div>

        {/* Perks Footer */}
        <div className="text-[11px] text-slate-400 bg-white/5 p-3 rounded-2xl flex items-center justify-between border border-white/5">
          <span className="flex items-center gap-1.5 text-slate-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
            <span>100% Free Forever</span>
          </span>
          <span>&bull;</span>
          <span>Authentic NCERT Notes</span>
          <span>&bull;</span>
          <span>Chapter Tests</span>
        </div>
      </div>
    </div>
  );
};

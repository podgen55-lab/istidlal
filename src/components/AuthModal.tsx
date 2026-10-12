import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { X, LogIn, UserPlus, Mail, Lock, User, Shield, GraduationCap, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { loginWithGoogle, loginWithEmail, registerWithEmail } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (isRegister) {
        if (!nickname.trim()) {
          setError('يرجى إدخال الاسم المستعار (الاسم واللقب أو كنية).');
          setIsSubmitting(false);
          return;
        }
        await registerWithEmail(email, password, nickname, role);
      } else {
        await loginWithEmail(email, password);
      }
      onClose();
    } catch (err: any) {
      console.error('Auth error:', err);
      let msg = 'حدث خطأ أثناء تسجيل الدخول، يرجى المحاولة ثانية.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        msg = 'البريد الإلكتروني أو كلمة المرور غير صحيحة.';
      } else if (err.code === 'auth/email-already-in-use') {
        msg = 'هذا البريد الإلكتروني مسجل مسبقاً، يرجى تسجيل الدخول.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'كلمة المرور ضعيفة (يجب أن تتكون من 6 أحرف على الأقل).';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'صيغة البريد الإلكتروني غير صالحة.';
      }
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      await loginWithGoogle();
      onClose();
    } catch (err: any) {
      console.error('Google sign-in error:', err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setError('تعذر تسجيل الدخول بحساب Google، يرجى المحاولة مرة أخرى.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md animate-fadeIn" dir="rtl">
      <div className="relative w-full max-w-md bg-navy-900 border border-violet-500/30 rounded-32 p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-navy-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-cyan-400 flex items-center justify-center text-xl shadow-lg">
              🧬
            </div>
            <div>
              <h2 className="text-xl font-heading text-slate-100">
                {isRegister ? 'إنشاء حساب جديد' : 'تسجيل الدخول إلى استدلال'}
              </h2>
              <p className="text-xs text-slate-400">
                {isRegister ? 'سجّل لحفظ تقدمك المنهجي ونقاط الـ XP' : 'مرحباً بعودتك! واصل رحلة تفوقك في البكالوريا'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-navy-800 hover:bg-navy-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Google 1-Click Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={isSubmitting}
          className="w-full py-3 px-4 rounded-24 bg-white hover:bg-slate-100 text-slate-900 text-xs sm:text-sm font-bold flex items-center justify-center gap-3 shadow-md hover:scale-[1.01] transition-all disabled:opacity-50"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
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
          <span>المتابعة بحساب Google</span>
        </button>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-navy-800 w-full"></div>
          <span className="bg-navy-900 px-3 text-[11px] text-slate-500 font-bold uppercase">
            أو عبر البريد الإلكتروني
          </span>
        </div>

        {error && (
          <div className="p-3 rounded-20 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">الاسم المستعار (اللقب والاسم):</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute top-3.5 right-3.5" />
                  <input
                    type="text"
                    required
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="مثال: ياسمين ب."
                    className="w-full bg-navy-950 border border-navy-700 rounded-24 pr-10 pl-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              {/* Role Picker */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">الصفة:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('student')}
                    className={`py-2 px-3 rounded-20 text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                      role === 'student'
                        ? 'bg-violet-600/30 border-violet-500 text-violet-300 shadow-md'
                        : 'bg-navy-950 border-navy-800 text-slate-400'
                    }`}
                  >
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>تلميذ (3AS)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('teacher')}
                    className={`py-2 px-3 rounded-20 text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                      role === 'teacher'
                        ? 'bg-lime-400/20 border-lime-400 text-lime-400 shadow-md'
                        : 'bg-navy-950 border-navy-800 text-slate-400'
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>أستاذ مادة</span>
                  </button>
                </div>
              </div>
            </>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">البريد الإلكتروني:</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute top-3.5 right-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@example.com"
                className="w-full bg-navy-950 border border-navy-700 rounded-24 pr-10 pl-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">كلمة المرور:</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute top-3.5 right-3.5" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-navy-950 border border-navy-700 rounded-24 pr-10 pl-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-24 bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-violet-600/30 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>جاري التحقق... ⏳</span>
            ) : isRegister ? (
              <>
                <UserPlus className="w-4 h-4" />
                <span>إنشاء الحساب ومزامنة البيانات</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>تسجيل الدخول</span>
              </>
            )}
          </button>
        </form>

        {/* Toggle between Login and Register */}
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError(null);
            }}
            className="text-xs text-cyan-400 hover:underline font-bold"
          >
            {isRegister
              ? 'لديك حساب بالفعل؟ تسجيل الدخول ➔'
              : 'ليس لديك حساب بعد؟ سجّل الآن واكسب +50 XP ➔'}
          </button>
        </div>
      </div>
    </div>
  );
};

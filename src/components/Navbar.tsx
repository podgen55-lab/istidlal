import React from 'react';
import { useAuth } from '../context/AuthContext';
import { BrandLogo } from './BrandLogo';
import { Flame, Zap, Heart, Shield, GraduationCap, LogIn, LogOut, TrendingUp } from 'lucide-react';

interface NavbarProps {
  onOpenAgentTeam: () => void;
  onOpenAuthModal: () => void;
  activeView: string;
  setActiveView: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAgentTeam,
  onOpenAuthModal,
  activeView,
  setActiveView,
}) => {
  const { currentUser, userProfile, logout, toggleRole } = useAuth();

  const streak = userProfile?.streak ?? 5;
  const xp = userProfile?.xp ?? 620;
  const reviewPoints = userProfile?.reviewPoints ?? 2;
  const hearts = userProfile?.hearts ?? 5;
  const role = userProfile?.role ?? 'student';
  const nickname = userProfile?.nickname ?? (currentUser ? 'تلميذ استدلال' : 'زائر');

  return (
    <header className="sticky top-0 z-40 bg-navy-900/90 backdrop-blur-md border-b border-navy-700/60 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Professional Brand Logo */}
        <div 
          onClick={() => setActiveView('home')}
          className="cursor-pointer"
        >
          <BrandLogo size="md" />
        </div>

        {/* HUD Stats Bar & Auth */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-end">
          {/* Dashboard Button */}
          <button
            onClick={() => setActiveView(activeView === 'dashboard' ? 'home' : 'dashboard')}
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition-all ${
              activeView === 'dashboard'
                ? 'bg-lime-400/20 border-lime-400 text-lime-300 shadow-md shadow-lime-400/10'
                : 'bg-navy-800/80 border-navy-700 text-slate-300 hover:text-white hover:border-lime-500/50'
            }`}
            title="لوحة المؤشرات البيانية (Recharts)"
          >
            <TrendingUp className="w-3.5 h-3.5 text-lime-400" />
            <span className="hidden sm:inline">لوحة المؤشرات</span>
          </button>

          {/* XP Bar */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs sm:text-sm font-bold shadow-sm">
            <Zap className="w-4 h-4 fill-violet-400 text-violet-400" />
            <span>⚡ {xp} XP</span>
          </div>

          {/* Review Points Target */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs sm:text-sm font-bold shadow-sm" title="نقاط المراجعة المستهدفة">
            <span className="text-sm">🎯</span>
            <span>{reviewPoints} نقاط للمراجعة</span>
          </div>

          {/* AI Agents Active Status Pill */}
          <button
            onClick={onOpenAgentTeam}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-bold hover:bg-emerald-500/25 transition-all shadow-sm"
            title="Google AI Agents: نشط"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="hidden sm:inline">🤖 Google AI Agents: نشط</span>
            <span className="sm:hidden">🤖 نشط</span>
          </button>

          {/* Role Toggle Switcher */}
          <button
            onClick={() => {
              if (currentUser) {
                toggleRole();
                if (role === 'student') setActiveView('teacher');
                else setActiveView('home');
              } else {
                onOpenAuthModal();
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-24 border text-xs font-bold transition-all ${
              role === 'teacher'
                ? 'bg-lime-400/15 border-lime-400/40 text-lime-400 shadow-lime-400/10'
                : 'bg-navy-800 border-navy-700 text-slate-300 hover:border-violet-500'
            }`}
            title="تبديل وضع العرض بين تلميذ وأستاذ"
          >
            {role === 'teacher' ? (
              <>
                <Shield className="w-3.5 h-3.5 text-lime-400" />
                <span className="hidden sm:inline">وضع الأستاذ</span>
                <span className="sm:hidden">أستاذ</span>
              </>
            ) : (
              <>
                <GraduationCap className="w-3.5 h-3.5 text-violet-400" />
                <span className="hidden sm:inline">وضع التلميذ</span>
                <span className="sm:hidden">تلميذ</span>
              </>
            )}
          </button>

          {/* User Auth Status / Sign-in */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              <div className="hidden lg:flex flex-col text-right">
                <span className="text-xs font-bold text-slate-200 truncate max-w-[100px]">{nickname}</span>
                <span className="text-[10px] text-lime-400 font-mono">Firestore متصل</span>
              </div>
              <button
                onClick={logout}
                className="w-9 h-9 rounded-24 bg-navy-800 hover:bg-rose-950/40 hover:text-rose-400 text-slate-400 flex items-center justify-center transition-colors"
                title="تسجيل الخروج"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-24 bg-navy-800 hover:bg-violet-900/50 border border-violet-500/40 text-violet-300 text-xs font-bold transition-all"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">دخول / تسجيل</span>
              <span className="sm:hidden">دخول</span>
            </button>
          )}

          {/* Quick AI Team Button */}
          <button
            onClick={onOpenAgentTeam}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-24 bg-gradient-to-r from-violet-600 to-cyan-600 text-white text-xs font-bold shadow-lg shadow-violet-600/20 hover:scale-105 transition-transform"
          >
            <span className="text-sm">🤖</span>
            <span className="hidden md:inline">فريق استدلال</span>
          </button>
        </div>
      </div>
    </header>
  );
};

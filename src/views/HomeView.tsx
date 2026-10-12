import React from 'react';
import { UserProfile } from '../types';
import { CelloMascot } from '../components/CelloMascot';
import { LEAGUE_LEADERBOARD } from '../data/mockData';
import {
  Flame,
  Zap,
  BookOpen,
  Gamepad2,
  Award,
  Sparkles,
  ArrowLeft,
  CheckCircle,
  HelpCircle,
  TrendingUp,
  BrainCircuit,
} from 'lucide-react';

interface HomeViewProps {
  user: UserProfile;
  onNavigate: (view: string) => void;
  onOpenAgentTeam: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  user,
  onNavigate,
  onOpenAgentTeam,
}) => {
  return (
    <div className="space-y-6 pb-20 md:pb-8 animate-fadeIn">
      {/* 1. Hero Welcome & Mascot */}
      <div className="glass-card rounded-32 p-6 md:p-8 bg-gradient-to-r from-violet-900/40 via-navy-800/80 to-navy-900 border border-violet-500/20 relative overflow-hidden">
        <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-violet-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-400/10 border border-lime-400/30 text-lime-400 text-xs font-bold">
              <span>🌟 بكالوريا الجزائر 2026-2027</span>
              <span>•</span>
              <span>شعبة علوم تجريبية ورياضيات</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-heading text-slate-100 leading-tight">
              مرحباً بك يا <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-300">{user.nickname}</span>!
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-xl leading-relaxed">
              جاهز لتفكيك عقدة المنهجية وتحقيق العلامة الكاملة؟ درّب عقلك اليوم على استغلال الوثائق وصياغة النصوص العلمية الدقيقة.
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              <button
                onClick={() => onNavigate('courses')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-24 bg-gradient-to-r from-violet-600 to-cyan-500 text-white text-xs md:text-sm font-bold shadow-lg shadow-violet-600/30 hover:scale-105 transition-transform"
              >
                <BookOpen className="w-4 h-4" />
                <span>مواصلة الدرس (آلية الاستنساخ)</span>
                <ArrowLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('games')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-24 bg-navy-800 hover:bg-navy-700 text-lime-400 border border-lime-400/30 text-xs md:text-sm font-bold transition-colors"
              >
                <Gamepad2 className="w-4 h-4" />
                <span>معركة الخلية (Quiz Battle)</span>
              </button>
            </div>
          </div>

          <div className="flex-shrink-0">
            <CelloMascot
              mood="cheering"
              size="lg"
              message="حققت سلسلة 5 أيام متتالية! أداء أسطوري 🔥"
            />
          </div>
        </div>
      </div>

      {/* 2. Top Stats & XP Level Progress */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* XP Level Card */}
        <div className="glass-card rounded-24 p-5 border border-navy-700/60 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-violet-400 font-bold text-xs">
              <Zap className="w-4 h-4 fill-violet-400" />
              <span>المستوى 4: عبقري الاستدلال</span>
            </div>
            <span className="text-xs text-slate-400 font-mono font-bold">{user.xp} / 500 XP</span>
          </div>
          <div className="w-full bg-navy-950 h-3 rounded-full overflow-hidden p-0.5 border border-navy-800">
            <div
              className="bg-gradient-to-r from-violet-600 to-cyan-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${(user.xp / 500) * 100}%` }}
            ></div>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            اكسب 220 XP إضافية للارتقاء إلى المستوى 5 («مهندس النصوص العلمية»)
          </p>
        </div>

        {/* Daily Streak Card */}
        <div className="glass-card rounded-24 p-5 border border-navy-700/60 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs mb-1">
              <Flame className="w-4 h-4 fill-amber-400 animate-bounce" />
              <span>السلسلة اليومية (Streak)</span>
            </div>
            <div className="text-2xl font-heading text-slate-100">{user.streak} أيام متتالية</div>
            <p className="text-[11px] text-slate-400">حافظ على عاداتك لتضاعف مكافآت الـ XP</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-2xl">
            🔥
          </div>
        </div>

        {/* AI Team Quick Status */}
        <div 
          onClick={onOpenAgentTeam}
          className="glass-card rounded-24 p-5 border border-navy-700/60 flex items-center justify-between cursor-pointer glass-card-hover"
        >
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs mb-1">
              <BrainCircuit className="w-4 h-4" />
              <span>فريق استدلال (8 وكلاء)</span>
            </div>
            <div className="text-sm font-bold text-slate-100">مصحّح ومرشد متاحان</div>
            <p className="text-[11px] text-slate-400">انقر لفتح ورشة الذكاء الاصطناعي</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-cyan-400 flex items-center justify-center text-xl shadow-lg shadow-violet-600/20">
            🤖
          </div>
        </div>
      </div>

      {/* 3. Continue Learning & Verb of the Day */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Continue Learning Card */}
        <div className="lg:col-span-2 glass-card rounded-24 p-6 border border-navy-700/60 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">🧬</span>
              <h2 className="text-lg font-heading text-slate-100">تابع من حيث توقفت</h2>
            </div>
            <span className="text-xs font-bold text-lime-400 px-2.5 py-1 rounded-full bg-lime-400/10 border border-lime-400/20">
              الوحدة 1: آليات تركيب البروتين
            </span>
          </div>

          <div 
            onClick={() => onNavigate('courses')}
            className="p-4 rounded-24 bg-navy-950/60 border border-navy-700/60 hover:border-violet-500/50 transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-violet-400">
                <span>الدرس 03</span>
                <span>•</span>
                <span className="text-slate-400 font-mono italic">Le mécanisme de la transcription</span>
              </div>
              <h3 className="text-base font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                آلية الاستنساخ (شروط ومراحل تشكل الـ ARNm)
              </h3>
              <p className="text-xs text-slate-400">
                المفاهيم: إنزيم ARN بوليمراز، السلسلة الناسخة، التكامل، اتجاه 5' نحو 3'.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <div className="text-left hidden sm:block">
                <span className="text-xs font-bold text-lime-400">مكتمل 80%</span>
              </div>
              <div className="w-10 h-10 rounded-24 bg-violet-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-md shadow-violet-600/30">
                <ArrowLeft className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Daily Challenge Strip */}
          <div className="p-4 rounded-24 bg-gradient-to-r from-coral-brand/10 via-violet-900/20 to-navy-950 border border-coral-brand/30 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-coral-brand/20 text-coral-brand flex items-center justify-center text-xl flex-shrink-0">
                ⚡
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-100">
                  تحدي اليوم: فرّق بين الاستنساخ والترجمة في 3 دقائق
                </h4>
                <p className="text-[11px] text-slate-400">
                  أجب عن 5 أسئلة سريعة واكسب شارة «المميّز الخلوي» و +50 XP
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('games')}
              className="px-3.5 py-1.5 rounded-24 bg-coral-brand text-slate-900 font-bold text-xs hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              ابدأ التحدي
            </button>
          </div>
        </div>

        {/* Verb of the Day (فعل اليوم المنهجي) */}
        <div className="glass-card rounded-24 p-6 border border-navy-700/60 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-cyan-400">
              <Sparkles className="w-4 h-4" />
              <h3 className="text-sm font-heading">فعل اليوم المنهجي</h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              دليل 2017
            </span>
          </div>

          <div className="p-4 rounded-24 bg-navy-950/70 border border-navy-800 text-center space-y-2">
            <span className="text-xs text-slate-400 font-bold">الفعل الأدائي:</span>
            <div className="text-3xl font-heading text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-cyan-300">
              « حَلِّلْ »
            </div>
            <p className="text-[11px] text-slate-300 font-medium">
              قراءة دالة مجردة لمعطيات السند تبرز التغيرات والشواهد الرقمية وتختم دوماً باستنتاج.
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <div className="font-bold text-slate-300 text-[11px]">المسار الرباعي الإلزامي:</div>
            <div className="space-y-1.5 text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-violet-600/30 text-violet-300 flex items-center justify-center text-[9px] font-bold">1</span>
                <span>التعريف الدقيق بالسند والمتغيرات المدروسة.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-violet-600/30 text-violet-300 flex items-center justify-center text-[9px] font-bold">2</span>
                <span>تفكيك المعطيات وتدعيمها بالأرقام والنسب المئوية.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-violet-600/30 text-violet-300 flex items-center justify-center text-[9px] font-bold">3</span>
                <span>إبراز العلاقة الدالة وتجنب التعليل بـ "لأن".</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-lime-400/30 text-lime-400 flex items-center justify-center text-[9px] font-bold">4</span>
                <span className="text-lime-300 font-bold">الاستنتاج: الإجابة المباشرة عن الهدف.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Weekly League Top 5 */}
      <div className="glass-card rounded-24 p-6 border border-navy-700/60 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏆</span>
            <h3 className="text-base font-heading text-slate-100">دوري الأذكياء الأسبوعي (شعبة علوم تجريبية)</h3>
          </div>
          <span className="text-xs text-slate-400">ينتهي الترتيب خلال يومين</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {LEAGUE_LEADERBOARD.map((item) => {
            const isUser = item.name.includes('أنت');
            return (
              <div
                key={item.rank}
                className={`p-3.5 rounded-24 flex items-center gap-3 border transition-all ${
                  isUser
                    ? 'bg-gradient-to-br from-violet-900/50 to-navy-950 border-violet-500/60 shadow-lg shadow-violet-600/20'
                    : 'bg-navy-950/60 border-navy-800'
                }`}
              >
                <div className="text-xl flex-shrink-0">{item.avatar}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className={`text-xs font-bold truncate ${isUser ? 'text-lime-400' : 'text-slate-200'}`}>
                      {item.name}
                    </span>
                    <span className="text-[10px] text-amber-400 font-bold flex items-center gap-0.5">
                      🔥{item.streak}
                    </span>
                  </div>
                  <div className="text-[11px] text-violet-300 font-mono font-bold mt-0.5">
                    {item.xp} XP
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

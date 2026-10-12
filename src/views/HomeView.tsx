import React, { useState } from 'react';
import { UserProfile } from '../types';
import { AbqoorMascot } from '../components/AbqoorMascot';
import { LEAGUE_LEADERBOARD } from '../data/mockData';
import {
  Flame,
  Zap,
  BookOpen,
  Gamepad2,
  Sparkles,
  ArrowLeft,
  BrainCircuit,
  Award,
  CheckCircle2,
  Info,
  ChevronLeft,
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
  const [showMethodologyGuide, setShowMethodologyGuide] = useState(false);

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
              <span>•</span>
              <span>بإشراف: ABDERRAHIM FENKOUH</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-heading text-slate-100 leading-tight">
              أهلاً بك يا <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-violet-300 to-cyan-300">{user.nickname}</span>!
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-xl leading-relaxed">
              «الخيال يفتح الأبواب، والمنهجية العلمية الصارمة تصنع العلامة الكاملة 20/20» — مرحباً بك في مخبر عبقور الذكي لإتقان استغلال الوثائق وهندسة النصوص العلمية.
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
                className="flex items-center gap-2 px-4 py-2.5 rounded-24 bg-navy-800 hover:bg-navy-700 text-amber-300 border border-amber-400/30 text-xs md:text-sm font-bold transition-colors"
              >
                <Gamepad2 className="w-4 h-4 text-amber-400" />
                <span>معركة عبقور العلمية (Quiz Battle)</span>
              </button>

              <button
                onClick={() => setShowMethodologyGuide(true)}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-24 bg-navy-950/70 hover:bg-navy-800 text-slate-300 border border-navy-700 text-xs font-bold transition-colors"
              >
                <Info className="w-3.5 h-3.5 text-cyan-400" />
                <span>دليل تمارين البكالوريا الثلاثة</span>
              </button>
            </div>
          </div>

          <div className="flex-shrink-0">
            <AbqoorMascot
              mood="eureka"
              size="lg"
              message="يوريكا! حافظ على سلسلتك؛ 5 أيام متتالية إنجاز عبقري! ⚡🧪"
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
              <span>المستوى {user.level}: نابغة الاستدلال</span>
            </div>
            <span className="text-xs text-slate-400 font-mono font-bold">{user.xp} / 500 XP</span>
          </div>
          <div className="w-full bg-navy-950 h-3 rounded-full overflow-hidden p-0.5 border border-navy-800">
            <div
              className="bg-gradient-to-r from-violet-600 via-amber-400 to-cyan-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (user.xp / 500) * 100)}%` }}
            ></div>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            اكسب {Math.max(0, 500 - user.xp)} XP إضافية للارتقاء إلى رتبة «مهندس النصوص العلمية» 👨‍🔬
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
            <p className="text-[11px] text-slate-400">الاستمرارية المنظمة هي سر الامتياز</p>
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
              <span>فريق استدلال (8 وكلاء أذكياء)</span>
            </div>
            <div className="text-sm font-bold text-slate-100">المصحّح والمرشد في خدمتك</div>
            <p className="text-[11px] text-slate-400">انقر للتشاور مع الوكلاء المتخصصين</p>
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
                <span className="text-xs font-bold text-lime-400">مكتمل 85%</span>
              </div>
              <div className="w-10 h-10 rounded-24 bg-violet-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-md shadow-violet-600/30">
                <ArrowLeft className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Daily Challenge Strip */}
          <div className="p-4 rounded-24 bg-gradient-to-r from-amber-500/10 via-violet-900/20 to-navy-950 border border-amber-400/30 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-400/20 text-amber-300 flex items-center justify-center text-xl flex-shrink-0">
                ⚡
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-100">
                  تحدي عبقور اليومي: تمييز اتجاهات القراءة والبناء في 3 دقائق
                </h4>
                <p className="text-[11px] text-slate-400">
                  أجب عن 4 أسئلة سريعة واكسب شارة «النابغة الخلوي» و +40 XP
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('games')}
              className="px-4 py-2 rounded-24 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 font-bold text-xs hover:opacity-90 transition-opacity whitespace-nowrap shadow-md"
            >
              خوض المعركة
            </button>
          </div>
        </div>

        {/* Verb of the Day (فعل اليوم المنهجي الرسمي) */}
        <div className="glass-card rounded-24 p-6 border border-navy-700/60 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-cyan-400">
              <Sparkles className="w-4 h-4" />
              <h3 className="text-sm font-heading">الفعل المنهجي الذهبي</h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              بكالوريا الجزائر
            </span>
          </div>

          <div className="p-4 rounded-24 bg-navy-950/70 border border-navy-800 text-center space-y-2">
            <span className="text-xs text-slate-400 font-bold">الفعل الأدائي المطلوب:</span>
            <div className="text-3xl font-heading text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-lime-400 to-cyan-300">
              « حَلِّلْ »
            </div>
            <p className="text-[11px] text-slate-300 font-medium">
              قراءة دالة موضوعية لمعطيات السند تبرز التغيرات والشواهد الرقمية وتختم دوماً باستنتاج.
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
                <span>إبراز العلاقة الدالة وتجنب فخ التعليل بـ "لأن".</span>
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
            <h3 className="text-base font-heading text-slate-100">دوري الأذكياء الأسبوعي (شعبة علوم تجريبية ورياضيات)</h3>
          </div>
          <span className="text-xs text-slate-400">ينتهي الترتيب الأسبوعي خلال 48 ساعة</span>
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

      {/* 5. Modal: Methodology Guide for the 3 Baccalaureate Exercise Types */}
      {showMethodologyGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md animate-fadeIn" dir="rtl">
          <div className="relative w-full max-w-2xl bg-navy-900 border border-violet-500/40 rounded-32 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-navy-800 pb-3">
              <div className="flex items-center gap-3">
                <AbqoorMascot mood="eureka" size="sm" />
                <div>
                  <h3 className="text-lg font-heading text-slate-100">
                    هيكلية تمارين بكالوريا علوم الطبيعة والحياة
                  </h3>
                  <p className="text-xs text-slate-400">
                    الدليل الرسمي المعتمد لتوزيع النقاط واستراتيجيات الإجابة
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowMethodologyGuide(false)}
                className="w-8 h-8 rounded-full bg-navy-800 hover:bg-navy-700 flex items-center justify-center text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-200">
              {/* Exercise 1 */}
              <div className="p-4 rounded-24 bg-violet-950/30 border border-violet-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-heading text-violet-300 text-base">التمرين الأول: استرجاع منظم للمكتسبات</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 font-bold">5 نقاط</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  يستهدف استرجاع وتوظيف المعارف العلمية؛ يحتوي عادة على سند واحد (رسم تخطيطي أو وثيقة) ومهمة مركبة تنتهي بـ <strong>نص علمي مهيكل</strong>.
                </p>
                <div className="text-[11px] text-lime-400 bg-navy-950/60 p-2.5 rounded-16 border border-navy-800">
                  ⚡ <strong>سر عبقور:</strong> تمنح نقطتان كاملتان (2.00 ن) فقط للهيكلة: 0.50 للمقدمة والمشكل + 1.00 لتنظيم العرض + 0.50 للخاتمة التركيبية!
                </div>
              </div>

              {/* Exercise 2 */}
              <div className="p-4 rounded-24 bg-cyan-950/30 border border-cyan-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-heading text-cyan-300 text-base">التمرين الثاني: الاستدلال العلمي</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold">7 نقاط</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  يحل مشكلاً علمياً جديداً بالاعتماد على جزأين وسندات متعددة (منحنيات، تجارب). يعتمد على استغلال السندات عبر التحليل والتفسير والمقارنة، ثم تركيب الإجابة في نهاية كل جزء.
                </p>
                <div className="text-[11px] text-cyan-300 bg-navy-950/60 p-2.5 rounded-16 border border-navy-800">
                  ⚡ <strong>سر عبقور:</strong> كل سند يستغل يمنحك استنتاجاً؛ ربط هذه الاستنتاجات هو الذي يبني الحل الكامل للمشكل!
                </div>
              </div>

              {/* Exercise 3 */}
              <div className="p-4 rounded-24 bg-amber-950/30 border border-amber-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-heading text-amber-300 text-base">التمرين الثالث: المسعى العلمي</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold">8 نقاط</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  أعلى تمارين البكالوريا وزناً! مقسم إلى 3 أجزاء: صياغة فرضية أو فرضيتين في الجزء الأول، التحقق منهما باستغلال معطيات الجزء الثاني، وحوصلة نهائية في الجزء الثالث عبر مخطط تحصيلي أو نص علمي.
                </p>
                <div className="text-[11px] text-amber-300 bg-navy-950/60 p-2.5 rounded-16 border border-navy-800">
                  ⚡ <strong>سر عبقور:</strong> في الفرضية، يجب أن تكون قابلة للاختبار ومرتبطة بدقة بالمشكل العلمي المطروح في السياق.
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowMethodologyGuide(false)}
                className="px-6 py-2 rounded-24 bg-violet-600 text-white font-bold text-xs hover:bg-violet-500 transition-colors"
              >
                فهمت، شكراً يا عبقور! 👍
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

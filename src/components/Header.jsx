/**
 * ==============================================================================
 * Header.jsx - شريط الرأس المتجاوب وعناصر التحفيز البصرية (HUD)
 * ==============================================================================
 * يعتمد على تصميم Mobile-First بنمط Tailwind، ويوفر أزرار تحكم في تقسيم الشاشة للحاسوب،
 * ومؤشرات حية للـ Streak، القلوب، والـ XP.
 */

import React from 'react';

export function Header({
  streak = 3,
  hearts = 5,
  xp = 140,
  splitRatio = 'split',
  onSplitRatioChange = () => {},
}) {
  return (
    <header className="h-16 border-b border-slate-800 bg-[#0f172a]/95 backdrop-blur-md sticky top-0 z-40 px-4 md:px-6 flex items-center justify-between shadow-md">
      {/* الهوية البصرية وشارة الشعبة */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-400 flex items-center justify-center font-black text-xl text-slate-950 shadow-lg shadow-emerald-950">
          إ
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-black text-lg tracking-tight text-white">
              Istidlal <span className="text-emerald-400 font-semibold text-xs">by fnk</span>
            </span>
            <span className="bg-emerald-950/80 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-800/80">
              3AS علوم / رياضيات
            </span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
            <span className="text-emerald-400 font-bold">المجال 01:</span>
            <span>التخصص الوظيفي للبروتينات</span>
            <span className="text-slate-600">•</span>
            <span>الوحدة 01: آليات تركيب البروتين</span>
          </div>
        </div>
      </div>

      {/* أزرار التحكم في تقسيم الشاشة على الحاسوب (Desktop Viewport Control) */}
      <div className="hidden lg:flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 gap-1">
        <button
          onClick={() => onSplitRatioChange('doc_focus')}
          title="التركيز على الوثيقة (70% وثيقة / 30% حوار)"
          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
            splitRatio === 'doc_focus' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>🔍</span>
          <span>تكبير السند</span>
        </button>
        <button
          onClick={() => onSplitRatioChange('split')}
          title="عرض متوازن (50% / 50%)"
          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
            splitRatio === 'split' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>⚖️</span>
          <span>شاشة منقسمة</span>
        </button>
        <button
          onClick={() => onSplitRatioChange('tutor_focus')}
          title="التركيز على الاستدلال (30% وثيقة / 70% حوار)"
          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
            splitRatio === 'tutor_focus' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>✍️</span>
          <span>تركيز الاستدلال</span>
        </button>
      </div>

      {/* مؤشرات التحفيز HUD */}
      <div className="flex items-center gap-2 md:gap-4">
        <div title="سلسلة الالتزام اليومي" className="flex items-center gap-1.5 bg-slate-900 border border-amber-500/30 px-3 py-1.5 rounded-full text-xs font-bold text-amber-400 shadow-sm">
          <span className="text-sm">🔥</span>
          <span>{streak}</span>
        </div>
        <div title="عدد المحاولات المتبقية اليوم" className="flex items-center gap-1.5 bg-slate-900 border border-rose-500/30 px-3 py-1.5 rounded-full text-xs font-bold text-rose-400 shadow-sm">
          <span className="text-sm">❤️</span>
          <span>{hearts}</span>
        </div>
        <div title="نقاط الخبرة المنهجية" className="flex items-center gap-1.5 bg-slate-900 border border-emerald-500/30 px-3 py-1.5 rounded-full text-xs font-bold text-emerald-400 shadow-sm">
          <span className="text-sm">⚡</span>
          <span>{xp} XP</span>
        </div>
      </div>
    </header>
  );
}

export default Header;

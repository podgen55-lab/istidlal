import React, { useState, useEffect } from 'react';
import { BrainCircuit, AlertTriangle, CheckCircle2, ShieldAlert, Award, ChevronDown, ChevronUp, Sparkles, RefreshCw } from 'lucide-react';

export interface TrackedMistake {
  id: string;
  title: string;
  category: 'analysis' | 'explanation' | 'structure' | 'reasoning';
  occurrences: number;
  lastPenalty: string;
  resolved: boolean;
  warningMessage: string;
  preventionTip: string;
}

const DEFAULT_MISTAKES: TrackedMistake[] = [
  {
    id: 'm1',
    title: 'فخ التفسير المسبق (التعليل داخل التحليل)',
    category: 'analysis',
    occurrences: 2,
    lastPenalty: '-0.50 ن',
    resolved: false,
    warningMessage: 'كررت استخدام أدوات التعليل (لأن، بسبب) أثناء قراءة معطيات السند!',
    preventionTip: 'اقتصر في التحليل على ما تلاحظه فقط (قراءة دالة مجردة) واختم باستنتاج.',
  },
  {
    id: 'm2',
    title: 'إغفال الشواهد الرقمية والنسب المئوية',
    category: 'reasoning',
    occurrences: 2,
    lastPenalty: '-0.25 ن',
    resolved: false,
    warningMessage: 'نسيت تدعيم قراءة المنحنى بالقيم العددية والنسب المئوية في التمرين السابق!',
    preventionTip: 'استخرج دائماً القيم القصوى والدنيا مع وحدات القياس الرسمية (مثال: بلغت 100% عند الزمن ز1).',
  },
  {
    id: 'm3',
    title: 'غياب المشكل العلمي في مقدمة النص',
    category: 'structure',
    occurrences: 1,
    lastPenalty: '-0.50 ن',
    resolved: true,
    warningMessage: 'كتبت مقدمة سردية دون طرح تساؤل علمي ينتهي بعلامة استفهام.',
    preventionTip: 'اختم المقدمة دائماً بسؤال دقيق: «فما هي آليات وشروط حدوث الظاهرة س؟»',
  },
];

interface GraderMemoryTrackerProps {
  className?: string;
  showFullReport?: boolean;
}

export const GraderMemoryTracker: React.FC<GraderMemoryTrackerProps> = ({
  className = '',
  showFullReport = false,
}) => {
  const [mistakes, setMistakes] = useState<TrackedMistake[]>(() => {
    try {
      const saved = localStorage.getItem('istidlal_grader_memory');
      return saved ? JSON.parse(saved) : DEFAULT_MISTAKES;
    } catch {
      return DEFAULT_MISTAKES;
    }
  });

  const [isExpanded, setIsExpanded] = useState<boolean>(showFullReport);

  const activeMistakes = mistakes.filter((m) => !m.resolved);
  const resolvedMistakes = mistakes.filter((m) => m.resolved);

  const handleResolve = (id: string) => {
    const updated = mistakes.map((m) =>
      m.id === id ? { ...m, resolved: !m.resolved } : m
    );
    setMistakes(updated);
    try {
      localStorage.setItem('istidlal_grader_memory', JSON.stringify(updated));
    } catch {}
  };

  const handleReset = () => {
    setMistakes(DEFAULT_MISTAKES);
    try {
      localStorage.setItem('istidlal_grader_memory', JSON.stringify(DEFAULT_MISTAKES));
    } catch {}
  };

  return (
    <div
      className={`glass-card rounded-24 border border-violet-500/40 p-4 sm:p-5 shadow-xl bg-gradient-to-r from-violet-950/30 via-navy-900/90 to-navy-950 text-slate-200 transition-all ${className}`}
      dir="rtl"
    >
      {/* Top Banner: Smart Automatic Warning Bar */}
      <div className="flex items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-amber-400 flex items-center justify-center text-xl shadow-lg flex-shrink-0 animate-pulse">
            🧠
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-300">
                ذاكرة «مصححنا يتعلم» (Learning Grader Memory)
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                {activeMistakes.length} أخطاء قيد المراقبة
              </span>
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-100 mt-0.5">
              تنبيه استباقي: رصد نقاط الضعف المنهجية السابقة وتفادي تكرارها
            </h4>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-3 py-1.5 rounded-24 bg-navy-800 hover:bg-navy-700 text-xs font-bold text-slate-300 flex items-center gap-1 transition-colors flex-shrink-0"
        >
          <span>{isExpanded ? 'طي السجل' : 'عرض السجل'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Immediate Prominent Warning for Student before exercise */}
      {activeMistakes.length > 0 && !isExpanded && (
        <div className="mt-3 p-3 rounded-20 bg-rose-950/30 border border-rose-500/40 text-xs flex items-center gap-2.5 animate-fadeIn">
          <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
          <div className="flex-1">
            <strong className="text-rose-300">نصيحة مصححك الذكي للتمرين القادم: </strong>
            <span>
              في محاولاتك الأخيرة تكرر لديك «<strong>{activeMistakes[0].title}</strong>»! احرص اليوم على: {activeMistakes[0].preventionTip}
            </span>
          </div>
        </div>
      )}

      {/* Expanded Full Memory Report */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-navy-800 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>سجل معالجة الأخطاء المنهجية الموثق لكراسك:</span>
            <button
              onClick={handleReset}
              className="text-violet-400 hover:underline flex items-center gap-1 text-[11px]"
            >
              <RefreshCw className="w-3 h-3" />
              <span>إعادة ضبط الذاكرة</span>
            </button>
          </div>

          {/* Active Mistakes List */}
          <div className="space-y-2.5">
            {mistakes.map((mistake) => (
              <div
                key={mistake.id}
                className={`p-3.5 rounded-20 border transition-all ${
                  mistake.resolved
                    ? 'bg-emerald-950/15 border-emerald-500/30 opacity-75'
                    : 'bg-navy-950/70 border-rose-500/40'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <button
                      onClick={() => handleResolve(mistake.id)}
                      className={`w-5 h-5 rounded-lg flex items-center justify-center mt-0.5 transition-colors ${
                        mistake.resolved
                          ? 'bg-emerald-500 text-slate-950'
                          : 'border border-slate-500 hover:border-emerald-400 text-transparent'
                      }`}
                      title={mistake.resolved ? 'إلغاء التمييز كمعالج' : 'تمييز كخطأ تم علاجه'}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${mistake.resolved ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                          {mistake.title}
                        </span>
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300">
                          تكرر {mistake.occurrences} مرات ({mistake.lastPenalty})
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                        ⚠️ <strong>السبب المرصود:</strong> {mistake.warningMessage}
                      </p>
                      <p className="text-[11px] text-lime-400 mt-0.5">
                        🛡️ <strong>طريقة التجنب:</strong> {mistake.preventionTip}
                      </p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                    mistake.resolved ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-400/20 text-amber-300'
                  }`}>
                    {mistake.resolved ? 'تم التغلب عليه ✓' : 'قيد المراقبة ⏳'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-16 bg-navy-950/50 border border-navy-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>
              💡 كل تصحيح جديد لكراسك بالكاميرا يحدث هذه الذاكرة تلقائياً لبناء مناعتك المنهجية!
            </span>
            <span className="text-amber-300 font-bold font-mono">
              نسبة التعافي: {Math.round((resolvedMistakes.length / mistakes.length) * 100)}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default GraderMemoryTracker;

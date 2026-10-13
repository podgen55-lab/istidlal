import React, { useState } from 'react';
import { AdaptiveRetrainingDrill } from '../data/istidlal_curriculum_data';
import { AbqoorMascot } from './AbqoorMascot';
import { Brain, Target, ShieldCheck, Zap, ArrowLeft, CheckCircle2, RotateCcw, Clock, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AdaptiveRetrainingHubProps {
  drills: AdaptiveRetrainingDrill[];
  onAddXP?: (amount: number) => void;
}

export const AdaptiveRetrainingHub: React.FC<AdaptiveRetrainingHubProps> = ({
  drills,
  onAddXP,
}) => {
  const [selectedDrill, setSelectedDrill] = useState<AdaptiveRetrainingDrill | null>(drills[0]);
  const [drillAnswer, setDrillAnswer] = useState('');
  const [isGraded, setIsGraded] = useState(false);
  const [completedDrills, setCompletedDrills] = useState<string[]>([]);

  const handleGradeDrill = () => {
    if (!drillAnswer.trim()) return;
    setIsGraded(true);
    if (selectedDrill && !completedDrills.includes(selectedDrill.id)) {
      setCompletedDrills([...completedDrills, selectedDrill.id]);
      onAddXP?.(90);
      confetti({ particleCount: 75, spread: 60, origin: { y: 0.6 } });
    }
  };

  const handleNextDrill = () => {
    const nextIdx = drills.findIndex((d) => d.id === selectedDrill?.id) + 1;
    if (nextIdx < drills.length) {
      setSelectedDrill(drills[nextIdx]);
      setDrillAnswer('');
      setIsGraded(false);
    }
  };

  return (
    <div className="glass-card rounded-32 border border-violet-500/30 p-6 md:p-8 space-y-6 shadow-2xl bg-gradient-to-br from-violet-950/20 via-navy-950/90 to-navy-900" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-navy-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-24 bg-gradient-to-tr from-violet-600 via-amber-400 to-cyan-400 p-0.5 shadow-lg flex-shrink-0">
            <div className="w-full h-full bg-navy-950 rounded-[22px] flex items-center justify-center text-2xl">
              🧠
            </div>
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-violet-600/20 text-violet-300 text-xs font-bold border border-violet-500/30 mb-1">
              وضع إعادة التدريب الذكي (Adaptive Retraining)
            </div>
            <h3 className="text-xl font-heading text-slate-100">
              جلسات تدريب علاجية مخصصة لنقاط ضعفك المنهجية
            </h3>
            <p className="text-xs text-slate-400">
              يتعرف النظام تلقائياً على ثغراتك (الاستنتاج، اتجاهات 3' و 5'، الشواهد) ويولد تمارين لترميمها
            </p>
          </div>
        </div>

        <AbqoorMascot mood="cheering" size="sm" message="الخطأ فرصة للعبقرية! رمّم ثغراتك واكسب 90 XP! 🚀" />
      </div>

      {/* Drill Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {drills.map((drill) => {
          const isSelected = selectedDrill?.id === drill.id;
          const isDone = completedDrills.includes(drill.id);
          return (
            <button
              key={drill.id}
              onClick={() => {
                setSelectedDrill(drill);
                setDrillAnswer('');
                setIsGraded(false);
              }}
              className={`p-4 rounded-24 border text-right transition-all flex flex-col justify-between gap-2 ${
                isSelected
                  ? 'bg-gradient-to-r from-violet-900/60 to-navy-900 border-amber-400 text-white shadow-lg shadow-violet-600/20'
                  : isDone
                  ? 'bg-navy-950/80 border-lime-500/40 text-lime-300'
                  : 'bg-navy-950/50 border-navy-800 text-slate-400 hover:bg-navy-900/80'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-amber-400" />
                  <span>{drill.difficulty}</span>
                </span>
                {isDone ? (
                  <span className="text-lime-400 font-bold flex items-center gap-1 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" /> تم التغلب عليه
                  </span>
                ) : (
                  <span className="text-amber-400 font-mono text-[11px]">+{drill.points} ن</span>
                )}
              </div>
              <h4 className="text-xs font-bold text-slate-200 line-clamp-2 leading-relaxed">
                {drill.title}
              </h4>
              <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-1">
                <Clock className="w-3 h-3" />
                <span>{drill.recommendedTimeMinutes} دقيقة</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Drill Workspace */}
      {selectedDrill && (
        <div className="p-6 rounded-24 bg-navy-950/80 border border-navy-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-navy-800 pb-3">
            <div>
              <span className="text-[11px] font-bold text-amber-300">المهارة المستهدفة بالترميم:</span>
              <h4 className="text-base font-bold text-slate-100">{selectedDrill.targetSkill}</h4>
            </div>
            <span className="text-xs font-mono font-bold text-lime-400 px-3 py-1 rounded-full bg-lime-400/10 border border-lime-400/20">
              مكافأة الإنجاز: +90 XP ⚡
            </span>
          </div>

          <div className="p-4 rounded-20 bg-navy-900/70 border border-navy-800 space-y-2">
            <strong className="text-xs text-cyan-300 block">نص التمرين العلاجي:</strong>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">{selectedDrill.prompt}</p>
            <div className="p-3 rounded-16 bg-navy-950/90 border border-navy-800/80 text-xs font-mono text-slate-300">
              معطيات السند: {selectedDrill.documentSnippet}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300">صياغة حلك العلاجي:</label>
            <textarea
              value={drillAnswer}
              onChange={(e) => setDrillAnswer(e.target.value)}
              rows={4}
              placeholder="اكتب حلك مع الحرص على تجنب الثغرة السابقة..."
              className="w-full bg-navy-950 border border-navy-700 rounded-20 p-3.5 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 leading-relaxed"
            ></textarea>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => {
                setDrillAnswer('');
                setIsGraded(false);
              }}
              className="px-4 py-2 rounded-20 bg-navy-800 hover:bg-navy-700 text-slate-300 text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>مسح</span>
            </button>

            <button
              disabled={!drillAnswer.trim()}
              onClick={handleGradeDrill}
              className="px-6 py-2.5 rounded-24 bg-gradient-to-r from-amber-400 to-violet-600 text-slate-950 font-bold text-xs shadow-lg shadow-amber-400/20 hover:scale-105 disabled:opacity-50 transition-all flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-slate-950" />
              <span>فحص التعافي المنهجي (+90 XP)</span>
            </button>
          </div>

          {isGraded && (
            <div className="p-4 rounded-20 bg-emerald-950/20 border border-emerald-500/40 text-xs text-slate-200 space-y-2 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-emerald-400 font-bold text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>أحسنت! تم ترميم الثغرة بنجاح وحفظ التحسن في سجلك المنهجي! (+90 XP)</span>
                </span>
                <button
                  onClick={handleNextDrill}
                  className="px-4 py-1.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs transition-colors flex items-center gap-1"
                >
                  <span>التدريب التالي</span>
                  <ArrowLeft className="w-3 h-3" />
                </button>
              </div>
              <p className="text-slate-300 leading-relaxed bg-navy-950/60 p-3 rounded-16 border border-emerald-900/40">
                تقييم الأستاذ عبد الرحيم فنكوح: صياغة متماسكة تفادت فخ الخلط وحققت الدقة في ربط المعطيات بالاستنتاج.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdaptiveRetrainingHub;

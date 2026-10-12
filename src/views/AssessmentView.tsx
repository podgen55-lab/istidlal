import React, { useState } from 'react';
import { DIAGNOSTIC_QUIZ_QUESTIONS } from '../data/mockData';
import { AbqoorMascot } from '../components/AbqoorMascot';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  BookOpen,
  Compass,
} from 'lucide-react';

interface AssessmentViewProps {
  onAddXP: (amount: number) => void;
  onNavigate: (view: string) => void;
  onOpenAgentTeam: () => void;
}

export const AssessmentView: React.FC<AssessmentViewProps> = ({
  onAddXP,
  onNavigate,
  onOpenAgentTeam,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [answers, setAnswers] = useState<{ questionId: string; selected: number; isCorrect: boolean }[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = DIAGNOSTIC_QUIZ_QUESTIONS[currentIdx];

  const handleSelectOption = (idx: number) => {
    if (isSubmitted) return;
    setSelectedOpt(idx);
    setIsSubmitted(true);

    const isCorrect = idx === currentQ.correctAnswer;
    setAnswers((prev) => [
      ...prev,
      { questionId: currentQ.id, selected: idx, isCorrect }
    ]);

    if (isCorrect) {
      onAddXP(10);
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < DIAGNOSTIC_QUIZ_QUESTIONS.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOpt(null);
      setIsSubmitted(false);
    } else {
      setIsFinished(true);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
      onAddXP(50);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setIsSubmitted(false);
    setAnswers([]);
    setIsFinished(false);
  };

  const totalQuestions = DIAGNOSTIC_QUIZ_QUESTIONS.length;
  const correctCount = answers.filter((a) => a.isCorrect).length;
  const scoreOutOf20 = ((correctCount / totalQuestions) * 20).toFixed(1);
  const percentage = Math.round((correctCount / totalQuestions) * 100);

  const masteredTopics = [
    'المسار الرباعي لاستغلال الوثائق (التعريف، المعطيات، الدلالة، الاستنتاج)',
    'هيكلة النص العلمي وضمان نقطتي الهيكلة (2.00 ن)',
  ];
  const reviewTopics = [
    'فصل التحليل عن التفسير وتجنب فخ التعليل المسبق (-0.50 ن)',
    'شروط وخصوصيات تمرين المسعى العلمي الثالث (8 نقاط)'
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20 md:pb-8 animate-fadeIn">
      {/* Header */}
      <div className="glass-card rounded-24 p-6 border border-navy-700/60 flex items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 text-[10px] font-bold border border-violet-500/30 mb-1">
            تقييم تشخيصي رسمي
          </div>
          <h1 className="text-xl md:text-2xl font-heading text-slate-100">
            اختبار كفاءات منهجية بكالوريا علوم الطبيعة والحياة
          </h1>
          <p className="text-xs text-slate-400">
            فحص استيعابك لقواعد بناء الاختبار وشبكات التنقيط والأفعال الأدائية الرسمية
          </p>
        </div>
        <div className="w-12 h-12 rounded-24 bg-gradient-to-tr from-amber-400 to-violet-600 flex items-center justify-center text-2xl shadow-lg">
          📊
        </div>
      </div>

      {/* Results Screen */}
      {isFinished ? (
        <div className="glass-card rounded-32 p-6 md:p-8 border border-violet-500/30 space-y-8 animate-scaleUp">
          <div className="text-center space-y-3">
            <AbqoorMascot mood={percentage >= 60 ? 'eureka' : 'hint'} size="lg" className="justify-center" />
            <h2 className="text-2xl md:text-3xl font-heading text-slate-100">
              تقرير التقييم المنهجي النهائي 📋
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
              إليك التحليل المفصل لأدائك مع تحديد مواطن القوة والفخاخ التي تحتاج لمعالجة فورية.
            </p>
          </div>

          {/* Big Score Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-24 bg-navy-950/80 border border-violet-500/30 text-center space-y-1">
              <span className="text-xs text-slate-400 font-bold block">العلامة التقديرية</span>
              <span className="text-3xl font-heading text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-violet-300 to-cyan-300">
                {scoreOutOf20} / 20
              </span>
            </div>

            <div className="p-5 rounded-24 bg-navy-950/80 border border-lime-500/30 text-center space-y-1">
              <span className="text-xs text-slate-400 font-bold block">نسبة الإتقان</span>
              <span className="text-3xl font-heading text-lime-400">
                {percentage}%
              </span>
            </div>

            <div className="p-5 rounded-24 bg-navy-950/80 border border-amber-500/30 text-center space-y-1">
              <span className="text-xs text-slate-400 font-bold block">نقاط الخبرة المكتسبة</span>
              <span className="text-3xl font-heading text-amber-400">
                +{correctCount * 10 + 50} XP
              </span>
            </div>
          </div>

          {/* Topics Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-24 bg-emerald-950/20 border border-emerald-500/30 space-y-2.5">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4" />
                <span>مفاهيم مُتقنة بنجاح:</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {masteredTopics.map((topic, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400">•</span>
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-24 bg-rose-950/20 border border-rose-500/30 space-y-2.5">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
                <XCircle className="w-4 h-4" />
                <span>مفاهيم تتطلب المراجعة:</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {reviewTopics.map((topic, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-rose-400">•</span>
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Planner Recommendation */}
          <div className="p-5 rounded-24 bg-gradient-to-r from-violet-950/40 to-navy-950 border border-violet-500/30 flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center text-xl flex-shrink-0">
              🗺️
            </div>
            <div className="space-y-1 text-xs">
              <strong className="text-amber-300 block">توجيه «المخطِّط» 🗺️ للأسبوع القادم:</strong>
              <p className="text-slate-300 leading-relaxed">
                ركز في جلساتك القادمة على حل تمرينين من النمط الثاني (7 نقاط)، وتدرب على كتابة التحليل دون استخدام كلمات الربط السببية (مثل لأن وبسبب) قبل استخراج الاستنتاج لضمان 7/7 نقاط كاملة.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleRestart}
              className="px-5 py-2.5 rounded-24 bg-navy-800 hover:bg-navy-700 text-slate-200 text-xs font-bold border border-navy-700 transition-colors flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>إعادة الاختبار</span>
            </button>

            <button
              onClick={() => onNavigate('courses')}
              className="px-6 py-2.5 rounded-24 bg-gradient-to-r from-violet-600 to-cyan-500 text-white text-xs font-bold shadow-lg shadow-violet-600/30 hover:scale-105 transition-transform flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>الانتقال لدرس آلية الاستنساخ</span>
            </button>

            <button
              onClick={onOpenAgentTeam}
              className="px-5 py-2.5 rounded-24 bg-navy-800 hover:bg-navy-700 text-amber-300 border border-amber-400/30 text-xs font-bold transition-colors flex items-center gap-2"
            >
              <Compass className="w-4 h-4" />
              <span>استشارة فريق استدلال</span>
            </button>
          </div>
        </div>
      ) : (
        /* Active Quiz Board */
        <div className="glass-card rounded-32 p-6 md:p-8 border border-navy-700/60 space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold text-violet-400">
              السؤال {currentIdx + 1} من {totalQuestions}
            </span>
            <span className="font-bold text-slate-300">
              مستوى الصعوبة: {currentQ.reasoningLevel} / 4
            </span>
          </div>

          <div className="p-6 rounded-24 bg-navy-950/80 border border-navy-800 space-y-2">
            {currentQ.frenchTerm && (
              <span className="text-[11px] font-mono text-cyan-400/80 italic block">
                {currentQ.frenchTerm}
              </span>
            )}
            <h2 className="text-base sm:text-lg font-bold text-slate-100 leading-relaxed">
              {currentQ.question}
            </h2>
          </div>

          <div className="space-y-3">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOpt === idx;
              const isCorrect = idx === currentQ.correctAnswer;

              let btnStyle = 'bg-navy-950/60 hover:bg-navy-800/80 border-navy-800 text-slate-200';
              if (isSubmitted) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-950/70 border-emerald-500 text-emerald-200 shadow-lg shadow-emerald-500/10';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-950/70 border-rose-500 text-rose-200';
                } else {
                  btnStyle = 'opacity-50 border-navy-900 bg-navy-950/30';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isSubmitted}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full p-4 rounded-24 border text-xs sm:text-sm font-medium text-right flex items-center justify-between gap-3 transition-all ${btnStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-navy-800 text-slate-300 flex items-center justify-center text-xs font-bold">
                      {['أ', 'ب', 'ج', 'د'][idx]}
                    </span>
                    <span>{opt}</span>
                  </div>
                  {isSubmitted && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />}
                  {isSubmitted && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />}
                </button>
              );
            })}
          </div>

          {isSubmitted && (
            <div className="p-4 rounded-24 bg-navy-950 border border-navy-700/80 space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold ${selectedOpt === currentQ.correctAnswer ? 'text-lime-400' : 'text-rose-400'}`}>
                  {selectedOpt === currentQ.correctAnswer ? 'إجابة صحيحة وفق المعايير الوزارية ✓' : 'إجابة غير صحيحة ✕'}
                </span>
                <span className="text-[11px] text-slate-400 font-bold">
                  الفعل: «{currentQ.verb}»
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentQ.explanation}
              </p>
              <div className="flex justify-end pt-1">
                <button
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-24 bg-gradient-to-r from-amber-400 to-violet-600 text-slate-900 font-bold text-xs shadow-lg shadow-amber-400/20 hover:scale-105 transition-transform"
                >
                  {currentIdx + 1 < totalQuestions ? 'السؤال التالي ➔' : 'عرض النتيجة النهائية 📊'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

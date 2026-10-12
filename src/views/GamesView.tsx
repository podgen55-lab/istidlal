import React, { useState, useEffect } from 'react';
import { BATTLE_QUESTIONS } from '../data/mockData';
import { CelloMascot } from '../components/CelloMascot';
import confetti from 'canvas-confetti';
import {
  Gamepad2,
  Heart,
  Zap,
  Clock,
  Sparkles,
  RotateCcw,
  Award,
  ShieldAlert,
  Flame,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

interface GamesViewProps {
  onAddXP: (amount: number) => void;
}

export const GamesView: React.FC<GamesViewProps> = ({ onAddXP }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [hearts, setHearts] = useState(3);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWon, setIsWon] = useState(false);

  // Power-ups
  const [power5050Used, setPower5050Used] = useState(false);
  const [hiddenOptions, setHiddenOptions] = useState<number[]>([]);
  const [doubleXpActive, setDoubleXpActive] = useState(false);

  const currentQ = BATTLE_QUESTIONS[currentIdx];

  // Audio chimes with Web Audio API
  const playSfx = (type: 'correct' | 'wrong' | 'win') => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'correct') {
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } else if (type === 'wrong') {
        osc.frequency.setValueAtTime(260, ctx.currentTime);
        osc.frequency.setValueAtTime(190, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      } else if (type === 'win') {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch {}
  };

  // Timer countdown
  useEffect(() => {
    if (isAnswered || isGameOver || isWon) return;

    if (timeLeft <= 0) {
      handleAnswer(-1); // time out
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isAnswered, isGameOver, isWon]);

  const handleAnswer = (optionIdx: number) => {
    if (isAnswered) return;
    setSelectedOpt(optionIdx);
    setIsAnswered(true);

    const isCorrect = optionIdx === currentQ.correctAnswer;

    if (isCorrect) {
      const earnedXP = doubleXpActive ? 40 : 20;
      setScore((prev) => prev + earnedXP);
      setStreak((prev) => prev + 1);
      onAddXP(earnedXP);
      playSfx('correct');
    } else {
      setStreak(0);
      setHearts((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          setIsGameOver(true);
        }
        return next;
      });
      playSfx('wrong');
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < BATTLE_QUESTIONS.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOpt(null);
      setIsAnswered(false);
      setTimeLeft(20);
      setHiddenOptions([]);
    } else {
      setIsWon(true);
      playSfx('win');
      onAddXP(50); // Victory bonus
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setIsAnswered(false);
    setHearts(3);
    setScore(0);
    setStreak(0);
    setTimeLeft(20);
    setIsGameOver(false);
    setIsWon(false);
    setPower5050Used(false);
    setHiddenOptions([]);
    setDoubleXpActive(false);
  };

  // Power-up 1: 50/50
  const use5050 = () => {
    if (power5050Used || isAnswered) return;
    setPower5050Used(true);

    const wrongIndexes = currentQ.options
      .map((_, idx) => idx)
      .filter((idx) => idx !== currentQ.correctAnswer);

    // Pick 2 wrong answers to hide
    const toHide = wrongIndexes.slice(0, 2);
    setHiddenOptions(toHide);
  };

  // Power-up 2: Freeze time (+15s)
  const useFreezeTime = () => {
    if (isAnswered) return;
    setTimeLeft((prev) => prev + 15);
  };

  // Power-up 3: Double XP
  const useDoubleXp = () => {
    if (isAnswered) return;
    setDoubleXpActive(true);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20 md:pb-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="glass-card rounded-24 p-6 border border-navy-700/60 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-24 bg-gradient-to-tr from-coral-brand via-violet-600 to-lime-400 p-0.5 shadow-lg">
            <div className="w-full h-full bg-navy-950 rounded-[22px] flex items-center justify-center text-2xl">
              🎮
            </div>
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-coral-brand/20 text-coral-brand text-[10px] font-bold border border-coral-brand/30">
              لعبة تفاعلية
            </div>
            <h1 className="text-xl md:text-2xl font-heading text-slate-100">
              معركة الخلية (Cell Quiz Battle)
            </h1>
            <p className="text-xs text-slate-400">
              تحدَّ سيلّو في أسئلة الاستنساخ والترجمة وحافظ على قلوبك للوصول للنهائي!
            </p>
          </div>
        </div>

        {/* Lives Counter */}
        <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-navy-950 border border-navy-800">
          {[1, 2, 3].map((h) => (
            <Heart
              key={h}
              className={`w-5 h-5 transition-transform ${
                h <= hearts ? 'fill-rose-500 text-rose-500 animate-pulse' : 'text-slate-600'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Game State: Victory Screen */}
      {isWon && (
        <div className="glass-card rounded-32 p-8 text-center space-y-6 border border-lime-400/40 bg-gradient-to-b from-navy-900 to-navy-950 shadow-2xl animate-scaleUp">
          <CelloMascot mood="cheering" size="lg" className="justify-center" />
          <div className="space-y-2">
            <h2 className="text-3xl font-heading text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-cyan-300">
              انتصار ساحق في معركة الخلية! 🏆
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
              أثبتَّ إتقاناً ممتازاً لآليات الاستنساخ والشروط البيولوجية للتعبير المورثي.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
            <div className="p-4 rounded-24 bg-navy-950/80 border border-violet-500/30">
              <span className="text-xs text-slate-400 block mb-1">النقاط المكتسبة</span>
              <span className="text-2xl font-mono font-bold text-violet-300">+{score} XP</span>
            </div>
            <div className="p-4 rounded-24 bg-navy-950/80 border border-lime-500/30">
              <span className="text-xs text-slate-400 block mb-1">القلوب المتبقية</span>
              <span className="text-2xl font-bold text-rose-400">{hearts} / 3 ❤️</span>
            </div>
          </div>

          <button
            onClick={handleRestart}
            className="px-6 py-3 rounded-24 bg-gradient-to-r from-violet-600 to-lime-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-lime-500/20 hover:scale-105 transition-transform inline-flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>لعب جولة جديدة</span>
          </button>
        </div>
      )}

      {/* Game State: Game Over Screen */}
      {isGameOver && (
        <div className="glass-card rounded-32 p-8 text-center space-y-6 border border-rose-500/40 bg-gradient-to-b from-navy-900 to-navy-950 shadow-2xl animate-scaleUp">
          <CelloMascot mood="worried" size="lg" className="justify-center" />
          <div className="space-y-2">
            <h2 className="text-2xl font-heading text-rose-400">
              نفدت القلوب! لا تستسلم يا بطل 💔
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
              الأخطاء هي المحطة الأولى في فهم المنهجية. راجع ملخص الدرس وجرب مجدداً!
            </p>
          </div>

          <button
            onClick={handleRestart}
            className="px-6 py-3 rounded-24 bg-navy-800 hover:bg-navy-700 text-slate-100 font-bold text-xs sm:text-sm border border-navy-700 transition-colors inline-flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>إعادة المحاولة من البداية</span>
          </button>
        </div>
      )}

      {/* Active Battle Board */}
      {!isWon && !isGameOver && (
        <div className="glass-card rounded-32 p-6 md:p-8 border border-navy-700/60 space-y-6">
          {/* Top Bar: Progress, Timer & Streak */}
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs font-bold text-violet-400 font-mono">
              السؤال {currentIdx + 1} من {BATTLE_QUESTIONS.length}
            </span>

            {/* Timer bar */}
            <div className="flex-1 max-w-xs flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <div className="w-full bg-navy-950 h-3 rounded-full overflow-hidden p-0.5 border border-navy-800">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${
                    timeLeft <= 5 ? 'bg-rose-500 animate-pulse' : 'bg-gradient-to-r from-violet-500 to-cyan-400'
                  }`}
                  style={{ width: `${(timeLeft / 20) * 100}%` }}
                ></div>
              </div>
              <span className="text-xs font-mono font-bold text-slate-300 w-6">
                {timeLeft}s
              </span>
            </div>

            {/* Streak indicator */}
            {streak > 1 && (
              <span className="flex items-center gap-1 text-xs font-bold text-amber-400 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 animate-bounce">
                <Flame className="w-3.5 h-3.5 fill-amber-400" />
                <span>{streak} متتالية!</span>
              </span>
            )}
          </div>

          {/* Question Text */}
          <div className="p-6 rounded-24 bg-navy-950/80 border border-navy-800 space-y-2 text-center md:text-right">
            {currentQ.frenchTerm && (
              <span className="text-[11px] font-mono text-cyan-400/80 italic block">
                {currentQ.frenchTerm}
              </span>
            )}
            <h3 className="text-base sm:text-lg font-bold text-slate-100 leading-relaxed">
              {currentQ.question}
            </h3>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQ.options.map((opt, idx) => {
              const isHidden = hiddenOptions.includes(idx);
              const isSelected = selectedOpt === idx;
              const isCorrect = idx === currentQ.correctAnswer;

              let btnStyle = 'bg-navy-950/60 hover:bg-navy-800/80 border-navy-800 text-slate-200';
              if (isAnswered) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 shadow-lg shadow-emerald-500/10';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-950/60 border-rose-500 text-rose-200';
                } else {
                  btnStyle = 'opacity-40 border-navy-900 bg-navy-950/30';
                }
              }

              if (isHidden) {
                return (
                  <div key={idx} className="p-4 rounded-24 border border-dashed border-navy-800/40 opacity-20"></div>
                );
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleAnswer(idx)}
                  className={`p-4 rounded-24 border text-xs sm:text-sm font-medium text-right flex items-center justify-between gap-3 transition-all ${btnStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-navy-800 text-slate-300 flex items-center justify-center text-xs font-bold">
                      {['أ', 'ب', 'ج', 'د'][idx]}
                    </span>
                    <span>{opt}</span>
                  </div>
                  {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />}
                  {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Power-ups Tray */}
          <div className="p-4 rounded-24 bg-navy-950/50 border border-navy-800 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[11px] text-slate-400 font-bold whitespace-nowrap">وسائل المساعدة:</span>
            <div className="flex items-center gap-2">
              <button
                disabled={power5050Used || isAnswered}
                onClick={use5050}
                className="px-3 py-1.5 rounded-full bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/30 text-violet-300 text-xs font-bold disabled:opacity-40 transition-colors"
                title="حذف خيارين خاطئين"
              >
                50:50
              </button>
              <button
                disabled={isAnswered}
                onClick={useFreezeTime}
                className="px-3 py-1.5 rounded-full bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/30 text-cyan-300 text-xs font-bold disabled:opacity-40 transition-colors"
                title="إضافة 15 ثانية للوقت"
              >
                ⏱️ +15 ثانية
              </button>
              <button
                disabled={doubleXpActive || isAnswered}
                onClick={useDoubleXp}
                className="px-3 py-1.5 rounded-full bg-lime-600/20 hover:bg-lime-600/30 border border-lime-500/30 text-lime-300 text-xs font-bold disabled:opacity-40 transition-colors"
                title="مضاعفة الـ XP"
              >
                ⚡ 2X مضاعف
              </button>
            </div>
          </div>

          {/* Feedback & Next Button */}
          {isAnswered && (
            <div className="p-4 rounded-24 bg-navy-950 border border-navy-700/80 space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-lime-400">
                  {selectedOpt === currentQ.correctAnswer ? 'إجابة صحيحة ومتقنة! 🌟' : 'إجابة خاطئة ⚠️'}
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
                  className="px-6 py-2.5 rounded-24 bg-gradient-to-r from-violet-600 to-cyan-500 text-white text-xs font-bold shadow-lg shadow-violet-600/20 hover:scale-105 transition-transform"
                >
                  السؤال التالي ➔
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

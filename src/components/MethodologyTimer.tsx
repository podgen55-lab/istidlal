import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Clock, AlertTriangle, Bell, Volume2, VolumeX, ChevronDown, ChevronUp } from 'lucide-react';

export type ExerciseType = 'lesson' | 'reasoning' | 'inquiry';

interface ExerciseTimerPreset {
  id: ExerciseType;
  label: string;
  durationMinutes: number;
  totalSeconds: number;
  points: string;
  badge: string;
}

export const TIMER_PRESETS: Record<ExerciseType, ExerciseTimerPreset> = {
  lesson: {
    id: 'lesson',
    label: 'تمرين 1: استرجاع المكتسبات (الدرس)',
    durationMinutes: 15,
    totalSeconds: 15 * 60,
    points: '5 نقاط',
    badge: '15 دقيقة',
  },
  reasoning: {
    id: 'reasoning',
    label: 'تمرين 2: استدلال علمي',
    durationMinutes: 25,
    totalSeconds: 25 * 60,
    points: '7 نقاط',
    badge: '25 دقيقة',
  },
  inquiry: {
    id: 'inquiry',
    label: 'تمرين 3: مسعى علمي كامل',
    durationMinutes: 45,
    totalSeconds: 45 * 60,
    points: '8 نقاط',
    badge: '45 دقيقة',
  },
};

interface MethodologyTimerProps {
  initialType?: ExerciseType;
  onTimeExpired?: () => void;
  className?: string;
}

export const MethodologyTimer: React.FC<MethodologyTimerProps> = ({
  initialType = 'reasoning',
  onTimeExpired,
  className = '',
}) => {
  const [selectedType, setSelectedType] = useState<ExerciseType>(initialType);
  const [secondsLeft, setSecondsLeft] = useState<number>(TIMER_PRESETS[initialType].totalSeconds);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const preset = TIMER_PRESETS[selectedType];
  const progressPercent = Math.max(0, Math.min(100, (secondsLeft / preset.totalSeconds) * 100));

  // Determine danger level
  const isDanger = secondsLeft <= 120 && secondsLeft > 0; // Under 2 mins
  const isWarning = secondsLeft <= 300 && secondsLeft > 120; // Under 5 mins
  const isExpired = secondsLeft === 0;

  // Sound generator using Web Audio API
  const playAlertSound = (type: 'tick' | 'danger' | 'finished') => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'tick') {
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } else if (type === 'danger') {
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      } else if (type === 'finished') {
        osc.frequency.setValueAtTime(587.33, ctx.currentTime);
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
        osc.start();
        osc.stop(ctx.currentTime + 0.6);
      }
    } catch {}
  };

  // Timer interval
  useEffect(() => {
    let interval: any = null;
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            playAlertSound('finished');
            onTimeExpired?.();
            return 0;
          }
          if (prev === 121 || prev === 61) {
            playAlertSound('danger');
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsLeft, soundEnabled]);

  const handleSelectType = (type: ExerciseType) => {
    setSelectedType(type);
    setSecondsLeft(TIMER_PRESETS[type].totalSeconds);
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(preset.totalSeconds);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className={`glass-card rounded-24 border transition-all duration-300 overflow-hidden shadow-xl ${
        isExpired
          ? 'border-rose-500 bg-rose-950/40 shadow-rose-900/30'
          : isDanger
          ? 'border-rose-500/80 bg-rose-950/20 shadow-rose-900/20 animate-pulse'
          : isWarning
          ? 'border-amber-500/60 bg-amber-950/20 shadow-amber-900/10'
          : 'border-violet-500/30 bg-navy-900/90'
      } ${className}`}
      dir="rtl"
    >
      {/* Top Header Strip */}
      <div className="p-3.5 px-4 flex items-center justify-between gap-3 border-b border-navy-800/80 bg-navy-950/60">
        <div className="flex items-center gap-2">
          <Clock className={`w-4 h-4 ${isDanger ? 'text-rose-400 animate-spin' : isWarning ? 'text-amber-400' : 'text-cyan-400'}`} />
          <span className="text-xs font-bold text-slate-200">
            شريط المؤقت المنهجي الرسمي (Countdown Timer)
          </span>
          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
            isDanger ? 'bg-rose-500/20 text-rose-300' : isWarning ? 'bg-amber-500/20 text-amber-300' : 'bg-violet-500/20 text-violet-300'
          }`}>
            {preset.badge} • {preset.points}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="w-7 h-7 rounded-xl bg-navy-800 hover:bg-navy-700 text-slate-400 hover:text-slate-200 flex items-center justify-center transition-colors"
            title={soundEnabled ? 'كتم التنبيهات الصوتية' : 'تفعيل التنبيهات الصوتية'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-7 h-7 rounded-xl bg-navy-800 hover:bg-navy-700 text-slate-400 hover:text-slate-200 flex items-center justify-center transition-colors"
          >
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div className="p-4 sm:p-5 space-y-4">
          {/* Preset Buttons */}
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(TIMER_PRESETS) as ExerciseType[]).map((type) => {
              const p = TIMER_PRESETS[type];
              const isSelected = selectedType === type;
              return (
                <button
                  key={type}
                  onClick={() => handleSelectType(type)}
                  className={`p-2.5 rounded-16 border text-right transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-violet-600/30 border-violet-400 text-white shadow-md shadow-violet-600/20 font-bold'
                      : 'bg-navy-950/60 border-navy-800 text-slate-400 hover:bg-navy-800/80 hover:text-slate-200'
                  }`}
                >
                  <span className="text-[11px] font-bold truncate block">{p.label.split(':')[1]}</span>
                  <div className="flex items-center justify-between text-[10px] mt-1 font-mono text-cyan-300">
                    <span>{p.badge}</span>
                    <span className="text-amber-400">{p.points}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Main Time Counter & Progress */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-24 bg-navy-950/80 border border-navy-800">
            <div className="text-center sm:text-right">
              <span className="text-[11px] text-slate-400 block mb-0.5">الوقت المتبقي لإنهاء الإجابة:</span>
              <div className={`text-4xl sm:text-5xl font-mono font-black tracking-wider ${
                isExpired
                  ? 'text-rose-500 animate-bounce'
                  : isDanger
                  ? 'text-rose-400 animate-pulse'
                  : isWarning
                  ? 'text-amber-300'
                  : 'text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-cyan-300 to-lime-300'
              }`}>
                {formatTime(secondsLeft)}
              </div>
            </div>

            {/* Play/Pause/Reset Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`px-5 py-2.5 rounded-24 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-transform hover:scale-105 ${
                  isRunning
                    ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-500/20'
                    : 'bg-gradient-to-r from-lime-400 to-cyan-500 hover:opacity-90 text-slate-950 shadow-lime-400/20'
                }`}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-4 h-4 fill-slate-950" />
                    <span>إيقاف مؤقت</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-slate-950" />
                    <span>{secondsLeft === preset.totalSeconds ? 'بدء التمرين' : 'استئناف'}</span>
                  </>
                )}
              </button>

              <button
                onClick={handleReset}
                className="w-10 h-10 rounded-24 bg-navy-800 hover:bg-navy-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                title="إعادة ضبط المؤقت"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Linear Progress Bar */}
          <div className="space-y-1">
            <div className="w-full bg-navy-950 h-2.5 rounded-full overflow-hidden p-0.5 border border-navy-800">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isDanger
                    ? 'bg-rose-500'
                    : isWarning
                    ? 'bg-amber-400'
                    : 'bg-gradient-to-r from-violet-500 to-cyan-400'
                }`}
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>00:00</span>
              <span>{Math.round(progressPercent)}% متبقي</span>
              <span>{preset.durationMinutes}:00</span>
            </div>
          </div>

          {/* Color Cues Warning Alert */}
          {isDanger && (
            <div className="p-3 rounded-16 bg-rose-950/60 border border-rose-500/80 text-rose-200 text-xs flex items-center gap-2 animate-bounce">
              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>
                ⚠️ <strong>تنبيه منهجي عاجل:</strong> أقل من دقيقتين! اختتم تحليلك واستخرج الاستنتاج أو الخاتمة فوراً لتفادي ضياع الوقت!
              </span>
            </div>
          )}

          {isWarning && !isDanger && (
            <div className="p-2.5 rounded-16 bg-amber-950/40 border border-amber-500/50 text-amber-200 text-xs flex items-center gap-2">
              <Bell className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span>
                ⏳ <strong>إشعار الوقت:</strong> بقي أقل من 5 دقائق! تأكد من تدعيم إجابتك بالشواهد الرقمية والربط السببي.
              </span>
            </div>
          )}

          {isExpired && (
            <div className="p-3 rounded-16 bg-rose-600 text-white font-bold text-xs text-center rounded-20 shadow-lg">
              ⏰ انتهى الوقت القانوني للتمرين! صوّر كراسك الآن وأرسله للمصحح الذكي لتقييم إجابتك.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MethodologyTimer;

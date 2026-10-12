import React from 'react';

export type AbqoorMood = 'idle' | 'happy' | 'cheering' | 'thinking' | 'worried' | 'hint' | 'eureka';

interface AbqoorMascotProps {
  mood?: AbqoorMood;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  message?: string;
}

export const AbqoorMascot: React.FC<AbqoorMascotProps> = ({
  mood = 'idle',
  size = 'md',
  className = '',
  message,
}) => {
  const sizeMap = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-28 h-28',
  };

  // Quotes from genius Einstein-style Abqoor
  const defaultMessages: Record<AbqoorMood, string> = {
    idle: 'يا بطل! الخيال أهم من المعرفة، لكن المنهجية هي مفتاح الـ 20/20! 🧪',
    happy: 'أحسنت! هذا تفكير علمي منطقي يشرح الصدر! ⚡',
    cheering: 'يوريكا! أداء عبقري يستحق العلامة الكاملة! 🏆✨',
    thinking: 'ممم.. فكّر في العلاقة السببية: سبب ← آلية ← نتيجة! 🤔',
    worried: 'انتبه للفخ! لا تخلط بين التحليل والتفسير، ركّز يا بطل! ⚠️',
    hint: 'سر عبقور: السلسلة غير الناسخة تشبه الـ ARNm تماماً باستبدال T بـ U! 💡',
    eureka: 'انفجار عبقرية! الربط المنطقي بين الوثائق استثنائي! 🚀',
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Einstein-style Cartoon Avatar SVG */}
      <div className={`relative ${sizeMap[size]} flex-shrink-0 animate-float`}>
        {/* Glow halo */}
        <div className="absolute inset-0 bg-gradient-to-tr from-amber-400/30 via-violet-500/20 to-cyan-400/30 rounded-full blur-md"></div>

        <svg viewBox="0 0 100 100" className="w-full h-full relative z-10 drop-shadow-xl">
          {/* Wild bushy white hair (Einstein style) */}
          <path
            d="M 18,52 Q 10,38 18,24 Q 30,12 50,14 Q 72,10 84,24 Q 92,38 82,54 Q 90,62 82,72 Q 74,78 68,76 Q 30,80 20,72 Q 12,62 18,52 Z"
            fill="#F1F5F9"
            stroke="#CBD5E1"
            strokeWidth="2.5"
          />

          {/* Cute face base */}
          <ellipse cx="50" cy="54" rx="27" ry="25" fill="#FED7AA" stroke="#FDBA74" strokeWidth="2" />

          {/* Rosy cheeks */}
          <ellipse cx="32" cy="62" rx="4.5" ry="3" fill="#FB7185" opacity="0.6" />
          <ellipse cx="68" cy="62" rx="4.5" ry="3" fill="#FB7185" opacity="0.6" />

          {/* Round scientist glasses with cyan reflection */}
          <circle cx="37" cy="50" r="11" fill="none" stroke="#6366F1" strokeWidth="2.5" />
          <circle cx="63" cy="50" r="11" fill="none" stroke="#6366F1" strokeWidth="2.5" />
          <line x1="48" y1="50" x2="52" y2="50" stroke="#6366F1" strokeWidth="2.5" />
          <path d="M 31,44 L 41,54" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" opacity="0.75" />
          <path d="M 57,44 L 67,54" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" opacity="0.75" />

          {/* Eyes depending on mood */}
          {mood === 'worried' ? (
            <>
              <path d="M 33,48 Q 37,53 41,48" stroke="#1E293B" strokeWidth="2" fill="none" strokeLinecap="round" />
              <path d="M 59,48 Q 63,53 67,48" stroke="#1E293B" strokeWidth="2" fill="none" strokeLinecap="round" />
            </>
          ) : mood === 'cheering' || mood === 'happy' ? (
            <>
              <path d="M 32,52 Q 37,45 42,52" stroke="#1E293B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M 58,52 Q 63,45 68,52" stroke="#1E293B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </>
          ) : (
            <>
              <circle cx="37" cy="50" r="3" fill="#0F172A" />
              <circle cx="38" cy="49" r="1" fill="#FFFFFF" />
              <circle cx="63" cy="50" r="3" fill="#0F172A" />
              <circle cx="64" cy="49" r="1" fill="#FFFFFF" />
            </>
          )}

          {/* Cute bushy white mustache */}
          <path
            d="M 38,65 Q 46,63 50,67 Q 54,63 62,65 Q 56,71 50,69 Q 44,71 38,65 Z"
            fill="#FFFFFF"
            stroke="#CBD5E1"
            strokeWidth="1.5"
          />

          {/* Playful tongue out (famous Einstein photo pose!) or smile */}
          {mood === 'cheering' || mood === 'eureka' ? (
            <path
              d="M 47,68 Q 50,78 53,68 Z"
              fill="#F43F5E"
              stroke="#BE123C"
              strokeWidth="1"
            />
          ) : (
            <path
              d="M 46,67 Q 50,71 54,67"
              stroke="#94A3B8"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
            />
          )}

          {/* Spark of genius above head */}
          {(mood === 'eureka' || mood === 'cheering' || mood === 'hint') && (
            <g className="animate-pulse">
              <path d="M 50,4 L 52,10 L 58,11 L 53,15 L 55,21 L 50,17 L 45,21 L 47,15 L 42,11 L 48,10 Z" fill="#FACC15" />
            </g>
          )}

          {/* Scientist lab coat collar & bow tie */}
          <path d="M 36,78 L 50,86 L 64,78 L 50,96 Z" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
          {/* Violet bow tie */}
          <polygon points="46,84 54,84 50,87" fill="#8B5CF6" />
          <polygon points="46,90 54,90 50,87" fill="#8B5CF6" />
          <circle cx="50" cy="87" r="1.5" fill="#C4B5FD" />
        </svg>

        {/* Small badge: عبقور */}
        <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-900 font-heading text-[9px] shadow-md border border-amber-300">
          عبقور 👨‍🔬
        </span>
      </div>

      {/* Speech bubble */}
      {(message || defaultMessages[mood]) && (
        <div className="relative glass-card px-3.5 py-2 rounded-24 border border-violet-500/30 text-xs text-slate-200 shadow-lg max-w-xs animate-fadeIn">
          {/* Arrow */}
          <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-navy-800 border-t border-r border-violet-500/30 rotate-45"></div>
          <p className="font-medium leading-relaxed relative z-10">
            {message || defaultMessages[mood]}
          </p>
        </div>
      )}
    </div>
  );
};

export default AbqoorMascot;

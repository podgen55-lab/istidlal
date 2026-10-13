import React, { useState } from 'react';

export type AbqoorMood = 'idle' | 'happy' | 'cheering' | 'thinking' | 'worried' | 'hint' | 'eureka' | 'playful';

interface AbqoorMascotProps {
  mood?: AbqoorMood;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  message?: string;
  interactive?: boolean;
}

export const AbqoorMascot: React.FC<AbqoorMascotProps> = ({
  mood = 'playful',
  size = 'md',
  className = '',
  message,
  interactive = true,
}) => {
  const [currentMood, setCurrentMood] = useState<AbqoorMood>(mood);
  const [isWiggling, setIsWiggling] = useState(false);
  const [customIndex, setCustomIndex] = useState(0);

  const playfulQuotes = [
    'ههههه! انتبه لفخ التفسير المسبق، لا تخلط شعبان برمضان يا بطل! 😂🧪',
    'E = mc².. ومنهجية البكالوريا = تحليل + استنتاج + دقة الشواهد! ⚡📐',
    'أنا عبقور! الخيال أهم من المعرفة، لكن بلا نص علمي مهيكل تضيع النقطتان! ✍️🎯',
    'سر عبقور الصغير: السلسلة غير الناسخة توأم الـ ARNm إلا في T و U! 🧬😉',
    'يوريكا! أنت تفكر مثل عالم حقيقي الآن! فخور بك يا نابغة! 🏆🚀',
    'ههههه! هل تعلم أن إنزيم ARN بوليمراز لا يأخذ عطلة نهاية الأسبوع؟ يعمل 24/7! ⚙️🔬',
    'ركز يا بطل! استغلال الوثيقة يبدأ دوماً بالتعريف الدقيق بالسند! 🔍💡',
  ];

  const sizeMap = {
    sm: 'w-14 h-14',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-40 h-40',
  };

  const handleClick = () => {
    if (!interactive) return;
    setIsWiggling(true);
    setTimeout(() => setIsWiggling(false), 600);
    setCustomIndex((prev) => (prev + 1) % playfulQuotes.length);

    // Toggle playful moods
    const moods: AbqoorMood[] = ['playful', 'eureka', 'cheering', 'hint'];
    setCurrentMood(moods[Math.floor(Math.random() * moods.length)]);

    // Play subtle audio pop if available
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      }
    } catch {}
  };

  const activeMessage = message || playfulQuotes[customIndex];

  return (
    <div
      onClick={handleClick}
      className={`flex items-center gap-3 select-none cursor-pointer group ${className}`}
      title="انقر على عبقور للمزيد من النصائح المرحة!"
    >
      {/* 3D-feeling Character SVG */}
      <div
        className={`relative ${sizeMap[size]} flex-shrink-0 transition-transform duration-300 ${
          isWiggling ? 'scale-115 rotate-6' : 'hover:scale-105'
        }`}
      >
        {/* Magic aura */}
        <div className="absolute inset-0 bg-gradient-to-tr from-amber-400/40 via-violet-500/30 to-cyan-400/40 rounded-full blur-xl group-hover:blur-2xl transition-all"></div>

        <svg viewBox="0 0 120 120" className="w-full h-full relative z-10 drop-shadow-2xl">
          <defs>
            <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FED7AA" />
              <stop offset="100%" stopColor="#FDBA74" />
            </linearGradient>
            <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#E2E8F0" />
            </linearGradient>
            <linearGradient id="potionGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#22D3EE" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
            <filter id="shadowFilter">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.25" />
            </filter>
          </defs>

          {/* Wild bushy Einstein hair with fluffy tufts */}
          <path
            d="M 22,60 C 10,48 8,30 22,18 C 36,6 60,8 60,8 C 60,8 84,6 98,18 C 112,30 110,48 98,60 C 108,70 102,82 92,86 C 88,88 80,88 74,86 C 46,90 28,88 24,84 C 14,80 12,70 22,60 Z"
            fill="url(#hairGrad)"
            stroke="#CBD5E1"
            strokeWidth="3"
            filter="url(#shadowFilter)"
          />

          {/* Hair strands details */}
          <path d="M 18,34 Q 28,30 38,36" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M 102,34 Q 92,30 82,36" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M 50,14 Q 60,6 70,14" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" fill="none" />

          {/* Face base */}
          <ellipse cx="60" cy="62" rx="30" ry="28" fill="url(#skinGrad)" stroke="#FB923C" strokeWidth="2.5" />

          {/* Rosy blush cheeks */}
          <ellipse cx="38" cy="72" rx="6" ry="4" fill="#FB7185" opacity="0.75" />
          <ellipse cx="82" cy="72" rx="6" ry="4" fill="#FB7185" opacity="0.75" />

          {/* Large Round Quirky Glasses */}
          <circle cx="45" cy="58" r="13" fill="none" stroke="#6366F1" strokeWidth="3" />
          <circle cx="75" cy="58" r="13" fill="none" stroke="#6366F1" strokeWidth="3" />
          <line x1="58" y1="58" x2="62" y2="58" stroke="#6366F1" strokeWidth="3" />
          {/* Glass glare */}
          <path d="M 38,51 L 50,63" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
          <path d="M 68,51 L 80,63" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" opacity="0.8" />

          {/* Eyes: One winking playfully, one wide and excited */}
          {currentMood === 'playful' ? (
            <>
              {/* Right eye: Playful wink! 😉 */}
              <path d="M 39,58 Q 45,63 51,58" stroke="#0F172A" strokeWidth="3" fill="none" strokeLinecap="round" />
              {/* Left eye: Wide curious pupil */}
              <circle cx="75" cy="58" r="4.5" fill="#0F172A" />
              <circle cx="76.5" cy="56.5" r="1.8" fill="#FFFFFF" />
            </>
          ) : currentMood === 'eureka' || currentMood === 'cheering' ? (
            <>
              {/* Happy squint eyes */}
              <path d="M 39,60 Q 45,52 51,60" stroke="#0F172A" strokeWidth="3.5" fill="none" strokeLinecap="round" />
              <path d="M 69,60 Q 75,52 81,60" stroke="#0F172A" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            </>
          ) : (
            <>
              {/* Curious open eyes */}
              <circle cx="45" cy="58" r="4" fill="#0F172A" />
              <circle cx="46" cy="57" r="1.5" fill="#FFFFFF" />
              <circle cx="75" cy="58" r="4" fill="#0F172A" />
              <circle cx="76" cy="57" r="1.5" fill="#FFFFFF" />
            </>
          )}

          {/* Expressive Eyebrows */}
          <path d="M 35,42 Q 45,37 55,43" stroke="#E2E8F0" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <path d="M 65,43 Q 75,37 85,42" stroke="#E2E8F0" strokeWidth="3.5" strokeLinecap="round" fill="none" />

          {/* Cute Bushy White Mustache */}
          <path
            d="M 44,74 C 52,72 58,76 60,78 C 62,76 68,72 76,74 C 70,82 62,80 60,80 C 58,80 50,82 44,74 Z"
            fill="#FFFFFF"
            stroke="#CBD5E1"
            strokeWidth="2"
          />

          {/* Famous Einstein Tongue Stick-Out 👅 */}
          {(currentMood === 'playful' || currentMood === 'cheering' || currentMood === 'eureka') ? (
            <g>
              <ellipse cx="60" cy="83" rx="5" ry="7" fill="#F43F5E" stroke="#BE123C" strokeWidth="1.5" />
              <line x1="60" y1="78" x2="60" y2="85" stroke="#BE123C" strokeWidth="1" />
            </g>
          ) : (
            <path d="M 54,77 Q 60,83 66,77" stroke="#475569" strokeWidth="2" fill="none" strokeLinecap="round" />
          )}

          {/* Scientist Lab Coat & Purple Bow Tie */}
          <path d="M 40,90 L 60,102 L 80,90 L 60,118 Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
          {/* Bow tie */}
          <polygon points="53,96 67,96 60,100" fill="#7C3AED" />
          <polygon points="53,104 67,104 60,100" fill="#7C3AED" />
          <circle cx="60" cy="100" r="2.5" fill="#A78BFA" />

          {/* Test Tube held with glowing green potion 🧪 */}
          <g transform="translate(86, 70) rotate(15)">
            <rect x="0" y="0" width="9" height="24" rx="4.5" fill="#FFFFFF" fillOpacity="0.4" stroke="#94A3B8" strokeWidth="1.5" />
            <rect x="1" y="8" width="7" height="15" rx="3.5" fill="url(#potionGrad)" />
            {/* Liquid bubbles */}
            <circle cx="4.5" cy="12" r="1" fill="#FFFFFF" opacity="0.8" />
            <circle cx="6" cy="17" r="1.2" fill="#FFFFFF" opacity="0.8" />
          </g>

          {/* Golden Spark of Genius above head */}
          <g className="animate-pulse">
            <path
              d="M 60,2 L 62,9 L 69,10 L 63,15 L 65,22 L 60,17 L 55,22 L 57,15 L 51,10 L 58,9 Z"
              fill="#FACC15"
              stroke="#CA8A04"
              strokeWidth="0.8"
            />
          </g>
        </svg>

        {/* Fun Badge */}
        <span className="absolute -bottom-1 -right-2 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-heading text-[10px] shadow-lg border border-amber-300 font-bold animate-bounce">
          عبقور 👨‍🔬
        </span>
      </div>

      {/* Interactive Speech Bubble */}
      <div className="relative glass-card px-4 py-2.5 rounded-24 border border-violet-500/40 text-xs text-slate-100 shadow-xl max-w-sm group-hover:border-amber-400/60 transition-colors">
        {/* Pointer Triangle */}
        <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-navy-800 border-t border-r border-violet-500/40 rotate-45"></div>

        <div className="relative z-10 flex items-start gap-2">
          <p className="font-medium leading-relaxed">
            {activeMessage}
          </p>
        </div>
        <span className="text-[9px] text-amber-300 font-bold block text-left mt-1 opacity-70 group-hover:opacity-100 transition-opacity">
          انقر لمزيد من أسرار عبقور ⚡
        </span>
      </div>
    </div>
  );
};

export default AbqoorMascot;

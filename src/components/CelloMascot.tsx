import React from 'react';

interface CelloMascotProps {
  mood?: 'happy' | 'thinking' | 'cheering' | 'hint' | 'worried';
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const CelloMascot: React.FC<CelloMascotProps> = ({
  mood = 'happy',
  message,
  size = 'md',
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-28 h-28',
  };

  const getFace = () => {
    switch (mood) {
      case 'cheering':
        return {
          eyes: (
            <>
              <path d="M35 45 Q40 40 45 45" stroke="#0B1020" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M55 45 Q60 40 65 45" stroke="#0B1020" strokeWidth="3" fill="none" strokeLinecap="round" />
            </>
          ),
          mouth: <ellipse cx="50" cy="62" rx="10" ry="8" fill="#FB7185" />,
          blush: (
            <>
              <circle cx="30" cy="55" r="5" fill="#FB7185" opacity="0.6" />
              <circle cx="70" cy="55" r="5" fill="#FB7185" opacity="0.6" />
            </>
          )
        };
      case 'thinking':
        return {
          eyes: (
            <>
              <circle cx="40" cy="45" r="4" fill="#0B1020" />
              <circle cx="62" cy="42" r="5" fill="#0B1020" />
            </>
          ),
          mouth: <path d="M44 60 Q50 63 56 60" stroke="#0B1020" strokeWidth="3" fill="none" strokeLinecap="round" />,
          blush: null
        };
      case 'worried':
        return {
          eyes: (
            <>
              <circle cx="38" cy="45" r="4.5" fill="#0B1020" />
              <circle cx="62" cy="45" r="4.5" fill="#0B1020" />
            </>
          ),
          mouth: <path d="M43 64 Q50 56 57 64" stroke="#0B1020" strokeWidth="3" fill="none" strokeLinecap="round" />,
          blush: null
        };
      case 'hint':
      case 'happy':
      default:
        return {
          eyes: (
            <>
              <circle cx="38" cy="45" r="4.5" fill="#0B1020" />
              <circle cx="39.5" cy="43.5" r="1.5" fill="#FFFFFF" />
              <circle cx="62" cy="45" r="4.5" fill="#0B1020" />
              <circle cx="63.5" cy="43.5" r="1.5" fill="#FFFFFF" />
            </>
          ),
          mouth: <path d="M42 56 Q50 68 58 56" stroke="#0B1020" strokeWidth="3.5" fill="#FB7185" strokeLinecap="round" />,
          blush: (
            <>
              <circle cx="30" cy="53" r="4.5" fill="#FB7185" opacity="0.5" />
              <circle cx="70" cy="53" r="4.5" fill="#FB7185" opacity="0.5" />
            </>
          )
        };
    }
  };

  const face = getFace();

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`relative ${sizeMap[size]} flex-shrink-0 animate-bounce`} style={{ animationDuration: '3s' }}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg overflow-visible">
          {/* Cell membrane (Outer glowing gradient) */}
          <defs>
            <linearGradient id="cellGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A3E635" />
              <stop offset="50%" stopColor="#22D3EE" />
              <stop offset="100%" stopColor="#7C3AED" />
            </linearGradient>
            <linearGradient id="nucleusGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>

          {/* Organic Cell Body */}
          <path
            d="M50 8 C72 8 92 26 92 50 C92 74 74 92 50 92 C24 92 8 72 8 50 C8 24 26 8 50 8 Z"
            fill="url(#cellGrad)"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeOpacity="0.4"
          />

          {/* Organelles/ribosomes dots */}
          <circle cx="24" cy="30" r="3" fill="#FFFFFF" opacity="0.6" />
          <circle cx="28" cy="70" r="2.5" fill="#FFFFFF" opacity="0.5" />
          <circle cx="76" cy="32" r="3" fill="#FFFFFF" opacity="0.7" />
          <circle cx="72" cy="72" r="2.5" fill="#FFFFFF" opacity="0.5" />
          <circle cx="50" cy="20" r="2" fill="#FFFFFF" opacity="0.6" />

          {/* Nucleus with Face */}
          <circle cx="50" cy="52" r="28" fill="url(#nucleusGrad)" stroke="#FEF08A" strokeWidth="2" />
          
          {/* Face elements */}
          {face.eyes}
          {face.mouth}
          {face.blush}

          {/* Sparkles if cheering */}
          {mood === 'cheering' && (
            <>
              <text x="80" y="20" fontSize="14">✨</text>
              <text x="5" y="25" fontSize="14">🎉</text>
            </>
          )}
          {mood === 'hint' && (
            <text x="75" y="18" fontSize="14">💡</text>
          )}
        </svg>
      </div>

      {message && (
        <div className="relative glass-card bg-navy-800/90 text-slate-100 px-4 py-2.5 rounded-24 text-xs md:text-sm font-medium border border-violet-500/30 shadow-lg">
          <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 w-0 h-0 border-t-6 border-b-6 border-l-8 border-transparent border-l-navy-800"></div>
          <div className="flex items-center gap-1.5 font-bold text-lime-400 mb-0.5 text-xs">
            <span>سيلّو (Cello) المساعد الذكي:</span>
          </div>
          <div>{message}</div>
        </div>
      )}
    </div>
  );
};

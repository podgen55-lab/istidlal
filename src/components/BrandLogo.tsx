import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
}) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <div className={`flex items-center gap-3 select-none group ${className}`}>
      {/* Precision Emblem */}
      <div className={`relative ${iconSizes[size]} flex-shrink-0 group-hover:scale-105 transition-transform duration-300`}>
        {/* Ambient Glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-violet-600 via-cyan-400 to-lime-400 rounded-2xl blur-md opacity-40 group-hover:opacity-75 transition-opacity"></div>

        {/* Logo Shield Frame */}
        <div className="relative w-full h-full rounded-2xl bg-gradient-to-tr from-[#161B30] to-[#0B1020] border border-violet-500/40 p-1.5 shadow-xl flex items-center justify-center overflow-hidden">
          {/* Background subtle radial grid */}
          <div className="absolute inset-0 bg-[radial-gradient(#7C3AED_1px,transparent_1px)] [background-size:6px_6px] opacity-20"></div>

          {/* Handcrafted Professional Vector SVG Logo */}
          <svg viewBox="0 0 100 100" className="w-full h-full relative z-10" fill="none">
            <defs>
              <linearGradient id="dnaGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#A855F7" />
                <stop offset="50%" stopColor="#6366F1" />
                <stop offset="100%" stopColor="#06B6D4" />
              </linearGradient>
              <linearGradient id="dnaGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#22D3EE" />
                <stop offset="50%" stopColor="#A3E635" />
                <stop offset="100%" stopColor="#FACC15" />
              </linearGradient>
              <linearGradient id="ringGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {/* Atomic Orbital Ring (Angled Ellipse) */}
            <ellipse
              cx="50"
              cy="50"
              rx="40"
              ry="16"
              transform="rotate(-28 50 50)"
              stroke="url(#ringGrad)"
              strokeWidth="2.2"
              strokeDasharray="4 3"
              opacity="0.85"
            />

            {/* DNA Helix Primary Strand (Flowing S-Curve) */}
            <path
              d="M 28,18 C 38,28 62,38 72,50 C 82,62 58,74 38,82"
              stroke="url(#dnaGrad1)"
              strokeWidth="5"
              strokeLinecap="round"
            />

            {/* DNA Helix Secondary Strand (Intersecting Counter-Curve) */}
            <path
              d="M 72,18 C 62,28 38,38 28,50 C 18,62 42,74 62,82"
              stroke="url(#dnaGrad2)"
              strokeWidth="5"
              strokeLinecap="round"
            />

            {/* Molecular Hydrogen Rungs */}
            <line x1="33" y1="28" x2="67" y2="28" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
            <line x1="42" y1="42" x2="58" y2="42" stroke="#E2E8F0" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="50" y1="50" x2="50" y2="50" stroke="#FACC15" strokeWidth="5" strokeLinecap="round" />
            <line x1="42" y1="58" x2="58" y2="58" stroke="#E2E8F0" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="33" y1="72" x2="67" y2="72" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" opacity="0.9" />

            {/* Electron / Nucleotide Nodes */}
            <circle cx="28" cy="18" r="3.5" fill="#C084FC" />
            <circle cx="72" cy="18" r="3.5" fill="#38BDF8" />
            <circle cx="72" cy="50" r="3.5" fill="#A3E635" />
            <circle cx="28" cy="50" r="3.5" fill="#FACC15" />
            <circle cx="38" cy="82" r="3.5" fill="#38BDF8" />
            <circle cx="62" cy="82" r="3.5" fill="#4ADE80" />

            {/* Center Core Spark of Genius */}
            <polygon
              points="50,44 52,48 56,50 52,52 50,56 48,52 44,50 48,48"
              fill="#FFFFFF"
            />
          </svg>
        </div>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col text-right">
          <div className="flex items-baseline gap-2">
            <span className={`${textSizes[size]} font-heading tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-cyan-300 to-lime-400`}>
              استدلال
            </span>
            <span className="text-[10px] md:text-xs font-mono font-bold tracking-widest text-slate-400 uppercase">
              ISTIDLAL
            </span>
          </div>
          <span className="text-[9px] md:text-[10px] text-amber-300 -mt-0.5 font-bold hidden sm:block">
            المنهاج وإعداد المحتوى: الأستاذ عبد الرحيم فنكوح (by ABDERRAHIM FENKOUH)
          </span>
        </div>
      )}
    </div>
  );
};

export default BrandLogo;

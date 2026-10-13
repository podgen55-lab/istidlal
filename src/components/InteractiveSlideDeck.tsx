import React, { useState } from 'react';
import { SlideItem } from '../data/istidlal_curriculum_data';
import { AbqoorMascot } from './AbqoorMascot';
import { ChevronRight, ChevronLeft, Sparkles, BookOpen, AlertTriangle, Maximize2, Minimize2, CheckCircle2 } from 'lucide-react';

interface InteractiveSlideDeckProps {
  slides: SlideItem[];
  lessonTitle: string;
}

export const InteractiveSlideDeck: React.FC<InteractiveSlideDeckProps> = ({
  slides,
  lessonTitle,
}) => {
  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const currentSlide = slides[currentSlideIdx];

  const handleNext = () => {
    if (currentSlideIdx + 1 < slides.length) {
      setCurrentSlideIdx(currentSlideIdx + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlideIdx > 0) {
      setCurrentSlideIdx(currentSlideIdx - 1);
    }
  };

  return (
    <div
      className={`glass-card rounded-32 border border-violet-500/40 p-5 sm:p-7 shadow-2xl transition-all duration-300 relative overflow-hidden ${
        isFullscreen ? 'fixed inset-4 z-50 bg-[#0B1020]/95 backdrop-blur-xl flex flex-col justify-between' : 'bg-gradient-to-br from-navy-900/90 via-navy-950/95 to-[#0B1020]'
      }`}
      dir="rtl"
    >
      {/* Top Slide Header & Progress Dots */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-navy-800 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-violet-600/30 text-violet-300 border border-violet-500/30 text-xs font-bold font-mono">
              {currentSlide.badge}
            </span>
            <span className="text-xs text-slate-400">• {lessonTitle}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-heading text-slate-100 flex items-center gap-2">
            <span>{currentSlide.icon}</span>
            <span>{currentSlide.title}</span>
          </h2>
          {currentSlide.frenchTitle && (
            <p className="text-xs text-cyan-400 font-mono italic">
              {currentSlide.frenchTitle}
            </p>
          )}
        </div>

        {/* Progress & Fullscreen */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlideIdx(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  idx === currentSlideIdx
                    ? 'w-8 bg-gradient-to-r from-amber-400 to-cyan-400'
                    : 'w-2.5 bg-navy-700 hover:bg-navy-600'
                }`}
                title={`الانتقال للسلايد ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="w-9 h-9 rounded-20 bg-navy-800 hover:bg-navy-700 text-slate-300 flex items-center justify-center transition-colors"
            title={isFullscreen ? 'تصغير' : 'ملء الشاشة'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Slide Body Content */}
      <div className="py-6 space-y-6 flex-1 overflow-y-auto">
        {/* Problematic Question Banner if present */}
        {currentSlide.problematic && (
          <div className="p-4 rounded-24 bg-gradient-to-r from-violet-950/60 to-navy-950 border border-violet-500/40 flex items-start gap-3 shadow-lg">
            <span className="text-2xl flex-shrink-0">❓</span>
            <div>
              <strong className="text-xs text-violet-300 block mb-0.5">الإشكالية العلمية المحورية:</strong>
              <p className="text-sm font-medium text-slate-100 leading-relaxed">
                {currentSlide.problematic}
              </p>
            </div>
          </div>
        )}

        {/* Bullet Points */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentSlide.content.map((point, idx) => (
            <div
              key={idx}
              className="p-4 rounded-24 bg-navy-950/70 border border-navy-800/80 hover:border-violet-500/40 transition-colors flex items-start gap-3 shadow-md"
            >
              <span className="w-6 h-6 rounded-full bg-violet-600/20 text-violet-300 border border-violet-500/30 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {point}
              </p>
            </div>
          ))}
        </div>

        {/* Key Bilingual Scientific Terms if present */}
        {currentSlide.keyTerms && currentSlide.keyTerms.length > 0 && (
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-cyan-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>المصطلحات الدقيقة ثنائية اللغة (عربي / فرنسي):</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {currentSlide.keyTerms.map((term, i) => (
                <div key={i} className="p-3.5 rounded-20 bg-navy-950/90 border border-cyan-500/20 space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-100">{term.ar}</span>
                    <span className="text-[10px] text-cyan-300 font-mono italic">{term.fr}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight">{term.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Methodology Rules / Traps if present */}
        {currentSlide.methodologyTips && currentSlide.methodologyTips.length > 0 && (
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-amber-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span>قواعد الأستاذ عبد الرحيم فنكوح لتجنب أفخاخ البكالوريا:</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentSlide.methodologyTips.map((tip, i) => (
                <div key={i} className="p-3.5 rounded-20 bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200 leading-relaxed flex items-start gap-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Slide Navigation Controls */}
      <div className="pt-4 border-t border-navy-800 flex items-center justify-between gap-4">
        <button
          disabled={currentSlideIdx === 0}
          onClick={handlePrev}
          className="px-5 py-2.5 rounded-24 bg-navy-800 hover:bg-navy-700 text-slate-200 text-xs font-bold disabled:opacity-40 transition-colors flex items-center gap-2"
        >
          <ChevronRight className="w-4 h-4" />
          <span>السلايد السابق</span>
        </button>

        <div className="text-xs font-mono font-bold text-slate-400">
          السلايد {currentSlideIdx + 1} من {slides.length}
        </div>

        <button
          disabled={currentSlideIdx === slides.length - 1}
          onClick={handleNext}
          className="px-6 py-2.5 rounded-24 bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-90 text-white text-xs font-bold disabled:opacity-40 transition-all flex items-center gap-2 shadow-lg shadow-violet-600/20"
        >
          <span>السلايد التالي</span>
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default InteractiveSlideDeck;

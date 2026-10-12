/**
 * ==============================================================================
 * DocumentStudio.jsx - عارض السندات والوثائق البيولوجية الحقيقية عالي الدقة
 * ==============================================================================
 * يلتزم بالحظر التام للرسومات الاصطناعية (Strict Ban on Fake SVGs)
 * ويعتمد على وسوم <img> الحقيقية مع أدوات التكبير والشاشة الكاملة وتبديل الأشكال (الشكل أ / ب).
 */

import React, { useState } from 'react';

export function DocumentStudio({
  documentImage = null,
  activeFigure = 'fig_a',
  onFigureChange = () => {},
  onImageUpload = () => {},
  onOpenFullscreen = () => {},
}) {
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 3.5));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.75));
  const handleResetZoom = () => setZoomLevel(1);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#070b14] overflow-hidden relative">
      {/* شريط أدوات عارض الوثيقة */}
      <div className="h-12 border-b border-slate-800 px-4 flex items-center justify-between bg-slate-900/80 backdrop-blur-sm shrink-0">
        {/* تبويبات الأشكال (الشكل أ / الشكل ب) */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-slate-400 ml-2 hidden sm:inline">السند:</span>
          <button
            onClick={() => onFigureChange('fig_a')}
            className={`text-xs font-bold px-3 py-1 rounded-lg transition ${
              activeFigure === 'fig_a'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            الشكل (أ): مجهر إلكتروني
          </button>
          <button
            onClick={() => onFigureChange('fig_b')}
            className={`text-xs font-bold px-3 py-1 rounded-lg transition ${
              activeFigure === 'fig_b'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            الشكل (ب): منحنى كمي
          </button>
        </div>

        {/* أزرار التكبير والمعاينة الكاملة */}
        <div className="flex items-center gap-1 bg-slate-800/90 rounded-lg p-0.5 border border-slate-700">
          <button
            onClick={handleZoomOut}
            title="تصغير"
            className="p-1.5 hover:bg-slate-700 text-slate-300 rounded transition"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM7 10h6" />
            </svg>
          </button>
          <span className="text-[11px] font-mono font-bold px-1.5 text-slate-300 min-w-[42px] text-center">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            title="تكبير"
            className="p-1.5 hover:bg-slate-700 text-slate-300 rounded transition"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
            </svg>
          </button>
          <button
            onClick={handleResetZoom}
            title="إعادة ضبط 100%"
            className="p-1.5 hover:bg-slate-700 text-slate-300 rounded transition border-r border-slate-700 mr-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button
            onClick={onOpenFullscreen}
            title="معاينة شاشة كاملة"
            className="p-1.5 hover:bg-slate-700 text-emerald-400 rounded transition"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
        </div>
      </div>

      {/* مساحة عرض الصورة الحقيقية */}
      <div className="flex-1 overflow-auto p-4 md:p-6 flex items-center justify-center bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px]">
        <div
          className="transition-transform duration-200 ease-out origin-center flex flex-col items-center max-w-full"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {documentImage ? (
            <div className="relative group rounded-2xl overflow-hidden border border-slate-700 shadow-2xl bg-black max-w-full">
              <img
                src={documentImage}
                alt="وثيقة بيولوجية حقيقية"
                className="max-h-[62vh] object-contain rounded-xl select-none"
                draggable="false"
              />
              <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md text-[11px] text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-800/80 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>وثيقة أصلية ميكروغرافية</span>
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-slate-700/80 rounded-3xl p-8 max-w-lg text-center bg-slate-900/60 backdrop-blur-md shadow-2xl">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center text-emerald-400 shadow-inner">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>

              <div className="inline-flex items-center gap-1.5 bg-emerald-950/80 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full border border-emerald-800/80 mb-3">
                <span>🛡️</span>
                <span>حظر تام للرسومات الاصطناعية (Strict Ban on Fake SVGs)</span>
              </div>

              <h3 className="font-black text-base text-slate-100 mb-2">حاوية الوثيقة البيولوجية الحقيقية جاهزة</h3>
              <p className="text-xs text-slate-400 mb-5 leading-relaxed">
                يعتمد التدريب حصراً على الميكروغرافات الحقيقية والمنحنيات المقاسة تجريبياً. الحاوية مهيأة لاستقبال صور أول درس فور تزويد المنصة بها.
              </p>

              <label className="cursor-pointer inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs py-2.5 px-5 rounded-xl transition shadow-lg shadow-emerald-950">
                <span>معاينة رفع صورة تجريبية</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onImageUpload}
                />
              </label>
            </div>
          )}
        </div>
      </div>

      {/* شريط الإسناد والشروط التجريبية */}
      <div className="p-3 bg-slate-900/95 border-t border-slate-800 text-xs flex items-center justify-between text-slate-400 shrink-0">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-200">الوثيقة 1:</span>
          <span>صورة بالمجهر الإلكتروني لظاهرة الاستنساخ عند حقيقيات النوى.</span>
        </div>
        <span className="text-[11px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
          تكبير: ×35,000
        </span>
      </div>
    </div>
  );
}

export default DocumentStudio;

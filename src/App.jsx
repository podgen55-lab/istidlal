import React, { useState } from 'react';
import Header from './components/Header';
import DocumentStudio from './components/DocumentStudio';
import SocraticTutor from './components/SocraticTutor';
import Navigation from './components/Navigation';
import { useGamification } from './hooks/useGamification';

export function App() {
  const [activeTab, setActiveTab] = useState('path');
  const [currentStage, setCurrentStage] = useState(1);
  const [splitRatio, setSplitRatio] = useState('split');
  const [activeFigure, setActiveFigure] = useState('fig_a');
  const [documentImage, setDocumentImage] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [checkpointPassed, setCheckpointPassed] = useState(false);

  const { state: gamification, addXP, deductHeart } = useGamification();

  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setDocumentImage(url);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100 font-sans pb-16 md:pb-0" dir="rtl">
      {/* 1. Header HUD */}
      <Header
        streak={gamification.streak}
        hearts={gamification.hearts}
        xp={gamification.xp}
        splitRatio={splitRatio}
        onSplitRatioChange={setSplitRatio}
      />

      {/* 2. Main Dual Layout */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {activeTab === 'path' && (
          <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden">
            {/* Right column: Document Studio */}
            <section
              className={`border-b md:border-b-0 md:border-l border-slate-800 bg-[#070b14] flex flex-col transition-all duration-300 ${
                splitRatio === 'doc_focus'
                  ? 'w-full md:w-8/12 lg:w-8/12'
                  : splitRatio === 'tutor_focus'
                  ? 'w-full md:w-4/12 lg:w-4/12'
                  : 'w-full md:w-1/2 lg:w-7/12'
              }`}
            >
              <DocumentStudio
                documentImage={documentImage}
                activeFigure={activeFigure}
                onFigureChange={setActiveFigure}
                onImageUpload={handleImageUpload}
                onOpenFullscreen={() => setIsFullscreen(true)}
              />
            </section>

            {/* Left column: Socratic Tutor Engine */}
            <section className="flex-1 bg-[#090d16] flex flex-col overflow-y-auto">
              <SocraticTutor
                currentStage={currentStage}
                onStageChange={setCurrentStage}
                checkpointPassed={checkpointPassed}
                onCheckpointSuccess={() => {
                  setCheckpointPassed(true);
                  addXP(20);
                }}
                onCheckpointMistake={() => {
                  setCheckpointPassed(false);
                  deductHeart(1);
                }}
              />
            </section>
          </div>
        )}

        {/* Other Sections */}
        {activeTab === 'academy' && (
          <div className="p-8 max-w-4xl mx-auto space-y-4">
            <h2 className="text-2xl font-black text-white">الأكاديمية (The Academy)</h2>
            <p className="text-xs text-slate-400">مرجع المنهجية الرسمية وفق دليل أكتوبر 2017 وملحقاته</p>
          </div>
        )}
        {activeTab === 'arena' && (
          <div className="p-8 max-w-4xl mx-auto space-y-4">
            <h2 className="text-2xl font-black text-white">الحلبة (The Arena)</h2>
            <p className="text-xs text-slate-400">تحديات السرعة، كاشف الفخاخ (Trap Busters)، والمحاكاة الامتحانية</p>
          </div>
        )}
        {activeTab === 'inspector' && (
          <div className="p-8 max-w-4xl mx-auto space-y-4">
            <h2 className="text-2xl font-black text-white">المفتش (The Inspector)</h2>
            <p className="text-xs text-slate-400">رادار الكفاءات وعيادة معالجة الأخطاء المنهجية المتكررة</p>
          </div>
        )}
        {activeTab === 'profile' && (
          <div className="p-8 max-w-4xl mx-auto space-y-4">
            <h2 className="text-2xl font-black text-white">حسابي (Profile)</h2>
            <p className="text-xs text-slate-400">لوحة التحكم الشخصية وإحصائيات الاستعداد للبكالوريا</p>
          </div>
        )}
      </main>

      {/* 3. Persistent 5-Tab Navigation */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 4. Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col">
          <div className="h-14 border-b border-slate-800 px-6 flex items-center justify-between bg-slate-900/90">
            <span className="text-xs font-bold text-slate-200">معاينة موسعة عالية الدقة للوثيقة</span>
            <button
              onClick={() => setIsFullscreen(false)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-1.5 rounded-xl text-xs font-bold transition"
            >
              إغلاق (Esc)
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center p-6 overflow-auto">
            {documentImage ? (
              <img src={documentImage} alt="سند مكبر" className="max-h-full max-w-full object-contain" />
            ) : (
              <div className="text-slate-400 text-sm">لا توجد صورة محملة حالياً.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

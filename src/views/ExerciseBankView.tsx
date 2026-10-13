import React, { useState } from 'react';
import { BAC_EXERCISES_24, BacExercise, ExerciseCategory } from '../data/bacExerciseBank';
import { TriModalSubmissionHub } from '../components/TriModalSubmissionHub';
import { MethodologyTimer } from '../components/MethodologyTimer';
import { GraderMemoryTracker } from '../components/GraderMemoryTracker';
import { AbqoorMascot } from '../components/AbqoorMascot';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Award,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  FileText,
  Sparkles,
  Layers,
  ArrowRight,
  Dna,
} from 'lucide-react';

interface ExerciseBankViewProps {
  onAddXP?: (amount: number) => void;
  onOpenAgentTeam: () => void;
}

export const ExerciseBankView: React.FC<ExerciseBankViewProps> = ({
  onAddXP,
  onOpenAgentTeam,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | ExerciseCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUnit, setSelectedUnit] = useState<string>('ALL');
  const [activeExercise, setActiveExercise] = useState<BacExercise | null>(null);
  const [showModelAnswer, setShowModelAnswer] = useState(false);

  const filteredExercises = BAC_EXERCISES_24.filter((ex) => {
    const matchesCat = selectedCategory === 'ALL' || ex.category === selectedCategory;
    const matchesUnit = selectedUnit === 'ALL' || ex.unit === selectedUnit;
    const matchesSearch =
      searchQuery.trim() === '' ||
      ex.title.includes(searchQuery) ||
      ex.context.includes(searchQuery) ||
      ex.unit.includes(searchQuery);
    return matchesCat && matchesUnit && matchesSearch;
  });

  const uniqueUnits = Array.from(new Set(BAC_EXERCISES_24.map((e) => e.unit)));

  const countAll = BAC_EXERCISES_24.length;
  const countRecall = BAC_EXERCISES_24.filter((e) => e.category === 'RECALL_5').length;
  const countReasoning = BAC_EXERCISES_24.filter((e) => e.category === 'REASONING_7').length;
  const countInquiry = BAC_EXERCISES_24.filter((e) => e.category === 'INQUIRY_8').length;

  // If student opened a specific exercise
  if (activeExercise) {
    const timerType =
      activeExercise.category === 'RECALL_5'
        ? 'lesson'
        : activeExercise.category === 'REASONING_7'
        ? 'reasoning'
        : 'scientific';

    return (
      <div className="space-y-6 pb-20 md:pb-8 animate-fadeIn" dir="rtl">
        {/* Top Breadcrumb & Navigation */}
        <div className="glass-card rounded-24 p-5 border border-navy-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setActiveExercise(null);
                setShowModelAnswer(false);
              }}
              className="w-10 h-10 rounded-24 bg-navy-800 hover:bg-navy-700 text-slate-300 flex items-center justify-center transition-colors"
              title="العودة لبنك التمارين"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-violet-400">
                <span>تمرين #{activeExercise.number}</span>
                <span>•</span>
                <span>{activeExercise.unit}</span>
                <span>•</span>
                <span className="text-amber-300">{activeExercise.categoryLabel} ({activeExercise.points} ن)</span>
              </div>
              <h1 className="text-xl md:text-2xl font-heading text-slate-100">
                {activeExercise.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-cyan-400 px-3 py-1.5 rounded-full bg-cyan-400/10 border border-cyan-400/20 flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>المدة المقترحة: {activeExercise.durationMinutes} دقيقة</span>
            </span>
          </div>
        </div>

        {/* Methodology Timer for this exercise */}
        <MethodologyTimer initialType={timerType} />

        {/* Exercise Subject Card */}
        <div className="glass-card rounded-32 p-6 md:p-8 border border-navy-700/60 space-y-6">
          {/* Scientific Context */}
          <div className="p-4 rounded-24 bg-navy-950/70 border border-navy-800 space-y-2">
            <span className="text-xs font-bold text-violet-400 block">السياق العلمي والمشكل المطروح:</span>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {activeExercise.context}
            </p>
            <p className="text-xs sm:text-sm font-bold text-amber-300 leading-relaxed pt-1">
              المشكل العلمي: {activeExercise.problematic}
            </p>
          </div>

          {/* Documents Slices */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>السندات والوثائق المرفقة:</span>
            </h3>

            <div className="grid grid-cols-1 gap-4">
              {activeExercise.documents.map((doc, idx) => (
                <div key={idx} className="p-5 rounded-24 bg-navy-950/80 border border-navy-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs sm:text-sm font-bold text-cyan-300">{doc.title}</h4>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      {doc.dataType}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">{doc.description}</p>
                  <div className="p-3 rounded-16 bg-navy-900/60 border border-navy-800/80 text-xs font-mono text-slate-300">
                    📊 معطيات السند: {doc.dataSnippet}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-lime-400" />
              <span>التعليمات والمهام المطلوبة:</span>
            </h3>
            <div className="space-y-2">
              {activeExercise.questions.map((q, qIdx) => (
                <div key={qIdx} className="p-3.5 rounded-20 bg-violet-950/20 border border-violet-500/30 text-xs sm:text-sm text-slate-200 font-medium">
                  {q}
                </div>
              ))}
            </div>
          </div>

          {/* Abqoor Tip Box */}
          <div className="p-4 rounded-24 bg-amber-500/10 border border-amber-500/30 flex items-center gap-4">
            <AbqoorMascot mood="hint" size="sm" />
            <div className="text-xs">
              <strong className="text-amber-300 block mb-0.5">سر عبقور لهذا التمرين:</strong>
              <p className="text-slate-300">{activeExercise.abqoorTip}</p>
            </div>
          </div>
        </div>

        {/* Grader Memory Tracker */}
        <GraderMemoryTracker />

        {/* Tri-Modal Submission Hub (Camera, Voice, Text) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-heading text-slate-100 flex items-center gap-2">
              <span>محرر الإنجاز والتصحيح الآلي بوكلاء Google AI</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-lime-400/20 text-lime-400 font-mono font-bold">
                {activeExercise.points} / {activeExercise.points} ن
              </span>
            </h3>
          </div>

          <TriModalSubmissionHub
            exerciseTitle={activeExercise.title}
            rubricItems={activeExercise.rubricItems.map((r) => `${r.criterion} (${r.points.toFixed(2)} ن)`)}
            onSubmissionGraded={(score, max) => {
              onAddXP?.(Math.round((score / max) * 90));
            }}
          />
        </div>

        {/* Official Marking Rubric & Model Answer Drawer */}
        <div className="glass-card rounded-24 p-6 border border-navy-700/60 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="font-heading text-sm text-slate-200 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>شبكة التنقيط والحل الوزاري النموذجي (إعداد فنكوح عبدالرحيم)</span>
              </h4>
              <p className="text-[11px] text-slate-400">
                مطابقة تفصيلية لعناصر الإجابة وسلم العلامات المجزأ
              </p>
            </div>
            <button
              onClick={() => setShowModelAnswer(!showModelAnswer)}
              className="px-4 py-2 rounded-24 bg-navy-800 hover:bg-navy-700 text-cyan-400 text-xs font-bold border border-cyan-500/30 transition-colors whitespace-nowrap"
            >
              {showModelAnswer ? 'إخفاء شبكة التنقيط والحل' : 'عرض شبكة التنقيط والحل النموذجي'}
            </button>
          </div>

          {showModelAnswer && (
            <div className="space-y-4 pt-2 animate-fadeIn">
              {/* Detailed Rubric Table */}
              <div className="overflow-x-auto no-scrollbar rounded-20 border border-navy-800">
                <table className="w-full text-right text-xs">
                  <thead className="bg-navy-950 text-slate-400 font-bold border-b border-navy-800">
                    <tr>
                      <th className="p-3">المعيار المنهجي والخطوة الإجرائية</th>
                      <th className="p-3">العلامة</th>
                      <th className="p-3">التوجيه الوزاري الصارم</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-800/60 bg-navy-950/40 text-slate-200">
                    {activeExercise.rubricItems.map((r, i) => (
                      <tr key={i} className="hover:bg-navy-900/40">
                        <td className="p-3 font-medium">{r.criterion}</td>
                        <td className="p-3 font-mono font-bold text-lime-400">{r.points.toFixed(2)} ن</td>
                        <td className="p-3 text-slate-400">{r.explanation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Full Written Model Answer */}
              <div className="p-5 rounded-24 bg-emerald-950/20 border border-emerald-500/30 space-y-2 text-xs sm:text-sm text-slate-200 leading-relaxed">
                <span className="font-bold text-emerald-400 block">نص الإجابة النموذجية المعتمدة:</span>
                <div className="whitespace-pre-wrap">{activeExercise.modelAnswer}</div>
              </div>

              {/* Bilingual Terminology */}
              <div className="p-4 rounded-20 bg-navy-950 border border-navy-800 flex flex-wrap gap-2 items-center text-xs">
                <span className="text-slate-400 font-bold">المصطلحات بالفرنسية:</span>
                {activeExercise.keyFrenchTerms.map((term, tIdx) => (
                  <span key={tIdx} className="px-2.5 py-1 rounded-12 bg-navy-900 text-cyan-300 font-mono text-[11px] border border-navy-800">
                    {term.ar} : <em>{term.fr}</em>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Otherwise render Bank Directory & Filters
  return (
    <div className="space-y-6 pb-20 md:pb-8 animate-fadeIn" dir="rtl">
      {/* Top Banner */}
      <div className="glass-card rounded-32 p-6 md:p-8 bg-gradient-to-r from-violet-950/40 via-navy-900/90 to-navy-950 border border-violet-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2 text-center md:text-right">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-lime-400/10 border border-lime-400/30 text-lime-400 text-xs font-bold">
            <span>🎯 بنك الكفاءات المعتمد • إعداد فنكوح عبدالرحيم</span>
            <span>•</span>
            <span className="font-mono text-amber-300">24 تمريناً رسمياً</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading text-slate-100">
            بنك التمارين والمساعي العلمية (24 تمريناً)
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            تمت تصفية وتجريد كافة التمارين من العلامات المائية وأسماء المؤسسات الخارجية، وتصنيفها وفق المعايير الوزارية (استرجاع منظم، استدلال علمي، ومسعى تجريبي مع شبكات التنقيط المفصلة).
          </p>
        </div>

        <div className="flex-shrink-0">
          <AbqoorMascot mood="cheering" size="md" message="24 تمريناً نموذجياً كفيلة بنيل 20/20 في العلوم! انطلق الآن! 🚀" />
        </div>
      </div>

      {/* Filter Tabs: الكل (24)، استرجاع (5 ن)، استدلال (7 ن)، مسعى علمي (8 ن) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card rounded-24 p-4 border border-navy-800 bg-navy-950/70">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-4 py-2 rounded-20 text-xs font-bold transition-all whitespace-nowrap ${
              selectedCategory === 'ALL'
                ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-lg shadow-violet-600/30'
                : 'bg-navy-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            الكل ({countAll})
          </button>

          <button
            onClick={() => setSelectedCategory('RECALL_5')}
            className={`px-4 py-2 rounded-20 text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              selectedCategory === 'RECALL_5'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-navy-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>استرجاع (5 ن)</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-500/20 text-blue-300 font-mono">({countRecall})</span>
          </button>

          <button
            onClick={() => setSelectedCategory('REASONING_7')}
            className={`px-4 py-2 rounded-20 text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              selectedCategory === 'REASONING_7'
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                : 'bg-navy-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>استدلال (7 ن)</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 font-mono">({countReasoning})</span>
          </button>

          <button
            onClick={() => setSelectedCategory('INQUIRY_8')}
            className={`px-4 py-2 rounded-20 text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              selectedCategory === 'INQUIRY_8'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                : 'bg-navy-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>مسعى علمي (8 ن)</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 font-mono">({countInquiry})</span>
          </button>
        </div>

        {/* Search & Unit Filter */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث في التمارين أو المفاهيم..."
              className="w-full bg-navy-900 border border-navy-700 rounded-20 pr-9 pl-4 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-violet-500"
            />
          </div>

          <select
            value={selectedUnit}
            onChange={(e) => setSelectedUnit(e.target.value)}
            className="bg-navy-900 border border-navy-700 rounded-20 px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-violet-500"
          >
            <option value="ALL">جميع الوحدات</option>
            {uniqueUnits.map((u, i) => (
              <option key={i} value={u}>{u}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of Exercises */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredExercises.map((ex) => {
          const badgeColor =
            ex.category === 'RECALL_5'
              ? 'bg-blue-500/10 border-blue-500/30 text-blue-300'
              : ex.category === 'REASONING_7'
              ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
              : 'bg-amber-500/10 border-amber-500/30 text-amber-300';

          return (
            <div
              key={ex.id}
              onClick={() => setActiveExercise(ex)}
              className="glass-card rounded-28 p-5 border border-navy-700/60 hover:border-violet-500/60 transition-all cursor-pointer flex flex-col justify-between space-y-4 group hover:scale-[1.02] shadow-lg"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${badgeColor}`}>
                    {ex.categoryLabel} ({ex.points} ن)
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{ex.durationMinutes} د</span>
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-violet-400 block mb-0.5">
                    تمرين #{ex.number} • {ex.unit}
                  </span>
                  <h3 className="text-sm font-bold text-slate-100 group-hover:text-cyan-300 transition-colors line-clamp-2">
                    {ex.title}
                  </h3>
                </div>

                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {ex.context}
                </p>
              </div>

              <div className="pt-3 border-t border-navy-800/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {ex.documents.length} سندات • {ex.questions.length} مهام
                </span>
                <span className="text-xs font-bold text-cyan-400 flex items-center gap-1 group-hover:translate-x-[-4px] transition-transform">
                  <span>فتح التمرين</span>
                  <ChevronLeft className="w-4 h-4" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredExercises.length === 0 && (
        <div className="p-12 text-center text-slate-400 text-xs glass-card rounded-28 border border-navy-800">
          لم يتم العثور على تمارين مطابقة لبحثك. جرب تغيير كلمة البحث أو فئة التمرين.
        </div>
      )}
    </div>
  );
};

export default ExerciseBankView;

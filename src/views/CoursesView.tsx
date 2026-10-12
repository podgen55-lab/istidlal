import React, { useState } from 'react';
import { DOMAINS_SEED, TRANSCRIPTION_LESSON } from '../data/mockData';
import { Lesson } from '../types';
import { CelloMascot } from '../components/CelloMascot';
import {
  BookOpen,
  CheckCircle2,
  Lock,
  Play,
  RotateCw,
  FileText,
  Video,
  Headphones,
  Layers,
  HelpCircle,
  Clock,
  Sparkles,
  ArrowRight,
  Send,
  Volume2,
  Bookmark,
  Share2,
} from 'lucide-react';

interface CoursesViewProps {
  onOpenAgentTeam: () => void;
}

export const CoursesView: React.FC<CoursesViewProps> = ({ onOpenAgentTeam }) => {
  const [selectedDomainId, setSelectedDomainId] = useState('domain1');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(TRANSCRIPTION_LESSON);
  const [lessonTab, setLessonTab] = useState<'summary' | 'video' | 'podcast' | 'flashcards' | 'exercise' | 'tutor'>('summary');
  
  // Flashcard flip states
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Video notes
  const [notes, setNotes] = useState<{ time: string; text: string }[]>([
    { time: '01:25', text: 'إنزيم ARN بوليمراز يمتلك موقعاً فعالاً لقراءة السلسلة الناسخة حصراً.' },
    { time: '03:40', text: 'مرحلة الاستطالة: يتم بناء الـ ARNm في الاتجاه 5\' إلى 3\'.' }
  ]);
  const [newNoteText, setNewNoteText] = useState('');

  // Podcast states
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [sleepTimer, setSleepTimer] = useState<number | null>(null);

  // Exercise submission
  const [studentAnswer, setStudentAnswer] = useState('');
  const [showModelAnswer, setShowModelAnswer] = useState(false);

  // Tutor questions
  const [tutorQuery, setTutorQuery] = useState('');
  const [tutorReply, setTutorReply] = useState<string | null>(null);
  const [isTutorLoading, setIsTutorLoading] = useState(false);

  const activeDomain = DOMAINS_SEED.find((d) => d.id === selectedDomainId) || DOMAINS_SEED[0];

  const handleTutorAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tutorQuery.trim()) return;

    setIsTutorLoading(true);
    try {
      const res = await fetch('/api/gemini/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `[استفسار تلميذ في درس آلية الاستنساخ]: ${tutorQuery}`
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.text) {
          setTutorReply(data.text);
          setIsTutorLoading(false);
          return;
        }
      }
    } catch {}

    // Fallback
    setTimeout(() => {
      setTutorReply(`✅ إجابة المرشد 🧭:
في آلية الاستنساخ، تذكر دائماً السلسلة السببية:
1. ارتباط إنزيم ARN بوليمراز بموقع البداية يفك التحام سلسلتي الـ ADN.
2. اتجاه حركة الإنزيم على السلسلة الناسخة هو حصراً من '3 إلى '5.
3. اتجاه بناء جزيئة الـ ARNm هو من '5 إلى '3 وفق تكامل القواعد الآزوتية (A مع U و C مع G).`);
      setIsTutorLoading(false);
    }, 600);
  };

  // If viewing detailed lesson
  if (activeLesson) {
    const res = activeLesson.resources!;
    return (
      <div className="space-y-6 pb-20 md:pb-8 animate-fadeIn">
        {/* Lesson Breadcrumb & Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card rounded-24 p-5 border border-navy-700/80">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveLesson(null)}
              className="w-10 h-10 rounded-24 bg-navy-800 hover:bg-navy-700 text-slate-300 flex items-center justify-center transition-colors"
              title="العودة لمسار الدروس"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-violet-400">
                <span>المجال 1: التخصص الوظيفي للبروتينات</span>
                <span>•</span>
                <span>الوحدة 1</span>
              </div>
              <h1 className="text-xl md:text-2xl font-heading text-slate-100 flex items-center gap-2">
                {activeLesson.title}
                <span className="text-xs font-normal text-slate-400 font-mono italic">
                  ({activeLesson.french})
                </span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-lime-400 px-3 py-1.5 rounded-full bg-lime-400/10 border border-lime-400/20 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>مكتمل (95/100)</span>
            </span>
          </div>
        </div>

        {/* Lesson Tabs Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar p-1.5 glass-card rounded-24 border border-navy-800 bg-navy-950/60">
          {[
            { id: 'summary', label: 'ملخص الدرس', icon: FileText },
            { id: 'video', label: 'فيديو وشروحات', icon: Video },
            { id: 'podcast', label: 'بودكاست صوتي', icon: Headphones },
            { id: 'flashcards', label: 'بطاقات المراجعة', icon: Layers },
            { id: 'exercise', label: 'تمرين تطبيقي', icon: BookOpen },
            { id: 'tutor', label: 'اسأل المرشد', icon: HelpCircle },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = lessonTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setLessonTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-24 text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-lg shadow-violet-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-navy-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Summary */}
        {lessonTab === 'summary' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 glass-card rounded-24 p-6 md:p-8 border border-navy-700/60 space-y-6 text-slate-200 leading-relaxed text-sm">
              <div className="prose prose-invert max-w-none space-y-4">
                <div className="p-4 rounded-24 bg-violet-950/30 border border-violet-500/30 flex items-center gap-3">
                  <span className="text-2xl">💡</span>
                  <div className="text-xs">
                    <strong className="text-violet-300 block mb-0.5">الهدف الكفاءاتي للدرس:</strong>
                    التعرف على الشروط الضرورية لظاهرة الاستنساخ وتحديد مختلف مراحلها بدقة مع ضبط اتجاه القراءة وبناء الـ ARNm.
                  </div>
                </div>

                <div className="whitespace-pre-wrap font-sans text-xs sm:text-sm">
                  {res.summary}
                </div>
              </div>
            </div>

            {/* Side Cello & Quick Rules */}
            <div className="space-y-4">
              <div className="glass-card rounded-24 p-5 border border-navy-700/60 text-center space-y-3">
                <CelloMascot mood="hint" size="md" />
                <h3 className="font-heading text-slate-100 text-base">نصيحة سيلّو للامتحان</h3>
                <p className="text-xs text-slate-300 leading-relaxed text-right bg-navy-950/50 p-3 rounded-20 border border-navy-800">
                  إذا طلب منك في البكالوريا المقارنة بين السلسلة الناسخة وغير الناسخة: السلسلة غير الناسخة مماثلة تماماً للـ ARNm في القواعد والاتجاه (5' إلى 3') مع تعويض وحيد: <strong>T في الـ ADN يقابله U في الـ ARNm</strong>.
                </p>
              </div>

              <div className="glass-card rounded-24 p-5 border border-navy-700/60 space-y-3">
                <h4 className="text-xs font-bold text-cyan-400 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>المصطلحات العلمية بالفرنسية:</span>
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="p-2 rounded-xl bg-navy-950/60 border border-navy-800 flex justify-between">
                    <span>السلسلة الناسخة</span>
                    <span className="text-slate-400 font-mono italic">Brin transcrit</span>
                  </div>
                  <div className="p-2 rounded-xl bg-navy-950/60 border border-navy-800 flex justify-between">
                    <span>إنزيم ARN بوليمراز</span>
                    <span className="text-slate-400 font-mono italic">ARN polymérase</span>
                  </div>
                  <div className="p-2 rounded-xl bg-navy-950/60 border border-navy-800 flex justify-between">
                    <span>مرحلة الاستطالة</span>
                    <span className="text-slate-400 font-mono italic">Élongation</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Video */}
        {lessonTab === 'video' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {/* Simulated Video Player */}
              <div className="relative aspect-video rounded-32 bg-navy-950 border border-violet-500/30 overflow-hidden flex flex-col justify-between p-6 shadow-2xl">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="px-3 py-1 rounded-full bg-violet-600/30 text-violet-300 border border-violet-500/30 font-bold">
                    HD • 1080p
                  </span>
                  <span>المدة: 08:35 دقيقة</span>
                </div>

                <div className="text-center space-y-3 my-auto">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-violet-600 to-cyan-400 text-white flex items-center justify-center mx-auto shadow-xl shadow-violet-600/40 cursor-pointer hover:scale-110 transition-transform">
                    <Play className="w-7 h-7 fill-white ml-1" />
                  </div>
                  <h3 className="font-heading text-lg md:text-xl text-slate-100">
                    محاكاة ثلاثية الأبعاد: آلية عمل إنزيم ARN بوليمراز على جزيئة الـ ADN
                  </h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    شرح مفصل لمرحلتي الاستطالة والنهاية وتفكيك اتجاهات 3' و 5'
                  </p>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="h-1.5 w-full bg-navy-800 rounded-full overflow-hidden">
                    <div className="h-full w-2/5 bg-gradient-to-r from-violet-500 to-cyan-400 rounded-full"></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>03:40</span>
                    <span>08:35</span>
                  </div>
                </div>
              </div>

              {/* Timestamped Video Notes */}
              <div className="glass-card rounded-24 p-6 border border-navy-700/60 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-base text-slate-100 flex items-center gap-2">
                    <Bookmark className="w-4 h-4 text-cyan-400" />
                    <span>ملاحظاتي الشخصية على التوقيت الزمني</span>
                  </h3>
                  <span className="text-xs text-slate-400">{notes.length} ملاحظات مسجلة</span>
                </div>

                <div className="space-y-2.5">
                  {notes.map((note, idx) => (
                    <div key={idx} className="p-3 rounded-20 bg-navy-950/70 border border-navy-800 flex items-start gap-3 text-xs">
                      <span className="px-2 py-0.5 rounded bg-violet-600/20 text-violet-300 font-mono font-bold">
                        {note.time}
                      </span>
                      <span className="text-slate-200">{note.text}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="اكتب ملاحظة في التوقيت الحالي (03:40)..."
                    className="flex-1 bg-navy-950 border border-navy-700 rounded-24 px-4 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-violet-500"
                  />
                  <button
                    onClick={() => {
                      if (!newNoteText.trim()) return;
                      setNotes((prev) => [...prev, { time: '03:40', text: newNoteText }]);
                      setNewNoteText('');
                    }}
                    className="px-4 py-2 rounded-24 bg-violet-600 text-white text-xs font-bold hover:bg-violet-700 transition-colors"
                  >
                    حفظ الملاحظة
                  </button>
                </div>
              </div>
            </div>

            {/* Video Chapters Column */}
            <div className="glass-card rounded-24 p-6 border border-navy-700/60 space-y-4">
              <h3 className="font-heading text-base text-slate-100 flex items-center gap-2">
                <Clock className="w-4 h-4 text-lime-400" />
                <span>فصول الفيديو (Video Chapters)</span>
              </h3>

              <div className="space-y-2">
                {res.videoChapters?.map((chap, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-20 bg-navy-950/60 hover:bg-navy-800/70 border border-navy-800/80 cursor-pointer transition-colors flex items-center justify-between text-xs"
                  >
                    <span className="font-medium text-slate-200">{chap.title}</span>
                    <span className="font-mono text-cyan-400 font-bold ml-2">{chap.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Podcast */}
        {lessonTab === 'podcast' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Audio Player Card */}
            <div className="lg:col-span-1 glass-card rounded-24 p-6 border border-navy-700/60 space-y-6">
              <div className="text-center space-y-3">
                <div className="w-24 h-24 rounded-32 bg-gradient-to-tr from-violet-600 via-cyan-400 to-lime-400 mx-auto p-1 shadow-xl shadow-violet-600/20">
                  <div className="w-full h-full bg-navy-900 rounded-[28px] flex items-center justify-center text-4xl">
                    🎙️
                  </div>
                </div>
                <h3 className="font-heading text-lg text-slate-100">بودكاست استدلال العلمي</h3>
                <p className="text-xs text-slate-400">
                  الحلقة 03: أسرار إنزيم الاستنساخ وفخاخ البكالوريا
                </p>
                <span className="inline-block text-xs font-mono font-bold text-violet-400 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20">
                  المدة: {res.podcastDuration}
                </span>
              </div>

              {/* Controls */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-14 h-14 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 text-white flex items-center justify-center shadow-lg shadow-violet-600/30 hover:scale-105 transition-transform"
                  >
                    {isPlaying ? <span className="text-xl">⏸️</span> : <Play className="w-6 h-6 fill-white ml-1" />}
                  </button>
                </div>

                {/* Speed selector */}
                <div className="space-y-1 text-center">
                  <span className="text-[11px] text-slate-400 font-bold">سرعة التشغيل:</span>
                  <div className="flex items-center justify-center gap-1.5">
                    {[0.75, 1.0, 1.25, 1.5, 2.0].map((s) => (
                      <button
                        key={s}
                        onClick={() => setPlaybackSpeed(s)}
                        className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold transition-colors ${
                          playbackSpeed === s
                            ? 'bg-violet-600 text-white'
                            : 'bg-navy-950 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {s}x
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sleep Timer */}
                <div className="space-y-1 text-center">
                  <span className="text-[11px] text-slate-400 font-bold">مؤقت النوم:</span>
                  <div className="flex items-center justify-center gap-1.5">
                    {[5, 15, 30].map((m) => (
                      <button
                        key={m}
                        onClick={() => setSleepTimer(sleepTimer === m ? null : m)}
                        className={`px-2.5 py-1 rounded-full text-xs font-bold transition-colors ${
                          sleepTimer === m
                            ? 'bg-cyan-500 text-slate-900'
                            : 'bg-navy-950 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {m} د
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Podcast Transcript */}
            <div className="lg:col-span-2 glass-card rounded-24 p-6 border border-navy-700/60 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-base text-slate-100 flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-cyan-400" />
                  <span>التفريغ النصي التفاعلي للحلقة</span>
                </h3>
                <span className="text-xs text-slate-400">حوار بين أستاذ وتلميذ</span>
              </div>

              <div className="space-y-3">
                {res.podcastTranscript?.map((line, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-24 text-xs leading-relaxed border ${
                      line.speaker === 'الأستاذ'
                        ? 'bg-violet-950/20 border-violet-500/20 text-slate-200'
                        : 'bg-cyan-950/20 border-cyan-500/20 text-slate-200'
                    }`}
                  >
                    <span className={`font-bold block mb-1 ${line.speaker === 'الأستاذ' ? 'text-violet-300' : 'text-cyan-300'}`}>
                      {line.speaker}:
                    </span>
                    <p>{line.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Flashcards */}
        {lessonTab === 'flashcards' && (
          <div className="max-w-xl mx-auto space-y-6">
            <div className="text-center space-y-1">
              <h3 className="font-heading text-xl text-slate-100">بطاقات الذاكرة الذكية (Flashcards)</h3>
              <p className="text-xs text-slate-400">انقر على البطاقة لقلبها واختبار حفظك للمفاهيم</p>
            </div>

            {res.flashcards && res.flashcards.length > 0 && (
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="relative h-64 sm:h-72 w-full rounded-32 bg-gradient-to-br from-violet-900/40 via-navy-800 to-navy-950 border border-violet-500/30 p-8 flex flex-col items-center justify-center text-center cursor-pointer shadow-2xl glass-card-hover select-none"
              >
                <div className="absolute top-4 right-5 text-xs font-bold text-violet-400">
                  بطاقة {currentCardIndex + 1} من {res.flashcards.length}
                </div>
                {res.flashcards[currentCardIndex].frenchTerm && (
                  <div className="absolute top-4 left-5 text-xs font-mono text-cyan-400/80">
                    {res.flashcards[currentCardIndex].frenchTerm}
                  </div>
                )}

                <div className="my-auto space-y-3">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-violet-600/20 text-violet-300 border border-violet-500/30">
                    {isFlipped ? 'الإجابة والتعريف الوزاري' : 'السؤال والمفهوم'}
                  </span>
                  <div className="text-base sm:text-lg font-bold text-slate-100 leading-relaxed px-4">
                    {isFlipped
                      ? res.flashcards[currentCardIndex].back
                      : res.flashcards[currentCardIndex].front}
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>انقر للقلب</span>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex items-center justify-between">
              <button
                disabled={currentCardIndex === 0}
                onClick={() => {
                  setCurrentCardIndex((prev) => Math.max(0, prev - 1));
                  setIsFlipped(false);
                }}
                className="px-5 py-2.5 rounded-24 bg-navy-800 hover:bg-navy-700 text-slate-200 text-xs font-bold disabled:opacity-40 transition-colors"
              >
                السابق
              </button>
              <span className="text-xs text-slate-400 font-mono">
                {currentCardIndex + 1} / {res.flashcards?.length}
              </span>
              <button
                disabled={!res.flashcards || currentCardIndex === res.flashcards.length - 1}
                onClick={() => {
                  setCurrentCardIndex((prev) => prev + 1);
                  setIsFlipped(false);
                }}
                className="px-5 py-2.5 rounded-24 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold disabled:opacity-40 transition-colors"
              >
                التالي
              </button>
            </div>
          </div>
        )}

        {/* Tab 5: Exercise */}
        {lessonTab === 'exercise' && (
          <div className="glass-card rounded-24 p-6 md:p-8 border border-navy-700/60 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-navy-800 pb-4">
              <div>
                <span className="text-xs font-bold text-violet-400">التمرين التطبيقي للدرس</span>
                <h3 className="text-lg font-heading text-slate-100">{res.exercise?.title}</h3>
              </div>
              <span className="text-xs font-bold text-lime-400 px-3 py-1 rounded-full bg-lime-400/10 border border-lime-400/20">
                العلامة: {res.exercise?.points} نقاط كاملة
              </span>
            </div>

            <div className="p-4 rounded-24 bg-navy-950/70 border border-navy-800 text-xs sm:text-sm text-slate-200 leading-relaxed">
              {res.exercise?.description}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">محرر صياغة الإجابة:</label>
              <textarea
                value={studentAnswer}
                onChange={(e) => setStudentAnswer(e.target.value)}
                rows={6}
                placeholder="اكتب إجابتك هنا مهيكلة بمقدمة تطرح المشكل، وعرض، وخاتمة..."
                className="w-full bg-navy-950 border border-navy-700 rounded-24 p-4 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-violet-500 leading-relaxed"
              ></textarea>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <button
                onClick={() => setShowModelAnswer(!showModelAnswer)}
                className="px-4 py-2.5 rounded-24 bg-navy-800 hover:bg-navy-700 text-cyan-400 text-xs font-bold border border-cyan-500/30 transition-colors"
              >
                {showModelAnswer ? 'إخفاء الحل النموذجي' : 'عرض الحل الوزاري النموذجي'}
              </button>

              <button
                onClick={onOpenAgentTeam}
                className="px-5 py-2.5 rounded-24 bg-gradient-to-r from-violet-600 to-lime-500 text-white text-xs font-bold shadow-lg shadow-violet-600/20 hover:scale-105 transition-transform"
              >
                طلب تصحيح من «المصحّح» ✅
              </button>
            </div>

            {showModelAnswer && (
              <div className="p-5 rounded-24 bg-emerald-950/20 border border-emerald-500/30 space-y-3 animate-fadeIn text-xs sm:text-sm text-slate-200 leading-relaxed">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>عناصر الإجابة النموذجية المعتمدة في البكالوريا:</span>
                </div>
                <div className="whitespace-pre-wrap">{res.exercise?.modelAnswer}</div>
              </div>
            )}
          </div>
        )}

        {/* Tab 6: Tutor */}
        {lessonTab === 'tutor' && (
          <div className="max-w-2xl mx-auto glass-card rounded-24 p-6 md:p-8 border border-navy-700/60 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-24 bg-violet-600/20 border border-violet-500/40 flex items-center justify-center text-2xl">
                🧭
              </div>
              <div>
                <h3 className="font-heading text-lg text-slate-100">اسأل المرشد (Tutor)</h3>
                <p className="text-xs text-slate-400">
                  مرشدك الذكي المتخصص في شرح درس آلية الاستنساخ وحلقات التوجيه السقراطي
                </p>
              </div>
            </div>

            <form onSubmit={handleTutorAsk} className="space-y-4">
              <textarea
                value={tutorQuery}
                onChange={(e) => setTutorQuery(e.target.value)}
                rows={4}
                placeholder="مثال: لماذا تقرأ السلسلة الناسخة حصراً من 3' إلى 5' ولا تقرأ بالعكس؟"
                className="w-full bg-navy-950 border border-navy-700 rounded-24 p-4 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-violet-500"
              ></textarea>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isTutorLoading || !tutorQuery.trim()}
                  className="px-6 py-2.5 rounded-24 bg-gradient-to-r from-violet-600 to-cyan-500 text-white text-xs font-bold shadow-lg shadow-violet-600/30 hover:scale-105 disabled:opacity-50 transition-all flex items-center gap-2"
                >
                  {isTutorLoading ? <span>جاري التفكير... ⏳</span> : (
                    <>
                      <span>إرسال للمرشد</span>
                      <Send className="w-3.5 h-3.5 transform rotate-180" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {tutorReply && (
              <div className="p-5 rounded-24 bg-violet-950/30 border border-violet-500/30 space-y-2 animate-fadeIn text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                <div className="text-xs font-bold text-violet-300 flex items-center gap-1.5">
                  <span>🧭 جواب المرشد:</span>
                </div>
                <div>{tutorReply}</div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Otherwise, render Duolingo-style Learning Path across Domains
  return (
    <div className="space-y-6 pb-20 md:pb-8 animate-fadeIn">
      {/* Page Header */}
      <div className="glass-card rounded-24 p-6 border border-navy-700/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-bold mb-2">
            <span>مسار التعلم التفاعلي</span>
            <span>•</span>
            <span>3AS علوم تجريبية 2026-2027</span>
          </div>
          <h1 className="text-2xl font-heading text-slate-100">شجرة المنهاج والوحدات التعليمية</h1>
          <p className="text-xs text-slate-400">
            تدرج وفق مسار الوحدات؛ تفتح الدروس تباعاً بحسب تقدمك وإنجاز التمارين
          </p>
        </div>

        {/* Domain Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {DOMAINS_SEED.map((domain) => {
            const isSelected = selectedDomainId === domain.id;
            return (
              <button
                key={domain.id}
                onClick={() => setSelectedDomainId(domain.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-24 text-xs font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30'
                    : 'bg-navy-800 text-slate-300 hover:bg-navy-700'
                }`}
              >
                <span>{domain.emoji}</span>
                <span>{domain.title.split(':')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Domain Units & Duolingo Path Nodes */}
      <div className="space-y-8">
        {activeDomain.units.map((unit, uIdx) => (
          <div key={unit.id} className="glass-card rounded-32 p-6 md:p-8 border border-navy-700/60 space-y-6">
            <div className="flex items-center justify-between border-b border-navy-800 pb-3">
              <h2 className="text-lg md:text-xl font-heading text-slate-100 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 to-cyan-400 flex items-center justify-center text-xs font-bold text-white">
                  {uIdx + 1}
                </span>
                <span>{unit.title}</span>
              </h2>
              <span className="text-xs text-slate-400">
                {unit.lessons.length} دروس تعليمية
              </span>
            </div>

            {/* Path Nodes */}
            <div className="flex flex-col items-center gap-6 py-4">
              {unit.lessons.map((lesson, lIdx) => {
                const isCompleted = lesson.completed;
                const isCurrent = lesson.id === 'd1_u1_l3'; // Lesson 3
                const isLocked = !isCompleted && !isCurrent;

                // Subtle zigzag offset
                const offsetClass = lIdx % 2 === 0 ? 'translate-x-0 sm:translate-x-6' : 'translate-x-0 sm:-translate-x-6';

                return (
                  <div
                    key={lesson.id}
                    onClick={() => {
                      if (!isLocked) {
                        setActiveLesson(lesson.id === 'd1_u1_l3' ? TRANSCRIPTION_LESSON : lesson);
                      }
                    }}
                    className={`flex items-center gap-4 p-4 rounded-32 border transition-all cursor-pointer w-full max-w-md ${offsetClass} ${
                      isCurrent
                        ? 'bg-gradient-to-r from-violet-900/60 to-navy-900 border-lime-400/80 shadow-xl shadow-lime-400/10 scale-105'
                        : isCompleted
                        ? 'bg-navy-950/70 border-violet-500/40 hover:border-violet-400'
                        : 'bg-navy-950/30 border-navy-800/80 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <div
                      className={`w-14 h-14 rounded-24 flex items-center justify-center text-xl flex-shrink-0 shadow-lg ${
                        isCurrent
                          ? 'bg-gradient-to-tr from-lime-400 to-cyan-400 text-navy-950 font-bold animate-pulse'
                          : isCompleted
                          ? 'bg-violet-600 text-white'
                          : 'bg-navy-800 text-slate-500'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-7 h-7" /> : isLocked ? <Lock className="w-5 h-5" /> : '🧬'}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className={`text-xs sm:text-sm font-bold truncate ${isCurrent ? 'text-lime-400' : 'text-slate-200'}`}>
                          {lesson.title}
                        </h4>
                        {isCurrent && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-lime-400/20 text-lime-300">
                            الدرس الحالي
                          </span>
                        )}
                      </div>
                      {lesson.french && (
                        <p className="text-[10px] text-slate-400 font-mono italic truncate">
                          {lesson.french}
                        </p>
                      )}
                      {lesson.score && (
                        <div className="text-[11px] text-violet-300 font-bold mt-1">
                          النتيجة: {lesson.score}%
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Official credit line in footer as specified */}
      <div className="text-center text-xs text-slate-500 py-4 border-t border-navy-800">
        البرنامج الرسمي لمادة علوم الطبيعة والحياة (شعبة علوم تجريبية) • وثيقة المنهاج مصادق عليها وموقعة من طرف: <strong className="text-slate-400">الأستاذ عدة بن عطية صلاح الدين</strong>.
      </div>
    </div>
  );
};

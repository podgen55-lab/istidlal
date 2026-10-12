import React, { useState } from 'react';
import {
  Users,
  Shield,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Sparkles,
  Copy,
  Check,
  TrendingDown,
  Layers,
} from 'lucide-react';

export const TeacherDashboardView: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState(false);
  const classCode = 'BAC-2027-EX';

  const [reviewItems, setReviewItems] = useState([
    {
      id: 'rev_1',
      student: 'أحمد ع.',
      exercise: 'تمرين الاستدلال العلمي (مضاد الكلوروكين)',
      status: 'needs_teacher_review',
      reason: 'اعتماد التلميذ على استراتيجية حل بديلة صحيحة علمياً (نسبة ثقة المصحح 0.65).',
      suggestedScore: '6.50 / 7.00',
    },
    {
      id: 'rev_2',
      student: 'مريم ب.',
      exercise: 'نص علمي: آليات تحويل الطاقة في الوسط الهوائي',
      status: 'needs_teacher_review',
      reason: 'رسم تخطيطي مرفق تم التعرف عليه جزئياً عبر الكاميرا يتطلب تأكيد الأستاذ.',
      suggestedScore: '4.25 / 5.00',
    },
    {
      id: 'rev_3',
      student: 'استوديو المحتوى 🎬 (مسودة الذكاء الاصطناعي)',
      exercise: 'مسودة كويز تفاعلي: إنزيم ARN بوليمراز (10 أسئلة)',
      status: 'draft_pending_approval',
      reason: 'مسودة أسئلة مولدة تلقائياً جاهزة للاعتماد والنشر في المنهاج.',
      suggestedScore: 'مسودة محتوى',
    }
  ]);

  const copyClassCode = () => {
    navigator.clipboard.writeText(classCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleApprove = (id: string) => {
    setReviewItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8 animate-fadeIn">
      {/* Header */}
      <div className="glass-card rounded-24 p-6 border border-lime-400/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-24 bg-lime-400/20 border border-lime-400/40 text-lime-400 flex items-center justify-center text-2xl shadow-lg">
            👨‍🏫
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-lime-400/10 text-lime-400 text-[10px] font-bold border border-lime-400/30 mb-1">
              لوحة تحكم الأستاذ (Admin Dashboard)
            </div>
            <h1 className="text-xl md:text-2xl font-heading text-slate-100">
              إدارة الفوج المدرسي ومراجعة الذكاء الاصطناعي
            </h1>
            <p className="text-xs text-slate-400">
              متابعة التلاميذ، تحليل مواطن الضعف، والمصادقة على نتائج «المصحّح» ومسودات «استوديو المحتوى»
            </p>
          </div>
        </div>

        {/* Class Code Badge */}
        <div className="flex items-center gap-2 p-3 rounded-20 bg-navy-950 border border-navy-800">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-bold block">رمز انضمام الفوج:</span>
            <span className="font-mono text-sm font-bold text-lime-400">{classCode}</span>
          </div>
          <button
            onClick={copyClassCode}
            className="p-2 rounded-xl bg-navy-800 hover:bg-navy-700 text-slate-300 transition-colors"
            title="نسخ الرمز"
          >
            {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-24 p-5 border border-navy-700/60 space-y-1">
          <span className="text-xs text-slate-400 font-bold block">التلاميذ المسجلون</span>
          <div className="text-2xl font-heading text-slate-100">38 تلميذاً</div>
          <p className="text-[11px] text-lime-400">فوج علوم تجريبية 3AS-1</p>
        </div>

        <div className="glass-card rounded-24 p-5 border border-navy-700/60 space-y-1">
          <span className="text-xs text-slate-400 font-bold block">متوسط معدل الإنجاز</span>
          <div className="text-2xl font-heading text-violet-300">74.5%</div>
          <p className="text-[11px] text-slate-400">في الوحدة 1 (تركيب البروتين)</p>
        </div>

        <div className="glass-card rounded-24 p-5 border border-navy-700/60 space-y-1">
          <span className="text-xs text-slate-400 font-bold block">أكثر فخ مكرر بالفوج</span>
          <div className="text-base font-bold text-rose-400 flex items-center gap-1.5 mt-1">
            <TrendingDown className="w-4 h-4" />
            <span>فخ التفسير المسبق (-0.50)</span>
          </div>
          <p className="text-[11px] text-slate-400">وقع فيه 22 تلميذاً هذا الأسبوع</p>
        </div>

        <div className="glass-card rounded-24 p-5 border border-navy-700/60 space-y-1">
          <span className="text-xs text-slate-400 font-bold block">طابور مراجعة الذكاء الاصطناعي</span>
          <div className="text-2xl font-heading text-amber-400">{reviewItems.length} عناصر معلقة</div>
          <p className="text-[11px] text-slate-400">تتطلب تأكيد الأستاذ</p>
        </div>
      </div>

      {/* AI Review Queue Section */}
      <div className="glass-card rounded-24 p-6 border border-navy-700/60 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-heading text-slate-100">
              طابور مراجعة الأستاذ (AI Review Queue)
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            العناصر الموسومة بـ <code className="text-amber-300 font-mono">needs_teacher_review</code>
          </span>
        </div>

        {reviewItems.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            🎉 رائع! طابور المراجعة فارغ بالكامل وجميع إجابات التلاميذ ومسودات الذكاء الاصطناعي معتمدة.
          </div>
        ) : (
          <div className="space-y-3">
            {reviewItems.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-24 bg-navy-950/70 border border-navy-800 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-200">{item.student}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-violet-400 font-medium">{item.exercise}</span>
                  </div>
                  <p className="text-slate-400">{item.reason}</p>
                  <div className="text-amber-400 font-bold text-[11px]">
                    العلامة المقترحة من المصحح: {item.suggestedScore}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleApprove(item.id)}
                    className="px-4 py-2 rounded-24 bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>اعتماد وتثبيت العلامة</span>
                  </button>
                  <button
                    onClick={() => handleApprove(item.id)}
                    className="px-3 py-2 rounded-24 bg-navy-800 hover:bg-navy-700 text-slate-300 font-bold transition-colors"
                  >
                    تعديل يدوي
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Curriculum & Resources Quick Management */}
      <div className="glass-card rounded-24 p-6 border border-navy-700/60 space-y-4">
        <h3 className="font-heading text-base text-slate-100 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <span>تخصيص موارد المنهاج (3AS علوم تجريبية)</span>
        </h3>
        <p className="text-xs text-slate-400">
          يمكن للأستاذ ربط روابط YouTube الخاصة به، وتسجيلات البودكاست الصوتية، وملفات الـ PDF لكل حصة.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-4 rounded-20 bg-navy-950/60 border border-navy-800 text-center space-y-1 cursor-pointer hover:border-violet-500 transition-colors">
            <span className="text-2xl block mb-1">🔗</span>
            <span className="text-xs font-bold text-slate-200 block">إضافة فيديو يوتيوب</span>
            <span className="text-[10px] text-slate-400">ربط شرح مرئي بحصة معينة</span>
          </div>

          <div className="p-4 rounded-20 bg-navy-950/60 border border-navy-800 text-center space-y-1 cursor-pointer hover:border-violet-500 transition-colors">
            <span className="text-2xl block mb-1">🎙️</span>
            <span className="text-xs font-bold text-slate-200 block">إرفاق حلقة بودكاست</span>
            <span className="text-[10px] text-slate-400">رفع أو ربط ملف صوتي</span>
          </div>

          <div className="p-4 rounded-20 bg-navy-950/60 border border-navy-800 text-center space-y-1 cursor-pointer hover:border-violet-500 transition-colors">
            <span className="text-2xl block mb-1">📝</span>
            <span className="text-xs font-bold text-slate-200 block">بناء كويز سريع</span>
            <span className="text-[10px] text-slate-400">استدعاء وكيل «الممتحن» 🧪</span>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { TrendingUp, Award, Zap, ShieldCheck, Target, Sparkles, CheckCircle2 } from 'lucide-react';
import { AbqoorMascot } from './AbqoorMascot';

const SCORE_HISTORY = [
  { date: 'الأسبوع 1', score: 12.5, average: 11.0, exercise: 'استرجاع منظم' },
  { date: 'الأسبوع 2', score: 14.0, average: 11.8, exercise: 'استدلال علمي' },
  { date: 'الأسبوع 3', score: 15.5, average: 12.2, exercise: 'مسعى علمي 1' },
  { date: 'الأسبوع 4', score: 17.0, average: 13.0, exercise: 'تحليل وثائق' },
  { date: 'الأسبوع 5', score: 18.5, average: 13.5, exercise: 'استنساخ وترجمة' },
  { date: 'الأسبوع 6 (الحالي)', score: 19.5, average: 14.0, exercise: 'بكالوريا تجريبي' },
];

const SKILL_MASTERY = [
  { skill: 'التعريف بالسند', mastery: 95, target: 100 },
  { skill: 'التحليل الدلالي', mastery: 90, target: 100 },
  { skill: 'الشواهد الرقمية', mastery: 85, target: 100 },
  { skill: 'دقة الاستنتاج', mastery: 92, target: 100 },
  { skill: 'هيكلة النص العلمي', mastery: 96, target: 100 },
  { skill: 'المسعى والفرضيات', mastery: 88, target: 100 },
];

export const StudentProgressDashboard: React.FC = () => {
  return (
    <div className="space-y-6" dir="rtl">
      {/* Top Banner */}
      <div className="glass-card rounded-32 border border-violet-500/30 p-6 md:p-8 bg-gradient-to-r from-violet-950/40 via-navy-900/90 to-navy-950 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2 text-center md:text-right">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-lime-400/10 border border-lime-400/30 text-lime-400 text-xs font-bold">
            <span>لوحة المؤشرات البيانية Recharts</span>
            <span>•</span>
            <span>المنهاج وإعداد المحتوى: الأستاذ عبد الرحيم فنكوح (by ABDERRAHIM FENKOUH)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading text-slate-100">
            تطور مستوى التلميذ والمناعة المنهجية بالزمن 📈
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            مؤشرات تحليلية دقيقة مستخرجة تلقائياً من نتائج التمارين المصححة عبر الكاميرا ومحرر الإجابة الثلاثي
          </p>
        </div>

        <div className="flex-shrink-0">
          <AbqoorMascot mood="eureka" size="md" message="المنحنى البياني يصعد بسرعة نحو 20/20! استمر يا بطل! 🚀" />
        </div>
      </div>

      {/* Quick KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card rounded-24 p-5 border border-navy-700/60 bg-navy-950/70 text-center space-y-1">
          <span className="text-xs text-slate-400 font-bold block">معدل العلامات</span>
          <span className="text-3xl font-heading text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-lime-400">
            18.5 / 20
          </span>
          <span className="text-[10px] text-lime-400 font-bold block">+3.0 ن مقارنة بالأسبوع 1</span>
        </div>

        <div className="glass-card rounded-24 p-5 border border-navy-700/60 bg-navy-950/70 text-center space-y-1">
          <span className="text-xs text-slate-400 font-bold block">التمارين المصححة</span>
          <span className="text-3xl font-heading text-cyan-300 font-mono font-bold">
            14 تمريناً
          </span>
          <span className="text-[10px] text-cyan-400 font-bold block">بمختلف الأنماط الثلاثة</span>
        </div>

        <div className="glass-card rounded-24 p-5 border border-navy-700/60 bg-navy-950/70 text-center space-y-1">
          <span className="text-xs text-slate-400 font-bold block">المناعة المنهجية</span>
          <span className="text-3xl font-heading text-violet-300 font-mono font-bold">
            91%
          </span>
          <span className="text-[10px] text-violet-400 font-bold block">تحصين تام ضد أفخاخ الوزارة</span>
        </div>

        <div className="glass-card rounded-24 p-5 border border-navy-700/60 bg-navy-950/70 text-center space-y-1">
          <span className="text-xs text-slate-400 font-bold block">دقائق التدريب بالمؤقت</span>
          <span className="text-3xl font-heading text-amber-300 font-mono font-bold">
            320 دقيقة
          </span>
          <span className="text-[10px] text-amber-400 font-bold block">انضباط كامل بالوقت الرسمي</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Score Progress Over Time (Recharts AreaChart) */}
        <div className="glass-card rounded-32 border border-navy-700/60 p-6 space-y-4 bg-navy-950/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-lime-400" />
              <h3 className="font-heading text-base text-slate-100">
                منحنى ارتقاء العلامات بمرور الأسابيع (من 20 ن)
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-lime-400 bg-lime-400/10 px-2.5 py-0.5 rounded-full border border-lime-400/20">
              ارتقاء تصاعدي ممتاز
            </span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={SCORE_HISTORY} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="5%" stopColor="#A3E635" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#A3E635" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="avgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="5%" stopColor="#818CF8" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#818CF8" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" opacity={0.6} />
                <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} domain={[8, 20]} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: '16px',
                    fontSize: '12px',
                    color: '#F8FAFC',
                    textAlign: 'right',
                    direction: 'rtl',
                  }}
                  formatter={(val: any, name: string) => [
                    `${val} ن`,
                    name === 'score' ? 'علامتك المستحقة' : 'معدل الدفعة الوطني',
                  ]}
                />
                <Area type="monotone" dataKey="score" stroke="#A3E635" strokeWidth={3} fill="url(#scoreGrad)" name="علامتك" />
                <Area type="monotone" dataKey="average" stroke="#818CF8" strokeWidth={2} strokeDasharray="4 4" fill="url(#avgGrad)" name="معدل الدفعة" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Skill Mastery Breakdown (Recharts BarChart) */}
        <div className="glass-card rounded-32 border border-navy-700/60 p-6 space-y-4 bg-navy-950/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-cyan-400" />
              <h3 className="font-heading text-base text-slate-100">
                نسبة إتقان الكفاءات المنهجية الرسمية (%)
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-400/10 px-2.5 py-0.5 rounded-full border border-cyan-400/20">
              6 معايير وزارية
            </span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SKILL_MASTERY} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" opacity={0.6} />
                <XAxis dataKey="skill" stroke="#94A3B8" fontSize={10} tickLine={false} interval={0} angle={-15} textAnchor="end" height={50} />
                <YAxis stroke="#94A3B8" fontSize={11} domain={[0, 100]} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: '16px',
                    fontSize: '12px',
                    color: '#F8FAFC',
                    textAlign: 'right',
                    direction: 'rtl',
                  }}
                  formatter={(val: any) => [`${val}%`, 'نسبة التمكن']}
                />
                <Bar dataKey="mastered" data={SKILL_MASTERY.map(d => ({ ...d, mastered: d.mastery }))} fill="#38BDF8" radius={[8, 8, 0, 0]} name="نسبة التمكن" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProgressDashboard;

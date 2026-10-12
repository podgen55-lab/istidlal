/**
 * ==============================================================================
 * SocraticTutor.jsx - محرك الاستدلال السقراطي ثلاثي المراحل (3-Stage Socratic Engine)
 * ==============================================================================
 * المرحلة 1: السند والتعليمة الرسمية للبكالوريا
 * المرحلة 2: التفكيك السقراطي مع محطة التحقق المعطلة للتقدم (Gated Checkpoint)
 * المرحلة 3: كشف الحل الوزاري وشبكة التقويم وسلم التنقيط (0.25 / 0.50)
 */

import React, { useState } from 'react';
import soundEngine from '../services/audioService';

export function SocraticTutor({
  currentStage = 1,
  onStageChange = () => {},
  checkpointPassed = false,
  onCheckpointSuccess = () => {},
  onCheckpointMistake = () => {},
}) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [shakeError, setShakeError] = useState(false);
  const [checkedCriteria, setCheckedCriteria] = useState({});

  // خيارات نموذجية لسؤال التحقق تكشف الفخاخ البيداغوجية
  const checkpointOptions = [
    {
      id: 'opt_1',
      text: 'الحبيبات هي ريبوزومات تقوم بترجمة الـ ARNm في الاتجاه من اليمين إلى اليسار مباشرة داخل النواة.',
      isCorrect: false,
      rationale: 'فخ خلط المقرات والظواهر: عملية الاستنساخ تحدث في النواة وتنتج ARN بواسطة ARN بوليميراز، بينما الترجمة تحدث في الهيولى بواسطة الريبوزومات.',
    },
    {
      id: 'opt_2',
      text: 'الحبيبات تمثل جزيئات إنزيم ARN بوليميراز، واتجاه الاستنساخ محدد بتدرج أطوال خيوط الـ ARN من الخيوط الأقصر (بداية المورثة) نحو الخيوط الأطول (نهاية المورثة).',
      isCorrect: true,
      rationale: 'صحيح 100%! قراءة دالة نموذجية: تحديد هوية الجزيئات، ربط طول الخيط بالزمن والتقدم، والاستدلال على جهة حركة الإنزيم.',
    },
    {
      id: 'opt_3',
      text: 'الاتجاه عشوائي لأن إنزيم الاستنساخ يستطيع نسخ سلسلتي الـ ADN معاً في نفس الوقت ومن كلا الاتجاهين.',
      isCorrect: false,
      rationale: 'فخ علمي: يتم استنساخ سلسلة واحدة فقط تدعى "السلسلة المستنسخة" وفي اتجاه واحد دقيق ومحدد (5\' نحو 3\').',
    },
  ];

  const handleSelect = (option) => {
    setSelectedOption(option.id);
    if (option.isCorrect) {
      soundEngine.playSuccess();
      setFeedback({
        type: 'success',
        title: 'إصابة منهجية دقيقة (+20 XP)',
        text: option.rationale,
      });
      onCheckpointSuccess();
    } else {
      soundEngine.playError();
      setShakeError(true);
      setTimeout(() => setShakeError(false), 400);
      setFeedback({
        type: 'error',
        title: 'تنبيه لمنهجية البكالوريا (فخ شائع)',
        text: option.rationale,
      });
      onCheckpointMistake();
    }
  };

  const toggleCriterion = (id) => {
    setCheckedCriteria((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const calculatedScore = Object.entries(checkedCriteria)
    .filter(([_, checked]) => checked)
    .reduce((sum, [id]) => {
      const map = { c1: 0.5, c2: 1.0, c3: 1.0, c4: 1.0, c5: 1.5 };
      return sum + (map[id] || 0);
    }, 0);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#090d16] overflow-y-auto">
      {/* شريط المراحل السقراطية الثلاث */}
      <div className="p-4 border-b border-slate-800 bg-[#0f172a]/80 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md">
        <button
          onClick={() => onStageChange(1)}
          className={`flex items-center gap-2 transition ${
            currentStage === 1 ? 'text-emerald-400 font-bold' : 'text-slate-400'
          }`}
        >
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition ${
              currentStage === 1
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            1
          </div>
          <span className="text-xs font-bold hidden sm:inline">السند والتعليمة</span>
        </button>

        <div className="h-0.5 flex-1 mx-3 bg-slate-800"></div>

        <button
          onClick={() => onStageChange(2)}
          className={`flex items-center gap-2 transition ${
            currentStage === 2 ? 'text-emerald-400 font-bold' : 'text-slate-400'
          }`}
        >
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition ${
              currentStage === 2
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            2
          </div>
          <span className="text-xs font-bold hidden sm:inline">التفكيك السقراطي</span>
        </button>

        <div className="h-0.5 flex-1 mx-3 bg-slate-800"></div>

        <button
          onClick={() => checkpointPassed && onStageChange(3)}
          className={`flex items-center gap-2 transition ${
            currentStage === 3 ? 'text-emerald-400 font-bold' : 'text-slate-400'
          }`}
        >
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition ${
              currentStage === 3
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            3
          </div>
          <span className="text-xs font-bold hidden sm:inline">الحل وسلم التنقيط</span>
        </button>
      </div>

      {/* المحتوى التفاعلي */}
      <div className="p-4 md:p-6 space-y-6 flex-1">
        {/* المرحلة 1: السياق والتعليمة */}
        {currentStage === 1 && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 md:p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-2 h-full bg-blue-500"></div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <span className="text-xs font-black text-blue-400 bg-blue-950/80 px-3 py-1 rounded-lg border border-blue-900/80">
                التمرين الأول: استرجاع منظم للمعلومات (5 نقاط)
              </span>
              <span className="text-xs text-slate-400">المدة المقترحة: 25 دقيقة</span>
            </div>
            <h3 className="text-base font-extrabold text-white mb-2 leading-relaxed">
              السياق الإشكالي الرسمي للموضوع:
            </h3>
            <div className="bg-[#090d16] p-4 rounded-2xl border border-slate-800 text-xs md:text-sm text-slate-300 leading-relaxed mb-4">
              "تتطلب عملية التعبير المورثي عند خلايا حقيقيات النوى تدخلاً منسقاً لجزيئات نوعية وعضيات خلوية متخصصة.
              <br /><br />
              <strong>التعليمة:</strong> باستغلال معطيات الوثيقة (1) ومكتسباتك، <strong>بيّن في نص علمي مهيكل ومبرهن</strong> (مقدمة، عرض، وخاتمة) شروط ومراحل وآلية حدوث ظاهرة الاستنساخ، مبرزاً دلالة تدرج أطوال الخيوط ومصير جزيئة الـ ARN المتشكلة."
            </div>
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold text-emerald-400">الأفعال الأدائية المنهجية:</span>
              <span className="bg-slate-800 text-slate-200 px-2 py-0.5 rounded border border-slate-700">بيّن</span>
              <span className="bg-slate-800 text-slate-200 px-2 py-0.5 rounded border border-slate-700">استغل الوثيقة</span>
              <span className="bg-slate-800 text-slate-200 px-2 py-0.5 rounded border border-slate-700">نص علمي مهيكل</span>
            </div>
          </div>
        )}

        {/* المرحلة 2: التفكيك السقراطي ومحطة التحقق */}
        {currentStage === 2 && (
          <div className="space-y-5">
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center font-black text-xs text-slate-950 shrink-0 mt-1 shadow-md shadow-emerald-950">
                أستاذ
              </div>
              <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl rounded-tr-none p-4 text-xs md:text-sm text-slate-200 leading-relaxed shadow-sm">
                <span className="font-bold text-emerald-400 block mb-1">
                  تفكيك السند: الخطوة 01 - قراءة دلالية للشروط والنتائج
                </span>
                أمعن النظر في الشكل (أ): نلاحظ مورثة مركزية محاطة بتفرعات خيطية عديدة تتزايد أطوالها تدريجياً.
                ماذا تمثل الحبيبات المتواجدة في قاعدة كل خيط، وكيف نحدد الاتجاه الدقيق لنشاطها؟
              </div>
            </div>

            <div
              className={`bg-slate-900 border-2 rounded-3xl p-5 md:p-6 transition-all duration-300 ${
                checkpointPassed ? 'border-emerald-500/80 bg-slate-900/90' : 'border-amber-500/60'
              } ${shakeError ? 'animate-shake' : ''}`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black text-amber-400 flex items-center gap-1.5">
                  <span>🎯</span>
                  <span>محطة التحقق المنهجي (إجبارية لفتح الحل)</span>
                </span>
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-bold"
                >
                  {showHint ? 'إخفاء التلميح' : 'طلب تلميح الأستاذ'}
                </button>
              </div>

              {showHint && (
                <div className="mb-4 p-3 bg-amber-950/40 border border-amber-800/80 rounded-xl text-xs text-amber-200 leading-relaxed">
                  💡 <strong>تلميح:</strong> إنزيم ARN بوليميراز يضيف النيكليوتيدات تدريجياً، فكلما تقدم زاد طول جزيئة الـ ARN.
                </div>
              )}

              <h4 className="text-xs md:text-sm font-bold text-slate-100 mb-4">
                ما هي القراءة الدالة الصائبة التي يجب إدراجها ضمن استغلال هذه الوثيقة؟
              </h4>

              <div className="space-y-2.5">
                {checkpointOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleSelect(opt)}
                    className={`w-full text-right p-3.5 md:p-4 rounded-2xl border text-xs md:text-sm transition-all duration-200 flex items-start justify-between gap-3 ${
                      selectedOption === opt.id
                        ? opt.isCorrect
                          ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200 shadow-md'
                          : 'bg-rose-950/70 border-rose-500 text-rose-200 shadow-md'
                        : 'bg-slate-800/60 border-slate-700 hover:bg-slate-800 hover:border-slate-600 text-slate-300'
                    }`}
                  >
                    <span className="leading-relaxed">{opt.text}</span>
                    <div className="shrink-0 mt-0.5">
                      {selectedOption === opt.id ? (
                        opt.isCorrect ? <span className="text-emerald-400 font-bold">✓</span> : <span className="text-rose-400 font-bold">✕</span>
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-slate-600"></div>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {feedback && (
                <div
                  className={`mt-4 p-4 rounded-2xl text-xs leading-relaxed border ${
                    feedback.type === 'success'
                      ? 'bg-emerald-950/80 border-emerald-600 text-emerald-200'
                      : 'bg-rose-950/80 border-rose-600 text-rose-200'
                  }`}
                >
                  <div className="font-extrabold text-sm mb-1">{feedback.title}</div>
                  <p>{feedback.text}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* المرحلة 3: كشف الحل والتقويم */}
        {currentStage === 3 && (
          <div className="bg-slate-900 border border-emerald-700/80 rounded-3xl p-5 md:p-6 space-y-5 shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-4">
              <div>
                <h4 className="font-black text-base text-emerald-400 flex items-center gap-2">
                  <span>📋</span>
                  <span>شبكة التقويم والحل الوزاري النموذجي</span>
                </h4>
                <p className="text-xs text-slate-400">تجزئة رسمية: 0.25 / 0.50</p>
              </div>
              <div className="text-left">
                <span className="text-xs text-slate-400">نقاطك المقدرة:</span>
                <span className="font-black text-lg text-emerald-400 font-mono ml-1.5">
                  {calculatedScore.toFixed(2)} / 5.00 ن
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-bold text-slate-300">
                ضع علامة (✓) على المعايير التي ضمنتها في مسودتك لقياس نتيجتك:
              </p>
              {[
                { id: 'c1', label: 'المقدمة: سياق سليم وطرح المشكل بدقة', points: 0.5 },
                { id: 'c2', label: 'استغلال الوثيقة: إبراز دور ARN بوليميراز وتدرج أطوال الخيوط', points: 1.0 },
                { id: 'c3', label: 'العرض: آلية الانطلاق والاستطالة وتكامل القواعد', points: 1.0 },
                { id: 'c4', label: 'العرض: آلية النهاية ومصير الـ ARNm المتشكل', points: 1.0 },
                { id: 'c5', label: 'الخاتمة وسلامة المصطلحات: حل مختصر ومباشر للمشكل', points: 1.5 },
              ].map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleCriterion(item.id)}
                  className={`p-3.5 rounded-xl border text-xs cursor-pointer transition flex items-start gap-3 ${
                    checkedCriteria[item.id]
                      ? 'bg-emerald-950/50 border-emerald-600 text-slate-100'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={!!checkedCriteria[item.id]}
                    onChange={() => {}}
                    className="mt-0.5 rounded text-emerald-500 bg-slate-800 border-slate-700 cursor-pointer"
                  />
                  <div className="flex-1 flex justify-between gap-2">
                    <span>{item.label}</span>
                    <span className="font-mono font-bold text-emerald-400 shrink-0">
                      +{item.points.toFixed(2)} ن
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-rose-950/30 border border-rose-800/80 p-4 rounded-2xl">
              <div className="flex items-center gap-2 text-xs font-black text-rose-400 mb-1.5">
                <span>⚠️</span>
                <span>كاشف الفخاخ (Trap Buster):</span>
              </div>
              <ul className="text-xs text-rose-200/80 space-y-1 list-disc list-inside leading-relaxed">
                <li>إغفال ذكر اتجاه قراءة السلسلة المستنسخة (3' نحو 5') واتجاه البناء (5' نحو 3').</li>
                <li>كتابة نص سردي دون تقسيمه الصريح إلى (مقدمة، عرض، خاتمة).</li>
                <li>نسيان استغلال الوثيقة المعطاة والاعتماد على الحفظ المجرد فقط!</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* زر المتابعة المعطل للتقدم */}
      <div className="p-4 border-t border-slate-800 bg-[#0f172a] sticky bottom-0 flex items-center justify-between gap-3 z-20 shrink-0">
        {currentStage === 1 && (
          <button
            onClick={() => onStageChange(2)}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black py-3 px-6 rounded-2xl text-xs md:text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-950"
          >
            <span>بدء التفكيك السقراطي للوثيقة</span>
          </button>
        )}

        {currentStage === 2 && (
          <button
            onClick={() => onStageChange(3)}
            disabled={!checkpointPassed}
            className={`w-full font-black py-3 px-6 rounded-2xl text-xs md:text-sm transition flex items-center justify-center gap-2 shadow-lg ${
              checkpointPassed
                ? 'bg-emerald-600 hover:bg-emerald-500 text-slate-950 shadow-emerald-950 cursor-pointer'
                : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
            }`}
          >
            {checkpointPassed ? (
              <span>كشف شبكة التقويم وسلم التنقيط الكامل ✓</span>
            ) : (
              <span>الإجابة الصحيحة على سؤال التحقق مطلوبة للمتابعة 🔒</span>
            )}
          </button>
        )}

        {currentStage === 3 && (
          <button
            onClick={() => onStageChange(1)}
            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold py-3 px-4 rounded-xl text-xs transition"
          >
            إعادة التمرين
          </button>
        )}
      </div>
    </div>
  );
}

export default SocraticTutor;

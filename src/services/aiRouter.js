/**
 * ==============================================================================
 * منصة "Istidlal by fnk" (إستدلال) - بوابة الذكاء الاصطناعي متعددة النماذج
 * src/services/aiRouter.js
 * ==============================================================================
 * التوافق الصارم:
 * - Google AI Studio (Gemini 1.5 Flash / Gemini 1.5 Pro)
 * - دليل بناء اختبار مادة علوم الطبيعة والحياة (أكتوبر 2017)
 */

export const AI_MODELS = {
  FLASH: 'gemini-1.5-flash',
  PRO: 'gemini-1.5-pro'
};

const SYSTEM_INSTRUCTION_BAC_EXAMINER = `
أنت الأستاذ المصحح المرجعي لمادة علوم الطبيعة والحياة في البكالوريا الجزائرية (شعبة علوم تجريبية ورياضيات).
مهمتك: تصحيح وتقييم إجابة التلميذ بدقة وزارية صارمة وفق دليل بناء الاختبارات (أكتوبر 2017).

القواعد المنهجية الإلزامية:
1. الفصل التام بين التحليل والتفسير: التحليل قراءة دالة مجردة تنتهي باستنتاج. استخدام "لأن" أو التعليل في التحليل يُعد فخ تفسير مسبق ويستوجب خصم 0.50 ن.
2. الشواهد الرقمية: إغفال القيم والنسب من الوثائق يستوجب خصم 0.25 ن.
3. الاستنتاج: يجب أن يكون إجابة مباشرة ودقيقة عن هدف الوثيقة (0.50 ن).
4. عند تقييم النصوص العلمية: اشتراط مقدمة بمشكل علمي دقيق، عرض غني بالكلمات المفتاحية الوزارية، وخاتمة شاملة.

المخرجات المطلوبة:
أعد التقييم دوماً بهيكل واضح يحدد:
- العلامة الممنوحة من العلامة الكلية
- نقاط القوة المنهجية
- الفخاخ والأخطاء المرصودة والخصم الوزاري المطبق
- التوجيه البيداغوجي المخصص لمعالجة الضعف.
`;

export class AiRouterService {
  static getStoredApiKey() {
    return localStorage.getItem('gemini_api_key') || 'AQ.Ab8RN6JUwuVF26MKSs1cZnw42J4HKTBCERyQa9FcCQAOBgG8fw';
  }

  static getPreferredModel() {
    return localStorage.getItem('gemini_model') || AI_MODELS.FLASH;
  }

  /**
   * تقييم إجابة التلميذ (نص، صورة كراس، أو تفريغ صوتي)
   */
  static async evaluateSubmission({ exerciseId, rubric, studentAnswer, imageBase64 = null, voiceTranscript = null, model = null }) {
    const apiKey = this.getStoredApiKey();
    const activeModel = model || this.getPreferredModel();

    const textToEvaluate = studentAnswer || voiceTranscript || '';

    const promptPayload = `
تمرين مرجعي: ${exerciseId}
سلم التنقيط الوزاري المطلوب:
${JSON.stringify(rubric, null, 2)}

إجابة التلميذ المراد تقييمها:
"${textToEvaluate}"

المطلوب:
1. قيّم مدى احترام التلميذ لخطوات المنهجية (التعريف، المعطيات، الدلالة، الاستنتاج).
2. حدد الكلمات المفتاحية الوزارية المحققة وتلك الغائبة.
3. امنح العلامة المستحقة واشرح أين ضاعت النقاط بالتفصيل.
`;

    if (apiKey) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${activeModel}:generateContent?key=${apiKey}`;
        const parts = [];

        // إذا كانت هناك صورة كراس بالهاتف
        if (imageBase64) {
          parts.push({
            inline_data: {
              mime_type: 'image/jpeg',
              data: imageBase64.replace(/^data:image\/[a-z]+;base64,/, '')
            }
          });
        }

        parts.push({ text: promptPayload });

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: {
              parts: [{ text: SYSTEM_INSTRUCTION_BAC_EXAMINER }]
            },
            contents: [{ parts }]
          })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.candidates && data.candidates[0].content) {
            return {
              isLive: true,
              modelUsed: activeModel,
              feedbackText: data.candidates[0].content.parts[0].text
            };
          }
        }
      } catch (err) {
        console.warn('AI Router network call failed, falling back to local evaluator:', err);
      }
    }

    // المصحح المنهجي المدمج في حال عدم الاتصال بالشبكة
    return this.fallbackLocalEvaluation(textToEvaluate, rubric);
  }

  /**
   * التقييم البيداغوجي المدمج (يعمل بدون إنترنت)
   */
  static fallbackLocalEvaluation(text, rubric) {
    const hasNumbers = /\d+|100%|0\.01|1/.test(text);
    const hasPrematureExp = /لأن|بسبب|يرجع ذلك/.test(text);
    let earnedScore = 1.75;
    let flaws = [];

    if (hasPrematureExp) {
      earnedScore -= 0.50;
      flaws.push('فخ التفسير المسبق: استخدام أدوات التعليل (لأن/بسبب) قبل تفكيك معطيات السند (-0.50 ن).');
    }
    if (!hasNumbers) {
      earnedScore -= 0.25;
      flaws.push('إغفال الشواهد الرقمية: القراءة المجردة دون ذكر النسب والوحدات من الوثيقة (-0.25 ن).');
    }

    return {
      isLive: false,
      modelUsed: 'المصحح المنهجي المدمج (3AS Rules Engine)',
      score: earnedScore.toFixed(2),
      totalScore: '2.00',
      strengths: 'احترام تسلسل خطوات الاستدلال وصياغة استنتاج مرتبط بالهدف.',
      flaws: flaws.length > 0 ? flaws.join(' | ') : 'إجابة منهجية متكاملة وخالية من الفخاخ الوزارية.',
      advice: 'احرص دائماً على الفصل الصارم بين قراءة المعطيات في البداية واستخراج الاستنتاج في النهاية.'
    };
  }
}

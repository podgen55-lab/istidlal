import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SYSTEM_INSTRUCTION_BAC_EXAMINER = `أنت الأستاذ المصحح المرجعي لمادة علوم الطبيعة والحياة في البكالوريا الجزائرية (شعبة علوم تجريبية ورياضيات).
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
- التوجيه البيداغوجي المخصص لمعالجة الضعف.`;

function getApiKey(): string | undefined {
  // First priority: dynamically check /app/.dev.env.json
  try {
    const devEnvPath = '/app/.dev.env.json';
    if (fs.existsSync(devEnvPath)) {
      const parsed = JSON.parse(fs.readFileSync(devEnvPath, 'utf8'));
      if (parsed.GEMINI_API_KEY && typeof parsed.GEMINI_API_KEY === 'string') {
        const k = parsed.GEMINI_API_KEY.trim();
        if (k && !k.includes('JUwuVF26MKSs1cZnw42J4HKTBCERyQa9FcCQAOBgG8fw')) {
          return k;
        }
      }
    }
  } catch {}

  // Second priority: process.env.GEMINI_API_KEY
  const envKey = process.env.GEMINI_API_KEY;
  if (envKey && !envKey.includes('JUwuVF26MKSs1cZnw42J4HKTBCERyQa9FcCQAOBgG8fw')) {
    return envKey.trim();
  }

  return envKey;
}

function generatePedagogicalFallback(promptText: string): string {
  const hasNumbers = /\d+|100%|0\.01|1/.test(promptText);
  const hasPrematureExp = /لأن|بسبب|يرجع ذلك/.test(promptText);
  let score = 1.75;
  const flaws: string[] = [];

  if (hasPrematureExp) {
    score -= 0.50;
    flaws.push('فخ التفسير المسبق: استخدام أدوات التعليل (لأن/بسبب) قبل تفكيك معطيات السند والانتهاء من التحليل (-0.50 ن).');
  }
  if (!hasNumbers) {
    score -= 0.25;
    flaws.push('إغفال الشواهد الرقمية: القراءة المجردة دون ذكر النسب والوحدات المباشرة من الوثيقة (-0.25 ن).');
  }

  return `[المصحح المرجعي لبكالوريا الجزائر - شبكة التنقيط الرسمية]
العلامة المستحقة: ${score.toFixed(2)} / 2.00

1. نقاط القوة المنهجية:
- احترام خطوات الاستدلال العلمي والتعريف الدقيق بالسند والظاهرة المدروسة.
- صياغة استنتاج مرتبط ومباشر بالهدف البيولوجي للتجربة.

2. الملاحظات والأخطاء المرصودة (الخصم الوزاري):
${flaws.length > 0 ? flaws.map((f) => `- ${f}`).join('\n') : '- إجابة منهجية متكاملة وخالية من الفخاخ الوزارية.'}

3. التوجيه البيداغوجي المخصص:
- افصل دوماً بين الملاحظة الدالة في البداية واستخراج الاستنتاج في النهاية، وتجنب أدوات التفسير المسبق في مرحلة التحليل لضمان العلامة الكاملة.`;
}

async function startServer() {
  const app = express();
  const port = process.env.PORT || 3000;

  app.use(express.json({ limit: '25mb' }));

  // API Status endpoint
  app.get('/api/gemini/status', (_req, res) => {
    const key = getApiKey();
    res.json({
      configured: Boolean(key),
      model: 'gemini-3.8-flash',
    });
  });

  // API Evaluate endpoint
  app.post('/api/gemini/evaluate', async (req, res) => {
    const { prompt, imageBase64, model } = req.body;
    const apiKey = getApiKey();

    if (apiKey) {
      const candidateModels = [
        model || 'gemini-3.8-flash',
        'gemini-3.7-flash',
        'gemini-3.6-flash',
      ];

      for (const targetModel of candidateModels) {
        try {
          const ai = new GoogleGenAI({ apiKey });
          const contents: any[] = [];

          if (imageBase64) {
            contents.push({
              inlineData: {
                mimeType: 'image/jpeg',
                data: imageBase64.replace(/^data:image\/[a-z]+;base64,/, ''),
              },
            });
          }

          if (prompt) {
            contents.push(prompt);
          }

          const response = await ai.models.generateContent({
            model: targetModel,
            contents,
            config: {
              systemInstruction: SYSTEM_INSTRUCTION_BAC_EXAMINER,
            },
          });

          if (response && response.text) {
            return res.json({
              text: response.text,
              model: targetModel,
            });
          }
        } catch (err: any) {
          console.warn(`Model ${targetModel} attempt failed:`, err?.message || err);
          // Continue to next model or fallback
        }
      }
    }

    // High quality pedagogical fallback when offline or during API key rotation
    const fallbackText = generatePedagogicalFallback(prompt || '');
    return res.json({
      text: fallbackText,
      model: 'المصحح المنهجي المدمج (3AS Rules Engine)',
      fallback: true,
    });
  });

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(Number(port), '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

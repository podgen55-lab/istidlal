import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
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

async function startServer() {
  const app = express();
  const port = process.env.PORT || 3000;

  app.use(express.json({ limit: '25mb' }));

  // API Status endpoint
  app.get('/api/gemini/status', (_req, res) => {
    res.json({
      configured: Boolean(process.env.GEMINI_API_KEY),
      model: 'gemini-3.8-flash',
    });
  });

  // API Evaluate endpoint
  app.post('/api/gemini/evaluate', async (req, res) => {
    const { prompt, imageBase64, model } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(503).json({
        error: 'GEMINI_API_KEY is not configured on the server.',
        fallback: true,
      });
    }

    try {
      const ai = new GoogleGenAI();
      const targetModel = model || 'gemini-3.8-flash';
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

      res.json({
        text: response.text,
        model: targetModel,
      });
    } catch (err: any) {
      console.error('Gemini evaluation error:', err);
      res.status(500).json({
        error: err.message || 'Internal evaluation error',
        fallback: true,
      });
    }
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

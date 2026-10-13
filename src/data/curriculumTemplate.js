/**
 * ==============================================================================
 * منصة "Istidlal by fnk" (إستدلال) - المعيار التجاري والبيداغوجي المتقدم
 * ملف قالب هيكل البيانات التعليمي الموحد (Curriculum Template - Enterprise Edition)
 * ==============================================================================
 * التوافق الصارم:
 * - دليل بناء اختبار مادة علوم الطبيعة والحياة للبكالوريا ومنهاج الأستاذ عبد الرحيم فنكوح
 * - التوجيهات الوزارية والمفتشية العامة الرسمية المعاصرة
 *
 * المعايير المستلهمة من المنصات العالمية (Brilliant, Duolingo, UWorld):
 * 1. تفكيك تدرجي دقيق (Cognitive Scaffolding)
 * 2. تعليلات بيداغوجية لكل خيار خاطئ (Distractor Rationales & Trap Spotting)
 * 3. سلم تنقيط وزاري مجزأ (0.25 / 0.50) مع التقييم الذاتي التفاعلي
 * 4. دعم تعددي للسندات الحقيقية (الشكل أ / الشكل ب) دون أي رسومات اصطناعية
 */

export const EXERCISE_TYPES = {
  EX_1_RECALL: {
    id: 'EX_1',
    name: 'التمرين الأول: استرجاع منظم للمعلومات',
    totalPoints: 5.0,
    structure: 'استغلال موجه للوثائق + نص علمي مهيكل (مقدمة، مشكل علمي، عرض متسلسل، خاتمة)',
    color: '#3b82f6',
    suggestedMinutes: 25,
  },
  EX_2_REASONING: {
    id: 'EX_2',
    name: 'التمرين الثاني: الاستدلال العلمي',
    totalPoints: 7.0,
    structure: 'مبني على جزأين: دورة الاستدلال العلمي (سند -> تحليل دال -> استنتاج -> تركيب)',
    color: '#10b981',
    suggestedMinutes: 50,
  },
  EX_3_INVESTIGATION: {
    id: 'EX_3',
    name: 'التمرين الثالث: المسعى العلمي التجريبي',
    totalPoints: 8.0,
    structure: 'مبني على 3 أجزاء: صياغة الفرضيات -> اختبار ومناقشة التجارب -> حصيلة تركيبية',
    color: '#8b5cf6',
    suggestedMinutes: 65,
  },
};

export const ACTION_VERBS_BLUEPRINT = {
  ANALYZE: {
    verb: 'حلّل',
    definition: 'قراءة معطيات السند بدقة، إبراز العلاقات والشروط والنتائج دون تفسير مسبق.',
    goldenRule: 'التحليل = ماذا ألاحظ؟ (تفكيك + دلالة التغيرات). تجنب قول "لأن" في خطوة التحليل!',
  },
  EXPLAIN: {
    verb: 'فسّر',
    definition: 'تقديم الآليات البيولوجية والعلمية للإجابة عن: كيف ولماذا حدثت الظاهرة؟',
    goldenRule: 'التفسير = إرجاع النتيجة لسببها الحيوي اعتماداً على مكتسباتك ومعطيات السند.',
  },
  DEDUCE: {
    verb: 'استنتج',
    definition: 'استخلاص معلومة جديدة مجردة تجيب عن مشكل جزئي في السند.',
    goldenRule: 'الاستنتاج = المعلومة الأساسية التي نخرج بها من السند بعد تحليله.',
  },
  VALIDATE: {
    verb: 'صادق على صحة الفرضية',
    definition: 'استغلال منظم للأدلة التجريبية لنفي فرضية وإثبات أخرى بالبرهان.',
    goldenRule: 'تبيان التوافق بين نتائج التجربة والفرضية الصحيحة، وتناقضها مع الفرضية الخاطئة.',
  }
};

/**
 * النموذج الموحد الفارغ الجاهز لاستقبال أول درس
 */
export const curriculumTemplate = {
  domainId: '', // مثال: 'DOMAIN_1_PROTEIN_DYNAMICS'
  domainTitle: '', // 'التخصص الوظيفي للبروتينات'
  domainUnits: [
    {
      unitId: '', // مثال: 'UNIT_1_PROTEIN_SYNTHESIS'
      unitTitle: '', // 'آليات تركيب البروتين'
      unitSummary: '', // مدخل بيداغوجي للوحدة
      nodes: [
        {
          nodeId: '', // معرف المحطة / العقدة: 'node_1_transcription_mechanism'
          title: '', // عنوان النشاط / المحطة
          exerciseType: 'EX_1', // 'EX_1' | 'EX_2' | 'EX_3'
          totalPoints: 5.0,
          estimatedMinutes: 25,
          difficulty: 'bac_level', // 'intro' | 'medium' | 'bac_level'

          // الوثائق والسندات الحقيقية (Micrographs / Experimental Data)
          // حظر تام للرسومات الاصطناعية (Strict Ban on Fake SVGs)
          documents: [
            {
              id: 'doc_1_fig_a',
              figureLabel: 'الشكل (أ)',
              title: '', // مثال: 'صورة بالمجهر الإلكتروني لظاهرة الاستنساخ المتعدد'
              caption: '', // الهامش التوضيحي أو الشروط التجريبية
              imageSrc: '', // مسار الصورة الأصلية المرفوعة (jpg / png / webp)
              altText: '',
              type: 'micrograph', // 'micrograph' | 'curve' | 'electrophoresis' | 'experimental_setup'
              magnification: '×35,000',
              highResAvailable: true,
            },
            {
              id: 'doc_1_fig_b',
              figureLabel: 'الشكل (ب)',
              title: '', // مثال: 'منحنى تطور كمية الـ ARN المشع'
              caption: '',
              imageSrc: '',
              altText: '',
              type: 'curve',
              magnification: null,
              highResAvailable: true,
            }
          ],

          // محرك السير السقراطي ثلاثي المراحل (3-Stage Socratic Engine)
          socraticStages: {
            
            // المرحلة 1: السياق والتعليمة الرسمية
            stage1_presentation: {
              problemContext: '', // نص السياق الإشكالي
              officialInstruction: '', // نص التعليمة الرسمية للبكالوريا
              targetActionVerbs: ['بيّن', 'استغل الوثيقة', 'نص علمي مهيكل'],
              targetSkills: ['الاسترجاع المنظم للمعارف', 'هيكلة النص العلمي'],
            },

            // المرحلة 2: التفكيك السقراطي ومحطات التحقق الإجبارية (Checkpoints)
            stage2_socratic_decomposition: [
              {
                stepId: 'step_1_observation',
                stepTitle: 'الخطوة 1: القراءة الدالة لمعطيات السند وتحديد الشروط والنتائج',
                tutorDialogue: '', // توجيه الأستاذ السقراطي
                
                // سؤال التحقق المعطل للمتابعة (Gated Checkpoint)
                checkpoint: {
                  id: 'cp_1',
                  questionPrompt: '', // نص السؤال الدقيق
                  hintText: '', // تلميح يظهر عند الطلب دون حرق الإجابة
                  options: [
                    {
                      id: 'opt_1',
                      text: '',
                      isCorrect: false,
                      rationale: '', // تعليل بيداغوجي: لماذا هذا الخيار خاطئ (الفخ المنهجي)
                    },
                    {
                      id: 'opt_2',
                      text: '',
                      isCorrect: true,
                      rationale: '', // تعليل بيداغوجي: سبب صحة الخيار وتوافقه مع المعايير الوزارية
                    },
                    {
                      id: 'opt_3',
                      text: '',
                      isCorrect: false,
                      rationale: '',
                    }
                  ]
                }
              }
            ],

            // المرحلة 3: كشف الحل النموذجي وشبكة التقويم الوزارية (Rubric)
            stage3_official_resolution: {
              solutionTitle: 'شبكة التقويم والحل النموذجي للبكالوريا الرسمية',
              
              // البنية الهيكلية للنص العلمي (في حال التمرين 1)
              scientificTextStructure: {
                introduction: {
                  contextText: '',
                  problemStatement: '',
                  allocatedPoints: 1.0,
                },
                development: {
                  paragraphs: [],
                  allocatedPoints: 3.0,
                },
                conclusion: {
                  summaryAnswer: '',
                  allocatedPoints: 1.0,
                }
              },

              // سلم التنقيط المجزأ (0.25 / 0.50) لتمكين التقييم الذاتي
              rubricIndicators: [
                {
                  id: 'ind_1',
                  category: 'المقدمة',
                  description: 'سياق سليم + طرح المشكل العلمي بدقة',
                  points: 0.5,
                },
                {
                  id: 'ind_2',
                  category: 'استغلال الوثيقة',
                  description: 'تحديد دور ARN بوليميراز وتدرج أطوال الخيوط',
                  points: 1.0,
                },
                {
                  id: 'ind_3',
                  category: 'العرض (المرحلة 1)',
                  description: 'آلية الانطلاق والاستطالة وتكامل القواعد',
                  points: 1.0,
                },
                {
                  id: 'ind_4',
                  category: 'العرض (المرحلة 2)',
                  description: 'آلية النهاية ومصير الـ ARNm المتشكل',
                  points: 1.0,
                },
                {
                  id: 'ind_5',
                  category: 'الخاتمة',
                  description: 'إجابة مباشرة ومختصرة تجيب عن المشكل',
                  points: 0.5,
                }
              ],

              // كاشف الفخاخ والأخطاء الشائعة (Trap Busters)
              trapBusters: [
                {
                  mistakeTitle: 'فخ خلط المقرات والظواهر',
                  description: 'الخلط بين مقر وظاهرة الاستنساخ (في النواة) ومقر وظاهرة الترجمة (في الهيولى).',
                  penaltyScore: '-0.50 ن في البكالوريا',
                  preventionMethod: 'التدقيق في موقع حدوث الظاهرة والعضيات الموضحة في السند.',
                }
              ]
            }
          }
        }
      ]
    }
  ]
};

export default curriculumTemplate;

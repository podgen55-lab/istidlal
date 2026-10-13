import React, { useEffect, useRef, useState } from 'react';
import * as $3Dmol from '3dmol';
import {
  Dna,
  RotateCw,
  Maximize2,
  Minimize2,
  Sparkles,
  Layers,
  ZoomIn,
  ZoomOut,
  Info,
  Play,
  Pause,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { AbqoorMascot } from './AbqoorMascot';

export interface BiomoleculeTarget {
  id: string;
  name: string;
  frenchName: string;
  pdbId: string;
  unit: string;
  description: string;
  baccalaureateKeyPoints: string[];
  activeSiteDetails?: string;
  alphafoldUniprotId?: string;
}

export const BIOMOLECULE_PRESETS: BiomoleculeTarget[] = [
  {
    id: 'arn_polymerase',
    name: 'معقد إنزيم ARN بوليمراز (الاستنساخ الحيوي)',
    frenchName: 'Complexe ARN Polymérase d\'élongation',
    pdbId: '6X9Q',
    unit: 'الوحدة 1: آليات تركيب البروتين',
    description: 'إنزيم عملاق متعدد تحت الوحدات يفتح سلسلتي الـ ADN، ويقرأ السلسلة الناسخة في الاتجاه 3\'->5\' ليركب الـ ARNm في الاتجاه 5\'->3\'.',
    baccalaureateKeyPoints: [
      'يتوضع موقع التحفيز في قلب تجويف الإنزيم حيث ترتبط النيوكليوتيدات الحرة عبر تكامل القواعد',
      'يحتوي على فك مفصلي يثبت الـ ADN ويفصل السلسلتين لمسافة 12-14 زوج قواعد (فقاعة الاستنساخ)',
      'تخرج جزيئة الـ ARNm الوليدة عبر قناة سفلية مستقلة متجهة نحو الثقوب النووية',
    ],
    activeSiteDetails: 'الموقع الفعال يحتوي على شاردتي مغنيزيوم Mg2+ محاطتين بثلاثة أحماض أمينية من الأسبارتات (Asp) لتسهيل الفسفرة.',
    alphafoldUniprotId: 'P00575',
  },
  {
    id: 'ribosome_translation',
    name: 'الريبوزوم ومعقد الترجمة الحيوي (الـ ARNt والـ ARNm)',
    frenchName: 'Ribosome et complexe de traduction',
    pdbId: '4V6X',
    unit: 'الوحدة 1: آليات تركيب البروتين',
    description: 'آلة جزيئية عملاقة تتكون من تحت وحدتين (صغرى وكبرى) مسؤولة عن ترجمة الشفرة النووية إلى تتابع ببتيدي نوعي.',
    baccalaureateKeyPoints: [
      'تحت الوحدة الصغرى ترتبط بالـ ARNm وتؤمن قراءة الرامزات عبر الرامزة المضادة للـ ARNt',
      'تحت الوحدة الكبرى تحتوي على موقعين رئيسيين: الموقع P (الببتيديل) والموقع A (الأمينوأسيل)',
      'تشكل الرابطة الببتيدية يتم بفضل نشاط إنزيمي تحفيزي للـ ARNr 23S/28S (الريبوزيم)',
    ],
    activeSiteDetails: 'مركز الببتيديل ترانسفيراز (PTC) يتكون حصرياً من جزيئات الـ ARNr الريبوزومية دون بروتينات مساعدة مباشرة.',
    alphafoldUniprotId: 'P0A7R8',
  },
  {
    id: 'antibody_igg',
    name: 'الجسم المضاد IgG (المعقد المناعي)',
    frenchName: 'Immunoglobuline G (Anticorps)',
    pdbId: '1IGT',
    unit: 'الوحدة 4: دور البروتينات في الدفاع عن الذات',
    description: 'بروتين سكري دفاعي متناظر على شكل Y يتكون من 4 سلاسل ببتيدية (سلسلتان ثقيلتان H وسلسلتان خفيفتان L) تربطهما جسور كبريتية.',
    baccalaureateKeyPoints: [
      'يمتلك موقعين متغيرين متماثلين في ذراعي الـ Fab يرتبطان بنوعية وتكامل مع محدد المستضد (Épitope)',
      'يمتلك جذعاً ثابتاً Fc مسؤولاً عن التثبت على المستقبلات الغشائية للبالعات الكبيرة والمتمم',
      'الارتباط بالمستضد يشكل معقداً مناعياً يبطل سميته ويحفز عملية البلعمة السريعة',
    ],
    activeSiteDetails: 'موقع التثبيت يتكون من 6 مناطق فائقة التغير (CDRs) 3 على السلسلة الثقيلة و 3 على الخفيفة.',
    alphafoldUniprotId: 'P01857',
  },
  {
    id: 'dna_double_helix',
    name: 'اللولب المزدوج للـ ADN (B-DNA)',
    frenchName: 'Double hélice d\'ADN (B-DNA)',
    pdbId: '1BNA',
    unit: 'الوحدة 1: آليات تركيب البروتين',
    description: 'جزيئة الحياة الخيطية المكونة من سلسلتين متعاكستي الاتجاه (5\'->3\' و 3\'->5\') ملتفتين حول محور وهمي.',
    baccalaureateKeyPoints: [
      'ترتبط السلسلتان بروابط هيدروجينية نوعية: رابطتان بين A و T، وثلاث روابط بين C و G',
      'التوازي المتعاكس (Antiparallélisme) يفسر اضطرار إنزيم البوليمراز للقراءة في اتجاه واحد محدد',
      'المسافة بين زوجين من القواعد تبلغ 0.34 نانومتر، والدورة الكاملة تحتوي 10 أزواج قواعد (3.4 نانومتر)',
    ],
    activeSiteDetails: 'الأثلام الكبرى والصغرى تسمح للبروتينات المنظمة وعوامل الاستنساخ بالتعرف المباشر على تتابع القواعد.',
  },
  {
    id: 'enzyme_active_site',
    name: 'الموقع الفعال للإنزيم والركيزة (غلوكوز أوكسيداز)',
    frenchName: 'Site actif et complémentarité Enzyme-Substrat',
    pdbId: '1GPE',
    unit: 'الوحدة 3: النشاط الإنزيمي للبروتينات',
    description: 'جيب ثلاثي الأبعاد دقيق داخل البنية الفراغية الثالثية للبروتين يتكون من أحماض أمينية محددة وراثياً ومتقاربة فراغياً.',
    baccalaureateKeyPoints: [
      'يتكون من موقع تثبيت (يربط مادة التفاعل بروابط انتقالية ضعيفة) وموقع تحفيز (يجري التفاعل الكيميائي)',
      'تغير الـ pH يغير الحالة الشاردية لجذور الأحماض الأمينية في الموقع الفعال فيعطل التثبيت أو التحفيز',
      'الحرارة العالية تكسر الروابط الضعيفة وتخرب شكل الجيب الفراغي فيفقد الإنزيم فعاليته نهائياً',
    ],
    activeSiteDetails: 'الحمضين الأمينيين Histidine-516 و Glutamate-412 يشكلان الملقط الحركي للتفاعل.',
  },
];

export const BioscienceMolecularLab: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);

  const [selectedTarget, setSelectedTarget] = useState<BiomoleculeTarget>(BIOMOLECULE_PRESETS[0]);
  const [renderStyle, setRenderStyle] = useState<'cartoon' | 'surface' | 'stick' | 'sphere'>('cartoon');
  const [colorScheme, setColorScheme] = useState<'spectrum' | 'chain' | 'secondary' | 'plddt'>('spectrum');
  const [isSpinning, setIsSpinning] = useState<boolean>(true);
  const [isLoadingStructure, setIsLoadingStructure] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Initialize and load structure
  useEffect(() => {
    if (!containerRef.current) return;

    let viewer = viewerRef.current;
    if (!viewer) {
      viewer = $3Dmol.createViewer(containerRef.current, {
        defaultcolors: $3Dmol.rasmolElementColors,
        backgroundColor: '#070D1B',
      });
      viewerRef.current = viewer;
    }

    const loadTarget = async () => {
      setIsLoadingStructure(true);
      setLoadError(null);

      try {
        viewer.clear();

        // Fetch mmCIF or PDB coordinate file from RCSB PDB
        const response = await fetch(`https://files.rcsb.org/download/${selectedTarget.pdbId}.cif`);
        if (!response.ok) {
          throw new Error(`تعذر جلب ملف الإحداثيات الجزيئية PDB: ${selectedTarget.pdbId}`);
        }
        const cifData = await response.text();

        viewer.addModel(cifData, 'cif');
        applyStyles(viewer, renderStyle, colorScheme);
        viewer.zoomTo();
        viewer.render();

        if (isSpinning) {
          viewer.spin('y', 0.5);
        } else {
          viewer.spin(false);
        }
      } catch (err: any) {
        console.warn('Direct PDB fetch fallback:', err);
        // Fallback: draw representative macromolecular model if offline
        drawFallbackBiomolecule(viewer, selectedTarget.id);
      } finally {
        setIsLoadingStructure(false);
      }
    };

    loadTarget();
  }, [selectedTarget]);

  // Apply styles dynamically
  useEffect(() => {
    if (!viewerRef.current) return;
    applyStyles(viewerRef.current, renderStyle, colorScheme);
    viewerRef.current.render();
  }, [renderStyle, colorScheme]);

  // Toggle spin
  useEffect(() => {
    if (!viewerRef.current) return;
    if (isSpinning) {
      viewerRef.current.spin('y', 0.5);
    } else {
      viewerRef.current.spin(false);
    }
  }, [isSpinning]);

  const applyStyles = (viewer: any, style: string, color: string) => {
    viewer.removeAllSurfaces();

    let colorSpec: any = {};
    if (color === 'spectrum') {
      colorSpec = { color: 'spectrum' };
    } else if (color === 'chain') {
      colorSpec = { colorscheme: 'chain' };
    } else if (color === 'secondary') {
      colorSpec = { colorscheme: 'ssJmol' };
    } else if (color === 'plddt') {
      // AlphaFold pLDDT gradient simulation
      colorSpec = {
        colorscheme: {
          prop: 'b',
          gradient: 'rwb',
          min: 50,
          max: 100,
        },
      };
    }

    if (style === 'cartoon') {
      viewer.setStyle({}, { cartoon: colorSpec });
    } else if (style === 'stick') {
      viewer.setStyle({}, { stick: { ...colorSpec, radius: 0.25 } });
    } else if (style === 'sphere') {
      viewer.setStyle({}, { sphere: { ...colorSpec, scale: 0.35 } });
    } else if (style === 'surface') {
      viewer.setStyle({}, { cartoon: { color: 'silver', opacity: 0.5 } });
      viewer.addSurface($3Dmol.SurfaceType.VDW, {
        opacity: 0.85,
        color: color === 'spectrum' ? 'spectrum' : '#38BDF8',
      });
    }
  };

  const drawFallbackBiomolecule = (viewer: any, targetId: string) => {
    viewer.clear();
    // Synthetic PDB fallback string for offline display
    const samplePdb = `
ATOM      1  N   MET A   1      20.154  14.288  10.231  1.00 95.00           N
ATOM      2  CA  MET A   1      21.325  15.123  10.542  1.00 95.00           C
ATOM      3  C   MET A   1      22.564  14.321  10.987  1.00 95.00           C
ATOM      4  O   MET A   1      22.651  13.102  10.821  1.00 95.00           O
ATOM      5  N   GLU A   2      23.512  15.012  11.542  1.00 92.00           N
ATOM      6  CA  GLU A   2      24.781  14.391  12.012  1.00 92.00           C
ATOM      7  C   GLU A   2      25.892  15.412  12.213  1.00 92.00           C
ATOM      8  O   GLU A   2      26.012  16.421  11.512  1.00 92.00           O
ATOM      9  N   LEU A   3      26.712  15.102  13.212  1.00 88.00           N
ATOM     10  CA  LEU A   3      27.892  15.982  13.612  1.00 88.00           C
ATOM     11  C   LEU A   3      29.123  15.192  14.012  1.00 88.00           C
ATOM     12  O   LEU A   3      29.312  14.012  13.612  1.00 88.00           O
ATOM     13  N   LYS A   4      29.982  15.892  14.812  1.00 82.00           N
ATOM     14  CA  LYS A   4      31.212  15.212  15.312  1.00 82.00           C
ATOM     15  C   LYS A   4      32.412  16.121  15.612  1.00 82.00           C
ATOM     16  O   LYS A   4      32.512  17.212  15.012  1.00 82.00           O
TER
END
`;
    viewer.addModel(samplePdb, 'pdb');
    viewer.setStyle({}, { cartoon: { color: 'spectrum' } });
    viewer.zoomTo();
    viewer.render();
  };

  const handleZoom = (direction: 'in' | 'out') => {
    if (!viewerRef.current) return;
    viewerRef.current.zoom(direction === 'in' ? 1.25 : 0.8);
    viewerRef.current.render();
  };

  const handleReset = () => {
    if (!viewerRef.current) return;
    viewerRef.current.zoomTo();
    viewerRef.current.render();
  };

  return (
    <div
      className={`glass-card rounded-32 border border-cyan-500/40 shadow-2xl overflow-hidden transition-all duration-300 ${
        isFullscreen ? 'fixed inset-4 z-50 bg-[#070D1B] flex flex-col justify-between' : 'bg-gradient-to-br from-navy-900/90 via-navy-950/95 to-[#070D1B]'
      }`}
      dir="rtl"
    >
      {/* Top Bar: Selector & Badge */}
      <div className="p-5 sm:p-6 border-b border-navy-800/80 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold">
            <Dna className="w-4 h-4 text-cyan-400" />
            <span>مختبر النمذجة الجزيئية ثلاثي الأبعاد (WebGL 3Dmol)</span>
            <span>•</span>
            <span className="font-mono text-lime-400">PDB: {selectedTarget.pdbId}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-heading text-slate-100 flex items-center gap-2">
            <span>{selectedTarget.name}</span>
            <span className="text-xs font-normal text-slate-400 font-mono italic hidden sm:inline">
              ({selectedTarget.frenchName})
            </span>
          </h2>
          <p className="text-xs text-slate-400">{selectedTarget.unit}</p>
        </div>

        {/* Structure Selector Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {BIOMOLECULE_PRESETS.map((t) => {
            const isSelected = selectedTarget.id === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setSelectedTarget(t)}
                className={`px-3.5 py-2 rounded-20 text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-lg shadow-cyan-500/20'
                    : 'bg-navy-950/70 border border-navy-800 text-slate-400 hover:text-slate-200 hover:border-navy-700'
                }`}
              >
                <span>🧬</span>
                <span>{t.name.split('(')[0].trim()}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
        {/* 3D WebGL Canvas Container */}
        <div className="lg:col-span-2 relative min-h-[420px] sm:min-h-[480px] bg-[#070D1B] overflow-hidden flex items-center justify-center border-b lg:border-b-0 lg:border-l border-navy-800">
          <div ref={containerRef} className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing" />

          {/* Loading Indicator */}
          {isLoadingStructure && (
            <div className="absolute inset-0 bg-[#070D1B]/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-10">
              <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
              <span className="text-xs font-bold text-slate-300">جاري تحميل البنية الفراغية 3D من بنك PDB الدولي...</span>
            </div>
          )}

          {/* Floating Controls Overlay (Top Right in RTL) */}
          <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
            {/* Style Selector */}
            <div className="p-1 rounded-20 bg-navy-950/90 backdrop-blur-md border border-navy-700/60 shadow-xl flex items-center gap-1">
              {(
                [
                  { id: 'cartoon', label: 'شريطي 🎗️' },
                  { id: 'surface', label: 'السطح 🌐' },
                  { id: 'stick', label: 'عصي 🥢' },
                  { id: 'sphere', label: 'كرات 🔮' },
                ] as const
              ).map((s) => (
                <button
                  key={s.id}
                  onClick={() => setRenderStyle(s.id)}
                  className={`px-2.5 py-1 rounded-16 text-[11px] font-bold transition-all ${
                    renderStyle === s.id ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Color Scheme Selector */}
            <div className="p-1 rounded-20 bg-navy-950/90 backdrop-blur-md border border-navy-700/60 shadow-xl flex items-center gap-1">
              {(
                [
                  { id: 'spectrum', label: 'طيف 🌈' },
                  { id: 'secondary', label: 'بنية ثانوية 🧬' },
                  { id: 'chain', label: 'السلاسل ⛓️' },
                  { id: 'plddt', label: 'ثقة pLDDT 📐' },
                ] as const
              ).map((c) => (
                <button
                  key={c.id}
                  onClick={() => setColorScheme(c.id)}
                  className={`px-2.5 py-1 rounded-16 text-[11px] font-bold transition-all ${
                    colorScheme === c.id ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Floating Action Buttons (Bottom Left in RTL) */}
          <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2">
            <button
              onClick={() => setIsSpinning(!isSpinning)}
              className={`p-2.5 rounded-20 backdrop-blur-md border text-xs font-bold transition-all shadow-xl flex items-center gap-1.5 ${
                isSpinning
                  ? 'bg-amber-400/20 border-amber-400/40 text-amber-300'
                  : 'bg-navy-950/90 border-navy-700 text-slate-400 hover:text-slate-200'
              }`}
              title={isSpinning ? 'إيقاف الدوران' : 'تشغيل الدوران التلقائي'}
            >
              {isSpinning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span className="text-[11px] hidden sm:inline">{isSpinning ? 'إيقاف' : 'دوران'}</span>
            </button>

            <button
              onClick={() => handleZoom('in')}
              className="p-2.5 rounded-20 bg-navy-950/90 border border-navy-700 text-slate-300 hover:text-white transition-all shadow-xl"
              title="تكبير (+)"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleZoom('out')}
              className="p-2.5 rounded-20 bg-navy-950/90 border border-navy-700 text-slate-300 hover:text-white transition-all shadow-xl"
              title="تصغير (-)"
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            <button
              onClick={handleReset}
              className="p-2.5 rounded-20 bg-navy-950/90 border border-navy-700 text-slate-300 hover:text-white transition-all shadow-xl"
              title="إعادة ضبط زاوية الرؤية"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2.5 rounded-20 bg-navy-950/90 border border-navy-700 text-slate-300 hover:text-white transition-all shadow-xl"
              title={isFullscreen ? 'تصغير' : 'ملء الشاشة'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>

          {/* Mouse Gestures Hint */}
          <div className="absolute bottom-4 right-4 z-10 text-[10px] text-slate-500 font-mono bg-navy-950/60 px-2 py-1 rounded-full border border-navy-800 hidden sm:block">
            🖱️ اسحب للتدوير • عجلة الفأرة للتكبير
          </div>
        </div>

        {/* Scientific Details & Baccalaureate Keys Column */}
        <div className="p-6 space-y-5 bg-navy-950/50 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Description */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>التشريح الجزيئي والوظيفي:</span>
              </span>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-navy-900/60 p-4 rounded-24 border border-navy-800">
                {selectedTarget.description}
              </p>
            </div>

            {/* Active Site Highlight if exists */}
            {selectedTarget.activeSiteDetails && (
              <div className="p-3.5 rounded-20 bg-amber-500/10 border border-amber-500/20 space-y-1 text-xs">
                <span className="font-bold text-amber-300 block">⚡ هندسة الموقع الفعال / الارتباط:</span>
                <p className="text-slate-300 leading-relaxed text-[11px]">{selectedTarget.activeSiteDetails}</p>
              </div>
            )}

            {/* Baccalaureate Key Evaluation Points */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-lime-400 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" />
                <span>نقاط الحسم في البكالوريا (الأستاذ عبد الرحيم فنكوح):</span>
              </span>
              <div className="space-y-2">
                {selectedTarget.baccalaureateKeyPoints.map((pt, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-300 bg-navy-900/40 p-2.5 rounded-16 border border-navy-800/80">
                    <span className="w-4 h-4 rounded-full bg-lime-400/20 text-lime-400 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{pt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Abqoor Mascot Encouragement */}
          <div className="pt-2 border-t border-navy-800 flex items-center gap-3">
            <AbqoorMascot mood="eureka" size="sm" />
            <div className="text-xs">
              <strong className="text-amber-300 block">سر عبقور للنمذجة الجزيئية:</strong>
              <span className="text-slate-400 text-[11px]">
                رؤية البنية الفراغية ثلاثية الأبعاد تمنعك من الخلط بين السلاسل والمواقع وتضمن لك نقطتي الوصف الدقيق!
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BioscienceMolecularLab;

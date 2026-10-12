import React, { useState } from 'react';
import { AI_AGENTS } from '../data/mockData';
import { AgentInfo } from '../types';
import { X, Send, Sparkles, CheckCircle2 } from 'lucide-react';

interface AgentTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAgent?: (agent: AgentInfo) => void;
}

export const AgentTeamModal: React.FC<AgentTeamModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedAgent, setSelectedAgent] = useState<AgentInfo>(AI_AGENTS[0]);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatLog, setChatLog] = useState<{ role: 'user' | 'agent'; text: string; agentIcon?: string }[]>([
    {
      role: 'agent',
      text: 'أهلاً بك يا بطل! أنا «المرشد» 🧭 من فريق استدلال. أنا هنا لمساعدتك على إتقان مفاهيم علوم الطبيعة والحياة والربط السببي المنهجي (سبب ← آلية ← نتيجة ← قاعدة). ماذا تريد أن نستكشف اليوم؟',
      agentIcon: '🧭'
    }
  ]);

  if (!isOpen) return null;

  const handleSendPrompt = async (promptToSend?: string) => {
    const text = promptToSend || customPrompt;
    if (!text.trim()) return;

    const userMessage = { role: 'user' as const, text };
    setChatLog((prev) => [...prev, userMessage]);
    setCustomPrompt('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/gemini/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `[طرح السؤال على الوكيل: ${selectedAgent.name}] ${text}`
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.text) {
          setChatLog((prev) => [
            ...prev,
            { role: 'agent', text: data.text, agentIcon: selectedAgent.icon }
          ]);
          setIsLoading(false);
          return;
        }
      }
    } catch (e) {
      console.warn('API call fallback in modal:', e);
    }

    // High quality offline pedagogical response
    setTimeout(() => {
      let reply = '';
      if (selectedAgent.id === 'TUTOR') {
        reply = `✅ سؤال منهجي ذكي! حسب دليل المنهجية والمعايير الوزارية لبكالوريا الجزائر:
القاعدة المنهجية: التفسير دوماً يمر بسلسلة منتظمة:
1. السبب: توفر الشروط النوعية.
2. الآلية: تثبت الإنزيم وكسر الروابط الهيدروجينية.
3. النتيجة: انطلاق الاستنساخ واستطالة جزيئة الـ ARNm في الاتجاه 5' إلى 3'.
4. القاعدة: كل تغير بنيوي يؤثر مباشرة على الوظيفة البيولوجية.`;
      } else if (selectedAgent.id === 'DOC_ANALYST') {
        reply = `🔍 ممتاز! في تحليل الوثيقة نحرص على:
1. التعريف بالسند (نوع الوثيقة والمتغيرات).
2. الشواهد الرقمية المباشرة (دون إغفال أي قيمة).
3. استخراج العلاقة الدالة.
4. الاستنتاج الدقيق المرتبط بالمشكل.`;
      } else {
        reply = `✨ تم تسجيل سؤالك لدى «${selectedAgent.name}» ${selectedAgent.icon}. نحن نعمل وفق معايير الاختبار الوزاري الصارم لبكالوريا الجزائر.`;
      }

      setChatLog((prev) => [
        ...prev,
        { role: 'agent', text: reply, agentIcon: selectedAgent.icon }
      ]);
      setIsLoading(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-navy-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl h-[90vh] max-h-[800px] flex flex-col bg-navy-900 border border-violet-500/30 rounded-32 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-navy-700/80 bg-navy-900/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-cyan-400 flex items-center justify-center text-xl shadow-lg">
              ✨
            </div>
            <div>
              <h2 className="text-xl font-heading text-slate-100 flex items-center gap-2">
                فريق استدلال للذكاء الاصطناعي
                <span className="text-[10px] font-sans px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 font-bold border border-violet-500/30">
                  8 وكلاء متخصصين
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                وكلاء مدرَّبون على المنهجية الوزارية الرسمية لاختبار مادة علوم الطبيعة والحياة
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-navy-800 hover:bg-navy-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Agent Selector Bar */}
        <div className="px-4 py-3 border-b border-navy-800 bg-navy-950/40 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 min-w-max">
            {AI_AGENTS.map((agent) => {
              const isSelected = selectedAgent.id === agent.id;
              return (
                <button
                  key={agent.id}
                  onClick={() => {
                    setSelectedAgent(agent);
                    setChatLog((prev) => [
                      ...prev,
                      {
                        role: 'agent',
                        text: `أهلاً بك! معك ${agent.name} ${agent.icon}. ${agent.description}`,
                        agentIcon: agent.icon
                      }
                    ]);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-24 text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30 scale-105'
                      : 'bg-navy-800/80 text-slate-300 hover:bg-navy-800 border border-navy-700/50'
                  }`}
                >
                  <span className="text-base">{agent.icon}</span>
                  <span>{agent.name}</span>
                  {agent.isTeacherOnly && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300">أستاذ</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Agent Info Banner */}
        <div className="px-6 py-2.5 bg-violet-950/20 border-b border-violet-500/10 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-lg">{selectedAgent.icon}</span>
            <span className="font-bold text-violet-300">{selectedAgent.name}:</span>
            <span className="text-slate-300">{selectedAgent.role}</span>
          </div>
          <button
            onClick={() => handleSendPrompt(selectedAgent.samplePrompt)}
            className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1 font-bold"
          >
            <Sparkles className="w-3 h-3" />
            سؤال تجريبي مقترح
          </button>
        </div>

        {/* Chat / Interaction Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {chatLog.map((msg, index) => {
            const isAgent = msg.role === 'agent';
            return (
              <div
                key={index}
                className={`flex gap-3 ${isAgent ? 'justify-start' : 'justify-end'}`}
              >
                {isAgent && (
                  <div className="w-8 h-8 rounded-full bg-violet-600/30 border border-violet-500/40 flex items-center justify-center text-sm flex-shrink-0">
                    {msg.agentIcon || '🤖'}
                  </div>
                )}
                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-24 p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                    isAgent
                      ? 'glass-card bg-navy-800/90 text-slate-100 border-navy-700'
                      : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })}
          {isLoading && (
            <div className="flex gap-3 items-center text-slate-400 text-xs py-2">
              <span className="animate-spin text-base">⏳</span>
              <span>«{selectedAgent.name}» يحلل الاستجابة وفق معايير المنهجية...</span>
            </div>
          )}
        </div>

        {/* Quick prompt chips */}
        <div className="px-4 py-2 border-t border-navy-800/80 bg-navy-950/60 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[10px] text-slate-400 font-bold whitespace-nowrap">إجراءات سريعة:</span>
          <button
            onClick={() => handleSendPrompt('حلّل هذه الوثيقة وقسمها إلى فترات زمنية دالة')}
            className="px-2.5 py-1 rounded-full bg-navy-800 hover:bg-violet-900/40 border border-navy-700 text-[11px] text-slate-300 whitespace-nowrap"
          >
            🔍 حلّل هذه الوثيقة
          </button>
          <button
            onClick={() => handleSendPrompt('اكتب لي خطة نص علمي مهيكلة بمقدمة وعرض وخاتمة')}
            className="px-2.5 py-1 rounded-full bg-navy-800 hover:bg-violet-900/40 border border-navy-700 text-[11px] text-slate-300 whitespace-nowrap"
          >
            ✍️ خطة نص علمي
          </button>
          <button
            onClick={() => handleSendPrompt('ما هي شروط الرسم التخطيطي التفسيري في البكالوريا؟')}
            className="px-2.5 py-1 rounded-full bg-navy-800 hover:bg-violet-900/40 border border-navy-700 text-[11px] text-slate-300 whitespace-nowrap"
          >
            📐 شروط الرسم التخطيطي
          </button>
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-navy-800 bg-navy-900/90">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendPrompt();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder={`اسأل «${selectedAgent.name}» عن المنهجية أو الدرس...`}
              className="flex-1 bg-navy-950 border border-navy-700 rounded-24 px-4 py-3 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-violet-500"
            />
            <button
              type="submit"
              disabled={isLoading || !customPrompt.trim()}
              className="w-11 h-11 rounded-24 bg-gradient-to-r from-violet-600 to-cyan-500 text-white flex items-center justify-center hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              <Send className="w-4 h-4 transform rotate-180" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

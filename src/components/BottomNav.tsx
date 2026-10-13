import React from 'react';
import { Home, BookOpen, Headphones, Video, Gamepad2, Award, TrendingUp } from 'lucide-react';

interface BottomNavProps {
  activeView: string;
  setActiveView: (view: string) => void;
  onOpenAgentTeam: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeView,
  setActiveView,
  onOpenAgentTeam,
}) => {
  const tabs = [
    { id: 'home', label: 'الرئيسية', icon: Home },
    { id: 'courses', label: 'الدروس', icon: BookOpen },
    { id: 'dashboard', label: 'المؤشرات', icon: TrendingUp },
    { id: 'games', label: 'ألعاب', icon: Gamepad2 },
    { id: 'assessment', label: 'تقييم', icon: Award },
  ];

  return (
    <>
      {/* Floating Team AI Agent Button */}
      <div className="fixed bottom-20 left-4 z-40 md:hidden">
        <button
          onClick={onOpenAgentTeam}
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-bold text-xs shadow-xl shadow-violet-600/40 border border-white/20 hover:scale-105 active:scale-95 transition-transform"
        >
          <span className="text-base animate-pulse">✨</span>
          <span>فريق استدلال</span>
        </button>
      </div>

      {/* Bottom Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-navy-900/95 backdrop-blur-lg border-t border-navy-700/60 py-2 px-3 md:hidden">
        <div className="flex items-center justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeView === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
                className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition-all ${
                  isActive
                    ? 'text-lime-400 scale-105'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                <span className={`text-[10px] ${isActive ? 'font-bold' : 'font-medium'}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};

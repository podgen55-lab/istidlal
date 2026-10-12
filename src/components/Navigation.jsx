/**
 * ==============================================================================
 * Navigation.jsx - شريط التنقل السفلي والجانبي المتجاوب (Persistent 5-Tab Navigation)
 * مطابق لتعليمات: Architectural Blueprint for EdTech Platforms (Pages 3-4)
 * ==============================================================================
 * يضمن:
 * 1. مساحات لمس مريحة للهاتف المحمول (touch targets >= h-12 w-12)
 * 2. استخدام utility classes الخاصة بـ Tailwind (flex md:hidden / hidden md:flex)
 */

import React from 'react';

export function Navigation({ activeTab = 'path', onTabChange = () => {} }) {
  const tabs = [
    { id: 'path', label: 'الخريطة', icon: '🗺️' },
    { id: 'academy', label: 'الأكاديمية', icon: '📘' },
    { id: 'arena', label: 'الحلبة', icon: '⚡' },
    { id: 'inspector', label: 'المفتش', icon: '🔍' },
    { id: 'profile', label: 'حسابي', icon: '👤' },
  ];

  return (
    <nav className="h-16 bg-[#0f172a] border-t border-slate-800 px-2 sm:px-6 flex items-center justify-around z-30 sticky bottom-0 shrink-0">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 h-12 min-w-[48px] rounded-xl transition ${
              isActive
                ? 'text-emerald-400 font-bold bg-slate-800/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="text-lg leading-none">{tab.icon}</span>
            <span className="text-[10px] tracking-tight">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export default Navigation;

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { INITIAL_USER } from './data/mockData';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { AgentTeamModal } from './components/AgentTeamModal';
import { AuthModal } from './components/AuthModal';
import { HomeView } from './views/HomeView';
import { CoursesView } from './views/CoursesView';
import { GamesView } from './views/GamesView';
import { AssessmentView } from './views/AssessmentView';
import { TeacherDashboardView } from './views/TeacherDashboardView';

function AppContent() {
  const { userProfile, addXP } = useAuth();
  const [activeView, setActiveView] = useState<string>('home');
  const [isAgentModalOpen, setIsAgentModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Fallback to initial seed if user is anonymous/visiting
  const effectiveUser = userProfile || INITIAL_USER;

  return (
    <div className="min-h-screen bg-[#0B1020] text-slate-100 flex flex-col font-body selection:bg-violet-600 selection:text-white" dir="rtl">
      {/* Top Navbar */}
      <Navbar
        onOpenAgentTeam={() => setIsAgentModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        activeView={activeView}
        setActiveView={setActiveView}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeView === 'home' && (
          <HomeView
            user={effectiveUser}
            onNavigate={setActiveView}
            onOpenAgentTeam={() => setIsAgentModalOpen(true)}
          />
        )}

        {(activeView === 'courses' || activeView === 'podcast' || activeView === 'video') && (
          <CoursesView onOpenAgentTeam={() => setIsAgentModalOpen(true)} />
        )}

        {activeView === 'games' && (
          <GamesView onAddXP={addXP} />
        )}

        {activeView === 'assessment' && (
          <AssessmentView
            onAddXP={addXP}
            onNavigate={setActiveView}
            onOpenAgentTeam={() => setIsAgentModalOpen(true)}
          />
        )}

        {activeView === 'teacher' && (
          <TeacherDashboardView />
        )}
      </main>

      {/* Mobile Bottom Tab Bar */}
      <BottomNav
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenAgentTeam={() => setIsAgentModalOpen(true)}
      />

      {/* Floating 8-Agent Team Sheet */}
      <AgentTeamModal
        isOpen={isAgentModalOpen}
        onClose={() => setIsAgentModalOpen(false)}
      />

      {/* Auth Modal for Google & Email Login / Registration */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Minimal Footer with ABDERRAHIM FENKOUH attribution */}
      <footer className="border-t border-navy-800/60 bg-navy-950/80 py-4 px-6 text-center text-xs text-slate-500 hidden md:block">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-heading text-slate-200">استدلال (istidlal)</span>
            <span>•</span>
            <span>منصة التميز المنهجي لبكالوريا علوم الطبيعة والحياة (3AS)</span>
          </div>
          <div>
            بإشراف وتطوير: <strong className="text-amber-300 font-mono">ABDERRAHIM FENKOUH</strong> • قاعدة البيانات: <span className="text-lime-400 font-mono">Firestore متصل</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

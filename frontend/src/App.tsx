import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Sidebar, NavTab } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { StoresPage } from './pages/StoresPage';
import { CamerasPage } from './pages/CamerasPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { VideoAnalysisPage } from './pages/VideoAnalysisPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';

const AppContent: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'register'>('login');

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#F8FAFC] text-slate-900">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#00E676]/30 border-t-[#00E676] rounded-full animate-spin" />
          <p className="text-xs font-bold tracking-wider uppercase text-[#64748B]">
            Initializing CAM System...
          </p>
        </div>
      </div>
    );
  }

  // If user is not logged in, render authentication flow
  if (!isAuthenticated || !user) {
    if (authView === 'register') {
      return <RegisterPage onNavigateToLogin={() => setAuthView('login')} />;
    }
    return <LoginPage onNavigateToRegister={() => setAuthView('register')} />;
  }

  // Main Dashboard Shell with Clean White theme layout (#F8FAFC canvas, #FFFFFF cards)
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex transition-colors font-sans selection:bg-[#00E676] selection:text-slate-950">
      {/* Persistent Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          isSidebarCollapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        {/* Sticky Top Navbar */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Dynamic Tab Page Body */}
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto space-y-8">
          {activeTab === 'dashboard' && (
            <DashboardPage onNavigateTab={(tab) => setActiveTab(tab)} />
          )}
          {activeTab === 'stores' && <StoresPage />}
          {activeTab === 'cameras' && <CamerasPage />}
          {activeTab === 'analytics' && <AnalyticsPage />}
          {activeTab === 'video' && <VideoAnalysisPage />}
          {activeTab === 'reports' && <ReportsPage />}
          {activeTab === 'settings' && <SettingsPage />}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

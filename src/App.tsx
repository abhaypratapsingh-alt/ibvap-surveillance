import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SurveillanceProvider } from './context/SurveillanceContext';
import { Sidebar } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { DemoModeBar } from './components/common/DemoModeBar';
import { LoginPage } from './pages/LoginPage';
import { CommandCenterPage } from './pages/CommandCenterPage';
import { LiveSurveillancePage } from './pages/LiveSurveillancePage';
import { AiDetectionPage } from './pages/AiDetectionPage';
import { TrackingPage } from './pages/TrackingPage';
import { VirtualFencePage } from './pages/VirtualFencePage';
import { ThreatAssessmentPage } from './pages/ThreatAssessmentPage';
import { WorkflowPage } from './pages/WorkflowPage';
import { CameraManagementPage } from './pages/CameraManagementPage';
import { ReportsPage } from './pages/ReportsPage';
import { ArchitecturePage } from './pages/ArchitecturePage';
import { SettingsPage } from './pages/SettingsPage';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState<string>('dashboard');

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <CommandCenterPage onNavigate={setCurrentPage} />;
      case 'surveillance':
        return <LiveSurveillancePage />;
      case 'detection':
        return <AiDetectionPage />;
      case 'tracking':
        return <TrackingPage />;
      case 'fence':
        return <VirtualFencePage />;
      case 'threat':
        return <ThreatAssessmentPage />;
      case 'workflow':
        return <WorkflowPage />;
      case 'cameras':
        return <CameraManagementPage />;
      case 'reports':
        return <ReportsPage />;
      case 'architecture':
        return <ArchitecturePage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <CommandCenterPage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="flex h-screen w-screen bg-[#06090e] text-slate-100 overflow-hidden font-sans">
      {/* Persistent Tactical Left Sidebar */}
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />

      {/* Main Command Operations Workspace */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header Bar */}
        <Header onNavigate={setCurrentPage} />

        {/* Demo Mode Interactive Script Bar */}
        <DemoModeBar />

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto bg-[#060a12] relative">
          {renderCurrentPage()}
        </main>
      </div>
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <SurveillanceProvider>
        <AppContent />
      </SurveillanceProvider>
    </AuthProvider>
  );
}

export default App;

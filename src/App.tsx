import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';

import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { ToastContainer } from './components/common/ToastContainer';
import { OfflineIndicator } from './components/common/OfflineIndicator';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { FarmersPage } from './pages/FarmersPage';
import { FarmerDetailPage } from './pages/FarmerDetailPage';
import { HealthWorkerPage } from './pages/HealthWorkerPage';
import { HealthRiskEnginePage } from './pages/HealthRiskEnginePage';
import { AgricultureIntelligencePage } from './pages/AgricultureIntelligencePage';
import { CrossDomainEnginePage } from './pages/CrossDomainEnginePage';
import { AlertsPage } from './pages/AlertsPage';
import { OfflineSyncPage } from './pages/OfflineSyncPage';

const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Settings
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Configure your Gram Setu workspace and application preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="font-bold text-slate-900">
            Application
          </h2>

          <div className="mt-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Offline-first mode
                </p>
                <p className="text-xs text-slate-500">
                  Store field records locally when connectivity is unavailable.
                </p>
              </div>

              <div className="w-11 h-6 rounded-full bg-teal-600 relative">
                <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white" />
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <p className="text-sm font-semibold text-slate-800">
                Default location
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Assam, India
              </p>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <p className="text-sm font-semibold text-slate-800">
                Application version
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Gram Setu v1.0 — PoC
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="font-bold text-slate-900">
            Risk Engine
          </h2>

          <div className="mt-5 space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-slate-100">
              <span className="text-sm text-slate-700">
                Health risk assessment
              </span>
              <span className="text-xs font-bold text-emerald-600">
                Enabled
              </span>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-slate-100">
              <span className="text-sm text-slate-700">
                Agricultural risk assessment
              </span>
              <span className="text-xs font-bold text-emerald-600">
                Enabled
              </span>
            </div>

            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-slate-700">
                Cross-domain intelligence
              </span>
              <span className="text-xs font-bold text-emerald-600">
                Enabled
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-teal-50 border border-teal-100 rounded-2xl p-5">
        <p className="text-sm font-semibold text-teal-900">
          Gram Setu
        </p>
        <p className="text-xs text-teal-700 mt-1">
          Integrated Rural Risk Intelligence — Hackathon Proof of Concept
        </p>
      </div>
    </div>
  );
};

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Keep AppContext mounted and available to all pages.
  useApp();

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage onNavigate={handleNavigate} />;

      case 'farmers':
        return <FarmersPage onNavigate={handleNavigate} />;

      case 'farmer-detail':
        return <FarmerDetailPage onNavigate={handleNavigate} />;

      case 'health-workers':
        return <HealthWorkerPage onNavigate={handleNavigate} />;

      case 'health-risk':
        return <HealthRiskEnginePage />;

      case 'agri-intelligence':
        return <AgricultureIntelligencePage />;

      case 'cross-domain':
        return <CrossDomainEnginePage />;

      case 'alerts':
        return <AlertsPage />;

      case 'offline-sync':
        return <OfflineSyncPage />;

      case 'settings':
        return <SettingsPage />;

      default:
        return <DashboardPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex text-slate-900 font-sans antialiased">

      <Sidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() =>
          setIsMobileSidebarOpen(false)
        }
      />

      <div className="flex-1 flex flex-col min-w-0">

        <OfflineIndicator />

        <Navbar
          onToggleMobileMenu={() =>
            setIsMobileSidebarOpen(
              !isMobileSidebarOpen
            )
          }
          onNavigate={handleNavigate}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-16">
          {renderPage()}
        </main>

      </div>

      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
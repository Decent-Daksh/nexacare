import { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

import Dashboard from './pages/Dashboard';
import PatientHub from './pages/PatientHub';
import Appointments from './pages/Appointments';
import AICoPilot from './pages/AICoPilot';
import PharmIQ from './pages/PharmIQ';
import RevenueEngine from './pages/RevenueEngine';
import CRMOutreach from './pages/CRMOutreach';
import AnalyticsHub from './pages/AnalyticsHub';
import TeleConsult from './pages/TeleConsult';
import StaffCommand from './pages/StaffCommand';
import SettingsPage from './pages/SettingsPage';

const PAGES = {
  dashboard: Dashboard,
  patients: PatientHub,
  appointments: Appointments,
  copilot: AICoPilot,
  pharmiq: PharmIQ,
  revenue: RevenueEngine,
  crm: CRMOutreach,
  analytics: AnalyticsHub,
  tele: TeleConsult,
  staff: StaffCommand,
  settings: SettingsPage,
};

export default function App() {
  const [page, setPage] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const Page = PAGES[page] || Dashboard;

  return (
    <AuthProvider>
      <ToastProvider>
        <div className="min-h-screen bg-surface flex">
          <Sidebar
            active={page}
            onNavigate={setPage}
            mobileOpen={mobileOpen}
            onCloseMobile={() => setMobileOpen(false)}
          />
          <div className="flex-1 min-w-0 flex flex-col">
            <Topbar onOpenMobile={() => setMobileOpen(true)} />
            <main className="flex-1 p-4 md:p-6 max-w-[1500px] w-full mx-auto">
              <Page onNavigate={setPage} />
            </main>
          </div>
        </div>
      </ToastProvider>
    </AuthProvider>
  );
}

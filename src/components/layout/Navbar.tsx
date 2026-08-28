import React from 'react';
import {
  Menu,
  Globe2,
  Wifi,
  WifiOff,
  Bell,
  User,
  Shield,
  HeartPulse,
  Sprout,
  LogOut,
} from 'lucide-react';

import { useApp } from '../../context/AppContext';
import { Language, UserRole } from '../../types';

interface NavbarProps {
  onToggleMobileMenu: () => void;
  onNavigate: (page: string) => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleMobileMenu,
  onNavigate,
  onLogout,
}) => {
  const {
    t,
    language,
    setLanguage,
    isOnline,
    isSimulatedOffline,
    setIsSimulatedOffline,
    role,
    alerts,
    addToast,
  } = useApp();

  const newAlertsCount = alerts.filter(
    (alert) => alert.status === 'New'
  ).length;

  const roleLabels: Record<
    UserRole,
    {
      title: string;
      subtitle: string;
      icon: React.ReactNode;
    }
  > = {
    administrator: {
      title: 'Administrator',
      subtitle: 'State & Block Officer',
      icon: <Shield className="w-3.5 h-3.5" />,
    },

    health_worker: {
      title: 'Health Worker',
      subtitle: 'ASHA / ANM',
      icon: <HeartPulse className="w-3.5 h-3.5" />,
    },

    agri_officer: {
      title: 'Agriculture Officer',
      subtitle: 'KVK / Extension Expert',
      icon: <Sprout className="w-3.5 h-3.5" />,
    },

    farmer: {
      title: 'Farmer',
      subtitle: 'Ramesh Das (Borigaon)',
      icon: <User className="w-3.5 h-3.5" />,
    },
  };

  const activeRole = roleLabels[role];

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const lang = event.target.value as Language;

    setLanguage(lang);

    const names: Record<Language, string> = {
      en: 'English',
      as: 'অসমীয়া',
      hi: 'हिन्दी',
    };

    addToast(
      'Language Changed',
      `Interface language changed to ${names[lang]}.`,
      'success'
    );
  };

  const handleOfflineToggle = () => {
    const nextOffline = !isSimulatedOffline;

    setIsSimulatedOffline(nextOffline);

    addToast(
      nextOffline
        ? 'Offline Mode Enabled'
        : 'Online Mode Restored',
      nextOffline
        ? 'Gram Setu is now simulating a low-connectivity environment.'
        : 'Network connectivity has been restored.',
      nextOffline ? 'warning' : 'success'
    );
  };

  const handleAlerts = () => {
    onNavigate('alerts');
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">

      {/* LEFT */}
      <div className="flex items-center gap-3 min-w-0">

        {/* Mobile Menu */}
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg lg:hidden transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Product Name */}
        <div className="hidden sm:block min-w-0">
          <div className="text-sm font-extrabold text-slate-900 truncate">
            Gram Setu
          </div>

          <p className="text-[11px] text-slate-500 font-medium hidden md:block max-w-[360px] truncate">
            {t.subtitle}
          </p>
        </div>
      </div>

      {/* RIGHT CONTROLS */}
      <div className="flex items-center gap-2 md:gap-3">

        {/* Offline / Online */}
        <button
          type="button"
          onClick={handleOfflineToggle}
          title={
            isSimulatedOffline
              ? 'Click to restore online mode'
              : 'Click to simulate offline mode'
          }
          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 border transition-all ${
            isOnline
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
              : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
          }`}
        >
          {isOnline ? (
            <Wifi className="w-3.5 h-3.5" />
          ) : (
            <WifiOff className="w-3.5 h-3.5" />
          )}

          <span className="hidden sm:inline">
            {isOnline ? 'ONLINE' : 'OFFLINE'}
          </span>
        </button>

        {/* Language */}
        <div className="hidden md:flex items-center bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
          <Globe2 className="w-3.5 h-3.5 text-slate-500 mr-1.5" />

          <select
            aria-label="Select language"
            value={language}
            onChange={handleLanguageChange}
            className="text-xs font-bold text-slate-700 bg-transparent border-none p-0 pr-5 focus:ring-0 cursor-pointer outline-none"
          >
            <option value="en">English</option>
            <option value="as">অসমীয়া</option>
            <option value="hi">हिन्दी</option>
          </select>
        </div>

        {/* Active Role */}
        <div className="hidden lg:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">

          <div className="text-teal-600">
            {activeRole.icon}
          </div>

          <div className="leading-tight">
            <div className="text-[10px] font-bold text-slate-800">
              {activeRole.title}
            </div>

            <div className="text-[9px] text-slate-400">
              {activeRole.subtitle}
            </div>
          </div>
        </div>

        {/* Notifications */}
        <button
          type="button"
          onClick={handleAlerts}
          className="relative p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="View alerts"
        >
          <Bell className="w-4.5 h-4.5" />

          {newAlertsCount > 0 && (
            <span className="absolute top-1 right-1 min-w-[7px] h-[7px] rounded-full bg-rose-500 ring-2 ring-white" />
          )}
        </button>

        {/* User */}
        <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200">

          <div className="text-right hidden xl:block leading-tight">
            <p className="text-xs font-bold text-slate-800">
              {activeRole.title}
            </p>

            <p className="text-[10px] text-slate-400">
              Demo Access
            </p>
          </div>

          <div className="w-8 h-8 rounded-full bg-teal-100 border border-teal-200 flex items-center justify-center text-teal-700">
            {activeRole.icon}
          </div>
        </div>

        {/* Change Role / Logout */}
        {onLogout && (
          <button
            type="button"
            onClick={onLogout}
            title="Change role"
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            aria-label="Change role"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
};
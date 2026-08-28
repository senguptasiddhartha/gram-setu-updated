import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole, Language } from '../../types';
import {
  Menu,
  Globe,
  UserCheck,
  Bell,
  Wifi,
  WifiOff,
  Sparkles,
  Shield,
  HeartPulse,
  Sprout,
  User,
  LogOut,
} from 'lucide-react';

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
    role,
    setRole,
    language,
    setLanguage,
    t,
    isOnline,
    isSimulatedOffline,
    setIsSimulatedOffline,
    launchDemoScenario,
    alerts,
    addToast,
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const unreadAlerts = alerts.filter((a) => a.status === 'New');

  const roleLabels: Record<UserRole, { title: string; subtitle: string; icon: any }> = {
    administrator: {
      title: 'Administrator',
      subtitle: 'State & Block Officer',
      icon: <Shield className="w-4 h-4 text-purple-600" />,
    },
    health_worker: {
      title: 'Health Worker',
      subtitle: 'ASHA / ANM Supervisor',
      icon: <HeartPulse className="w-4 h-4 text-rose-600" />,
    },
    agri_officer: {
      title: 'Agri Officer',
      subtitle: 'KVK / Extension Expert',
      icon: <Sprout className="w-4 h-4 text-emerald-600" />,
    },
    farmer: {
      title: 'Farmer (Kisan)',
      subtitle: 'Ramesh Das (Borigaon)',
      icon: <User className="w-4 h-4 text-teal-600" />,
    },
  };

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    addToast('Role Switched', `Active demo viewpoint changed to ${roleLabels[newRole].title}.`, 'info');
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    const names = { en: 'English', as: 'অসমীয়া (Assamese)', hi: 'हिन्दी (Hindi)' };
    addToast('Language Changed', `Interface translated to ${names[lang]}.`, 'info');
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      {/* Left side mobile toggle & title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg lg:hidden"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:block">
          <div className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <span>Gram Setu</span>
            <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
              Low-Bandwidth PoC
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium hidden md:block">
            {t.subtitle}
          </p>
        </div>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Launch Demo Scenario Button */}
        <button
          onClick={() => launchDemoScenario()}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-lg text-xs font-bold shadow-xs hover:shadow transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Launch Demo Scenario</span>
        </button>

        {/* Online / Offline Toggle badge */}
        <button
          onClick={() => {
            setIsSimulatedOffline(!isSimulatedOffline);
            addToast(
              isSimulatedOffline ? 'Online Mode Restored' : 'Simulated Offline Mode Enabled',
              isSimulatedOffline
                ? 'Device network link reconnected.'
                : 'Offline simulated for presentation testing.',
              isSimulatedOffline ? 'success' : 'warning'
            );
          }}
          className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
            isOnline
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
              : 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
          }`}
          title="Click to toggle simulated offline/online state"
        >
          {isOnline ? (
            <>
              <Wifi className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden md:inline">ONLINE</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3.5 h-3.5 text-amber-700" />
              <span className="hidden md:inline">OFFLINE</span>
            </>
          )}
        </button>

        {/* Language Selector */}
        <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-lg px-2 py-1">
          <Globe className="w-3.5 h-3.5 text-slate-500 mr-1.5" />
          <select
            aria-label="Interface Language"
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value as Language)}
            className="text-xs font-bold text-slate-700 bg-transparent border-none p-0 focus:ring-0 cursor-pointer"
          >
            <option value="en">English</option>
            <option value="as">অসমীয়া (Assamese)</option>
            <option value="hi">हिन्दी (Hindi)</option>
          </select>
        </div>

        {/* Role Selector (Demo viewpoint switch) */}
        <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1">
          <UserCheck className="w-3.5 h-3.5 text-teal-600 mr-1.5" />
          <select
            aria-label="User Demo Role"
            value={role}
            onChange={(e) => handleRoleChange(e.target.value as UserRole)}
            className="text-xs font-bold text-slate-800 bg-transparent border-none p-0 focus:ring-0 cursor-pointer"
          >
            <option value="administrator">Role: Administrator</option>
            <option value="health_worker">Role: Health Worker (ASHA)</option>
            <option value="agri_officer">Role: Agri Officer (KVK)</option>
            <option value="farmer">Role: Farmer (Kisan)</option>
          </select>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg relative"
          >
            <Bell className="w-4 h-4" />
            {unreadAlerts.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl border border-slate-200 shadow-xl p-3 z-50 animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800">
                  Active Alerts ({unreadAlerts.length})
                </span>
                <button
                  onClick={() => {
                    onNavigate('alerts');
                    setShowNotifications(false);
                  }}
                  className="text-[11px] font-semibold text-teal-700 hover:underline"
                >
                  View All
                </button>
              </div>
              <div className="space-y-2 mt-2 max-h-60 overflow-y-auto">
                {unreadAlerts.slice(0, 3).map((a) => (
                  <div
                    key={a.id}
                    onClick={() => {
                      onNavigate('alerts');
                      setShowNotifications(false);
                    }}
                    className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer text-xs"
                  >
                    <div className="font-bold text-slate-900 truncate">{a.title}</div>
                    <div className="text-slate-500 text-[11px] line-clamp-1 mt-0.5">
                      {a.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Chip */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1 pl-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-slate-800">{roleLabels[role].title}</div>
              <div className="text-[10px] text-slate-500">{roleLabels[role].subtitle}</div>
            </div>
            <div className="w-8 h-8 rounded-full bg-teal-100 border border-teal-300 flex items-center justify-center text-teal-800 font-bold text-xs">
              {role === 'farmer' ? 'RD' : role === 'health_worker' ? 'MD' : 'AO'}
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-slate-200 shadow-xl p-2 z-50 animate-in fade-in text-xs">
              <div className="p-2 border-b border-slate-100">
                <div className="font-bold text-slate-900">{roleLabels[role].title}</div>
                <div className="text-slate-500 text-[11px]">{roleLabels[role].subtitle}</div>
              </div>
              <div className="py-1">
                <button
                  onClick={() => {
                    onNavigate('interoperability');
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded hover:bg-slate-50 font-medium text-slate-700"
                >
                  System & Integration Settings
                </button>
                <button
                  onClick={() => {
                    onNavigate('interoperability');
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded hover:bg-slate-50 font-medium text-slate-700"
                >
                  ABDM / AgriStack Sandbox
                </button>
              </div>
              {onLogout && (
                <div className="pt-1 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onLogout();
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded text-rose-600 hover:bg-rose-50 font-semibold flex items-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

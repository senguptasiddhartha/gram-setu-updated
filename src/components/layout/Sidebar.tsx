import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Users,
  HeartPulse,
  Sprout,
  Activity,
  Flame,
  Bell,
  RefreshCw,
  Settings,
  CheckCircle2,
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  isOpenMobile,
  onCloseMobile,
}) => {
  const {
    t,
    alerts,
    syncQueue,
    isOnline,
  } = useApp();

  const pendingSyncCount = syncQueue.filter(
    (q) => q.status === 'Pending'
  ).length;

  const newAlertsCount = alerts.filter(
    (a) => a.status === 'New'
  ).length;

  const navSections = [
    {
      title: 'Overview',
      items: [
        {
          id: 'dashboard',
          label: t.dashboard,
          icon: <LayoutDashboard className="w-4 h-4" />,
        },
      ],
    },

    {
      title: 'People & Fieldwork',
      items: [
        {
          id: 'farmers',
          label: t.farmers,
          icon: <Users className="w-4 h-4" />,
        },
        {
          id: 'health-workers',
          label: t.healthWorkers,
          icon: <HeartPulse className="w-4 h-4" />,
        },
      ],
    },

    {
      title: 'Intelligence Engines',
      items: [
        {
          id: 'agri-intelligence',
          label: t.agriRisk,
          icon: <Sprout className="w-4 h-4" />,
        },

        {
          // IMPORTANT:
          // This MUST match App.tsx
          id: 'health-risk',
          label: t.healthRisk,
          icon: <Activity className="w-4 h-4" />,
        },

        {
          id: 'cross-domain',
          label: t.crossDomainEngine,
          icon: (
            <Flame className="w-4 h-4 text-orange-400" />
          ),
          isHighlight: true,
          badge: 'CORE',
        },
      ],
    },

    {
      title: 'Operations',
      items: [
        {
          id: 'alerts',
          label: t.alerts,
          icon: <Bell className="w-4 h-4" />,
          count:
            newAlertsCount > 0
              ? newAlertsCount
              : undefined,
          countColor: 'bg-rose-500 text-white',
        },

        {
          id: 'offline-sync',
          label: t.offlineSync,
          icon: (
            <RefreshCw className="w-4 h-4" />
          ),
          count:
            pendingSyncCount > 0
              ? pendingSyncCount
              : undefined,
          countColor: 'bg-amber-500 text-white',
        },
      ],
    },

    {
      title: 'System',
      items: [
        {
          id: 'settings',
          label: t.settings,
          icon: <Settings className="w-4 h-4" />,
        },
      ],
    },
  ];

  const handleNav = (id: string) => {
    onNavigate(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed lg:static
          top-0 left-0 bottom-0
          z-50
          w-68
          bg-slate-950
          text-slate-200
          flex flex-col
          border-r border-slate-800
          transition-transform
          duration-300
          ease-in-out
          shrink-0
          ${
            isOpenMobile
              ? 'translate-x-0'
              : '-translate-x-full lg:translate-x-0'
          }
        `}
      >

        {/* =====================================================
            BRAND
        ===================================================== */}

        <div className="p-5 border-b border-slate-800/80 bg-slate-900/40">

          <div className="flex items-center gap-3">

            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-teal-950/40">

              <Activity className="w-5 h-5 text-white" />

            </div>

            <div className="min-w-0">

              <div className="text-base font-extrabold tracking-wider text-white font-mono">
                Gram Setu
              </div>

              <div className="text-[10px] text-teal-400 font-semibold tracking-tight truncate">
                Integrated Rural Risk Intelligence
              </div>

            </div>

          </div>

          <div className="mt-3 text-[11px] text-slate-400 bg-slate-800/60 px-2.5 py-1.5 rounded-md border border-slate-700/50 flex items-center justify-between gap-2">

            <span className="font-mono">
              Rural Intelligence PoC
            </span>

            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800">
              v1.0
            </span>

          </div>

        </div>

        {/* =====================================================
            NAVIGATION
        ===================================================== */}

        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 custom-scrollbar">

          {navSections.map((section) => (

            <div
              key={section.title}
              className="space-y-1"
            >

              <div className="px-3 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                {section.title}
              </div>

              <div className="space-y-0.5 mt-1">

                {section.items.map((item) => {

                  const isActive =
                    currentPage === item.id;

                  return (

                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        handleNav(item.id)
                      }
                      className={`
                        w-full
                        flex
                        items-center
                        justify-between
                        px-3
                        py-2.5
                        rounded-lg
                        text-xs
                        font-semibold
                        transition-all
                        cursor-pointer
                        ${
                          isActive
                            ? 'bg-teal-600 text-white shadow-sm'
                            : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                        }
                        ${
                          item.isHighlight &&
                          !isActive
                            ? 'border border-orange-500/20 bg-orange-950/20 text-orange-200'
                            : ''
                        }
                      `}
                    >

                      <div className="flex items-center gap-2.5 truncate">

                        <span
                          className={
                            isActive
                              ? 'text-white'
                              : 'text-slate-400'
                          }
                        >
                          {item.icon}
                        </span>

                        <span className="truncate">
                          {item.label}
                        </span>

                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">

                        {item.badge && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-teal-300 border border-slate-700">
                            {item.badge}
                          </span>
                        )}

                        {item.count !== undefined && (
                          <span
                            className={`
                              text-[10px]
                              font-bold
                              px-1.5
                              py-0.5
                              rounded-full
                              ${
                                item.countColor ||
                                'bg-slate-700 text-slate-200'
                              }
                            `}
                          >
                            {item.count}
                          </span>
                        )}

                      </div>

                    </button>

                  );
                })}

              </div>

            </div>

          ))}

        </div>

        {/* =====================================================
            SYSTEM STATUS
        ===================================================== */}

        <div className="p-3.5 border-t border-slate-800/80 bg-slate-900/60 space-y-2">

          <div className="flex items-center justify-between text-xs">

            <div className="flex items-center gap-2">

              <span className="relative flex h-2.5 w-2.5">

                <span
                  className={`
                    absolute
                    inline-flex
                    h-full
                    w-full
                    rounded-full
                    opacity-75
                    ${
                      isOnline
                        ? 'bg-emerald-400 animate-ping'
                        : 'bg-amber-400'
                    }
                  `}
                />

                <span
                  className={`
                    relative
                    inline-flex
                    rounded-full
                    h-2.5
                    w-2.5
                    ${
                      isOnline
                        ? 'bg-emerald-500'
                        : 'bg-amber-500'
                    }
                  `}
                />

              </span>

              <span className="text-slate-300 font-semibold text-[11px]">
                {isOnline
                  ? 'System Operational'
                  : 'Offline Mode'}
              </span>

            </div>

            <span className="text-[10px] text-slate-400 font-mono">
              {isOnline
                ? 'ONLINE'
                : 'OFFLINE'}
            </span>

          </div>

          <div className="flex items-center gap-1.5 text-[10px] text-teal-400/90 bg-teal-950/40 px-2 py-1.5 rounded border border-teal-900/50">

            <CheckCircle2 className="w-3 h-3 text-teal-400 shrink-0" />

            <span className="truncate">
              {t.offlineFirst} · Dexie DB
            </span>

          </div>

        </div>

      </aside>
    </>
  );
};
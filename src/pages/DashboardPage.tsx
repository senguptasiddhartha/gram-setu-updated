import React from 'react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/common/PageHeader';
import { StatCard } from '../components/common/StatCard';
import { RiskBadge } from '../components/common/RiskBadge';
import { AlertCard } from '../components/common/AlertCard';
import { AudioListenButton } from '../components/common/AudioListenButton';

import {
  Users,
  HeartPulse,
  Bell,
  Sprout,
  Activity,
  Flame,
  ThermometerSun,
  Droplets,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  MapPin,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

interface DashboardPageProps {
  onNavigate: (page: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
}) => {
  const {
    t,
    selectedVillage,
    alerts,
    farmers,
    healthScreenings,
    currentCrossDomainRisk,
    updateAlertStatus,
  } = useApp();

  const activeAlerts = alerts.filter(
    (alert) => alert.status !== 'Resolved'
  );

  const priorityAlerts = activeAlerts
    .filter(
      (alert) =>
        alert.priority === 'HIGH' ||
        alert.priority === 'CRITICAL'
    )
    .slice(0, 3);

  const highPriorityCases = farmers.filter(
    (farmer) =>
      farmer.riskCategory === 'HIGH' ||
      farmer.riskCategory === 'CRITICAL'
  ).length;

  const currentRisk =
    currentCrossDomainRisk?.communityRiskScore ??
    Math.round(
      (
        (selectedVillage.heatRisk || 0) +
        (selectedVillage.agriculturalRisk || 0) +
        (selectedVillage.healthRisk || 0)
      ) / 3
    );

  const riskCategory =
    currentCrossDomainRisk?.riskCategory || 'HIGH';

  const advisoryText = `
    Gram Setu rural intelligence advisory for ${selectedVillage.name}.
    Overall community risk score is ${currentRisk} out of 100.
    ${currentCrossDomainRisk?.whyThisMatters || ''}
    Priority action is to reduce prolonged outdoor exposure,
    provide hydration and initiate targeted health and agricultural monitoring.
  `;

  const trendData = [
    { day: 'Mon', value: 48 },
    { day: 'Tue', value: 53 },
    { day: 'Wed', value: 59 },
    { day: 'Thu', value: 66 },
    { day: 'Fri', value: 72 },
    { day: 'Sat', value: 78 },
    { day: 'Today', value: currentRisk },
  ];

  return (
    <div className="space-y-6">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <PageHeader
        title="Rural Risk Command Center"
        subtitle={`Predictive health and agricultural risk monitoring for ${selectedVillage.name}.`}
        badge="LIVE"
      >
        <button
          onClick={() => onNavigate('cross-domain')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm transition-colors"
        >
          <Flame className="w-4 h-4" />
          Run Risk Assessment
        </button>
      </PageHeader>

      {/* =====================================================
          LOCATION / STATUS BAR
      ===================================================== */}

      <div className="bg-white border border-slate-200 rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center">
            <MapPin className="w-4 h-4 text-teal-600" />
          </div>

          <div>
            <p className="text-xs text-slate-500">
              Monitoring cluster
            </p>
            <p className="text-sm font-bold text-slate-900">
              {selectedVillage.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-semibold text-slate-600">
              Predictive engine active
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-500">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Auto monitored</span>
          </div>
        </div>
      </div>

      {/* =====================================================
          KEY METRICS
      ===================================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

        <StatCard
          title={t.registeredFarmers}
          value={farmers.length}
          icon={<Users className="w-5 h-5" />}
          trend="Registered in local database"
          trendDirection="up"
        />

        <StatCard
          title={t.healthWorkersCount}
          value={12}
          icon={<HeartPulse className="w-5 h-5" />}
          trend="Field network available"
          trendDirection="up"
        />

        <StatCard
          title={t.activeAlerts}
          value={activeAlerts.length}
          icon={<Bell className="w-5 h-5" />}
          trend={
            activeAlerts.length > 0
              ? 'Requires attention'
              : 'No active alerts'
          }
          trendDirection="up"
        />

        <StatCard
          title={t.highPriorityCases}
          value={highPriorityCases}
          icon={<ShieldCheck className="w-5 h-5" />}
          trend="High / critical risk"
          trendDirection="up"
        />

      </div>

      {/* =====================================================
          MAIN RISK SECTION
      ===================================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Overall Risk */}

        <div className="lg:col-span-2 bg-slate-950 text-white rounded-2xl p-6 overflow-hidden relative">

          <div className="absolute -right-20 -top-20 w-56 h-56 rounded-full bg-teal-500/10 blur-3xl" />

          <div className="relative">

            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">

              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-teal-400" />

                  <p className="text-xs font-bold uppercase tracking-wider text-teal-400">
                    Cross-Domain Intelligence
                  </p>
                </div>

                <h2 className="text-xl font-bold mt-2">
                  Overall Rural Risk
                </h2>

                <p className="text-xs text-slate-400 mt-1 max-w-lg">
                  Combined assessment of environmental,
                  agricultural and occupational-health indicators.
                </p>
              </div>

              <RiskBadge level={riskCategory} />

            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">

              {/* Score */}

              <div className="flex items-center gap-5">

                <div className="relative w-28 h-28 shrink-0">

                  <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full -rotate-90"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      className="text-slate-800"
                    />

                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeLinecap="round"
                      className="text-teal-400"
                      strokeDasharray={`${currentRisk * 2.51} 251`}
                    />
                  </svg>

                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black">
                      {currentRisk}
                    </span>
                    <span className="text-[9px] text-slate-400">
                      / 100
                    </span>
                  </div>

                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Community score
                  </p>

                  <p className="text-sm font-bold mt-1">
                    {riskCategory}
                  </p>

                  <p className="text-[11px] text-slate-500 mt-2">
                    Updated from current risk indicators
                  </p>
                </div>

              </div>

              {/* Heat */}

              <div className="bg-white/5 rounded-xl p-4 border border-white/10">

                <div className="flex items-center justify-between">
                  <ThermometerSun className="w-4 h-4 text-orange-400" />

                  <span className="text-[10px] text-slate-400">
                    HEAT
                  </span>
                </div>

                <p className="text-2xl font-black mt-3">
                  {selectedVillage.heatRisk || 0}
                </p>

                <p className="text-[10px] text-slate-400 mt-1">
                  Occupational heat stress
                </p>

              </div>

              {/* Agriculture */}

              <div className="bg-white/5 rounded-xl p-4 border border-white/10">

                <div className="flex items-center justify-between">
                  <Sprout className="w-4 h-4 text-emerald-400" />

                  <span className="text-[10px] text-slate-400">
                    AGRICULTURE
                  </span>
                </div>

                <p className="text-2xl font-black mt-3">
                  {selectedVillage.agriculturalRisk || 0}
                </p>

                <p className="text-[10px] text-slate-400 mt-1">
                  Crop risk indicator
                </p>

              </div>

            </div>
          </div>
        </div>

        {/* Advisory */}

        <div className="bg-white border border-slate-200 rounded-2xl p-5">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
                <Activity className="w-4 h-4 text-teal-600" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Intelligence Directive
                </h3>

                <p className="text-[10px] text-slate-500">
                  AI-assisted recommendation
                </p>
              </div>
            </div>

            <AudioListenButton text={advisoryText} />

          </div>

          <div className="mt-5 p-4 rounded-xl bg-teal-50 border border-teal-100">

            <p className="text-xs leading-5 text-teal-900">
              {currentCrossDomainRisk?.whyThisMatters ||
                'Gram Setu is combining health, agriculture and environmental indicators to identify emerging rural risks.'}
            </p>

          </div>

          <button
            onClick={() => onNavigate('cross-domain')}
            className="w-full mt-4 flex items-center justify-between px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
          >
            <span>View Cross-Domain Analysis</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </div>

      </div>

      {/* =====================================================
          RISK TREND
      ===================================================== */}

      <div className="bg-white border border-slate-200 rounded-2xl p-5">

        <div className="flex items-center justify-between">

          <div>
            <h2 className="text-sm font-bold text-slate-900">
              7-Day Rural Risk Trend
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              Composite environmental and community risk indicator
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <TrendingUp className="w-4 h-4 text-teal-600" />
            Increasing
          </div>

        </div>

        <div className="mt-6 flex items-end gap-2 h-40">

          {trendData.map((item, index) => {

            const height = Math.max(
              12,
              Math.min(100, item.value)
            );

            const isToday = index === trendData.length - 1;

            return (
              <div
                key={item.day}
                className="flex-1 h-full flex flex-col justify-end items-center gap-2"
              >

                <span className="text-[10px] font-bold text-slate-500">
                  {item.value}
                </span>

                <div className="w-full max-w-14 h-28 flex items-end">

                  <div
                    className={`w-full rounded-t-lg transition-all ${
                      isToday
                        ? 'bg-teal-600'
                        : 'bg-slate-200'
                    }`}
                    style={{
                      height: `${height}%`,
                    }}
                  />

                </div>

                <span
                  className={`text-[9px] ${
                    isToday
                      ? 'font-bold text-teal-700'
                      : 'text-slate-400'
                  }`}
                >
                  {item.day}
                </span>

              </div>
            );
          })}

        </div>

      </div>

      {/* =====================================================
          DOMAIN STATUS
      ===================================================== */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <button
          onClick={() => onNavigate('health-risk')}
          className="text-left bg-white border border-slate-200 rounded-2xl p-5 hover:border-teal-300 hover:shadow-sm transition-all"
        >

          <div className="flex items-center justify-between">

            <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center">
              <HeartPulse className="w-5 h-5 text-rose-500" />
            </div>

            <ArrowRight className="w-4 h-4 text-slate-400" />

          </div>

          <h3 className="text-sm font-bold mt-4">
            Health Risk Engine
          </h3>

          <p className="text-xs text-slate-500 mt-1">
            Heat stress, symptoms and occupational exposure screening.
          </p>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-[10px] text-slate-400">
              Current risk
            </span>

            <RiskBadge
              level={
                currentCrossDomainRisk?.riskCategory ||
                'MODERATE'
              }
            />
          </div>

        </button>

        <button
          onClick={() => onNavigate('agri-intelligence')}
          className="text-left bg-white border border-slate-200 rounded-2xl p-5 hover:border-emerald-300 hover:shadow-sm transition-all"
        >

          <div className="flex items-center justify-between">

            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Sprout className="w-5 h-5 text-emerald-600" />
            </div>

            <ArrowRight className="w-4 h-4 text-slate-400" />

          </div>

          <h3 className="text-sm font-bold mt-4">
            Agriculture Risk Engine
          </h3>

          <p className="text-xs text-slate-500 mt-1">
            Crop, weather, soil and disease-risk intelligence.
          </p>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-[10px] text-slate-400">
              Crop risk
            </span>

            <span className="text-sm font-black text-emerald-600">
              {selectedVillage.agriculturalRisk || 0}/100
            </span>
          </div>

        </button>

        <button
          onClick={() => onNavigate('offline-sync')}
          className="text-left bg-white border border-slate-200 rounded-2xl p-5 hover:border-blue-300 hover:shadow-sm transition-all"
        >

          <div className="flex items-center justify-between">

            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-blue-600" />
            </div>

            <ArrowRight className="w-4 h-4 text-slate-400" />

          </div>

          <h3 className="text-sm font-bold mt-4">
            Offline Data Sync
          </h3>

          <p className="text-xs text-slate-500 mt-1">
            Local-first records synchronize whenever connectivity returns.
          </p>

          <div className="mt-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-bold text-emerald-600">
              Ready
            </span>
          </div>

        </button>

      </div>

      {/* =====================================================
          PRIORITY ALERTS
      ===================================================== */}

      <div className="bg-white border border-slate-200 rounded-2xl p-5">

        <div className="flex items-center justify-between mb-5">

          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Priority Risk Alerts
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              Alerts requiring field-level attention
            </p>
          </div>

          <button
            onClick={() => onNavigate('alerts')}
            className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1"
          >
            View all
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

        </div>

        {priorityAlerts.length === 0 ? (

          <div className="py-10 text-center">

            <ShieldCheck className="w-9 h-9 text-emerald-500 mx-auto" />

            <p className="text-sm font-bold text-slate-800 mt-3">
              No priority alerts
            </p>

            <p className="text-xs text-slate-500 mt-1">
              All monitored risks are currently within acceptable levels.
            </p>

          </div>

        ) : (

          <div className="space-y-3">

            {priorityAlerts.map((alert) => (
              <AlertCard
                key={alert.id}
                alert={alert}
                onAcknowledge={(id) =>
                  updateAlertStatus(id, 'Acknowledged')
                }
                onResolve={(id) =>
                  updateAlertStatus(id, 'Resolved')
                }
              />
            ))}

          </div>

        )}

      </div>

      {/* =====================================================
          DEMO VALUE PROPOSITION
      ===================================================== */}

      <div className="bg-gradient-to-r from-teal-700 to-cyan-700 rounded-2xl p-6 text-white">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

          <div>

            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4" />

              <span className="text-[10px] font-bold uppercase tracking-widest">
                Gram Setu
              </span>
            </div>

            <h2 className="text-lg font-bold mt-2">
              One platform. Two critical rural systems.
            </h2>

            <p className="text-xs text-teal-100 mt-1 max-w-2xl">
              Gram Setu connects agricultural intelligence with
              occupational-health monitoring to identify risks
              before they become crises.
            </p>

          </div>

          <button
            onClick={() => onNavigate('cross-domain')}
            className="shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-teal-800 text-xs font-bold hover:bg-teal-50 transition-colors"
          >
            Explore Intelligence
            <ArrowRight className="w-4 h-4" />
          </button>

        </div>

      </div>

    </div>
  );
};
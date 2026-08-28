import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/common/PageHeader';
import { AlertCard } from '../components/common/AlertCard';
import {
  Bell,
  Filter,
  CheckCircle2,
  Radio,
} from 'lucide-react';

export const AlertsPage: React.FC = () => {
  const {
    alerts,
    updateAlertStatus,
    addToast,
    selectedVillage,
  } = useApp();

  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const filteredAlerts = alerts.filter((alert) => {
    const matchesStatus =
      statusFilter === 'All' ||
      alert.status === statusFilter;

    const matchesPriority =
      priorityFilter === 'All' ||
      alert.priority === priorityFilter;

    const matchesCategory =
      categoryFilter === 'All' ||
      alert.category === categoryFilter;

    return (
      matchesStatus &&
      matchesPriority &&
      matchesCategory
    );
  });

  const activeAlerts = alerts.filter(
    (alert) => alert.status !== 'Resolved'
  ).length;

  const handleBroadcastAll = () => {
    addToast(
      'Emergency Broadcast Dispatched',
      `Village advisory broadcast simulated for ${selectedVillage?.name || 'the selected village'}.`,
      'success'
    );
  };

  const handleAcknowledge = (id: string) => {
    updateAlertStatus(id, 'Acknowledged');

    addToast(
      'Alert Acknowledged',
      'The risk alert has been marked as acknowledged.',
      'success'
    );
  };

  const handleResolve = (id: string) => {
    updateAlertStatus(id, 'Resolved');

    addToast(
      'Alert Resolved',
      'The risk alert has been marked as resolved.',
      'success'
    );
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <PageHeader
        title="Multi-Domain Risk Alerts"
        subtitle="Monitor health, agricultural, and cross-domain risks and dispatch actionable advisories to field teams."
        badge={`${activeAlerts} Active Alerts`}
      >
        <button
          onClick={handleBroadcastAll}
          className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
        >
          <Radio className="w-4 h-4 animate-pulse" />
          <span>Broadcast Village Advisory</span>
        </button>
      </PageHeader>

      {/* Quick Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Total Alerts
            </span>
            <Bell className="w-4 h-4 text-slate-400" />
          </div>

          <div className="text-2xl font-bold text-slate-900 mt-2">
            {alerts.length}
          </div>

          <p className="text-[11px] text-slate-500 mt-1">
            All monitored risks
          </p>
        </div>

        <div className="bg-white border border-rose-200 rounded-xl p-4">
          <span className="text-xs font-semibold text-slate-500">
            Critical
          </span>

          <div className="text-2xl font-bold text-rose-600 mt-2">
            {
              alerts.filter(
                (a) => a.priority === 'CRITICAL'
              ).length
            }
          </div>

          <p className="text-[11px] text-slate-500 mt-1">
            Immediate attention
          </p>
        </div>

        <div className="bg-white border border-amber-200 rounded-xl p-4">
          <span className="text-xs font-semibold text-slate-500">
            High Priority
          </span>

          <div className="text-2xl font-bold text-amber-600 mt-2">
            {
              alerts.filter(
                (a) => a.priority === 'HIGH'
              ).length
            }
          </div>

          <p className="text-[11px] text-slate-500 mt-1">
            Requires attention
          </p>
        </div>

        <div className="bg-white border border-emerald-200 rounded-xl p-4">
          <span className="text-xs font-semibold text-slate-500">
            Resolved
          </span>

          <div className="text-2xl font-bold text-emerald-600 mt-2">
            {
              alerts.filter(
                (a) => a.status === 'Resolved'
              ).length
            }
          </div>

          <p className="text-[11px] text-slate-500 mt-1">
            Successfully handled
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">

          <div className="flex items-center gap-2 flex-wrap">

            {/* Status */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
              <Filter className="w-3.5 h-3.5 text-slate-500" />

              <select
                aria-label="Filter alerts by status"
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
                className="bg-transparent border-none outline-none text-xs font-semibold text-slate-700 p-0 cursor-pointer"
              >
                <option value="All">
                  Status: All
                </option>

                <option value="New">
                  New
                </option>

                <option value="Acknowledged">
                  Acknowledged
                </option>

                <option value="Resolved">
                  Resolved
                </option>
              </select>
            </div>

            {/* Priority */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
              <select
                aria-label="Filter alerts by priority"
                value={priorityFilter}
                onChange={(e) =>
                  setPriorityFilter(e.target.value)
                }
                className="bg-transparent border-none outline-none text-xs font-semibold text-slate-700 p-0 cursor-pointer"
              >
                <option value="All">
                  Priority: All
                </option>

                <option value="CRITICAL">
                  Critical
                </option>

                <option value="HIGH">
                  High
                </option>

                <option value="MODERATE">
                  Moderate
                </option>

                <option value="LOW">
                  Low
                </option>
              </select>
            </div>

            {/* Category */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
              <select
                aria-label="Filter alerts by domain"
                value={categoryFilter}
                onChange={(e) =>
                  setCategoryFilter(e.target.value)
                }
                className="bg-transparent border-none outline-none text-xs font-semibold text-slate-700 p-0 cursor-pointer"
              >
                <option value="All">
                  Domain: All
                </option>

                <option value="Heat Stress">
                  Heat Stress
                </option>

                <option value="Crop Disease">
                  Crop Disease
                </option>

                <option value="Chemical Exposure">
                  Chemical Exposure
                </option>

                <option value="Cross-Domain">
                  Cross-Domain
                </option>
              </select>
            </div>

            {/* Clear Filters */}
            {(statusFilter !== 'All' ||
              priorityFilter !== 'All' ||
              categoryFilter !== 'All') && (
              <button
                onClick={() => {
                  setStatusFilter('All');
                  setPriorityFilter('All');
                  setCategoryFilter('All');
                }}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Showing{' '}
            <span className="font-bold text-slate-700">
              {filteredAlerts.length}
            </span>{' '}
            of{' '}
            <span className="font-bold text-slate-700">
              {alerts.length}
            </span>{' '}
            alerts
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="space-y-3">

        {filteredAlerts.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />

            <h4 className="text-sm font-bold text-slate-800">
              No matching alerts
            </h4>

            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              No alerts match the selected filters.
              Try clearing the filters to view all monitored risks.
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onAcknowledge={handleAcknowledge}
              onResolve={handleResolve}
            />
          ))
        )}
      </div>

      {/* Demo Information */}
      <div className="bg-slate-900 rounded-2xl p-5 text-white border border-slate-800">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-rose-500/20 flex items-center justify-center shrink-0">
            <Bell className="w-4 h-4 text-rose-300" />
          </div>

          <div>
            <h3 className="text-sm font-bold">
              Gram Setu Alert Pipeline
            </h3>

            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Risk events generated by the health and agriculture
              intelligence engines appear here for field-level action.
              Alerts can be acknowledged, resolved, or broadcast as
              village advisories.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
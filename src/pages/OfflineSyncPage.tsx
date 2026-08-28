import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/common/PageHeader';
import { StatCard } from '../components/common/StatCard';
import {
  Wifi,
  WifiOff,
  RefreshCw,
  Database,
  CheckCircle2,
  Clock,
  HardDrive,
  Download,
  Trash2,
  Layers,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const OfflineSyncPage: React.FC = () => {
  const {
    isOnline,
    isSimulatedOffline,
    setIsSimulatedOffline,
    syncQueue,
    isSyncing,
    syncNow,
    farmers,
    healthScreenings,
    alerts,
    addToast,
  } = useApp();

  const pendingSyncCount = syncQueue.filter((q) => q.status === 'Pending').length;

  const handleExportJson = () => {
    const backupData = {
      exportedAt: new Date().toISOString(),
      farmersCount: farmers.length,
      screeningsCount: healthScreenings.length,
      alertsCount: alerts.length,
      farmers,
      healthScreenings,
      alerts,
      syncQueue,
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Gram Setu-IndexedDB-Backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);

    addToast('Backup Exported', 'Local IndexedDB state exported as JSON.', 'success');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Offline-First Engine & Mesh Synchronization"
        subtitle="Zero-data-loss architecture storing all records locally in IndexedDB (Dexie.js) with background sync."
        badge={isOnline ? 'Online (Connected)' : 'Offline (Local Mesh)'}
      >
        <div className="flex items-center gap-2">
          {/* Online Toggle */}
          <button
            onClick={() => setIsSimulatedOffline(!isSimulatedOffline)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
              isOnline
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 hover:bg-emerald-200'
                : 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
            }`}
          >
            {isOnline ? (
              <>
                <Wifi className="w-4 h-4 text-emerald-700" />
                <span>Simulate Offline Mode</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-amber-700" />
                <span>Switch to Online Mode</span>
              </>
            )}
          </button>

          <button
            onClick={syncNow}
            disabled={isSyncing || pendingSyncCount === 0}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer ${
              pendingSyncCount === 0
                ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                : 'bg-teal-700 hover:bg-teal-800 text-white'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : `Sync Now (${pendingSyncCount} Pending)`}</span>
          </button>
        </div>
      </PageHeader>

      {/* Storage Architecture Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <StatCard
          title="IndexedDB Status"
          value="Persistent"
          subtext="Dexie v2 Schema"
          icon={<Database className="w-4 h-4" />}
          iconBg="bg-teal-50 text-teal-700 border-teal-200"
        />
        <StatCard
          title="Pending Sync Queue"
          value={pendingSyncCount}
          subtext={pendingSyncCount === 0 ? 'All records synced' : 'Awaiting network uplink'}
          icon={<Clock className="w-4 h-4" />}
          iconBg="bg-amber-50 text-amber-700 border-amber-200"
        />
        <StatCard
          title="Local Farmer Records"
          value={farmers.length}
          subtext="Stored on device"
          icon={<HardDrive className="w-4 h-4" />}
          iconBg="bg-slate-50 text-slate-700 border-slate-200"
        />
        <StatCard
          title="Local Health Screenings"
          value={healthScreenings.length}
          subtext="Ready for ABDM push"
          icon={<CheckCircle2 className="w-4 h-4" />}
          iconBg="bg-emerald-50 text-emerald-700 border-emerald-200"
        />
      </div>

      {/* Offline Workflow Explanation */}
      <div className="bg-gradient-to-r from-teal-950 to-slate-900 text-white rounded-2xl p-5 border border-teal-900/60 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-teal-400 tracking-wider">
              Rural Low-Bandwidth Guarantee
            </span>
            <h3 className="text-base font-bold text-slate-100">
              How Offline-First Works in Remote Assam Villages:
            </h3>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              When ASHA workers or farmers travel into remote fields with zero 2G/3G connectivity,
              Gram Setu continues to operate with 100% functionality. Forms, risk scoring, and
              audio playback run client-side in the browser. Mutation operations are recorded in the
              local Dexie <code>syncQueue</code> and automatically synced to the central ABDM &
              AgriStack gateways when connection resumes.
            </p>
          </div>
          <button
            onClick={handleExportJson}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/40 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Local DB Backup</span>
          </button>
        </div>
      </div>

      {/* Pending Sync Queue Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-teal-600" />
              IndexedDB Outbound Sync Queue
            </h3>
            <p className="text-xs text-slate-500">
              Transactions queued in client storage awaiting upstream REST handshake.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-500 bg-slate-50 px-2 py-1 rounded border">
              Queue Length: {syncQueue.length}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Queue Item ID</th>
                <th className="py-3 px-4">Entity Type</th>
                <th className="py-3 px-4">Target Record ID</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Retry Count</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {syncQueue.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
                    Sync queue is empty. All local changes are fully synchronized with central servers.
                  </td>
                </tr>
              ) : (
                syncQueue.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">{item.id}</td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-900 uppercase text-[10px] bg-slate-100 px-2 py-0.5 rounded">
                        {item.recordType}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">{item.recordId}</td>
                    <td className="py-3 px-4">
                      <span className="text-teal-700 font-bold">{item.action}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                      {new Date(item.createdOfflineAt).toLocaleTimeString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        <Clock className="w-3 h-3 text-amber-600" /> {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-500">
                      {item.retryCount || 0}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

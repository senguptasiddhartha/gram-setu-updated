import React from 'react';
import { useApp } from '../../context/AppContext';
import { WifiOff, Database, RefreshCw, Radio } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const {
    isOnline,
    isSimulatedOffline,
    setIsSimulatedOffline,
    syncQueue,
    syncNow,
    isSyncing,
  } = useApp();

  if (isOnline && syncQueue.length === 0) return null;

  const pendingCount = syncQueue.filter((q) => q.status === 'Pending').length;

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 text-xs text-amber-900 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-40 shadow-xs">
      <div className="flex items-center gap-2.5 flex-wrap">
        {!isOnline ? (
          <span className="flex items-center gap-1.5 font-bold text-amber-950 bg-amber-200/80 px-2.5 py-0.5 rounded-full">
            <WifiOff className="w-3.5 h-3.5 text-amber-900 animate-pulse" />
            {isSimulatedOffline ? 'Simulated Offline Mode Active' : 'Low-Bandwidth Offline Mode'}
          </span>
        ) : (
          <span className="flex items-center gap-1.5 font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
            <Radio className="w-3.5 h-3.5 text-emerald-700" />
            Online & Ready
          </span>
        )}

        <span className="flex items-center gap-1.5 text-slate-700">
          <Database className="w-3.5 h-3.5 text-slate-500" />
          IndexedDB Local Persistence: <strong>{pendingCount} records pending sync</strong>
        </span>
      </div>

      <div className="flex items-center gap-2">
        {isSimulatedOffline && (
          <button
            onClick={() => setIsSimulatedOffline(false)}
            className="px-2.5 py-1 font-semibold text-xs bg-white text-slate-700 hover:bg-amber-100/60 border border-amber-300 rounded-lg transition-colors shadow-2xs"
          >
            Resume Online
          </button>
        )}

        {isOnline && pendingCount > 0 && (
          <button
            onClick={() => syncNow()}
            disabled={isSyncing}
            className="px-3 py-1 font-bold text-xs bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing...' : 'Sync Now'}
          </button>
        )}
      </div>
    </div>
  );
};

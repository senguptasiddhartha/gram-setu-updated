import React, { ReactNode } from 'react';
import { MapPin, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  children?: ReactNode;
  showLocation?: boolean;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  badge,
  children,
  showLocation = true,
}) => {
  const { selectedVillage, selectedVillageId, setSelectedVillageId, villages, launchDemoScenario } = useApp();

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 mb-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2.5 flex-wrap">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">{title}</h1>
          {badge && (
            <span className="bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {badge}
            </span>
          )}
        </div>
        {subtitle && <p className="text-sm text-slate-600 max-w-2xl">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-2.5 flex-wrap">
        {showLocation && (
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-2xs">
            <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-slate-600 tracking-wider">Cluster</span>
              <select
                aria-label="Select Village Cluster"
                value={selectedVillageId}
                onChange={(e) => setSelectedVillageId(e.target.value)}
                className="text-xs font-bold text-slate-800 bg-transparent border-none p-0 focus:ring-0 cursor-pointer"
              >
                {villages.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}, {v.district}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <button
          onClick={() => launchDemoScenario()}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Launch Demo Scenario</span>
        </button>

        {children}
      </div>
    </div>
  );
};

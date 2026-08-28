import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Village, RiskLevel } from '../../types';
import { RiskBadge } from './RiskBadge';
import {
  MapPin,
  Users,
  Sprout,
  HeartPulse,
  ThermometerSun,
  ShieldCheck,
  ChevronRight,
  Wind,
  Droplets,
} from 'lucide-react';

interface VillageMapProps {
  onSelectVillage?: (v: Village) => void;
}

export const VillageMap: React.FC<VillageMapProps> = ({ onSelectVillage }) => {
  const { villages, selectedVillageId, setSelectedVillageId, alerts } = useApp();
  const [activeHoverId, setActiveHoverId] = useState<string | null>(null);

  const selectedVillage =
    villages.find((v) => v.id === selectedVillageId) || villages[0];

  // Coordinates mapping for stylized SVG map layout (Assam Brahmaputra valley cluster)
  const markerPositions: Record<string, { cx: number; cy: number }> = {
    'vil-borigaon': { cx: 480, cy: 190 }, // Morigaon cluster
    'vil-sonapur': { cx: 280, cy: 230 }, // Kamrup cluster
    'vil-dakhin': { cx: 620, cy: 140 }, // Nagaon east cluster
    'vil-barpeta': { cx: 530, cy: 240 }, // Raha block cluster
  };

  const getMarkerColor = (level: RiskLevel) => {
    switch (level) {
      case 'CRITICAL':
        return '#e11d48'; // rose
      case 'HIGH':
        return '#ea580c'; // orange
      case 'MODERATE':
        return '#0284c7'; // sky
      case 'LOW':
      default:
        return '#059669'; // emerald
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col lg:flex-row gap-6">
      {/* SVG Stylized Map */}
      <div className="flex-1 relative bg-slate-900 rounded-xl overflow-hidden min-h-[340px] flex items-center justify-center p-4 border border-slate-800">
        {/* Subtle grid and river graphic */}
        <svg
          viewBox="0 0 800 400"
          className="w-full h-full max-h-[380px] select-none"
          style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' }}
        >
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.75" />
            </pattern>
            <linearGradient id="riverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0369a1" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#0284c7" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#0369a1" stopOpacity="0.3" />
            </linearGradient>
            <radialGradient id="highPulse" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ea580c" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background Grid */}
          <rect width="800" height="400" fill="url(#grid)" />

          {/* Regional Contour Zones */}
          <path
            d="M 60,300 Q 250,330 460,300 T 750,320 L 760,80 Q 520,60 300,90 T 50,110 Z"
            fill="#0f172a"
            stroke="#334155"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* Stylized River Path (Brahmaputra Valley Representation) */}
          <path
            d="M 40,160 C 180,120 280,210 420,170 S 600,190 760,130"
            fill="none"
            stroke="url(#riverGradient)"
            strokeWidth="28"
            strokeLinecap="round"
          />
          <path
            d="M 40,160 C 180,120 280,210 420,170 S 600,190 760,130"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="3"
            strokeDasharray="8 6"
            opacity="0.8"
          />

          {/* River Label */}
          <text x="360" y="195" fill="#7dd3fc" fontSize="11" fontWeight="600" opacity="0.6" letterSpacing="2">
            BRAHMAPUTRA VALLEY CORRIDOR
          </text>

          {/* Cluster Connection Routes */}
          <line x1="280" y1="230" x2="480" y2="190" stroke="#334155" strokeWidth="2" strokeDasharray="3 3" />
          <line x1="480" y1="190" x2="620" y2="140" stroke="#334155" strokeWidth="2" strokeDasharray="3 3" />
          <line x1="480" y1="190" x2="530" y2="240" stroke="#334155" strokeWidth="2" strokeDasharray="3 3" />

          {/* Village Node Markers */}
          {villages.map((v) => {
            const pos = markerPositions[v.id] || { cx: 400, cy: 200 };
            const isSelected = v.id === selectedVillageId;
            const isHigh = v.currentRisk === 'HIGH' || v.currentRisk === 'CRITICAL';
            const color = getMarkerColor(v.currentRisk);

            return (
              <g
                key={v.id}
                className="cursor-pointer transition-all duration-300"
                onClick={() => {
                  setSelectedVillageId(v.id);
                  if (onSelectVillage) onSelectVillage(v);
                }}
                onMouseEnter={() => setActiveHoverId(v.id)}
                onMouseLeave={() => setActiveHoverId(null)}
              >
                {/* Pulsing ring for High risk */}
                {isHigh && (
                  <circle cx={pos.cx} cy={pos.cy} r="28" fill="url(#highPulse)" className="animate-ping" opacity="0.5" />
                )}

                {/* Selection halo */}
                {isSelected && (
                  <circle cx={pos.cx} cy={pos.cy} r="22" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 2" />
                )}

                {/* Node Outer Circle */}
                <circle
                  cx={pos.cx}
                  cy={pos.cy}
                  r="14"
                  fill="#0f172a"
                  stroke={color}
                  strokeWidth="3.5"
                />

                {/* Node Center Core */}
                <circle cx={pos.cx} cy={pos.cy} r="6" fill={color} />

                {/* Village Label Box */}
                <rect
                  x={pos.cx - 50}
                  y={pos.cy + 18}
                  width="100"
                  height="22"
                  rx="6"
                  fill="#1e293b"
                  stroke={isSelected ? '#38bdf8' : '#475569'}
                  strokeWidth="1"
                />
                <text
                  x={pos.cx}
                  y={pos.cy + 33}
                  textAnchor="middle"
                  fill={isSelected ? '#ffffff' : '#cbd5e1'}
                  fontSize="11"
                  fontWeight={isSelected ? 'bold' : 'normal'}
                >
                  {v.name} ({v.overallRisk})
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating Map Legend */}
        <div className="absolute bottom-3 left-3 bg-slate-900/90 border border-slate-800 backdrop-blur-xs px-3 py-2 rounded-lg text-[10px] text-slate-300 flex items-center gap-3">
          <span className="font-bold text-slate-400">VILLAGE RISK:</span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Low
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block" /> Moderate
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block" /> High
          </span>
        </div>

        <div className="absolute top-3 right-3 text-right">
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-800">
            Assam Telemetry Mesh v2.1
          </span>
        </div>
      </div>

      {/* Village Details Inspector Panel */}
      <div className="w-full lg:w-80 flex flex-col justify-between bg-slate-50 rounded-xl p-4 border border-slate-200/80">
        <div>
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Selected Cluster
              </span>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600" />
                {selectedVillage.name}
              </h3>
              <p className="text-xs text-slate-500">
                {selectedVillage.district}, {selectedVillage.state}
              </p>
            </div>
            <RiskBadge level={selectedVillage.currentRisk} score={selectedVillage.overallRisk} />
          </div>

          {/* Quick Weather Snapshot */}
          <div className="grid grid-cols-2 gap-2 mt-3.5 bg-white p-2.5 rounded-lg border border-slate-200 text-xs">
            <div className="flex items-center gap-1.5">
              <ThermometerSun className="w-4 h-4 text-orange-500 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-500">Temperature</div>
                <div className="font-bold text-slate-800">{selectedVillage.weather.temperature}°C</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-sky-500 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-500">Humidity</div>
                <div className="font-bold text-slate-800">{selectedVillage.weather.humidity}% RH</div>
              </div>
            </div>
          </div>

          {/* Demographics & Affected Population */}
          <div className="space-y-2 mt-3.5">
            <div className="flex items-center justify-between text-xs py-1 border-b border-slate-200">
              <span className="text-slate-600 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-slate-400" /> Total Population
              </span>
              <span className="font-bold font-mono text-slate-800">{selectedVillage.population.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-xs py-1 border-b border-slate-200">
              <span className="text-slate-600 flex items-center gap-1.5">
                <Sprout className="w-3.5 h-3.5 text-emerald-600" /> Registered Farmers
              </span>
              <span className="font-bold font-mono text-slate-800">{selectedVillage.registeredFarmers}</span>
            </div>
            <div className="flex items-center justify-between text-xs py-1 border-b border-slate-200">
              <span className="text-slate-600 flex items-center gap-1.5">
                <HeartPulse className="w-3.5 h-3.5 text-rose-500" /> Health Workers (ASHA/ANM)
              </span>
              <span className="font-bold font-mono text-slate-800">{selectedVillage.healthWorkersCount}</span>
            </div>
          </div>

          {/* Risk Scores breakdown */}
          <div className="mt-4 pt-3 border-t border-slate-200">
            <div className="text-xs font-bold text-slate-700 mb-2">Domain Risk Breakdown:</div>
            <div className="space-y-1.5 text-xs">
              <div>
                <div className="flex justify-between text-[11px] mb-0.5 text-slate-600 font-medium">
                  <span>Occupational Heat Risk</span>
                  <span className="font-mono font-bold text-orange-700">{selectedVillage.heatRisk}/100</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-orange-500 h-full rounded-full" style={{ width: `${selectedVillage.heatRisk}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-0.5 text-slate-600 font-medium">
                  <span>Paddy/Crop Vulnerability</span>
                  <span className="font-mono font-bold text-emerald-700">{selectedVillage.agriculturalRisk}/100</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${selectedVillage.agriculturalRisk}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-0.5 text-slate-600 font-medium">
                  <span>Health Symptoms / Toxicity</span>
                  <span className="font-mono font-bold text-rose-700">{selectedVillage.healthRisk}/100</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full" style={{ width: `${selectedVillage.healthRisk}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-4 pt-3 border-t border-slate-200">
          <div className="text-[11px] text-amber-900 bg-amber-50 p-2 rounded-lg border border-amber-200 mb-2">
            <strong>{selectedVillage.highRiskIndividuals}</strong> high-risk laborers & <strong>{selectedVillage.atRiskFarms}</strong> farms currently flagged in {selectedVillage.name}.
          </div>
        </div>
      </div>
    </div>
  );
};

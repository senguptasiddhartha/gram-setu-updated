import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/common/PageHeader';
import { RiskGauge } from '../components/common/RiskGauge';
import { RiskBadge } from '../components/common/RiskBadge';
import { AudioListenButton } from '../components/common/AudioListenButton';
import {
  User,
  MapPin,
  Phone,
  Sprout,
  HeartPulse,
  ThermometerSun,
  ShieldAlert,
  Layers,
  Sparkles,
  RefreshCw,
  Share2,
  AlertTriangle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Droplets,
  Wind,
} from 'lucide-react';

interface FarmerDetailPageProps {
  onNavigate: (page: string) => void;
}

export const FarmerDetailPage: React.FC<FarmerDetailPageProps> = ({ onNavigate }) => {
  const {
    farmers,
    selectedFarmerId,
    recalculateFarmerRisk,
    addToast,
    healthScreenings,
  } = useApp();

  const [isRecalculating, setIsRecalculating] = useState(false);

  const farmer =
    farmers.find((f) => f.id === selectedFarmerId) || farmers[0];

  if (!farmer) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
        <p className="text-slate-600">No farmer selected.</p>
        <button
          onClick={() => onNavigate('farmers')}
          className="mt-3 px-4 py-2 bg-teal-700 text-white rounded-lg text-xs font-bold"
        >
          Return to Farmer Directory
        </button>
      </div>
    );
  }

  const handleRunAssessment = async () => {
    setIsRecalculating(true);
    await new Promise((r) => setTimeout(r, 600));
    await recalculateFarmerRisk(farmer.id);
    setIsRecalculating(false);
  };

  const spokenAdvisory = `Risk report for ${farmer.name} in ${farmer.village}. Overall rural risk is ${farmer.overallRiskScore} out of 100, category ${farmer.riskCategory}. Heat stress risk is ${farmer.heatRiskScore} due to ${farmer.dailyOutdoorHours} hours of outdoor work under 39 degrees Celsius. Paddy disease risk is ${farmer.cropRiskScore}. Recommended immediate action: Avoid field labor during peak heat, hydrate with ORS, and inspect paddy lower leaves for fungal lesions.`;

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Action bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('farmers')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Kisan Registry</span>
        </button>

        <div className="flex items-center gap-2">
          <AudioListenButton textToRead={spokenAdvisory} label="Listen to Risk Report" variant="secondary" />
          <button
            onClick={handleRunAssessment}
            disabled={isRecalculating}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRecalculating ? 'animate-spin' : ''}`} />
            <span>{isRecalculating ? 'Calculating Multi-Risk...' : 'Run Risk Assessment'}</span>
          </button>
        </div>
      </div>

      {/* Main Profile Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-100 border border-teal-300 flex items-center justify-center text-teal-800 font-extrabold text-xl shrink-0 font-mono shadow-xs">
              {farmer.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl font-extrabold text-slate-900">{farmer.name}</h2>
                <RiskBadge level={farmer.riskCategory} score={farmer.overallRiskScore} size="md" />
                <span className="text-xs bg-slate-100 text-slate-700 font-mono font-semibold px-2.5 py-0.5 rounded-full border border-slate-200">
                  {farmer.farmerId}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-500 mt-1.5 flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {farmer.village}, {farmer.district}, {farmer.state}
                </span>
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  {farmer.age} yrs • {farmer.gender}
                </span>
                <span className="flex items-center gap-1 font-mono">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {farmer.phone}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-right">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">ABDM ABHA Health ID</span>
              <span className="font-mono font-bold text-xs text-teal-900">{farmer.abhaId || '91-4820-1928-3019'}</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-right">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">AgriStack Plot</span>
              <span className="font-mono font-bold text-xs text-emerald-900">DAG-412/108 ({farmer.farmSize} ac)</span>
            </div>
          </div>
        </div>

        {/* Overall Score & Domain Breakdown Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-6 items-center">
          <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-slate-50/70 border border-slate-200/80 rounded-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              OVERALL RURAL RISK SCORE
            </span>
            <RiskGauge score={farmer.overallRiskScore} size={150} />
            <p className="text-[11px] text-slate-500 text-center mt-2">
              Compounded calculation of occupational heat, crop disease, and worker clinical symptoms.
            </p>
          </div>

          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-orange-50/70 border border-orange-200 rounded-xl p-3.5 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-orange-800">Heat Risk</span>
                <div className="text-2xl font-extrabold font-mono text-orange-950 mt-1">
                  {farmer.heatRiskScore}
                </div>
              </div>
              <div className="text-[11px] text-orange-800/80 mt-2 font-medium">
                {farmer.dailyOutdoorHours}h field sun
              </div>
            </div>

            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-800">Crop Risk</span>
                <div className="text-2xl font-extrabold font-mono text-emerald-950 mt-1">
                  {farmer.cropRiskScore}
                </div>
              </div>
              <div className="text-[11px] text-emerald-800/80 mt-2 font-medium">
                {farmer.primaryCrop} ({farmer.cropGrowthStage})
              </div>
            </div>

            <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-3.5 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-rose-800">Health Risk</span>
                <div className="text-2xl font-extrabold font-mono text-rose-950 mt-1">
                  {farmer.healthRiskScore}
                </div>
              </div>
              <div className="text-[11px] text-rose-800/80 mt-2 font-medium">
                {farmer.symptoms.length > 0 ? `${farmer.symptoms.length} symptoms` : 'No acute signs'}
              </div>
            </div>

            <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-3.5 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-sky-800">Environmental</span>
                <div className="text-2xl font-extrabold font-mono text-sky-950 mt-1">
                  {farmer.environmentalRiskScore || 65}
                </div>
              </div>
              <div className="text-[11px] text-sky-800/80 mt-2 font-medium">
                39°C • 78% RH
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Dual Domain Analysis: Health vs Agriculture */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Domain A: Health & Occupational Exposure */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-rose-600" />
              Occupational Health & Exposure Profile
            </h3>
            <span className="text-xs text-slate-400">ABDM Synced</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500">Outdoor Work Exposure:</span>
                <div className="text-sm font-bold text-slate-800 mt-0.5">
                  {farmer.dailyOutdoorHours} Hours / Day
                </div>
                <span className="text-[10px] text-orange-600 font-semibold">Exceeds 4h safe heat threshold</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500">Chemical Pesticide Exposure:</span>
                <div className="text-sm font-bold text-slate-800 mt-0.5">
                  {farmer.recentPesticideExposure ? 'Yes (Active)' : 'No Exposure'}
                </div>
                {farmer.pesticideName && (
                  <span className="text-[10px] text-amber-700 font-mono font-medium block">
                    {farmer.pesticideName}
                  </span>
                )}
              </div>
            </div>

            <div>
              <span className="font-semibold text-slate-700 block mb-1.5">
                Reported Clinical Symptoms:
              </span>
              {farmer.symptoms.length === 0 ? (
                <p className="text-slate-400 italic">No acute symptoms reported in last 7 days.</p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {farmer.symptoms.map((s) => (
                    <span
                      key={s}
                      className="px-2.5 py-1 bg-rose-50 border border-rose-200 text-rose-800 font-bold rounded-lg text-xs"
                    >
                      ⚠️ {s}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <span className="font-semibold text-slate-700">Existing Health Context:</span>
              <p className="text-slate-600 mt-0.5 leading-relaxed">
                {farmer.existingHealthConcerns || 'No chronic pre-existing medical record.'}
              </p>
            </div>
          </div>
        </div>

        {/* Domain B: Agricultural & Crop Microclimate */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sprout className="w-4 h-4 text-emerald-600" />
              Agronomic Plot Profile & Vulnerability
            </h3>
            <span className="text-xs text-slate-400">AgriStack Synced</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-3 gap-2">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500">Crop & Variety:</span>
                <div className="font-bold text-slate-800 mt-0.5">{farmer.primaryCrop}</div>
                <div className="text-[10px] text-slate-400 font-mono">{farmer.cropVariety || 'Standard'}</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500">Growth Stage:</span>
                <div className="font-bold text-slate-800 mt-0.5">{farmer.cropGrowthStage}</div>
                <div className="text-[10px] text-emerald-600 font-semibold">Panicle / Flowering</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500">Soil Moisture:</span>
                <div className="font-bold text-slate-800 mt-0.5">{farmer.soilMoisture}</div>
                <div className="text-[10px] text-slate-400 font-mono">{farmer.soilType}</div>
              </div>
            </div>

            <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-1">
              <div className="font-bold text-emerald-950">Crop Disease Diagnostic:</div>
              <p className="text-emerald-900 text-[11px] leading-relaxed">
                High relative humidity (78%) in Borigaon combined with warm temperature increases Blast / Sheath Blight vulnerability during {farmer.cropGrowthStage} stage.
              </p>
            </div>

            <div className="flex items-center justify-between text-xs py-2 border-t border-slate-100">
              <span className="text-slate-500">Irrigation Structure:</span>
              <span className="font-bold text-slate-800">{farmer.irrigationType}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Synchronized Action Directives for this Farmer */}
      <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-400" />
            AI Actionable Recommendations for {farmer.name}
          </h3>
          <span className="text-xs text-amber-300 font-mono font-bold">Urgency: High</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80">
            <div className="text-teal-300 font-bold uppercase tracking-wider text-[10px] mb-1">
              1. Work Rescheduling
            </div>
            <p className="text-slate-200 leading-snug">
              Exempt from field weeding between 11:30 AM and 3:30 PM. Shift remaining fertilizer spray to 6:00 AM.
            </p>
          </div>

          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80">
            <div className="text-rose-300 font-bold uppercase tracking-wider text-[10px] mb-1">
              2. Health Worker Protocol
            </div>
            <p className="text-slate-200 leading-snug">
              ASHA worker Mina Das to deliver 4 sachets of ORS and conduct on-site blood pressure screening.
            </p>
          </div>

          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80">
            <div className="text-emerald-300 font-bold uppercase tracking-wider text-[10px] mb-1">
              3. Paddy Disease Defense
            </div>
            <p className="text-slate-200 leading-snug">
              Drain standing surface water from plot DAG-412/108 to arrest fungal mycelium proliferation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

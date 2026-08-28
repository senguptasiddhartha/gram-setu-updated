import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/common/PageHeader';
import { RiskGauge } from '../components/common/RiskGauge';
import { RiskBadge } from '../components/common/RiskBadge';
import { AudioListenButton } from '../components/common/AudioListenButton';
import { calculateCrossDomainRisk } from '../engines/riskEngine';
import {
  Flame,
  Sprout,
  HeartPulse,
  CloudSun,
  Activity,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  Layers,
  ThermometerSun,
  Droplets,
  AlertOctagon,
} from 'lucide-react';

export const CrossDomainEnginePage: React.FC = () => {
  const { selectedVillage, launchDemoScenario } = useApp();

  const [simParams, setSimParams] = useState({
    temperature: 39,
    humidity: 78,
    rainfallMm: 14,
    crop: 'Paddy',
    outdoorWorkHours: 6,
    pesticideExposure: true,
    reportedSymptoms: ['Dizziness', 'Fatigue', 'Headache'],
    exposedWorkersCount: 42,
  });

  const availableSymptoms = ['Dizziness', 'Fatigue', 'Headache', 'Nausea', 'Breathing Difficulty', 'Skin Rash'];

  const handleSymptomToggle = (symptom: string) => {
    setSimParams((prev) => {
      const exists = prev.reportedSymptoms.includes(symptom);
      return {
        ...prev,
        reportedSymptoms: exists
          ? prev.reportedSymptoms.filter((s) => s !== symptom)
          : [...prev.reportedSymptoms, symptom],
      };
    });
  };

  const assessment = calculateCrossDomainRisk(simParams);

  const spokenNarrative = `Gram Setu Cross-Domain Intelligence Assessment for ${selectedVillage.name}: Overall Community Risk Score is ${assessment.communityRiskScore} out of 100, risk level ${assessment.riskCategory}. Why this matters: ${assessment.whyThisMatters}. Synchronized 5-point action plan: 1. Reschedule outdoor agricultural field work away from peak midday sun. 2. Deploy ASHA mobile health screening for ${simParams.exposedWorkersCount} exposed workers. 3. Initiate intensive ${simParams.crop} fungal disease scouting. 4. Establish hydration canopies with ORS. 5. Transmit alert to Block Agriculture Officers.`;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cross-Domain Rural Risk Engine"
        subtitle="The Core Differentiator: Intersecting Agriculture, Occupational Health, Weather Telemetry & Environmental Stressors."
        badge="Key Innovation"
      >
        <AudioListenButton textToRead={spokenNarrative} label="Listen to Intelligence Briefing" variant="primary" />
      </PageHeader>

      {/* Visual Conceptual Formula Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-teal-950 text-white rounded-2xl p-6 border border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <span className="text-[10px] uppercase font-bold text-teal-400 tracking-wider">
              Integrated Rural Life-Support Framework
            </span>
            <h2 className="text-lg font-extrabold text-slate-100 mt-0.5">
              Intersection Intelligence Equation
            </h2>
          </div>
          <button
            onClick={() => {
              setSimParams({
                temperature: 39,
                humidity: 78,
                rainfallMm: 14,
                crop: 'Paddy',
                outdoorWorkHours: 6,
                pesticideExposure: true,
                reportedSymptoms: ['Dizziness', 'Fatigue', 'Headache'],
                exposedWorkersCount: 42,
              });
              launchDemoScenario();
            }}
            className="px-3.5 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load Borigaon Dual Crisis Scenario</span>
          </button>
        </div>

        {/* 4 Inputs Flow Equation */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 items-center text-xs">
          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-700/80 text-center">
            <CloudSun className="w-5 h-5 text-sky-400 mx-auto mb-1" />
            <div className="font-bold text-slate-200">Weather Telemetry</div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
              {simParams.temperature}°C • {simParams.humidity}% RH
            </div>
          </div>

          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-700/80 text-center">
            <Sprout className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
            <div className="font-bold text-slate-200">Crop Phenology</div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
              {simParams.crop} (Flowering)
            </div>
          </div>

          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-700/80 text-center">
            <HeartPulse className="w-5 h-5 text-rose-400 mx-auto mb-1" />
            <div className="font-bold text-slate-200">Worker Exposure</div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
              {simParams.outdoorWorkHours}h Sun • Pesticide
            </div>
          </div>

          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-700/80 text-center">
            <Activity className="w-5 h-5 text-amber-400 mx-auto mb-1" />
            <div className="font-bold text-slate-200">Clinical Symptoms</div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
              {simParams.reportedSymptoms.length} Reported Flags
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 p-3 bg-gradient-to-br from-teal-900 to-emerald-900 rounded-xl border border-teal-500/50 text-center shadow-lg">
            <Flame className="w-5 h-5 text-amber-300 mx-auto mb-1" />
            <div className="font-bold text-white">Community Risk</div>
            <div className="text-sm font-extrabold text-amber-300 font-mono">
              {assessment.communityRiskScore} / 100
            </div>
          </div>
        </div>
      </div>

      {/* Main Simulation Panel & Output Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Multi-Domain Controls (6 Columns) */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-teal-600" />
              Scenario Analysis Variables
            </h3>
            <span className="text-xs font-mono text-slate-400">Live Feedback</span>
          </div>

          <div className="space-y-4 text-xs">
            {/* Sliders */}
            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>Ambient Air Temperature</span>
                <span className="font-mono font-bold text-orange-600">{simParams.temperature}°C</span>
              </div>
              <input
                type="range"
                min="26"
                max="45"
                step="0.5"
                value={simParams.temperature}
                onChange={(e) => setSimParams({ ...simParams, temperature: Number(e.target.value) })}
                className="w-full accent-orange-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>Relative Humidity (Canopy Microclimate)</span>
                <span className="font-mono font-bold text-sky-600">{simParams.humidity}% RH</span>
              </div>
              <input
                type="range"
                min="35"
                max="98"
                value={simParams.humidity}
                onChange={(e) => setSimParams({ ...simParams, humidity: Number(e.target.value) })}
                className="w-full accent-sky-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>Daily Outdoor Work Duration</span>
                <span className="font-mono font-bold text-slate-800">{simParams.outdoorWorkHours} Hours/Day</span>
              </div>
              <input
                type="range"
                min="1"
                max="12"
                value={simParams.outdoorWorkHours}
                onChange={(e) => setSimParams({ ...simParams, outdoorWorkHours: Number(e.target.value) })}
                className="w-full accent-slate-800 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>Exposed Agricultural Laborers Count</span>
                <span className="font-mono font-bold text-teal-700">{simParams.exposedWorkersCount} Workers</span>
              </div>
              <input
                type="range"
                min="5"
                max="250"
                value={simParams.exposedWorkersCount}
                onChange={(e) => setSimParams({ ...simParams, exposedWorkersCount: Number(e.target.value) })}
                className="w-full accent-teal-700 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Crop Type</label>
                <select
                  value={simParams.crop}
                  onChange={(e) => setSimParams({ ...simParams, crop: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold"
                >
                  <option value="Paddy">Paddy (Rice)</option>
                  <option value="Vegetables">Vegetables / Horticulture</option>
                  <option value="Mustard">Mustard</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pesticide Spray Active?</label>
                <div className="flex items-center gap-3 mt-2">
                  <label className="flex items-center gap-1.5 font-semibold cursor-pointer">
                    <input
                      type="radio"
                      name="crossPest"
                      checked={simParams.pesticideExposure === true}
                      onChange={() => setSimParams({ ...simParams, pesticideExposure: true })}
                    />
                    Yes
                  </label>
                  <label className="flex items-center gap-1.5 font-semibold cursor-pointer">
                    <input
                      type="radio"
                      name="crossPest"
                      checked={simParams.pesticideExposure === false}
                      onChange={() => setSimParams({ ...simParams, pesticideExposure: false })}
                    />
                    No
                  </label>
                </div>
              </div>
            </div>

            {/* Symptoms checkboxes */}
            <div className="pt-2 border-t border-slate-100">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block mb-1.5">
                Observed Field Symptoms:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {availableSymptoms.map((symptom) => {
                  const isChecked = simParams.reportedSymptoms.includes(symptom);
                  return (
                    <button
                      key={symptom}
                      type="button"
                      onClick={() => handleSymptomToggle(symptom)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-rose-50 border-rose-300 text-rose-800 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {isChecked ? '⚠️ ' : '+ '}
                      {symptom}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Synthesized Community Risk & "Why This Matters" (6 Columns) */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Integrated Outcome</span>
                <h3 className="text-base font-bold text-slate-900">Community Risk Score</h3>
              </div>
              <RiskBadge level={assessment.riskCategory} score={assessment.communityRiskScore} size="lg" />
            </div>

            {/* Circular Gauge Centerpiece */}
            <div className="flex justify-center py-2">
              <RiskGauge
                score={assessment.communityRiskScore}
                label="Integrated Community Risk"
                size={160}
                strokeWidth={12}
              />
            </div>

            {/* Sub-domain quad */}
            <div className="grid grid-cols-4 gap-2 text-xs">
              <div className="p-2 bg-orange-50 border border-orange-200 rounded-lg text-center">
                <span className="text-[9px] uppercase font-bold text-orange-800 block">Heat Risk</span>
                <span className="font-mono font-extrabold text-sm text-orange-950">
                  {assessment.heatRisk}
                </span>
              </div>
              <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-center">
                <span className="text-[9px] uppercase font-bold text-emerald-800 block">Crop Risk</span>
                <span className="font-mono font-extrabold text-sm text-emerald-950">
                  {assessment.cropRisk}
                </span>
              </div>
              <div className="p-2 bg-rose-50 border border-rose-200 rounded-lg text-center">
                <span className="text-[9px] uppercase font-bold text-rose-800 block">Health Risk</span>
                <span className="font-mono font-extrabold text-sm text-rose-950">
                  {assessment.healthRisk}
                </span>
              </div>
              <div className="p-2 bg-sky-50 border border-sky-200 rounded-lg text-center">
                <span className="text-[9px] uppercase font-bold text-sky-800 block">Env Risk</span>
                <span className="font-mono font-extrabold text-sm text-sky-950">
                  {assessment.environmentalRisk}
                </span>
              </div>
            </div>

            {/* "Why This Matters" Card */}
            <div className="mt-4 p-4 bg-slate-900 text-white rounded-xl border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-teal-400 tracking-wider">
                  Why This Matters (Compounding Risk Synthesis)
                </span>
                <span className="text-[10px] font-mono text-amber-300">
                  {simParams.exposedWorkersCount} At-Risk Laborers
                </span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-sans">
                {assessment.whyThisMatters}
              </p>
            </div>
          </div>

          <div className="pt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>Urgency Window: <strong className="text-slate-800">{assessment.urgency}</strong></span>
            <span>Mathematical Weights: 35% Heat / 30% Crop / 25% Health / 10% Env</span>
          </div>
        </div>
      </div>

      {/* Synchronized 5-Point Cross-Domain Directives */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              Synchronized 5-Point Cross-Domain Action Directives
            </h3>
            <p className="text-xs text-slate-500">
              Simultaneous coordination across ASHA Health Workers, Farmers, and Agriculture Officers.
            </p>
          </div>
          <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
            5 Directives Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
          {assessment.recommendations.map((rec) => (
            <div
              key={rec.id}
              className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between space-y-2 hover:border-teal-300 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-teal-300 font-mono font-bold flex items-center justify-center text-[10px]">
                    {rec.id}
                  </span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                      rec.domain === 'Health'
                        ? 'bg-rose-100 text-rose-800'
                        : rec.domain === 'Agriculture'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-teal-100 text-teal-800'
                    }`}
                  >
                    {rec.domain}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 leading-snug">{rec.title}</h4>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{rec.action}</p>
              </div>

              <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[10px]">
                <span className="text-slate-400">Priority:</span>
                <span className="font-bold text-slate-700">{rec.priority}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

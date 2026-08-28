import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/common/PageHeader';
import { StatCard } from '../components/common/StatCard';
import { RiskBadge } from '../components/common/RiskBadge';
import { RiskGauge } from '../components/common/RiskGauge';
import { AudioListenButton } from '../components/common/AudioListenButton';
import { calculateCropRisk } from '../engines/riskEngine';
import {
  Sprout,
  ThermometerSun,
  Droplets,
  CloudRain,
  Wind,
  ShieldAlert,
  Sparkles,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Send,
} from 'lucide-react';

export const AgricultureIntelligencePage: React.FC = () => {
  const { selectedVillage, addFarmAssessment, farmers, isOnline } = useApp();

  // Farm Analysis Form State
  const [formInputs, setFormInputs] = useState({
    crop: 'Paddy',
    cropStage: 'Flowering (Critical)',
    temperature: selectedVillage.weather.temperature,
    humidity: selectedVillage.weather.humidity,
    rainfallMm: selectedVillage.weather.rainfall || 14,
    soilMoisture: 'Waterlogged' as 'Low' | 'Medium' | 'High' | 'Waterlogged',
    recentPesticideUse: true,
    observedSymptoms: ['Foliar leaf spots', 'Water-soaked lesions'],
  });

  const availableSymptoms = [
    'Foliar leaf spots',
    'Water-soaked lesions',
    'Leaf yellowing / chlorosis',
    'Stem discoloration',
    'Blast diamond lesions',
    'Whitefly infestation',
  ];

  const handleSymptomToggle = (symptom: string) => {
    setFormInputs((prev) => {
      const exists = prev.observedSymptoms.includes(symptom);
      return {
        ...prev,
        observedSymptoms: exists
          ? prev.observedSymptoms.filter((s) => s !== symptom)
          : [...prev.observedSymptoms, symptom],
      };
    });
  };

  const cropEvaluation = calculateCropRisk(formInputs);

  const handleSaveAssessment = async () => {
    await addFarmAssessment({
      farmerId: farmers[0]?.id || 'farmer-101',
      farmerName: farmers[0]?.name || 'Ramesh Das',
      village: selectedVillage.name,
      crop: formInputs.crop,
      cropStage: formInputs.cropStage,
      assessmentDate: new Date().toISOString(),
      temperature: formInputs.temperature,
      humidity: formInputs.humidity,
      rainfallMm: formInputs.rainfallMm,
      soilMoisture: formInputs.soilMoisture,
      recentPesticideUse: formInputs.recentPesticideUse,
      observedSymptoms: formInputs.observedSymptoms,
    });
  };

  const spokenAdvisory = `Agricultural Risk Diagnostic for ${formInputs.crop} in ${selectedVillage.name}: Overall crop risk score is ${cropEvaluation.overallCropRiskScore} out of 100, category ${cropEvaluation.riskCategory}. Fungal disease index is ${cropEvaluation.diseaseRiskScore} due to ${formInputs.humidity}% relative humidity. Recommended actions: ${cropEvaluation.advisories.join('. ')}.`;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Agricultural Risk Intelligence"
        subtitle="Microclimate agromet models calculating crop disease probability, drought stress, and pest pressure."
        badge="AgriStack Telemetry"
      >
        <AudioListenButton textToRead={spokenAdvisory} label="Listen to Crop Advisory" variant="secondary" />
      </PageHeader>

      {/* Current Agromet Telemetry Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <StatCard
          title="Ambient Temperature"
          value={`${selectedVillage.weather.temperature}°C`}
          subtext="Sensor: Borigaon Mesh"
          icon={<ThermometerSun className="w-4 h-4" />}
          iconBg="bg-orange-50 text-orange-700 border-orange-200"
        />
        <StatCard
          title="Relative Humidity"
          value={`${selectedVillage.weather.humidity}% RH`}
          subtext="Accelerates fungal spore spread"
          icon={<Droplets className="w-4 h-4" />}
          iconBg="bg-sky-50 text-sky-700 border-sky-200"
        />
        <StatCard
          title="Rain Probability"
          value={`${selectedVillage.weather.rainProbability}%`}
          subtext="24h Accumulation: 12mm"
          icon={<CloudRain className="w-4 h-4" />}
          iconBg="bg-blue-50 text-blue-700 border-blue-200"
        />
        <StatCard
          title="Wind Velocity"
          value={`${selectedVillage.weather.windSpeed} km/h`}
          subtext="Direction: South-South-East"
          icon={<Wind className="w-4 h-4" />}
          iconBg="bg-teal-50 text-teal-700 border-teal-200"
        />
      </div>

      {/* 3 Major Regional Crop Risk Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Sprout className="w-4 h-4 text-emerald-600" /> Paddy (Kharif Rice)
              </span>
              <RiskBadge level="HIGH" score={72} size="sm" />
            </div>
            <div className="mt-3 space-y-1.5 text-xs text-slate-600">
              <div className="text-sm font-bold text-rose-700">Disease Risk: 72% (Blast / Blight)</div>
              <p className="text-[11px] text-slate-500 leading-snug">
                78% humidity combined with warm nights accelerates Pyricularia oryzae fungal germination in flowering canopies.
              </p>
            </div>
          </div>
          <div className="mt-4 pt-2.5 border-t border-slate-100 text-[11px] text-slate-500 font-semibold">
            Action: Immediate field drainage inspection
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Sprout className="w-4 h-4 text-teal-600" /> Vegetable Crops
              </span>
              <RiskBadge level="MODERATE" score={41} size="sm" />
            </div>
            <div className="mt-3 space-y-1.5 text-xs text-slate-600">
              <div className="text-sm font-bold text-blue-700">Disease Risk: 41% (Downy Mildew)</div>
              <p className="text-[11px] text-slate-500 leading-snug">
                Localized moisture pockets require monitoring for whitefly and damping-off on tomato and brinjal plots.
              </p>
            </div>
          </div>
          <div className="mt-4 pt-2.5 border-t border-slate-100 text-[11px] text-slate-500 font-semibold">
            Action: Yellow sticky traps deployment
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Sprout className="w-4 h-4 text-amber-600" /> Mustard / Oilseeds
              </span>
              <RiskBadge level="LOW" score={28} size="sm" />
            </div>
            <div className="mt-3 space-y-1.5 text-xs text-slate-600">
              <div className="text-sm font-bold text-emerald-700">Weather Risk: 28% (Stable)</div>
              <p className="text-[11px] text-slate-500 leading-snug">
                Vegetative growth stage currently insulated from high temperatures. Soil moisture remains adequate.
              </p>
            </div>
          </div>
          <div className="mt-4 pt-2.5 border-t border-slate-100 text-[11px] text-slate-500 font-semibold">
            Action: Routine intercultural weeding
          </div>
        </div>
      </div>

      {/* Main Interactive "Analyze Farm Risk" Form & Engine Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Parameters Form (7 Columns) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              Analyze Farm Risk (Agronomic Simulator)
            </h3>
            <span className="text-xs text-slate-400 font-mono">AgriStack Engine v1.8</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target Crop</label>
              <select
                value={formInputs.crop}
                onChange={(e) => setFormInputs({ ...formInputs, crop: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold"
              >
                <option value="Paddy">Paddy (Rice)</option>
                <option value="Vegetables">Vegetables / Horticulture</option>
                <option value="Mustard">Mustard / Oilseed</option>
                <option value="Maize">Maize</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Phenological Stage</label>
              <select
                value={formInputs.cropStage}
                onChange={(e) => setFormInputs({ ...formInputs, cropStage: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              >
                <option value="Germination">Germination</option>
                <option value="Vegetative">Vegetative</option>
                <option value="Tillering">Tillering</option>
                <option value="Flowering (Critical)">Flowering (Critical Vulnerability)</option>
                <option value="Grain Filling">Grain Filling</option>
                <option value="Harvesting">Harvesting</option>
              </select>
            </div>
          </div>

          {/* Microclimate Sliders */}
          <div className="space-y-3 pt-2 text-xs">
            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>Field Canopy Humidity (%)</span>
                <span className="font-mono font-bold text-sky-600">{formInputs.humidity}%</span>
              </div>
              <input
                type="range"
                min="35"
                max="98"
                value={formInputs.humidity}
                onChange={(e) => setFormInputs({ ...formInputs, humidity: Number(e.target.value) })}
                className="w-full accent-sky-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>Recent Rainfall (mm)</span>
                <span className="font-mono font-bold text-blue-600">{formInputs.rainfallMm} mm</span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                value={formInputs.rainfallMm}
                onChange={(e) => setFormInputs({ ...formInputs, rainfallMm: Number(e.target.value) })}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Soil Moisture Condition</label>
                <select
                  value={formInputs.soilMoisture}
                  onChange={(e) =>
                    setFormInputs({ ...formInputs, soilMoisture: e.target.value as any })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="Low">Low (Drought Stress)</option>
                  <option value="Medium">Medium (Optimal)</option>
                  <option value="High">High (Wet)</option>
                  <option value="Waterlogged">Waterlogged (Fungal Incubation)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pesticide / Fungicide Use</label>
                <div className="flex items-center gap-4 mt-2">
                  <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
                    <input
                      type="radio"
                      name="pestUse"
                      checked={formInputs.recentPesticideUse === true}
                      onChange={() => setFormInputs({ ...formInputs, recentPesticideUse: true })}
                    />
                    Recent Application
                  </label>
                  <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
                    <input
                      type="radio"
                      name="pestUse"
                      checked={formInputs.recentPesticideUse === false}
                      onChange={() => setFormInputs({ ...formInputs, recentPesticideUse: false })}
                    />
                    No Chemical Spray
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Observed Field Symptoms */}
          <div className="pt-2 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
              Visual Symptoms Scouted in Field:
            </span>
            <div className="flex flex-wrap gap-1.5 text-xs">
              {availableSymptoms.map((sym) => {
                const isSelected = formInputs.observedSymptoms.includes(sym);
                return (
                  <button
                    key={sym}
                    type="button"
                    onClick={() => handleSymptomToggle(sym)}
                    className={`px-2.5 py-1 rounded-lg font-semibold border transition-all text-xs cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {sym}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Calculated Output Card (5 Columns) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sprout className="w-4 h-4 text-emerald-600" />
                Agronomic Risk Calculation
              </h3>
              <RiskBadge level={cropEvaluation.riskCategory} score={cropEvaluation.overallCropRiskScore} />
            </div>

            {/* Gauge */}
            <div className="flex justify-center py-2">
              <RiskGauge
                score={cropEvaluation.overallCropRiskScore}
                label={`${formInputs.crop} Overall Risk`}
                size={145}
              />
            </div>

            {/* Scores breakdown */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                <span className="text-[10px] uppercase font-bold text-emerald-800 block">Disease Risk</span>
                <span className="text-lg font-extrabold font-mono text-emerald-950">
                  {cropEvaluation.diseaseRiskScore}%
                </span>
              </div>
              <div className="p-2.5 bg-orange-50 border border-orange-200 rounded-xl text-center">
                <span className="text-[10px] uppercase font-bold text-orange-800 block">Weather Risk</span>
                <span className="text-lg font-extrabold font-mono text-orange-950">
                  {cropEvaluation.weatherRiskScore}%
                </span>
              </div>
              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-center">
                <span className="text-[10px] uppercase font-bold text-amber-800 block">Pest Risk</span>
                <span className="text-lg font-extrabold font-mono text-amber-950">
                  {cropEvaluation.pestRiskScore}%
                </span>
              </div>
            </div>

            {/* Deterministic Reasoning list */}
            <div className="mt-3.5 space-y-1.5 text-xs">
              <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px] block">
                Rule-Based Diagnostic Reasoning:
              </span>
              <ul className="space-y-1">
                {cropEvaluation.reasoning.map((r, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 text-slate-600 text-[11px]">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Advisories & Save Assessment button */}
          <div className="pt-3 border-t border-slate-100 space-y-2.5">
            <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block">
              Krishi Vigyan Kendra (KVK) Advisory:
            </span>
            <div className="space-y-1.5 text-xs">
              {cropEvaluation.advisories.map((adv, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-start gap-2"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                  <span className="leading-snug text-[11px]">{adv}</span>
                </div>
              ))}
            </div>

            <button
              onClick={handleSaveAssessment}
              className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Record & Broadcast Farm Assessment ({isOnline ? 'Central Sync' : 'Offline Queue'})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

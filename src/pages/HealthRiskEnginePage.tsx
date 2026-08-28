import React, { useState } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { RiskGauge } from '../components/common/RiskGauge';
import { RiskBadge } from '../components/common/RiskBadge';
import { AudioListenButton } from '../components/common/AudioListenButton';
import { calculateHealthRisk } from '../engines/riskEngine';

import {
  Activity,
  ThermometerSun,
  FlaskConical,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

type HealthInputs = {
  temperature: number;
  humidity: number;
  outdoorWorkHours: number;
  waterIntakeLiters: number;
  dizziness: boolean;
  fatigue: boolean;
  headache: boolean;
  nausea: boolean;
  breathingDifficulty: boolean;
  muscleCramps: boolean;
  pesticideExposure: boolean;
  bodyTemperature: number;
};

const DEMO_CASE: HealthInputs = {
  temperature: 39,
  humidity: 78,
  outdoorWorkHours: 6,
  waterIntakeLiters: 1.5,
  dizziness: true,
  fatigue: true,
  headache: true,
  nausea: true,
  breathingDifficulty: false,
  muscleCramps: true,
  pesticideExposure: true,
  bodyTemperature: 38.2,
};

export const HealthRiskEnginePage: React.FC = () => {
  const [inputs, setInputs] = useState<HealthInputs>({
    ...DEMO_CASE,
  });

  const result = calculateHealthRisk(inputs);

  const spokenReport =
    `Health Risk Evaluation. ` +
    `Overall health risk is ${result.overallHealthScore} out of 100. ` +
    `Risk category is ${result.riskCategory}. ` +
    `Heat stress score is ${result.heatStressScore}. ` +
    `Pesticide exposure risk is ${result.pesticideRiskScore}. ` +
    `Top contributing factors are ${result.topFactors.join(', ')}. ` +
    `Recommended actions are ${result.recommendations.join(', ')}.`;

  const updateInput = <K extends keyof HealthInputs>(
    key: K,
    value: HealthInputs[K]
  ) => {
    setInputs((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const resetDemo = () => {
    setInputs({
      ...DEMO_CASE,
    });
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <PageHeader
        title="Predictive Health Risk Engine"
        subtitle="Assess occupational heat stress and pesticide exposure using environmental and reported health indicators."
        badge="Live Risk Assessment"
      >
        <AudioListenButton
          textToRead={spokenReport}
          label="Listen to Report"
          variant="secondary"
        />
      </PageHeader>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* INPUT PANEL */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">

          {/* Panel Header */}
          <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ThermometerSun className="w-4 h-4 text-orange-600" />
                Health & Environment Inputs
              </h3>

              <p className="text-[11px] text-slate-500 mt-1">
                Adjust the field conditions to see the risk score change instantly.
              </p>
            </div>

            <button
              type="button"
              onClick={resetDemo}
              className="shrink-0 text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Demo Case
            </button>
          </div>

          {/* Environmental Inputs */}
          <div className="mt-5 space-y-5">

            {/* Temperature */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-semibold text-slate-700">
                  Ambient Temperature
                </span>

                <span className="font-mono font-bold text-orange-600 text-xs">
                  {inputs.temperature}°C
                </span>
              </div>

              <input
                type="range"
                min="24"
                max="46"
                step="0.5"
                value={inputs.temperature}
                onChange={(e) =>
                  updateInput(
                    'temperature',
                    Number(e.target.value)
                  )
                }
                className="w-full accent-orange-600 cursor-pointer"
              />

              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>24°C</span>
                <span>32°C</span>
                <span>46°C</span>
              </div>
            </div>

            {/* Humidity */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-semibold text-slate-700">
                  Relative Humidity
                </span>

                <span className="font-mono font-bold text-sky-600 text-xs">
                  {inputs.humidity}%
                </span>
              </div>

              <input
                type="range"
                min="30"
                max="95"
                value={inputs.humidity}
                onChange={(e) =>
                  updateInput(
                    'humidity',
                    Number(e.target.value)
                  )
                }
                className="w-full accent-sky-600 cursor-pointer"
              />

              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>30%</span>
                <span>65%</span>
                <span>95%</span>
              </div>
            </div>

            {/* Outdoor Hours */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-semibold text-slate-700">
                  Outdoor Work Exposure
                </span>

                <span className="font-mono font-bold text-slate-800 text-xs">
                  {inputs.outdoorWorkHours} hours
                </span>
              </div>

              <input
                type="range"
                min="1"
                max="12"
                value={inputs.outdoorWorkHours}
                onChange={(e) =>
                  updateInput(
                    'outdoorWorkHours',
                    Number(e.target.value)
                  )
                }
                className="w-full accent-slate-800 cursor-pointer"
              />

              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>1 hour</span>
                <span>6 hours</span>
                <span>12 hours</span>
              </div>
            </div>

            {/* Water */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-semibold text-slate-700">
                  Daily Water Intake
                </span>

                <span className="font-mono font-bold text-teal-600 text-xs">
                  {inputs.waterIntakeLiters} L
                </span>
              </div>

              <input
                type="range"
                min="0.5"
                max="6"
                step="0.5"
                value={inputs.waterIntakeLiters}
                onChange={(e) =>
                  updateInput(
                    'waterIntakeLiters',
                    Number(e.target.value)
                  )
                }
                className="w-full accent-teal-600 cursor-pointer"
              />

              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>0.5 L</span>
                <span>3 L</span>
                <span>6 L</span>
              </div>
            </div>

          </div>

          {/* Symptoms */}
          <div className="mt-6 pt-5 border-t border-slate-100">

            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4 text-teal-600" />

              <div>
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Reported Symptoms
                </span>

                <p className="text-[10px] text-slate-500">
                  Select symptoms reported by the worker.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">

              <label className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100">
                <input
                  type="checkbox"
                  checked={inputs.dizziness}
                  onChange={(e) =>
                    updateInput(
                      'dizziness',
                      e.target.checked
                    )
                  }
                  className="accent-teal-600"
                />

                <span className="text-xs font-medium">
                  Dizziness
                </span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100">
                <input
                  type="checkbox"
                  checked={inputs.fatigue}
                  onChange={(e) =>
                    updateInput(
                      'fatigue',
                      e.target.checked
                    )
                  }
                  className="accent-teal-600"
                />

                <span className="text-xs font-medium">
                  Fatigue
                </span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100">
                <input
                  type="checkbox"
                  checked={inputs.headache}
                  onChange={(e) =>
                    updateInput(
                      'headache',
                      e.target.checked
                    )
                  }
                  className="accent-teal-600"
                />

                <span className="text-xs font-medium">
                  Headache
                </span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100">
                <input
                  type="checkbox"
                  checked={inputs.nausea}
                  onChange={(e) =>
                    updateInput(
                      'nausea',
                      e.target.checked
                    )
                  }
                  className="accent-teal-600"
                />

                <span className="text-xs font-medium">
                  Nausea
                </span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100">
                <input
                  type="checkbox"
                  checked={inputs.muscleCramps}
                  onChange={(e) =>
                    updateInput(
                      'muscleCramps',
                      e.target.checked
                    )
                  }
                  className="accent-teal-600"
                />

                <span className="text-xs font-medium">
                  Muscle Cramps
                </span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-lg bg-amber-50 border border-amber-200 cursor-pointer hover:bg-amber-100">
                <input
                  type="checkbox"
                  checked={inputs.pesticideExposure}
                  onChange={(e) =>
                    updateInput(
                      'pesticideExposure',
                      e.target.checked
                    )
                  }
                  className="accent-amber-600"
                />

                <span className="text-xs font-bold text-amber-900">
                  Pesticide Exposure
                </span>
              </label>

            </div>
          </div>

          {/* Body Temperature */}
          <div className="mt-5 pt-5 border-t border-slate-100">

            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-semibold text-slate-700">
                Reported Body Temperature
              </span>

              <span className="font-mono font-bold text-rose-600 text-xs">
                {inputs.bodyTemperature}°C
              </span>
            </div>

            <input
              type="range"
              min="36"
              max="41"
              step="0.1"
              value={inputs.bodyTemperature}
              onChange={(e) =>
                updateInput(
                  'bodyTemperature',
                  Number(e.target.value)
                )
              }
              className="w-full accent-rose-600 cursor-pointer"
            />

            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>36°C</span>
              <span>38°C</span>
              <span>41°C</span>
            </div>
          </div>

        </div>

        {/* RESULT PANEL */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">

          {/* Result Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-teal-600" />
                Risk Assessment
              </h3>

              <p className="text-[11px] text-slate-500 mt-1">
                Updated automatically from current inputs.
              </p>
            </div>

            <RiskBadge
              level={result.riskCategory}
              score={result.overallHealthScore}
            />
          </div>

          {/* Gauge */}
          <div className="flex justify-center py-5">
            <RiskGauge
              score={result.overallHealthScore}
              label="Overall Health Risk"
              size={160}
            />
          </div>

          {/* Sub Scores */}
          <div className="grid grid-cols-2 gap-3">

            <div className="p-3 rounded-xl bg-orange-50 border border-orange-200">
              <div className="text-[10px] uppercase font-bold text-orange-800">
                Heat Stress
              </div>

              <div className="text-2xl font-extrabold font-mono text-orange-950 mt-1">
                {result.heatStressScore}
                <span className="text-xs font-semibold ml-1">
                  /100
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
              <div className="text-[10px] uppercase font-bold text-amber-800">
                Pesticide Risk
              </div>

              <div className="text-2xl font-extrabold font-mono text-amber-950 mt-1">
                {result.pesticideRiskScore}
                <span className="text-xs font-semibold ml-1">
                  /100
                </span>
              </div>
            </div>

          </div>

          {/* Factors */}
          <div className="mt-5">

            <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">
              Key Contributing Factors
            </span>

            <div className="mt-2 space-y-1.5">
              {result.topFactors.length > 0 ? (
                result.topFactors.map((factor, index) => (
                  <div
                    key={`${factor}-${index}`}
                    className="flex items-start gap-2 text-xs text-slate-600"
                  >
                    <span className="text-rose-500 font-bold mt-0.5">
                      •
                    </span>

                    <span>
                      {factor}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500">
                  No major contributing factors detected.
                </p>
              )}
            </div>

          </div>

          {/* Recommendations */}
          <div className="mt-5 pt-4 border-t border-slate-100">

            <span className="text-[10px] uppercase font-bold text-teal-800 tracking-wider">
              Recommended Actions
            </span>

            <div className="mt-2 space-y-2">

              {result.recommendations.length > 0 ? (
                result.recommendations.map(
                  (recommendation, index) => (
                    <div
                      key={`${recommendation}-${index}`}
                      className="p-2.5 rounded-lg bg-teal-50 border border-teal-200 text-xs text-teal-950 flex items-start gap-2"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-700 shrink-0 mt-0.5" />

                      <span className="leading-snug">
                        {recommendation}
                      </span>
                    </div>
                  )
                )
              ) : (
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
                  Continue routine monitoring and field follow-up.
                </div>
              )}

            </div>
          </div>

          {/* Demo Explanation */}
          <div className="mt-5 p-3 rounded-xl bg-slate-900 text-white">
            <p className="text-[10px] font-bold uppercase tracking-wider text-teal-300">
              How Gram Setu Works
            </p>

            <p className="text-[11px] text-slate-300 leading-relaxed mt-1">
              Environmental conditions, occupational exposure and
              reported symptoms are combined to produce a transparent
              risk score and actionable field recommendations.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};
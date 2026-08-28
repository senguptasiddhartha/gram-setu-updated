import React from 'react';
import { RiskLevel } from '../../types';
import { calculateRiskCategory } from '../../engines/riskEngine';

interface RiskGaugeProps {
  score: number;
  label?: string;
  size?: number;
  showCategory?: boolean;
  strokeWidth?: number;
  sublabel?: string;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({
  score,
  label,
  size = 140,
  showCategory = true,
  strokeWidth = 10,
  sublabel,
}) => {
  const category: RiskLevel = calculateRiskCategory(score);
  const normalizedScore = Math.min(100, Math.max(0, score));

  // Gauge geometry (semi-circle / 240-degree arc)
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  // Use a 240 degree sweep
  const arcLength = circumference * (240 / 360);
  const strokeDashoffset = arcLength - (arcLength * normalizedScore) / 100;

  const getColor = (cat: RiskLevel) => {
    switch (cat) {
      case 'CRITICAL':
        return '#e11d48'; // rose-600
      case 'HIGH':
        return '#ea580c'; // orange-600
      case 'MODERATE':
        return '#0284c7'; // sky-600
      case 'LOW':
      default:
        return '#059669'; // emerald-600
    }
  };

  const getBgTrack = (cat: RiskLevel) => {
    switch (cat) {
      case 'CRITICAL':
        return '#ffe4e6';
      case 'HIGH':
        return '#ffedd5';
      case 'MODERATE':
        return '#e0f2fe';
      case 'LOW':
      default:
        return '#d1fae5';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center relative">
      <svg
        width={size}
        height={size * 0.85}
        viewBox={`0 0 ${size} ${size}`}
        className="transform rotate-[150deg] overflow-visible"
      >
        {/* Background Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getBgTrack(category)}
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeLinecap="round"
        />
        {/* Value Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor(category)}
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>

      {/* Center Values */}
      <div className="absolute top-[28%] flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-extrabold tracking-tight font-mono text-slate-800">
          {score}
          <span className="text-xs text-slate-600 font-sans font-normal ml-0.5">/100</span>
        </span>
        {showCategory && (
          <span
            className="text-[11px] font-bold tracking-wider px-2 py-0.5 rounded-full mt-0.5"
            style={{
              backgroundColor: getBgTrack(category),
              color: getColor(category),
            }}
          >
            {category}
          </span>
        )}
        {label && <span className="text-xs font-semibold text-slate-600 mt-1">{label}</span>}
      </div>

      {sublabel && (
        <span className="text-[11px] text-slate-600 mt-2 text-center max-w-[150px] leading-tight">
          {sublabel}
        </span>
      )}
    </div>
  );
};

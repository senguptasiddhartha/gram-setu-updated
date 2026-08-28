import React from 'react';
import { RiskLevel } from '../../types';
import { ShieldAlert, AlertTriangle, CheckCircle, Flame } from 'lucide-react';

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  score?: number;
  className?: string;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  level,
  size = 'md',
  showIcon = true,
  score,
  className = '',
}) => {
  const getStyles = () => {
    switch (level) {
      case 'CRITICAL':
        return {
          bg: 'bg-rose-50 border-rose-200 text-rose-700',
          dot: 'bg-rose-500',
          icon: <Flame className="w-3.5 h-3.5 text-rose-600" />,
        };
      case 'HIGH':
        return {
          bg: 'bg-amber-50 border-amber-200 text-amber-800',
          dot: 'bg-amber-500',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />,
        };
      case 'MODERATE':
        return {
          bg: 'bg-blue-50 border-blue-200 text-blue-800',
          dot: 'bg-blue-500',
          icon: <ShieldAlert className="w-3.5 h-3.5 text-blue-600" />,
        };
      case 'LOW':
      default:
        return {
          bg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
          dot: 'bg-emerald-500',
          icon: <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />,
        };
    }
  };

  const style = getStyles();

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1 font-semibold rounded-md border',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-semibold rounded-lg border',
    lg: 'text-sm px-3 py-1.5 gap-2 font-bold rounded-lg border',
  };

  return (
    <span
      className={`inline-flex items-center tracking-wide whitespace-nowrap ${style.bg} ${sizeClasses[size]} ${className}`}
    >
      {showIcon && style.icon}
      <span>{level}</span>
      {score !== undefined && (
        <span className="ml-1 opacity-80 font-mono text-[11px]">({score})</span>
      )}
    </span>
  );
};

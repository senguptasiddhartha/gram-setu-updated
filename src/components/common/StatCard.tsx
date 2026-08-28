import React, { ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  trend?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
    isPositive?: boolean;
  };
  icon: ReactNode;
  iconBg?: string;
  className?: string;
  badgeText?: string;
  badgeColor?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtext,
  trend,
  icon,
  iconBg = 'bg-teal-50 text-teal-700 border-teal-100',
  className = '',
  badgeText,
  badgeColor = 'bg-slate-100 text-slate-700',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs transition-all hover:border-slate-300 ${
        onClick ? 'cursor-pointer hover:shadow-md' : ''
      } ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {title}
            </span>
            {badgeText && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeColor}`}>
                {badgeText}
              </span>
            )}
          </div>
          <div className="text-2xl font-bold tracking-tight text-slate-900 font-mono">
            {value}
          </div>
        </div>
        <div className={`p-2.5 rounded-xl border ${iconBg} shrink-0`}>
          {icon}
        </div>
      </div>

      {(subtext || trend) && (
        <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          {trend && (
            <div
              className={`flex items-center gap-1 font-medium ${
                trend.direction === 'up'
                  ? trend.isPositive
                    ? 'text-emerald-600'
                    : 'text-rose-600'
                  : trend.direction === 'down'
                  ? trend.isPositive
                    ? 'text-emerald-600'
                    : 'text-amber-600'
                  : 'text-slate-500'
              }`}
            >
              {trend.direction === 'up' && <TrendingUp className="w-3.5 h-3.5" />}
              {trend.direction === 'down' && <TrendingDown className="w-3.5 h-3.5" />}
              {trend.direction === 'neutral' && <Minus className="w-3.5 h-3.5" />}
              <span>{trend.value}</span>
            </div>
          )}
          {subtext && <span className="text-slate-500 text-[11px] truncate">{subtext}</span>}
        </div>
      )}
    </div>
  );
};

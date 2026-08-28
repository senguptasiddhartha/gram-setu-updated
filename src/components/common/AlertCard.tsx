import React from 'react';
import { Alert } from '../../types';
import { RiskBadge } from './RiskBadge';
import {
  ThermometerSun,
  HeartPulse,
  Sprout,
  FlaskConical,
  CloudRain,
  RefreshCw,
  Clock,
  MapPin,
  CheckCircle2,
  Users,
} from 'lucide-react';

interface AlertCardProps {
  alert: Alert;
  onAcknowledge?: (id: string) => void;
  onResolve?: (id: string) => void;
  compact?: boolean;
}

export const AlertCard: React.FC<AlertCardProps> = ({
  alert,
  onAcknowledge,
  onResolve,
  compact = false,
}) => {
  const getDomainIcon = () => {
    switch (alert.type) {
      case 'HEAT':
        return <ThermometerSun className="w-4 h-4 text-orange-600" />;
      case 'HEALTH':
        return <HeartPulse className="w-4 h-4 text-rose-600" />;
      case 'CROP':
        return <Sprout className="w-4 h-4 text-emerald-600" />;
      case 'PESTICIDE':
        return <FlaskConical className="w-4 h-4 text-amber-600" />;
      case 'WEATHER':
        return <CloudRain className="w-4 h-4 text-sky-600" />;
      case 'SYNC':
      default:
        return <RefreshCw className="w-4 h-4 text-indigo-600" />;
    }
  };

  const getBorderColor = () => {
    switch (alert.priority) {
      case 'CRITICAL':
        return 'border-l-rose-500';
      case 'HIGH':
        return 'border-l-amber-500';
      case 'MODERATE':
        return 'border-l-blue-500';
      case 'LOW':
      default:
        return 'border-l-emerald-500';
    }
  };

  return (
    <div
      className={`bg-white rounded-xl border border-slate-200 border-l-4 ${getBorderColor()} p-4 shadow-xs hover:border-slate-300 transition-all`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <div className="p-1.5 bg-slate-50 rounded-lg border border-slate-200 shrink-0 mt-0.5">
            {getDomainIcon()}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <RiskBadge level={alert.priority} size="sm" />
              <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider font-semibold">
                {alert.type} ALERT
              </span>
              {alert.status === 'Acknowledged' && (
                <span className="text-[10px] bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded-full border border-blue-200">
                  Acknowledged
                </span>
              )}
              {alert.status === 'Resolved' && (
                <span className="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Resolved
                </span>
              )}
            </div>
            <h4 className="text-sm font-bold text-slate-900 mt-1">{alert.title}</h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">{alert.description}</p>
          </div>
        </div>
      </div>

      {!compact && (
        <div className="mt-3 pt-2.5 border-t border-slate-100 bg-slate-50/70 -mx-4 -mb-4 p-3 rounded-b-xl">
          <div className="text-xs text-slate-700">
            <span className="font-semibold text-slate-800">Action:</span> {alert.recommendedAction}
          </div>
          <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-200/60 text-[11px] text-slate-500">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                {alert.location}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3 text-slate-400" />
                {alert.affectedCount} {alert.affectedEntityType}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                {new Date(alert.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {alert.status === 'New' && onAcknowledge && (
                <button
                  onClick={() => onAcknowledge(alert.id)}
                  className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
                >
                  Acknowledge
                </button>
              )}
              {alert.status !== 'Resolved' && onResolve && (
                <button
                  onClick={() => onResolve(alert.id)}
                  className="px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-300 rounded-lg hover:bg-emerald-100 transition-colors"
                >
                  Resolve
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

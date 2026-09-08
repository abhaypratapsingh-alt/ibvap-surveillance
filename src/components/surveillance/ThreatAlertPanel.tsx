import React from 'react';
import { ThreatAlert } from '../../types/surveillance';
import {
  AlertOctagon,
  AlertTriangle,
  Info,
  CheckCircle2,
  Route,
  Eye,
  ShieldCheck,
  Send,
  FilterX,
} from 'lucide-react';

interface ThreatAlertPanelProps {
  alerts: ThreatAlert[];
  onAcknowledge: (id: string) => void;
  onTrack: (targetId: string, cameraId: string) => void;
  onViewFeed: (cameraId: string) => void;
  onDispatch: (id: string) => void;
  onMarkFalseAlarm: (id: string) => void;
}

export const ThreatAlertPanel: React.FC<ThreatAlertPanelProps> = ({
  alerts,
  onAcknowledge,
  onTrack,
  onViewFeed,
  onDispatch,
  onMarkFalseAlarm,
}) => {
  return (
    <div className="bg-[#0b121e] rounded-lg border border-slate-800 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="bg-slate-900/90 px-3.5 py-2.5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertOctagon className="w-4 h-4 text-red-400" />
          <span className="font-bold text-xs tracking-wider text-white font-mono uppercase">
            Threat Alert Dispatcher
          </span>
        </div>
        <span className="text-[10px] font-mono bg-red-950/80 text-red-300 border border-red-800 px-2 py-0.5 rounded font-bold">
          {alerts.filter((a) => a.level === 'CRITICAL' && !a.acknowledged).length} CRITICAL
        </span>
      </div>

      {/* Alert Feed List */}
      <div className="flex-1 p-3 space-y-3 overflow-y-auto max-h-[580px]">
        {alerts.map((alert) => {
          const isCritical = alert.level === 'CRITICAL';
          const isWarning = alert.level === 'WARNING';
          const isFalseAlarm = alert.status === 'FALSE_ALARM';

          return (
            <div
              key={alert.id}
              className={`p-3 rounded-lg border transition-all ${
                isFalseAlarm
                  ? 'bg-slate-900/40 border-slate-800 opacity-75'
                  : isCritical
                  ? 'bg-red-950/30 border-red-700/60 shadow-md shadow-red-950/20'
                  : isWarning
                  ? 'bg-amber-950/20 border-amber-700/50'
                  : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              {/* Alert Meta Banner */}
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className={`font-mono text-[10px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                      isFalseAlarm
                        ? 'bg-slate-800 text-slate-400'
                        : isCritical
                        ? 'bg-red-600 text-white animate-pulse'
                        : isWarning
                        ? 'bg-amber-600 text-slate-950'
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    {isFalseAlarm ? 'FILTERED' : alert.level}
                  </span>

                  <span className="font-mono text-xs font-bold text-cyan-400">
                    {alert.cameraId}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-slate-400">
                    {alert.timestamp}
                  </span>
                  <div className="text-right font-mono">
                    <span className="text-[10px] text-slate-500">SCORE:</span>{' '}
                    <span
                      className={`text-xs font-bold ${
                        alert.threatScore >= 80
                          ? 'text-red-400'
                          : alert.threatScore >= 50
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {alert.threatScore}/100
                    </span>
                  </div>
                </div>
              </div>

              {/* Title & Description */}
              <h4 className="font-semibold text-xs text-white mb-1 leading-snug">
                {alert.title}
              </h4>
              <p className="text-slate-300 text-[11px] leading-relaxed mb-2">
                {alert.description}
              </p>

              {/* Multi-Signal Verification breakdown badge */}
              <div className="bg-slate-950/70 border border-slate-800/80 rounded p-1.5 mb-2.5 text-[10px] font-mono text-slate-400 flex flex-wrap items-center justify-between gap-1">
                <span>
                  CONF: <b className="text-white">{(alert.confidence * 100).toFixed(0)}%</b>
                </span>
                <span>
                  ZONE: <b className="text-amber-400">+{alert.verificationSignals.restrictedZoneBonus}</b>
                </span>
                <span>
                  NIGHT: <b className="text-cyan-400">+{alert.verificationSignals.nightMultiplier}</b>
                </span>
                <span>
                  RE-ID: <b className="text-purple-400">+{alert.verificationSignals.crossCameraBonus}</b>
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-800/60">
                <button
                  onClick={() => onViewFeed(alert.cameraId)}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium transition flex items-center gap-1 border border-slate-700"
                >
                  <Eye className="w-3 h-3 text-cyan-400" />
                  <span>View Feed</span>
                </button>

                {!alert.acknowledged && (
                  <button
                    onClick={() => onAcknowledge(alert.id)}
                    className="px-2 py-1 rounded bg-slate-800 hover:bg-emerald-950 text-slate-200 hover:text-emerald-300 text-[11px] font-medium transition flex items-center gap-1 border border-slate-700 hover:border-emerald-700"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Acknowledge</span>
                  </button>
                )}

                {alert.targetId && (
                  <button
                    onClick={() => onTrack(alert.targetId!, alert.cameraId)}
                    className="px-2 py-1 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-300 text-[11px] font-medium transition flex items-center gap-1 border border-cyan-800"
                  >
                    <Route className="w-3 h-3 text-cyan-400" />
                    <span>Track</span>
                  </button>
                )}

                {isCritical && alert.status !== 'DISPATCHED' && (
                  <button
                    onClick={() => onDispatch(alert.id)}
                    className="px-2 py-1 rounded bg-red-950 hover:bg-red-900 text-red-200 text-[11px] font-medium transition flex items-center gap-1 border border-red-700"
                  >
                    <Send className="w-3 h-3 text-red-400" />
                    <span>Dispatch QRT</span>
                  </button>
                )}

                {!isFalseAlarm && (
                  <button
                    onClick={() => onMarkFalseAlarm(alert.id)}
                    className="px-1.5 py-1 rounded hover:bg-slate-800 text-slate-400 hover:text-amber-300 text-[10px] font-mono transition ml-auto"
                    title="Mark as False Alarm (tests filter suppression)"
                  >
                    <FilterX className="w-3 h-3 inline mr-0.5" />
                    False Alarm
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

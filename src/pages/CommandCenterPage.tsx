import React from 'react';
import { useSurveillance } from '../context/SurveillanceContext';
import { CameraCard } from '../components/surveillance/CameraCard';
import { ThreatAlertPanel } from '../components/surveillance/ThreatAlertPanel';
import {
  Cctv,
  AlertTriangle,
  UserCheck,
  Car,
  Fence,
  Zap,
  ShieldCheck,
  Eye,
  Plus,
  Play,
} from 'lucide-react';

interface CommandCenterPageProps {
  onNavigate: (page: string) => void;
}

export const CommandCenterPage: React.FC<CommandCenterPageProps> = ({ onNavigate }) => {
  const {
    cameras,
    alerts,
    kpis,
    setSelectedCameraId,
    toggleNightVision,
    triggerSimulatedBreach,
    acknowledgeAlert,
    dispatchResponse,
    markFalseAlarm,
    trackTargetFromAlert,
  } = useSurveillance();

  // Show top 6 cameras for the primary command grid
  const commandGridCameras = cameras.slice(0, 6);

  const KPI_CARDS = [
    {
      title: 'CAMERAS ONLINE',
      value: `${kpis.camerasOnline} / ${kpis.totalCameras}`,
      sub: '4 Edge Nodes Standby',
      color: 'text-emerald-400',
      border: 'border-emerald-500/30',
      icon: Cctv,
    },
    {
      title: 'ACTIVE THREATS',
      value: kpis.activeThreats.toString().padStart(2, '0'),
      sub: '01 Critical Breach Active',
      color: 'text-red-400',
      border: 'border-red-500/40',
      icon: AlertTriangle,
      badge: 'DEFCON 2',
    },
    {
      title: 'PERSONS DETECTED',
      value: kpis.personsDetected.toString(),
      sub: '24h Total Count',
      color: 'text-cyan-400',
      border: 'border-cyan-500/30',
      icon: UserCheck,
    },
    {
      title: 'VEHICLES DETECTED',
      value: kpis.vehiclesDetected.toString(),
      sub: 'ANPR Matched: 31',
      color: 'text-blue-400',
      border: 'border-blue-500/30',
      icon: Car,
    },
    {
      title: 'VIRTUAL FENCE BREACHES',
      value: kpis.virtualFenceBreaches.toString().padStart(2, '0'),
      sub: 'Restricted Buffer Zone',
      color: 'text-amber-400',
      border: 'border-amber-500/30',
      icon: Fence,
    },
    {
      title: 'AI CONFIDENCE',
      value: `${kpis.aiConfidenceAvg}%`,
      sub: 'YOLOv8 + DeepSORT',
      color: 'text-purple-400',
      border: 'border-purple-500/30',
      icon: Zap,
    },
  ];

  return (
    <div className="p-4 space-y-4 max-w-[1920px] mx-auto">
      {/* 1. Top KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {KPI_CARDS.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className={`bg-[#0b121e] rounded-lg border ${kpi.border} p-3 flex flex-col justify-between shadow-lg shadow-black/40`}
            >
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">
                  {kpi.title}
                </span>
                <Icon className={`w-4 h-4 ${kpi.color}`} />
              </div>

              <div className="flex items-baseline justify-between mt-1">
                <div className={`text-2xl font-extrabold font-mono ${kpi.color}`}>
                  {kpi.value}
                </div>
                {kpi.badge && (
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-red-950 text-red-400 border border-red-800 animate-pulse font-bold">
                    {kpi.badge}
                  </span>
                )}
              </div>

              <div className="text-[10px] text-slate-500 font-mono mt-1">
                {kpi.sub}
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. Main Command Layout: 6 Camera Grid (Left) + Threat Alert Panel (Right) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
        {/* Left: 6 Live Camera Feeds (8 Columns on XL) */}
        <div className="xl:col-span-8 space-y-3">
          <div className="flex items-center justify-between bg-slate-900/80 px-3 py-2 rounded-lg border border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                PRIMARY BORDER PERIMETER MATRIX (CAM-01 TO CAM-06)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => triggerSimulatedBreach('CAM-04')}
                className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-red-950 hover:bg-red-900 text-red-300 border border-red-700/80 transition flex items-center gap-1 shadow-md shadow-red-950/40"
              >
                <Zap className="w-3.5 h-3.5 text-red-400" />
                <span>Simulate CAM-04 Breach</span>
              </button>

              <button
                onClick={() => onNavigate('surveillance')}
                className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 transition flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>All 12 Cameras</span>
              </button>
            </div>
          </div>

          {/* 6-Camera Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {commandGridCameras.map((cam) => (
              <CameraCard
                key={cam.id}
                camera={cam}
                onSelect={() => {
                  setSelectedCameraId(cam.id);
                  onNavigate('surveillance');
                }}
                onToggleNight={() => toggleNightVision(cam.id)}
                onSimulateBreach={() => triggerSimulatedBreach(cam.id)}
                onConfigureFence={() => {
                  setSelectedCameraId(cam.id);
                  onNavigate('fence');
                }}
              />
            ))}
          </div>

          {/* Quick Cross-Camera Re-ID Teaser Bar */}
          <div className="bg-[#0b121e] rounded-lg border border-cyan-900/40 p-3 flex flex-wrap items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-cyan-950 border border-cyan-700 flex items-center justify-center text-cyan-400 font-mono font-bold text-xs">
                Re-ID
              </div>
              <div>
                <div className="text-xs font-bold text-white font-mono flex items-center gap-2">
                  <span>ACTIVE RE-ID TRACK: TARGET P-1042</span>
                  <span className="text-[10px] text-red-400 px-1.5 py-0.5 rounded bg-red-950 border border-red-800">
                    RESTRICTED ZONE INTRUDER
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  Path: CAM-02 (22:41) → CAM-03 (22:44) → CAM-05 (22:49) → CAM-04 (23:08 Breach)
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('tracking')}
              className="px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold tracking-wide transition shadow-md shadow-cyan-900/30"
            >
              Open Spatial Tracking Map →
            </button>
          </div>
        </div>

        {/* Right: Threat Alert Dispatch Panel (4 Columns on XL) */}
        <div className="xl:col-span-4 h-full">
          <ThreatAlertPanel
            alerts={alerts}
            onAcknowledge={acknowledgeAlert}
            onTrack={(targetId, camId) => {
              trackTargetFromAlert(targetId, camId);
              onNavigate('tracking');
            }}
            onViewFeed={(camId) => {
              setSelectedCameraId(camId);
              onNavigate('surveillance');
            }}
            onDispatch={dispatchResponse}
            onMarkFalseAlarm={markFalseAlarm}
          />
        </div>
      </div>
    </div>
  );
};

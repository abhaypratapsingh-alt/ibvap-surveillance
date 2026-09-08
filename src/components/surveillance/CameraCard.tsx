import React from 'react';
import { Camera } from '../../types/surveillance';
import { CameraFeedCanvas } from './CameraFeedCanvas';
import {
  Maximize2,
  Moon,
  Sun,
  ShieldAlert,
  Flame,
  Activity,
  AlertTriangle,
  Fence,
} from 'lucide-react';

interface CameraCardProps {
  camera: Camera;
  isNightMode?: boolean;
  onSelect?: () => void;
  onToggleNight?: () => void;
  onSimulateBreach?: () => void;
  onConfigureFence?: () => void;
  isSelected?: boolean;
}

export const CameraCard: React.FC<CameraCardProps> = ({
  camera,
  isNightMode = false,
  onSelect,
  onToggleNight,
  onSimulateBreach,
  onConfigureFence,
  isSelected = false,
}) => {
  const hasCriticalDetection = camera.activeDetections.some(
    (d) => d.threatLevel === 'CRITICAL' || d.type === 'FENCE_BREACH'
  );

  return (
    <div
      className={`flex flex-col bg-[#0b121e] rounded-lg border transition-all overflow-hidden ${
        hasCriticalDetection
          ? 'border-red-500/80 shadow-lg shadow-red-950/40 ring-1 ring-red-500/50'
          : isSelected
          ? 'border-cyan-500 shadow-md shadow-cyan-950/40'
          : 'border-slate-800 hover:border-slate-700'
      }`}
    >
      {/* Top Telemetry Header */}
      <div className="bg-slate-900/95 px-3 py-1.5 border-b border-slate-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 overflow-hidden">
          <span
            className={`w-2 h-2 rounded-full ${
              camera.status === 'ONLINE'
                ? 'bg-emerald-400 animate-pulse'
                : camera.status === 'DEGRADED'
                ? 'bg-amber-400'
                : 'bg-red-500'
            }`}
          />
          <span className="font-bold text-white font-mono">{camera.id}</span>
          <span className="text-slate-400 text-[11px] truncate hidden sm:inline">
            {camera.name}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-800/50 px-1.5 py-0.5 rounded">
            {camera.fps} FPS
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onToggleNight) onToggleNight();
            }}
            className={`p-1 rounded transition ${
              camera.nightVisionActive
                ? 'bg-cyan-950 text-cyan-400 border border-cyan-700'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Toggle Night Vision Mode"
          >
            {camera.nightVisionActive ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
          </button>

          {onSelect && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect();
              }}
              className="p-1 rounded text-slate-400 hover:text-white transition"
              title="Expand Camera Focus"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Canvas Simulated Feed */}
      <div className="relative aspect-video w-full cursor-pointer" onClick={onSelect}>
        <CameraFeedCanvas
          camera={camera}
          isNightMode={isNightMode}
          className="w-full h-full"
        />

        {/* Breach Alert Ribbon */}
        {hasCriticalDetection && (
          <div className="absolute top-2 left-2 right-2 bg-red-600/90 text-white font-mono text-[10px] font-bold px-2 py-1 rounded flex items-center justify-between animate-pulse">
            <span className="flex items-center gap-1">
              <Flame className="w-3.5 h-3.5" />
              RESTRICTED ZONE BREACH ACTIVE
            </span>
            <span>97% CONF</span>
          </div>
        )}
      </div>

      {/* Bottom Info & Quick Action Bar */}
      <div className="p-2 bg-slate-950/80 border-t border-slate-800 flex flex-wrap items-center justify-between gap-1.5 text-xs">
        <div className="flex items-center gap-1 overflow-hidden">
          {camera.activeDetections.length > 0 ? (
            camera.activeDetections.slice(0, 2).map((det) => (
              <span
                key={det.id}
                className={`text-[9px] font-mono px-1.5 py-0.5 rounded border truncate ${
                  det.threatLevel === 'CRITICAL'
                    ? 'bg-red-950 text-red-300 border-red-800'
                    : det.threatLevel === 'HIGH'
                    ? 'bg-amber-950 text-amber-300 border-amber-800'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                {det.label.split('//')[0]} {(det.confidence * 100).toFixed(0)}%
              </span>
            ))
          ) : (
            <span className="text-[10px] text-slate-500 font-mono">NO ACTIVE TARGETS</span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {onSimulateBreach && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSimulateBreach();
              }}
              className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800 transition"
              title="Simulate Virtual Fence Breach on this camera"
            >
              Breach Test
            </button>
          )}

          {onConfigureFence && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onConfigureFence();
              }}
              className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition flex items-center gap-1"
              title="Configure Virtual Fence"
            >
              <Fence className="w-3 h-3 text-cyan-400" />
              <span>Fence</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

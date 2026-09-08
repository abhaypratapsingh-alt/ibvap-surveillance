import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSurveillance } from '../context/SurveillanceContext';
import { soundManager } from '../utils/soundEffects';
import { UserRole } from '../types/surveillance';
import {
  Settings as SettingsIcon,
  Sliders,
  Shield,
  Volume2,
  VolumeX,
  RotateCcw,
  CheckCircle2,
  Cpu,
  Save,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, switchRole } = useAuth();
  const { resetDemo } = useSurveillance();

  const [personThresh, setPersonThresh] = useState<number>(85);
  const [vehicleThresh, setVehicleThresh] = useState<number>(80);
  const [faceThresh, setFaceThresh] = useState<number>(75);
  const [bufferSize, setBufferSize] = useState<number>(1000);
  const [saved, setSaved] = useState<boolean>(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-4 space-y-4 max-w-[1920px] mx-auto font-mono">
      {/* Top Banner */}
      <div className="bg-[#0b121e] rounded-lg border border-slate-800 p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-cyan-400">
            <SettingsIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold text-white uppercase tracking-wider">
                System Operational Configuration & Edge Parameters
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-700">
                ADMIN ACCESS ONLY
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans">
              Tune AI confidence thresholds, RTSP demuxing buffers, and tactical operator profiles.
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-cyan-950/40"
        >
          <Save className="w-4 h-4" />
          <span>APPLY CONFIGURATION</span>
        </button>
      </div>

      {saved && (
        <div className="p-3 rounded bg-emerald-950/80 border border-emerald-600 text-emerald-300 text-xs flex items-center gap-2 shadow-lg">
          <CheckCircle2 className="w-4 h-4" />
          <span>Tactical thresholds updated across all 12 Jetson edge nodes!</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: AI Inference Thresholds */}
        <div className="lg:col-span-6 bg-[#0b121e] rounded-lg border border-slate-800 p-4 space-y-4">
          <div className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>AI Model Detection Thresholds</span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Person Detection Min Confidence:</span>
                <span className="text-cyan-400 font-bold">{personThresh}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="95"
                value={personThresh}
                onChange={(e) => setPersonThresh(parseInt(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-900"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Vehicle Detection Min Confidence:</span>
                <span className="text-blue-400 font-bold">{vehicleThresh}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="95"
                value={vehicleThresh}
                onChange={(e) => setVehicleThresh(parseInt(e.target.value))}
                className="w-full accent-blue-400 bg-slate-900"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Face Match Verification Threshold:</span>
                <span className="text-purple-400 font-bold">{faceThresh}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="95"
                value={faceThresh}
                onChange={(e) => setFaceThresh(parseInt(e.target.value))}
                className="w-full accent-purple-400 bg-slate-900"
              />
            </div>

            <div className="pt-2 border-t border-slate-800">
              <div className="flex justify-between text-slate-300 mb-1">
                <span>RTSP Stream Buffer Depth:</span>
                <span className="text-amber-400 font-bold">{bufferSize} ms</span>
              </div>
              <input
                type="range"
                min="200"
                max="3000"
                step="100"
                value={bufferSize}
                onChange={(e) => setBufferSize(parseInt(e.target.value))}
                className="w-full accent-amber-400 bg-slate-900"
              />
              <span className="text-[10px] text-slate-500">
                Low latency mode (&lt;1000ms recommended for border control)
              </span>
            </div>
          </div>
        </div>

        {/* Right: Role & System Maintenance */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-[#0b121e] rounded-lg border border-slate-800 p-4 space-y-3">
            <div className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>Tactical Role Clearance Switcher</span>
            </div>

            <div className="space-y-2">
              {(['GUARD', 'ADMIN', 'RESPONSE_TEAM'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => switchRole(r)}
                  className={`w-full p-3 rounded-lg border text-left transition flex items-center justify-between ${
                    user?.role === r
                      ? 'bg-cyan-950 border-cyan-500 text-white font-bold shadow-md shadow-cyan-950'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold">
                      {r === 'GUARD'
                        ? 'GUARD / OPERATOR'
                        : r === 'ADMIN'
                        ? 'COMMAND ADMIN'
                        : 'RESPONSE TEAM (QRT)'}
                    </div>
                    <div className="text-[10px] text-slate-500 font-sans mt-0.5">
                      {r === 'GUARD'
                        ? 'Permitted: Live monitoring, alert acknowledgment, camera PTZ.'
                        : r === 'ADMIN'
                        ? 'Permitted: Complete system configuration, geofences, audit reports.'
                        : 'Permitted: Target vector interception, tactical dispatch status.'}
                    </div>
                  </div>
                  {user?.role === r && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-900 text-cyan-300 font-bold">
                      ACTIVE
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#0b121e] rounded-lg border border-slate-800 p-4 space-y-3">
            <div className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
              Maintenance & Presentation Reset
            </div>
            <p className="text-xs text-slate-400 font-sans">
              Reset all simulated alarms, demo breadcrumbs, and return the dashboard to initial standby state for a fresh demonstration.
            </p>
            <button
              onClick={resetDemo}
              className="px-4 py-2 rounded bg-slate-800 hover:bg-red-950/60 text-slate-300 hover:text-red-300 border border-slate-700 hover:border-red-700 text-xs font-bold transition flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>RESET DEMO BENCHMARK DATA</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

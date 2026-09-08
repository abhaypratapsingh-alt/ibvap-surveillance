import React, { useState } from 'react';
import { useSurveillance } from '../context/SurveillanceContext';
import {
  ShieldAlert,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Send,
  Route,
  FilterX,
  Sparkles,
  Activity,
  Clock,
  MapPin,
  Moon,
  Info,
} from 'lucide-react';

export const ThreatAssessmentPage: React.FC = () => {
  const {
    alerts,
    acknowledgeAlert,
    dispatchResponse,
    markFalseAlarm,
    trackTargetFromAlert,
  } = useSurveillance();

  // Interactive Threat Score Simulator parameters
  const [baseConfidence, setBaseConfidence] = useState<number>(96);
  const [restrictedZone, setRestrictedZone] = useState<boolean>(true);
  const [nightActivity, setNightActivity] = useState<boolean>(true);
  const [crossCamMovement, setCrossCamMovement] = useState<boolean>(true);
  const [behaviorType, setBehaviorType] = useState<'CLIMBING' | 'LOITERING' | 'NORMAL' | 'ANIMAL'>('CLIMBING');

  // Calculate dynamic threat score
  let calculatedScore = baseConfidence;
  if (behaviorType === 'ANIMAL') {
    calculatedScore = Math.max(10, Math.round(baseConfidence * 0.15));
  } else {
    if (restrictedZone) calculatedScore += 20;
    if (nightActivity) calculatedScore += 10;
    if (crossCamMovement) calculatedScore += 15;
    if (behaviorType === 'LOITERING') calculatedScore += 8;
    if (behaviorType === 'CLIMBING') calculatedScore += 14;
    calculatedScore = Math.min(100, Math.round(calculatedScore * 0.65));
  }

  const isFiltered = behaviorType === 'ANIMAL' || calculatedScore < 40;
  const classification =
    calculatedScore >= 80 ? 'CRITICAL' : calculatedScore >= 60 ? 'HIGH' : calculatedScore >= 40 ? 'MEDIUM' : 'LOW';

  const selectedAlert = alerts[0]; // Top critical alert

  return (
    <div className="p-4 space-y-4 max-w-[1920px] mx-auto">
      {/* Top Header */}
      <div className="bg-[#0b121e] rounded-lg border border-slate-800 p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-950/80 border border-red-500/50 flex items-center justify-center text-red-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold text-white font-mono uppercase tracking-wider">
                Multi-Signal Threat Verification & Behavioral Engine
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-700">
                DEFENSE-GRADE AI VERIFICATION
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Corroborates camera feeds, zone sensitivity, curfew hours, and historical Re-ID to suppress false alarms.
            </p>
          </div>
        </div>

        <div className="text-right font-mono text-xs">
          <span className="text-slate-400">Threat Calculation Engine:</span>
          <span className="text-emerald-400 font-bold ml-1.5">v2.4 ACTIVE</span>
        </div>
      </div>

      {/* Main Grid: Active Incursion Verification (Left) + Interactive Multi-Signal Calculator (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Active Threat Dossier & Signals Breakdown (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#0b121e] rounded-lg border border-red-500/40 p-4 space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                <span className="font-mono text-xs font-bold text-white uppercase">
                  ACTIVE CRITICAL THREAT: {selectedAlert.id} // {selectedAlert.cameraId}
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-red-400 bg-red-950/80 px-2 py-0.5 rounded border border-red-800">
                THREAT SCORE: {selectedAlert.threatScore} / 100
              </span>
            </div>

            <h3 className="text-sm font-bold text-white">{selectedAlert.title}</h3>
            <p className="text-xs text-slate-300">{selectedAlert.description}</p>

            {/* Signal Verification Matrix */}
            <div className="bg-slate-950/80 rounded border border-slate-800 p-3 space-y-2 text-xs font-mono">
              <div className="text-slate-400 text-[10px] uppercase font-bold border-b border-slate-800 pb-1 flex justify-between">
                <span>Multi-Signal Corroboration Breakdown</span>
                <span className="text-cyan-400">All 4 Signals Verified</span>
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">1. Raw YOLOv8 Detection Confidence:</span>
                  <span className="text-white font-bold">{selectedAlert.verificationSignals.baseConfidence}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">2. Restricted Buffer Zone Incursion:</span>
                  <span className="text-amber-400 font-bold">+{selectedAlert.verificationSignals.restrictedZoneBonus} pts</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">3. Night Curfew Multiplier (20:00 - 06:00):</span>
                  <span className="text-cyan-400 font-bold">+{selectedAlert.verificationSignals.nightMultiplier} pts</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">4. Cross-Camera Re-ID Continuity (CAM-02 → 03 → 05):</span>
                  <span className="text-purple-400 font-bold">+{selectedAlert.verificationSignals.crossCameraBonus} pts</span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-800 pt-1.5">
                  <span className="text-white font-bold">AGGREGATED THREAT SCORE:</span>
                  <span className="text-red-400 font-extrabold text-sm">{selectedAlert.threatScore} / 100 [CRITICAL]</span>
                </div>
              </div>
            </div>

            {/* AI Recommendation Banner */}
            <div className="p-3 rounded bg-red-950/40 border border-red-700/60 text-xs font-mono space-y-1">
              <div className="flex items-center gap-1.5 text-red-300 font-bold">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span>AI Recommendation: IMMEDIATE INTERCEPTION REQUIRED</span>
              </div>
              <p className="text-[11px] text-slate-300">
                High probability physical breach with continuous cross-camera trajectory towards Sector B-04 outpost.
              </p>
            </div>

            {/* Tactical Actions */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800">
              {!selectedAlert.acknowledged && (
                <button
                  onClick={() => acknowledgeAlert(selectedAlert.id)}
                  className="px-3 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold transition flex items-center gap-1.5 border border-slate-700"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>ACKNOWLEDGE</span>
                </button>
              )}

              {selectedAlert.targetId && (
                <button
                  onClick={() => trackTargetFromAlert(selectedAlert.targetId!, selectedAlert.cameraId)}
                  className="px-3 py-2 rounded bg-cyan-950 hover:bg-cyan-900 border border-cyan-700 text-cyan-300 text-xs font-mono font-bold transition flex items-center gap-1.5"
                >
                  <Route className="w-3.5 h-3.5 text-cyan-400" />
                  <span>TRACK TARGET</span>
                </button>
              )}

              <button
                onClick={() => dispatchResponse(selectedAlert.id)}
                className="px-3 py-2 rounded bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold transition flex items-center gap-1.5 shadow-lg shadow-red-950/50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>DISPATCH QRT ALPHA</span>
              </button>

              <button
                onClick={() => markFalseAlarm(selectedAlert.id)}
                className="px-2.5 py-2 rounded hover:bg-slate-800 text-slate-400 hover:text-amber-300 text-xs font-mono transition ml-auto flex items-center gap-1"
              >
                <FilterX className="w-3.5 h-3.5" />
                <span>Mark False Alarm</span>
              </button>
            </div>
          </div>

          {/* Behavioral Anomaly Showcase (Section 11) */}
          <div className="bg-[#0b121e] rounded-lg border border-slate-800 p-4 space-y-3">
            <div className="text-xs font-mono font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center justify-between">
              <span>Behavioral AI Classifiers</span>
              <span className="text-cyan-400">Trained on Defense Scenarios</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                { title: 'Prolonged Loitering', status: 'DETECTED (CAM-06)', conf: '92%', threat: 'HIGH', dur: '04:32 dwell time' },
                { title: 'Fence Barrier Scaling', status: 'ACTIVE (CAM-04)', conf: '97%', threat: 'CRITICAL', dur: 'Physical climb' },
                { title: 'Sudden Direction Pivot', status: 'NOMINAL', conf: '88%', threat: 'MEDIUM', dur: 'Zigzag evasion' },
                { title: 'Night Curfew Incursion', status: 'ACTIVE (23:08)', conf: '99%', threat: 'CRITICAL', dur: 'Zero light mask' },
              ].map((b, i) => (
                <div key={i} className="p-2.5 rounded bg-slate-950 border border-slate-800/80 text-xs font-mono space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">{b.title}</span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                        b.threat === 'CRITICAL' ? 'bg-red-950 text-red-300' : 'bg-amber-950 text-amber-300'
                      }`}
                    >
                      {b.threat}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">{b.dur}</div>
                  <div className="flex justify-between text-[10px] text-slate-500 pt-0.5">
                    <span>{b.status}</span>
                    <span className="text-cyan-400">Conf: {b.conf}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: False Alarm Reduction Engine & Interactive Calculator (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* False Alarm Comparison Matrix (Section 15) */}
          <div className="bg-[#0b121e] rounded-lg border border-slate-800 p-4 space-y-3">
            <div className="text-xs font-mono font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
              False Alarm Reduction Engine (Multi-Signal Comparison)
            </div>

            {/* Scenario A: Filtered Wildlife */}
            <div className="p-3 rounded bg-slate-950 border border-slate-800 space-y-1.5 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-300">SCENARIO A: ENVIRONMENTAL NOISE</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  FILTERED OUT
                </span>
              </div>
              <div className="text-slate-400 text-[11px] space-y-0.5">
                <div>• Quadruped animal detected (Nilgai / Camel)</div>
                <div>• No virtual fence crossing triggered</div>
                <div>• Normal randomized grazing trajectory</div>
              </div>
              <div className="text-emerald-400 text-[11px] font-bold pt-1 border-t border-slate-800">
                RESULT: Automatic alarm suppression (0 false dispatches)
              </div>
            </div>

            {/* Scenario B: Confirmed Threat */}
            <div className="p-3 rounded bg-red-950/30 border border-red-700/50 space-y-1.5 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">SCENARIO B: INTRUDER INGRESS</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-600 text-white animate-pulse">
                  CONFIRMED THREAT
                </span>
              </div>
              <div className="text-slate-300 text-[11px] space-y-0.5">
                <div>• Human gait + concealed tactical apparel</div>
                <div>• Polygon virtual fence boundary breached</div>
                <div>• Night curfew active (23:08 IST)</div>
                <div>• DeepSORT cross-camera sequence verified</div>
              </div>
              <div className="text-red-400 text-[11px] font-bold pt-1 border-t border-red-800/60">
                RESULT: Score 94/100 $\rightarrow$ QRT alarm broadcast
              </div>
            </div>
          </div>

          {/* Interactive Threat Score Simulator */}
          <div className="bg-[#0b121e] rounded-lg border border-cyan-900/40 p-4 space-y-3">
            <div className="text-xs font-mono font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center justify-between">
              <span>Interactive Threat Formula Simulator</span>
              <span className="text-[10px] text-cyan-400">SIH Test Console</span>
            </div>

            {/* Base Confidence Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Base AI Confidence:</span>
                <span className="text-white font-bold">{baseConfidence}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="99"
                value={baseConfidence}
                onChange={(e) => setBaseConfidence(parseInt(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-900"
              />
            </div>

            {/* Behavior Type */}
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                Target Classification:
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'CLIMBING', label: 'Climbing Fence' },
                  { id: 'LOITERING', label: 'Loitering' },
                  { id: 'NORMAL', label: 'Normal Walk' },
                  { id: 'ANIMAL', label: 'Animal / Grazing' },
                ].map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setBehaviorType(b.id as any)}
                    className={`py-1.5 px-2 rounded text-[11px] font-mono transition border ${
                      behaviorType === b.id
                        ? 'bg-cyan-950 border-cyan-500 text-cyan-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Multi-Signal Toggles */}
            <div className="space-y-1.5 pt-1">
              <label className="flex items-center justify-between text-xs font-mono p-2 rounded bg-slate-950 border border-slate-800 cursor-pointer">
                <span className="text-slate-300">Restricted Buffer Zone (+20)</span>
                <input
                  type="checkbox"
                  checked={restrictedZone}
                  onChange={(e) => setRestrictedZone(e.target.checked)}
                  className="accent-cyan-400"
                />
              </label>

              <label className="flex items-center justify-between text-xs font-mono p-2 rounded bg-slate-950 border border-slate-800 cursor-pointer">
                <span className="text-slate-300">Night Curfew Active (+10)</span>
                <input
                  type="checkbox"
                  checked={nightActivity}
                  onChange={(e) => setNightActivity(e.target.checked)}
                  className="accent-cyan-400"
                />
              </label>

              <label className="flex items-center justify-between text-xs font-mono p-2 rounded bg-slate-950 border border-slate-800 cursor-pointer">
                <span className="text-slate-300">Cross-Camera Re-ID Match (+15)</span>
                <input
                  type="checkbox"
                  checked={crossCamMovement}
                  onChange={(e) => setCrossCamMovement(e.target.checked)}
                  className="accent-cyan-400"
                />
              </label>
            </div>

            {/* Computed Output Gauge */}
            <div className="p-3 rounded bg-slate-950 border border-slate-800 text-center space-y-1">
              <div className="text-[10px] font-mono text-slate-400 uppercase">
                Simulated Dynamic Threat Score
              </div>
              <div
                className={`text-3xl font-extrabold font-mono ${
                  isFiltered
                    ? 'text-emerald-400'
                    : calculatedScore >= 80
                    ? 'text-red-400 animate-pulse'
                    : 'text-amber-400'
                }`}
              >
                {calculatedScore} / 100
              </div>
              <div className="text-xs font-mono font-bold text-slate-300">
                STATUS:{' '}
                <span
                  className={
                    isFiltered
                      ? 'text-emerald-400'
                      : calculatedScore >= 80
                      ? 'text-red-400'
                      : 'text-amber-400'
                  }
                >
                  {isFiltered ? 'FALSE ALARM SUPPRESSED' : `${classification} THREAT`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

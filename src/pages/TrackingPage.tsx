import React, { useState } from 'react';
import { useSurveillance } from '../context/SurveillanceContext';
import { TrackingTarget } from '../types/surveillance';
import {
  Route,
  User,
  Car,
  MapPin,
  Clock,
  Compass,
  FileText,
  Radio,
  Send,
  CheckCircle2,
  AlertOctagon,
  ArrowRight,
  Shield,
  Layers,
} from 'lucide-react';

export const TrackingPage: React.FC = () => {
  const { targets, selectedTargetId, setSelectedTargetId, triggerSimulatedBreach } = useSurveillance();

  const [activeTab, setActiveTab] = useState<'FLOW' | 'SPATIAL_MAP'>('FLOW');
  const [reportGenerated, setReportGenerated] = useState<boolean>(false);

  const selectedTarget: TrackingTarget =
    targets.find((t) => t.id === selectedTargetId) || targets[0];

  return (
    <div className="p-4 space-y-4 max-w-[1920px] mx-auto">
      {/* Key Innovation Banner */}
      <div className="bg-gradient-to-r from-cyan-950/60 via-slate-900 to-blue-950/60 rounded-lg border border-cyan-500/40 p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-900/60 border border-cyan-400 flex items-center justify-center text-cyan-300">
            <Route className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold text-white font-mono uppercase tracking-wider">
                Multi-Camera Re-ID & Trajectory Tracking Engine
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-700 font-bold">
                SIH CORE INNOVATION
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Persistent cross-camera identity tracking via DeepSORT embeddings across disparate CCTV angles.
            </p>
          </div>
        </div>

        {/* Target Switcher Pills */}
        <div className="flex items-center gap-2">
          {targets.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTargetId(t.id)}
              className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition flex items-center gap-1.5 ${
                selectedTarget.id === t.id
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/40 border border-cyan-400'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
              }`}
            >
              {t.type === 'PERSON' ? <User className="w-3.5 h-3.5" /> : <Car className="w-3.5 h-3.5" />}
              <span>{t.id}</span>
              <span
                className={`text-[9px] px-1 py-0.2 rounded ${
                  t.status === 'ACTIVE'
                    ? 'bg-red-950 text-red-400'
                    : 'bg-emerald-950 text-emerald-400'
                }`}
              >
                {t.status}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Layout: Left Target Dossier & Timeline + Right Map / Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Target Dossier & Camera Flow Step List */}
        <div className="lg:col-span-4 space-y-4">
          {/* Target Profile Card */}
          <div className="bg-[#0b121e] rounded-lg border border-slate-800 p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-extrabold text-white font-mono">
                    TARGET: {selectedTarget.id}
                  </span>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      selectedTarget.id === 'P-1042'
                        ? 'bg-red-950 text-red-400 border border-red-800 animate-pulse'
                        : 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                    }`}
                  >
                    {selectedTarget.id === 'P-1042' ? 'HIGH THREAT INTRUDER' : 'MONITORED'}
                  </span>
                </div>
                <div className="text-xs text-slate-400 font-mono mt-0.5">
                  {selectedTarget.label}
                </div>
              </div>
              <div className="text-right font-mono text-xs">
                <span className="text-slate-500">First Seen:</span>
                <div className="text-cyan-400 font-bold">{selectedTarget.firstSeenTime}</div>
              </div>
            </div>

            {/* Feature Extraction Table */}
            <div className="bg-slate-950/80 rounded border border-slate-800/90 p-3 space-y-1.5 text-xs font-mono">
              <div className="text-slate-400 text-[10px] uppercase font-bold border-b border-slate-800 pb-1">
                Deep Appearance Embeddings (Feature Extraction)
              </div>
              {selectedTarget.features.upperClothing && (
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-500">Upper Wear:</span>
                  <span>{selectedTarget.features.upperClothing}</span>
                </div>
              )}
              {selectedTarget.features.lowerClothing && (
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-500">Lower Wear:</span>
                  <span>{selectedTarget.features.lowerClothing}</span>
                </div>
              )}
              {selectedTarget.features.headwear && (
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-500">Headwear:</span>
                  <span>{selectedTarget.features.headwear}</span>
                </div>
              )}
              {selectedTarget.features.vehicleMake && (
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-500">Vehicle:</span>
                  <span>{selectedTarget.features.vehicleMake}</span>
                </div>
              )}
              {selectedTarget.features.licensePlate && (
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-500">Plate (ANPR):</span>
                  <span className="text-yellow-400 font-bold">{selectedTarget.features.licensePlate}</span>
                </div>
              )}
              {selectedTarget.features.speedEstimated && (
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-500">Est. Velocity:</span>
                  <span className="text-cyan-400 font-bold">{selectedTarget.features.speedEstimated}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => setActiveTab('SPATIAL_MAP')}
                className="py-2 px-3 rounded bg-cyan-950 hover:bg-cyan-900 border border-cyan-700 text-cyan-300 text-xs font-mono font-bold transition flex items-center justify-center gap-1.5"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>VIEW PATH MAP</span>
              </button>

              <button
                onClick={() => setReportGenerated(true)}
                className="py-2 px-3 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-mono font-bold transition flex items-center justify-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                <span>GENERATE REPORT</span>
              </button>
            </div>

            {reportGenerated && (
              <div className="p-2.5 rounded bg-emerald-950/50 border border-emerald-700/60 text-emerald-300 text-xs font-mono flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Cross-Camera dossier compiled.</span>
                </div>
                <button
                  onClick={() => setReportGenerated(false)}
                  className="text-[10px] text-slate-400 hover:text-white"
                >
                  Dismiss
                </button>
              </div>
            )}
          </div>

          {/* Sequential Movement Node Flow */}
          <div className="bg-[#0b121e] rounded-lg border border-slate-800 p-4 space-y-3">
            <div className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center justify-between border-b border-slate-800 pb-2">
              <span>Cross-Camera Transit Sequence</span>
              <span className="text-cyan-400">{selectedTarget.breadcrumbs.length} Handoffs</span>
            </div>

            {/* Visual Vector Chain Header */}
            <div className="bg-slate-950 p-2 rounded border border-slate-800 text-xs font-mono text-center flex items-center justify-center gap-2 text-cyan-300 font-bold overflow-x-auto">
              {selectedTarget.breadcrumbs.map((bc, idx) => (
                <React.Fragment key={bc.id}>
                  <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700">
                    {bc.cameraId}
                  </span>
                  {idx < selectedTarget.breadcrumbs.length - 1 && (
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Vertical Timeline */}
            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-cyan-500/30">
              {selectedTarget.breadcrumbs.map((bc, idx) => {
                const isLast = idx === selectedTarget.breadcrumbs.length - 1;
                return (
                  <div key={bc.id} className="relative space-y-1 text-xs font-mono">
                    {/* Glowing Pin Dot */}
                    <div
                      className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border flex items-center justify-center ${
                        isLast
                          ? 'bg-red-950 border-red-500 text-red-400 animate-ping'
                          : 'bg-slate-900 border-cyan-500 text-cyan-400'
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${isLast ? 'bg-red-500' : 'bg-cyan-400'}`}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">{bc.time}</span>
                      <span className="text-cyan-400 font-bold">{bc.cameraId}</span>
                      <span className="text-slate-400 text-[11px]">{bc.direction}</span>
                    </div>

                    <div className="text-[11px] text-slate-300 font-sans">
                      {bc.cameraName} ({bc.zone})
                    </div>

                    <div className="flex items-center gap-3 text-[10px] text-slate-400 pt-0.5">
                      <span>Conf: <b className="text-emerald-400">{(bc.confidence * 100).toFixed(0)}%</b></span>
                      <span>Dwell: <b>{bc.duration}</b></span>
                    </div>

                    {bc.notes && (
                      <div className="text-[10px] text-slate-400 bg-slate-950/60 p-1.5 rounded border border-slate-800/80 mt-1 font-sans italic">
                        {bc.notes}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Interactive Tactical Spatial Map & Re-ID Path Visualizer */}
        <div className="lg:col-span-8 space-y-3">
          <div className="bg-[#0b121e] rounded-lg border border-slate-800 p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Spatial Infiltration Vector // Sector A to Sector B Buffer
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-slate-400">
                COORDINATES: LAT 28.6360°N  LNG 71.2580°E
              </span>
            </div>
          </div>

          {/* Tactical SVG Vector Map */}
          <div className="bg-[#080e18] rounded-lg border border-cyan-900/40 p-4 h-[600px] relative overflow-hidden flex flex-col justify-between shadow-2xl">
            {/* Background Grid Lines & Compass Rose */}
            <div className="absolute inset-0 hud-grid opacity-30 pointer-events-none" />
            
            {/* Top Tactical Overlay HUD */}
            <div className="relative z-10 flex items-center justify-between text-xs font-mono text-slate-400">
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-cyan-300">
                  TARGET: {selectedTarget.id}
                </span>
                <span>MODE: DEEPSORT TRAJECTORY RECON</span>
              </div>
              <div className="text-slate-400">SCALE: 1:5000 METRIC</div>
            </div>

            {/* SVG Visual Map Area */}
            <div className="relative flex-1 w-full my-4">
              <svg className="w-full h-full" viewBox="0 0 800 450">
                {/* Border Fence Line (Dotted high-security barrier) */}
                <path
                  d="M 50 220 Q 250 200, 450 230 T 750 210"
                  fill="none"
                  stroke="rgba(239, 68, 68, 0.4)"
                  strokeWidth="3"
                  strokeDasharray="6,4"
                />
                <text x="60" y="210" fill="#ef4444" fontSize="10" fontFamily="monospace">
                  RESTRICTED ZERO-LINE BORDER FENCE
                </text>

                {/* Restricted Zone Shaded Polygon Buffer */}
                <polygon
                  points="320,160 560,150 580,290 310,310"
                  fill="rgba(239, 68, 68, 0.08)"
                  stroke="rgba(239, 68, 68, 0.5)"
                  strokeWidth="1.5"
                  strokeDasharray="4,4"
                />
                <text x="360" y="270" fill="rgba(239, 68, 68, 0.8)" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  RESTRICTED BUFFER ZONE 01
                </text>

                {/* Road Corridor connecting Checkpoint Alpha to Sector B */}
                <path
                  d="M 120 400 L 220 280 L 410 240 L 640 180"
                  fill="none"
                  stroke="rgba(100, 140, 180, 0.3)"
                  strokeWidth="8"
                  strokeLinecap="round"
                />

                {/* Camera Sensor FOV Cones & Nodes */}
                {[
                  { id: 'CAM-02', x: 120, y: 320, angle: -45, name: 'Post Alpha Gate' },
                  { id: 'CAM-03', x: 260, y: 250, angle: -30, name: 'Transit Corridor' },
                  { id: 'CAM-05', x: 420, y: 220, angle: -60, name: 'Scrubland Approach' },
                  { id: 'CAM-04', x: 500, y: 160, angle: -90, name: 'Restricted Fence Line' },
                  { id: 'CAM-06', x: 660, y: 190, angle: -45, name: 'Bravo Outpost' },
                ].map((node) => (
                  <g key={node.id}>
                    {/* Camera Node Icon */}
                    <circle cx={node.x} cy={node.y} r="8" fill="#0b121e" stroke="#00f0ff" strokeWidth="2" />
                    <circle cx={node.x} cy={node.y} r="3" fill="#00f0ff" />
                    <text x={node.x - 18} y={node.y + 20} fill="#ffffff" fontSize="10" fontFamily="monospace" fontWeight="bold">
                      {node.id}
                    </text>
                    <text x={node.x - 24} y={node.y + 32} fill="#94a3b8" fontSize="8" fontFamily="monospace">
                      {node.name}
                    </text>
                  </g>
                ))}

                {/* Re-ID Infiltration Path Vector (Animated Glowing Line) */}
                <path
                  d="M 120 320 Q 180 290, 260 250 T 420 220 T 500 160"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="3.5"
                  strokeDasharray="8,5"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    values="100;0"
                    dur="3s"
                    repeatCount="indefinite"
                  />
                </path>

                {/* Breadcrumb Waypoints */}
                <circle cx="120" cy="320" r="5" fill="#10b981" />
                <circle cx="260" cy="250" r="5" fill="#f59e0b" />
                <circle cx="420" cy="220" r="5" fill="#f59e0b" />
                
                {/* Active Intruder Current Position (Pulsing Red) */}
                <g>
                  <circle cx="500" cy="160" r="14" fill="rgba(239, 68, 68, 0.25)">
                    <animate attributeName="r" values="10;22;10" dur="1.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.8;0.2;0.8" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="500" cy="160" r="6" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
                  <text x="515" y="155" fill="#ef4444" fontSize="11" fontFamily="monospace" fontWeight="bold">
                    TARGET P-1042 // BREACH INTERSECTION
                  </text>
                  <text x="515" y="168" fill="#fca5a5" fontSize="9" fontFamily="monospace">
                    23:08:14 — 97% AI CONFIRMATION
                  </text>
                </g>

                {/* QRT Alpha Response Interception Vector */}
                <path
                  d="M 620 360 L 515 175"
                  fill="none"
                  stroke="#00f0ff"
                  strokeWidth="2"
                  strokeDasharray="4,4"
                />
                <circle cx="620" cy="360" r="6" fill="#00f0ff" />
                <text x="630" y="365" fill="#00f0ff" fontSize="10" fontFamily="monospace" fontWeight="bold">
                  QRT ALPHA UNIT (DISPATCHED)
                </text>
              </svg>
            </div>

            {/* Bottom Telemetry Strip */}
            <div className="relative z-10 bg-slate-950/90 border border-slate-800 rounded p-2.5 flex flex-wrap items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-4 text-slate-300">
                <span>TOTAL DISTANCE: <b className="text-cyan-400">1.84 KM</b></span>
                <span>ELAPSED TIME: <b className="text-amber-400">27 MINS 02 SEC</b></span>
                <span>AVG SPEED: <b className="text-white">1.13 M/S</b></span>
                <span>RE-ID ACCURACY: <b className="text-emerald-400">95.4%</b></span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => triggerSimulatedBreach('CAM-04')}
                  className="px-2.5 py-1 rounded bg-red-950 hover:bg-red-900 text-red-300 border border-red-700 text-xs font-bold transition flex items-center gap-1"
                >
                  <AlertOctagon className="w-3.5 h-3.5 text-red-400" />
                  <span>Retrigger Incursion</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useSurveillance } from '../context/SurveillanceContext';
import { CameraCard } from '../components/surveillance/CameraCard';
import { CameraFeedCanvas } from '../components/surveillance/CameraFeedCanvas';
import {
  Grid2X2,
  Grid3X3,
  Square,
  LayoutGrid,
  Moon,
  Sun,
  Camera as CameraIcon,
  Crosshair,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Sliders,
  Shield,
  Zap,
} from 'lucide-react';

export const LiveSurveillancePage: React.FC = () => {
  const {
    cameras,
    selectedCameraId,
    setSelectedCameraId,
    gridMode,
    setGridMode,
    isNightVisionGlobal,
    toggleNightVision,
    triggerSimulatedBreach,
  } = useSurveillance();

  const [activeSector, setActiveSector] = useState<string>('ALL');
  const [ptzZoom, setPtzZoom] = useState<number>(1.0);
  const [ptzPan, setPtzPan] = useState<string>('0° N');

  // Filter cameras
  const filteredCameras = cameras.filter((c) => {
    if (activeSector === 'ALL') return true;
    if (activeSector === 'SECTOR_A') return c.sector.includes('Sector A');
    if (activeSector === 'SECTOR_B') return c.sector.includes('Sector B');
    if (activeSector === 'RESTRICTED') return c.sector.includes('Restricted');
    return true;
  });

  const selectedCam = cameras.find((c) => c.id === selectedCameraId) || cameras[0];
  const displayCameras = filteredCameras.slice(0, gridMode);

  return (
    <div className="p-4 space-y-4 max-w-[1920px] mx-auto">
      {/* Top Controls Toolbar */}
      <div className="bg-[#0b121e] rounded-lg border border-slate-800 p-3 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Sector Filters */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400 uppercase font-bold mr-1">
            Sector:
          </span>
          {[
            { id: 'ALL', label: 'All Sectors' },
            { id: 'SECTOR_A', label: 'Sector A' },
            { id: 'SECTOR_B', label: 'Sector B' },
            { id: 'RESTRICTED', label: 'Restricted Buffer' },
          ].map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveSector(sec.id)}
              className={`px-2.5 py-1 rounded text-xs font-mono transition ${
                activeSector === sec.id
                  ? 'bg-cyan-950 border border-cyan-500 text-cyan-300 font-bold'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>

        {/* Center: Global Day / Night Low-Light Mode Toggle */}
        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1 rounded border border-slate-800">
          <span className="text-xs font-mono text-slate-400">SURVEILLANCE MODE:</span>
          <button
            onClick={() => toggleNightVision()}
            className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold flex items-center gap-1.5 transition ${
              isNightVisionGlobal
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-700 shadow-sm shadow-cyan-900/50'
                : 'bg-amber-950/40 text-amber-300 border border-amber-800/60'
            }`}
          >
            {isNightVisionGlobal ? (
              <>
                <Moon className="w-3.5 h-3.5 text-cyan-400" />
                <span>NIGHT LOW-LIGHT ENHANCED</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>DAYLIGHT HIGH-DEF</span>
              </>
            )}
          </button>
        </div>

        {/* Right: Grid Layout Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded border border-slate-800">
          <span className="text-[11px] font-mono text-slate-400 px-1.5">GRID:</span>
          <button
            onClick={() => setGridMode(1)}
            className={`p-1.5 rounded transition ${
              gridMode === 1 ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
            title="Single Camera Focus"
          >
            <Square className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setGridMode(4)}
            className={`p-1.5 rounded transition ${
              gridMode === 4 ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
            title="2x2 Matrix (4 Cams)"
          >
            <Grid2X2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setGridMode(6)}
            className={`p-1.5 rounded transition ${
              gridMode === 6 ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
            title="3x2 Matrix (6 Cams)"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setGridMode(9)}
            className={`p-1.5 rounded transition ${
              gridMode === 9 ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
            title="3x3 Matrix (9 Cams)"
          >
            <Grid3X3 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Grid Display or 1-Camera Focus */}
      {gridMode === 1 ? (
        /* Single Camera Focus with PTZ & High Telemetry */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-9 bg-[#0b121e] rounded-lg border border-cyan-500/30 overflow-hidden shadow-2xl flex flex-col">
            <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                <span className="font-mono text-sm font-bold text-white">
                  TACTICAL FOCUS: {selectedCam.id} — {selectedCam.name}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                <span>RTSP: {selectedCam.ip}:554</span>
                <span className="text-emerald-400 font-bold">{selectedCam.fps} FPS</span>
              </div>
            </div>

            <div className="relative aspect-video w-full">
              <CameraFeedCanvas
                camera={selectedCam}
                isNightMode={isNightVisionGlobal || selectedCam.nightVisionActive}
                className="w-full h-full"
              />

              {/* Night low-light HUD badge */}
              {(isNightVisionGlobal || selectedCam.nightVisionActive) && (
                <div className="absolute top-4 left-4 bg-slate-950/80 border border-cyan-500/70 p-2.5 rounded text-xs font-mono space-y-1 text-cyan-300">
                  <div className="font-bold text-cyan-400">LOW-LIGHT ENHANCEMENT: ACTIVE</div>
                  <div className="text-[11px] text-slate-300">AI DETECTION: ACTIVE (HIGH GAIN)</div>
                  <div className="text-[10px] text-emerald-400">PERSON: 96% | VEHICLE: 91% | FACE: 89%</div>
                </div>
              )}
            </div>

            {/* Bottom Feed Status */}
            <div className="bg-slate-950 p-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-4 text-slate-400">
                <span>NODE: <b className="text-slate-200">{selectedCam.edgeNode}</b></span>
                <span>GPU LOAD: <b className="text-cyan-400">{selectedCam.edgeLoad}%</b></span>
                <span>TEMP: <b className="text-amber-400">{selectedCam.edgeTemp}°C</b></span>
                <span>RESOLUTION: <b className="text-slate-200">{selectedCam.resolution}</b></span>
              </div>
              <button
                onClick={() => triggerSimulatedBreach(selectedCam.id)}
                className="px-3 py-1 rounded bg-red-950 hover:bg-red-900 text-red-300 border border-red-700 font-bold transition flex items-center gap-1"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Simulate Incursion</span>
              </button>
            </div>
          </div>

          {/* PTZ and Camera Selector Sidebar */}
          <div className="lg:col-span-3 space-y-4">
            {/* PTZ Controller Simulation */}
            <div className="bg-[#0b121e] rounded-lg border border-slate-800 p-4 space-y-3">
              <div className="text-xs font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
                <Crosshair className="w-4 h-4 text-cyan-400" />
                <span>PTZ Control Console</span>
              </div>

              {/* Directional Pad */}
              <div className="w-36 h-36 mx-auto relative rounded-full bg-slate-950 border border-slate-700 flex items-center justify-center shadow-inner">
                <button
                  onClick={() => setPtzPan('15° N')}
                  className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-8 rounded bg-slate-800 hover:bg-cyan-900 text-cyan-400 font-bold text-xs"
                >
                  ▲
                </button>
                <button
                  onClick={() => setPtzPan('15° S')}
                  className="absolute bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 rounded bg-slate-800 hover:bg-cyan-900 text-cyan-400 font-bold text-xs"
                >
                  ▼
                </button>
                <button
                  onClick={() => setPtzPan('25° W')}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded bg-slate-800 hover:bg-cyan-900 text-cyan-400 font-bold text-xs"
                >
                  ◀
                </button>
                <button
                  onClick={() => setPtzPan('25° E')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded bg-slate-800 hover:bg-cyan-900 text-cyan-400 font-bold text-xs"
                >
                  ▶
                </button>
                <div className="text-[10px] font-mono text-slate-400 font-bold">
                  PTZ
                </div>
              </div>

              <div className="text-center font-mono text-xs text-slate-400">
                HEADING: <span className="text-cyan-400 font-bold">{ptzPan}</span>
              </div>

              {/* Zoom Sliders */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>OPTICAL ZOOM:</span>
                  <span className="text-cyan-400 font-bold">{ptzZoom.toFixed(1)}x</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPtzZoom(Math.max(1.0, ptzZoom - 0.5))}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <input
                    type="range"
                    min="1.0"
                    max="10.0"
                    step="0.5"
                    value={ptzZoom}
                    onChange={(e) => setPtzZoom(parseFloat(e.target.value))}
                    className="w-full accent-cyan-500 bg-slate-900"
                  />
                  <button
                    onClick={() => setPtzZoom(Math.min(10.0, ptzZoom + 0.5))}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* PTZ Presets */}
              <div className="grid grid-cols-3 gap-1.5 pt-2">
                {['Preset 1 (Gate)', 'Preset 2 (Sand)', 'Preset 3 (Wire)'].map((p, i) => (
                  <button
                    key={i}
                    onClick={() => setPtzPan(`${(i + 1) * 30}°`)}
                    className="py-1 px-1 text-[10px] font-mono rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Camera Switcher */}
            <div className="bg-[#0b121e] rounded-lg border border-slate-800 p-3">
              <div className="text-xs font-bold text-white font-mono uppercase mb-2">
                Switch Camera Stream
              </div>
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {cameras.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCameraId(c.id)}
                    className={`w-full text-left p-2 rounded text-xs font-mono flex items-center justify-between transition ${
                      selectedCam.id === c.id
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-600 font-bold'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="truncate">
                      <div>{c.id}</div>
                      <div className="text-[10px] text-slate-500 truncate">{c.name}</div>
                    </div>
                    <span className="text-[10px] text-emerald-400">{c.fps} fps</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Multi-Camera Matrix Grid (4, 6, or 9) */
        <div
          className={`grid gap-3 ${
            gridMode === 4
              ? 'grid-cols-1 md:grid-cols-2'
              : gridMode === 6
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3'
          }`}
        >
          {displayCameras.map((cam) => (
            <CameraCard
              key={cam.id}
              camera={cam}
              isNightMode={isNightVisionGlobal || cam.nightVisionActive}
              onSelect={() => {
                setSelectedCameraId(cam.id);
                setGridMode(1);
              }}
              onToggleNight={() => toggleNightVision(cam.id)}
              onSimulateBreach={() => triggerSimulatedBreach(cam.id)}
              isSelected={cam.id === selectedCameraId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

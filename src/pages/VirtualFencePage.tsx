import React, { useState, useRef, useEffect } from 'react';
import { useSurveillance } from '../context/SurveillanceContext';
import { VirtualFence, ThreatLevel } from '../types/surveillance';
import {
  Fence,
  Plus,
  Trash2,
  Save,
  Play,
  RotateCcw,
  Clock,
  ArrowUpDown,
  ShieldAlert,
  AlertOctagon,
  CheckCircle2,
  MousePointerClick,
} from 'lucide-react';

export const VirtualFencePage: React.FC = () => {
  const {
    cameras,
    selectedCameraId,
    setSelectedCameraId,
    updateVirtualFence,
    addVirtualFence,
    deleteVirtualFence,
    triggerSimulatedBreach,
  } = useSurveillance();

  const selectedCam = cameras.find((c) => c.id === selectedCameraId) || cameras[3]; // Default to CAM-04

  // Drawing state
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [customPoints, setCustomPoints] = useState<Array<{ x: number; y: number }>>([
    { x: 15, y: 40 },
    { x: 50, y: 48 },
    { x: 88, y: 42 },
    { x: 92, y: 90 },
    { x: 8, y: 90 },
  ]);

  const [zoneName, setZoneName] = useState<string>('Restricted Border Zone 01');
  const [threatLevel, setThreatLevel] = useState<ThreatLevel>('CRITICAL');
  const [direction, setDirection] = useState<'ENTRY' | 'EXIT' | 'BOTH'>('ENTRY');
  const [activeHours, setActiveHours] = useState<string>('24/7 Curfew');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [breachAlertActive, setBreachAlertActive] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Sync with camera's existing fence if present
  useEffect(() => {
    if (selectedCam.virtualFences && selectedCam.virtualFences.length > 0) {
      const f = selectedCam.virtualFences[0];
      setCustomPoints(f.points);
      setZoneName(f.name);
      setThreatLevel(f.threatLevel);
      setDirection(f.direction);
      setActiveHours(f.activeHours);
    }
  }, [selectedCam]);

  // Canvas Drawing & Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const draw = () => {
      t += 0.03;
      const w = canvas.width;
      const h = canvas.height;

      // 1. Draw Simulated Background (Terrain + Border Wire)
      ctx.fillStyle = '#081116';
      ctx.fillRect(0, 0, w, h);

      // Sky
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.45);
      skyGrad.addColorStop(0, '#040b12');
      skyGrad.addColorStop(1, '#0e2336');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h * 0.45);

      // Ground
      const groundGrad = ctx.createLinearGradient(0, h * 0.45, 0, h);
      groundGrad.addColorStop(0, '#101d24');
      groundGrad.addColorStop(1, '#070f14');
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, h * 0.45, w, h * 0.55);

      // Border Fence physical wire lines
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.25)';
      ctx.lineWidth = 1.5;
      for (let x = 20; x < w; x += 60) {
        ctx.beginPath();
        ctx.moveTo(x, h * 0.42);
        ctx.lineTo(x, h * 0.65);
        ctx.stroke();
      }

      // 2. Draw Virtual Fence Polygon
      if (customPoints.length > 0) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo((customPoints[0].x / 100) * w, (customPoints[0].y / 100) * h);

        for (let i = 1; i < customPoints.length; i++) {
          ctx.lineTo((customPoints[i].x / 100) * w, (customPoints[i].y / 100) * h);
        }

        if (customPoints.length >= 3) {
          ctx.closePath();
          if (breachAlertActive) {
            const pulse = (Math.sin(t * 8) + 1) / 2;
            ctx.fillStyle = `rgba(239, 68, 68, ${0.25 + pulse * 0.25})`;
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 3;
            ctx.setLineDash([8, 4]);
          } else {
            ctx.fillStyle = 'rgba(0, 240, 255, 0.12)';
            ctx.strokeStyle = '#00f0ff';
            ctx.lineWidth = 2;
            ctx.setLineDash([6, 4]);
          }
          ctx.fill();
        } else {
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 2;
        }
        ctx.stroke();

        // Draw Vertices
        ctx.setLineDash([]);
        customPoints.forEach((pt, index) => {
          const px = (pt.x / 100) * w;
          const py = (pt.y / 100) * h;

          ctx.fillStyle = breachAlertActive ? '#ef4444' : '#00f0ff';
          ctx.beginPath();
          ctx.arc(px, py, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Vertex Index Number
          ctx.fillStyle = '#06090e';
          ctx.font = 'bold 9px monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText((index + 1).toString(), px, py);
        });

        // Directional Entry Vectors
        if (customPoints.length >= 3) {
          const midX = (customPoints[0].x + customPoints[1].x) / 2;
          const midY = (customPoints[0].y + customPoints[1].y) / 2;
          const vx = (midX / 100) * w;
          const vy = (midY / 100) * h;

          ctx.fillStyle = breachAlertActive ? '#ef4444' : '#00f0ff';
          ctx.font = 'bold 11px monospace';
          ctx.textAlign = 'left';
          ctx.fillText(
            `▶ RESTRICTED BOUNDARY [DIRECTION: ${direction}]`,
            vx + 10,
            vy - 8
          );
        }

        ctx.restore();
      }

      // 3. Draw Simulated Intruder Crossing if Breach is active
      if (breachAlertActive) {
        ctx.save();
        const targetX = w * 0.48;
        const targetY = h * 0.52;

        // Pulsing alert ring
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.8)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(targetX, targetY, 28, 0, Math.PI * 2);
        ctx.stroke();

        // Bounding Box
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.strokeRect(targetX - 20, targetY - 40, 40, 70);

        // Intruder Tag
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(targetX - 20, targetY - 56, 110, 16);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'left';
        ctx.fillText('BREACH: P-1042', targetX - 16, targetY - 44);

        ctx.restore();
      }

      // HUD Overlay
      ctx.fillStyle = 'rgba(0, 240, 255, 0.8)';
      ctx.font = '10px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`GEOMETRY ENGINE: ${customPoints.length} VERTICES ACTIVE`, 12, h - 12);

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animId);
  }, [customPoints, breachAlertActive, direction]);

  // Click on canvas to add vertex point
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    const roundedX = Number(clickX.toFixed(1));
    const roundedY = Number(clickY.toFixed(1));

    if (isDrawing) {
      setCustomPoints((prev) => [...prev, { x: roundedX, y: roundedY }]);
    }
  };

  const handleSave = () => {
    const newFence: VirtualFence = {
      id: `VF-${selectedCam.id}`,
      cameraId: selectedCam.id,
      name: zoneName,
      threatLevel,
      activeHours,
      direction,
      points: customPoints,
      color: threatLevel === 'CRITICAL' ? '#ef4444' : '#00f0ff',
      isBreached: breachAlertActive,
      breachCount: breachAlertActive ? 1 : 0,
    };

    updateVirtualFence(newFence);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleTriggerBreach = () => {
    setBreachAlertActive(true);
    triggerSimulatedBreach(selectedCam.id);
  };

  const handleResetPoints = () => {
    setCustomPoints([
      { x: 15, y: 40 },
      { x: 50, y: 48 },
      { x: 88, y: 42 },
      { x: 92, y: 90 },
      { x: 8, y: 90 },
    ]);
    setBreachAlertActive(false);
  };

  return (
    <div className="p-4 space-y-4 max-w-[1920px] mx-auto">
      {/* Top Banner */}
      <div className="bg-[#0b121e] rounded-lg border border-slate-800 p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-cyan-400">
            <Fence className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold text-white font-mono uppercase tracking-wider">
                Virtual Fence Studio // Polygonal Geofence Configuration
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-700">
                RAY-CASTING GEOMETRY
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Draw and define restricted buffer zones on live camera perspectives with directionality and breach thresholds.
            </p>
          </div>
        </div>

        {/* Camera Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">CAMERA:</span>
          <select
            value={selectedCameraId}
            onChange={(e) => setSelectedCameraId(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-xs text-white font-mono outline-none"
          >
            {cameras.map((c) => (
              <option key={c.id} value={c.id}>
                {c.id} - {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Interactive Canvas (Left) + Geofence Properties (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Large Interactive Canvas (8 cols) */}
        <div className="lg:col-span-8 bg-[#0b121e] rounded-lg border border-slate-800 p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-xs font-bold text-white uppercase">
                Interactive Zone Frame: {selectedCam.id}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsDrawing(!isDrawing)}
                className={`px-3 py-1 rounded text-xs font-mono font-bold transition flex items-center gap-1.5 ${
                  isDrawing
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-900/40'
                    : 'bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700'
                }`}
              >
                <MousePointerClick className="w-3.5 h-3.5" />
                <span>{isDrawing ? 'Click Canvas to Add Points' : 'Enable Polygon Editor'}</span>
              </button>

              <button
                onClick={handleResetPoints}
                className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
                title="Reset Default Geometry"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive Canvas Container */}
          <div className="relative aspect-video w-full rounded border border-slate-700 overflow-hidden bg-black shadow-2xl">
            <canvas
              ref={canvasRef}
              width={960}
              height={540}
              onClick={handleCanvasClick}
              className={`w-full h-full object-cover block ${isDrawing ? 'cursor-crosshair' : 'cursor-default'}`}
            />

            {/* Breach Alert Floating Banner */}
            {breachAlertActive && (
              <div className="absolute top-4 left-4 right-4 bg-red-600/95 text-white font-mono text-xs font-bold px-3 py-2 rounded flex items-center justify-between animate-pulse shadow-2xl border border-red-400">
                <div className="flex items-center gap-2">
                  <AlertOctagon className="w-5 h-5" />
                  <span>VIRTUAL FENCE BREACH TRIGGERED ON {selectedCam.id}</span>
                </div>
                <span>SCORE: 96 / 100</span>
              </div>
            )}
          </div>

          {/* Drawing Instructions & Vertex List */}
          <div className="bg-slate-950/80 rounded border border-slate-800 p-3 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
            <div className="flex items-center gap-2 text-slate-400">
              <span className="text-cyan-400 font-bold">Polygon Points ({customPoints.length}):</span>
              {customPoints.map((p, i) => (
                <span key={i} className="bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 text-[10px]">
                  P{i + 1}: ({p.x}%, {p.y}%)
                </span>
              ))}
            </div>

            {customPoints.length > 0 && (
              <button
                onClick={() => setCustomPoints((prev) => prev.slice(0, -1))}
                disabled={customPoints.length <= 3}
                className="text-[10px] text-red-400 hover:text-red-300 disabled:opacity-40 transition font-mono"
              >
                Remove Last Point
              </button>
            )}
          </div>
        </div>

        {/* Right: Fence Settings & Breach Trigger (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#0b121e] rounded-lg border border-slate-800 p-4 space-y-4">
            <div className="text-xs font-bold text-white font-mono uppercase tracking-wider border-b border-slate-800 pb-2">
              Virtual Boundary Parameters
            </div>

            {/* Zone Name */}
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                Restricted Zone Identifier
              </label>
              <input
                type="text"
                value={zoneName}
                onChange={(e) => setZoneName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-xs text-white font-mono outline-none focus:border-cyan-500"
              />
            </div>

            {/* Threat Level */}
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                Breach Threat Classification
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['CRITICAL', 'HIGH', 'MEDIUM'] as ThreatLevel[]).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setThreatLevel(lvl)}
                    className={`py-1.5 px-1 rounded text-[11px] font-mono font-bold transition border ${
                      threatLevel === lvl
                        ? lvl === 'CRITICAL'
                          ? 'bg-red-950 border-red-500 text-red-300'
                          : lvl === 'HIGH'
                          ? 'bg-amber-950 border-amber-500 text-amber-300'
                          : 'bg-blue-950 border-blue-500 text-blue-300'
                        : 'bg-slate-900 border-slate-800 text-slate-500'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Directionality */}
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                Breach Direction Trigger
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['ENTRY', 'EXIT', 'BOTH'] as const).map((dir) => (
                  <button
                    key={dir}
                    type="button"
                    onClick={() => setDirection(dir)}
                    className={`py-1.5 px-1 rounded text-[11px] font-mono font-bold transition border ${
                      direction === dir
                        ? 'bg-cyan-950 border-cyan-500 text-cyan-300'
                        : 'bg-slate-900 border-slate-800 text-slate-500'
                    }`}
                  >
                    {dir}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Curfew Hours */}
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                Active Surveillance Window
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['24/7 Curfew', 'Night (18:00 - 06:00)'].map((hrs) => (
                  <button
                    key={hrs}
                    type="button"
                    onClick={() => setActiveHours(hrs)}
                    className={`py-1.5 px-2 rounded text-[10px] font-mono transition border ${
                      activeHours === hrs
                        ? 'bg-cyan-950 border-cyan-500 text-cyan-300 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    {hrs}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-2 border-t border-slate-800">
              <button
                onClick={handleSave}
                className="w-full py-2.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/40"
              >
                <Save className="w-4 h-4" />
                <span>SAVE FENCE CONFIGURATION</span>
              </button>

              <button
                onClick={handleTriggerBreach}
                className="w-full py-2.5 rounded bg-red-950 hover:bg-red-900 text-red-200 border border-red-700 text-xs font-mono font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-red-950/40"
              >
                <AlertOctagon className="w-4 h-4 text-red-400" />
                <span>TEST SIMULATED BREACH</span>
              </button>
            </div>

            {saveSuccess && (
              <div className="p-2.5 rounded bg-emerald-950/60 border border-emerald-700 text-emerald-300 text-xs font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Virtual fence polygon updated successfully!</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

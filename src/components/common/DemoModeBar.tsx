import React from 'react';
import { useSurveillance } from '../../context/SurveillanceContext';
import { Play, Pause, SkipForward, SkipBack, RotateCcw, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';

const DEMO_STEPS = [
  { step: 0, title: 'Standby', desc: 'Perimeter monitoring active across Sector A & Sector B.' },
  { step: 1, title: '1. Target Ingress', desc: 'Target Person P-1042 first spotted near outer perimeter road on CAM-02.' },
  { step: 2, title: '2. Checkpoint Bypass', desc: 'Target evades main roadway checkpoint and enters intermediate scrubland buffer.' },
  { step: 3, title: '3. Cross-Camera Re-ID', desc: 'DeepSORT re-identification successfully matches clothing and gait on CAM-03.' },
  { step: 4, title: '4. Restricted Approach', desc: 'Target proceeds northward along intermediate sector towards buffer zone.' },
  { step: 5, title: '5. Pre-Breach Acquisition', desc: 'CAM-05 picks up fast sprint toward restricted border wire barrier.' },
  { step: 6, title: '6. Virtual Fence Breach', desc: 'CRITICAL: Target crosses polygonal restricted virtual fence boundary on CAM-04!' },
  { step: 7, title: '7. Multi-Signal Verification', desc: 'AI verifies 4 signals: Confidence 97% + Restricted Zone + Night Curfew + Cross-Cam history.' },
  { step: 8, title: '8. Threat Score 94/100', desc: 'Score elevates to CRITICAL (94/100). False alarm possibility discarded.' },
  { step: 9, title: '9. Critical Siren & Broadcast', desc: 'High-priority alert dispatched to Command Center & Mobile QRT units.' },
  { step: 10, title: '10. QRT Alpha Dispatched', desc: 'Operator tracks live trajectory vector; Quick Reaction Team dispatched for interdiction.' },
];

export const DemoModeBar: React.FC = () => {
  const {
    demoModeActive,
    demoStep,
    demoPlaying,
    startDemo,
    pauseDemo,
    nextDemoStep,
    prevDemoStep,
    resetDemo,
  } = useSurveillance();

  if (!demoModeActive) return null;

  const current = DEMO_STEPS[demoStep] || DEMO_STEPS[0];

  return (
    <div className="bg-slate-900 border-b border-cyan-500/40 px-4 py-2.5 shadow-xl flex flex-wrap items-center justify-between gap-4 z-40">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-red-950/80 border border-red-500/50 px-2.5 py-1 rounded text-xs font-mono text-red-400 font-bold tracking-wide animate-pulse">
          <AlertTriangle className="w-4 h-4 text-red-400" />
          <span>SIH 2026 DEMO SCENARIO</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded">
            STEP {demoStep} / 10
          </span>
          <span className="text-sm font-semibold text-white tracking-wide">
            {current.title}:
          </span>
          <span className="text-xs text-slate-300 hidden md:inline">
            {current.desc}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={prevDemoStep}
          disabled={demoStep <= 0}
          className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition text-xs flex items-center gap-1 border border-slate-700"
          title="Previous Step"
        >
          <SkipBack className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Prev</span>
        </button>

        {demoPlaying ? (
          <button
            onClick={pauseDemo}
            className="px-3 py-1.5 rounded bg-amber-600 hover:bg-amber-500 text-white font-mono text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-amber-900/30"
          >
            <Pause className="w-3.5 h-3.5" />
            <span>Pause</span>
          </button>
        ) : (
          <button
            onClick={startDemo}
            className="px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-cyan-900/30"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{demoStep === 0 ? 'Start Demo' : 'Resume'}</span>
          </button>
        )}

        <button
          onClick={nextDemoStep}
          disabled={demoStep >= 10}
          className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition text-xs flex items-center gap-1 border border-slate-700"
          title="Next Step"
        >
          <span className="hidden sm:inline">Next</span>
          <SkipForward className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={resetDemo}
          className="p-1.5 rounded bg-slate-800 hover:bg-red-900/40 text-slate-300 hover:text-red-300 transition text-xs flex items-center gap-1 border border-slate-700 ml-1"
          title="Exit Demo Mode"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Exit Demo</span>
        </button>
      </div>
    </div>
  );
};

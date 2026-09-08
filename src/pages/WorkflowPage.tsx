import React, { useState, useEffect } from 'react';
import { useSurveillance } from '../context/SurveillanceContext';
import {
  GitMerge,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Clock,
  ArrowRight,
  Shield,
  Zap,
  Camera,
  Layers,
  Send,
} from 'lucide-react';

export const WorkflowPage: React.FC = () => {
  const { pipelineStages, activeStageId, triggerSimulatedBreach } = useSurveillance();

  const [currentStage, setCurrentStage] = useState<number>(activeStageId || 8);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    setCurrentStage(activeStageId);
  }, [activeStageId]);

  // Automated traversal timer
  useEffect(() => {
    let timer: number;
    if (isPlaying) {
      timer = window.setTimeout(() => {
        setCurrentStage((prev) => {
          if (prev < 9) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return 9;
          }
        });
      }, 1600);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStage]);

  const handleRunReplay = () => {
    setCurrentStage(1);
    setIsPlaying(true);
  };

  return (
    <div className="p-4 space-y-4 max-w-[1920px] mx-auto">
      {/* Top Banner */}
      <div className="bg-[#0b121e] rounded-lg border border-slate-800 p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-cyan-400">
            <GitMerge className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold text-white font-mono uppercase tracking-wider">
                Surveillance-to-Response Pipeline Workflow
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-700 font-bold">
                9-STAGE ARCHITECTURE
              </span>
            </div>
            <p className="text-xs text-slate-400">
              End-to-end execution path from raw camera RTSP ingestion to operator QRT tactical dispatch.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isPlaying ? (
            <button
              onClick={() => setIsPlaying(false)}
              className="px-3 py-1.5 rounded bg-amber-600 hover:bg-amber-500 text-white text-xs font-mono font-bold transition flex items-center gap-1.5"
            >
              <Pause className="w-3.5 h-3.5" />
              <span>Pause Pipeline</span>
            </button>
          ) : (
            <button
              onClick={handleRunReplay}
              className="px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold transition flex items-center gap-1.5 shadow-lg shadow-cyan-950/40"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Replay Pipeline Progression</span>
            </button>
          )}

          <button
            onClick={() => {
              triggerSimulatedBreach('CAM-04');
              handleRunReplay();
            }}
            className="px-3 py-1.5 rounded bg-red-950 hover:bg-red-900 border border-red-700 text-red-200 text-xs font-mono font-bold transition flex items-center gap-1"
          >
            <Zap className="w-3.5 h-3.5 text-red-400" />
            <span>Trigger Event & Animate</span>
          </button>
        </div>
      </div>

      {/* Horizontal Pipeline Steps Overview */}
      <div className="bg-[#0b121e] rounded-lg border border-slate-800 p-4 overflow-x-auto shadow-xl">
        <div className="flex items-center justify-between min-w-[1000px] gap-2">
          {pipelineStages.map((stage, idx) => {
            const isCompleted = stage.id < currentStage;
            const isCurrent = stage.id === currentStage;

            return (
              <React.Fragment key={stage.id}>
                <div
                  onClick={() => setCurrentStage(stage.id)}
                  className={`flex-1 p-3 rounded-lg border cursor-pointer transition-all ${
                    isCurrent
                      ? 'bg-cyan-950/80 border-cyan-400 shadow-lg shadow-cyan-950/50 scale-105'
                      : isCompleted
                      ? 'bg-slate-900 border-emerald-500/50 text-slate-300'
                      : 'bg-slate-950/60 border-slate-800 text-slate-500 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                        isCurrent
                          ? 'bg-cyan-600 text-white'
                          : isCompleted
                          ? 'bg-emerald-950 text-emerald-400'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      STAGE {stage.id}
                    </span>
                    {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    {isCurrent && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />}
                  </div>

                  <div className="font-bold text-xs text-white truncate font-mono">
                    {stage.title.split('. ')[1]}
                  </div>

                  <div className="text-[10px] text-slate-400 mt-1 line-clamp-2">
                    {stage.subtitle}
                  </div>
                </div>

                {idx < pipelineStages.length - 1 && (
                  <ArrowRight
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      idx < currentStage - 1 ? 'text-emerald-400' : 'text-slate-700'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Detailed Stage Deep-Dive Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Active Stage Details */}
        <div className="lg:col-span-8 bg-[#0b121e] rounded-lg border border-cyan-900/50 p-5 space-y-4 shadow-xl">
          {(() => {
            const activeStage = pipelineStages.find((s) => s.id === currentStage) || pipelineStages[0];
            return (
              <>
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
                      ACTIVE WORKFLOW INSPECTION
                    </span>
                    <h3 className="text-lg font-extrabold text-white font-mono mt-0.5">
                      {activeStage.title}
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-xs font-mono text-emerald-400 font-bold">
                    LATENCY: ~12ms
                  </span>
                </div>

                <div className="text-sm text-slate-300 leading-relaxed">
                  {activeStage.subtitle}
                </div>

                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
                  <div className="text-xs font-mono text-slate-400 uppercase font-bold">
                    Telemetry & Payload Data Packet
                  </div>
                  <pre className="text-xs font-mono text-cyan-300 overflow-x-auto p-2 bg-black/50 rounded border border-slate-900">
{JSON.stringify(
  {
    stage_id: activeStage.id,
    stage_key: activeStage.key,
    telemetry_status: 'SUCCESS',
    timestamp: '2026-09-07T23:08:14.288Z',
    target_uid: 'P-1042',
    camera_source: 'CAM-04 (Restricted Zone 01)',
    data_summary: activeStage.dataSummary,
    edge_node: 'NVIDIA-Jetson-Orin-NX-02',
    hardware_acceleration: 'TensorRT FP16 Enabled',
  },
  null,
  2
)}
                  </pre>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => setCurrentStage(Math.max(1, currentStage - 1))}
                    disabled={currentStage <= 1}
                    className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 text-xs font-mono disabled:opacity-40"
                  >
                    ← Previous Stage
                  </button>
                  <button
                    onClick={() => setCurrentStage(Math.min(9, currentStage + 1))}
                    disabled={currentStage >= 9}
                    className="px-3 py-1.5 rounded bg-cyan-600 text-white text-xs font-mono font-bold disabled:opacity-40"
                  >
                    Next Stage →
                  </button>
                </div>
              </>
            );
          })()}
        </div>

        {/* Right: Technical Pipeline Benefits */}
        <div className="lg:col-span-4 bg-[#0b121e] rounded-lg border border-slate-800 p-4 space-y-3">
          <div className="text-xs font-mono font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
            Architectural Highlights
          </div>

          <div className="space-y-2 text-xs font-mono text-slate-300">
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800/80">
              <div className="font-bold text-cyan-400">Zero Cloud Dependency</div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                All 8 analytical stages execute on forward deployed NVIDIA Jetson edge nodes right next to the cameras.
              </div>
            </div>

            <div className="p-2.5 rounded bg-slate-950 border border-slate-800/80">
              <div className="font-bold text-emerald-400">Low-Bandwidth Transmission</div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Only lightweight JSON metadata (~2 KB) and event clips are sent back to HQ, preserving military SATCOM links.
              </div>
            </div>

            <div className="p-2.5 rounded bg-slate-950 border border-slate-800/80">
              <div className="font-bold text-purple-400">Multi-Camera Appearance Model</div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Target features are maintained even when blind spots exist between adjacent cameras.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

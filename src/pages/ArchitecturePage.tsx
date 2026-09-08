import React from 'react';
import {
  Cpu,
  Layers,
  Cctv,
  Server,
  Database,
  Monitor,
  Shield,
  Zap,
  CheckCircle2,
  Lock,
  Radio,
  ArrowDown,
} from 'lucide-react';

export const ArchitecturePage: React.FC = () => {
  const ARCHITECTURE_STEPS = [
    {
      level: 'Physical Camera Tier',
      component: 'Existing IP / Analog CCTV Cameras',
      tech: 'ONVIF, H.264 / H.265 Standard RTSP Streams',
      desc: 'No expensive proprietary camera replacement required. Integrates directly with existing deployed border cameras.',
      icon: Cctv,
      color: 'border-cyan-500/50 bg-cyan-950/20 text-cyan-300',
    },
    {
      level: 'Edge Computing Tier',
      component: 'NVIDIA Jetson Edge Devices (Orin Nano / NX)',
      tech: 'OpenCV Hardware Accelerated + FFmpeg Demuxing',
      desc: 'Forward-deployed in weatherproof rugged enclosures near camera poles for instant local edge inference.',
      icon: Cpu,
      color: 'border-emerald-500/50 bg-emerald-950/20 text-emerald-300',
      badge: 'NVIDIA JETSON EDGE LAYER',
    },
    {
      level: 'Vision AI Tier',
      component: 'TensorRT YOLOv8 + DeepSORT Tracking Engine',
      tech: 'Custom fine-tuned weights for Person, Vehicle, & ANPR OCR',
      desc: 'Real-time object detection (30 FPS) and Kalman filter trajectory prediction with appearance embeddings.',
      icon: Zap,
      color: 'border-blue-500/50 bg-blue-950/20 text-blue-300',
    },
    {
      level: 'Behavioral & Intelligence Tier',
      component: 'Virtual Fence Geometry & Multi-Signal Verifier',
      tech: 'Ray-Casting Polygon Crossing + Behavioral Heuristics',
      desc: 'Calculates dynamic threat score (0-100) and suppresses environmental false alarms (wildlife, shadows, blowing debris).',
      icon: Shield,
      color: 'border-purple-500/50 bg-purple-950/20 text-purple-300',
    },
    {
      level: 'Central Telemetry Tier',
      component: 'FastAPI High-Concurrency Event Broker',
      tech: 'Python 3.12, WebSockets, Redis Pub/Sub, PostgreSQL Audit',
      desc: 'Broadcasts sub-second incident alerts, coordinates cross-camera Re-ID handoffs, and archives forensic logs.',
      icon: Server,
      color: 'border-amber-500/50 bg-amber-950/20 text-amber-300',
    },
    {
      level: 'Command Presentation Tier',
      component: 'IBVAP Military Operations Dashboard',
      tech: 'React, TypeScript, Canvas Surveillance Engine, Tailwind CSS',
      desc: 'Dark command center UI designed for high-stress border ops centers and mobile Quick Reaction Teams (QRT).',
      icon: Monitor,
      color: 'border-cyan-400 bg-cyan-950/30 text-white',
    },
  ];

  return (
    <div className="p-4 space-y-4 max-w-[1920px] mx-auto">
      {/* Top Banner */}
      <div className="bg-[#0b121e] rounded-lg border border-slate-800 p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-cyan-400">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold text-white font-mono uppercase tracking-wider">
                IBVAP Technical Architecture & Defense System Topology
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-700 font-bold">
                SIH 2026 TECHNICAL BLUEPRINT
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Hardware-agnostic border surveillance architecture with edge-first AI processing and centralized command telemetry.
            </p>
          </div>
        </div>

        <div className="text-right font-mono text-xs text-slate-400">
          <span>EDGE COMPUTE LATENCY:</span>
          <span className="text-emerald-400 font-bold ml-1.5">&lt; 40 ms</span>
        </div>
      </div>

      {/* Main Flow Stack */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Interactive Vertical Stack Diagram (8 Cols) */}
        <div className="lg:col-span-8 bg-[#0b121e] rounded-lg border border-slate-800 p-5 space-y-4 shadow-xl">
          <div className="text-xs font-mono font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center justify-between">
            <span>End-to-End Surveillance Pipeline</span>
            <span className="text-cyan-400">Standard RTSP to Command Center</span>
          </div>

          <div className="space-y-3">
            {ARCHITECTURE_STEPS.map((step, idx) => {
              const Icon = step.icon;
              return (
                <React.Fragment key={idx}>
                  <div className={`p-4 rounded-lg border transition-all ${step.color}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded bg-slate-900 border border-slate-700 shrink-0 mt-0.5">
                          <Icon className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                              {step.level}
                            </span>
                            {step.badge && (
                              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                                {step.badge}
                              </span>
                            )}
                          </div>
                          <h4 className="text-sm font-bold text-white font-mono mt-0.5">
                            {step.component}
                          </h4>
                          <p className="text-xs text-slate-300 mt-1">{step.desc}</p>
                          <div className="mt-2 text-[10px] font-mono text-cyan-400/90 bg-black/40 px-2 py-1 rounded inline-block">
                            Tech: {step.tech}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {idx < ARCHITECTURE_STEPS.length - 1 && (
                    <div className="flex justify-center my-0.5">
                      <ArrowDown className="w-4 h-4 text-cyan-500/60 animate-bounce" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Right: Technical Differentiation & Judge Highlights (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#0b121e] rounded-lg border border-cyan-900/40 p-4 space-y-3 shadow-xl">
            <div className="text-xs font-mono font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
              Why IBVAP Wins SIH 2026
            </div>

            <div className="space-y-2.5 text-xs font-mono text-slate-300">
              <div className="p-3 rounded bg-slate-950 border border-slate-800 space-y-1">
                <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>1. Works with Existing Cameras</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Does NOT require dismantling existing border cameras. Plugs seamlessly into RTSP/ONVIF streams.
                </div>
              </div>

              <div className="p-3 rounded bg-slate-950 border border-slate-800 space-y-1">
                <div className="font-bold text-cyan-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>2. Cross-Camera Identity (Re-ID)</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Tracks suspects continuously across camera handoffs even through blind spots and terrain dips.
                </div>
              </div>

              <div className="p-3 rounded bg-slate-950 border border-slate-800 space-y-1">
                <div className="font-bold text-amber-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>3. Multi-Signal False Alarm Filtering</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Distinguishes stray wildlife from coordinated breaches, preventing patrol fatigue.
                </div>
              </div>

              <div className="p-3 rounded bg-slate-950 border border-slate-800 space-y-1">
                <div className="font-bold text-purple-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>4. Edge-First Tactical Autonomy</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Continues detecting threats locally even if long-range satellite/fiber communications are severed.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

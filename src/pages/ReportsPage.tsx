import React, { useState } from 'react';
import { useSurveillance } from '../context/SurveillanceContext';
import {
  FileBarChart2,
  Download,
  FileText,
  CheckCircle2,
  Calendar,
  Shield,
  TrendingUp,
  AlertOctagon,
  Clock,
  Printer,
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { kpis, alerts } = useSurveillance();
  const [downloading, setDownloading] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  const handleExportPDF = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    }, 1200);
  };

  return (
    <div className="p-4 space-y-4 max-w-[1920px] mx-auto">
      {/* Top Banner */}
      <div className="bg-[#0b121e] rounded-lg border border-slate-800 p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-cyan-400">
            <FileBarChart2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold text-white font-mono uppercase tracking-wider">
                Surveillance Intelligence & Operational Audit Reports
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-700">
                SIH 2026 AUDIT COMPLIANT
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Aggregated threat metrics, false alarm suppression efficacy, and downloadable incident dossiers.
            </p>
          </div>
        </div>

        <button
          onClick={handleExportPDF}
          disabled={downloading}
          className="px-4 py-2 rounded bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-mono font-bold transition flex items-center gap-2 shadow-lg shadow-cyan-950/40"
        >
          {downloading ? (
            <span>Generating Intelligence Dossier...</span>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>EXPORT MISSION INCIDENT REPORT (PDF)</span>
            </>
          )}
        </button>
      </div>

      {downloadSuccess && (
        <div className="p-3 rounded bg-emerald-950/70 border border-emerald-600 text-emerald-300 text-xs font-mono flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>
              Report generated successfully: <b>IBVAP-MISSION-AUDIT-2026-09.pdf</b> (SHA256: 4f8b91c... verified)
            </span>
          </div>
          <span className="text-slate-400 text-[10px]">Mock export simulated</span>
        </div>
      )}

      {/* KPI Highlight Summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-[#0b121e] border border-slate-800 rounded-lg p-3">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Total Detections</div>
          <div className="text-xl font-bold font-mono text-white mt-1">1,428</div>
          <div className="text-[10px] text-cyan-400 font-mono">+18% vs Last Week</div>
        </div>
        <div className="bg-[#0b121e] border border-slate-800 rounded-lg p-3">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Confirmed Threats</div>
          <div className="text-xl font-bold font-mono text-red-400 mt-1">19</div>
          <div className="text-[10px] text-slate-400 font-mono">100% Intercepted</div>
        </div>
        <div className="bg-[#0b121e] border border-slate-800 rounded-lg p-3">
          <div className="text-[10px] font-mono text-slate-400 uppercase">False Alarms Filtered</div>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-1">142</div>
          <div className="text-[10px] text-slate-400 font-mono">91.4% Suppression</div>
        </div>
        <div className="bg-[#0b121e] border border-slate-800 rounded-lg p-3">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Avg Response Time</div>
          <div className="text-xl font-bold font-mono text-cyan-400 mt-1">1.4 Mins</div>
          <div className="text-[10px] text-emerald-400 font-mono">-42s improvement</div>
        </div>
        <div className="bg-[#0b121e] border border-slate-800 rounded-lg p-3">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Most Active Hotspot</div>
          <div className="text-xl font-bold font-mono text-amber-400 mt-1">CAM-04</div>
          <div className="text-[10px] text-slate-400 font-mono">Restricted Buffer</div>
        </div>
        <div className="bg-[#0b121e] border border-slate-800 rounded-lg p-3">
          <div className="text-[10px] font-mono text-slate-400 uppercase">AI Classification Acc.</div>
          <div className="text-xl font-bold font-mono text-purple-400 mt-1">94.7%</div>
          <div className="text-[10px] text-slate-400 font-mono">Edge YOLOv8 Model</div>
        </div>
      </div>

      {/* Weekly Threat Trends & Incident Dossier Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Weekly Trend Chart */}
        <div className="lg:col-span-7 bg-[#0b121e] rounded-lg border border-slate-800 p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono font-bold text-white uppercase">
                7-Day Incursion & Threat Activity Trend
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Sector A & Sector B Flank</span>
          </div>

          <div className="h-56 w-full flex items-end justify-between gap-3 pt-6 pb-2 px-2">
            {[
              { day: 'Mon', count: 18, threats: 2 },
              { day: 'Tue', count: 24, threats: 3 },
              { day: 'Wed', count: 14, threats: 1 },
              { day: 'Thu', count: 32, threats: 4 },
              { day: 'Fri', count: 29, threats: 2 },
              { day: 'Sat', count: 42, threats: 6 },
              { day: 'Sun', count: 38, threats: 5 },
            ].map((item, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex items-end justify-center h-40">
                  <div
                    style={{ height: `${(item.count / 50) * 100}%` }}
                    className="w-full max-w-[36px] bg-slate-800 hover:bg-cyan-900 border border-slate-700 rounded-t flex flex-col justify-end overflow-hidden transition"
                  >
                    <div
                      style={{ height: `${(item.threats / item.count) * 100}%` }}
                      className="w-full bg-red-600"
                    />
                  </div>
                </div>
                <div className="text-center font-mono">
                  <div className="text-xs text-white font-bold">{item.day}</div>
                  <div className="text-[9px] text-red-400 font-bold">{item.threats} threats</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tactical Dossier Document Preview */}
        <div className="lg:col-span-5 bg-[#080d16] rounded-lg border border-slate-700 p-4 space-y-3 font-mono text-xs shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-700 pb-2">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-white uppercase text-[11px]">
                Incident Audit Dossier [PREVIEW]
              </span>
            </div>
            <Printer className="w-3.5 h-3.5 text-slate-400" />
          </div>

          <div className="p-3 bg-slate-950 rounded border border-slate-800 text-[11px] text-slate-300 space-y-2 leading-relaxed">
            <div className="text-center font-bold text-white border-b border-slate-800 pb-1">
              HEADQUARTERS BORDER SECURITY CORPS
              <div className="text-[9px] text-cyan-400">INTELLIGENT SURVEILLANCE WING — IBVAP</div>
            </div>

            <div className="text-[10px] text-slate-400">
              DOCUMENT REF: <span className="text-white">BSF-IBVAP-2026-0907-A4</span>
              <br />
              SECTOR: <span className="text-white">Sector A / Sector B Restricted Buffer</span>
              <br />
              CLASSIFICATION: <span className="text-red-400 font-bold">TOP SECRET // DEFENSE ONLY</span>
            </div>

            <p className="text-[10px] text-slate-300">
              On 07-Sep-2026 at 23:08:14 IST, IBVAP AI Engine flagged a confirmed incursion on CAM-04 (Restricted Zone 01 Fence Line). Multi-camera re-identification traced subject UID P-1042 across CAM-02 $\rightarrow$ CAM-03 $\rightarrow$ CAM-05.
            </p>

            <div className="bg-slate-900 p-2 rounded text-[10px] text-slate-300 space-y-1">
              <div>• Threat Score: <b>94 / 100 (Critical)</b></div>
              <div>• Ray-casting Polygon Breach: <b>Verified</b></div>
              <div>• False Alarm Suppression Factor: <b>Animal / Noise excluded</b></div>
              <div>• Interception: <b>QRT Alpha unit assigned</b></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

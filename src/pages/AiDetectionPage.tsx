import React, { useState } from 'react';
import { useSurveillance } from '../context/SurveillanceContext';
import { DetectionType, ThreatLevel } from '../types/surveillance';
import {
  ScanEye,
  User,
  Car,
  Smile,
  CreditCard,
  AlertTriangle,
  Activity,
  Filter,
  Search,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

export const AiDetectionPage: React.FC = () => {
  const { cameras } = useSurveillance();

  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [threatFilter, setThreatFilter] = useState<string>('ALL');
  const [cameraFilter, setCameraFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Collect detections from all cameras and add rich history
  const allDetections = [
    {
      id: 'HIST-101',
      type: 'FENCE_BREACH' as DetectionType,
      label: 'VIRTUAL FENCE BREACH // CRITICAL',
      confidence: 0.97,
      targetId: 'P-1042',
      plateNumber: undefined,
      timestamp: '23:08:14',
      cameraId: 'CAM-04',
      cameraName: 'Restricted Zone 01 Fence Line',
      threatLevel: 'CRITICAL' as ThreatLevel,
      behavior: 'Active physical fence scaling',
    },
    {
      id: 'HIST-102',
      type: 'PERSON' as DetectionType,
      label: 'PERSON [INTRUDER]',
      confidence: 0.97,
      targetId: 'P-1042',
      plateNumber: undefined,
      timestamp: '23:08:14',
      cameraId: 'CAM-04',
      cameraName: 'Restricted Zone 01 Fence Line',
      threatLevel: 'CRITICAL' as ThreatLevel,
      behavior: 'Dark tactical clothing, rapid evasion',
    },
    {
      id: 'HIST-103',
      type: 'SUSPICIOUS_ACTIVITY' as DetectionType,
      label: 'SUSPICIOUS ACTIVITY // LOITERING',
      confidence: 0.92,
      targetId: 'P-1088',
      plateNumber: undefined,
      timestamp: '23:07:29',
      cameraId: 'CAM-06',
      cameraName: 'Border Post Bravo Outpost',
      threatLevel: 'HIGH' as ThreatLevel,
      behavior: 'Stationary dwell time > 04:30 near culvert',
    },
    {
      id: 'HIST-104',
      type: 'VEHICLE' as DetectionType,
      label: 'VEHICLE // SUV',
      confidence: 0.94,
      targetId: 'V-409',
      plateNumber: 'PB-08-AB-4190',
      timestamp: '23:05:12',
      cameraId: 'CAM-02',
      cameraName: 'Border Post Alpha Checkpoint',
      threatLevel: 'LOW' as ThreatLevel,
      behavior: 'Normal transit through barrier gate',
    },
    {
      id: 'HIST-105',
      type: 'LICENSE_PLATE' as DetectionType,
      label: 'ANPR // PB-08-AB-4190',
      confidence: 0.96,
      targetId: 'V-409',
      plateNumber: 'PB-08-AB-4190',
      timestamp: '23:05:12',
      cameraId: 'CAM-02',
      cameraName: 'Border Post Alpha Checkpoint',
      threatLevel: 'LOW' as ThreatLevel,
      behavior: 'Matched military convoy whitelist',
    },
    {
      id: 'HIST-106',
      type: 'PERSON' as DetectionType,
      label: 'PERSON // PATROL',
      confidence: 0.98,
      targetId: 'PATROL-04',
      plateNumber: undefined,
      timestamp: '23:00:10',
      cameraId: 'CAM-01',
      cameraName: 'Sector A-01 Perimeter Watch',
      threatLevel: 'LOW' as ThreatLevel,
      behavior: 'Scheduled BSF perimeter foot patrol',
    },
    {
      id: 'HIST-107',
      type: 'FACE' as DetectionType,
      label: 'FACE MATCH // DRIVER',
      confidence: 0.89,
      targetId: 'D-882',
      plateNumber: undefined,
      timestamp: '22:55:04',
      cameraId: 'CAM-02',
      cameraName: 'Border Post Alpha Checkpoint',
      threatLevel: 'LOW' as ThreatLevel,
      behavior: 'Driver face verified against transport manifest',
    },
    {
      id: 'HIST-108',
      type: 'PERSON' as DetectionType,
      label: 'PERSON // SPRINTING',
      confidence: 0.95,
      targetId: 'P-1042',
      plateNumber: undefined,
      timestamp: '22:49:50',
      cameraId: 'CAM-05',
      cameraName: 'Sector B-04 Scrubland Approach',
      threatLevel: 'HIGH' as ThreatLevel,
      behavior: 'Evasive zigzag movement between bushes',
    },
    {
      id: 'HIST-109',
      type: 'PERSON' as DetectionType,
      label: 'PERSON // TRANSIT',
      confidence: 0.94,
      targetId: 'P-1042',
      plateNumber: undefined,
      timestamp: '22:44:19',
      cameraId: 'CAM-03',
      cameraName: 'Sector A-02 Transit Corridor',
      threatLevel: 'MEDIUM' as ThreatLevel,
      behavior: 'Moving rapidly along outer wire perimeter',
    },
    {
      id: 'HIST-110',
      type: 'ANIMAL_FILTERED' as DetectionType,
      label: 'ANIMAL // GRAZING (FILTERED)',
      confidence: 0.89,
      targetId: undefined,
      plateNumber: undefined,
      timestamp: '22:38:00',
      cameraId: 'CAM-01',
      cameraName: 'Sector A-01 Perimeter Watch',
      threatLevel: 'LOW' as ThreatLevel,
      behavior: 'Wild nilgai herd; suppressed from alarm queue',
    },
  ];

  const filtered = allDetections.filter((d) => {
    if (typeFilter !== 'ALL' && d.type !== typeFilter) return false;
    if (threatFilter !== 'ALL' && d.threatLevel !== threatFilter) return false;
    if (cameraFilter !== 'ALL' && d.cameraId !== cameraFilter) return false;
    if (
      searchQuery &&
      !d.label.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !d.cameraId.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !(d.targetId && d.targetId.toLowerCase().includes(searchQuery.toLowerCase()))
    ) {
      return false;
    }
    return true;
  });

  const CATEGORY_COUNTS = [
    { type: 'PERSON', count: 127, icon: User, color: 'text-cyan-400', bg: 'bg-cyan-950/40 border-cyan-800' },
    { type: 'VEHICLE', count: 34, icon: Car, color: 'text-blue-400', bg: 'bg-blue-950/40 border-blue-800' },
    { type: 'FACE', count: 28, icon: Smile, color: 'text-emerald-400', bg: 'bg-emerald-950/40 border-emerald-800' },
    { type: 'LICENSE_PLATE', count: 31, icon: CreditCard, color: 'text-purple-400', bg: 'bg-purple-950/40 border-purple-800' },
    { type: 'FENCE_BREACH', count: 5, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-950/40 border-red-800' },
    { type: 'SUSPICIOUS_ACTIVITY', count: 12, icon: Activity, color: 'text-amber-400', bg: 'bg-amber-950/40 border-amber-800' },
  ];

  return (
    <div className="p-4 space-y-4 max-w-[1920px] mx-auto">
      {/* Category Summary Header */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {CATEGORY_COUNTS.map((cat) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.type}
              onClick={() => setTypeFilter(typeFilter === cat.type ? 'ALL' : cat.type)}
              className={`rounded-lg border p-3 cursor-pointer transition ${cat.bg} ${
                typeFilter === cat.type ? 'ring-2 ring-cyan-400' : 'hover:opacity-90'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-slate-300 font-bold">
                  {cat.type.replace('_', ' ')}
                </span>
                <Icon className={`w-4 h-4 ${cat.color}`} />
              </div>
              <div className={`text-xl font-extrabold font-mono mt-1 ${cat.color}`}>
                {cat.count}
              </div>
              <div className="text-[9px] text-slate-400 font-mono mt-0.5">
                Past 24 Hours
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics Visuals Strip */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Hourly Activity Bar Chart */}
        <div className="lg:col-span-8 bg-[#0b121e] rounded-lg border border-slate-800 p-4">
          <div className="flex items-center justify-between mb-3 border-b border-slate-800/80 pb-2">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Detection Frequency & Activity Breakdown (24h)
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              Peak: 22:00 - 02:00 (Night Buffer)
            </span>
          </div>

          {/* SVG Hourly Activity Graph */}
          <div className="h-44 w-full flex items-end justify-between gap-1.5 pt-4 pb-2 px-2">
            {[
              { hour: '18:00', total: 12, threat: 0 },
              { hour: '19:00', total: 16, threat: 1 },
              { hour: '20:00', total: 22, threat: 2 },
              { hour: '21:00', total: 35, threat: 3 },
              { hour: '22:00', total: 48, threat: 8 },
              { hour: '23:00', total: 64, threat: 14 },
              { hour: '00:00', total: 52, threat: 9 },
              { hour: '01:00', total: 38, threat: 4 },
              { hour: '02:00', total: 24, threat: 2 },
              { hour: '03:00', total: 18, threat: 1 },
              { hour: '04:00', total: 14, threat: 0 },
              { hour: '05:00', total: 19, threat: 1 },
            ].map((item, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                <div className="w-full flex flex-col items-center justify-end h-32 relative">
                  {/* Total height bar */}
                  <div
                    style={{ height: `${(item.total / 70) * 100}%` }}
                    className="w-full max-w-[28px] bg-cyan-950 group-hover:bg-cyan-900 rounded-t border border-cyan-700/60 relative flex flex-col justify-end overflow-hidden transition-all"
                  >
                    {/* Critical threat proportion */}
                    {item.threat > 0 && (
                      <div
                        style={{ height: `${(item.threat / item.total) * 100}%` }}
                        className="w-full bg-red-600 animate-pulse"
                        title={`${item.threat} Threat Detections`}
                      />
                    )}
                  </div>
                  {/* Tooltip on hover */}
                  <div className="absolute -top-7 opacity-0 group-hover:opacity-100 bg-slate-900 border border-slate-700 px-1.5 py-0.5 rounded text-[9px] font-mono text-cyan-300 pointer-events-none transition shadow-lg whitespace-nowrap z-20">
                    {item.total} events ({item.threat} threats)
                  </div>
                </div>
                <span className="text-[9px] font-mono text-slate-400">{item.hour}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-6 mt-2 pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-cyan-800 border border-cyan-600" />
              <span>Normal Detections (Patrols, Vehicles)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-red-600" />
              <span>High / Critical Alerts (Fence Breaches, Loitering)</span>
            </div>
          </div>
        </div>

        {/* Threat Distribution & Camera-wise Breakdown */}
        <div className="lg:col-span-4 bg-[#0b121e] rounded-lg border border-slate-800 p-4 space-y-3">
          <div className="text-xs font-mono font-bold text-white uppercase tracking-wider border-b border-slate-800/80 pb-2 flex items-center justify-between">
            <span>Camera-Wise Load</span>
            <span className="text-cyan-400">Top 4 Hotspots</span>
          </div>

          <div className="space-y-2.5">
            {[
              { id: 'CAM-04', name: 'Restricted Zone 01', breaches: 4, pct: 88, color: 'bg-red-500' },
              { id: 'CAM-02', name: 'Border Post Alpha Gate', breaches: 1, pct: 72, color: 'bg-cyan-500' },
              { id: 'CAM-06', name: 'Border Post Bravo Outpost', breaches: 2, pct: 60, color: 'bg-amber-500' },
              { id: 'CAM-01', name: 'Sector A-01 Perimeter', breaches: 0, pct: 45, color: 'bg-emerald-500' },
            ].map((c) => (
              <div key={c.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-200 font-bold">{c.id}</span>
                  <span className="text-[10px] text-slate-400">{c.name}</span>
                  <span className="text-slate-300 font-bold">{c.pct}% Load</span>
                </div>
                <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                  <div className={`h-full ${c.color}`} style={{ width: `${c.pct}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="p-2.5 rounded bg-slate-950 border border-slate-800/80 text-xs font-mono space-y-1">
            <div className="text-slate-400 text-[10px] uppercase font-bold">
              False Alarm Reduction Rate
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-lg font-bold text-emerald-400">91.4%</span>
              <span className="text-[10px] text-slate-500">42 False Triggers Filtered</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-[#0b121e] rounded-lg border border-slate-800 p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[260px]">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search Target UID (e.g. P-1042), Plate (PB-08), or Camera..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 pl-9 text-xs text-white font-mono outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-300 font-mono outline-none"
          >
            <option value="ALL">All Categories</option>
            <option value="PERSON">Person</option>
            <option value="VEHICLE">Vehicle</option>
            <option value="FACE">Face</option>
            <option value="LICENSE_PLATE">License Plate (ANPR)</option>
            <option value="FENCE_BREACH">Fence Breach</option>
            <option value="SUSPICIOUS_ACTIVITY">Suspicious Activity</option>
          </select>

          <select
            value={threatFilter}
            onChange={(e) => setThreatFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-300 font-mono outline-none"
          >
            <option value="ALL">All Threat Levels</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          <select
            value={cameraFilter}
            onChange={(e) => setCameraFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-300 font-mono outline-none"
          >
            <option value="ALL">All Cameras</option>
            {cameras.map((c) => (
              <option key={c.id} value={c.id}>
                {c.id} - {c.name.split(' ')[0]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Detection Incident Table */}
      <div className="bg-[#0b121e] rounded-lg border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-4">Event ID & Time</th>
                <th className="py-2.5 px-4">Classification</th>
                <th className="py-2.5 px-4">Camera & Location</th>
                <th className="py-2.5 px-4">Target / Plate UID</th>
                <th className="py-2.5 px-4">AI Confidence</th>
                <th className="py-2.5 px-4">Threat Level</th>
                <th className="py-2.5 px-4">Behavioral Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-900/50 transition">
                  <td className="py-2.5 px-4">
                    <div className="font-bold text-white">{item.id}</div>
                    <div className="text-[10px] text-slate-500">{item.timestamp}</div>
                  </td>

                  <td className="py-2.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.type === 'FENCE_BREACH'
                          ? 'bg-red-950 text-red-300 border border-red-800'
                          : item.type === 'SUSPICIOUS_ACTIVITY'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : item.type === 'ANIMAL_FILTERED'
                          ? 'bg-slate-800 text-slate-400 border border-slate-700'
                          : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                      }`}
                    >
                      {item.type.replace('_', ' ')}
                    </span>
                  </td>

                  <td className="py-2.5 px-4">
                    <div className="font-bold text-cyan-400">{item.cameraId}</div>
                    <div className="text-[10px] text-slate-400 truncate max-w-[180px]">
                      {item.cameraName}
                    </div>
                  </td>

                  <td className="py-2.5 px-4">
                    {item.plateNumber ? (
                      <span className="px-1.5 py-0.5 rounded bg-slate-950 border border-yellow-500/60 text-yellow-300 font-bold text-[10px]">
                        {item.plateNumber}
                      </span>
                    ) : item.targetId ? (
                      <span className="font-bold text-white bg-slate-800 px-1.5 py-0.5 rounded">
                        {item.targetId}
                      </span>
                    ) : (
                      <span className="text-slate-600">—</span>
                    )}
                  </td>

                  <td className="py-2.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">
                        {(item.confidence * 100).toFixed(1)}%
                      </span>
                      <div className="w-12 h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-cyan-400"
                          style={{ width: `${item.confidence * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  <td className="py-2.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.threatLevel === 'CRITICAL'
                          ? 'bg-red-600 text-white'
                          : item.threatLevel === 'HIGH'
                          ? 'bg-amber-600 text-slate-950'
                          : item.threatLevel === 'MEDIUM'
                          ? 'bg-yellow-950 text-yellow-300 border border-yellow-800'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}
                    >
                      {item.threatLevel}
                    </span>
                  </td>

                  <td className="py-2.5 px-4 text-[11px] text-slate-300">
                    {item.behavior || 'Nominal tracking parameters'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useSurveillance } from '../context/SurveillanceContext';
import { Camera, CameraStatus } from '../types/surveillance';
import {
  Cctv,
  Plus,
  Radio,
  Cpu,
  Activity,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ExternalLink,
  Sliders,
  Search,
} from 'lucide-react';

export const CameraManagementPage: React.FC = () => {
  const { cameras, updateCameraStatus, addMockCamera, setSelectedCameraId } = useSurveillance();

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newRtspUrl, setNewRtspUrl] = useState<string>('rtsp://192.168.10.35:554/ch0/main');
  const [newCamName, setNewCamName] = useState<string>('Sector E Forward Patrol Post');
  const [newSector, setNewSector] = useState<string>('Sector E Sand Dunes');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleAddCamera = (e: React.FormEvent) => {
    e.preventDefault();
    addMockCamera({
      name: newCamName,
      sector: newSector,
      rtspUrl: newRtspUrl,
      ip: newRtspUrl.replace('rtsp://', '').split(':')[0],
      status: 'ONLINE',
      resolution: '1920x1080 (FHD)',
      zoneType: 'BORDER_PERIMETER',
    });
    setShowAddModal(false);
  };

  const filteredCameras = cameras.filter(
    (c) =>
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.sector.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 space-y-4 max-w-[1920px] mx-auto">
      {/* Header Banner */}
      <div className="bg-[#0b121e] rounded-lg border border-slate-800 p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-cyan-400">
            <Cctv className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold text-white font-mono uppercase tracking-wider">
                Edge Camera Network & RTSP Ingestion Gateway
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700">
                HARDWARE AGNOSTIC
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Integrates with existing legacy and modern ONVIF / RTSP CCTV camera hardware via Jetson Edge inference.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-2 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold transition flex items-center gap-2 shadow-lg shadow-cyan-950/40"
        >
          <Plus className="w-4 h-4" />
          <span>ONBOARD EXISTING RTSP STREAM</span>
        </button>
      </div>

      {/* Network Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-[#0b121e] border border-slate-800 rounded-lg p-3">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Registered Endpoints</div>
          <div className="text-2xl font-bold font-mono text-white mt-1">{cameras.length} Cameras</div>
          <div className="text-[10px] font-mono text-emerald-400 mt-1">11 Online, 1 Degraded</div>
        </div>
        <div className="bg-[#0b121e] border border-slate-800 rounded-lg p-3">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Avg Frame Ingestion</div>
          <div className="text-2xl font-bold font-mono text-cyan-400 mt-1">29.8 FPS</div>
          <div className="text-[10px] font-mono text-slate-400 mt-1">Zero dropped packets</div>
        </div>
        <div className="bg-[#0b121e] border border-slate-800 rounded-lg p-3">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Cluster Edge Nodes</div>
          <div className="text-2xl font-bold font-mono text-purple-400 mt-1">12 Jetson Units</div>
          <div className="text-[10px] font-mono text-slate-400 mt-1">Avg Load: 58% | Temp: 46°C</div>
        </div>
        <div className="bg-[#0b121e] border border-slate-800 rounded-lg p-3">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Aggregated Bandwidth</div>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-1">54.2 Mbps</div>
          <div className="text-[10px] font-mono text-slate-400 mt-1">H.265 Hardware Compressed</div>
        </div>
      </div>

      {/* Search and Table */}
      <div className="bg-[#0b121e] rounded-lg border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-3 border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search camera ID or sector..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 pl-9 text-xs text-white font-mono outline-none focus:border-cyan-500"
            />
          </div>
          <span className="text-xs font-mono text-slate-400">
            Showing {filteredCameras.length} of {cameras.length} nodes
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-4">Camera ID & Name</th>
                <th className="py-2.5 px-4">Sector Location</th>
                <th className="py-2.5 px-4">RTSP Endpoint (IP)</th>
                <th className="py-2.5 px-4">FPS & Resolution</th>
                <th className="py-2.5 px-4">Edge Processor Node</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredCameras.map((cam) => (
                <tr key={cam.id} className="hover:bg-slate-900/50 transition">
                  <td className="py-2.5 px-4">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <Cctv className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{cam.id}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 truncate max-w-[200px]">
                      {cam.name}
                    </div>
                  </td>

                  <td className="py-2.5 px-4 text-slate-300">
                    {cam.sector}
                  </td>

                  <td className="py-2.5 px-4">
                    <div className="text-slate-300 truncate max-w-[220px] font-mono text-[11px]">
                      {cam.rtspUrl}
                    </div>
                    <div className="text-[10px] text-slate-500">IP: {cam.ip}</div>
                  </td>

                  <td className="py-2.5 px-4">
                    <div className="text-emerald-400 font-bold">{cam.fps} FPS</div>
                    <div className="text-[10px] text-slate-400">{cam.resolution}</div>
                  </td>

                  <td className="py-2.5 px-4">
                    <div className="text-slate-200 font-bold">{cam.edgeNode}</div>
                    <div className="text-[10px] text-slate-400">
                      GPU: {cam.edgeLoad}% | {cam.edgeTemp}°C
                    </div>
                  </td>

                  <td className="py-2.5 px-4">
                    <select
                      value={cam.status}
                      onChange={(e) => updateCameraStatus(cam.id, e.target.value as CameraStatus)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border outline-none bg-slate-950 ${
                        cam.status === 'ONLINE'
                          ? 'border-emerald-500 text-emerald-400'
                          : cam.status === 'DEGRADED'
                          ? 'border-amber-500 text-amber-400'
                          : 'border-red-500 text-red-400'
                      }`}
                    >
                      <option value="ONLINE">ONLINE</option>
                      <option value="DEGRADED">DEGRADED</option>
                      <option value="OFFLINE">OFFLINE</option>
                    </select>
                  </td>

                  <td className="py-2.5 px-4">
                    <button
                      onClick={() => setSelectedCameraId(cam.id)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-[11px] transition"
                    >
                      Focus Stream
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Camera Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0b121e] border border-cyan-500/50 rounded-xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-white font-mono font-bold text-sm">
                <Cctv className="w-5 h-5 text-cyan-400" />
                <span>Onboard Existing RTSP Camera</span>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCamera} className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Camera Display Name</label>
                <input
                  type="text"
                  value={newCamName}
                  onChange={(e) => setNewCamName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Sector Deployed</label>
                <input
                  type="text"
                  value={newSector}
                  onChange={(e) => setNewSector(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">RTSP Stream URL</label>
                <input
                  type="text"
                  value={newRtspUrl}
                  onChange={(e) => setNewRtspUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-cyan-300 outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div className="p-3 bg-cyan-950/40 border border-cyan-800/60 rounded text-[11px] text-slate-300">
                Automatic edge node pairing: System will spawn a hardware accelerated DeepSORT worker pipeline on the nearest NVIDIA Jetson Orin cluster.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow-md shadow-cyan-950"
                >
                  Connect & Ingest Stream
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

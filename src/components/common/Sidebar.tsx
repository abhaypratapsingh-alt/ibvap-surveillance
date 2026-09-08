import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Video,
  ScanEye,
  Route,
  Fence,
  ShieldAlert,
  GitMerge,
  Cctv,
  FileBarChart2,
  Cpu,
  Settings,
  LogOut,
  Radio,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate }) => {
  const { user, logout } = useAuth();

  const NAV_ITEMS = [
    { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard, badge: 'LIVE' },
    { id: 'surveillance', label: 'Live Surveillance', icon: Video, count: '12 Cams' },
    { id: 'detection', label: 'AI Detection', icon: ScanEye },
    { id: 'tracking', label: 'Cross-Camera Tracking', icon: Route, highlight: true },
    { id: 'fence', label: 'Virtual Fence', icon: Fence },
    { id: 'threat', label: 'Threat Assessment', icon: ShieldAlert, badge: '94/100' },
    { id: 'workflow', label: 'Alert Workflow', icon: GitMerge },
    { id: 'cameras', label: 'Camera Management', icon: Cctv },
    { id: 'reports', label: 'Reports & Audit', icon: FileBarChart2 },
    { id: 'architecture', label: 'System Architecture', icon: Cpu },
    { id: 'settings', label: 'System Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#070c16] border-r border-slate-800/80 flex flex-col h-screen select-none shrink-0 z-20">
      {/* Top Branding Section */}
      <div className="p-4 border-b border-slate-800/60 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-600 to-blue-900 flex items-center justify-center shadow-lg shadow-cyan-950/60 border border-cyan-400/30">
          <Radio className="w-5 h-5 text-white animate-pulse" />
        </div>
        <div>
          <h1 className="text-white font-extrabold text-lg tracking-wider font-mono leading-none">
            IBVAP
          </h1>
          <p className="text-[10px] text-cyan-400 font-mono tracking-wider mt-1">
            BORDER OPS RADAR
          </p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-2.5 py-4 space-y-1 overflow-y-auto">
        <div className="px-2.5 py-1 text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">
          Tactical Operations
        </div>

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-cyan-950/70 text-cyan-300 border border-cyan-500/40 shadow-md shadow-cyan-950/40 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'
                  }`}
                />
                <span className="tracking-wide">{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                    item.badge === 'LIVE'
                      ? 'bg-red-950 text-red-400 border border-red-800 animate-pulse'
                      : 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                  }`}
                >
                  {item.badge}
                </span>
              )}

              {item.count && (
                <span className="text-[10px] font-mono text-slate-500">
                  {item.count}
                </span>
              )}

              {item.highlight && !item.badge && (
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              )}
            </button>
          );
        })}
      </nav>

      {/* User Profile & System Status Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 space-y-2.5">
        {/* System Health Metric */}
        <div className="bg-slate-900/90 border border-slate-800 rounded p-2 text-[11px] font-mono space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span>RTSP BUS:</span>
            <span className="text-emerald-400 font-bold">12/12 ACTIVE</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span>AVG LATENCY:</span>
            <span className="text-cyan-400">38 ms</span>
          </div>
        </div>

        {/* User Card */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-7 h-7 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-mono text-cyan-400 font-bold">
              {user?.role.charAt(0)}
            </div>
            <div className="truncate">
              <div className="text-xs font-medium text-slate-200 truncate">
                {user?.name || 'Operator'}
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                {user?.badge || 'BSF-4491'}
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-red-400 transition"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

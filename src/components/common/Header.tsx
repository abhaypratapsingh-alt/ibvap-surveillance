import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSurveillance } from '../../context/SurveillanceContext';
import { soundManager } from '../../utils/soundEffects';
import { UserRole } from '../../types/surveillance';
import {
  Shield,
  Clock,
  Activity,
  Bell,
  Volume2,
  VolumeX,
  PlayCircle,
  Radio,
  UserCheck,
  ChevronDown,
  Check,
  AlertTriangle,
  Cpu,
} from 'lucide-react';

interface HeaderProps {
  onNavigate?: (page: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const { user, switchRole } = useAuth();
  const {
    alerts,
    kpis,
    demoModeActive,
    startDemo,
    acknowledgeAlert,
    trackTargetFromAlert,
  } = useSurveillance();

  const [timeUtc, setTimeUtc] = useState<string>('');
  const [timeIst, setTimeIst] = useState<string>('');
  const [isMuted, setIsMuted] = useState<boolean>(soundManager.getMuted());
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [showRoleMenu, setShowRoleMenu] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeUtc(now.toUTCString().slice(17, 25) + ' UTC');
      setTimeIst(now.toLocaleTimeString('en-IN', { hour12: false }) + ' IST');
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundManager.setMuted(next);
  };

  const unreadAlerts = alerts.filter((a) => !a.acknowledged);

  return (
    <header className="bg-[#080d17] border-b border-slate-800/80 px-4 py-2.5 flex items-center justify-between z-30 sticky top-0">
      {/* Left: Branding & SIH Badge */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-cyan-950 border border-cyan-500/60 flex items-center justify-center shadow-lg shadow-cyan-950/40">
            <Shield className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-wider text-white font-mono">
                IBVAP
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-cyan-950/90 text-cyan-300 border border-cyan-700/50">
                SIH 2026 PROTOTYPE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Intelligent Border Video Analytics Platform
            </p>
          </div>
        </div>

        {/* Live DEFCON / Threat Status Indicator */}
        <div className="hidden lg:flex items-center gap-2 ml-4 px-2.5 py-1 rounded bg-slate-900/90 border border-slate-700 text-xs">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </span>
          <span className="text-slate-400 font-mono text-[11px]">DEFCON:</span>
          <span className="text-red-400 font-bold font-mono text-[11px]">ALERT 2 (ACTIVE THREATS)</span>
        </div>
      </div>

      {/* Right Controls & Telemetry */}
      <div className="flex items-center gap-3">
        {/* Synchronized Clocks */}
        <div className="hidden md:flex items-center gap-3 px-3 py-1 rounded bg-slate-900/70 border border-slate-800 text-xs font-mono text-slate-300">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>{timeIst}</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">{timeUtc}</span>
        </div>

        {/* Edge Processing Cluster Health */}
        <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded bg-emerald-950/30 border border-emerald-800/40 text-xs font-mono text-emerald-400">
          <Cpu className="w-3.5 h-3.5" />
          <span>JETSON EDGE: 12/12 ONLINE</span>
        </div>

        {/* Prominent Demo Mode Launcher */}
        {!demoModeActive && (
          <button
            onClick={startDemo}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold font-mono tracking-wide shadow-lg shadow-cyan-900/30 border border-cyan-400/40 transition active:scale-95"
          >
            <PlayCircle className="w-4 h-4" />
            <span>DEMO MODE</span>
          </button>
        )}

        {/* Tactical Sound Toggle */}
        <button
          onClick={toggleSound}
          className={`p-1.5 rounded border transition ${
            isMuted
              ? 'bg-slate-900 border-slate-700 text-slate-500'
              : 'bg-cyan-950/60 border-cyan-700/60 text-cyan-400'
          }`}
          title={isMuted ? 'Unmute tactical audio' : 'Mute tactical audio'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Notification Bell with Badge & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-1.5 rounded bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-300 relative transition"
          >
            <Bell className="w-4 h-4" />
            {unreadAlerts.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
                {unreadAlerts.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl p-3 z-50">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Live Incident Notifications ({unreadAlerts.length})
                </span>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Close
                </button>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {alerts.slice(0, 5).map((al) => (
                  <div
                    key={al.id}
                    className={`p-2.5 rounded border text-xs ${
                      al.level === 'CRITICAL'
                        ? 'bg-red-950/40 border-red-800/60'
                        : al.level === 'WARNING'
                        ? 'bg-amber-950/40 border-amber-800/60'
                        : 'bg-slate-800/60 border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`font-mono font-bold text-[10px] px-1.5 py-0.5 rounded ${
                          al.level === 'CRITICAL'
                            ? 'bg-red-900 text-red-200'
                            : al.level === 'WARNING'
                            ? 'bg-amber-900 text-amber-200'
                            : 'bg-slate-700 text-slate-300'
                        }`}
                      >
                        {al.level}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {al.timestamp}
                      </span>
                    </div>
                    <div className="font-semibold text-slate-200 mb-0.5">
                      {al.title}
                    </div>
                    <div className="text-slate-400 text-[11px] mb-2">
                      {al.cameraName} ({al.cameraId})
                    </div>
                    <div className="flex items-center gap-2">
                      {!al.acknowledged && (
                        <button
                          onClick={() => acknowledgeAlert(al.id)}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-cyan-300 border border-slate-700 transition"
                        >
                          Acknowledge
                        </button>
                      )}
                      {al.targetId && (
                        <button
                          onClick={() => {
                            trackTargetFromAlert(al.targetId!, al.cameraId);
                            if (onNavigate) onNavigate('tracking');
                            setShowNotifications(false);
                          }}
                          className="px-2 py-1 rounded bg-cyan-950 hover:bg-cyan-900 text-[11px] text-cyan-400 border border-cyan-800 transition"
                        >
                          Track Target
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-2 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs transition"
          >
            <div className="w-2 h-2 rounded-full bg-cyan-400" />
            <div className="text-left hidden sm:block">
              <div className="text-white font-semibold text-[11px] leading-tight">
                {user?.name || 'Operator'}
              </div>
              <div className="text-[10px] text-cyan-400 font-mono leading-tight">
                {user?.role || 'ADMIN'}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl p-2 z-50 text-xs">
              <div className="px-2 py-1.5 text-[10px] uppercase font-mono text-slate-400 border-b border-slate-800">
                Switch Tactical Role
              </div>
              {(['GUARD', 'ADMIN', 'RESPONSE_TEAM'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    switchRole(r);
                    setShowRoleMenu(false);
                  }}
                  className={`w-full text-left px-2 py-2 rounded flex items-center justify-between hover:bg-slate-800 transition ${
                    user?.role === r ? 'text-cyan-400 font-bold bg-cyan-950/30' : 'text-slate-300'
                  }`}
                >
                  <div>
                    <div>{r === 'GUARD' ? 'Guard / Operator' : r === 'ADMIN' ? 'Command Admin' : 'Response Team (QRT)'}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{r}</div>
                  </div>
                  {user?.role === r && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

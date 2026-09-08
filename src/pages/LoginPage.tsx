import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types/surveillance';
import { Shield, Lock, User, KeyRound, Radio, CheckCircle, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState<string>('Commander Vikram');
  const [password, setPassword] = useState<string>('••••••••••••');
  const [role, setRole] = useState<UserRole>('ADMIN');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(role, username);
  };

  return (
    <div className="min-h-screen w-full bg-[#050912] text-slate-200 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Tactical Grid & Radar Sweep */}
      <div className="absolute inset-0 hud-grid opacity-20 pointer-events-none" />
      <div className="absolute w-[800px] h-[800px] rounded-full border border-cyan-500/10 pointer-events-none" />
      <div className="absolute w-[500px] h-[500px] rounded-full border border-cyan-500/15 pointer-events-none" />
      <div className="absolute w-[260px] h-[260px] rounded-full border border-cyan-500/20 pointer-events-none" />

      {/* Main Authentication Card */}
      <div className="w-full max-w-md bg-[#0a1120]/90 backdrop-blur-md border border-cyan-500/30 rounded-xl p-8 shadow-2xl shadow-cyan-950/50 relative z-10">
        {/* Top Emblem */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-800 mx-auto flex items-center justify-center border border-cyan-400/40 shadow-lg shadow-cyan-900/50 mb-3">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-wider font-mono">
            IBVAP
          </h1>
          <p className="text-xs text-cyan-400 font-mono tracking-widest mt-1 uppercase">
            Intelligent Border Video Analytics Platform
          </p>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900/90 border border-slate-700 text-[11px] text-slate-300 font-mono mt-3">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>Secure Command Access // SIH 2026</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
              Operator Username / Service ID
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-500 rounded px-3 py-2 pl-9 text-sm text-white font-mono outline-none transition"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
              Security Token / Passcode
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-500 rounded px-3 py-2 pl-9 text-sm text-white font-mono outline-none transition"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
              Assigned Operational Role
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { id: 'GUARD', label: 'Guard / Operator' },
                  { id: 'ADMIN', label: 'Command Admin' },
                  { id: 'RESPONSE_TEAM', label: 'Response Team' },
                ] as const
              ).map((r) => (
                <button
                  type="button"
                  key={r.id}
                  onClick={() => setRole(r.id)}
                  className={`py-2 px-1 text-center rounded border text-xs font-mono transition ${
                    role === r.id
                      ? 'bg-cyan-950 border-cyan-500 text-cyan-300 font-bold shadow-sm shadow-cyan-950'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-4 py-2.5 rounded bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono text-sm font-bold tracking-wider shadow-lg shadow-cyan-900/40 border border-cyan-400/40 transition active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4" />
            <span>SECURE LOGIN</span>
          </button>
        </form>

        {/* Quick Demo Credentials Preset */}
        <div className="mt-6 pt-4 border-t border-slate-800/80">
          <div className="text-[11px] font-mono text-slate-500 text-center uppercase tracking-wider mb-2">
            Quick Demo Access (One-Click)
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => login('ADMIN', 'Cmdr. Vikram Malhotra')}
              className="flex-1 py-1 px-2 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[11px] font-mono text-cyan-400 transition text-center"
            >
              Admin HQ
            </button>
            <button
              onClick={() => login('GUARD', 'Havildar R. Sharma')}
              className="flex-1 py-1 px-2 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[11px] font-mono text-slate-300 transition text-center"
            >
              Guard Op
            </button>
            <button
              onClick={() => login('RESPONSE_TEAM', 'Capt. Arjan Singh')}
              className="flex-1 py-1 px-2 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[11px] font-mono text-amber-400 transition text-center"
            >
              QRT Unit
            </button>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="mt-4 text-center text-[10px] text-slate-500 font-mono">
          CONFIDENTIAL // AUTHORIZED BORDER SURVEILLANCE ACCESS ONLY
        </div>
      </div>
    </div>
  );
};

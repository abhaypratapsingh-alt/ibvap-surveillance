import React, { createContext, useContext, useState } from 'react';
import { UserRole } from '../types/surveillance';

interface AuthUser {
  id: string;
  name: string;
  badge: string;
  role: UserRole;
  rank: string;
  sectorAssigned: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (role: UserRole, username?: string) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const ROLE_PRESETS: Record<UserRole, { name: string; badge: string; rank: string; sectorAssigned: string }> = {
  GUARD: {
    name: 'Havildar R. Sharma',
    badge: 'BSF-OP-4491',
    rank: 'Sector Surveillance Operator',
    sectorAssigned: 'Sector A-01 / A-02 Outer Perimeter',
  },
  ADMIN: {
    name: 'Cmdr. Vikram Malhotra',
    badge: 'HQ-CMD-009',
    rank: 'Border Operations Commander',
    sectorAssigned: 'Western Command Border HQ',
  },
  RESPONSE_TEAM: {
    name: 'Capt. Arjan Singh',
    badge: 'QRT-LEAD-702',
    rank: 'Quick Reaction Team Alpha Commander',
    sectorAssigned: 'Tactical Deployment Unit Bravo',
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>({
    id: 'USR-CMD-01',
    role: 'ADMIN',
    ...ROLE_PRESETS.ADMIN,
  });

  const login = (role: UserRole, username?: string) => {
    const preset = ROLE_PRESETS[role];
    setUser({
      id: `USR-${role}-${Date.now().toString().slice(-4)}`,
      role,
      name: username || preset.name,
      badge: preset.badge,
      rank: preset.rank,
      sectorAssigned: preset.sectorAssigned,
    });
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (role: UserRole) => {
    if (!user) return;
    const preset = ROLE_PRESETS[role];
    setUser({
      ...user,
      role,
      name: preset.name,
      badge: preset.badge,
      rank: preset.rank,
      sectorAssigned: preset.sectorAssigned,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

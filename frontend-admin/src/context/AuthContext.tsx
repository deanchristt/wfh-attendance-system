import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { AuthUser } from '../types';
import { login as loginApi } from '../api/auth';

interface AuthContextValue {
  user: AuthUser | null;
  login: (companyEmail: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function loadStoredUser(): AuthUser | null {
  const raw = localStorage.getItem('dexa_admin_user');
  return raw ? (JSON.parse(raw) as AuthUser) : null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(loadStoredUser());

  const login = async (companyEmail: string, password: string) => {
    const result = await loginApi(companyEmail, password);
    if (result.role !== 'ADMIN') {
      throw new Error('Akun ini bukan akun HRD Admin');
    }
    localStorage.setItem('dexa_admin_token', result.accessToken);
    localStorage.setItem('dexa_admin_user', JSON.stringify(result));
    setUser(result);
  };

  const logout = () => {
    localStorage.removeItem('dexa_admin_token');
    localStorage.removeItem('dexa_admin_user');
    setUser(null);
  };

  const value = useMemo(() => ({ user, login, logout }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}

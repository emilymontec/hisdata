import { createContext, useContext, useState, ReactNode } from 'react';
import { api, setTokens } from '../services/api';

interface SessionUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface AuthState {
  user: SessionUser | null;
  mustChangePassword: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [mustChangePassword, setMustChangePassword] = useState(false);

  async function login(email: string, password: string) {
    const { data } = await api.post('/auth/login', { email, password });
    setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
    setUser(data.user);
    setMustChangePassword(data.mustChangePassword);
  }

  function logout() {
    setTokens(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, mustChangePassword, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}

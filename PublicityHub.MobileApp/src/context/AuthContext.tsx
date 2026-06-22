/**
 * AuthContext — global authentication state
 *
 * Wraps the whole app. Any screen can call useAuth() to get:
 *  - user: current logged-in user (or null)
 *  - token: JWT string (or null)
 *  - login(): stores token + user, updates state
 *  - logout(): clears storage + state
 *  - isLoading: true while restoring session on startup
 */
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { User, LoginResponse } from '../types';
import { Config } from '../constants';
import { storage } from '../utils';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (response: LoginResponse) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
  });

  // Restore session on app start
  useEffect(() => {
    (async () => {
      try {
        const token = await storage.get<string>(Config.TOKEN_KEY);
        const user = await storage.get<User>(Config.USER_KEY);
        setState({ user, token, isLoading: false });
      } catch {
        setState({ user: null, token: null, isLoading: false });
      }
    })();
  }, []);

  const login = useCallback(async (response: LoginResponse) => {
    await storage.set(Config.TOKEN_KEY, response.token);
    await storage.set(Config.USER_KEY, response.user);
    setState({ user: response.user, token: response.token, isLoading: false });
  }, []);

  const logout = useCallback(async () => {
    await storage.remove(Config.TOKEN_KEY);
    await storage.remove(Config.USER_KEY);
    setState({ user: null, token: null, isLoading: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/** Hook — use inside any component that needs auth info */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

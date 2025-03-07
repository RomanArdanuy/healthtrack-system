// packages/types/src/auth.ts
import { User } from './user';

/**
 * Platform-agnostic storage interface for auth tokens
 */
export interface AuthStorage {
  getToken: () => Promise<string | null>;
  setToken: (token: string) => Promise<void>;
  removeToken: () => Promise<void>;
}

/**
 * Platform-agnostic navigation interface for auth flows
 */
export interface AuthNavigation {
  navigateToHome: () => void;
  navigateToLogin: () => void;
}

/**
 * Auth context data and methods available through useAuth hook
 */
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  getProfile: () => Promise<void>;
}
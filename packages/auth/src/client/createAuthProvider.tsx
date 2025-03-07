import { useState, useEffect, createContext, ReactNode } from 'react';
import { createApi } from '@healthtrack/api';
import { User, AuthContextType, AuthStorage, AuthNavigation } from '@healthtrack/types';

export function createAuthContext() {
  return createContext<AuthContextType | undefined>(undefined);
}

export function createAuthProvider(
  AuthContext: React.Context<AuthContextType | undefined>,
  storage: AuthStorage,
  navigation: AuthNavigation
) {
  return ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Initialize API client
    const api = createApi(token || undefined);

    useEffect(() => {
      // Check for stored token on load
      const checkToken = async () => {
        try {
          const storedToken = await storage.getToken();
          if (storedToken) {
            setToken(storedToken);
            getProfile();
          } else {
            setLoading(false);
          }
        } catch (err) {
          console.error('Error checking token:', err);
          setLoading(false);
        }
      };

      checkToken();
    }, []);

    const login = async (email: string, password: string) => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await api.auth.login(email, password);
        
        // Store token
        await storage.setToken(response.token);
        setToken(response.token);
        setUser(response.user);
        
        // Navigate to home screen
        navigation.navigateToHome();
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error al iniciar sesión');
        console.error('Login error:', err);
      } finally {
        setLoading(false);
      }
    };

    const logout = async () => {
      try {
        setLoading(true);
        
        if (token) {
          await api.auth.logout(token);
        }
        
        // Clean up token and state
        await storage.removeToken();
        setToken(null);
        setUser(null);
        
        // Navigate to login screen
        navigation.navigateToLogin();
      } catch (err) {
        console.error('Logout error:', err);
      } finally {
        setLoading(false);
      }
    };

    const getProfile = async () => {
      try {
        setLoading(true);
        
        if (!token) return;
        
        const userData = await api.auth.getProfile(token);
        setUser(userData);
      } catch (err) {
        console.error('Get profile error:', err);
        // If error getting profile, token may have expired
        await storage.removeToken();
        setToken(null);
        setUser(null);
        setError('La sesión ha expirado, por favor inicie sesión de nuevo');
        navigation.navigateToLogin();
      } finally {
        setLoading(false);
      }
    };

    return (
      <AuthContext.Provider value={{ user, loading, error, login, logout, getProfile }}>
        {children}
      </AuthContext.Provider>
    );
  };
}
import { useState, useEffect, createContext, useContext } from 'react';
import { createApi } from '@healthtrack/api';
import { User } from '@healthtrack/api/types';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  getProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation();

  // Inicializar el cliente API
  const api = createApi(token || undefined);

  useEffect(() => {
    // Comprobar si hay un token almacenado al cargar la app
    const checkToken = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync('auth_token');
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
      
      // Guardar el token de forma segura
      await SecureStore.setItemAsync('auth_token', response.token);
      setToken(response.token);
      setUser(response.user);
      
      // Redirigir a la pantalla principal después de iniciar sesión
      navigation.navigate('Home');
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
      
      // Limpiar el token almacenado
      await SecureStore.deleteItemAsync('auth_token');
      setToken(null);
      setUser(null);
      
      // Redirigir a la pantalla de inicio de sesión
      navigation.navigate('Login');
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
      // Si hay un error al obtener el perfil, probablemente el token ha expirado
      await SecureStore.deleteItemAsync('auth_token');
      setToken(null);
      setUser(null);
      setError('La sesión ha expirado, por favor inicie sesión de nuevo');
      navigation.navigate('Login');
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
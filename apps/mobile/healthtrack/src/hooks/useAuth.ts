import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  createAuthContext, 
  createAuthProvider, 
  createUseAuth 
} from '@healthtrack/auth';
import { AuthStorage, AuthNavigation } from '@healthtrack/types';

// Implementación de almacenamiento específica para móvil usando AsyncStorage
const authStorage: AuthStorage = {
  getToken: async () => {
    try {
      return await AsyncStorage.getItem('auth_token');
    } catch (error) {
      console.error('Error reading token from AsyncStorage:', error);
      return null;
    }
  },
  
  setToken: async (token: string) => {
    try {
      await AsyncStorage.setItem('auth_token', token);
    } catch (error) {
      console.error('Error storing token in AsyncStorage:', error);
    }
  },
  
  removeToken: async () => {
    try {
      await AsyncStorage.removeItem('auth_token');
    } catch (error) {
      console.error('Error removing token from AsyncStorage:', error);
    }
  }
};

// Crear el contexto de autenticación
const AuthContext = createAuthContext();

// Crear la función para el hook useAuth
export const useAuth = createUseAuth(AuthContext);

// Crear el provider de autenticación para React Native
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // La función de navegación para React Native
  const handleNavigate = (routeName: string) => {
    // Esta función sería utilizada por el provider para navegar entre pantallas
    console.log(`Navigation requested to: ${routeName}`);
    // En un caso real, usaríamos useNavigation() pero eso requeriría un componente funcional
    // Esta lógica se manejará internamente en el AuthProvider
  };

  // Implementación de navegación específica para móvil
  const authNavigation: AuthNavigation = {
    navigateToHome: () => handleNavigate('Home'),
    navigateToLogin: () => handleNavigate('Login')
  };

  // Usar la factoría para crear el provider
  const ProviderComponent = createAuthProvider(
    AuthContext,
    authStorage,
    authNavigation
  );

  // Retornar el provider con los children
  return ProviderComponent({ children });
};
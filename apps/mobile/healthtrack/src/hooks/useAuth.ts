import React from 'react';
import * as SecureStore from 'expo-secure-store';
import { 
  createAuthContext,
  createAuthProvider,
  createUseAuth
} from '@healthtrack/auth';
import { AuthStorage, AuthNavigation } from '@healthtrack/types';
import { CommonActions, useNavigation } from '@react-navigation/native';

// Crear una instancia del contexto de autenticación
const AuthContext = createAuthContext();

// Hook para usar autenticación
export const useAuth = createUseAuth(AuthContext);

// Proveedor de autenticación para React Native
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Usamos useNavigation dentro de un componente funcional
  const navigation = useNavigation();
  
  // Implementación de navegación específica para móvil
  const mobileNavigation: AuthNavigation = {
    navigateToHome: () => {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Dashboard' }],
        })
      );
    },
    navigateToLogin: () => {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Auth' }],
        })
      );
    }
  };

  // Almacenamiento seguro para React Native usando SecureStore
  const secureStorage: AuthStorage = {
    getToken: () => SecureStore.getItemAsync('auth_token'),
    setToken: (token) => SecureStore.setItemAsync('auth_token', token),
    removeToken: () => SecureStore.deleteItemAsync('auth_token'),
  };
  
  // Creamos el proveedor de autenticación con la navegación y almacenamiento seguros
  const MobileAuthProvider = createAuthProvider(
    AuthContext, 
    secureStorage,
    mobileNavigation
  );

  // Devolvemos el provider con los children
  return <MobileAuthProvider>{children}</MobileAuthProvider>;
};
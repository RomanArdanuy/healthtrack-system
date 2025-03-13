import React from 'react';
import * as SecureStore from 'expo-secure-store';
import {  createAuthProvider } from '@healthtrack/auth'
import { AuthStorage, AuthNavigation } from '@healthtrack/types';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { AuthContext } from '../hooks/useAuth';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
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
  
  // Crear el proveedor 
  const MobileAuthProvider = createAuthProvider(
    AuthContext, 
    secureStorage,
    mobileNavigation
  );

  // Devolver el provider con los children
  return <MobileAuthProvider>{children}</MobileAuthProvider>;
};
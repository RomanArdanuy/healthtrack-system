import React from 'react';
import * as SecureStore from 'expo-secure-store';
import { 
  createApiContext, 
  createApiProvider, 
  createUseApi 
} from '@healthtrack/api';

// Crear el contexto de API
const ApiContext = createApiContext();

// Crear el hook useApi
export const useApi = createUseApi(ApiContext);

// Función para obtener el token desde SecureStore
const getToken = async () => {
  try {
    return await SecureStore.getItemAsync('auth_token');
  } catch (error) {
    console.error('Error al obtener token de SecureStore:', error);
    return null;
  }
};

// Proveedor de API para React Native
export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Usar la factoría para crear el provider con la función específica para móvil
  const MobileApiProvider = createApiProvider(ApiContext, getToken);
  
  // Devolver el provider con los children
  return <MobileApiProvider>{children}</MobileApiProvider>;
};
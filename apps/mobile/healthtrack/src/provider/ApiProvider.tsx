import React, { useState, useEffect } from 'react';
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

// Proveedor de API para React Native
export const ApiProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  
  // Cargar el token cuando el componente se monta
  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync('auth_token');
        setToken(storedToken);
      } catch (error) {
        console.error('Error al obtener token de SecureStore:', error);
      }
    };
    
    loadToken();
  }, []);
  
  // Función sincrónica que devuelve el token actual
  const getToken = () => token;
  
  // Usar la factoría para crear el provider
  const MobileApiProvider = createApiProvider(ApiContext, getToken);
  
  // Devolver el provider con los children
  return <MobileApiProvider>{children}</MobileApiProvider>;
};
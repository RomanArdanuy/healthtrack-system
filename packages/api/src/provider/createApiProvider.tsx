import React, { createContext, useContext } from 'react';
import { createApi } from '../client';

// Define el tipo para el contexto
export interface ApiContextValue {
  [key: string]: any;
}

export function createApiContext() {
  return createContext<ApiContextValue | null>(null);
}

export function createApiProvider(
  ApiContext: React.Context<ApiContextValue | null>, 
  getToken: () => string | null
) {
  return ({ children }: { children: React.ReactNode }) => {
    // Obtener el token de forma segura
    let token: string | undefined;
    
    try {
      const rawToken = getToken();
      // Convertir null a undefined para la API
      token = rawToken === null ? undefined : rawToken;
    } catch (error) {
      console.error('Error al obtener el token:', error);
      // En caso de error, simplemente continuamos sin token
      token = undefined;
    }
    
    // Crear API client con el token (o undefined si no hay token)
    const apiClient = createApi(token);
    
    // Proporcionar el cliente API a través del contexto
    return (
      <ApiContext.Provider value={apiClient}>
        {children}
      </ApiContext.Provider>
    );
  };
}

export function createUseApi(ApiContext: React.Context<ApiContextValue | null>) {
  return () => {
    const context = useContext(ApiContext);
    if (context === undefined || context === null) {
      throw new Error('useApi must be used within an ApiProvider');
    }
    return context;
  };
}
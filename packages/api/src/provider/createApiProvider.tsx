import React, { createContext, useContext, ReactNode, Context } from 'react';
import { createApi } from '../client';

// Define the type for what will be stored in the context
export interface ApiContextValue {
  auth: ReturnType<typeof createApi>['auth'];
  patients: ReturnType<typeof createApi>['patients'];
  appointments: ReturnType<typeof createApi>['appointments'];
  messages: ReturnType<typeof createApi>['messages'];
}

export function createApiContext() {
  return createContext<ApiContextValue | null>(null);
}

export function createApiProvider(
  ApiContext: Context<ApiContextValue | null>,
  getToken: () => string | null | undefined
) {
  return ({ children }: { children: ReactNode }) => {
    // Get token using the provided function
    const token = getToken();
    
    // Create API client with current token
    // The createApi function expects string | undefined, so we need to handle null
    const apiClient = createApi(token === null ? undefined : token);
    
    return (
      <ApiContext.Provider value={apiClient}>
        {children}
      </ApiContext.Provider>
    );
  };
}

export function createUseApi(ApiContext: Context<ApiContextValue | null>) {
  return () => {
    const context = useContext(ApiContext);
    if (!context) {
      throw new Error('useApi must be used within an ApiProvider');
    }
    return context;
  };
}
'use client';

import React from 'react';
import { 
  createApiContext, 
  createApiProvider, 
  createUseApi 
} from '@healthtrack/api';
import { useAuth } from '../hooks/useAuth';

// Create the context
const ApiContext = createApiContext();

// Web-specific implementation
export const ApiProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();
  
  // Create a function to get the token
  // Check if we're in the browser before accessing localStorage
  const getToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  };
  
  // Use the factory function to create the provider
  const ApiProviderComponent = createApiProvider(ApiContext, getToken);
  
  // Return the component with children - note the function call syntax
  return ApiProviderComponent({ children });
};

// Create the hook
export const useApi = createUseApi(ApiContext);
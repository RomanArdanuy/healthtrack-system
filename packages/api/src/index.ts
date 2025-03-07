// Note: This is the entry point for the API package. It exports all the necessary functions and types for the package.
// Export client creators
export { 
    createApi,
    createAuthApi,
    createPatientApi,
    createAppointmentApi,
    createMessageApi
  } from './client';
  
  // Export provider factories
  export { 
    createApiContext, 
    createApiProvider, 
    createUseApi,
    type ApiContextValue
  } from './provider/createApiProvider';
  
  // Export any utils
  // export * from './utils';
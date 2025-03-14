export const isReactNative = () => {
    try {
      return typeof navigator !== 'undefined' && navigator.product === 'ReactNative';
    } catch (e) {
      return false;
    }
  };
  
  export const getPlatformApiUrl = (customUrl?: string) => {
    if (customUrl) return customUrl;
    
    // Use environment variables if available
    if (typeof process !== 'undefined' && process.env.API_URL) {
      return process.env.API_URL;
    }
    
    // Platform-specific defaults
    return isReactNative() 
      ? 'http://192.168.1.36:3001/api' // IP address for mobile
      : 'http://localhost:3001/api';    // localhost for web
  };
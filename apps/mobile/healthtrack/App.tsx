import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '@rneui/themed';
import AppNavigator from './src/navigation/AppNavigator';
import { LogBox } from 'react-native';
import { theme } from './src/styles/theme';
import { createApi } from '@healthtrack/api';
import axios from 'axios';

// Ignorar advertencias específicas que puedan aparecer por NativeWind o React Navigation
LogBox.ignoreLogs([
  'NativeWind: style prop value contains an unknown class',
  'ViewPropTypes will be removed from React Native',
]);

export default function App() {
  useEffect(() => {
    // Test API connectivity on app startup
    const testApiConnection = async () => {
      try {
        console.log("[HealthTrack] Testing API connectivity...");
        
        // Simple health check with regular axios
        const response = await axios.get('http://192.168.1.36:3001/api/health');
        console.log("[HealthTrack] API connection successful:", response.data);
        
        // Additional test with your API client
        console.log("[HealthTrack] Testing auth API endpoint...");
        const api = createApi(undefined, 'http://192.168.1.36:3001/api');
        try {
          // This might fail with 401 if auth is required, that's expected
          await api.auth.getProfile("");
          console.log("[HealthTrack] Auth API accessible");
        } catch (authError: any) {
          // This will likely fail with unauthorized, which is normal
          if (authError.response?.status === 401) {
            console.log("[HealthTrack] Auth API accessible (got expected 401 response)");
          } else {
            console.error("[HealthTrack] Auth API error:", authError.message);
          }
        }
      } catch (error: any) {
        console.error("[HealthTrack] API connection failed:", error.message);
      }
    };

    testApiConnection();
  }, []);
  
  return (
    <SafeAreaProvider>
      <ThemeProvider theme={theme}>
        <StatusBar style="auto" />
        <AppNavigator />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
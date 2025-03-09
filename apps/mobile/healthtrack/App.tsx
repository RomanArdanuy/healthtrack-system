// apps/mobile/healthtrack/App.tsx
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation';
import { LogBox } from 'react-native';

// Ignorar advertencias específicas que puedan aparecer por NativeWind o React Navigation
LogBox.ignoreLogs([
  'NativeWind: style prop value contains an unknown class',
  'ViewPropTypes will be removed from React Native',
]);

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <AppNavigator />
    </SafeAreaProvider>
  );
}
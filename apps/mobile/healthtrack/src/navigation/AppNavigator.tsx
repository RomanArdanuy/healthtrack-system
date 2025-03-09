// apps/mobile/healthtrack/src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from '@/provider/AuthProvider';
import { ApiProvider } from '@/provider/ApiProvider';
import MainNavigator from './MainNavigator';

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <AuthProvider>
        <ApiProvider>
          <MainNavigator />
        </ApiProvider>
      </AuthProvider>
    </NavigationContainer>
  );
};

export default AppNavigator;
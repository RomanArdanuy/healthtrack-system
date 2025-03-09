import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from '../providers/AuthProvider';
import { ApiProvider } from '../providers/ApiProvider';
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

export default AppNavigator
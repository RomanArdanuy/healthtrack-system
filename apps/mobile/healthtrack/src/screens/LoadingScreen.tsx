import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { appColors } from '../styles';

const LoadingScreen = () => {
  return (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center', 
      backgroundColor: 'white' 
    }}>
      <ActivityIndicator size="large" color={appColors.primary} />
      <Text style={{ 
        marginTop: 10, 
        fontSize: 16, 
        color: appColors.primary 
      }}>
        Cargando...
      </Text>
    </View>
  );
};

export default LoadingScreen;
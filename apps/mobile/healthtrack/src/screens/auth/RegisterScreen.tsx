import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { appColors } from '../../styles';
import { Button } from '@rneui/themed';
import { componentStyles } from '../../styles';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

const RegisterScreen = ({ navigation }: Props) => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: appColors.background }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20, justifyContent: 'center' }}>
        <View style={{ marginBottom: 30, alignItems: 'center' }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: appColors.textPrimary }}>
            Registro no disponible
          </Text>
        </View>
        
        <View style={{ 
          backgroundColor: 'white', 
          borderRadius: 10, 
          padding: 20, 
          shadowColor: '#000', 
          shadowOffset: { width: 0, height: 2 }, 
          shadowOpacity: 0.1, 
          shadowRadius: 4, 
          elevation: 3, 
          marginBottom: 30 
        }}>
          <Text style={{ fontSize: 16, color: appColors.textSecondary, marginBottom: 16, lineHeight: 24 }}>
            El registro de nuevos usuarios solo puede ser realizado por un administrador del sistema.
          </Text>
          
          <Text style={{ fontSize: 16, color: appColors.textSecondary, marginBottom: 16, lineHeight: 24 }}>
            Si necesita una cuenta, por favor contacte con su administrador o centro médico.
          </Text>
        </View>
        
        <Button
          {...componentStyles.Button.base}
          {...componentStyles.Button.primary}
          title="Volver al inicio de sesión"
          onPress={() => navigation.navigate('Login')}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterScreen;
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { SafeAreaView } from 'react-native-safe-area-context';
import { appColors } from '../../styles';
import { Button } from '@rneui/themed';
import { componentStyles } from '../../styles';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const LoginScreen = ({ navigation }: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor, introduzca el correo electrónico y la contraseña');
      return;
    }

    try {
      await login(email, password);
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: appColors.background }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20, justifyContent: 'center' }}>
          <View style={{ alignItems: 'center', marginBottom: 40 }}>
            <Text style={{ fontSize: 32, fontWeight: 'bold', color: appColors.primary, marginBottom: 10 }}>
              HealthTrack
            </Text>
            <Text style={{ fontSize: 16, color: appColors.textTertiary, textAlign: 'center' }}>
              Gestión hospitalaria y monitorización remota de pacientes
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
            elevation: 3 
          }}>
            {error && (
              <Text style={{ 
                color: appColors.error, 
                marginBottom: 16, 
                padding: 10, 
                backgroundColor: appColors.error + '15', 
                borderRadius: 4, 
                fontSize: 14 
              }}>
                {error}
              </Text>
            )}

            <Text style={{ fontSize: 16, fontWeight: '500', marginBottom: 8, color: appColors.textSecondary }}>
              Correo electrónico
            </Text>
            <TextInput
              style={{ 
                height: 50, 
                borderWidth: 1, 
                borderColor: appColors.border, 
                borderRadius: 6, 
                marginBottom: 16, 
                paddingHorizontal: 12, 
                backgroundColor: appColors.background
              }}
              placeholder="nombre@ejemplo.com"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              testID="email-input"
            />

            <Text style={{ fontSize: 16, fontWeight: '500', marginBottom: 8, color: appColors.textSecondary }}>
              Contraseña
            </Text>
            <TextInput
              style={{ 
                height: 50, 
                borderWidth: 1, 
                borderColor: appColors.border, 
                borderRadius: 6, 
                marginBottom: 16, 
                paddingHorizontal: 12, 
                backgroundColor: appColors.background
              }}
              placeholder="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              testID="password-input"
            />

            <TouchableOpacity 
              style={{ alignItems: 'flex-end', marginBottom: 16 }}
              onPress={() => navigation.navigate('ForgotPassword')}
            >
              <Text style={{ color: appColors.primary, fontSize: 14 }}>
                ¿Olvidó su contraseña?
              </Text>
            </TouchableOpacity>

            <Button
              {...componentStyles.Button.base}
              {...componentStyles.Button.primary}
              title={loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              onPress={handleLogin}
              disabled={loading}
              loading={loading}
              testID="login-button"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
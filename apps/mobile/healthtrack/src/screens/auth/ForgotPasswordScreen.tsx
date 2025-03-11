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
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { appColors } from '../../styles';
import { Button } from '@rneui/themed';
import { componentStyles } from '../../styles';

type ForgotPasswordScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'ForgotPassword'>;

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();

  const handleSubmit = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Por favor, introduzca su correo electrónico');
      return;
    }

    // Validación simple de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Por favor, introduzca un correo electrónico válido');
      return;
    }

    setLoading(true);

    try {
      // Simular una llamada a la API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // En una aplicación real, aquí se haría la petición al backend
      // await api.auth.forgotPassword(email);
      
      setSubmitted(true);
    } catch (error) {
      console.error('Error al enviar correo de recuperación:', error);
      Alert.alert(
        'Error',
        'No se pudo enviar el correo de recuperación. Por favor, inténtelo de nuevo más tarde.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: appColors.background }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20 }}>
          <TouchableOpacity 
            style={{ 
              width: 40, 
              height: 40, 
              justifyContent: 'center', 
              alignItems: 'center', 
              marginBottom: 20 
            }}
            onPress={handleBackToLogin}
          >
            <Ionicons name="arrow-back" size={24} color={appColors.primary} />
          </TouchableOpacity>

          <View style={{ marginBottom: 24 }}>
            <Text style={{ fontSize: 28, fontWeight: 'bold', color: appColors.textPrimary }}>
              Recuperar contraseña
            </Text>
          </View>

          {!submitted ? (
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
              <Text style={{ fontSize: 16, color: appColors.textSecondary, marginBottom: 20, lineHeight: 24 }}>
                Introduzca su correo electrónico y le enviaremos instrucciones para restablecer su contraseña.
              </Text>

              <Text style={{ fontSize: 16, fontWeight: '500', marginBottom: 8, color: appColors.textSecondary }}>
                Correo electrónico
              </Text>
              <TextInput
                style={{ 
                  height: 50, 
                  borderWidth: 1, 
                  borderColor: appColors.border, 
                  borderRadius: 6, 
                  marginBottom: 20, 
                  paddingHorizontal: 12, 
                  backgroundColor: appColors.background 
                }}
                placeholder="nombre@ejemplo.com"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                editable={!loading}
              />

              <Button
                {...componentStyles.Button.base}
                {...componentStyles.Button.primary}
                title="Enviar instrucciones"
                onPress={handleSubmit}
                disabled={loading}
                loading={loading}
              />
            </View>
          ) : (
            <View style={{ 
              backgroundColor: 'white', 
              borderRadius: 10, 
              padding: 20, 
              shadowColor: '#000', 
              shadowOffset: { width: 0, height: 2 }, 
              shadowOpacity: 0.1, 
              shadowRadius: 4, 
              elevation: 3, 
              alignItems: 'center' 
            }}>
              <Ionicons name="checkmark-circle" size={64} color={appColors.success} />
              <Text style={{ 
                fontSize: 16, 
                color: appColors.textPrimary, 
                marginTop: 16, 
                marginBottom: 8, 
                textAlign: 'center', 
                fontWeight: '500' 
              }}>
                Se han enviado instrucciones para restablecer su contraseña a {email}.
              </Text>
              <Text style={{ 
                fontSize: 14, 
                color: appColors.textSecondary, 
                marginBottom: 24, 
                textAlign: 'center' 
              }}>
                Por favor, revise su correo electrónico y siga las instrucciones.
              </Text>
              <Button
                {...componentStyles.Button.base}
                {...componentStyles.Button.primary}
                title="Volver al inicio de sesión"
                onPress={handleBackToLogin}
                containerStyle={{ width: '100%' }}
              />
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ForgotPasswordScreen;
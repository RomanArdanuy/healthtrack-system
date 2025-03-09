import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
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
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBackToLogin}
          >
            <Ionicons name="arrow-back" size={24} color="#4F46E5" />
          </TouchableOpacity>

          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Recuperar contraseña</Text>
          </View>

          {!submitted ? (
            <View style={styles.formContainer}>
              <Text style={styles.instructionText}>
                Introduzca su correo electrónico y le enviaremos instrucciones para restablecer su contraseña.
              </Text>

              <Text style={styles.label}>Correo electrónico</Text>
              <TextInput
                style={styles.input}
                placeholder="nombre@ejemplo.com"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                editable={!loading}
              />

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.submitButtonText}>Enviar instrucciones</Text>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.successContainer}>
              <Ionicons name="checkmark-circle" size={64} color="#10B981" />
              <Text style={styles.successText}>
                Se han enviado instrucciones para restablecer su contraseña a {email}.
              </Text>
              <Text style={styles.successSubtext}>
                Por favor, revise su correo electrónico y siga las instrucciones.
              </Text>
              <TouchableOpacity
                style={styles.backToLoginButton}
                onPress={handleBackToLogin}
              >
                <Text style={styles.backToLoginText}>Volver al inicio de sesión</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    padding: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerContainer: {
    marginBottom: 24,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  instructionText: {
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 20,
    lineHeight: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#374151',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    marginBottom: 20,
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
  },
  submitButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  successContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  successText: {
    fontSize: 16,
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
  successSubtext: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 24,
    textAlign: 'center',
  },
  backToLoginButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    width: '100%',
  },
  backToLoginText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ForgotPasswordScreen;
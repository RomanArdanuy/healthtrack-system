// apps/mobile/healthtrack/src/screens/dashboard/appointments/AppointmentFormScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppointmentsStackParamList } from '../../../navigation/AppointmentsNavigator';
import { useApi } from '@/provider/ApiProvider';
import { useAuth } from '../../../hooks/useAuth';
import { AppointmentStatus } from '@healthtrack/types';
import { UserRole } from '@healthtrack/types';
import { Ionicons } from '@expo/vector-icons';
import { appColors, componentStyles } from '../../../styles';
import { Button, Input } from '@rneui/themed';

// Tipo para la ruta
type AppointmentFormRouteProp = RouteProp<AppointmentsStackParamList, 'AppointmentForm'>;

// Interfaz para los datos del formulario
interface AppointmentFormData {
  patientId: string;
  professionalId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  reason: string;
  notes: string;
}

const AppointmentFormScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AppointmentsStackParamList>>();
  const route = useRoute<AppointmentFormRouteProp>();
  const { appointmentId, patientId: routePatientId } = route.params || {};
  const api = useApi();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState<AppointmentFormData>({
    patientId: routePatientId || '',
    professionalId: user?.role === UserRole.PROFESSIONAL || user?.role === UserRole.ADMIN ? user.id : '',
    date: '',
    startTime: '',
    endTime: '',
    status: AppointmentStatus.SCHEDULED,
    reason: '',
    notes: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!appointmentId);
  
  const isPatient = user?.role === UserRole.PATIENT;
  const isProfessional = user?.role === UserRole.PROFESSIONAL || user?.role === UserRole.ADMIN;
  
  // Si estamos editando, recuperamos los datos de la cita
  useEffect(() => {
    const fetchAppointmentData = async () => {
      if (!appointmentId) return;
      
      try {
        setFetching(true);
        
        // En una aplicación real:
        // const data = await api.appointmentsApi.getById(appointmentId);
        
        // Datos de ejemplo para demostración
        const mockAppointment = {
          id: appointmentId,
          patientId: 'p1',
          professionalId: 'dr1',
          date: '2025-03-15',
          startTime: '10:00',
          endTime: '10:30',
          status: AppointmentStatus.SCHEDULED,
          reason: 'Consulta rutinaria',
          notes: 'Paciente con antecedentes de hipertensión. Revisión de medicación actual.',
        };
        
        setFormData({
          patientId: mockAppointment.patientId,
          professionalId: mockAppointment.professionalId,
          date: mockAppointment.date,
          startTime: mockAppointment.startTime,
          endTime: mockAppointment.endTime,
          status: mockAppointment.status,
          reason: mockAppointment.reason || '',
          notes: mockAppointment.notes || '',
        });
      } catch (error) {
        console.error('Error fetching appointment data:', error);
        Alert.alert('Error', 'No se pudo cargar la información de la cita');
      } finally {
        setFetching(false);
      }
    };
    
    fetchAppointmentData();
  }, [appointmentId]);
  
  const handleChange = (field: keyof AppointmentFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const validateForm = (): boolean => {
    // Si es paciente, verificar que se seleccionó un profesional
    if (isPatient && !formData.professionalId.trim()) {
      Alert.alert('Error', 'Por favor, seleccione un profesional');
      return false;
    }
    
    // Si es profesional, verificar que se seleccionó un paciente
    if (isProfessional && !formData.patientId.trim()) {
      Alert.alert('Error', 'Por favor, seleccione un paciente');
      return false;
    }
    
    // Validar fecha
    if (!formData.date.trim()) {
      Alert.alert('Error', 'La fecha es obligatoria');
      return false;
    }
    
    // Validar formato de fecha (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(formData.date)) {
      Alert.alert('Error', 'Formato de fecha inválido. Use AAAA-MM-DD');
      return false;
    }
    
    // Validar horarios
    if (!formData.startTime.trim() || !formData.endTime.trim()) {
      Alert.alert('Error', 'La hora de inicio y fin son obligatorias');
      return false;
    }
    
    // Validar formato de hora (HH:MM)
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timeRegex.test(formData.startTime) || !timeRegex.test(formData.endTime)) {
      Alert.alert('Error', 'Formato de hora inválido. Use HH:MM (24h)');
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      if (appointmentId) {
        // Actualizar cita existente
        // En una aplicación real:
        // await api.appointmentsApi.update(appointmentId, formData);
        
        // Simulamos una pausa para la demo
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        Alert.alert('Éxito', 'Cita actualizada correctamente', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        // Crear nueva cita
        // En una aplicación real:
        // const newAppointment = await api.appointmentsApi.create(formData);
        
        // Simulamos una pausa para la demo
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        Alert.alert('Éxito', 'Cita creada correctamente', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      }
    } catch (error) {
      console.error('Error saving appointment:', error);
      Alert.alert('Error', 'No se pudo guardar la cita');
    } finally {
      setLoading(false);
    }
  };
  
  if (fetching) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: appColors.background }}>
        <ActivityIndicator size="large" color={appColors.primary} />
      </View>
    );
  }
  
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: appColors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}
    >
      <ScrollView style={{ flex: 1 }}>
        <View style={{ padding: 16 }}>
          {/* Campo de paciente - Solo visible para profesionales */}
          {isProfessional && (
            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 8, color: appColors.textSecondary }}>
                Paciente *
              </Text>
              <TouchableOpacity 
                style={{ 
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: 'white',
                  borderWidth: 1,
                  borderColor: appColors.border,
                  borderRadius: 8,
                  padding: 12,
                }}
                onPress={() => {
                  // En una aplicación real, aquí abriríamos un selector de pacientes
                  Alert.alert('Selector de pacientes', 'Aquí se mostraría un selector de pacientes');
                }}
              >
                <Text style={{ fontSize: 16, color: appColors.primary }}>
                  {formData.patientId ? 'Cambiar paciente' : 'Seleccionar paciente'}
                </Text>
                <Ionicons name="chevron-forward" size={20} color={appColors.primary} />
              </TouchableOpacity>
              
              {formData.patientId && (
                <View style={{ 
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: appColors.primary + '10',
                  borderRadius: 4,
                  padding: 8,
                  marginTop: 8,
                }}>
                  <Ionicons name="person" size={16} color={appColors.primary} />
                  <Text style={{ fontSize: 14, color: appColors.primary, marginLeft: 8 }}>
                    Juan García
                  </Text>
                </View>
              )}
            </View>
          )}
          
          {/* Campo de profesional - Solo visible para pacientes */}
          {isPatient && (
            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 8, color: appColors.textSecondary }}>
                Profesional *
              </Text>
              <TouchableOpacity 
                style={{ 
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: 'white',
                  borderWidth: 1,
                  borderColor: appColors.border,
                  borderRadius: 8,
                  padding: 12,
                }}
                onPress={() => {
                  // En una aplicación real, aquí abriríamos un selector de profesionales
                  Alert.alert('Selector de profesionales', 'Aquí se mostraría un selector de profesionales');
                }}
              >
                <Text style={{ fontSize: 16, color: appColors.primary }}>
                  {formData.professionalId ? 'Cambiar profesional' : 'Seleccionar profesional'}
                </Text>
                <Ionicons name="chevron-forward" size={20} color={appColors.primary} />
              </TouchableOpacity>
              
              {formData.professionalId && (
                <View style={{ 
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: appColors.primary + '10',
                  borderRadius: 4,
                  padding: 8,
                  marginTop: 8,
                }}>
                  <Ionicons name="medkit" size={16} color={appColors.primary} />
                  <Text style={{ fontSize: 14, color: appColors.primary, marginLeft: 8 }}>
                    Dr. Martínez
                  </Text>
                </View>
              )}
            </View>
          )}
          
          <Input
            {...componentStyles.Input}
            label="Fecha *"
            labelStyle={{ color: appColors.textSecondary }}
            value={formData.date}
            onChangeText={(value) => handleChange('date', value)}
            placeholder="AAAA-MM-DD"
          />
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
            <View style={{ width: '48%' }}>
              <Input
                {...componentStyles.Input}
                label="Hora inicio *"
                labelStyle={{ color: appColors.textSecondary }}
                value={formData.startTime}
                onChangeText={(value) => handleChange('startTime', value)}
                placeholder="HH:MM"
                containerStyle={{ marginBottom: 0 }}
              />
            </View>
            
            <View style={{ width: '48%' }}>
              <Input
                {...componentStyles.Input}
                label="Hora fin *"
                labelStyle={{ color: appColors.textSecondary }}
                value={formData.endTime}
                onChangeText={(value) => handleChange('endTime', value)}
                placeholder="HH:MM"
                containerStyle={{ marginBottom: 0 }}
              />
            </View>
          </View>
          
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 8, color: appColors.textSecondary }}>
              Motivo de la cita
            </Text>
            <TextInput
              style={{ 
                backgroundColor: 'white',
                borderWidth: 1,
                borderColor: appColors.border,
                borderRadius: 8,
                padding: 12,
                fontSize: 16,
                minHeight: 80,
                textAlignVertical: 'top',
              }}
              value={formData.reason}
              onChangeText={(value) => handleChange('reason', value)}
              placeholder="Describa el motivo de la cita"
              multiline
              numberOfLines={3}
            />
          </View>
          
          {/* Notas - Solo visible para profesionales */}
          {isProfessional && (
            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 8, color: appColors.textSecondary }}>
                Notas médicas
              </Text>
              <TextInput
                style={{ 
                  backgroundColor: 'white',
                  borderWidth: 1,
                  borderColor: appColors.border,
                  borderRadius: 8,
                  padding: 12,
                  fontSize: 16,
                  minHeight: 80,
                  textAlignVertical: 'top',
                }}
                value={formData.notes}
                onChangeText={(value) => handleChange('notes', value)}
                placeholder="Notas para el profesional"
                multiline
                numberOfLines={4}
              />
            </View>
          )}
          
          <Text style={{ fontSize: 12, color: appColors.textTertiary, marginTop: 8, marginBottom: 16 }}>
            * Campos obligatorios
          </Text>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
            <Button
              {...componentStyles.Button.base}
              {...componentStyles.Button.outline}
              title="Cancelar"
              onPress={() => navigation.goBack()}
              containerStyle={{ flex: 1, marginRight: 8 }}
              buttonStyle={{ borderColor: appColors.textTertiary }}
              titleStyle={{ color: appColors.textTertiary }}
            />
            
            <Button
              {...componentStyles.Button.base}
              {...componentStyles.Button.primary}
              title={appointmentId ? 'Actualizar' : 'Guardar'}
              onPress={handleSubmit}
              loading={loading}
              containerStyle={{ flex: 1, marginLeft: 8 }}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AppointmentFormScreen;
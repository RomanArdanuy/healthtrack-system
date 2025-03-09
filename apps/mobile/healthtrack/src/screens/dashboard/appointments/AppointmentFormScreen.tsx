// apps/mobile/healthtrack/src/screens/dashboard/appointments/AppointmentFormScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
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
    status: AppointmentStatus.scheduled,
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
          status: AppointmentStatus.scheduled,
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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.formContainer}>
          {/* Campo de paciente - Solo visible para profesionales */}
          {isProfessional && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Paciente *</Text>
              <TouchableOpacity 
                style={styles.selectButton}
                onPress={() => {
                  // En una aplicación real, aquí abriríamos un selector de pacientes
                  Alert.alert('Selector de pacientes', 'Aquí se mostraría un selector de pacientes');
                }}
              >
                <Text style={styles.selectButtonText}>
                  {formData.patientId ? 'Cambiar paciente' : 'Seleccionar paciente'}
                </Text>
                <Ionicons name="chevron-forward" size={20} color="#4F46E5" />
              </TouchableOpacity>
              {formData.patientId && (
                <View style={styles.selectedItem}>
                  <Ionicons name="person" size={16} color="#4F46E5" />
                  <Text style={styles.selectedItemText}>Juan García</Text>
                </View>
              )}
            </View>
          )}
          
          {/* Campo de profesional - Solo visible para pacientes */}
          {isPatient && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Profesional *</Text>
              <TouchableOpacity 
                style={styles.selectButton}
                onPress={() => {
                  // En una aplicación real, aquí abriríamos un selector de profesionales
                  Alert.alert('Selector de profesionales', 'Aquí se mostraría un selector de profesionales');
                }}
              >
                <Text style={styles.selectButtonText}>
                  {formData.professionalId ? 'Cambiar profesional' : 'Seleccionar profesional'}
                </Text>
                <Ionicons name="chevron-forward" size={20} color="#4F46E5" />
              </TouchableOpacity>
              {formData.professionalId && (
                <View style={styles.selectedItem}>
                  <Ionicons name="medkit" size={16} color="#4F46E5" />
                  <Text style={styles.selectedItemText}>Dr. Martínez</Text>
                </View>
              )}
            </View>
          )}
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Fecha *</Text>
            <TextInput
              style={styles.input}
              value={formData.date}
              onChangeText={(value) => handleChange('date', value)}
              placeholder="AAAA-MM-DD"
            />
          </View>
          
          <View style={styles.timeContainer}>
            <View style={[styles.inputGroup, styles.timeInput]}>
              <Text style={styles.label}>Hora inicio *</Text>
              <TextInput
                style={styles.input}
                value={formData.startTime}
                onChangeText={(value) => handleChange('startTime', value)}
                placeholder="HH:MM"
              />
            </View>
            
            <View style={[styles.inputGroup, styles.timeInput]}>
              <Text style={styles.label}>Hora fin *</Text>
              <TextInput
                style={styles.input}
                value={formData.endTime}
                onChangeText={(value) => handleChange('endTime', value)}
                placeholder="HH:MM"
              />
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Motivo de la cita</Text>
            <TextInput
              style={styles.textArea}
              value={formData.reason}
              onChangeText={(value) => handleChange('reason', value)}
              placeholder="Describa el motivo de la cita"
              multiline
              numberOfLines={3}
            />
          </View>
          
          {/* Notas - Solo visible para profesionales */}
          {isProfessional && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Notas médicas</Text>
              <TextInput
                style={styles.textArea}
                value={formData.notes}
                onChangeText={(value) => handleChange('notes', value)}
                placeholder="Notas para el profesional"
                multiline
                numberOfLines={4}
              />
            </View>
          )}
          
          <Text style={styles.requiredNote}>* Campos obligatorios</Text>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.saveButtonText}>
                  {appointmentId ? 'Actualizar' : 'Guardar'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#374151',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeInput: {
    flex: 0.48,
  },
  selectButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
  },
  selectButtonText: {
    fontSize: 16,
    color: '#4F46E5',
  },
  selectedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    borderRadius: 4,
    padding: 8,
    marginTop: 8,
  },
  selectedItemText: {
    fontSize: 14,
    color: '#4F46E5',
    marginLeft: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#4B5563',
    fontSize: 16,
    fontWeight: '500',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#4F46E5',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginLeft: 8,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  requiredNote: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 8,
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
});

export default AppointmentFormScreen;
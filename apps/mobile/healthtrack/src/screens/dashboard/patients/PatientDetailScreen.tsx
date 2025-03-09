// apps/mobile/healthtrack/src/screens/dashboard/patients/PatientDetailScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PatientsStackParamList } from '../../../navigation/PatientsNavigator';
import { AppointmentsStackParamList } from '../../../navigation/AppointmentsNavigator';
import { useApi } from '@/provider/ApiProvider';
import { useAuth } from '../../../hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import { UserRole } from '@healthtrack/types';

// Tipo para la ruta
type PatientDetailRouteProp = RouteProp<PatientsStackParamList, 'PatientDetail'>;

// Tipo para la navegación combinada
type CombinedNavigationProp = NativeStackNavigationProp<PatientsStackParamList> & {
  navigate: (name: 'Appointments', params: { screen: keyof AppointmentsStackParamList, params: any }) => void;
};

// Tipo de paciente para esta pantalla
interface PatientDetail {
  id: string;
  name: string;
  surname: string;
  email: string;
  phone?: string;
  createdAt: string;
  // Campos adicionales específicos del perfil de paciente
  birthDate?: string;
  address?: string;
  emergencyContact?: string;
  appointments?: {
    total: number;
    upcoming: number;
  };
  measurements?: {
    lastMeasurement?: string;
    count: number;
  };
}

const PatientDetailScreen = () => {
  const navigation = useNavigation<CombinedNavigationProp>();
  const route = useRoute<PatientDetailRouteProp>();
  const { patientId } = route.params;
  const api = useApi();
  const { user } = useAuth();
  
  const [patient, setPatient] = useState<PatientDetail | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Verificar que el usuario sea un profesional
  const isProfessional = user?.role === UserRole.PROFESSIONAL || user?.role === UserRole.ADMIN;
  
  const fetchPatientDetails = async () => {
    if (!isProfessional) {
      Alert.alert('Acceso denegado', 'No tiene permisos para acceder a esta sección');
      navigation.goBack();
      return;
    }
    
    try {
      setLoading(true);
      
      // En una aplicación real, esto se obtendría de la API
      // const data = await api.patientsApi.getById(patientId);
      
      // Datos de ejemplo para demostración
      const mockPatient: PatientDetail = {
        id: patientId,
        name: 'Juan',
        surname: 'García',
        email: 'juan.garcia@example.com',
        phone: '612345678',
        createdAt: '2023-01-15',
        birthDate: '1985-05-12',
        address: 'Calle Principal 123, Barcelona',
        emergencyContact: 'María García - 678912345',
        appointments: {
          total: 8,
          upcoming: 2
        },
        measurements: {
          lastMeasurement: '2023-03-01',
          count: 12
        }
      };
      
      setPatient(mockPatient);
    } catch (error) {
      console.error('Error fetching patient details:', error);
      Alert.alert('Error', 'No se pudo cargar la información del paciente');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchPatientDetails();
  }, [patientId]);
  
  const handleEditPatient = () => {
    navigation.navigate('PatientForm', { patientId });
  };
  
  const handleScheduleAppointment = () => {
    navigation.navigate('Appointments', { 
      screen: 'AppointmentForm', 
      params: { patientId }
    });
  };
  
  const handleViewAppointments = () => {
    // En una implementación real, esto navegaría a una lista filtrada de citas para este paciente
    Alert.alert(
      'Ver citas',
      'Esta funcionalidad permitiría ver todas las citas del paciente.'
    );
  };
  
  const handleViewMeasurements = () => {
    // En una implementación real, esto navegaría a una lista de mediciones para este paciente
    Alert.alert(
      'Ver mediciones',
      'Esta funcionalidad permitiría ver todas las mediciones del paciente.'
    );
  };
  
  const handleDeletePatient = () => {
    Alert.alert(
      'Eliminar paciente',
      '¿Está seguro que desea eliminar este paciente? Esta acción no se puede deshacer.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          onPress: async () => {
            try {
              // En una app real: await api.patientsApi.delete(patientId);
              navigation.goBack();
            } catch (error) {
              console.error('Error deleting patient:', error);
              Alert.alert('Error', 'No se pudo eliminar el paciente');
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };
  
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }
  
  if (!patient) {
    return (
      <View className="flex-1 justify-center items-center bg-background p-5">
        <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
        <Text className="text-base text-text-secondary text-center my-4">
          No se encontró el paciente
        </Text>
        <TouchableOpacity
          className="bg-primary py-2.5 px-5 rounded-md"
          onPress={() => navigation.goBack()}
        >
          <Text className="text-white font-medium">Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <ScrollView className="flex-1 bg-background">
      {/* Header con información básica del paciente */}
      <View className="bg-white p-5 items-center border-b border-gray-200">
        <View className="w-20 h-20 rounded-full bg-primary justify-center items-center mb-3">
          <Text className="text-white text-2xl font-bold">
            {patient.name.charAt(0)}{patient.surname.charAt(0)}
          </Text>
        </View>
        <Text className="text-xl font-bold text-text-primary mb-1">
          {patient.name} {patient.surname}
        </Text>
        
        <View className="flex-row justify-center mt-4 space-x-2">
          <TouchableOpacity 
            className="bg-primary py-2 px-4 rounded-md flex-row items-center"
            onPress={handleScheduleAppointment}
          >
            <Ionicons name="calendar" size={18} color="white" />
            <Text className="text-white font-medium ml-1">Agendar cita</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="bg-white border border-primary py-2 px-4 rounded-md flex-row items-center"
            onPress={handleEditPatient}
          >
            <Ionicons name="create" size={18} color="#4F46E5" />
            <Text className="text-primary font-medium ml-1">Editar</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Tarjetas de resumen */}
      <View className="flex-row justify-between mx-4 mt-4">
        <TouchableOpacity 
          className="bg-white rounded-lg p-4 shadow flex-1 mr-2 items-center"
          onPress={handleViewAppointments}
        >
          <Ionicons name="calendar-outline" size={24} color="#4F46E5" />
          <Text className="text-lg font-bold text-text-primary mt-1">
            {patient.appointments?.upcoming || 0}
          </Text>
          <Text className="text-xs text-text-tertiary">
            Citas pendientes
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="bg-white rounded-lg p-4 shadow flex-1 ml-2 items-center"
          onPress={handleViewMeasurements}
        >
          <Ionicons name="pulse-outline" size={24} color="#10B981" />
          <Text className="text-lg font-bold text-text-primary mt-1">
            {patient.measurements?.count || 0}
          </Text>
          <Text className="text-xs text-text-tertiary">
            Mediciones
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Información de contacto */}
      <View className="bg-white rounded-lg mx-4 mt-4 p-4 shadow">
        <Text className="text-base font-semibold text-text-primary mb-3">
          Información de contacto
        </Text>
        
        <View className="flex-row items-center mb-3">
          <Ionicons name="mail-outline" size={20} color="#4F46E5" className="mr-3" />
          <View>
            <Text className="text-sm text-text-tertiary">Email:</Text>
            <Text className="text-base text-text-primary">{patient.email}</Text>
          </View>
        </View>
        
        <View className="flex-row items-center mb-3">
          <Ionicons name="call-outline" size={20} color="#4F46E5" className="mr-3" />
          <View>
            <Text className="text-sm text-text-tertiary">Teléfono:</Text>
            <Text className="text-base text-text-primary">{patient.phone || 'No especificado'}</Text>
          </View>
        </View>
        
        <View className="flex-row items-center mb-3">
          <Ionicons name="home-outline" size={20} color="#4F46E5" className="mr-3" />
          <View>
            <Text className="text-sm text-text-tertiary">Dirección:</Text>
            <Text className="text-base text-text-primary">{patient.address || 'No especificada'}</Text>
          </View>
        </View>
        
        <View className="flex-row items-center">
          <Ionicons name="alert-circle-outline" size={20} color="#4F46E5" className="mr-3" />
          <View>
            <Text className="text-sm text-text-tertiary">Contacto de emergencia:</Text>
            <Text className="text-base text-text-primary">{patient.emergencyContact || 'No especificado'}</Text>
          </View>
        </View>
      </View>
      
      {/* Información personal */}
      <View className="bg-white rounded-lg mx-4 mt-4 p-4 shadow">
        <Text className="text-base font-semibold text-text-primary mb-3">
          Información personal
        </Text>
        
        <View className="flex-row items-center mb-3">
          <Ionicons name="calendar-outline" size={20} color="#4F46E5" className="mr-3" />
          <View>
            <Text className="text-sm text-text-tertiary">Fecha de nacimiento:</Text>
            <Text className="text-base text-text-primary">
              {patient.birthDate 
                ? new Date(patient.birthDate).toLocaleDateString('es-ES')
                : 'No especificada'}
            </Text>
          </View>
        </View>
        
        <View className="flex-row items-center mb-3">
          <Ionicons name="time-outline" size={20} color="#4F46E5" className="mr-3" />
          <View>
            <Text className="text-sm text-text-tertiary">Fecha de registro:</Text>
            <Text className="text-base text-text-primary">
              {new Date(patient.createdAt).toLocaleDateString('es-ES')}
            </Text>
          </View>
        </View>
      </View>
      
      {/* Botón de eliminar */}
      <TouchableOpacity
        className="bg-white border border-error rounded-lg mx-4 my-4 p-4 flex-row justify-center items-center"
        onPress={handleDeletePatient}
      >
        <Ionicons name="trash-outline" size={20} color="#EF4444" />
        <Text className="text-error font-medium ml-2">Eliminar paciente</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default PatientDetailScreen;
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
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
type AppointmentDetailRouteProp = RouteProp<AppointmentsStackParamList, 'AppointmentDetail'>;

// Tipo para los detalles de la cita
interface AppointmentDetail {
  id: string;
  patientId: string;
  patientName: string;
  patientEmail?: string;
  patientPhone?: string;
  professionalId: string;
  professionalName: string;
  professionalSpecialty?: string;
  date: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  reason?: string;
  notes?: string;
  createdAt: string;
}

const AppointmentDetailScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AppointmentsStackParamList>>();
  const route = useRoute<AppointmentDetailRouteProp>();
  const { appointmentId } = route.params;
  const api = useApi();
  const { user } = useAuth();
  
  const [appointment, setAppointment] = useState<AppointmentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  
  const isPatient = user?.role === UserRole.PATIENT;
  const isProfessional = user?.role === UserRole.PROFESSIONAL || user?.role === UserRole.ADMIN;
  
  const fetchAppointmentDetails = async () => {
    try {
      setLoading(true);
      
      // En una aplicación real, esto se obtendría de la API
      // const data = await api.appointmentsApi.getById(appointmentId);
      
      // Datos de ejemplo para demostración
      const mockAppointment: AppointmentDetail = {
        id: appointmentId,
        patientId: 'p1',
        patientName: 'Juan García',
        patientEmail: 'juan.garcia@example.com',
        patientPhone: '612345678',
        professionalId: 'dr1',
        professionalName: 'Dr. Martínez',
        professionalSpecialty: 'Medicina General',
        date: '2025-03-15',
        startTime: '10:00',
        endTime: '10:30',
        status: AppointmentStatus.SCHEDULED,
        reason: 'Consulta rutinaria',
        notes: 'Paciente con antecedentes de hipertensión. Revisión de medicación actual.',
        createdAt: '2025-02-20'
      };
      
      setAppointment(mockAppointment);
    } catch (error) {
      console.error('Error fetching appointment details:', error);
      Alert.alert('Error', 'No se pudo cargar la información de la cita');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchAppointmentDetails();
  }, [appointmentId]);
  
  const handleEdit = () => {
    navigation.navigate('AppointmentForm', { appointmentId });
  };
  
  const handleUpdateStatus = (newStatus: AppointmentStatus) => {
    Alert.alert(
      'Actualizar estado',
      `¿Está seguro que desea cambiar el estado de la cita a "${getStatusText(newStatus)}"?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Confirmar',
          onPress: async () => {
            try {
              // En una app real: await api.appointmentsApi.updateStatus(appointmentId, newStatus);
              
              // Actualiza el estado local para la demo
              if (appointment) {
                setAppointment({
                  ...appointment,
                  status: newStatus
                });
              }
              
              Alert.alert('Éxito', 'Estado de la cita actualizado correctamente');
            } catch (error) {
              console.error('Error updating appointment status:', error);
              Alert.alert('Error', 'No se pudo actualizar el estado de la cita');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };
  
  const handleDelete = () => {
    Alert.alert(
      'Cancelar cita',
      '¿Está seguro que desea cancelar esta cita?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Sí, cancelar',
          onPress: async () => {
            try {
              // En una app real: await api.appointmentsApi.updateStatus(appointmentId, AppointmentStatus.cancelled);
              // O: await api.appointmentsApi.delete(appointmentId);
              
              navigation.goBack();
            } catch (error) {
              console.error('Error cancelling appointment:', error);
              Alert.alert('Error', 'No se pudo cancelar la cita');
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };
  
  const getStatusText = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.SCHEDULED:
        return 'Programada';
      case AppointmentStatus.CONFIRMED:
        return 'Confirmada';
      case AppointmentStatus.CANCELLED:
        return 'Cancelada';
      case AppointmentStatus.COMPLETED:
        return 'Completada';
      default:
        return 'Desconocido';
    }
  };
  
  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.SCHEDULED:
        return '#3B82F6'; // Blue
      case AppointmentStatus.CONFIRMED:
        return '#10B981'; // Green
      case AppointmentStatus.CANCELLED:
        return '#EF4444'; // Red
      case AppointmentStatus.COMPLETED:
        return '#6B7280'; // Gray
      default:
        return '#9CA3AF';
    }
  };
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }
  
  if (!appointment) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
        <Text style={styles.errorText}>No se encontró la cita</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.dateContainer}>
          <Text style={styles.dateLabel}>Fecha y hora</Text>
          <Text style={styles.dateValue}>
            {new Date(appointment.date).toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </Text>
          <Text style={styles.timeValue}>
            {appointment.startTime} - {appointment.endTime}
          </Text>
        </View>
        
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(appointment.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(appointment.status) }]}>
            {getStatusText(appointment.status)}
          </Text>
        </View>
      </View>
      
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          {isPatient ? 'Información del profesional' : 'Información del paciente'}
        </Text>
        
        {isPatient ? (
          // Si el usuario es paciente, mostrar info del profesional
          <>
            <View style={styles.infoRow}>
              <Ionicons name="person-outline" size={20} color="#4F46E5" />
              <Text style={styles.infoLabel}>Nombre:</Text>
              <Text style={styles.infoValue}>{appointment.professionalName}</Text>
            </View>
            
            {appointment.professionalSpecialty && (
              <View style={styles.infoRow}>
                <Ionicons name="medkit-outline" size={20} color="#4F46E5" />
                <Text style={styles.infoLabel}>Especialidad:</Text>
                <Text style={styles.infoValue}>{appointment.professionalSpecialty}</Text>
              </View>
            )}
          </>
        ) : (
          // Si el usuario es profesional, mostrar info del paciente
          <>
            <View style={styles.infoRow}>
              <Ionicons name="person-outline" size={20} color="#4F46E5" />
              <Text style={styles.infoLabel}>Nombre:</Text>
              <Text style={styles.infoValue}>{appointment.patientName}</Text>
            </View>
            
            {appointment.patientEmail && (
              <View style={styles.infoRow}>
                <Ionicons name="mail-outline" size={20} color="#4F46E5" />
                <Text style={styles.infoLabel}>Email:</Text>
                <Text style={styles.infoValue}>{appointment.patientEmail}</Text>
              </View>
            )}
            
            {appointment.patientPhone && (
              <View style={styles.infoRow}>
                <Ionicons name="call-outline" size={20} color="#4F46E5" />
                <Text style={styles.infoLabel}>Teléfono:</Text>
                <Text style={styles.infoValue}>{appointment.patientPhone}</Text>
              </View>
            )}
          </>
        )}
      </View>
      
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Detalles de la cita</Text>
        
        {appointment.reason && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Motivo:</Text>
            <Text style={styles.detailValue}>{appointment.reason}</Text>
          </View>
        )}
        
        {appointment.notes && isProfessional && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Notas:</Text>
            <Text style={styles.detailValue}>{appointment.notes}</Text>
          </View>
        )}
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Creada el:</Text>
          <Text style={styles.detailValue}>
            {new Date(appointment.createdAt).toLocaleDateString('es-ES')}
          </Text>
        </View>
      </View>
      
      <View style={styles.actionsContainer}>
        {/* Editar cita - Visible para todos */}
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={handleEdit}
        >
          <Ionicons name="create-outline" size={20} color="#4F46E5" />
          <Text style={styles.editButtonText}>Editar cita</Text>
        </TouchableOpacity>
        
        {/* Botones específicos para profesionales */}
        {isProfessional && appointment.status === AppointmentStatus.SCHEDULED && (
          <TouchableOpacity
            style={[styles.actionButton, styles.confirmButton]}
            onPress={() => handleUpdateStatus(AppointmentStatus.CONFIRMED)}
          >
            <Ionicons name="checkmark-circle-outline" size={20} color="white" />
            <Text style={styles.confirmButtonText}>Confirmar cita</Text>
          </TouchableOpacity>
        )}
        
        {isProfessional && (appointment.status === AppointmentStatus.SCHEDULED || 
                            appointment.status === AppointmentStatus.CONFIRMED) && (
          <TouchableOpacity
            style={[styles.actionButton, styles.completeButton]}
            onPress={() => handleUpdateStatus(AppointmentStatus.COMPLETED)}
          >
            <Ionicons name="checkmark-done-outline" size={20} color="white" />
            <Text style={styles.completeButtonText}>Marcar como completada</Text>
          </TouchableOpacity>
        )}
        
        {/* Cancelar cita - Visible para todos cuando no está completada ni cancelada */}
        {appointment.status !== AppointmentStatus.COMPLETED && 
         appointment.status !== AppointmentStatus.CANCELLED && (
          <TouchableOpacity
            style={[styles.actionButton, styles.cancelButton]}
            onPress={handleDelete}
          >
            <Ionicons name="close-circle-outline" size={20} color="#EF4444" />
            <Text style={styles.cancelButtonText}>Cancelar cita</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  dateContainer: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  timeValue: {
    fontSize: 16,
    color: '#374151',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginLeft: 10,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
    marginLeft: 8,
    width: 100,
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    color: '#1F2937',
  },
  detailRow: {
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    color: '#1F2937',
  },
  actionsContainer: {
    padding: 16,
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 12,
    marginVertical: 8,
  },
  editButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#4F46E5',
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4F46E5',
    marginLeft: 8,
  },
  confirmButton: {
    backgroundColor: '#10B981',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginLeft: 8,
  },
  completeButton: {
    backgroundColor: '#3B82F6',
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
    marginVertical: 16,
  },
  backButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AppointmentDetailScreen;
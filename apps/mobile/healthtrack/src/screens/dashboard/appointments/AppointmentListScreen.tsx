import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useApi } from '@/provider/ApiProvider';
import { useAuth } from '../../../hooks/useAuth';
import { AppointmentStatus } from '@healthtrack/types';
import { UserRole } from '@healthtrack/types';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppointmentsStackParamList } from '@/navigation/AppointmentsNavigator';

// Tipo para los elementos de la lista de citas
interface AppointmentListItem {
  id: string;
  patientId: string;
  patientName: string;
  professionalId: string;
  professionalName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  reason?: string;
}

const AppointmentListScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AppointmentsStackParamList>>();
  const { user } = useAuth();
  const api = useApi();
  
  const [appointments, setAppointments] = useState<AppointmentListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const isPatient = user?.role === UserRole.PATIENT;
  const isProfessional = user?.role === UserRole.PROFESSIONAL || user?.role === UserRole.ADMIN;
  
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      
      // En una aplicación real, esto obtendría datos de la API:
      // let data;
      // if (isPatient) {
      //   data = await api.appointmentsApi.getByPatientId(user.id);
      // } else if (isProfessional) {
      //   data = await api.appointmentsApi.getByProfessionalId(user.id);
      // }
      
      // Mock data para demostración
      const mockAppointments: AppointmentListItem[] = [
        {
          id: '1',
          patientId: 'p1',
          patientName: 'Juan García',
          professionalId: 'dr1',
          professionalName: 'Dr. Martínez',
          date: '2025-03-15',
          startTime: '10:00',
          endTime: '10:30',
          status: AppointmentStatus.SCHEDULED,
          reason: 'Consulta rutinaria'
        },
        {
          id: '2',
          patientId: 'p2',
          patientName: 'María López',
          professionalId: 'dr1',
          professionalName: 'Dr. Martínez',
          date: '2025-03-15',
          startTime: '11:00',
          endTime: '11:30',
          status: AppointmentStatus.CONFIRMED,
          reason: 'Seguimiento'
        },
        {
          id: '3',
          patientId: 'p1',
          patientName: 'Juan García',
          professionalId: 'dr1',
          professionalName: 'Dr. Martínez',
          date: '2025-03-20',
          startTime: '12:00',
          endTime: '12:30',
          status: AppointmentStatus.COMPLETED,
          reason: 'Resultados análisis'
        }
      ];
      
      // Filtrar citas según el rol del usuario
      let filteredAppointments = mockAppointments;
      if (isPatient) {
        filteredAppointments = mockAppointments.filter(app => app.patientId === user?.id);
      } else if (isProfessional) {
        filteredAppointments = mockAppointments.filter(app => app.professionalId === user?.id);
      }
      
      setAppointments(filteredAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  useEffect(() => {
    fetchAppointments();
  }, []);
  
  const handleRefresh = () => {
    setRefreshing(true);
    fetchAppointments();
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
  
  const renderAppointmentItem = ({ item }: { item: AppointmentListItem }) => (
    <TouchableOpacity
      style={styles.appointmentCard}
      onPress={() => navigation.navigate('AppointmentDetail', { appointmentId: item.id })}
    >
      <View style={styles.appointmentHeader}>
        <Text style={styles.dateText}>
          {new Date(item.date).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {getStatusText(item.status)}
          </Text>
        </View>
      </View>
      
      <View style={styles.appointmentTime}>
        <Ionicons name="time-outline" size={16} color="#4B5563" />
        <Text style={styles.timeText}>{item.startTime} - {item.endTime}</Text>
      </View>
      
      <View style={styles.appointmentDetail}>
        {isPatient ? (
          <View style={styles.personInfo}>
            <Ionicons name="medkit-outline" size={16} color="#4F46E5" />
            <Text style={styles.personText}>{item.professionalName}</Text>
          </View>
        ) : (
          <View style={styles.personInfo}>
            <Ionicons name="person-outline" size={16} color="#4F46E5" />
            <Text style={styles.personText}>{item.patientName}</Text>
          </View>
        )}
        
        {item.reason && (
          <View style={styles.reasonContainer}>
            <Text style={styles.reasonLabel}>Motivo:</Text>
            <Text style={styles.reasonText}>{item.reason}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
  
  return (
    <View style={styles.container}>
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />
        </View>
      ) : (
        <FlatList
          data={appointments}
          renderItem={renderAppointmentItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={handleRefresh} 
              colors={['#4F46E5']}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar" size={48} color="#D1D5DB" />
              <Text style={styles.emptyText}>No hay citas programadas</Text>
            </View>
          }
        />
      )}
      
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AppointmentForm')}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  list: {
    padding: 16,
  },
  appointmentCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  appointmentTime: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  timeText: {
    fontSize: 14,
    color: '#4B5563',
    marginLeft: 8,
  },
  appointmentDetail: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  personInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  personText: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
    marginLeft: 8,
  },
  reasonContainer: {
    marginTop: 4,
  },
  reasonLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  reasonText: {
    fontSize: 14,
    color: '#4B5563',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 12,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});

export default AppointmentListScreen;
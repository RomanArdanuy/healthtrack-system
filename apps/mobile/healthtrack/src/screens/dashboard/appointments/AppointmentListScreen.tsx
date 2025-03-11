import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
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
import { appColors } from '../../../styles';

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
        return appColors.info; // Blue
      case AppointmentStatus.CONFIRMED:
        return appColors.success; // Green
      case AppointmentStatus.CANCELLED:
        return appColors.error; // Red
      case AppointmentStatus.COMPLETED:
        return appColors.textTertiary; // Gray
      default:
        return appColors.textDisabled;
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
      style={{
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
      }}
      onPress={() => navigation.navigate('AppointmentDetail', { appointmentId: item.id })}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <Text style={{ fontSize: 16, fontWeight: '600', color: appColors.textPrimary, flex: 1 }}>
          {new Date(item.date).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </Text>
        <View style={{ 
          paddingHorizontal: 8, 
          paddingVertical: 4, 
          borderRadius: 12,
          backgroundColor: getStatusColor(item.status) + '20' 
        }}>
          <Text style={{ fontSize: 12, fontWeight: '500', color: getStatusColor(item.status) }}>
            {getStatusText(item.status)}
          </Text>
        </View>
      </View>
      
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        <Ionicons name="time-outline" size={16} color={appColors.textSecondary} />
        <Text style={{ fontSize: 14, color: appColors.textSecondary, marginLeft: 8 }}>
          {item.startTime} - {item.endTime}
        </Text>
      </View>
      
      <View style={{ borderTopWidth: 1, borderTopColor: appColors.background, paddingTop: 12 }}>
        {isPatient ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Ionicons name="medkit-outline" size={16} color={appColors.primary} />
            <Text style={{ fontSize: 14, color: appColors.textPrimary, fontWeight: '500', marginLeft: 8 }}>
              {item.professionalName}
            </Text>
          </View>
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Ionicons name="person-outline" size={16} color={appColors.primary} />
            <Text style={{ fontSize: 14, color: appColors.textPrimary, fontWeight: '500', marginLeft: 8 }}>
              {item.patientName}
            </Text>
          </View>
        )}
        
        {item.reason && (
          <View style={{ marginTop: 4 }}>
            <Text style={{ fontSize: 12, color: appColors.textTertiary }}>Motivo:</Text>
            <Text style={{ fontSize: 14, color: appColors.textSecondary }}>
              {item.reason}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
  
  return (
    <View style={{ flex: 1, backgroundColor: appColors.background }}>
      {loading && !refreshing ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={appColors.primary} />
        </View>
      ) : (
        <FlatList
          data={appointments}
          renderItem={renderAppointmentItem}
          keyExtractor={item => item.id}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={handleRefresh} 
              colors={[appColors.primary]}
            />
          }
          ListEmptyComponent={
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, marginTop: 40 }}>
              <Ionicons name="calendar" size={48} color={appColors.border} />
              <Text style={{ fontSize: 16, color: appColors.textTertiary, textAlign: 'center', marginTop: 12 }}>
                No hay citas programadas
              </Text>
            </View>
          }
        />
      )}
      
      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: appColors.primary,
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 4,
        }}
        onPress={() => navigation.navigate('AppointmentForm', {})
      }
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default AppointmentListScreen;
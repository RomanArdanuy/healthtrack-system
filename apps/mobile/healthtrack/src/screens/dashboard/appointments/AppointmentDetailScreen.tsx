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
import { AppointmentsStackParamList } from '../../../navigation/AppointmentsNavigator';
import { useApi } from '@/provider/ApiProvider';
import { useAuth } from '../../../hooks/useAuth';
import { AppointmentStatus } from '@healthtrack/types';
import { UserRole } from '@healthtrack/types';
import { Ionicons } from '@expo/vector-icons';
import { appColors, componentStyles } from '../../../styles';
import { Button, Divider } from '@rneui/themed';

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
  
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: appColors.background }}>
        <ActivityIndicator size="large" color={appColors.primary} />
      </View>
    );
  }
  
  if (!appointment) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: appColors.background }}>
        <Ionicons name="alert-circle-outline" size={48} color={appColors.error} />
        <Text style={{ fontSize: 16, color: appColors.textSecondary, textAlign: 'center', marginVertical: 16 }}>
          No se encontró la cita
        </Text>
        <Button
          {...componentStyles.Button.base}
          {...componentStyles.Button.primary}
          title="Volver"
          onPress={() => navigation.goBack()}
        />
      </View>
    );
  }
  
  return (
    <ScrollView style={{ flex: 1, backgroundColor: appColors.background }}>
      <View style={{ 
        backgroundColor: 'white',
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        borderBottomWidth: 1,
        borderBottomColor: appColors.border,
      }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 14, color: appColors.textTertiary, marginBottom: 4 }}>
            Fecha y hora
          </Text>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: appColors.textPrimary, marginBottom: 4 }}>
            {new Date(appointment.date).toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </Text>
          <Text style={{ fontSize: 16, color: appColors.textSecondary }}>
            {appointment.startTime} - {appointment.endTime}
          </Text>
        </View>
        
        <View style={{ 
          paddingHorizontal: 10,
          paddingVertical: 5,
          borderRadius: 12,
          marginLeft: 10,
          backgroundColor: getStatusColor(appointment.status) + '20' 
        }}>
          <Text style={{ fontSize: 14, fontWeight: '500', color: getStatusColor(appointment.status) }}>
            {getStatusText(appointment.status)}
          </Text>
        </View>
      </View>
      
      <View style={{ 
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        margin: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
      }}>
        <Text style={{ fontSize: 16, fontWeight: '600', color: appColors.textSecondary, marginBottom: 12 }}>
          {isPatient ? 'Información del profesional' : 'Información del paciente'}
        </Text>
        
        {isPatient ? (
          // Si el usuario es paciente, mostrar info del profesional
          <>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: appColors.background }}>
              <Ionicons name="person-outline" size={20} color={appColors.primary} />
              <Text style={{ fontSize: 14, fontWeight: '500', color: appColors.textSecondary, marginLeft: 8, width: 100 }}>Nombre:</Text>
              <Text style={{ flex: 1, fontSize: 14, color: appColors.textPrimary }}>{appointment.professionalName}</Text>
            </View>
            
            {appointment.professionalSpecialty && (
              <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: appColors.background }}>
                <Ionicons name="medkit-outline" size={20} color={appColors.primary} />
                <Text style={{ fontSize: 14, fontWeight: '500', color: appColors.textSecondary, marginLeft: 8, width: 100 }}>Especialidad:</Text>
                <Text style={{ flex: 1, fontSize: 14, color: appColors.textPrimary }}>{appointment.professionalSpecialty}</Text>
              </View>
            )}
          </>
        ) : (
          // Si el usuario es profesional, mostrar info del paciente
          <>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: appColors.background }}>
              <Ionicons name="person-outline" size={20} color={appColors.primary} />
              <Text style={{ fontSize: 14, fontWeight: '500', color: appColors.textSecondary, marginLeft: 8, width: 100 }}>Nombre:</Text>
              <Text style={{ flex: 1, fontSize: 14, color: appColors.textPrimary }}>{appointment.patientName}</Text>
            </View>
            
            {appointment.patientEmail && (
              <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: appColors.background }}>
                <Ionicons name="mail-outline" size={20} color={appColors.primary} />
                <Text style={{ fontSize: 14, fontWeight: '500', color: appColors.textSecondary, marginLeft: 8, width: 100 }}>Email:</Text>
                <Text style={{ flex: 1, fontSize: 14, color: appColors.textPrimary }}>{appointment.patientEmail}</Text>
              </View>
            )}
            
            {appointment.patientPhone && (
              <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: appColors.background }}>
                <Ionicons name="call-outline" size={20} color={appColors.primary} />
                <Text style={{ fontSize: 14, fontWeight: '500', color: appColors.textSecondary, marginLeft: 8, width: 100 }}>Teléfono:</Text>
                <Text style={{ flex: 1, fontSize: 14, color: appColors.textPrimary }}>{appointment.patientPhone}</Text>
              </View>
            )}
          </>
        )}
      </View>
      
      <View style={{ 
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        marginHorizontal: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
      }}>
        <Text style={{ fontSize: 16, fontWeight: '600', color: appColors.textSecondary, marginBottom: 12 }}>
          Detalles de la cita
        </Text>
        
        {appointment.reason && (
          <View style={{ marginBottom: 12 }}>
            <Text style={{ fontSize: 14, fontWeight: '500', color: appColors.textSecondary, marginBottom: 4 }}>Motivo:</Text>
            <Text style={{ fontSize: 14, color: appColors.textPrimary }}>{appointment.reason}</Text>
          </View>
        )}
        
        {appointment.notes && isProfessional && (
          <View style={{ marginBottom: 12 }}>
            <Text style={{ fontSize: 14, fontWeight: '500', color: appColors.textSecondary, marginBottom: 4 }}>Notas:</Text>
            <Text style={{ fontSize: 14, color: appColors.textPrimary }}>{appointment.notes}</Text>
          </View>
        )}
        
        <View style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: 14, fontWeight: '500', color: appColors.textSecondary, marginBottom: 4 }}>Creada el:</Text>
          <Text style={{ fontSize: 14, color: appColors.textPrimary }}>
            {new Date(appointment.createdAt).toLocaleDateString('es-ES')}
          </Text>
        </View>
      </View>
      
      <View style={{ padding: 16, marginBottom: 16 }}>
        {/* Editar cita - Visible para todos */}
        <Button
          {...componentStyles.Button.base}
          {...componentStyles.Button.outline}
          title="Editar cita"
          icon={<Ionicons name="create-outline" size={20} color={appColors.primary} style={{ marginRight: 8 }} />}
          onPress={handleEdit}
          containerStyle={{ marginVertical: 8 }}
        />
        
        {/* Botones específicos para profesionales */}
        {isProfessional && appointment.status === AppointmentStatus.SCHEDULED && (
          <Button
            {...componentStyles.Button.base}
            type="solid"
            title="Confirmar cita"
            buttonStyle={{ backgroundColor: appColors.success }}
            icon={<Ionicons name="checkmark-circle-outline" size={20} color="white" style={{ marginRight: 8 }} />}
            onPress={() => handleUpdateStatus(AppointmentStatus.CONFIRMED)}
            containerStyle={{ marginVertical: 8 }}
          />
        )}
        
        {isProfessional && (appointment.status === AppointmentStatus.SCHEDULED || 
                           appointment.status === AppointmentStatus.CONFIRMED) && (
          <Button
            {...componentStyles.Button.base}
            type="solid"
            title="Marcar como completada"
            buttonStyle={{ backgroundColor: appColors.info }}
            icon={<Ionicons name="checkmark-done-outline" size={20} color="white" style={{ marginRight: 8 }} />}
            onPress={() => handleUpdateStatus(AppointmentStatus.COMPLETED)}
            containerStyle={{ marginVertical: 8 }}
          />
        )}
        
        {/* Cancelar cita - Visible para todos cuando no está completada ni cancelada */}
        {appointment.status !== AppointmentStatus.COMPLETED && 
         appointment.status !== AppointmentStatus.CANCELLED && (
          <Button
            {...componentStyles.Button.base}
            type="outline"
            title="Cancelar cita"
            buttonStyle={{ borderColor: appColors.error }}
            titleStyle={{ color: appColors.error }}
            icon={<Ionicons name="close-circle-outline" size={20} color={appColors.error} style={{ marginRight: 8 }} />}
            onPress={handleDelete}
            containerStyle={{ marginVertical: 8 }}
          />
        )}
      </View>
    </ScrollView>
  );
};

export default AppointmentDetailScreen;
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppointmentListScreen from '../screens/dashboard/appointments/AppointmentListScreen';
import AppointmentFormScreen from '@/screens/dashboard/appointments/AppointmentFormScreen';
import AppointmentDetailScreen from '@/screens/dashboard/appointments/AppointmentDetailScreen';

// Define our appointments stack navigator param list
export type AppointmentsStackParamList = {
  AppointmentList: undefined;
  AppointmentDetail: { appointmentId: string };
  AppointmentForm: { appointmentId?: string, patientId?: string, date?: string }; // Opcionales para crear nueva cita
};

const Stack = createNativeStackNavigator<AppointmentsStackParamList>();

const AppointmentsNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="AppointmentList"
      screenOptions={{
        headerShown: true,
      }}
    >
      <Stack.Screen 
        name="AppointmentList" 
        component={AppointmentListScreen} 
        options={{ title: 'Citas' }}
      />
      <Stack.Screen 
        name="AppointmentDetail" 
        component={AppointmentDetailScreen} 
        options={{ title: 'Detalles de la Cita' }}
      />
      <Stack.Screen 
        name="AppointmentForm" 
        component={AppointmentFormScreen}
        options={({ route }) => ({ 
          title: route.params?.appointmentId ? 'Editar Cita' : 'Nueva Cita' 
        })}
      />
    </Stack.Navigator>
  );
};

export default AppointmentsNavigator;
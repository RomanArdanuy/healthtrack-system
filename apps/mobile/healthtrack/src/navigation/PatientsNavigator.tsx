import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PatientListScreen from '../screens/dashboard/patients/PatientListScreen';
import PatientDetailScreen from '../screens/dashboard/patients/PatientDetailScreen';
import PatientFormScreen from '../screens/dashboard/patients/PatientFormScreen';

// Define our patients stack navigator param list
export type PatientsStackParamList = {
  PatientList: undefined;
  PatientDetail: { patientId: string };
  PatientForm: { patientId?: string }; // Optional for creating new patient
};

const Stack = createNativeStackNavigator<PatientsStackParamList>();

const PatientsNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="PatientList"
      screenOptions={{
        headerShown: true,
      }}
    >
      <Stack.Screen 
        name="PatientList" 
        component={PatientListScreen} 
        options={{ title: 'Pacientes' }}
      />
      <Stack.Screen 
        name="PatientDetail" 
        component={PatientDetailScreen} 
        options={{ title: 'Detalles del Paciente' }}
      />
      <Stack.Screen 
        name="PatientForm" 
        component={PatientFormScreen}
        options={({ route }) => ({ 
          title: route.params?.patientId ? 'Editar Paciente' : 'Nuevo Paciente' 
        })}
      />
    </Stack.Navigator>
  );
};

export default PatientsNavigator;
// apps/mobile/healthtrack/src/screens/dashboard/patients/PatientFormScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Text, Input, Button, Icon } from '@rneui/themed';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Patient } from '@healthtrack/types';
import { PatientsStackParamList } from '../../../navigation/PatientsNavigator';
import { useApi } from '@/provider/ApiProvider';
import { appColors, componentStyles } from '../../../styles';

type PatientFormScreenRouteProp = RouteProp<PatientsStackParamList, 'PatientForm'>;
type PatientFormScreenNavigationProp = NativeStackNavigationProp<PatientsStackParamList, 'PatientForm'>;

const PatientFormScreen = () => {
  const [patient, setPatient] = useState<Partial<Patient>>({
    name: '',
    surname: '',
    email: '',
    phone: '',
    birthDate: '',
    address: '',
    emergencyContact: '',
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const route = useRoute<PatientFormScreenRouteProp>();
  const navigation = useNavigation<PatientFormScreenNavigationProp>();
  const { patientsApi } = useApi();

  const isEditing = !!route.params?.patientId;
  const patientId = route.params?.patientId;

  useEffect(() => {
    if (isEditing) {
      const fetchPatient = async () => {
        try {
          setLoading(true);
          // En producción, usarías la API real
          // const data = await patientsApi.getById(patientId);
          
          // Simulación de datos
          setTimeout(() => {
            setPatient({
              id: patientId,
              name: 'Juan',
              surname: 'García',
              email: 'juan.garcia@example.com',
              phone: '612345678',
              birthDate: '1985-06-15',
              address: 'Calle Principal 123, Madrid',
              emergencyContact: 'María García (Esposa): 623456789',
            });
            setLoading(false);
          }, 1000);
        } catch (error) {
          console.error('Error al cargar el paciente:', error);
          setLoading(false);
        }
      };
      
      fetchPatient();
    }
  }, [isEditing, patientId]);

  const handleChange = (field: keyof Patient, value: string) => {
    setPatient(prev => ({ ...prev, [field]: value }));
    // Limpiar error al cambiar el valor
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!patient.name?.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }
    
    if (!patient.surname?.trim()) {
      newErrors.surname = 'El apellido es obligatorio';
    }
    
    if (!patient.email?.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(patient.email)) {
      newErrors.email = 'El correo electrónico no es válido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    
    try {
      setSaving(true);
      
      // En producción, llamarías a la API real
      if (isEditing) {
        // await patientsApi.update(patientId, patient);
        console.log('Actualizar paciente:', patient);
      } else {
        // await patientsApi.create(patient);
        console.log('Crear paciente:', patient);
      }
      
      // Simulación de guardado
      setTimeout(() => {
        setSaving(false);
        navigation.goBack();
      }, 1000);
    } catch (error) {
      console.error('Error al guardar el paciente:', error);
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={[{ flex: 1, backgroundColor: appColors.background, padding: 16, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={appColors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: appColors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView style={{ flex: 1, backgroundColor: appColors.background }}>
        <View style={{ padding: 16 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: appColors.textPrimary, marginBottom: 16 }}>
            {isEditing ? 'Editar paciente' : 'Nuevo paciente'}
          </Text>
          
          <Input
            {...componentStyles.Input}
            label="Nombre"
            value={patient.name}
            onChangeText={(value) => handleChange('name', value)}
            placeholder="Ingresa el nombre"
            errorMessage={errors.name}
            leftIcon={{ type: 'ionicon', name: 'person-outline' }}
          />
          
          <Input
            {...componentStyles.Input}
            label="Apellido"
            value={patient.surname}
            onChangeText={(value) => handleChange('surname', value)}
            placeholder="Ingresa el apellido"
            errorMessage={errors.surname}
            leftIcon={{ type: 'ionicon', name: 'person-outline' }}
          />
          
          <Input
            {...componentStyles.Input}
            label="Correo electrónico"
            value={patient.email}
            onChangeText={(value) => handleChange('email', value)}
            placeholder="ejemplo@correo.com"
            keyboardType="email-address"
            autoCapitalize="none"
            errorMessage={errors.email}
            leftIcon={{ type: 'ionicon', name: 'mail-outline' }}
          />
          
          <Input
            {...componentStyles.Input}
            label="Teléfono"
            value={patient.phone}
            onChangeText={(value) => handleChange('phone', value)}
            placeholder="Ingresa el teléfono"
            keyboardType="phone-pad"
            leftIcon={{ type: 'ionicon', name: 'call-outline' }}
          />
          
          <Input
            {...componentStyles.Input}
            label="Fecha de nacimiento"
            value={patient.birthDate}
            onChangeText={(value) => handleChange('birthDate', value)}
            placeholder="DD/MM/AAAA"
            leftIcon={{ type: 'ionicon', name: 'calendar-outline' }}
          />
          
          <Input
            {...componentStyles.Input}
            label="Dirección"
            value={patient.address}
            onChangeText={(value) => handleChange('address', value)}
            placeholder="Ingresa la dirección"
            leftIcon={{ type: 'ionicon', name: 'location-outline' }}
          />
          
          <Input
            {...componentStyles.Input}
            label="Contacto de emergencia"
            value={patient.emergencyContact}
            onChangeText={(value) => handleChange('emergencyContact', value)}
            placeholder="Nombre y teléfono del contacto"
            multiline
            leftIcon={{ type: 'ionicon', name: 'alert-circle-outline' }}
          />
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
            <Button
              {...componentStyles.Button.base}
              {...componentStyles.Button.outline}
              {...componentStyles.Button.cancel}
              title="Cancelar"
              onPress={() => navigation.goBack()}
              containerStyle={{ flex: 1, marginRight: 8 }}
            />
            <Button
              {...componentStyles.Button.base}
              {...componentStyles.Button.primary}
              title={saving ? 'Guardando...' : 'Guardar'}
              onPress={handleSubmit}
              disabled={saving}
              containerStyle={{ flex: 1, marginLeft: 8 }}
              icon={saving ? <ActivityIndicator size="small" color="white" /> : undefined}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default PatientFormScreen;
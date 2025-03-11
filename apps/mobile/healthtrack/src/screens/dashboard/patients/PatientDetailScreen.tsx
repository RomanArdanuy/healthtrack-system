import React, { useState, useEffect } from 'react';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import { Text, Card, Button, Icon, Divider } from '@rneui/themed';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Patient } from '@healthtrack/types';
import { PatientsStackParamList } from '../../../navigation/PatientsNavigator';
import { useApi } from '@/provider/ApiProvider';
import { appColors, componentStyles } from '../../../styles';

type PatientDetailScreenRouteProp = RouteProp<PatientsStackParamList, 'PatientDetail'>;
type PatientDetailScreenNavigationProp = NativeStackNavigationProp<PatientsStackParamList, 'PatientDetail'>;

const PatientDetailScreen = () => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const route = useRoute<PatientDetailScreenRouteProp>();
  const navigation = useNavigation<PatientDetailScreenNavigationProp>();
  const { patientsApi } = useApi();
  
  const patientId = route.params.patientId;
  
  useEffect(() => {
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
            role: 'patient',
            birthDate: '1985-06-15',
            address: 'Calle Principal 123, Madrid',
            emergencyContact: 'María García (Esposa): 623456789',
            professionalId: 'prof123',
            createdAt: '2023-01-15',
            updatedAt: '2023-05-20',
          } as Patient);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error al cargar el paciente:', error);
        setLoading(false);
      }
    };
    
    fetchPatient();
  }, [patientId]);
  
  const handleEdit = () => {
    navigation.navigate('PatientForm', { patientId });
  };
  
  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: appColors.background, padding: 16, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={appColors.primary} />
      </View>
    );
  }
  
  if (!patient) {
    return (
      <View style={{ flex: 1, backgroundColor: appColors.background, padding: 16, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 16, color: appColors.textPrimary }}>
          No se pudo cargar la información del paciente
        </Text>
      </View>
    );
  }
  
  return (
    <ScrollView style={{ flex: 1, backgroundColor: appColors.background }}>
      <View style={{ padding: 16 }}>
        <Card containerStyle={componentStyles.Card.containerStyle}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: appColors.textPrimary, marginBottom: 8 }}>
                {patient.name} {patient.surname}
              </Text>
            </View>
            <Button
              {...componentStyles.Button.base}
              {...componentStyles.Button.outline}
              icon={<Icon name="create-outline" type="ionicon" color={appColors.primary} />}
              onPress={handleEdit}
            />
          </View>
          
          <Divider style={{ height: 1, backgroundColor: appColors.border, marginVertical: 16 }} />
          
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 14, color: appColors.textTertiary }}>
              Correo electrónico
            </Text>
            <Text style={{ fontSize: 16, color: appColors.textPrimary }}>
              {patient.email}
            </Text>
          </View>
          
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 14, color: appColors.textTertiary }}>
              Teléfono
            </Text>
            <Text style={{ fontSize: 16, color: appColors.textPrimary }}>
              {patient.phone || 'No disponible'}
            </Text>
          </View>
          
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 14, color: appColors.textTertiary }}>
              Fecha de nacimiento
            </Text>
            <Text style={{ fontSize: 16, color: appColors.textPrimary }}>
              {patient.birthDate ? new Date(patient.birthDate).toLocaleDateString() : 'No disponible'}
            </Text>
          </View>
          
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 14, color: appColors.textTertiary }}>
              Dirección
            </Text>
            <Text style={{ fontSize: 16, color: appColors.textPrimary }}>
              {patient.address || 'No disponible'}
            </Text>
          </View>
          
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 14, color: appColors.textTertiary }}>
              Contacto de emergencia
            </Text>
            <Text style={{ fontSize: 16, color: appColors.textPrimary }}>
              {patient.emergencyContact || 'No disponible'}
            </Text>
          </View>
        </Card>
        
        <Card containerStyle={componentStyles.Card.containerStyle}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: appColors.textPrimary, marginBottom: 8 }}>
            Historial médico
          </Text>
          <Text style={{ fontSize: 16, color: appColors.textSecondary }}>
            Aquí se mostrará el historial médico del paciente cuando esté disponible.
          </Text>
        </Card>
        
        <Card containerStyle={componentStyles.Card.containerStyle}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: appColors.textPrimary, marginBottom: 8 }}>
            Próximas citas
          </Text>
          <Text style={{ fontSize: 16, color: appColors.textSecondary }}>
            Aquí se mostrarán las próximas citas del paciente cuando estén disponibles.
          </Text>
          <Button
            {...componentStyles.Button.base}
            type="clear"
            title="Ver todas las citas"
            containerStyle={{ marginTop: 16 }}
            icon={{
              name: 'chevron-forward',
              type: 'ionicon',
              color: appColors.primary,
              size: 22,
            }}
            iconRight
          />
        </Card>
      </View>
    </ScrollView>
  );
};

export default PatientDetailScreen;
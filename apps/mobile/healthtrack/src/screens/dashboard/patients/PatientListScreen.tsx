import React, { useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text, Card, SearchBar, FAB, Icon, Avatar } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Patient } from '@healthtrack/types';
import { PatientsStackParamList } from '../../../navigation/PatientsNavigator';
import { useApi } from '@/provider/ApiProvider';
import { appColors, componentStyles } from '../../../styles';

type PatientListScreenNavigationProp = NativeStackNavigationProp<PatientsStackParamList, 'PatientList'>;

const PatientListScreen = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<PatientListScreenNavigationProp>();
  const { patientsApi } = useApi();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        // En producción, usarías la API real
        // const data = await patientsApi.getAll();
        
        // Simulación de datos para desarrollo
        setTimeout(() => {
          const mockPatients = [
            {
              id: '1',
              name: 'Juan',
              surname: 'García',
              email: 'juan.garcia@example.com',
              phone: '612345678',
              role: 'patient',
              professionalId: 'prof123',
              createdAt: '2023-01-15',
              updatedAt: '2023-01-15',
            },
            {
              id: '2',
              name: 'María',
              surname: 'López',
              email: 'maria.lopez@example.com',
              phone: '623456789',
              role: 'patient',
              professionalId: 'prof123',
              createdAt: '2023-02-20',
              updatedAt: '2023-02-20',
            },
            {
              id: '3',
              name: 'Carlos',
              surname: 'Ruiz',
              email: 'carlos.ruiz@example.com',
              phone: '634567890',
              role: 'patient',
              professionalId: 'prof123',
              createdAt: '2023-03-01',
              updatedAt: '2023-03-01',
            },
            {
              id: '4',
              name: 'Ana',
              surname: 'Martínez',
              email: 'ana.martinez@example.com',
              phone: '645678901',
              role: 'patient',
              professionalId: 'prof123',
              createdAt: '2023-03-10',
              updatedAt: '2023-03-10',
            },
            {
              id: '5',
              name: 'Pedro',
              surname: 'Sánchez',
              email: 'pedro.sanchez@example.com',
              phone: '656789012',
              role: 'patient',
              professionalId: 'prof123',
              createdAt: '2023-03-15',
              updatedAt: '2023-03-15',
            },
          ] as Patient[];
          
          setPatients(mockPatients);
          setFilteredPatients(mockPatients);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching patients:', error);
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const updateSearch = (searchText: string) => {
    setSearch(searchText);
    
    if (searchText.trim() === '') {
      setFilteredPatients(patients);
      return;
    }
    
    const filtered = patients.filter(patient => {
      const fullName = `${patient.name} ${patient.surname}`.toLowerCase();
      return fullName.includes(searchText.toLowerCase()) || 
             patient.email.toLowerCase().includes(searchText.toLowerCase()) ||
             (patient.phone && patient.phone.includes(searchText));
    });
    
    setFilteredPatients(filtered);
  };

  const handlePatientPress = (patientId: string) => {
    navigation.navigate('PatientDetail', { patientId });
  };

  const handleAddPatient = () => {
    navigation.navigate('PatientForm', {});
  };

  const renderPatientItem = ({ item }: { item: Patient }) => {
    const initials = `${item.name.charAt(0)}${item.surname.charAt(0)}`;
    
    return (
      <Card containerStyle={componentStyles.Card.containerStyle}>
        <TouchableOpacity onPress={() => handlePatientPress(item.id)}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Avatar
                size="medium"
                rounded
                title={initials}
                containerStyle={{ backgroundColor: appColors.primary }}
              />
              <View style={{ marginLeft: 16 }}>
                <Text style={{ fontSize: 18, fontWeight: '600', color: appColors.textPrimary, marginBottom: 4 }}>
                  {item.name} {item.surname}
                </Text>
                <Text style={{ fontSize: 16, color: appColors.textSecondary }}>
                  {item.email}
                </Text>
                <Text style={{ fontSize: 14, color: appColors.textTertiary }}>
                  {item.phone || 'Sin teléfono'}
                </Text>
              </View>
            </View>
            <Icon
              name="chevron-forward"
              type="ionicon"
              color={appColors.textTertiary}
            />
          </View>
        </TouchableOpacity>
      </Card>
    );
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: appColors.background, padding: 16, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={appColors.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: appColors.background }}>
      <View style={{ padding: 16 }}>
        <SearchBar
          placeholder="Buscar pacientes..."
          onChangeText={updateSearch}
          value={search}
          lightTheme
          round
          containerStyle={componentStyles.SearchBar.containerStyle}
          inputContainerStyle={componentStyles.SearchBar.inputContainerStyle}
        />
        
        <FlatList
          data={filteredPatients}
          renderItem={renderPatientItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80 }} // Espacio para el FAB
        />
        
        <FAB
          icon={{ name: 'add', color: 'white' }}
          color={appColors.primary}
          placement="right"
          onPress={handleAddPatient}
        />
      </View>
    </View>
  );
};

export default PatientListScreen;
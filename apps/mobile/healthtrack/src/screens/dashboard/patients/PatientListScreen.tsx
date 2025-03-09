// apps/mobile/healthtrack/src/screens/dashboard/patients/PatientListScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApi } from '@/provider/ApiProvider';
import { useAuth } from '../../../hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PatientsStackParamList } from '../../../navigation/PatientsNavigator';
import { Ionicons } from '@expo/vector-icons';
import { UserRole } from '@healthtrack/types';

// Definir el tipo para los pacientes en la lista
interface PatientListItem {
  id: string;
  name: string;
  surname: string;
  email: string;
  phone?: string;
  createdAt: string;
}

const PatientListScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<PatientsStackParamList>>();
  const { user } = useAuth();
  const api = useApi();
  
  const [patients, setPatients] = useState<PatientListItem[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<PatientListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Verificar que el usuario sea un profesional
  const isProfessional = user?.role === UserRole.PROFESSIONAL || user?.role === UserRole.ADMIN;
  
  const fetchPatients = async () => {
    if (!isProfessional) {
      Alert.alert('Acceso denegado', 'No tiene permisos para acceder a esta sección');
      navigation.goBack();
      return;
    }
    
    try {
      setLoading(true);
      
      // En una aplicación real, esto se obtendría de la API
      // const response = await api.patientsApi.getAll();
      
      // Datos de ejemplo para demostración
      const mockPatients = [
        { 
          id: '1', 
          name: 'Juan', 
          surname: 'García', 
          email: 'juan.garcia@example.com', 
          phone: '612345678', 
          createdAt: '2023-01-15' 
        },
        { 
          id: '2', 
          name: 'María', 
          surname: 'López', 
          email: 'maria.lopez@example.com', 
          phone: '623456789', 
          createdAt: '2023-02-20' 
        },
        { 
          id: '3', 
          name: 'Carlos', 
          surname: 'Ruiz', 
          email: 'carlos.ruiz@example.com', 
          phone: '634567890', 
          createdAt: '2023-03-01' 
        },
        { 
          id: '4', 
          name: 'Ana', 
          surname: 'Martínez', 
          email: 'ana.martinez@example.com', 
          phone: '645678901', 
          createdAt: '2023-03-10' 
        },
        { 
          id: '5', 
          name: 'Pedro', 
          surname: 'Sánchez', 
          email: 'pedro.sanchez@example.com', 
          phone: '656789012', 
          createdAt: '2023-03-15' 
        }
      ];
      
      setPatients(mockPatients);
      setFilteredPatients(mockPatients);
    } catch (error) {
      console.error('Error fetching patients:', error);
      Alert.alert('Error', 'No se pudieron cargar los pacientes');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  useEffect(() => {
    fetchPatients();
  }, []);
  
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredPatients(patients);
    } else {
      const filtered = patients.filter(patient => {
        const fullName = `${patient.name} ${patient.surname}`.toLowerCase();
        return fullName.includes(searchQuery.toLowerCase()) || 
               patient.email.toLowerCase().includes(searchQuery.toLowerCase());
      });
      setFilteredPatients(filtered);
    }
  }, [searchQuery, patients]);
  
  const handleRefresh = () => {
    setRefreshing(true);
    fetchPatients();
  };
  
  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };
  
  const handleAddPatient = () => {
    navigation.navigate('PatientForm');
  };
  
  const handlePatientPress = (patientId: string) => {
    navigation.navigate('PatientDetail', { patientId });
  };
  
  const renderPatientItem = ({ item }: { item: PatientListItem }) => (
    <TouchableOpacity 
      className="flex-row items-center bg-white rounded-lg p-4 mb-3 shadow"
      onPress={() => handlePatientPress(item.id)}
    >
      <View className="w-10 h-10 rounded-full bg-primary justify-center items-center mr-3">
        <Text className="text-white font-bold">
          {item.name.charAt(0)}{item.surname.charAt(0)}
        </Text>
      </View>
      
      <View className="flex-1">
        <Text className="text-base font-semibold text-text-primary mb-1">
          {item.name} {item.surname}
        </Text>
        <Text className="text-sm text-text-secondary mb-0.5">
          {item.email}
        </Text>
        <Text className="text-sm text-text-tertiary">
          {item.phone || 'Sin teléfono'}
        </Text>
      </View>
      
      <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center bg-white rounded-lg mx-4 my-3 px-3 h-11 shadow">
        <Ionicons name="search" size={20} color="#6B7280" className="mr-2" />
        <TextInput
          className="flex-1 h-full text-base text-text-primary"
          placeholder="Buscar paciente..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#6B7280" />
          </TouchableOpacity>
        )}
      </View>
      
      {loading && !refreshing ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#4F46E5" />
        </View>
      ) : (
        <FlatList
          data={filteredPatients}
          renderItem={renderPatientItem}
          keyExtractor={item => item.id}
          contentContainerClassName="px-4 pb-20"
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={handleRefresh} 
              colors={['#4F46E5']}
            />
          }
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center py-10">
              <Ionicons name="people" size={48} color="#D1D5DB" />
              <Text className="text-base text-text-tertiary text-center mt-3">
                {searchQuery.length > 0 ? 'No se encontraron pacientes' : 'No hay pacientes'}
              </Text>
            </View>
          }
        />
      )}
      
      <TouchableOpacity
        className="absolute bottom-5 right-5 w-14 h-14 rounded-full bg-primary justify-center items-center shadow-lg"
        onPress={handleAddPatient}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default PatientListScreen;
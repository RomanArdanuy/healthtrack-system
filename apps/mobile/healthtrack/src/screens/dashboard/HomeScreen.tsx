// apps/mobile/healthtrack/src/screens/dashboard/HomeScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../hooks/useAuth';
import { useApi } from '@/provider/ApiProvider';
import { UserRole } from '@healthtrack/types';
import { AppointmentStatus } from '@healthtrack/types';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppointmentsStackParamList } from '../../navigation/AppointmentsNavigator';
import { PatientsStackParamList } from '../../navigation/PatientsNavigator';
import { appColors } from '../../styles';

// Tipo para la navegación a Patients
type CombinedNavigationProp = NativeStackNavigationProp<AppointmentsStackParamList> & {
  navigate: (name: 'Patients', params: { screen: keyof PatientsStackParamList }) => void;
};

// Define helper component for the statistics cards
const StatCard = ({ title, value, icon, color }: { title: string; value: string | number; icon: string; color: string }) => (
  <View style={{ 
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: '47%',
  }}>
    <View style={{ 
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
      backgroundColor: color + '20'
    }}>
      <Ionicons name={icon as any} size={22} color={color} />
    </View>
    <View>
      <Text style={{ fontSize: 14, color: appColors.textTertiary }}>{title}</Text>
      <Text style={{ fontSize: 18, fontWeight: 'bold', color: appColors.textPrimary }}>{value}</Text>
    </View>
  </View>
);

const HomeScreen = () => {
  const { user } = useAuth();
  const api = useApi();
  const navigation = useNavigation<CombinedNavigationProp>();
  
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    todayAppointments: 0,
    pendingAppointments: 0,
    totalPatients: 0,
  });
  
  const isProfessional = user?.role === UserRole.PROFESSIONAL || user?.role === UserRole.ADMIN;
  const isPatient = user?.role === UserRole.PATIENT;

  const loadData = async () => {
    setRefreshing(true);
    
    try {
      // In a real app, these would call your API client
      // For now, we'll just simulate some data
      
      // Mock data loading
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStats({
        todayAppointments: Math.floor(Math.random() * 5) + 1,
        pendingAppointments: Math.floor(Math.random() * 10) + 2,
        totalPatients: Math.floor(Math.random() * 50) + 20,
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <SafeAreaView edges={['left', 'right']} style={{ flex: 1, backgroundColor: appColors.background }}>
      <ScrollView
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadData} />
        }
      >
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: appColors.textPrimary }}>
            Hola, {user?.name}
          </Text>
          <Text style={{ fontSize: 16, color: appColors.textTertiary, marginTop: 4 }}>
            {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </Text>
        </View>

        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: appColors.textSecondary, marginBottom: 12 }}>
            Resumen
          </Text>
          
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            <StatCard 
              title="Citas hoy" 
              value={stats.todayAppointments} 
              icon="calendar" 
              color={appColors.primary} 
            />
            
            <StatCard 
              title="Citas pendientes" 
              value={stats.pendingAppointments} 
              icon="time" 
              color={appColors.warning} 
            />
            
            {isProfessional && (
              <StatCard 
                title="Pacientes" 
                value={stats.totalPatients} 
                icon="people" 
                color={appColors.success} 
              />
            )}
          </View>
        </View>

        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: appColors.textSecondary, marginBottom: 12 }}>
            Acciones rápidas
          </Text>
          
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            <TouchableOpacity 
              style={{
                backgroundColor: 'white',
                borderRadius: 10,
                padding: 16,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
                elevation: 2,
                flexDirection: 'row',
                alignItems: 'center',
                minWidth: '47%',
                marginBottom: 8,
              }}
              onPress={() => navigation.navigate('AppointmentList')}
            >
              <Ionicons name="calendar-outline" size={22} color={appColors.primary} />
              <Text style={{ fontSize: 14, color: appColors.textSecondary, marginLeft: 8 }}>
                Ver citas
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={{
                backgroundColor: 'white',
                borderRadius: 10,
                padding: 16,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
                elevation: 2,
                flexDirection: 'row',
                alignItems: 'center',
                minWidth: '47%',
                marginBottom: 8,
              }}
              onPress={() => navigation.navigate('AppointmentForm', {})}
            >
              <Ionicons name="add-circle-outline" size={22} color={appColors.primary} />
              <Text style={{ fontSize: 14, color: appColors.textSecondary, marginLeft: 8 }}>
                Nueva cita
              </Text>
            </TouchableOpacity>
            
            {isProfessional && (
              <TouchableOpacity 
                style={{
                  backgroundColor: 'white',
                  borderRadius: 10,
                  padding: 16,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 2,
                  elevation: 2,
                  flexDirection: 'row',
                  alignItems: 'center',
                  minWidth: '47%',
                  marginBottom: 8,
                }}
                onPress={() => {
                  navigation.navigate('Patients', { screen: 'PatientList' });
                }}
              >
                <Ionicons name="people-outline" size={22} color={appColors.primary} />
                <Text style={{ fontSize: 14, color: appColors.textSecondary, marginLeft: 8 }}>
                  Ver pacientes
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
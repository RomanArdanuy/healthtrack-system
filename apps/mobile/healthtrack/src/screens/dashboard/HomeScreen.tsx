// apps/mobile/healthtrack/src/screens/dashboard/HomeScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
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

// Tipo para la navegación a Patients
type CombinedNavigationProp = NativeStackNavigationProp<AppointmentsStackParamList> & {
  navigate: (name: 'Patients', params: { screen: keyof PatientsStackParamList }) => void;
};

// Define helper component for the statistics cards
const StatCard = ({ title, value, icon, color }: { title: string; value: string | number; icon: string; color: string }) => (
  <View style={styles.statCard}>
    <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
      <Ionicons name={icon as any} size={22} color={color} />
    </View>
    <View>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statValue}>{value}</Text>
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
    <SafeAreaView edges={['left', 'right']} style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadData} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>Hola, {user?.name}</Text>
          <Text style={styles.date}>{new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Text>
        </View>

        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Resumen</Text>
          
          <View style={styles.statsGrid}>
            <StatCard 
              title="Citas hoy" 
              value={stats.todayAppointments} 
              icon="calendar" 
              color="#4F46E5" 
            />
            
            <StatCard 
              title="Citas pendientes" 
              value={stats.pendingAppointments} 
              icon="time" 
              color="#F59E0B" 
            />
            
            {isProfessional && (
              <StatCard 
                title="Pacientes" 
                value={stats.totalPatients} 
                icon="people" 
                color="#10B981" 
              />
            )}
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>Acciones rápidas</Text>
          
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('AppointmentList')}
            >
              <Ionicons name="calendar-outline" size={22} color="#4F46E5" />
              <Text style={styles.actionText}>Ver citas</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('AppointmentForm')}
            >
              <Ionicons name="add-circle-outline" size={22} color="#4F46E5" />
              <Text style={styles.actionText}>Nueva cita</Text>
            </TouchableOpacity>
            
            {isProfessional && (
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => {
                  navigation.navigate('Patients', { screen: 'PatientList' });
                }}
              >
                <Ionicons name="people-outline" size={22} color="#4F46E5" />
                <Text style={styles.actionText}>Ver pacientes</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollView: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  date: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  statsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
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
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statTitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  actionsContainer: {
    marginBottom: 24,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionButton: {
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
  },
  actionText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
  },
});

export default HomeScreen;
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/dashboard/HomeScreen';
import PatientsNavigator from './PatientsNavigator';
import AppointmentsNavigator from './AppointmentsNavigator';
import ProfileScreen from '../screens/dashboard/ProfileScreen';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '@healthtrack/types';

// Define our dashboard tab navigator param list
export type DashboardTabParamList = {
  Home: undefined;
  Patients: undefined;
  Appointments: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<DashboardTabParamList>();

const DashboardNavigator = () => {
  const { user } = useAuth();
  const isProfessional = user?.role === UserRole.PROFESSIONAL || user?.role === UserRole.ADMIN;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Patients') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Appointments') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-circle';
          }

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4F46E5',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      
      {/* Only show Patients tab for professionals */}
      {isProfessional && (
        <Tab.Screen name="Patients" component={PatientsNavigator} />
      )}
      
      <Tab.Screen name="Appointments" component={AppointmentsNavigator} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default DashboardNavigator;
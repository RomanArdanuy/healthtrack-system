// apps/mobile/healthtrack/src/screens/dashboard/ProfileScreen.tsx
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Button, Avatar, Divider } from '@rneui/themed';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../hooks/useAuth';
import { appColors, componentStyles } from '../../styles';

const ProfileScreen = () => {
  const { user, logout } = useAuth();
  
  const handleLogout = async () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Está seguro que desea cerrar la sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar sesión',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              console.error('Error al cerrar sesión:', error);
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };
  
  const handleEditProfile = () => {
    // Aquí iría la navegación a la pantalla de edición de perfil
    // cuando la tengas implementada
    Alert.alert('Información', 'Funcionalidad de edición de perfil próximamente disponible');
  };
  
  // Si no hay usuario autenticado, mostrar un mensaje
  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: appColors.background }}>
        <Text style={{ fontSize: 16, color: appColors.textSecondary }}>
          No hay información de usuario disponible
        </Text>
      </View>
    );
  }
  
  // Obtener las iniciales del nombre y apellido para el avatar
  const getInitials = () => {
    const name = user.name || '';
    const surname = user.surname || '';
    return `${name.charAt(0)}${surname.charAt(0)}`.toUpperCase();
  };
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: appColors.background }}>
      <ScrollView style={{ flex: 1 }}>
        <View style={{ padding: 16 }}>
          {/* Cabecera del perfil con avatar */}
          <View style={{ 
            backgroundColor: 'white', 
            borderRadius: 12, 
            padding: 16, 
            marginBottom: 16,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 2,
          }}>
            <Avatar
              size={100}
              rounded
              title={getInitials()}
              containerStyle={{ 
                backgroundColor: appColors.primary,
                marginBottom: 16 
              }}
            />
            <Text style={{ fontSize: 22, fontWeight: 'bold', color: appColors.textPrimary }}>
              {user.name} {user.surname}
            </Text>
            <Text style={{ fontSize: 16, color: appColors.textSecondary, marginTop: 4 }}>
              {user.email}
            </Text>
            <Button
              {...componentStyles.Button.base}
              {...componentStyles.Button.outline}
              title="Editar perfil"
              icon={<Ionicons name="create-outline" size={16} color={appColors.primary} style={{ marginRight: 8 }} />}
              onPress={handleEditProfile}
              containerStyle={{ marginTop: 16, width: '100%' }}
            />
          </View>

          {/* Información de contacto */}
          <View style={{ 
            backgroundColor: 'white', 
            borderRadius: 12, 
            padding: 16, 
            marginBottom: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 2,
          }}>
            <Text style={{ fontSize: 18, fontWeight: '600', color: appColors.textPrimary, marginBottom: 16 }}>
              Información de contacto
            </Text>
            
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <Ionicons name="mail-outline" size={20} color={appColors.primary} style={{ marginRight: 12 }} />
              <View>
                <Text style={{ fontSize: 14, color: appColors.textTertiary }}>Correo electrónico</Text>
                <Text style={{ fontSize: 16, color: appColors.textPrimary }}>{user.email}</Text>
              </View>
            </View>
            
            {user.phone && (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <Ionicons name="call-outline" size={20} color={appColors.primary} style={{ marginRight: 12 }} />
                <View>
                  <Text style={{ fontSize: 14, color: appColors.textTertiary }}>Teléfono</Text>
                  <Text style={{ fontSize: 16, color: appColors.textPrimary }}>{user.phone}</Text>
                </View>
              </View>
            )}
          </View>

          {/* Información de la cuenta */}
          <View style={{ 
            backgroundColor: 'white', 
            borderRadius: 12, 
            padding: 16, 
            marginBottom: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 2,
          }}>
            <Text style={{ fontSize: 18, fontWeight: '600', color: appColors.textPrimary, marginBottom: 16 }}>
              Información de la cuenta
            </Text>
            
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <Ionicons name="person-outline" size={20} color={appColors.primary} style={{ marginRight: 12 }} />
              <View>
                <Text style={{ fontSize: 14, color: appColors.textTertiary }}>Tipo de cuenta</Text>
                <Text style={{ fontSize: 16, color: appColors.textPrimary }}>
                  {user.role === 'professional' ? 'Profesional' : 
                   user.role === 'admin' ? 'Administrador' : 'Paciente'}
                </Text>
              </View>
            </View>
          </View>

          {/* Botón de cerrar sesión */}
          <Button
            {...componentStyles.Button.base}
            type="outline"
            title="Cerrar sesión"
            buttonStyle={{ borderColor: appColors.error }}
            titleStyle={{ color: appColors.error }}
            icon={<Ionicons name="log-out-outline" size={18} color={appColors.error} style={{ marginRight: 8 }} />}
            onPress={handleLogout}
            containerStyle={{ marginTop: 8 }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
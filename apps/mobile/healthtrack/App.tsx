import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>HealthTrack</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>Monitorización de Salud</Text>
        <Text style={styles.subtitle}>
          Mantenga un seguimiento de sus signos vitales y comuníquese con su médico
        </Text>
        
        <View style={styles.cardContainer}>
          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardTitle}>Mis Mediciones</Text>
            <Text style={styles.cardDescription}>
              Registre y visualice sus signos vitales
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardTitle}>Mis Alertas</Text>
            <Text style={styles.cardDescription}>
              Ver notificaciones de su médico
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardTitle}>Mis Citas</Text>
            <Text style={styles.cardDescription}>
              Gestione sus próximas visitas médicas
            </Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Conectar Dispositivo</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2563eb',
    padding: 16,
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  cardContainer: {
    marginBottom: 24,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
  },
  button: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
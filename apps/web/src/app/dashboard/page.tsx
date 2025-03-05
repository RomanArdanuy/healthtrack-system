'use client';

import { useState, useEffect } from 'react';
import { api } from '@healthtrack/api';
import { Card } from '@healthtrack/ui';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalPatients: 0,
    activeAlerts: 0,
    todayAppointments: 0
  });

  // Este es solo un ejemplo de cómo importarías y usarías el paquete API
  // En una implementación real, conectarías con tu backend
  useEffect(() => {
    // Simulamos la carga de datos
    const loadData = async () => {
      try {
        // En una implementación real, estas serían llamadas a la API
        // const patients = await api.patient.getPatients();
        // const alerts = await api.alert.getPatientAlerts("all");
        
        // Por ahora, solo usamos datos de ejemplo
        setStats({
          totalPatients: 128,
          activeAlerts: 5,
          todayAppointments: 24
        });
      } catch (error) {
        console.error("Error loading dashboard data", error);
      }
    };

    loadData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Panel de Control</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card title="Pacientes Totales" className="bg-white shadow rounded-lg p-4">
          <p className="text-3xl font-bold">{stats.totalPatients}</p>
        </Card>
        
        <Card title="Alertas Activas" className="bg-white shadow rounded-lg p-4">
          <p className="text-3xl font-bold text-red-500">{stats.activeAlerts}</p>
        </Card>
        
        <Card title="Citas Hoy" className="bg-white shadow rounded-lg p-4">
          <p className="text-3xl font-bold text-blue-500">{stats.todayAppointments}</p>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card 
          title="Pacientes Recientes" 
          className="bg-white shadow rounded-lg p-4"
        >
          <ul className="divide-y">
            <li className="py-3">Juan Pérez - Hipertensión</li>
            <li className="py-3">María García - Diabetes</li>
            <li className="py-3">Carlos López - Asma</li>
          </ul>
        </Card>
        
        <Card 
          title="Alertas Pendientes" 
          className="bg-white shadow rounded-lg p-4"
        >
          <ul className="divide-y">
            <li className="py-3 text-red-600">
              Ana Martínez - Presión arterial elevada
            </li>
            <li className="py-3 text-orange-500">
              José Rodríguez - Glucosa baja
            </li>
            <li className="py-3 text-red-600">
              Luis Sánchez - Frecuencia cardíaca irregular
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
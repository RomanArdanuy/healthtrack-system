//dashboard page
'use client';

import { useEffect, useState } from 'react';
import { useApi } from '../../providers/ApiProvider';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Users, 
  Calendar, 
  Clock, 
  Activity,
  AlertTriangle
} from 'lucide-react';
import { AppointmentStatus } from '@healthtrack/types';

// Define interfaces for our activity data
interface ActivityItem {
  id: string;
  type: 'appointment' | 'patient' | 'measurement';
  title: string;
  description: string;
  date: string;
}

interface DashboardStats {
  totalPatients: number;
  upcomingAppointments: number;
  overdueAppointments: number;
  recentActivity: ActivityItem[];
}

export default function Dashboard() {
  const api = useApi();
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    upcomingAppointments: 0,
    overdueAppointments: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Normally you would fetch this data from your API
        // const patients = await api.patients.getAll();
        // const appointments = await api.appointments.getUpcoming();
        
        // For demo purposes, we'll use mock data
        const mockData: DashboardStats = {
          totalPatients: 48,
          upcomingAppointments: 12,
          overdueAppointments: 3,
          recentActivity: [
            { 
              id: '1', 
              type: 'appointment', 
              title: 'Nueva cita programada', 
              description: 'Cita con Juan García el 15 de Marzo', 
              date: new Date(2023, 2, 15).toISOString() 
            },
            { 
              id: '2', 
              type: 'patient', 
              title: 'Nuevo paciente registrado', 
              description: 'María López ha sido registrada', 
              date: new Date(2023, 2, 10).toISOString() 
            },
            { 
              id: '3', 
              type: 'measurement', 
              title: 'Nuevas mediciones registradas', 
              description: 'Actualizadas mediciones para Carlos Ruiz', 
              date: new Date(2023, 2, 9).toISOString() 
            }
          ]
        };
        
        setStats(mockData);
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('No se pudieron cargar los datos del dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusIcon = (type: string) => {
    switch (type) {
      case 'appointment':
        return <Calendar className="h-4 w-4 text-blue-500" />;
      case 'patient':
        return <Users className="h-4 w-4 text-green-500" />;
      case 'measurement':
        return <Activity className="h-4 w-4 text-purple-500" />;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Total Patients */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Pacientes</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPatients}</div>
            <p className="text-xs text-muted-foreground">
              +4 nuevos esta semana
            </p>
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Citas Próximas</CardTitle>
            <Calendar className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingAppointments}</div>
            <p className="text-xs text-muted-foreground">
              5 para esta semana
            </p>
          </CardContent>
        </Card>

        {/* Overdue Appointments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Citas Pendientes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overdueAppointments}</div>
            <p className="text-xs text-muted-foreground">
              Requieren atención
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
          <CardDescription>
            Las últimas actualizaciones en tu sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4">
                <div className="rounded-full p-2 bg-gray-100 dark:bg-gray-800">
                  {getStatusIcon(activity.type)}
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {activity.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(activity.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
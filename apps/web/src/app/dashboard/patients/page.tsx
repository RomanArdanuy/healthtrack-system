// apps/web/src/app/dashboard/patients/page.tsx
'use client';

import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useApi } from '../../../providers/ApiProvider';

interface Patient {
  id: string;
  name: string;
  surname: string;
  email: string;
  phone?: string;
  createdAt: string;
}

export default function PatientsPage() {
  const api = useApi();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        
        // Normally you would fetch this from your API
        // const data = await api.patients.getAll();
        
        // Mock data for demonstration
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
      } catch (error) {
        console.error("Error fetching patients:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPatients();
  }, []);
  
  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Pacientes</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Nuevo Paciente
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Lista de Pacientes</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Cargando pacientes...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Fecha de registro</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">
                      {patient.name} {patient.surname}
                    </TableCell>
                    <TableCell>{patient.email}</TableCell>
                    <TableCell>{patient.phone || '-'}</TableCell>
                    <TableCell>{new Date(patient.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Ver
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
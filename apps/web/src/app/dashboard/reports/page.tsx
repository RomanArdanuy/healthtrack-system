// apps/web/src/app/dashboard/reports/page.tsx
'use client';

import { useState } from 'react';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText, Download } from 'lucide-react';

export default function ReportsPage() {
  const [reportType, setReportType] = useState('patients');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleGenerateReport = () => {
    setLoading(true);
    // Aquí implementarías la lógica para generar el informe
    setTimeout(() => {
      setLoading(false);
      alert('Informe generado con éxito');
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Informes</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Generar Informe</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="report-type" className="block text-sm font-medium mb-1">Tipo de Informe</Label>
                <Select 
                  value={reportType} 
                  onValueChange={setReportType}
                >
                  <SelectTrigger id="report-type">
                    <SelectValue placeholder="Seleccionar tipo de informe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="patients">Pacientes</SelectItem>
                    <SelectItem value="appointments">Citas</SelectItem>
                    <SelectItem value="measurements">Mediciones</SelectItem>
                    <SelectItem value="activity">Actividad del Sistema</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4 grid-cols-2">
                <div>
                  <Label htmlFor="start-date" className="block text-sm font-medium mb-1">Fecha de Inicio</Label>
                  <Input 
                    id="start-date"
                    type="date" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="end-date" className="block text-sm font-medium mb-1">Fecha de Fin</Label>
                  <Input 
                    id="end-date"
                    type="date" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              <Button 
                onClick={handleGenerateReport} 
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Generando...' : 'Generar Informe'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informes Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { 
                  id: '1', 
                  name: 'Informe de Pacientes - Marzo 2023', 
                  date: '2023-03-15', 
                  type: 'patients' 
                },
                { 
                  id: '2', 
                  name: 'Actividad del Sistema - Febrero 2023', 
                  date: '2023-02-28', 
                  type: 'activity' 
                },
                { 
                  id: '3', 
                  name: 'Historial de Citas - Enero 2023', 
                  date: '2023-01-31', 
                  type: 'appointments' 
                }
              ].map((report) => (
                <div 
                  key={report.id} 
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium">{report.name}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(report.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Descargar
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
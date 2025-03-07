'use client';

import { useState } from 'react';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Switch 
} from '@/components/ui/switch';
import { useAuth } from '@/hooks/useAuth';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Check } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const [profile, setProfile] = useState({
    name: user?.name || '',
    surname: user?.surname || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    appointments: true,
    updates: false,
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // Simular una llamada API
    setTimeout(() => {
      setSaving(false);
      setSuccess(true);
      
      // Ocultar mensaje de éxito después de unos segundos
      setTimeout(() => setSuccess(false), 3000);
    }, 1000);
  };

  const handleNotificationChange = (key: string, checked: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: checked }));
  };

  const handleSaveNotifications = () => {
    setSaving(true);
    
    // Simular una llamada API
    setTimeout(() => {
      setSaving(false);
      setSuccess(true);
      
      // Ocultar mensaje de éxito después de unos segundos
      setTimeout(() => setSuccess(false), 3000);
    }, 1000);
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Configuración</h1>
      </div>

      {success && (
        <Alert className="mb-6 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900">
          <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertTitle>Guardado con éxito</AlertTitle>
          <AlertDescription>
            Los cambios se han guardado correctamente.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
          <TabsTrigger value="security">Seguridad</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Información de Perfil</CardTitle>
              <CardDescription>
                Actualiza tu información personal
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSaveProfile}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre</Label>
                    <Input 
                      id="name"
                      name="name"
                      value={profile.name}
                      onChange={handleProfileChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="surname">Apellidos</Label>
                    <Input 
                      id="surname"
                      name="surname"
                      value={profile.surname}
                      onChange={handleProfileChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input 
                    id="email"
                    name="email"
                    type="email"
                    value={profile.email}
                    onChange={handleProfileChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input 
                    id="phone"
                    name="phone"
                    value={profile.phone}
                    onChange={handleProfileChange}
                  />
                </div>
              </CardContent>
              
              <CardFooter>
                <Button type="submit" disabled={saving}>
                  {saving ? 'Guardando...' : 'Guardar cambios'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Preferencias de Notificaciones</CardTitle>
              <CardDescription>
                Configura cómo y cuándo quieres recibir notificaciones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Canales de notificación</h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications" className="font-medium">
                      Correo electrónico
                    </Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Recibir notificaciones por correo electrónico
                    </p>
                  </div>
                  <Switch 
                    id="email-notifications" 
                    checked={notifications.email}
                    onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="push-notifications" className="font-medium">
                      Notificaciones push
                    </Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Recibir notificaciones en el navegador
                    </p>
                  </div>
                  <Switch 
                    id="push-notifications" 
                    checked={notifications.push}
                    onCheckedChange={(checked) => handleNotificationChange('push', checked)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Tipos de notificaciones</h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="appointment-notifications" className="font-medium">
                      Citas
                    </Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Recordatorios de citas y cambios
                    </p>
                  </div>
                  <Switch 
                    id="appointment-notifications" 
                    checked={notifications.appointments}
                    onCheckedChange={(checked) => handleNotificationChange('appointments', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="update-notifications" className="font-medium">
                      Actualizaciones del sistema
                    </Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Nuevas características y mejoras
                    </p>
                  </div>
                  <Switch 
                    id="update-notifications" 
                    checked={notifications.updates}
                    onCheckedChange={(checked) => handleNotificationChange('updates', checked)}
                  />
                </div>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                onClick={handleSaveNotifications} 
                disabled={saving}
              >
                {saving ? 'Guardando...' : 'Guardar preferencias'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Seguridad de la cuenta</CardTitle>
              <CardDescription>
                Gestiona la seguridad de tu cuenta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Contraseña actual</Label>
                <Input 
                  id="current-password"
                  type="password"
                  placeholder="••••••••"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-password">Nueva contraseña</Label>
                <Input 
                  id="new-password"
                  type="password"
                  placeholder="••••••••"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmar contraseña</Label>
                <Input 
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                />
              </div>

              <div className="pt-4">
                <h3 className="text-lg font-medium mb-2">Sesiones activas</h3>
                <div className="rounded-md border p-3 bg-gray-50 dark:bg-gray-800 mb-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Navegador actual</p>
                      <p className="text-sm text-gray-500">
                        Windows • Chrome • {new Date().toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded">
                      Actual
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button variant="outline" className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300">
                Cerrar todas las sesiones
              </Button>
              <Button>
                Actualizar contraseña
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
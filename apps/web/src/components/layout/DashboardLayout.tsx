import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  FileText, 
  Settings, 
  Menu, 
  LogOut 
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  
  // Determine active path
  const isActivePath = (path: string) => {
    return pathname === path;
  };

  const navItems = [
    { title: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { title: 'Pacientes', icon: <Users size={20} />, path: '/dashboard/patients' },
    { title: 'Citas', icon: <Calendar size={20} />, path: '/dashboard/appointments' },
    { title: 'Informes', icon: <FileText size={20} />, path: '/dashboard/reports' },
    { title: 'Configuración', icon: <Settings size={20} />, path: '/dashboard/settings' },
  ];

  const handleLogout = async () => {
    await logout();
    // La función logout ya maneja la redirección
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar - desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white dark:bg-gray-800 border-r">
          <div className="flex items-center justify-center h-14">
            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">HealthTrack</span>
          </div>
          <Separator />
          <nav className="flex-1 px-2 mt-5 space-y-1">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                href={item.path}
                className={`flex items-center px-4 py-3 text-sm rounded-md group ${
                  isActivePath(item.path) 
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {item.icon}
                <span className="ml-3">{item.title}</span>
              </Link>
            ))}
          </nav>
          <div className="p-4">
            <Button 
              className="w-full justify-start" 
              onClick={handleLogout}
              variant="outline"
            >
              <LogOut size={20} className="mr-2" />
              Cerrar sesión
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" className="absolute top-4 left-4 z-10 p-2">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent className="p-0" side="left">
            <div className="flex items-center justify-center h-14">
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">HealthTrack</span>
            </div>
            <Separator />
            <nav className="flex-1 px-2 mt-5 space-y-1">
              {navItems.map((item) => (
                <Link 
                  key={item.path} 
                  href={item.path}
                  className={`flex items-center px-4 py-3 text-sm rounded-md group ${
                    isActivePath(item.path) 
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {item.icon}
                  <span className="ml-3">{item.title}</span>
                </Link>
              ))}
            </nav>
            <div className="p-4">
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={handleLogout}
              >
                <LogOut size={20} className="mr-2" />
                Cerrar sesión
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top header */}
        <header className="w-full h-16 bg-white dark:bg-gray-800 shadow-sm flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200 md:ml-0 ml-10">
            Panel de Control
          </h1>
          <div className="flex items-center">
            {user && (
              <div className="text-sm text-gray-700 dark:text-gray-300 mr-4">
                {user.name} {user.surname}
              </div>
            )}
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 p-6 overflow-y-auto bg-gray-100 dark:bg-gray-900">
          {children}
        </main>
      </div>
    </div>
  );
}
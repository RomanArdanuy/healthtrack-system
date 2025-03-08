'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
    children: React.ReactNode;

}

export function AuthGuard({ children }: AuthGuardProps) {
    const { user, loading, getProfile } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const publicRoutes = ['/', '/login', '/forgot-password'];
        const isPublicRoute = publicRoutes.includes(pathname);
        async function checkAuth() {
            try {
                // Si ya tenemos información del usuario, no es necesario verificar
                if (user) {
                setIsChecking(false);
                return;
                }
        
                // Si no tenemos información del usuario y no estamos cargando, verificamos el perfil
                if (!loading) {
                // Intentar obtener el perfil del usuario
                await getProfile();
                }
            } catch (error) {
                // Si hay un error y no estamos en una ruta pública, redirigir al login
                if (!isPublicRoute) {
                router.push('/login');
                }
            } finally {
                setIsChecking(false);
            }
            }
        
            // Si estamos en una ruta pública, no es necesario verificar
            if (isPublicRoute) {
            setIsChecking(false);
            return;
            }
        
            checkAuth();
    }, [user, loading, pathname, router, getProfile]);     

  // Mientras verificamos la autenticación, mostramos un loader
  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }
  // Si estamos en una ruta protegida y no hay usuario, redirect se maneja en el useEffect
  // Esto permite que no se renderice el contenido protegido mientras se redirige
  const publicRoutes = ['/', '/login', '/forgot-password'];
  const isPublicRoute = publicRoutes.includes(pathname);

  if (!isPublicRoute && !user && !loading) {
    return null;
  }

  // Si todo está bien, renderizamos el contenido
  return <>{children}</>;

}


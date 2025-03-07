'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="text-center max-w-3xl">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">HealthTrack System</h1>
        <p className="text-xl text-gray-700 dark:text-gray-300 mb-12">
          Gestión hospitalaria y monitorización remota de pacientes
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/login">
            <Button className="px-8 py-6 text-lg">
              Iniciar sesión
            </Button>
          </Link>
          
          <Link href="/dashboard">
            <Button variant="outline" className="px-8 py-6 text-lg">
              Ver demo
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
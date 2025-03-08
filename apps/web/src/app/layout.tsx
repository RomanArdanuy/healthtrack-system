'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '../hooks/useAuth';
import { ApiProvider } from '../providers/ApiProvider';
import { AuthGuard } from '@/components/auth/AuthGuard';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          <ApiProvider>
            <AuthGuard>
              {children}
            </AuthGuard>
          </ApiProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
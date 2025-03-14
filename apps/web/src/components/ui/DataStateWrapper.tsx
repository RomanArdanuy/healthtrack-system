import React from 'react';
import { Loader } from "lucide-react"
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface DataStateWrapperProps {
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
  children: React.ReactNode;
  loadingText?: string;
}

export function DataStateWrapper({
  loading,
  error,
  onRetry,
  children,
  loadingText = 'Cargando datos...'
}: DataStateWrapperProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 w-full">
        <Loader className="h-6 w-6 animate-spin" />
        <p className="mt-2 text-gray-500">{loadingText}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 w-full">
        <div className="flex items-center mb-2 text-red-500">
          <AlertCircle className="mr-2" />
          <p className="font-medium">Error</p>
        </div>
        <p className="text-center mb-4">{error}</p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline">
            Reintentar
          </Button>
        )}
      </div>
    );
  }

  return <>{children}</>;
}
// apps/mobile/healthtrack/src/components/ui/Card.tsx
import React, { ReactNode } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <View className={`bg-card rounded-lg shadow p-4 mb-4 ${className}`}>
      {children}
    </View>
  );
};

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '' }) => {
  return (
    <View className={`mb-3 ${className}`}>
      {children}
    </View>
  );
};

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

export const CardTitle: React.FC<CardTitleProps> = ({ children, className = '' }) => {
  return (
    <Text className={`font-bold text-lg text-text-primary ${className}`}>
      {children}
    </Text>
  );
};

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({ children, className = '' }) => {
  return (
    <View className={className}>
      {children}
    </View>
  );
};

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className = '' }) => {
  return (
    <View className={`mt-3 pt-3 border-t border-gray-200 ${className}`}>
      {children}
    </View>
  );
};

// Exportar todos los componentes juntos
export default {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
};
// apps/mobile/healthtrack/src/styles/theme.ts
import { createTheme } from '@rneui/themed';
import { TextStyle } from 'react-native';

// Nuestros colores personalizados como constantes
export const appColors = {
  primary: '#4F46E5',     // Indigo
  secondary: '#10B981',   // Emerald
  error: '#EF4444',       // Red
  warning: '#F59E0B',     // Amber
  info: '#3B82F6',        // Blue
  success: '#22C55E',     // Green
  background: '#F3F4F6',  // Gray-100
  card: '#FFFFFF',        // White
  textPrimary: '#1F2937',   // Gray-800
  textSecondary: '#4B5563', // Gray-600 
  textTertiary: '#6B7280',  // Gray-500
  textDisabled: '#9CA3AF',  // Gray-400
  border: '#E5E7EB',      // Gray-200
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  pill: 999,
};

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
};

// Usar los valores exactos que TypeScript espera para fontWeight
export const fontWeight: Record<string, TextStyle['fontWeight']> = {
  normal: 'normal',
  medium: '500',
  semibold: '600',
  bold: 'bold',
};

// Crear el tema para React Native Elements
export const theme = createTheme({
  lightColors: {
    primary: appColors.primary,
    secondary: appColors.secondary,
    background: appColors.background,
    white: appColors.card,
    black: appColors.textPrimary,
    grey0: appColors.textPrimary,
    grey1: appColors.textSecondary,
    grey2: appColors.textTertiary,
    grey3: appColors.textDisabled,
    grey4: appColors.border,
    success: appColors.success,
    warning: appColors.warning,
    error: appColors.error,
  },
  mode: 'light',
});
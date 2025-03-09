// apps/mobile/healthtrack/src/components/ui/Button.tsx
import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: string; // Ionicons name
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
  textClassName?: string;
}

const Button: React.FC<ButtonProps> = ({
  onPress,
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  fullWidth = false,
  className = '',
  textClassName = '',
}) => {
  // Base classes for different button variants
  const getVariantClasses = (): string => {
    switch (variant) {
      case 'primary':
        return 'bg-primary';
      case 'secondary':
        return 'bg-secondary';
      case 'outline':
        return 'bg-transparent border border-primary';
      case 'ghost':
        return 'bg-transparent';
      case 'danger':
        return 'bg-error';
      default:
        return 'bg-primary';
    }
  };

  // Base classes for different button sizes
  const getSizeClasses = (): string => {
    switch (size) {
      case 'sm':
        return 'py-1 px-3';
      case 'md':
        return 'py-2 px-4';
      case 'lg':
        return 'py-3 px-6';
      default:
        return 'py-2 px-4';
    }
  };

  // Text color based on variant
  const getTextColorClass = (): string => {
    switch (variant) {
      case 'outline':
      case 'ghost':
        return 'text-primary';
      default:
        return 'text-white';
    }
  };

  // Text size based on button size
  const getTextSizeClass = (): string => {
    switch (size) {
      case 'sm':
        return 'text-sm';
      case 'md':
        return 'text-base';
      case 'lg':
        return 'text-lg';
      default:
        return 'text-base';
    }
  };

  // Icon size based on button size
  const getIconSize = (): number => {
    switch (size) {
      case 'sm':
        return 16;
      case 'md':
        return 20;
      case 'lg':
        return 24;
      default:
        return 20;
    }
  };

  // Icon color based on variant
  const getIconColor = (): string => {
    switch (variant) {
      case 'outline':
      case 'ghost':
        return '#4F46E5'; // primary color
      default:
        return '#FFFFFF'; // white
    }
  };

  // Combine all classes
  const buttonClasses = `
    rounded-md
    items-center
    justify-center
    flex-row
    ${getSizeClasses()}
    ${getVariantClasses()}
    ${disabled || loading ? 'opacity-50' : 'opacity-100'}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `;

  const textClasses = `
    font-medium
    ${getTextColorClass()}
    ${getTextSizeClass()}
    ${textClassName}
  `;

  return (
    <TouchableOpacity
      className={buttonClasses}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'outline' || variant === 'ghost' ? '#4F46E5' : '#FFFFFF'} 
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <Ionicons 
              name={icon as any} 
              size={getIconSize()} 
              color={getIconColor()} 
              style={{ marginRight: 6 }} 
            />
          )}
          <Text className={textClasses}>{children}</Text>
          {icon && iconPosition === 'right' && (
            <Ionicons 
              name={icon as any} 
              size={getIconSize()} 
              color={getIconColor()} 
              style={{ marginLeft: 6 }} 
            />
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

export default Button;
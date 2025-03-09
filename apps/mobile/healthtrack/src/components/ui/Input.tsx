// apps/mobile/healthtrack/src/components/ui/Input.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: string; // Ionicons name
  iconPosition?: 'left' | 'right';
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  secureTextEntry?: boolean;
  togglePassword?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  iconPosition = 'left',
  className = '',
  inputClassName = '',
  labelClassName = '',
  errorClassName = '',
  secureTextEntry,
  togglePassword,
  ...rest
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Determine actual secureTextEntry value based on togglePassword state
  const isSecureTextEntry = secureTextEntry && !isPasswordVisible;

  return (
    <View className={`mb-4 ${className}`}>
      {label && (
        <Text className={`text-text-primary font-medium mb-1 ${labelClassName}`}>
          {label}
        </Text>
      )}
      <View className="relative">
        {icon && iconPosition === 'left' && (
          <View className="absolute left-3 top-0 bottom-0 justify-center z-10">
            <Ionicons name={icon as any} size={20} color="#6B7280" />
          </View>
        )}
        
        <TextInput
          className={`
            bg-gray-50 
            border 
            border-gray-200 
            rounded-md 
            py-2 
            px-3
            text-text-primary
            ${icon && iconPosition === 'left' ? 'pl-10' : ''}
            ${(icon && iconPosition === 'right') || (secureTextEntry && togglePassword) ? 'pr-10' : ''}
            ${error ? 'border-error' : 'border-gray-200'}
            ${inputClassName}
          `}
          secureTextEntry={isSecureTextEntry}
          {...rest}
        />
        
        {icon && iconPosition === 'right' && !togglePassword && (
          <View className="absolute right-3 top-0 bottom-0 justify-center z-10">
            <Ionicons name={icon as any} size={20} color="#6B7280" />
          </View>
        )}
        
        {secureTextEntry && togglePassword && (
          <TouchableOpacity
            className="absolute right-3 top-0 bottom-0 justify-center z-10"
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            <Ionicons 
              name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'} 
              size={20} 
              color="#6B7280" 
            />
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <Text className={`text-error text-sm mt-1 ${errorClassName}`}>
          {error}
        </Text>
      )}
    </View>
  );
};

export default Input;
// apps/mobile/healthtrack/src/styles/componentStyles.ts
import { appColors, spacing, radius, fontWeight } from './theme';
import { ButtonProps } from '@rneui/themed';

// Estilos para sobrescribir los componentes de React Native Elements
export const componentStyles = {
    Button: {
        base: {
          raised: true,
          buttonStyle: {
            borderRadius: radius.md,
          },
          titleStyle: {
            fontWeight: fontWeight.medium,
          },
        },
        primary: {
          buttonStyle: {
            backgroundColor: appColors.primary,
          },
          titleStyle: {
            color: 'white',
          },
        },
        secondary: {
          buttonStyle: {
            backgroundColor: appColors.secondary,
          },
          titleStyle: {
            color: 'white',
          },
        },
        outline: {
          type: 'outline' as ButtonProps['type'],  // Añadir aserción de tipo aquí
          buttonStyle: {
            borderColor: appColors.primary,
            borderWidth: 1,
            backgroundColor: 'transparent',
          },
          titleStyle: {
            color: appColors.primary,
          },
        },
        danger: {
          buttonStyle: {
            backgroundColor: appColors.error,
          },
          titleStyle: {
            color: 'white',
          },
        },
        cancel: {
          buttonStyle: {
            borderColor: appColors.textTertiary,
          },
          titleStyle: {
            color: appColors.textTertiary,
          },
        },
      },
  Card: {
    containerStyle: {
      borderRadius: radius.md,
      padding: spacing.md,
      margin: spacing.xs,
    },
  },
  Input: {
    inputContainerStyle: {
      borderBottomWidth: 1,
    },
    labelStyle: {
      color: appColors.textPrimary,
      fontWeight: fontWeight.medium,
    },
  },
  SearchBar: {
    containerStyle: {
      backgroundColor: 'transparent',
      borderTopWidth: 0,
      borderBottomWidth: 0,
      paddingHorizontal: 0,
    },
    inputContainerStyle: {
      backgroundColor: appColors.card,
      borderRadius: radius.md,
    },
  },
};
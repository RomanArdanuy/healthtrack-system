// apps/mobile/healthtrack/src/styles/common.ts
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { appColors, spacing, radius, fontSize, fontWeight } from './theme';

type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle };

// Definir el tipo de estilos explícitamente
type GlobalStylesType = {
  container: ViewStyle;
  contentContainer: ViewStyle;
  row: ViewStyle;
  spaceBetween: ViewStyle;
  card: ViewStyle;
  title: TextStyle;
  subtitle: TextStyle;
  text: TextStyle;
  textSecondary: TextStyle;
  caption: TextStyle;
  mb: ViewStyle;
  mt: ViewStyle;
  my: ViewStyle;
  mr: ViewStyle;
  ml: ViewStyle;
  mx: ViewStyle;
  p: ViewStyle;
  pt: ViewStyle;
  pb: ViewStyle;
  pl: ViewStyle;
  pr: ViewStyle;
  px: ViewStyle;
  py: ViewStyle;
  divider: ViewStyle;
  error: TextStyle;
};

// Crear los estilos con tipado seguro
export const globalStyles = StyleSheet.create<GlobalStylesType>({
  container: {
    flex: 1,
    backgroundColor: appColors.background,
  },
  contentContainer: {
    padding: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: appColors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: appColors.border,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: appColors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: appColors.textPrimary,
    marginBottom: spacing.sm,
  },
  text: {
    fontSize: fontSize.md,
    color: appColors.textPrimary,
  },
  textSecondary: {
    fontSize: fontSize.md,
    color: appColors.textSecondary,
  },
  caption: {
    fontSize: fontSize.sm,
    color: appColors.textTertiary,
  },
  mb: {
    marginBottom: spacing.md,
  },
  mt: {
    marginTop: spacing.md,
  },
  my: {
    marginVertical: spacing.md,
  },
  mr: {
    marginRight: spacing.md,
  },
  ml: {
    marginLeft: spacing.md,
  },
  mx: {
    marginHorizontal: spacing.md,
  },
  p: {
    padding: spacing.md,
  },
  pt: {
    paddingTop: spacing.md,
  },
  pb: {
    paddingBottom: spacing.md,
  },
  pl: {
    paddingLeft: spacing.md,
  },
  pr: {
    paddingRight: spacing.md,
  },
  px: {
    paddingHorizontal: spacing.md,
  },
  py: {
    paddingVertical: spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: appColors.border,
    marginVertical: spacing.md,
  },
  error: {
    color: appColors.error,
    fontSize: fontSize.sm,
  },
});
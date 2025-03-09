// apps/mobile/healthtrack/src/hooks/useAuth.ts
import { createAuthContext, createUseAuth } from '@healthtrack/auth';

// Crear una instancia del contexto de autenticación
const AuthContext = createAuthContext();

// Hook para usar autenticación
export const useAuth = createUseAuth(AuthContext);

// Exportar el contexto para que pueda ser usado por el provider
export { AuthContext };
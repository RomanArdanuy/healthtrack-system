import { 
    createAuthContext,
    createAuthProvider,
    createUseAuth
  } from '@healthtrack/auth';
  import { AuthStorage, AuthNavigation } from '@healthtrack/types';
  import { useRouter } from 'next/router';
  
  // Create web-specific storage implementation
  const webStorage: AuthStorage = {
    getToken: async () => {
      return localStorage.getItem('auth_token');
    },
    setToken: async (token: string) => {
      localStorage.setItem('auth_token', token);
    },
    removeToken: async () => {
      localStorage.removeItem('auth_token');
    }
  };
  
  // Create the auth context
  const AuthContext = createAuthContext();
  
  // Create the auth provider component with web-specific implementations
  export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    
    // Web-specific navigation implementation
    const webNavigation: AuthNavigation = {
      navigateToHome: () => {
        router.push('/dashboard');
      },
      navigateToLogin: () => {
        router.push('/login');
      }
    };
    
    // Use the shared AuthProvider with web-specific adapters
    const AuthProviderComponent = createAuthProvider(AuthContext, webStorage, webNavigation);
    
    // Return the component with children - note the curly braces and proper JSX syntax
    return AuthProviderComponent({ children });
  };
  
  // Create the useAuth hook
  export const useAuth = createUseAuth(AuthContext);
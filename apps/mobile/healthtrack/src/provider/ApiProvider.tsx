import { createContext, useContext, useState, useEffect } from 'react';
import { createApi } from '@healthtrack/api'
import AsyncStorage from '@react-native-async-storage/async-storage';

// Definir el tipo para el contexto de la API
interface ApiContextType {
  patientsApi: ReturnType<typeof createApi>['patients'];
  appointmentsApi: ReturnType<typeof createApi>['appointments'];
  measurementsApi: ReturnType<typeof createApi>['measurements'];
  refreshApis: (newToken: string) => void;
}

// Crear el contexto
const ApiContext = createContext<ApiContextType | undefined>(undefined);

// Proveedor del contexto
export const ApiProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [apis, setApis] = useState(createApi());

  useEffect(() => {
    // Obtener el token del almacenamiento local al cargar
    const loadToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('auth_token');
        if (storedToken) {
          setToken(storedToken);
          setApis(createApi(storedToken));
        }
      } catch (err) {
        console.error('Error loading token:', err);
      }
    };

    loadToken();
  }, []);

  // Función para actualizar las APIs con un nuevo token
  const refreshApis = (newToken: string) => {
    setToken(newToken);
    setApis(createApi(newToken));
  };

  return (
    <ApiContext.Provider 
      value={{ 
        patientsApi: apis.patients, 
        appointmentsApi: apis.appointments, 
        measurementsApi: apis.measurements,
        refreshApis 
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

// Hook para usar el contexto
export const useApi = () => {
  const context = useContext(ApiContext);
  
  if (context === undefined) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  
  return context;
};
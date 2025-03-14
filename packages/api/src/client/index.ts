import axios, { AxiosInstance } from 'axios';
import { User, Patient, Professional, Appointment, Message, Conversation } from '@healthtrack/types';
import { getPlatformApiUrl } from '../utils/platform';

// Creamos una instancia de Axios con configuración base
const createApiClient = (baseURL?: string, token?: string): AxiosInstance => {
  // Use the platform utility to get the appropriate URL
  const apiUrl = getPlatformApiUrl(baseURL);
  
  console.log("[HealthTrack] API connecting to:", apiUrl);
  
  const apiClient = axios.create({
    baseURL: apiUrl,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 10000,
  });

  // Interceptor para añadir el token de autenticación
  apiClient.interceptors.request.use((config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("[HealthTrack] Request:", config.method?.toUpperCase(), config.url);
    return config;
  });

  // Interceptor para manejar errores de respuesta
  apiClient.interceptors.response.use(
    (response) => {
      console.log("[HealthTrack] Response success:", response.status);
      return response.data;
    },
    (error) => {
      const errorMessage = error.response?.data?.message || 'Error en la petición';
      console.error('[HealthTrack] API error:', errorMessage);
      console.error('[HealthTrack] Full error:', error.message);
      return Promise.reject(error);
    }
  );

  return apiClient;
};

// Cliente de autenticación
export const createAuthApi = (baseURL?: string) => {
  const client = createApiClient(baseURL);

  return {
    login: (email: string, password: string): Promise<{ token: string, user: User }> => 
      client.post('/auth/login', { email, password }),
    
    logout: (token: string): Promise<void> => {
      const authenticatedClient = createApiClient(baseURL, token);
      return authenticatedClient.post('/auth/logout');
    },
    
    getProfile: (token: string): Promise<User> => {
      const authenticatedClient = createApiClient(baseURL, token);
      return authenticatedClient.get('/auth/profile');
    }
  };
};

// Cliente de pacientes
export const createPatientApi = (token: string, baseURL?: string) => {
  const client = createApiClient(baseURL, token);

  return {
    getAll: (): Promise<Patient[]> => 
      client.get('/patients'),
    
    getById: (id: string): Promise<Patient> => 
      client.get(`/patients/${id}`),
    
    create: (patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>): Promise<Patient> => 
      client.post('/patients', patient),
    
    update: (id: string, patient: Partial<Patient>): Promise<Patient> => 
      client.put(`/patients/${id}`, patient),
    
    delete: (id: string): Promise<void> => 
      client.delete(`/patients/${id}`)
  };
};

// Cliente de citas
export const createAppointmentApi = (token: string, baseURL?: string) => {
  const client = createApiClient(baseURL, token);

  return {
    getAll: (): Promise<Appointment[]> => 
      client.get('/appointments'),
    
    getById: (id: string): Promise<Appointment> => 
      client.get(`/appointments/${id}`),
    
    getByPatient: (patientId: string): Promise<Appointment[]> => 
      client.get(`/appointments/patient/${patientId}`),
    
    getByProfessional: (professionalId: string): Promise<Appointment[]> => 
      client.get(`/appointments/professional/${professionalId}`),
    
    getByDate: (date: string, professionalId?: string): Promise<Appointment[]> => {
      const params = professionalId ? { professionalId } : {};
      return client.get(`/appointments/date/${date}`, { params });
    },
    
    create: (appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Appointment> => 
      client.post('/appointments', appointment),
    
    update: (id: string, appointment: Partial<Appointment>): Promise<Appointment> => 
      client.put(`/appointments/${id}`, appointment),
    
    updateStatus: (id: string, status: string): Promise<Appointment> => 
      client.patch(`/appointments/${id}/status`, { status }),
    
    delete: (id: string): Promise<void> => 
      client.delete(`/appointments/${id}`)
  };
};

// Cliente de mensajes
export const createMessageApi = (token: string, baseURL?: string) => {
  const client = createApiClient(baseURL, token);

  return {
    getConversations: (): Promise<Conversation[]> => 
      client.get('/conversations'),
    
    getMessages: (conversationId: string): Promise<Message[]> => 
      client.get(`/conversations/${conversationId}/messages`),
    
    sendMessage: (conversationId: string, content: string): Promise<Message> => 
      client.post(`/conversations/${conversationId}/messages`, { content }),
    
    markAsRead: (messageId: string): Promise<void> => 
      client.put(`/messages/${messageId}/read`)
  };
};

// Factory para crear todas las APIs
export const createApi = (token?: string, baseURL?: string) => {
  return {
    auth: createAuthApi(baseURL),
    patients: token ? createPatientApi(token, baseURL) : null,
    appointments: token ? createAppointmentApi(token, baseURL) : null,
    messages: token ? createMessageApi(token, baseURL) : null
  };
};

// Exportación por defecto para facilitar su uso
export default {
  createApi,
  createAuthApi,
  createPatientApi,
  createAppointmentApi,
  createMessageApi
};
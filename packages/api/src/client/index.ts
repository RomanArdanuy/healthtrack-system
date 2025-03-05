// packages/api/src/client/index.ts
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { User, Patient, Professional, Appointment, Message, Conversation } from '../types';

// Creamos una instancia de Axios con configuración base
const createApiClient = (baseURL?: string, token?: string): AxiosInstance => {
  const apiClient = axios.create({
    baseURL: baseURL || process.env.API_URL || 'http://localhost:3001/api',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Interceptor para añadir el token de autenticación
  apiClient.interceptors.request.use((config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Interceptor para manejar errores de respuesta
  apiClient.interceptors.response.use(
    (response) => response.data,
    (error) => {
      const errorMessage = error.response?.data?.message || 'Error en la petición';
      console.error('API error:', errorMessage);
      return Promise.reject(error);
    }
  );

  return apiClient;
};

// Cliente de autenticación
export const createAuthApi = (baseURL?: string) => {
  const client = createApiClient(baseURL);

  return {
    login: (email: string, password: string) => 
      client.post<{ token: string, user: User }>('/auth/login', { email, password }),
    
    logout: (token: string) => {
      const authenticatedClient = createApiClient(baseURL, token);
      return authenticatedClient.post('/auth/logout');
    },
    
    getProfile: (token: string) => {
      const authenticatedClient = createApiClient(baseURL, token);
      return authenticatedClient.get<User>('/auth/profile');
    }
  };
};

// Cliente de pacientes
export const createPatientApi = (token: string, baseURL?: string) => {
  const client = createApiClient(baseURL, token);

  return {
    getAll: () => 
      client.get<Patient[]>('/patients'),
    
    getById: (id: string) => 
      client.get<Patient>(`/patients/${id}`),
    
    create: (patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) => 
      client.post<Patient>('/patients', patient),
    
    update: (id: string, patient: Partial<Patient>) => 
      client.put<Patient>(`/patients/${id}`, patient),
    
    delete: (id: string) => 
      client.delete(`/patients/${id}`)
  };
};

// Cliente de citas
export const createAppointmentApi = (token: string, baseURL?: string) => {
  const client = createApiClient(baseURL, token);

  return {
    getAll: () => 
      client.get<Appointment[]>('/appointments'),
    
    getById: (id: string) => 
      client.get<Appointment>(`/appointments/${id}`),
    
    getByPatient: (patientId: string) => 
      client.get<Appointment[]>(`/appointments/patient/${patientId}`),
    
    getByProfessional: (professionalId: string) => 
      client.get<Appointment[]>(`/appointments/professional/${professionalId}`),
    
    getByDate: (date: string, professionalId?: string) => {
      const params = professionalId ? { professionalId } : {};
      return client.get<Appointment[]>(`/appointments/date/${date}`, { params });
    },
    
    create: (appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => 
      client.post<Appointment>('/appointments', appointment),
    
    update: (id: string, appointment: Partial<Appointment>) => 
      client.put<Appointment>(`/appointments/${id}`, appointment),
    
    updateStatus: (id: string, status: string) => 
      client.patch<Appointment>(`/appointments/${id}/status`, { status }),
    
    delete: (id: string) => 
      client.delete(`/appointments/${id}`)
  };
};

// Cliente de mensajes
export const createMessageApi = (token: string, baseURL?: string) => {
  const client = createApiClient(baseURL, token);

  return {
    getConversations: () => 
      client.get<Conversation[]>('/conversations'),
    
    getMessages: (conversationId: string) => 
      client.get<Message[]>(`/conversations/${conversationId}/messages`),
    
    sendMessage: (conversationId: string, content: string) => 
      client.post<Message>(`/conversations/${conversationId}/messages`, { content }),
    
    markAsRead: (messageId: string) => 
      client.put<void>(`/messages/${messageId}/read`)
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
import { User, Patient, Professional, Appointment, Message, Conversation } from '../types';

// URL base de la API (podemos cambiarla según el entorno)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Función auxiliar para realizar peticiones a la API
async function apiRequest<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: any,
  token?: string
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const options: RequestInit = {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: 'include',
  };
  
  const response = await fetch(url, options);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: ${response.status}`);
  }
  
  if (response.status === 204) {
    return {} as T;
  }
  
  return await response.json() as T;
}

// Cliente de autenticación
export const authApi = {
  login: (email: string, password: string) => 
    apiRequest<{ token: string, user: User }>('/auth/login', 'POST', { email, password }),
  
  logout: () => 
    apiRequest<void>('/auth/logout', 'POST'),
  
  getProfile: (token: string) => 
    apiRequest<User>('/auth/profile', 'GET', undefined, token),
};

// Cliente de pacientes
export const patientApi = {
  getAll: (token: string) => 
    apiRequest<Patient[]>('/patients', 'GET', undefined, token),
  
  getById: (id: string, token: string) => 
    apiRequest<Patient>(`/patients/${id}`, 'GET', undefined, token),
  
  create: (patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>, token: string) => 
    apiRequest<Patient>('/patients', 'POST', patient, token),
  
  update: (id: string, patient: Partial<Patient>, token: string) => 
    apiRequest<Patient>(`/patients/${id}`, 'PUT', patient, token),
  
  delete: (id: string, token: string) => 
    apiRequest<void>(`/patients/${id}`, 'DELETE', undefined, token),
};

// Cliente de citas
export const appointmentApi = {
  getAll: (token: string) => 
    apiRequest<Appointment[]>('/appointments', 'GET', undefined, token),
  
  getById: (id: string, token: string) => 
    apiRequest<Appointment>(`/appointments/${id}`, 'GET', undefined, token),
  
  getByPatient: (patientId: string, token: string) => 
    apiRequest<Appointment[]>(`/appointments/patient/${patientId}`, 'GET', undefined, token),
  
  getByProfessional: (professionalId: string, token: string) => 
    apiRequest<Appointment[]>(`/appointments/professional/${professionalId}`, 'GET', undefined, token),
  
  create: (appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>, token: string) => 
    apiRequest<Appointment>('/appointments', 'POST', appointment, token),
  
  update: (id: string, appointment: Partial<Appointment>, token: string) => 
    apiRequest<Appointment>(`/appointments/${id}`, 'PUT', appointment, token),
  
  delete: (id: string, token: string) => 
    apiRequest<void>(`/appointments/${id}`, 'DELETE', undefined, token),
};

// Cliente de mensajes
export const messageApi = {
  getConversations: (token: string) => 
    apiRequest<Conversation[]>('/conversations', 'GET', undefined, token),
  
  getMessages: (conversationId: string, token: string) => 
    apiRequest<Message[]>(`/conversations/${conversationId}/messages`, 'GET', undefined, token),
  
  sendMessage: (conversationId: string, content: string, token: string) => 
    apiRequest<Message>(`/conversations/${conversationId}/messages`, 'POST', { content }, token),
  
  markAsRead: (messageId: string, token: string) => 
    apiRequest<void>(`/messages/${messageId}/read`, 'PUT', undefined, token),
};

// Exportación agrupada
export const api = {
  auth: authApi,
  patients: patientApi,
  appointments: appointmentApi,
  messages: messageApi,
};
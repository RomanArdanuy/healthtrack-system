// API client that will be used by both web and mobile apps
import { Patient, MedicalStaff, VitalSigns, Appointment, Alert } from '../types';

// Base API URL - this will be configured per environment
const API_BASE_URL = process.env.API_URL || 'https://api.healthtrack-system.com';

// Utility function for making API requests
async function apiRequest<T>(
  endpoint: string, 
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: any
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getAuthToken()}`,
  };
  
  const options: RequestInit = {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  };
  
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json() as T;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Get auth token from storage (implementation will differ between web and mobile)
function getAuthToken(): string {
  // This is a placeholder. The actual implementation will be platform-specific
  return localStorage?.getItem('authToken') || '';
}

// Patient related API calls
export const patientApi = {
  getPatient: (id: string) => apiRequest<Patient>(`/patients/${id}`),
  getPatients: () => apiRequest<Patient[]>('/patients'),
  createPatient: (patient: Omit<Patient, 'id'>) => apiRequest<Patient>('/patients', 'POST', patient),
  updatePatient: (id: string, patient: Partial<Patient>) => apiRequest<Patient>(`/patients/${id}`, 'PUT', patient),
  deletePatient: (id: string) => apiRequest<void>(`/patients/${id}`, 'DELETE'),
};

// Medical Staff related API calls
export const staffApi = {
  getStaffMember: (id: string) => apiRequest<MedicalStaff>(`/staff/${id}`),
  getStaffMembers: () => apiRequest<MedicalStaff[]>('/staff'),
};

// Vital signs related API calls
export const vitalSignsApi = {
  getPatientVitalSigns: (patientId: string) => apiRequest<VitalSigns[]>(`/vitals/${patientId}`),
  addVitalSign: (vitalSign: VitalSigns) => apiRequest<VitalSigns>('/vitals', 'POST', vitalSign),
};

// Appointments related API calls
export const appointmentApi = {
  getPatientAppointments: (patientId: string) => apiRequest<Appointment[]>(`/appointments/patient/${patientId}`),
  getStaffAppointments: (staffId: string) => apiRequest<Appointment[]>(`/appointments/staff/${staffId}`),
  createAppointment: (appointment: Omit<Appointment, 'id'>) => apiRequest<Appointment>('/appointments', 'POST', appointment),
  updateAppointment: (id: string, appointment: Partial<Appointment>) => 
    apiRequest<Appointment>(`/appointments/${id}`, 'PUT', appointment),
  cancelAppointment: (id: string) => 
    apiRequest<Appointment>(`/appointments/${id}/cancel`, 'POST'),
};

// Alerts related API calls
export const alertApi = {
  getPatientAlerts: (patientId: string) => apiRequest<Alert[]>(`/alerts/patient/${patientId}`),
  acknowledgeAlert: (id: string) => apiRequest<Alert>(`/alerts/${id}/acknowledge`, 'POST'),
};

export const api = {
  patient: patientApi,
  staff: staffApi,
  vitalSigns: vitalSignsApi,
  appointment: appointmentApi,
  alert: alertApi,
};
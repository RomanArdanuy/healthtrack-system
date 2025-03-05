export enum AppointmentStatus {
    SCHEDULED = 'scheduled',
    CONFIRMED = 'confirmed',
    CANCELLED = 'cancelled',
    COMPLETED = 'completed'
  }
  
  export interface Appointment {
    id: string;
    patientId: string;
    professionalId: string;
    date: string; // ISO date format
    startTime: string; // formato 'HH:MM'
    endTime: string; // formato 'HH:MM'
    status: AppointmentStatus;
    notes?: string;
    reason?: string;
    createdAt: string;
    updatedAt: string;
  }
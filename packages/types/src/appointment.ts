import { AppointmentStatus } from '@prisma/client';
export { AppointmentStatus };

export interface Appointment {
  id: string;
  patientId: string;
  professionalId: string;
  createdById?: string; // Añadido para coincidir con el modelo Prisma
  date: string; // ISO date format
  startTime: string; // formato 'HH:MM'
  endTime: string; // formato 'HH:MM'
  status: AppointmentStatus;
  notes?: string;
  reason?: string;
  createdAt: string;
  updatedAt: string;
}
import { Appointment, AppointmentStatus } from '@shared/types/appointment';

// Simulate a database for initial development
const appointments: Appointment[] = [
  {
    id: '1',
    patientId: '1',
    professionalId: '1',
    date: '2025-03-15',
    startTime: '09:00',
    endTime: '09:30',
    status: AppointmentStatus.CONFIRMED,
    reason: 'Regular check-up',
    notes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    patientId: '2',
    professionalId: '1',
    date: '2025-03-16',
    startTime: '10:00',
    endTime: '10:30',
    status: AppointmentStatus.SCHEDULED,
    reason: 'Medication review',
    notes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Get all appointments
const getAllAppointments = async () => {
  return appointments;
};

// Get appointment by ID
const getAppointmentById = async (id: string) => {
  return appointments.find(appointment => appointment.id === id);
};

// Get appointments by patient
const getAppointmentsByPatientId = async (patientId: string) => {
  return appointments.filter(appointment => appointment.patientId === patientId);
};

// Get appointments by professional
const getAppointmentsByProfessionalId = async (professionalId: string) => {
  return appointments.filter(appointment => appointment.professionalId === professionalId);
};

// Get appointments for a specific date
const getAppointmentsByDate = async (date: string, professionalId?: string) => {
  let filtered = appointments.filter(appointment => appointment.date === date);
  
  if (professionalId) {
    filtered = filtered.filter(appointment => appointment.professionalId === professionalId);
  }
  
  return filtered;
};

// Create a new appointment
const createAppointment = async (appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => {
  const newAppointment: Appointment = {
    ...appointmentData,
    id: (appointments.length + 1).toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  appointments.push(newAppointment);
  return newAppointment;
};

// Update an existing appointment
const updateAppointment = async (id: string, appointmentData: Partial<Appointment>) => {
  const index = appointments.findIndex(appointment => appointment.id === id);
  
  if (index === -1) return null;
  
  const updatedAppointment = {
    ...appointments[index],
    ...appointmentData,
    updatedAt: new Date().toISOString()
  };
  
  appointments[index] = updatedAppointment;
  return updatedAppointment;
};

// Update appointment status
const updateAppointmentStatus = async (id: string, status: AppointmentStatus) => {
  return updateAppointment(id, { status });
};

// Delete an appointment
const deleteAppointment = async (id: string) => {
  const index = appointments.findIndex(appointment => appointment.id === id);
  
  if (index === -1) return false;
  
  appointments.splice(index, 1);
  return true;
};

export default {
  getAllAppointments,
  getAppointmentById,
  getAppointmentsByPatientId,
  getAppointmentsByProfessionalId,
  getAppointmentsByDate,
  createAppointment,
  updateAppointment,
  updateAppointmentStatus,
  deleteAppointment
};
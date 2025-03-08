import { prisma } from '../lib/prisma';
import { AppointmentStatus } from '@prisma/client';

// Get all appointments
const getAllAppointments = async () => {
  return prisma.appointment.findMany();
};

// Get appointment by ID
const getAppointmentById = async (id: string) => {
  return prisma.appointment.findUnique({
    where: { id }
  });
};

// Get appointments by patient
const getAppointmentsByPatientId = async (patientId: string) => {
  return prisma.appointment.findMany({
    where: { patientId }
  });
};

// Get appointments by professional
const getAppointmentsByProfessionalId = async (professionalId: string) => {
  return prisma.appointment.findMany({
    where: { professionalId }
  });
};

// Get appointments for a specific date
const getAppointmentsByDate = async (date: string, professionalId?: string) => {
  const dateObj = new Date(date);
  
  // Crear condición base para la fecha
  const where: any = {
    date: dateObj
  };
  
  // Añadir filtro por profesional si se proporciona
  if (professionalId) {
    where.professionalId = professionalId;
  }
  
  return prisma.appointment.findMany({ where });
};

// Create a new appointment
const createAppointment = async (appointmentData: {
  patientId: string;
  professionalId: string;
  createdById: string;
  date: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  notes?: string;
  reason?: string;
}) => {
  // Convertir la fecha de string a Date
  const dateObj = new Date(appointmentData.date);
  
  return prisma.appointment.create({
    data: {
      ...appointmentData,
      date: dateObj
    }
  });
};

// Update an existing appointment
const updateAppointment = async (id: string, appointmentData: {
  date?: string;
  startTime?: string;
  endTime?: string;
  status?: AppointmentStatus;
  notes?: string;
  reason?: string;
}) => {
  // Preparar datos para actualización
  const updateData: any = { ...appointmentData };
  
  // Convertir fecha si se proporciona
  if (appointmentData.date) {
    updateData.date = new Date(appointmentData.date);
  }
  
  return prisma.appointment.update({
    where: { id },
    data: updateData
  });
};

// Update appointment status
const updateAppointmentStatus = async (id: string, status: AppointmentStatus) => {
  return prisma.appointment.update({
    where: { id },
    data: { status }
  });
};

// Delete an appointment
const deleteAppointment = async (id: string) => {
  try {
    await prisma.appointment.delete({
      where: { id }
    });
    return true;
  } catch (error) {
    console.error('Error deleting appointment:', error);
    return false;
  }
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
import { Request, Response } from 'express';
import appointmentService from '@/services/appointment.service';
import { AppointmentStatus } from '@shared/types/appointment';

// Get all appointments
const getAllAppointments = async (req: Request, res: Response) => {
  try {
    const appointments = await appointmentService.getAllAppointments();
    return res.status(200).json(appointments);
  } catch (error) {
    console.error('Error getting appointments:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get appointment by ID
const getAppointmentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const appointment = await appointmentService.getAppointmentById(id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    return res.status(200).json(appointment);
  } catch (error) {
    console.error('Error getting appointment:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get appointments by patient
const getAppointmentsByPatient = async (req: Request, res: Response) => {
  try {
    const { patientId } = req.params;
    const appointments = await appointmentService.getAppointmentsByPatientId(patientId);
    return res.status(200).json(appointments);
  } catch (error) {
    console.error('Error getting patient appointments:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get appointments by professional
const getAppointmentsByProfessional = async (req: Request, res: Response) => {
  try {
    const { professionalId } = req.params;
    const appointments = await appointmentService.getAppointmentsByProfessionalId(professionalId);
    return res.status(200).json(appointments);
  } catch (error) {
    console.error('Error getting professional appointments:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get appointments by date
const getAppointmentsByDate = async (req: Request, res: Response) => {
  try {
    const { date } = req.params;
    const { professionalId } = req.query;
    
    const appointments = await appointmentService.getAppointmentsByDate(
      date, 
      professionalId as string | undefined
    );
    
    return res.status(200).json(appointments);
  } catch (error) {
    console.error('Error getting appointments by date:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Create a new appointment
const createAppointment = async (req: Request, res: Response) => {
  try {
    const appointmentData = req.body;
    
    if (!appointmentData.patientId || !appointmentData.professionalId || 
        !appointmentData.date || !appointmentData.startTime || !appointmentData.endTime) {
      return res.status(400).json({ 
        message: 'Incomplete data. Patient, professional, date, start time and end time are required' 
      });
    }
    
    const newAppointment = await appointmentService.createAppointment(appointmentData);
    return res.status(201).json(newAppointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Update an existing appointment
const updateAppointment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const appointmentData = req.body;
    
    const updatedAppointment = await appointmentService.updateAppointment(id, appointmentData);
    
    if (!updatedAppointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    return res.status(200).json(updatedAppointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Update appointment status
const updateAppointmentStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status || !Object.values(AppointmentStatus).includes(status as AppointmentStatus)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    
    const updatedAppointment = await appointmentService.updateAppointmentStatus(id, status as AppointmentStatus);
    
    if (!updatedAppointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    return res.status(200).json(updatedAppointment);
  } catch (error) {
    console.error('Error updating appointment status:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete an appointment
const deleteAppointment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await appointmentService.deleteAppointment(id);
    
    if (!deleted) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    return res.status(200).json({ message: 'Appointment successfully deleted' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export default {
  getAllAppointments,
  getAppointmentById,
  getAppointmentsByPatient,
  getAppointmentsByProfessional,
  getAppointmentsByDate,
  createAppointment,
  updateAppointment,
  updateAppointmentStatus,
  deleteAppointment
};
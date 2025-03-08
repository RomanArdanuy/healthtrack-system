import { Request, Response } from 'express';
import patientService from '@/services/patient.service';

// Obtener todos los pacientes
const getAllPatients = async (req: Request, res: Response) => {
  try {
    const patients = await patientService.getAllPatients();
    return res.status(200).json(patients);
  } catch (error) {
    console.error('Error al obtener pacientes:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Obtener paciente por ID
const getPatientById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const patient = await patientService.getPatientById(id);
    
    if (!patient) {
      return res.status(404).json({ message: 'Paciente no encontrado' });
    }
    
    return res.status(200).json(patient);
  } catch (error) {
    console.error('Error al obtener paciente:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Obtener pacientes por profesional
const getPatientsByProfessional = async (req: Request, res: Response) => {
  try {
    const { professionalId } = req.params;
    const patients = await patientService.getPatientsByProfessionalId(professionalId);
    return res.status(200).json(patients);
  } catch (error) {
    console.error('Error al obtener pacientes del profesional:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Crear un nuevo paciente
const createPatient = async (req: Request, res: Response) => {
  try {
    const patientData = req.body;
    
    if (!patientData.name || !patientData.email || !patientData.professionalId) {
      return res.status(400).json({ 
        message: 'Datos incompletos. Se requiere nombre, email y profesional asignado' 
      });
    }
    
    const newPatient = await patientService.createPatient(patientData);
    return res.status(201).json(newPatient);
  } catch (error) {
    console.error('Error al crear paciente:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Actualizar un paciente existente
const updatePatient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const patientData = req.body;
    
    const updatedPatient = await patientService.updatePatient(id, patientData);
    
    if (!updatedPatient) {
      return res.status(404).json({ message: 'Paciente no encontrado' });
    }
    
    return res.status(200).json(updatedPatient);
  } catch (error) {
    console.error('Error al actualizar paciente:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Eliminar un paciente
const deletePatient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await patientService.deletePatient(id);
    
    if (!deleted) {
      return res.status(404).json({ message: 'Paciente no encontrado' });
    }
    
    return res.status(200).json({ message: 'Paciente eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar paciente:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export default {
  getAllPatients,
  getPatientById,
  getPatientsByProfessional,
  createPatient,
  updatePatient,
  deletePatient
};
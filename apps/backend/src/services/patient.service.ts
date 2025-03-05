// apps/backend/src/services/patient.service.ts
import { Patient, UserRole } from '@shared/types/user';

// Simulamos una base de datos para desarrollo inicial
// En un entorno real, esto sería reemplazado por una BD real
const patients: Patient[] = [
  {
    id: '1',
    name: 'María',
    surname: 'García',
    email: 'maria@example.com',
    phone: '612345678',
    birthDate: '1985-05-12',
    address: 'Calle Principal 123, Barcelona',
    emergencyContact: 'Juan García - 678912345',
    professionalId: '1',
    role: UserRole.PATIENT,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Carlos',
    surname: 'Rodríguez',
    email: 'carlos@example.com',
    phone: '623456789',
    birthDate: '1972-11-30',
    address: 'Avenida Central 45, Barcelona',
    emergencyContact: 'Ana Rodríguez - 678123456',
    professionalId: '1',
    role: UserRole.PATIENT,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Obtener todos los pacientes
const getAllPatients = async () => {
  return patients;
};

// Obtener paciente por ID
const getPatientById = async (id: string) => {
  return patients.find(patient => patient.id === id);
};

// Obtener pacientes de un profesional específico
const getPatientsByProfessionalId = async (professionalId: string) => {
  return patients.filter(patient => patient.professionalId === professionalId);
};

// Crear un nuevo paciente
const createPatient = async (patientData: Omit<Patient, 'id' | 'createdAt' | 'updatedAt' | 'role'>) => {
  const newPatient: Patient = {
    ...patientData,
    id: (patients.length + 1).toString(),
    role: UserRole.PATIENT, // Asegurarse de asignar el rol correcto
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  patients.push(newPatient);
  return newPatient;
};

// Actualizar un paciente existente
const updatePatient = async (id: string, patientData: Partial<Patient>) => {
  const index = patients.findIndex(patient => patient.id === id);
  
  if (index === -1) return null;
  
  const updatedPatient = {
    ...patients[index],
    ...patientData,
    updatedAt: new Date().toISOString()
  };
  
  patients[index] = updatedPatient;
  return updatedPatient;
};

// Eliminar un paciente
const deletePatient = async (id: string) => {
  const index = patients.findIndex(patient => patient.id === id);
  
  if (index === -1) return false;
  
  patients.splice(index, 1);
  return true;
};

export default {
  getAllPatients,
  getPatientById,
  getPatientsByProfessionalId,
  createPatient,
  updatePatient,
  deletePatient
};
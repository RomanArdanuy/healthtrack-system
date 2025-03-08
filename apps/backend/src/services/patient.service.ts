// apps/backend/src/services/patient.service.ts
import { prisma } from '../lib/prisma';
import { UserRole } from '@prisma/client';

// Obtener todos los pacientes
const getAllPatients = async () => {
  return prisma.user.findMany({
    where: {
      role: UserRole.PATIENT
    },
    include: {
      patientProfile: true
    }
  });
};

// Obtener paciente por ID
const getPatientById = async (id: string) => {
  return prisma.user.findUnique({
    where: {
      id,
      role: UserRole.PATIENT
    },
    include: {
      patientProfile: true
    }
  });
};

// Obtener pacientes de un profesional específico
const getPatientsByProfessionalId = async (professionalId: string) => {
  return prisma.user.findMany({
    where: {
      role: UserRole.PATIENT,
      patientProfile: {
        professionalId
      }
    },
    include: {
      patientProfile: true
    }
  });
};

// Crear un nuevo paciente
const createPatient = async (patientData: {
  email: string;
  password: string;
  name: string;
  surname: string;
  phone?: string;
  birthDate?: string;
  address?: string;
  emergencyContact?: string;
  professionalId: string;
}) => {
  try {
    // Crear usuario y perfil de paciente en una transacción
    return await prisma.$transaction(async (tx) => {
      // Crear usuario base
      const newUser = await tx.user.create({
        data: {
          email: patientData.email,
          password: patientData.password, // Nota: Esto debería estar hasheado antes
          name: patientData.name,
          surname: patientData.surname,
          phone: patientData.phone,
          role: UserRole.PATIENT
        }
      });
      
      // Crear perfil de paciente
      await tx.patient.create({
        data: {
          userId: newUser.id,
          birthDate: patientData.birthDate,
          address: patientData.address,
          emergencyContact: patientData.emergencyContact,
          professionalId: patientData.professionalId
        }
      });
      
      // Devolver usuario con su perfil
      return tx.user.findUnique({
        where: { id: newUser.id },
        include: { patientProfile: true }
      });
    });
  } catch (error) {
    console.error('Error creating patient:', error);
    throw error;
  }
};

// Actualizar un paciente existente
const updatePatient = async (id: string, patientData: {
  name?: string;
  surname?: string;
  email?: string;
  phone?: string;
  birthDate?: string;
  address?: string;
  emergencyContact?: string;
  professionalId?: string;
}) => {
  try {
    // Separar datos para actualizar usuario y perfil
    const { birthDate, address, emergencyContact, professionalId, ...userData } = patientData;
    
    // Actualizar en transacción
    return await prisma.$transaction(async (tx) => {
      // Actualizar usuario base si hay datos
      if (Object.keys(userData).length > 0) {
        await tx.user.update({
          where: { id },
          data: userData
        });
      }
      
      // Actualizar perfil de paciente si hay datos
      if (birthDate || address || emergencyContact || professionalId) {
        // Obtener el ID del perfil del paciente
        const patientProfile = await tx.patient.findFirst({
          where: { userId: id }
        });
        
        if (patientProfile) {
          await tx.patient.update({
            where: { id: patientProfile.id },
            data: {
              birthDate,
              address,
              emergencyContact,
              professionalId
            }
          });
        }
      }
      
      // Devolver usuario actualizado con su perfil
      return tx.user.findUnique({
        where: { id },
        include: { patientProfile: true }
      });
    });
  } catch (error) {
    console.error('Error updating patient:', error);
    return null;
  }
};

// Eliminar un paciente
const deletePatient = async (id: string) => {
  try {
    // Al eliminar el usuario, el perfil del paciente se eliminará 
    // automáticamente debido a la relación Cascade
    await prisma.user.delete({
      where: { id }
    });
    return true;
  } catch (error) {
    console.error('Error deleting patient:', error);
    return false;
  }
};

export default {
  getAllPatients,
  getPatientById,
  getPatientsByProfessionalId,
  createPatient,
  updatePatient,
  deletePatient
};
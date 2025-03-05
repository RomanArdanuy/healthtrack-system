export enum UserRole {
    PATIENT = 'patient',
    PROFESSIONAL = 'professional',
    ADMIN = 'admin'
  }
  
  export interface User {
    id: string;
    email: string;
    name: string;
    surname: string;
    role: UserRole;
    phone?: string;
    profilePicture?: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Professional extends User {
    role: UserRole.PROFESSIONAL | UserRole.ADMIN;
    specialty?: string;
    licenseNumber?: string;
  }
  
  export interface Patient extends User {
    role: UserRole.PATIENT;
    birthDate?: string;
    address?: string;
    emergencyContact?: string;
    professionalId: string; // ID del profesional asignado
  }
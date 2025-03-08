import { prisma } from '../lib/prisma';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UserRole } from '@prisma/client';

// Configuración
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const TOKEN_EXPIRY = '24h';

// Autenticar usuario
const authenticate = async (email: string, password: string) => {
  // Buscar usuario por email
  const user = await prisma.user.findUnique({
    where: { email }
  });
  
  if (!user) {
    return { 
      success: false, 
      message: 'Usuario no encontrado' 
    };
  }
  
  // Verificar contraseña
  const passwordValid = await bcrypt.compare(password, user.password);
  
  if (!passwordValid) {
    return { 
      success: false, 
      message: 'Credenciales inválidas' 
    };
  }
  
  // Generar JWT
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );
  
  // No devolvemos la contraseña
  const { password: _, ...userWithoutPassword } = user;
  
  return {
    success: true,
    data: {
      token,
      user: userWithoutPassword
    }
  };
};

// Obtener usuario por ID
const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      patientProfile: true,
      professionalProfile: true,
    },
  });
  
  if (!user) return null;
  
  // No devolvemos la contraseña
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// Registrar nuevo usuario
const registerUser = async (userData: {
  email: string;
  password: string;
  name: string;
  surname: string;
  role: UserRole;
  phone?: string;
  profilePicture?: string;
  // Para pacientes
  birthDate?: string;
  address?: string;
  emergencyContact?: string;
  professionalId?: string;
  // Para profesionales
  specialty?: string;
  licenseNumber?: string;
}) => {
  // Verificar si el correo ya existe
  const existingUser = await prisma.user.findUnique({
    where: { email: userData.email }
  });
  
  if (existingUser) {
    return {
      success: false,
      message: 'El correo electrónico ya está registrado'
    };
  }
  
  // Hash de la contraseña
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  
  try {
    // Crear usuario en una transacción para manejar perfiles relacionados
    const result = await prisma.$transaction(async (tx) => {
      // Extraer datos específicos de rol
      const { 
        birthDate, address, emergencyContact, professionalId,
        specialty, licenseNumber,
        ...baseUserData 
      } = userData;
      
      // Crear usuario base
      const newUser = await tx.user.create({
        data: {
          ...baseUserData,
          password: hashedPassword
        }
      });
      
      // Crear perfil según el rol
      if (userData.role === UserRole.PATIENT && professionalId) {
        await tx.patient.create({
          data: {
            userId: newUser.id,
            birthDate,
            address,
            emergencyContact,
            professionalId
          }
        });
      } else if (userData.role === UserRole.PROFESSIONAL || userData.role === UserRole.ADMIN) {
        await tx.professional.create({
          data: {
            userId: newUser.id,
            specialty,
            licenseNumber
          }
        });
      }
      
      return newUser;
    });
    
    // Generar token
    const token = jwt.sign(
      { id: result.id, email: result.email, role: result.role },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRY }
    );
    
    // No devolvemos la contraseña
    const { password: _, ...userWithoutPassword } = result;
    
    return {
      success: true,
      data: {
        token,
        user: userWithoutPassword
      }
    };
    
  } catch (error) {
    console.error('Error registering user:', error);
    return {
      success: false,
      message: 'Error al registrar el usuario'
    };
  }
};

// Verificar token JWT
const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

export default {
  authenticate,
  getUserById,
  registerUser,
  verifyToken
};
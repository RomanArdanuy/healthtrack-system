import jwt from 'jsonwebtoken';
import { UserRole } from '@healthtrack/types';

// Configuración
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const TOKEN_EXPIRY = '24h';

// Simulamos una base de datos para desarrollo inicial
// En un entorno real, esto sería reemplazado por una BD real
const users = [
  {
    id: '1',
    email: 'doctor@example.com',
    name: 'Juan',
    surname: 'Médico',
    role: UserRole.PROFESSIONAL,
    password: 'password123', // En producción usaríamos hashes, no texto plano
    specialty: 'Medicina General',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    email: 'paciente@example.com',
    name: 'María',
    surname: 'Paciente',
    role: UserRole.PATIENT,
    password: 'password123',
    professionalId: '1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Autenticar usuario
const authenticate = async (email: string, password: string) => {
  const user = users.find(u => u.email === email);
  
  if (!user) {
    return { 
      success: false, 
      message: 'Usuario no encontrado' 
    };
  }
  
  if (user.password !== password) {
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
  const user = users.find(u => u.id === id);
  
  if (!user) return null;
  
  // No devolvemos la contraseña
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export default {
  authenticate,
  getUserById
};
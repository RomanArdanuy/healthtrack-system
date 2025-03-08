// apps/backend/src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import authService from '../services/auth.service';

// Añade esta interfaz si no la tienes ya en algún lugar
interface RequestWithUser extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const login = async (req: Request, res: Response) => {
  // Este método está correcto, no necesita cambios
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son requeridos' });
    }
    
    const result = await authService.authenticate(email, password);
    
    if (!result.success) {
      return res.status(401).json({ message: result.message });
    }
    
    return res.status(200).json(result.data);
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const getProfile = async (req: RequestWithUser, res: Response) => {
  // Usar la interfaz extendida
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'No autenticado' });
    }
    
    const user = await authService.getUserById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    return res.status(200).json(user);
  } catch (error) {
    console.error('Error en getProfile:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Añade el método register si quieres exponer esta funcionalidad
export const register = async (req: Request, res: Response) => {
  try {
    const userData = req.body;
    
    if (!userData.email || !userData.password || !userData.name || !userData.surname || !userData.role) {
      return res.status(400).json({ 
        message: 'Datos incompletos. Se requiere email, contraseña, nombre, apellido y rol' 
      });
    }
    
    const result = await authService.registerUser(userData);
    
    if (!result.success) {
      return res.status(400).json({ message: result.message });
    }
    
    return res.status(201).json(result.data);
  } catch (error) {
    console.error('Error en register:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const logout = (req: Request, res: Response) => {
  // Este método está correcto
  return res.status(200).json({ message: 'Sesión cerrada con éxito' });
};

export default {
  login,
  getProfile,
  register, // Añade el nuevo método
  logout
};
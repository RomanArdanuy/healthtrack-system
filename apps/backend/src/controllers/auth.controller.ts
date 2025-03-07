import { Request, Response } from 'express';
import authService from '../services/auth.service';

export const login = async (req: Request, res: Response) => {
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

export const getProfile = async (req: Request, res: Response) => {
  try {
    // El userId se añade desde el middleware de autenticación
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

export const logout = (req: Request, res: Response) => {
  // En una implementación con JWT, el logout se maneja principalmente en el cliente
  // eliminando el token, pero podríamos implementar una lista negra de tokens en una
  // fase posterior del proyecto
  return res.status(200).json({ message: 'Sesión cerrada con éxito' });
};

export default {
  login,
  getProfile,
  logout
};
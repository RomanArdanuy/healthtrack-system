import { Router } from 'express';
import appointmentController from '@/controllers/appointment.controller';
import authMiddleware from '@/middlewares/auth.middleware';

const router = Router();
// All appointment routes require authentication
router.use(authMiddleware.authenticateToken);

// Basic CRUD routes
router.get('/', appointmentController.getAllAppointments);

// Coloca las rutas específicas ANTES de las genéricas para evitar conflictos
router.get('/patient/:patientId', appointmentController.getAppointmentsByPatient);
router.get('/professional/:professionalId', appointmentController.getAppointmentsByProfessional);
router.get('/date/:date', appointmentController.getAppointmentsByDate);

// Ahora las rutas genéricas con parámetros
router.get('/:id', appointmentController.getAppointmentById);
router.post('/', appointmentController.createAppointment);
router.put('/:id', appointmentController.updateAppointment);
router.patch('/:id/status', appointmentController.updateAppointmentStatus);
router.delete('/:id', appointmentController.deleteAppointment);

export default router;
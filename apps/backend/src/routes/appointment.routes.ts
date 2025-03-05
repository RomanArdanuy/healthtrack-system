import { Router } from 'express';
import appointmentController from '@/controllers/appointment.controller';
import authMiddleware from '@/middlewares/auth.middleware';

const router = Router();

// All appointment routes require authentication
router.use(authMiddleware.authenticateToken);

// Basic CRUD routes
router.get('/', appointmentController.getAllAppointments);
router.get('/:id', appointmentController.getAppointmentById);
router.post('/', appointmentController.createAppointment);
router.put('/:id', appointmentController.updateAppointment);
router.patch('/:id/status', appointmentController.updateAppointmentStatus);
router.delete('/:id', appointmentController.deleteAppointment);

// Additional specialized routes
router.get('/patient/:patientId', appointmentController.getAppointmentsByPatient);
router.get('/professional/:professionalId', appointmentController.getAppointmentsByProfessional);
router.get('/date/:date', appointmentController.getAppointmentsByDate);

export default router;
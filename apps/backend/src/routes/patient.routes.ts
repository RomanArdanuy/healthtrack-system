import { Router } from 'express';
import patientController from '@/controllers/patient.controller';
import authMiddleware from '@/middlewares/auth.middleware';

const router = Router();

// Todas las rutas de pacientes requieren autenticación
router.use(authMiddleware.authenticateToken);

// Rutas CRUD básicas
router.get('/', patientController.getAllPatients);

// Coloca la ruta específica ANTES de las genéricas
router.get('/professional/:professionalId', patientController.getPatientsByProfessional);

// Ahora las rutas genéricas con parámetros
router.get('/:id', patientController.getPatientById);
router.post('/', patientController.createPatient);
router.put('/:id', patientController.updatePatient);
router.delete('/:id', patientController.deletePatient);

export default router;
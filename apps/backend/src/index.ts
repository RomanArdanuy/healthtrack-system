import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import patientRoutes from '@/routes/patient.routes';
import appointmentRoutes from '@/routes/appointment.routes';
import { prisma } from './lib/prisma';
// Configurar variables de entorno
dotenv.config();

// Inicializar express
const app = express();
// Convert PORT to a number to fix the type error
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

// Middleware
// CORS configuration for allowing mobile connections
app.use(cors({
  origin: '*', // During development, allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Logging simple
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).send('HealthTrack API is running');
});

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('HealthTrack API Running');
});

// Manejador de errores global
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Función para cerrar conexiones de Prisma al apagar
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

// Listen on all interfaces
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en puerto ${PORT} y visible desde fuera`);
  console.log(`API accesible en http://localhost:${PORT}/api`);
  console.log(`Para dispositivos móviles, usa la IP de tu ordenador`);
});
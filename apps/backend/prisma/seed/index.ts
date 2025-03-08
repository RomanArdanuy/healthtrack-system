import { PrismaClient, UserRole, AppointmentStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Limpiar la base de datos (opcional)
  await prisma.measurement.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.professional.deleteMany();
  await prisma.user.deleteMany();
  
  // Crear usuarios
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@healthtrack.com',
      password: adminPassword,
      name: 'Admin',
      surname: 'User',
      role: UserRole.ADMIN,
    }
  });
  
  const doctorPassword = await bcrypt.hash('doctor123', 10);
  const doctor = await prisma.user.create({
    data: {
      email: 'doctor@example.com',
      password: doctorPassword,
      name: 'Juan',
      surname: 'Médico',
      role: UserRole.PROFESSIONAL,
      professionalProfile: {
        create: {
          specialty: 'Medicina General',
          licenseNumber: 'MG12345'
        }
      }
    },
    include: {
      professionalProfile: true
    }
  });
  
  const patientPassword = await bcrypt.hash('patient123', 10);
  const patient = await prisma.user.create({
    data: {
      email: 'patient@example.com',
      password: patientPassword,
      name: 'María',
      surname: 'Paciente',
      role: UserRole.PATIENT,
      patientProfile: {
        create: {
          birthDate: '1985-05-12',
          address: 'Calle Principal 123, Barcelona',
          emergencyContact: 'Juan García - 678912345',
          professionalId: doctor.professionalProfile!.id
        }
      }
    },
    include: {
      patientProfile: true
    }
  });
  
  // Crear citas
  const appointment = await prisma.appointment.create({
    data: {
      createdById: doctor.id,
      patientId: patient.id,
      professionalId: doctor.id,
      date: new Date('2025-03-20'),
      startTime: '10:00',
      endTime: '10:30',
      status: AppointmentStatus.SCHEDULED,
      reason: 'Consulta de rutina'
    }
  });
  
  console.log({ admin, doctor, patient, appointment });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
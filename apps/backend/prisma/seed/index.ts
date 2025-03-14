import { PrismaClient, UserRole, AppointmentStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const patientNames = ['María', 'Juan', 'Pedro', 'Ana', 'Luis', 'Carmen', 'José', 'Laura', 'Miguel', 'Elena', 'Carlos', 'Isabel', 'Manuel', 'Sara', 'Javier', 'Marta', 'Andrés', 'Beatriz', 'David', 'Patricia', 'Alberto', 'Rosa', 'Fernando', 'Clara', 'Sergio', 'Teresa', 'Hugo', 'Lorena', 'Raúl', 'Natalia', 'Daniel', 'Eva', 'Rubén', 'Cristina', 'Francisco', 'Julia', 'Óscar', 'Paula', 'Vicente', 'Silvia', 'Adrián', 'Noelia', 'Jesús', 'Irene', 'Antonio', 'Sandra', 'Alejandro', 'Lucía', 'Diego', 'Esther'];
const patientSurnames = ['García', 'Martínez', 'López', 'Rodríguez', 'Fernández', 'Pérez', 'Sánchez', 'Gómez', 'Díaz', 'Moreno', 'Álvarez', 'Muñoz', 'Romero', 'Vázquez', 'Domínguez', 'Torres', 'Gutiérrez', 'Ruiz', 'Navarro', 'Ramos'];

async function main() {
  console.log("Eliminando datos existentes...");
  await prisma.measurement.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.professional.deleteMany();
  await prisma.user.deleteMany();

  console.log("Generando administradores...");
  const admins = await Promise.all(
    Array.from({ length: 10 }).map(async (_, i) => {
      const password = await bcrypt.hash(`admin${i}pass`, 10);
      return prisma.user.create({
        data: {
          email: `admin${i}@healthtrack.com`,
          password,
          name: `Admin${i}`,
          surname: `User${i}`,
          role: UserRole.ADMIN,
        },
      });
    })
  );

  console.log("Generando profesionales...");
  const specialties = ['Medicina General', 'Cardiología', 'Neurología', 'Pediatría', 'Dermatología', 'Oftalmología', 'Psiquiatría', 'Ginecología', 'Ortopedia', 'Endocrinología'];
  const professionals = await Promise.all(
    Array.from({ length: 10 }).map(async (_, i) => {
      const password = await bcrypt.hash(`doctor${i}pass`, 10);
      return prisma.user.create({
        data: {
          email: `doctor${i}@example.com`,
          password,
          name: `Doctor${i}`,
          surname: `Médico${i}`,
          role: UserRole.PROFESSIONAL,
          professionalProfile: {
            create: {
              specialty: specialties[i % specialties.length],
              licenseNumber: `MED${i}12345`,
            },
          },
        },
        include: { professionalProfile: true },
      });
    })
  );

  console.log("Generando pacientes...");
  const patients = await Promise.all(
    Array.from({ length: 50 }).map(async (_, i) => {
      const password = await bcrypt.hash(`patient${i}pass`, 10);
      return prisma.user.create({
        data: {
          email: `patient${i}@example.com`,
          password,
          name: patientNames[i % patientNames.length],
          surname: patientSurnames[i % patientSurnames.length],
          role: UserRole.PATIENT,
          patientProfile: {
            create: {
              birthDate: new Date(1980 + (i % 40), i % 12, i % 28).toISOString(),
              address: `Calle ${i}, Ciudad`,
              emergencyContact: `Contacto${i} - 60012345${i % 10}`,
              professionalId: professionals[i % professionals.length].professionalProfile!.id,
            },
          },
        },
        include: { patientProfile: true },
      });
    })
  );

  console.log("Generando citas médicas...");
  const appointmentStatuses = Object.values(AppointmentStatus);
  const appointments = await Promise.all(
    Array.from({ length: 200 }).map((_, i) => {
      return prisma.appointment.create({
        data: {
          createdById: professionals[i % professionals.length].id,
          patientId: patients[i % patients.length].id,
          professionalId: professionals[i % professionals.length].id,
          date: new Date(2025, (i % 12), (i % 28) + 1).toISOString(),
          startTime: `${9 + (i % 8)}:00`,
          endTime: `${9 + (i % 8)}:30`,
          status: appointmentStatuses[i % appointmentStatuses.length],
          reason: `Consulta ${i}`,
        },
      });
    })
  );

  console.log("Generando mediciones...");
  const measurements = await Promise.all(
    Array.from({ length: 500 }).map((_, i) => {
      // Make sure the user has a patientProfile
      if (!patients[i % patients.length].patientProfile) {
        // Skip this iteration if there's no patient profile
        return Promise.resolve(null);
      }
      
      return prisma.measurement.create({
        data: {
          patientId: patients[i % patients.length].patientProfile!.id,
          date: new Date(2025, (i % 12), (i % 28) + 1).toISOString(),
          type: i % 2 === 0 ? 'PESO' : 'PRESION_ARTERIAL',
          value: i % 2 === 0 ? 60 + (i % 40) : 110 + (i % 30),
          unit: i % 2 === 0 ? 'kg' : 'mmHg',
        },
      });
    }).filter(p => p !== null) // Filter out any null promises
  );

  console.log("Seed completado con éxito.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

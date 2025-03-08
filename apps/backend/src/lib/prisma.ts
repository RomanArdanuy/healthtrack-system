import { PrismaClient } from '@prisma/client';

// Crear una instancia global para desarrollo
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Exportar una instancia de PrismaClient
export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
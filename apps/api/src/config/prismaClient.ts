import { PrismaClient } from '../generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// 1. Declaramos un objeto global para TypeScript para mantener la instancia de Prisma
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };
const databasePoolMax = Number(process.env.DATABASE_POOL_MAX ?? 5);
const databaseIdleTimeoutMs = Number(process.env.DATABASE_IDLE_TIMEOUT_MS ?? 10000);
const databaseConnectionTimeoutMs = Number(
  process.env.DATABASE_CONNECTION_TIMEOUT_MS ?? 15000,
);

// 2. Configuramos el pool de 'pg', limitando las conexiones simultáneas locales
const pool = new pg.Pool({ 
  connectionString: process.env.DATABASE_URL, 
  max: databasePoolMax,
  idleTimeoutMillis: databaseIdleTimeoutMs,
  connectionTimeoutMillis: databaseConnectionTimeoutMs,
});

const adapter = new PrismaPg(pool);

// 3. Si ya existe una instancia en el entorno global, la reutilizamos. Si no, creamos una nueva.
export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

// 4. Si no estamos en producción, guardamos la instancia en el objeto global
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

import { PrismaClient } from '@prisma/client';

if (!process.env.DATABASE_URI) {
  throw new Error('DATABASE_URI is not defined');
}

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URI,
    },
  },
});

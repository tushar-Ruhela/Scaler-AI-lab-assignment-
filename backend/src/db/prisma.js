const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Test connection on startup
if (process.env.NODE_ENV === 'production' || process.env.DEBUG_PRISMA) {
  prisma.$connect()
    .then(() => console.log('✅ Prisma connected to database'))
    .catch((err) => console.error('❌ Prisma connection error:', err));
}

module.exports = prisma;

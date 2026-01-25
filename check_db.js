const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkDb() {
  try {
    const series = await prisma.serie.findMany({ include: { meta: true } });
    console.log('Total cards in DB:', series.length);
    console.log(JSON.stringify(series, null, 2));
  } catch (e) {
    console.error('Error checking DB:', e);
  } finally {
    await prisma.$disconnect();
  }
}

checkDb();

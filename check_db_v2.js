const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkDb() {
  try {
    console.log('Querying all series...');
    const series = await prisma.serie.findMany({
      include: { meta: true },
    });
    console.log('Total series:', series.length);
    series.forEach((s) => {
      console.log(
        `- ID: ${s.id}, Title: ${s.titulo}, MetaID: ${s.metaId}, Meta Loaded: ${!!s.meta}`,
      );
    });
  } catch (e) {
    console.error('Error querying DB:', e);
  } finally {
    await prisma.$disconnect();
  }
}

checkDb();

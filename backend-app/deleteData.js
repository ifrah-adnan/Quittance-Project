const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function deleteAllData() {
  await prisma.rentalPayment.deleteMany();
  await prisma.tenantProperties.deleteMany();
  await prisma.contract.deleteMany();
  await prisma.tenant.deleteMany();
  await prisma.property.deleteMany();
  await prisma.user.deleteMany();

  console.log("Toutes les données ont été supprimées des tables.");
}

deleteAllData()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Erreur lors de la suppression des données:", e);
    await prisma.$disconnect();
    process.exit(1);
  });

const { PrismaClient } = require("@prisma/client");
const fs = require("fs");

const prisma = new PrismaClient();

async function fetchDataAndStore() {
  const users = await prisma.user.findMany();
  const properties = await prisma.property.findMany();
  const tenants = await prisma.tenant.findMany();
  const contracts = await prisma.contract.findMany();
  const tenantProperties = await prisma.tenantProperties.findMany();
  const rentalPayments = await prisma.rentalPayment.findMany();

  const dataStore = {
    users,
    properties,
    tenants,
    contracts,
    tenantProperties,
    rentalPayments,
  };

  fs.writeFileSync("backup-data.json", JSON.stringify(dataStore, null, 2));
  console.log("Les données ont été sauvegardées dans backup-data.json");

  return dataStore;
}

fetchDataAndStore()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(
      "Erreur lors de la récupération et du stockage des données:",
      e
    );
    await prisma.$disconnect();
    process.exit(1);
  });

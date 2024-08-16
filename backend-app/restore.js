const { PrismaClient } = require("@prisma/client");
const fs = require("fs");

const prisma = new PrismaClient();

async function restoreData() {
  const data = JSON.parse(fs.readFileSync("backup-data.json", "utf8"));

  for (const user of data.users) {
    await prisma.user.create({ data: user });
  }

  for (const property of data.properties) {
    await prisma.property.create({ data: property });
  }

  for (const tenant of data.tenants) {
    await prisma.tenant.create({ data: tenant });
  }

  for (const contract of data.contracts) {
    await prisma.contract.create({ data: contract });
  }

  for (const tenantProperty of data.tenantProperties) {
    await prisma.tenantProperties.create({ data: tenantProperty });
  }

  for (const rentalPayment of data.rentalPayments) {
    await prisma.rentalPayment.create({ data: rentalPayment });
  }

  console.log("Data has been restored successfully");
}

restoreData()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Error restoring data:", e);
    await prisma.$disconnect();
    process.exit(1);
  });

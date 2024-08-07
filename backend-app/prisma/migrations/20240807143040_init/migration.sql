-- CreateEnum
CREATE TYPE "TenantType" AS ENUM ('ENTERPRISE', 'PERSON');

-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('VILLA', 'APARTMENT', 'HOUSE', 'STUDIO', 'OFFICE', 'GARAGE', 'AUTRE');

-- CreateTable
CREATE TABLE "Property" (
    "id" TEXT NOT NULL,
    "propertyNumber" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tenant" (
    "id" TEXT NOT NULL,
    "tenantType" "TenantType" NOT NULL,
    "name" TEXT NOT NULL,
    "ice" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "contactCin" TEXT NOT NULL,
    "contactInfo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TenantProperties" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,

    CONSTRAINT "TenantProperties_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Property_propertyNumber_key" ON "Property"("propertyNumber");

-- AddForeignKey
ALTER TABLE "TenantProperties" ADD CONSTRAINT "TenantProperties_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenantProperties" ADD CONSTRAINT "TenantProperties_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

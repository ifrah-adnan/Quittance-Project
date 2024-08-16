/*
  Warnings:

  - You are about to drop the column `email` on the `Tenant` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `cin` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `_UserProperties` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UserTenants` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_UserProperties" DROP CONSTRAINT "_UserProperties_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserProperties" DROP CONSTRAINT "_UserProperties_B_fkey";

-- DropForeignKey
ALTER TABLE "_UserTenants" DROP CONSTRAINT "_UserTenants_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserTenants" DROP CONSTRAINT "_UserTenants_B_fkey";

-- DropIndex
DROP INDEX "User_cin_key";

-- AlterTable
ALTER TABLE "Tenant" DROP COLUMN "email";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "address",
DROP COLUMN "cin",
DROP COLUMN "phoneNumber",
ADD COLUMN     "propertyId" TEXT,
ADD COLUMN     "tenantId" TEXT;

-- DropTable
DROP TABLE "_UserProperties";

-- DropTable
DROP TABLE "_UserTenants";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE SET NULL ON UPDATE CASCADE;

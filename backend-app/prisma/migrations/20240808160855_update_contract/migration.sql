/*
  Warnings:

  - You are about to drop the column `conditions` on the `TenantProperties` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `TenantProperties` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `TenantProperties` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `TenantProperties` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TenantProperties" DROP COLUMN "conditions",
DROP COLUMN "endDate",
DROP COLUMN "price",
DROP COLUMN "startDate";

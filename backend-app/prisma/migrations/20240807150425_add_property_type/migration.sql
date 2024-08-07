/*
  Warnings:

  - Added the required column `propertyType` to the `Property` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "propertyType" "PropertyType" NOT NULL;

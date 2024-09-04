-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('PERSON', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('HOMME', 'FEMME', 'AUTRE');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "companyName" TEXT,
ADD COLUMN     "contactEmail" TEXT,
ADD COLUMN     "contactName" TEXT,
ADD COLUMN     "contactPhoneNumber" TEXT,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "gender" "Gender",
ADD COLUMN     "ice" TEXT,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "logo" TEXT,
ADD COLUMN     "registrationNumber" TEXT,
ADD COLUMN     "taxId" TEXT,
ADD COLUMN     "tradeRegister" TEXT,
ADD COLUMN     "userType" "UserType" NOT NULL DEFAULT 'PERSON';

-- AlterEnum
ALTER TYPE "ItemCategory" ADD VALUE 'CURATED_BAG';

-- AlterTable
ALTER TABLE "RequestItem" ADD COLUMN "quantity" INTEGER NOT NULL DEFAULT 1;

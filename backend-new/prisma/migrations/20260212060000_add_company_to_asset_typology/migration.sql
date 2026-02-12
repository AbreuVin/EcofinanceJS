-- AlterTable: Add column as nullable first
ALTER TABLE "AssetTypology" ADD COLUMN "companyId" TEXT;

-- Update existing records: Set companyId from the related unit's companyId
UPDATE "AssetTypology" at
SET "companyId" = u."companyId"
FROM "Unit" u
WHERE at."unitId" = u."id";

-- For any global assets (unitId is NULL), assign to the first company (fallback)
UPDATE "AssetTypology"
SET "companyId" = (SELECT "id" FROM "Company" LIMIT 1)
WHERE "companyId" IS NULL;

-- Now make the column NOT NULL
ALTER TABLE "AssetTypology" ALTER COLUMN "companyId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "AssetTypology" ADD CONSTRAINT "AssetTypology_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

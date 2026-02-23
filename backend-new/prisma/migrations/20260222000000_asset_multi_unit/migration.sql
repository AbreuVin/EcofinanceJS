-- CreateTable: AssetTypologyUnit (join table for N:N relation)
CREATE TABLE "AssetTypologyUnit" (
    "id" SERIAL NOT NULL,
    "assetTypologyId" INTEGER NOT NULL,
    "unitId" INTEGER NOT NULL,

    CONSTRAINT "AssetTypologyUnit_pkey" PRIMARY KEY ("id")
);

-- Migrate existing data: move unitId values to the join table
INSERT INTO "AssetTypologyUnit" ("assetTypologyId", "unitId")
SELECT "id", "unitId" FROM "AssetTypology" WHERE "unitId" IS NOT NULL;

-- Drop old FK constraint and column
ALTER TABLE "AssetTypology" DROP CONSTRAINT IF EXISTS "AssetTypology_unitId_fkey";
ALTER TABLE "AssetTypology" DROP COLUMN "unitId";

-- CreateIndex: unique constraint on join table
CREATE UNIQUE INDEX "AssetTypologyUnit_assetTypologyId_unitId_key" ON "AssetTypologyUnit"("assetTypologyId", "unitId");

-- AddForeignKey
ALTER TABLE "AssetTypologyUnit" ADD CONSTRAINT "AssetTypologyUnit_assetTypologyId_fkey" FOREIGN KEY ("assetTypologyId") REFERENCES "AssetTypology"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetTypologyUnit" ADD CONSTRAINT "AssetTypologyUnit_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

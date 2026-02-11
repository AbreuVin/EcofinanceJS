-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cnpj" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "companyId" TEXT,
    "unitId" INTEGER,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPermission" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,

    CONSTRAINT "UserPermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Unit" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "numberOfWorkers" INTEGER NOT NULL,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Unit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssetTypology" (
    "id" SERIAL NOT NULL,
    "unitId" INTEGER,
    "sourceType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "assetFields" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "responsibleContactId" TEXT,
    "reportingFrequency" TEXT NOT NULL DEFAULT 'anual',

    CONSTRAINT "AssetTypology_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ManagedOption" (
    "id" SERIAL NOT NULL,
    "fieldKey" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "ManagedOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MobileCombustionData" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "period" TEXT NOT NULL,
    "unitId" INTEGER NOT NULL,
    "sourceDescription" TEXT,
    "isCompanyControlled" BOOLEAN NOT NULL,
    "inputType" TEXT,
    "fuelType" TEXT,
    "consumption" DOUBLE PRECISION,
    "consumptionUnit" TEXT,
    "distance" DOUBLE PRECISION,
    "distanceUnit" TEXT,
    "vehicleType" TEXT,
    "comments" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MobileCombustionData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StationaryCombustionData" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "period" TEXT NOT NULL,
    "unitId" INTEGER NOT NULL,
    "sourceDescription" TEXT,
    "fuelType" TEXT,
    "consumption" DOUBLE PRECISION,
    "unitMeasure" TEXT,
    "isCompanyControlled" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StationaryCombustionData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductionSalesData" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "period" TEXT NOT NULL,
    "unitId" INTEGER NOT NULL,
    "product" TEXT NOT NULL,
    "quantitySold" INTEGER NOT NULL,
    "measureUnit" TEXT NOT NULL,
    "comments" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductionSalesData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LubricantsIppuData" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "period" TEXT NOT NULL,
    "unitId" INTEGER NOT NULL,
    "emissionSource" TEXT,
    "lubricantType" TEXT,
    "consumption" DOUBLE PRECISION,
    "unitMeasure" TEXT,
    "isCompanyControlled" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LubricantsIppuData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FugitiveEmissionsData" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "period" TEXT NOT NULL,
    "unitId" INTEGER NOT NULL,
    "emissionSource" TEXT,
    "gasType" TEXT,
    "quantityReplaced" DOUBLE PRECISION,
    "unitMeasure" TEXT,
    "isCompanyControlled" BOOLEAN NOT NULL,
    "comments" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FugitiveEmissionsData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FertilizersData" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "period" TEXT NOT NULL,
    "unitId" INTEGER NOT NULL,
    "fertilizerType" TEXT,
    "quantityKg" DOUBLE PRECISION,
    "unitMeasure" TEXT,
    "percentNitrogen" DOUBLE PRECISION,
    "percentCarbonate" DOUBLE PRECISION,
    "isCompanyControlled" BOOLEAN NOT NULL,
    "comments" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FertilizersData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EffluentsControlledData" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "period" TEXT NOT NULL,
    "unitId" INTEGER NOT NULL,
    "treatmentOrDest" TEXT NOT NULL,
    "treatmentType" TEXT,
    "finalDestType" TEXT,
    "qtyEffluentM3" DOUBLE PRECISION NOT NULL,
    "unitEffluent" TEXT NOT NULL,
    "qtyOrganic" DOUBLE PRECISION NOT NULL,
    "unitOrganic" TEXT NOT NULL,
    "qtyNitrogen" DOUBLE PRECISION NOT NULL,
    "unitNitrogen" TEXT NOT NULL,
    "organicRemovedSludge" DOUBLE PRECISION,
    "unitSludge" TEXT,
    "comments" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EffluentsControlledData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DomesticEffluentsData" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "period" TEXT NOT NULL,
    "unitId" INTEGER NOT NULL,
    "workerType" TEXT NOT NULL,
    "numWorkers" INTEGER NOT NULL,
    "avgWorkHours" DOUBLE PRECISION NOT NULL,
    "septicTankOwner" TEXT NOT NULL,
    "comments" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DomesticEffluentsData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LandUseChangeData" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "period" TEXT NOT NULL,
    "unitId" INTEGER NOT NULL,
    "prevLandUse" TEXT NOT NULL,
    "biome" TEXT,
    "phytophysiognomy" TEXT,
    "areaType" TEXT,
    "areaHectares" DOUBLE PRECISION NOT NULL,
    "comments" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LandUseChangeData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SolidWasteData" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "period" TEXT NOT NULL,
    "unitId" INTEGER NOT NULL,
    "finalDestination" TEXT,
    "wasteType" TEXT,
    "quantityGenerated" DOUBLE PRECISION,
    "unitMeasure" TEXT,
    "cityStateDest" TEXT,
    "locationControlled" TEXT,
    "responsible" TEXT,
    "deptResponsible" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "internalTracking" TEXT,
    "comments" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SolidWasteData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ElectricityPurchaseData" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "period" TEXT NOT NULL,
    "unitId" INTEGER NOT NULL,
    "energySource" TEXT,
    "specifySource" TEXT,
    "consumption" DOUBLE PRECISION,
    "measureUnit" TEXT,
    "responsible" TEXT,
    "deptResponsible" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "traceability" TEXT,
    "comments" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ElectricityPurchaseData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchasedGoodsServicesData" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "period" TEXT NOT NULL,
    "unitId" INTEGER NOT NULL,
    "itemDescription" TEXT,
    "itemType" TEXT,
    "quantity" DOUBLE PRECISION,
    "unitMeasure" TEXT,
    "acquisitionValue" DOUBLE PRECISION,
    "thirdPartyGoods" TEXT,
    "responsible" TEXT,
    "deptResponsible" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "comments" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PurchasedGoodsServicesData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CapitalGoodsData" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "period" TEXT NOT NULL,
    "unitId" INTEGER NOT NULL,
    "capitalGood" TEXT,
    "quantity" INTEGER,
    "unitMeasure" TEXT,
    "acquisitionValue" DOUBLE PRECISION,
    "responsible" TEXT,
    "deptResponsible" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "comments" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CapitalGoodsData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UpstreamTransportData" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "period" TEXT NOT NULL,
    "unitId" INTEGER NOT NULL,
    "transportedItem" TEXT,
    "transportMode" TEXT,
    "reportType" TEXT,
    "fuel" TEXT,
    "consumption" DOUBLE PRECISION,
    "consumptionUnit" TEXT,
    "vehicleClass" TEXT,
    "distance" DOUBLE PRECISION,
    "distanceUnit" TEXT,
    "transportedLoad" DOUBLE PRECISION,
    "tripCount" INTEGER,
    "origin" TEXT,
    "destination" TEXT,
    "responsible" TEXT,
    "deptResponsible" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "comments" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UpstreamTransportData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessTravelLandData" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "period" TEXT NOT NULL,
    "unitId" INTEGER NOT NULL,
    "tripDescription" TEXT,
    "travelMode" TEXT,
    "reportType" TEXT,
    "fuel" TEXT,
    "consumption" DOUBLE PRECISION,
    "consumptionUnit" TEXT,
    "distance" DOUBLE PRECISION,
    "distanceUnit" TEXT,
    "kmReimbursed" TEXT,
    "responsible" TEXT,
    "deptResponsible" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "comments" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusinessTravelLandData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DownstreamTransportData" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "period" TEXT NOT NULL,
    "unitId" INTEGER NOT NULL,
    "transportedItem" TEXT,
    "transportMode" TEXT,
    "reportType" TEXT,
    "fuel" TEXT,
    "consumption" DOUBLE PRECISION,
    "consumptionUnit" TEXT,
    "vehicleClass" TEXT,
    "distance" DOUBLE PRECISION,
    "distanceUnit" TEXT,
    "transportedLoad" DOUBLE PRECISION,
    "tripCount" INTEGER,
    "origin" TEXT,
    "destination" TEXT,
    "responsible" TEXT,
    "deptResponsible" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "comments" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DownstreamTransportData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WasteTransportData" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "period" TEXT NOT NULL,
    "unitId" INTEGER NOT NULL,
    "transportedItem" TEXT,
    "reportType" TEXT,
    "fuel" TEXT,
    "consumption" DOUBLE PRECISION,
    "consumptionUnit" TEXT,
    "vehicleClass" TEXT,
    "distance" DOUBLE PRECISION,
    "distanceUnit" TEXT,
    "transportedLoad" DOUBLE PRECISION,
    "tripCount" INTEGER,
    "responsible" TEXT,
    "deptResponsible" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "comments" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WasteTransportData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomeOfficeData" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "period" TEXT NOT NULL,
    "unitId" INTEGER NOT NULL,
    "workRegime" TEXT,
    "numEmployees" INTEGER,
    "responsible" TEXT,
    "deptResponsible" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "comments" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomeOfficeData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AirTravelData" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "period" TEXT NOT NULL,
    "unitId" INTEGER NOT NULL,
    "tripDescription" TEXT,
    "airportCodeOrigin" TEXT,
    "airportCodeDest" TEXT,
    "tripCount" INTEGER,
    "responsible" TEXT,
    "deptResponsible" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "comments" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AirTravelData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeCommutingData" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "period" TEXT NOT NULL,
    "unitId" INTEGER NOT NULL,
    "identifier" TEXT,
    "methodUsed" TEXT,
    "reportType" TEXT,
    "fuelType" TEXT,
    "consumption" DOUBLE PRECISION,
    "consumptionUnit" TEXT,
    "distanceKm" DOUBLE PRECISION,
    "employeeAddress" TEXT,
    "workAddress" TEXT,
    "daysCommuted" INTEGER,
    "responsible" TEXT,
    "deptResponsible" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "comments" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmployeeCommutingData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnergyGenerationData" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "period" TEXT NOT NULL,
    "unitId" INTEGER NOT NULL,
    "sourceDescription" TEXT,
    "generationSource" TEXT,
    "totalGeneration" DOUBLE PRECISION,
    "measureUnit" TEXT,
    "responsible" TEXT,
    "deptResponsible" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "comments" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EnergyGenerationData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlantedForestData" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "period" TEXT NOT NULL,
    "unitId" INTEGER NOT NULL,
    "areaId" TEXT,
    "speciesName" TEXT,
    "areaPrePreLast" DOUBLE PRECISION,
    "agePrePreLast" INTEGER,
    "agePreLast" INTEGER,
    "areaHarvestedPreLast" DOUBLE PRECISION,
    "currentArea" DOUBLE PRECISION,
    "responsible" TEXT,
    "deptResponsible" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "comments" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlantedForestData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConservationAreaData" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "period" TEXT NOT NULL,
    "unitId" INTEGER NOT NULL,
    "description" TEXT,
    "biome" TEXT,
    "phytophysiognomy" TEXT,
    "plantedArea" TEXT,
    "plantingStatus" TEXT,
    "areaStartYear" DOUBLE PRECISION,
    "areaEndYear" DOUBLE PRECISION,
    "changeReason" TEXT,
    "responsible" TEXT,
    "deptResponsible" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "comments" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConservationAreaData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_name_key" ON "Company"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Company_cnpj_key" ON "Company"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserPermission_userId_sourceType_key" ON "UserPermission"("userId", "sourceType");

-- CreateIndex
CREATE UNIQUE INDEX "ManagedOption_fieldKey_value_key" ON "ManagedOption"("fieldKey", "value");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPermission" ADD CONSTRAINT "UserPermission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Unit" ADD CONSTRAINT "Unit_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetTypology" ADD CONSTRAINT "AssetTypology_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetTypology" ADD CONSTRAINT "AssetTypology_responsibleContactId_fkey" FOREIGN KEY ("responsibleContactId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MobileCombustionData" ADD CONSTRAINT "MobileCombustionData_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StationaryCombustionData" ADD CONSTRAINT "StationaryCombustionData_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionSalesData" ADD CONSTRAINT "ProductionSalesData_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LubricantsIppuData" ADD CONSTRAINT "LubricantsIppuData_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FugitiveEmissionsData" ADD CONSTRAINT "FugitiveEmissionsData_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FertilizersData" ADD CONSTRAINT "FertilizersData_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EffluentsControlledData" ADD CONSTRAINT "EffluentsControlledData_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DomesticEffluentsData" ADD CONSTRAINT "DomesticEffluentsData_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LandUseChangeData" ADD CONSTRAINT "LandUseChangeData_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolidWasteData" ADD CONSTRAINT "SolidWasteData_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ElectricityPurchaseData" ADD CONSTRAINT "ElectricityPurchaseData_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchasedGoodsServicesData" ADD CONSTRAINT "PurchasedGoodsServicesData_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CapitalGoodsData" ADD CONSTRAINT "CapitalGoodsData_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UpstreamTransportData" ADD CONSTRAINT "UpstreamTransportData_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessTravelLandData" ADD CONSTRAINT "BusinessTravelLandData_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DownstreamTransportData" ADD CONSTRAINT "DownstreamTransportData_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WasteTransportData" ADD CONSTRAINT "WasteTransportData_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomeOfficeData" ADD CONSTRAINT "HomeOfficeData_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AirTravelData" ADD CONSTRAINT "AirTravelData_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeCommutingData" ADD CONSTRAINT "EmployeeCommutingData_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnergyGenerationData" ADD CONSTRAINT "EnergyGenerationData_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlantedForestData" ADD CONSTRAINT "PlantedForestData_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConservationAreaData" ADD CONSTRAINT "ConservationAreaData_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

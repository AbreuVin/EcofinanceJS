-- CreateTable
CREATE TABLE "AssetTypology" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "unitId" INTEGER NOT NULL,
    "sourceType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "assetFields" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "responsibleContactId" INTEGER,
    "reportingFrequency" TEXT NOT NULL DEFAULT 'anual',
    CONSTRAINT "AssetTypology_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ManagedOption" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fieldKey" TEXT NOT NULL,
    "value" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "MobileCombustionData" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "year" INTEGER NOT NULL,
    "period" TEXT NOT NULL,
    "unitId" INTEGER NOT NULL,
    "sourceDescription" TEXT,
    "isCompanyControlled" BOOLEAN NOT NULL,
    "inputType" TEXT,
    "fuelType" TEXT,
    "consumption" REAL,
    "consumptionUnit" TEXT,
    "distance" REAL,
    "distanceUnit" TEXT,
    "vehicleType" TEXT,
    "comments" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MobileCombustionData_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "StationaryCombustionData" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "year" INTEGER NOT NULL,
    "period" TEXT NOT NULL,
    "unitId" INTEGER NOT NULL,
    "sourceDescription" TEXT,
    "fuelType" TEXT,
    "consumption" REAL,
    "unitMeasure" TEXT,
    "isCompanyControlled" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "StationaryCombustionData_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProductionSalesData" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "year" INTEGER NOT NULL,
    "period" TEXT NOT NULL,
    "unitId" INTEGER NOT NULL,
    "product" TEXT NOT NULL,
    "quantitySold" INTEGER NOT NULL,
    "measureUnit" TEXT NOT NULL,
    "comments" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ProductionSalesData_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LubricantsIppuData" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "year" INTEGER NOT NULL,
    "period" TEXT NOT NULL,
    "unitId" INTEGER NOT NULL,
    "emissionSource" TEXT,
    "lubricantType" TEXT,
    "consumption" REAL,
    "unitMeasure" TEXT,
    "isCompanyControlled" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "LubricantsIppuData_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FugitiveEmissionsData" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "year" INTEGER NOT NULL,
    "period" TEXT NOT NULL,
    "unitId" INTEGER NOT NULL,
    "emissionSource" TEXT,
    "gasType" TEXT,
    "quantityReplaced" REAL,
    "unitMeasure" TEXT,
    "isCompanyControlled" BOOLEAN NOT NULL,
    "comments" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "FugitiveEmissionsData_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FertilizersData" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "year" INTEGER NOT NULL,
    "period" TEXT NOT NULL,
    "unitId" INTEGER NOT NULL,
    "fertilizerType" TEXT,
    "quantityKg" REAL,
    "unitMeasure" TEXT,
    "percentNitrogen" REAL,
    "percentCarbonate" REAL,
    "isCompanyControlled" BOOLEAN NOT NULL,
    "comments" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "FertilizersData_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EffluentsControlledData" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "year" INTEGER NOT NULL,
    "period" TEXT NOT NULL,
    "unitId" INTEGER NOT NULL,
    "treatmentOrDest" TEXT NOT NULL,
    "treatmentType" TEXT,
    "finalDestType" TEXT,
    "qtyEffluentM3" REAL NOT NULL,
    "unitEffluent" TEXT NOT NULL,
    "qtyOrganic" REAL NOT NULL,
    "unitOrganic" TEXT NOT NULL,
    "qtyNitrogen" REAL NOT NULL,
    "unitNitrogen" TEXT NOT NULL,
    "organicRemovedSludge" REAL,
    "unitSludge" TEXT,
    "comments" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "EffluentsControlledData_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DomesticEffluentsData" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "year" INTEGER NOT NULL,
    "period" TEXT NOT NULL,
    "unitId" INTEGER NOT NULL,
    "workerType" TEXT NOT NULL,
    "numWorkers" INTEGER NOT NULL,
    "avgWorkHours" REAL NOT NULL,
    "septicTankOwner" TEXT NOT NULL,
    "comments" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "DomesticEffluentsData_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LandUseChangeData" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "year" INTEGER NOT NULL,
    "period" TEXT NOT NULL,
    "unitId" INTEGER NOT NULL,
    "prevLandUse" TEXT NOT NULL,
    "biome" TEXT,
    "phytophysiognomy" TEXT,
    "areaType" TEXT,
    "areaHectares" REAL NOT NULL,
    "comments" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "LandUseChangeData_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SolidWasteData" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "year" INTEGER NOT NULL,
    "period" TEXT NOT NULL,
    "unitId" INTEGER NOT NULL,
    "finalDestination" TEXT,
    "wasteType" TEXT,
    "quantityGenerated" REAL,
    "unitMeasure" TEXT,
    "cityStateDest" TEXT,
    "locationControlled" TEXT,
    "responsible" TEXT,
    "deptResponsible" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "internalTracking" TEXT,
    "comments" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SolidWasteData_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ElectricityPurchaseData" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "year" INTEGER NOT NULL,
    "period" TEXT NOT NULL,
    "unitId" INTEGER NOT NULL,
    "energySource" TEXT,
    "specifySource" TEXT,
    "consumption" REAL,
    "measureUnit" TEXT,
    "responsible" TEXT,
    "deptResponsible" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "traceability" TEXT,
    "comments" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ElectricityPurchaseData_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PurchasedGoodsServicesData" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "year" INTEGER NOT NULL,
    "period" TEXT NOT NULL,
    "unitId" INTEGER NOT NULL,
    "itemDescription" TEXT,
    "itemType" TEXT,
    "quantity" REAL,
    "unitMeasure" TEXT,
    "acquisitionValue" REAL,
    "thirdPartyGoods" TEXT,
    "responsible" TEXT,
    "deptResponsible" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "comments" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PurchasedGoodsServicesData_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CapitalGoodsData" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "year" INTEGER NOT NULL,
    "period" TEXT NOT NULL,
    "unitId" INTEGER NOT NULL,
    "capitalGood" TEXT,
    "quantity" INTEGER,
    "unitMeasure" TEXT,
    "acquisitionValue" REAL,
    "responsible" TEXT,
    "deptResponsible" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "comments" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CapitalGoodsData_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UpstreamTransportData" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "year" INTEGER NOT NULL,
    "period" TEXT NOT NULL,
    "unitId" INTEGER NOT NULL,
    "transportedItem" TEXT,
    "transportMode" TEXT,
    "reportType" TEXT,
    "fuel" TEXT,
    "consumption" REAL,
    "consumptionUnit" TEXT,
    "vehicleClass" TEXT,
    "distance" REAL,
    "distanceUnit" TEXT,
    "transportedLoad" REAL,
    "tripCount" INTEGER,
    "origin" TEXT,
    "destination" TEXT,
    "responsible" TEXT,
    "deptResponsible" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "comments" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UpstreamTransportData_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BusinessTravelLandData" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "year" INTEGER NOT NULL,
    "period" TEXT NOT NULL,
    "unitId" INTEGER NOT NULL,
    "tripDescription" TEXT,
    "travelMode" TEXT,
    "reportType" TEXT,
    "fuel" TEXT,
    "consumption" REAL,
    "consumptionUnit" TEXT,
    "distance" REAL,
    "distanceUnit" TEXT,
    "kmReimbursed" TEXT,
    "responsible" TEXT,
    "deptResponsible" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "comments" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "BusinessTravelLandData_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DownstreamTransportData" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "year" INTEGER NOT NULL,
    "period" TEXT NOT NULL,
    "unitId" INTEGER NOT NULL,
    "transportedItem" TEXT,
    "transportMode" TEXT,
    "reportType" TEXT,
    "fuel" TEXT,
    "consumption" REAL,
    "consumptionUnit" TEXT,
    "vehicleClass" TEXT,
    "distance" REAL,
    "distanceUnit" TEXT,
    "transportedLoad" REAL,
    "tripCount" INTEGER,
    "origin" TEXT,
    "destination" TEXT,
    "responsible" TEXT,
    "deptResponsible" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "comments" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "DownstreamTransportData_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WasteTransportData" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "year" INTEGER NOT NULL,
    "period" TEXT NOT NULL,
    "unitId" INTEGER NOT NULL,
    "transportedItem" TEXT,
    "reportType" TEXT,
    "fuel" TEXT,
    "consumption" REAL,
    "consumptionUnit" TEXT,
    "vehicleClass" TEXT,
    "distance" REAL,
    "distanceUnit" TEXT,
    "transportedLoad" REAL,
    "tripCount" INTEGER,
    "responsible" TEXT,
    "deptResponsible" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "comments" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "WasteTransportData_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "HomeOfficeData" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "HomeOfficeData_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AirTravelData" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AirTravelData_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EmployeeCommutingData" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "year" INTEGER NOT NULL,
    "period" TEXT NOT NULL,
    "unitId" INTEGER NOT NULL,
    "identifier" TEXT,
    "methodUsed" TEXT,
    "reportType" TEXT,
    "fuelType" TEXT,
    "consumption" REAL,
    "consumptionUnit" TEXT,
    "distanceKm" REAL,
    "employeeAddress" TEXT,
    "workAddress" TEXT,
    "daysCommuted" INTEGER,
    "responsible" TEXT,
    "deptResponsible" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "comments" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "EmployeeCommutingData_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EnergyGenerationData" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "year" INTEGER NOT NULL,
    "period" TEXT NOT NULL,
    "unitId" INTEGER NOT NULL,
    "sourceDescription" TEXT,
    "generationSource" TEXT,
    "totalGeneration" REAL,
    "measureUnit" TEXT,
    "responsible" TEXT,
    "deptResponsible" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "comments" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "EnergyGenerationData_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PlantedForestData" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "year" INTEGER NOT NULL,
    "period" TEXT NOT NULL,
    "unitId" INTEGER NOT NULL,
    "areaId" TEXT,
    "speciesName" TEXT,
    "areaPrePreLast" REAL,
    "agePrePreLast" INTEGER,
    "agePreLast" INTEGER,
    "areaHarvestedPreLast" REAL,
    "currentArea" REAL,
    "responsible" TEXT,
    "deptResponsible" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "comments" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PlantedForestData_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ConservationAreaData" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "year" INTEGER NOT NULL,
    "period" TEXT NOT NULL,
    "unitId" INTEGER NOT NULL,
    "description" TEXT,
    "biome" TEXT,
    "phytophysiognomy" TEXT,
    "plantedArea" TEXT,
    "plantingStatus" TEXT,
    "areaStartYear" REAL,
    "areaEndYear" REAL,
    "changeReason" TEXT,
    "responsible" TEXT,
    "deptResponsible" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "comments" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ConservationAreaData_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "ManagedOption_fieldKey_value_key" ON "ManagedOption"("fieldKey", "value");

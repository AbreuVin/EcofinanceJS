/**
 * Gera um template Excel avançado ("UI Offline") para preenchimento de dados ESG.
 * Layout baseado no template do cliente (Combustão Móvel).
 *
 * Estrutura de colunas (fixas):
 *   A: __assetId (OCULTA) — para identificação na importação
 *   B: Unidade Empresarial
 *   C: Fonte de Emissão
 *   D: Tipo de Reporte (ex: "Consumo de Combustível", "Distância percorrida")
 *   E: Combustível / Veículo utilizado
 *   F: Unidade de medida
 *   G: Mensal ou anual?
 *   H: Responsável pelo reporte
 *   I-T: Janeiro a Dezembro
 *   U: Anual
 *
 * Features:
 * - Coluna A oculta com assetId
 * - Proteção condicional: mensal → meses editáveis, anual → só "Anual" editável
 * - Dados existentes preenchidos automaticamente
 * - Aba oculta __metadata para validação na importação
 * - Respeita os filtros da página (só gera assets visíveis)
 */

import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { getModuleFields } from "@/features/data-entry/config/module-fields";
import {
    MONTHS_LIST,
    TEMPLATE_VERSION,
    METADATA_SHEET_NAME,
    DATA_SHEET_NAME,
    ASSET_ID_COLUMN_HEADER,
    HEADER_ROW,
    DATA_START_ROW,
    TITLE_FONT,
    HEADER_FILL,
    INSTRUCTION_FILL,
    LOCKED_FILL,
    EDITABLE_FILL,
    INFO_CELL_FILL,
    WRAP_ALIGNMENT,
    CENTER_ALIGNMENT,
    CELL_BORDER,
    PROTECTION_PASSWORD,
    getModuleFriendlyName,
} from "./excelConstants";

// ── Types ───────────────────────────────────────────

interface Asset {
    id: number;
    description: string;
    sourceType: string;
    reportingFrequency: string;
    assetFields: string | Record<string, any>;
    unitId?: number;
    units?: { unitId: number; unit?: { name?: string } }[];
    traceabilityResponsible?: string;
}

interface Report {
    id: number;
    year: number;
    period: string;
    sourceDescription?: string;
    unitId?: number;
    [key: string]: any;
}

interface UnitInfo {
    id: number;
    name: string;
}

interface GenerateTemplateOptions {
    assets: Asset[];
    reports: Report[];
    currentYear: number;
    sourceType: string;
    unitId?: number;
    unitName?: string;
    units?: UnitInfo[];
}

// ── Column definitions matching client template ─────

const FIXED_COLS = [
    { key: '__assetId', header: ASSET_ID_COLUMN_HEADER, width: 0.1 },    // A - HIDDEN
    { key: 'unitName', header: 'Unidade Empresarial', width: 30 },       // B
    { key: 'sourceDescription', header: 'Fonte de Emissão', width: 18 }, // C
    { key: 'reportType', header: 'Tipo de Reporte', width: 18 },         // D
    { key: 'fuelOrVehicle', header: 'Combustível / Veículo utilizado', width: 19 }, // E
    { key: 'unitMeasure', header: 'Unidade de medida', width: 19 },      // F
    { key: 'frequency', header: 'Mensal ou anual?', width: 15 },         // G
    { key: 'responsible', header: 'Responsável pelo reporte', width: 15 }, // H
];

const PERIOD_COLS = [...MONTHS_LIST, "Anual"]; // I..U (13 cols)

// ── Main function ───────────────────────────────────

export async function generateEsgExcelTemplate({
    assets,
    reports,
    currentYear,
    sourceType,
    unitId,
    unitName,
    units = [],
}: GenerateTemplateOptions): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Ecofinance";
    workbook.created = new Date();

    const moduleName = getModuleFriendlyName(sourceType);
    const moduleFields = getModuleFields(sourceType);

    const totalCols = FIXED_COLS.length + PERIOD_COLS.length;

    // ── 1. Create data sheet ──────────────────────────
    const ws = workbook.addWorksheet(DATA_SHEET_NAME);

    // ── 2. Row 1: Title ───────────────────────────────
    ws.mergeCells(1, 1, 1, totalCols);
    const titleCell = ws.getCell(1, 1);
    titleCell.value = moduleName;
    titleCell.font = { ...TITLE_FONT, size: 16 };
    ws.getRow(1).height = 28;

    // ── 3. Row 2-3: Instructions ──────────────────────
    // Row 2: short instruction (bold)
    ws.mergeCells(2, 1, 2, totalCols);
    const instrCell = ws.getCell(2, 1);
    instrCell.value = getInstructionText(sourceType);
    instrCell.font = { bold: true, size: 12 };
    instrCell.alignment = WRAP_ALIGNMENT;
    ws.getRow(2).height = 35;

    // Row 3: detailed instruction (merged across all cols)
    ws.mergeCells(3, 1, 3, totalCols);
    const detailCell = ws.getCell(3, 1);
    detailCell.value = getDetailedInstructionText(sourceType);
    detailCell.font = { size: 12 };
    detailCell.alignment = WRAP_ALIGNMENT;
    detailCell.fill = INSTRUCTION_FILL;
    ws.getRow(3).height = 55;

    // ── 4. Row 4: Headers ─────────────────────────────
    const headerRow = ws.getRow(HEADER_ROW);
    const allHeaders = [
        ...FIXED_COLS.map(c => c.header),
        ...PERIOD_COLS,
    ];

    allHeaders.forEach((header, idx) => {
        const cell = headerRow.getCell(idx + 1);
        cell.value = header;
        cell.font = { bold: true, size: 12 };
        cell.alignment = { ...CENTER_ALIGNMENT, wrapText: true };
        cell.fill = HEADER_FILL;
        cell.border = CELL_BORDER;
    });
    headerRow.height = 22;

    // ── 5. Column widths ──────────────────────────────
    FIXED_COLS.forEach((col, idx) => {
        ws.getColumn(idx + 1).width = col.width;
    });
    // Hide column A (__assetId)
    ws.getColumn(1).hidden = true;

    // Period columns
    for (let i = 0; i < PERIOD_COLS.length; i++) {
        ws.getColumn(FIXED_COLS.length + 1 + i).width = i < 12 ? 10 : 10; // months + Anual
    }

    // ── 6. Data rows ──────────────────────────────────
    const unitMap = new Map(units.map(u => [u.id, u.name]));

    assets.forEach((asset, rowIdx) => {
        const rowNumber = DATA_START_ROW + rowIdx;
        const row = ws.getRow(rowNumber);

        const assetConfig = parseAssetFields(asset.assetFields);
        const isMensal = asset.reportingFrequency?.toLowerCase() === "mensal";

        // Resolve unit name
        const assetUnitName = resolveUnitName(asset, unitId, unitName, unitMap);

        // Determine report type and fuel/vehicle from assetFields
        const reportType = getReportType(assetConfig, sourceType);
        const fuelOrVehicle = getFuelOrVehicle(assetConfig, sourceType);
        const measureUnit = assetConfig.unitMeasure || assetConfig.consumptionUnit || assetConfig.distanceUnit || "";
        const responsible = asset.traceabilityResponsible || assetConfig.responsible || "";

        // Col positions
        let colIdx = 1;

        // A: __assetId (hidden)
        setCellLocked(row.getCell(colIdx++), asset.id, INFO_CELL_FILL, { size: 8, color: { argb: 'FF999999' } });

        // B: Unidade Empresarial
        setCellLocked(row.getCell(colIdx++), assetUnitName);

        // C: Fonte de Emissão
        setCellLocked(row.getCell(colIdx++), asset.description);

        // D: Tipo de Reporte
        setCellLocked(row.getCell(colIdx++), reportType);

        // E: Combustível / Veículo utilizado
        setCellLocked(row.getCell(colIdx++), fuelOrVehicle);

        // F: Unidade de medida
        setCellLocked(row.getCell(colIdx++), measureUnit);

        // G: Mensal ou anual?
        setCellLocked(row.getCell(colIdx++), isMensal ? "Mensal" : "Anual");

        // H: Responsável pelo reporte
        setCellLocked(row.getCell(colIdx++), responsible);

        // I-T: Janeiro a Dezembro (12 cols)
        const primaryField = moduleFields[0]?.name || 'consumption';

        MONTHS_LIST.forEach(month => {
            const cell = row.getCell(colIdx++);
            const isEditable = isMensal;

            cell.protection = { locked: !isEditable };
            cell.fill = isEditable ? EDITABLE_FILL : LOCKED_FILL;
            cell.border = CELL_BORDER;
            cell.alignment = CENTER_ALIGNMENT;

            if (isEditable) {
                const existing = findReport(reports, asset, month, currentYear);
                if (existing && existing[primaryField] != null) {
                    cell.value = existing[primaryField];
                }
            }
        });

        // U: Anual
        const annualCell = row.getCell(colIdx++);
        const isAnnualEditable = !isMensal;
        annualCell.protection = { locked: !isAnnualEditable };
        annualCell.fill = isAnnualEditable ? EDITABLE_FILL : LOCKED_FILL;
        annualCell.border = CELL_BORDER;
        annualCell.alignment = CENTER_ALIGNMENT;

        if (isAnnualEditable) {
            const existing = findReport(reports, asset, "Anual", currentYear);
            if (existing && existing[primaryField] != null) {
                annualCell.value = existing[primaryField];
            }
        }
    });

    // ── 7. Protect worksheet ──────────────────────────
    await ws.protect(PROTECTION_PASSWORD, {
        selectLockedCells: true,
        selectUnlockedCells: true,
        formatCells: false,
        formatColumns: false,
        formatRows: false,
        insertColumns: false,
        insertRows: false,
        deleteColumns: false,
        deleteRows: false,
        sort: false,
        autoFilter: false,
    });

    // ── 8. Metadata sheet (hidden) ────────────────────
    const metaSheet = workbook.addWorksheet(METADATA_SHEET_NAME);
    metaSheet.state = "hidden";

    metaSheet.getCell("A1").value = `version=${TEMPLATE_VERSION}`;
    metaSheet.getCell("A2").value = `sourceType=${sourceType}`;
    metaSheet.getCell("A3").value = `year=${currentYear}`;
    metaSheet.getCell("A4").value = `generatedAt=${new Date().toISOString()}`;
    if (unitId) {
        metaSheet.getCell("A5").value = `unitId=${unitId}`;
    }

    // ── 9. Generate and download ──────────────────────
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const safeName = moduleName.replace(/[^a-z0-9áàâãéêíóôõúç]/gi, "_");
    const safeUnit = unitName ? `_${unitName.replace(/[^a-z0-9]/gi, "_")}` : "";
    saveAs(blob, `Template_${safeName}${safeUnit}_${currentYear}.xlsx`);
}

// ── Helper functions ────────────────────────────────

function setCellLocked(cell: ExcelJS.Cell, value: any, fill?: ExcelJS.Fill, font?: Partial<ExcelJS.Font>) {
    cell.value = value;
    cell.protection = { locked: true };
    cell.fill = fill || INFO_CELL_FILL;
    cell.border = CELL_BORDER;
    cell.font = font || { size: 12 };
}

function parseAssetFields(assetFields: string | Record<string, any>): Record<string, any> {
    if (typeof assetFields === "string") {
        try { return JSON.parse(assetFields || "{}"); } catch { return {}; }
    }
    return assetFields || {};
}

function resolveUnitName(
    asset: any,
    selectedUnitId?: number,
    selectedUnitName?: string,
    unitMap?: Map<number, string>,
): string {
    // If a specific unit is selected, use its name
    if (selectedUnitName) return selectedUnitName;

    // Try to get from asset's unit associations
    if (asset.units && asset.units.length > 0) {
        if (selectedUnitId) {
            const match = asset.units.find((u: any) => u.unitId === selectedUnitId);
            if (match?.unit?.name) return match.unit.name;
        }
        // Use the first unit's name if unitMap available
        if (unitMap) {
            const firstUnitId = asset.units[0].unitId;
            const name = unitMap.get(firstUnitId);
            if (name) return name;
        }
    }

    return asset.unitName || "";
}

/**
 * Determina o "Tipo de Reporte" baseado no assetFields.
 * Ex: "Consumo de Combustível", "Distância percorrida"
 */
function getReportType(config: Record<string, any>, sourceType: string): string {
    if (config.inputType === 'distancia') return "Distância percorrida";
    if (config.inputType === 'consumo') return "Consumo de Combustível";

    // Module-specific defaults
    const reportTypeMap: Record<string, string> = {
        'mobile_combustion': "Consumo de Combustível",
        'stationary_combustion': "Consumo de Combustível",
        'electricity_purchase': "Consumo de Energia",
        'energy_generation': "Geração de Energia",
        'fugitive_emissions': "Quantidade Reposta",
        'fertilizers': "Quantidade de Fertilizante",
        'solid_waste': "Quantidade Gerada",
        'land_use_change': "Área Utilizada",
        'production_sales': "Quantidade Vendida",
    };

    return reportTypeMap[sourceType] || "Valor Reportado";
}

/**
 * Determina o "Combustível / Veículo utilizado" baseado no assetFields.
 */
function getFuelOrVehicle(config: Record<string, any>, _sourceType: string): string {
    // Try common field names
    return config.fuelType
        || config.vehicleType
        || config.gasType
        || config.lubricantType
        || config.fertilizerType
        || config.wasteType
        || config.energySource
        || config.generationSource
        || config.travelMode
        || config.methodUsed
        || "";
}

function findReport(
    reports: Report[],
    asset: any,
    period: string,
    year: number,
): Report | undefined {
    return reports.find(r =>
        r.year === year &&
        r.period === period &&
        r.sourceDescription === asset.description
    );
}

// ── Instruction texts ───────────────────────────────

function getInstructionText(sourceType: string): string {
    const moduleInstructions: Record<string, string> = {
        'mobile_combustion': "Caso o controle do combustível seja feito em uma unidade diferente da solicitada (ex. lenha é controlada em m³ em vez de toneladas), verificar documento de conversão de unidades.",
        'stationary_combustion': "Preencher o consumo de combustível para cada fonte estacionária cadastrada, atentando-se à unidade de medida.",
        'electricity_purchase': "Preencher o consumo de energia elétrica para cada fonte cadastrada.",
    };
    return moduleInstructions[sourceType]
        || "Preencher os valores para cada fonte cadastrada, atentando-se à unidade de medida de cada item.";
}

function getDetailedInstructionText(_sourceType: string): string {
    return "Preencha APENAS as células em branco (meses ou anual, conforme a frequência configurada). " +
        "Células hachuradas/cinza estão bloqueadas e não devem ser alteradas. " +
        "As colunas de identificação (Unidade, Fonte, Combustível, etc.) já vêm preenchidas com os dados cadastrados no sistema. " +
        "Após o preenchimento, salve o arquivo e importe de volta na plataforma.";
}

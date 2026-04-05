/**
 * Gera um template Excel avançado ("UI Offline") para preenchimento de dados ESG.
 * Layout baseado nos templates de referência do cliente, com configuração por escopo.
 *
 * Estrutura de colunas (variável por escopo):
 *   Col 1: __assetId (OCULTA — para identificação na importação)
 *   Col 2..N: Colunas fixas do escopo (Unidade, Fonte, Combustível/Gás, etc.)
 *   Col N+1..N+12: Janeiro a Dezembro
 *   Col N+13: Anual
 *
 * Features:
 * - Coluna 1 oculta com assetId (retrocompatível com parser)
 * - Layout de colunas específico por escopo (Estacionária, Móvel, Fugitivas, etc.)
 * - Larguras, alturas e estilos aderentes aos templates de referência do cliente
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
    HEADER_FONT,
    INSTRUCTION_FONT,
    DETAIL_FONT,
    DATA_FONT,
    HEADER_FILL,
    INSTRUCTION_FILL,
    LOCKED_FILL,
    EDITABLE_FILL,
    INFO_CELL_FILL,
    WRAP_ALIGNMENT,
    CENTER_ALIGNMENT,
    HEADER_ALIGNMENT,
    CELL_BORDER,
    PROTECTION_PASSWORD,
    PERIOD_COLUMN_WIDTHS,
    DEFAULT_FONT_NAME,
    getModuleFriendlyName,
    getScopeColumnLayout,
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

// ── Period columns ──────────────────────────────────

const PERIOD_COLS = [...MONTHS_LIST, "Anual"]; // 13 cols

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
    const scopeLayout = getScopeColumnLayout(sourceType);
    const fixedCols = scopeLayout.fixedColumns;
    const heights = scopeLayout.rowHeights;

    // Total columns = 1 (__assetId hidden) + fixedCols + 13 period cols
    const totalCols = 1 + fixedCols.length + PERIOD_COLS.length;

    // ── 1. Create data sheet ──────────────────────────
    const ws = workbook.addWorksheet(DATA_SHEET_NAME);

    // ── 2. Row 1: Title ───────────────────────────────
    ws.mergeCells(1, 1, 1, totalCols);
    const titleCell = ws.getCell(1, 1);
    titleCell.value = moduleName;
    titleCell.font = { ...TITLE_FONT };
    ws.getRow(1).height = heights.title;

    // ── 3. Row 2: Short instruction (bold red) ────────
    ws.mergeCells(2, 1, 2, totalCols);
    const instrCell = ws.getCell(2, 1);
    instrCell.value = getInstructionText(sourceType);
    instrCell.font = { ...INSTRUCTION_FONT };
    instrCell.alignment = WRAP_ALIGNMENT;
    ws.getRow(2).height = heights.instruction;

    // ── 4. Row 3: Detailed instruction ────────────────
    ws.mergeCells(3, 1, 3, totalCols);
    const detailCell = ws.getCell(3, 1);
    detailCell.value = getDetailedInstructionText(sourceType);
    detailCell.font = { ...DETAIL_FONT };
    detailCell.alignment = WRAP_ALIGNMENT;
    detailCell.fill = INSTRUCTION_FILL;
    ws.getRow(3).height = heights.detail;

    // ── 5. Row 4: Headers ─────────────────────────────
    const headerRow = ws.getRow(HEADER_ROW);
    const allHeaders = [
        ASSET_ID_COLUMN_HEADER,
        ...fixedCols.map(c => c.header),
        ...PERIOD_COLS,
    ];

    allHeaders.forEach((header, idx) => {
        const cell = headerRow.getCell(idx + 1);
        cell.value = header;
        cell.font = { ...HEADER_FONT };
        cell.alignment = HEADER_ALIGNMENT;
        cell.fill = HEADER_FILL;
        cell.border = CELL_BORDER;
    });
    headerRow.height = heights.header;

    // ── 6. Column widths ──────────────────────────────
    // Col 1: __assetId (hidden)
    ws.getColumn(1).width = 0.1;
    ws.getColumn(1).hidden = true;

    // Fixed info columns
    fixedCols.forEach((col, idx) => {
        ws.getColumn(idx + 2).width = col.width;
    });

    // Period columns (with specific widths per month)
    PERIOD_COLS.forEach((period, i) => {
        const colIdx = 1 + fixedCols.length + 1 + i; // 1-based, after hidden + fixed
        ws.getColumn(colIdx).width = PERIOD_COLUMN_WIDTHS[period] || 8.89;
    });

    // ── 7. Data rows ──────────────────────────────────
    const unitMap = new Map(units.map(u => [u.id, u.name]));

    assets.forEach((asset, rowIdx) => {
        const rowNumber = DATA_START_ROW + rowIdx;
        const row = ws.getRow(rowNumber);

        const assetConfig = parseAssetFields(asset.assetFields);
        const isMensal = asset.reportingFrequency?.toLowerCase() === "mensal";

        // Resolve values for each fixed column
        const assetUnitName = resolveUnitName(asset, unitId, unitName, unitMap);
        const reportType = getReportType(assetConfig, sourceType);
        const fuelOrVehicle = getFuelOrVehicle(assetConfig, sourceType);
        const measureUnit = assetConfig.unitMeasure || assetConfig.consumptionUnit || assetConfig.distanceUnit || "";
        const responsible = asset.traceabilityResponsible || assetConfig.responsible || "";

        // Build a values map keyed by column key
        const valuesMap: Record<string, any> = {
            unitName: assetUnitName,
            sourceDescription: asset.description,
            reportType: reportType,
            fuelOrVehicle: fuelOrVehicle,
            unitMeasure: measureUnit,
            frequency: isMensal ? "Mensal" : "Anual",
            responsible: responsible,
        };

        // Col 1: __assetId (hidden)
        const assetIdCell = row.getCell(1);
        setCellLocked(assetIdCell, asset.id, INFO_CELL_FILL, { size: 8, color: { argb: 'FF999999' }, name: DEFAULT_FONT_NAME });

        // Fixed columns (col 2..N+1)
        fixedCols.forEach((colDef, idx) => {
            const cell = row.getCell(idx + 2);
            setCellLocked(cell, valuesMap[colDef.key] || "");
        });

        // Period columns (months + Anual)
        const periodStartCol = 1 + fixedCols.length + 1; // 1-based
        const primaryField = moduleFields[0]?.name || 'consumption';

        MONTHS_LIST.forEach((month, i) => {
            const cell = row.getCell(periodStartCol + i);
            const isEditable = isMensal;

            cell.fill = isEditable ? EDITABLE_FILL : LOCKED_FILL;
            cell.border = CELL_BORDER;
            cell.alignment = CENTER_ALIGNMENT;
            cell.font = { ...DATA_FONT };
            // Só definir proteção nas células EDITÁVEIS (locked: false).
            // Células sem protection explícita herdam locked=true do Excel por padrão.
            if (isEditable) {
                cell.protection = { locked: false };
                const existing = findReport(reports, asset, month, currentYear);
                if (existing && existing[primaryField] != null) {
                    cell.value = existing[primaryField];
                }
            }
        });

        // Anual column
        const annualCell = row.getCell(periodStartCol + 12);
        const isAnnualEditable = !isMensal;
        annualCell.fill = isAnnualEditable ? EDITABLE_FILL : LOCKED_FILL;
        annualCell.border = CELL_BORDER;
        annualCell.alignment = CENTER_ALIGNMENT;
        annualCell.font = { ...DATA_FONT };
        if (isAnnualEditable) {
            annualCell.protection = { locked: false };
            const existing = findReport(reports, asset, "Anual", currentYear);
            if (existing && existing[primaryField] != null) {
                annualCell.value = existing[primaryField];
            }
        }
    });

    // ── 8. Protect worksheet ──────────────────────────
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

    // ── 9. Metadata sheet (hidden) ────────────────────
    const metaSheet = workbook.addWorksheet(METADATA_SHEET_NAME);
    metaSheet.state = "hidden";

    metaSheet.getCell("A1").value = `version=${TEMPLATE_VERSION}`;
    metaSheet.getCell("A2").value = `sourceType=${sourceType}`;
    metaSheet.getCell("A3").value = `year=${currentYear}`;
    metaSheet.getCell("A4").value = `generatedAt=${new Date().toISOString()}`;
    if (unitId) {
        metaSheet.getCell("A5").value = `unitId=${unitId}`;
    }

    // ── 10. Generate and download ─────────────────────
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
    cell.fill = fill || INFO_CELL_FILL;
    cell.border = CELL_BORDER;
    cell.font = font || { ...DATA_FONT };
    // Não definir cell.protection aqui: células sem protection explícita
    // ficam com locked=true pelo comportamento padrão do Excel quando a
    // planilha está protegida. Definir { locked: true } explicitamente causa
    // applyProtection="1" sem elemento <protection> filho, o que pode ser
    // ignorado por certas versões do Excel/LibreOffice.
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
 * Determina o "Combustível / Veículo utilizado" ou "Gás reposto" baseado no assetFields.
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
        (r.sourceDescription ?? r.emissionSource) === asset.description
    );
}

// ── Instruction texts ───────────────────────────────

function getInstructionText(sourceType: string): string {
    const moduleInstructions: Record<string, string> = {
        'mobile_combustion': "Caso o controle do combustível seja feito em uma unidade diferente da solicitada (ex. lenha é controlada em m³ em vez de toneladas), verificar documento de conversão de unidades.",
        'stationary_combustion': "Caso o controle do combustível seja feito em uma unidade diferente da solicitada (ex. lenha é controlada em m³ em vez de toneladas), verificar documento de conversão de unidades.",
        'fugitive_emissions': "Caso o controle do combustível seja feito em uma unidade diferente da solicitada (ex. lenha é controlada em m³ em vez de toneladas), verificar documento de conversão de unidades.",
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

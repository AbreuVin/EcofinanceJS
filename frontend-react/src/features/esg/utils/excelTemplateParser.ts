/**
 * Parser para templates Excel ESG gerados pelo excelTemplateGenerator.
 *
 * Layout de colunas **variável por escopo** — cada módulo pode ter
 * um número diferente de colunas fixas antes dos períodos.
 * A detecção é dinâmica via nomes de cabeçalho (row 4).
 *
 * Estrutura geral:
 *   Col 1: __assetId (oculta — usada para identificação)
 *   Col 2..N: Colunas fixas do escopo (varia por módulo)
 *   Col N+1..N+12: Janeiro a Dezembro
 *   Col N+13: Anual
 *
 * O parser busca __assetId e os meses/Anual pelo nome no cabeçalho,
 * tornando-o compatível com qualquer layout de colunas fixas.
 */

import ExcelJS from "exceljs";
import { getModuleFields, getAssetInjectedFields } from "@/features/data-entry/config/module-fields";
import {
    TEMPLATE_VERSION,
    METADATA_SHEET_NAME,
    ASSET_ID_COLUMN_HEADER,
    HEADER_ROW,
    DATA_START_ROW,
    MONTHS_LIST,
} from "./excelConstants";

// ── Types ───────────────────────────────────────────

interface Asset {
    id: number;
    description: string;
    sourceType: string;
    reportingFrequency: string;
    assetFields: string | Record<string, any>;
    unitId?: number;
    units?: { unitId: number }[];
}

export interface ParsedPayload {
    unitId: number;
    sourceDescription: string;
    year: number;
    period: string;
    [key: string]: any;
}

export interface ParseResult {
    payloads: ParsedPayload[];
    warnings: string[];
    errors: string[];
}

// ── Main function ───────────────────────────────────

export async function parseEsgExcelTemplate(
    file: File | ArrayBuffer,
    assets: Asset[],
    sourceType: string,
    currentYear: number,
    unitId?: number,
): Promise<ParseResult> {
    const warnings: string[] = [];
    const errors: string[] = [];
    const payloads: ParsedPayload[] = [];

    // ── 1. Load workbook ──────────────────────────────
    const workbook = new ExcelJS.Workbook();
    const buffer = file instanceof File ? await file.arrayBuffer() : file;
    await workbook.xlsx.load(buffer);

    // ── 2. Validate metadata ──────────────────────────
    const metaSheet = workbook.getWorksheet(METADATA_SHEET_NAME);
    if (!metaSheet) {
        errors.push("Arquivo não é um template válido do Ecofinance (aba __metadata ausente).");
        return { payloads, warnings, errors };
    }

    const metadata = parseMetadata(metaSheet);

    if (metadata.version && metadata.version !== TEMPLATE_VERSION) {
        warnings.push(
            `Template versão ${metadata.version}, esperada ${TEMPLATE_VERSION}. Baixe o template atualizado se encontrar problemas.`
        );
    }

    if (metadata.sourceType && metadata.sourceType !== sourceType) {
        errors.push(
            `Template é do módulo "${metadata.sourceType}", mas você está no módulo "${sourceType}". Use o template correto.`
        );
        return { payloads, warnings, errors };
    }

    const templateYear = metadata.year ? parseInt(metadata.year) : currentYear;

    // ── 3. Read data sheet ────────────────────────────
    const dataSheet = workbook.worksheets[0]; // First visible sheet
    if (!dataSheet) {
        errors.push("Planilha de dados não encontrada.");
        return { payloads, warnings, errors };
    }

    // ── 4. Detect column positions from header row ────
    const headerRow = dataSheet.getRow(HEADER_ROW);
    const colMap: Record<string, number> = {};
    headerRow.eachCell((cell, colNumber) => {
        const val = String(cell.value || "").trim();
        if (val) colMap[val] = colNumber;
    });

    // Find assetId column (may be hidden)
    const assetIdCol = colMap[ASSET_ID_COLUMN_HEADER];
    if (!assetIdCol) {
        errors.push("Coluna __assetId não encontrada. Este template pode ter sido modificado manualmente.");
        return { payloads, warnings, errors };
    }

    // Build asset lookup map
    const assetMap = new Map(assets.map(a => [a.id, a]));
    const moduleFields = getModuleFields(sourceType);
    const primaryField = moduleFields[0]?.name || 'consumption';

    // ── 5. Build period-to-column mapping ─────────────
    const periodColumns: { period: string; colNumber: number }[] = [];

    MONTHS_LIST.forEach(month => {
        const col = colMap[month];
        if (col) periodColumns.push({ period: month, colNumber: col });
    });
    const annualCol = colMap["Anual"];
    if (annualCol) periodColumns.push({ period: "Anual", colNumber: annualCol });

    if (periodColumns.length === 0) {
        errors.push("Nenhuma coluna de período encontrada. Verifique se o template não foi modificado.");
        return { payloads, warnings, errors };
    }

    // ── 6. Iterate data rows ──────────────────────────
    const totalRows = dataSheet.rowCount;

    for (let rowNum = DATA_START_ROW; rowNum <= totalRows; rowNum++) {
        const row = dataSheet.getRow(rowNum);

        // Read assetId
        const rawAssetId = row.getCell(assetIdCol).value;
        if (rawAssetId === null || rawAssetId === undefined || rawAssetId === "") continue;

        const assetId = Number(rawAssetId);
        if (isNaN(assetId)) {
            warnings.push(`Linha ${rowNum}: assetId inválido "${rawAssetId}", ignorada.`);
            continue;
        }

        const asset = assetMap.get(assetId);
        if (!asset) {
            warnings.push(`Linha ${rowNum}: asset #${assetId} não encontrado nos assets carregados, ignorada.`);
            continue;
        }

        const isMensal = asset.reportingFrequency?.toLowerCase() === "mensal";
        const assetConfig = parseAssetFields(asset.assetFields);
        const injectedFields = getAssetInjectedFields(sourceType, assetConfig);

        // Resolve unitId: explicit param > asset.unitId > first unit from units array
        const resolvedUnitId = unitId || asset.unitId || asset.units?.[0]?.unitId;
        if (!resolvedUnitId) {
            warnings.push(`Linha ${rowNum}: asset #${assetId} não tem unidade associada, ignorada.`);
            continue;
        }

        // Extract values from period columns
        periodColumns.forEach(({ period, colNumber }) => {
            // Skip periods that don't match the asset's frequency
            if (isMensal && period === "Anual") return;
            if (!isMensal && period !== "Anual") return;

            const rawValue = row.getCell(colNumber).value;
            if (rawValue === null || rawValue === undefined || rawValue === "") return;

            const numValue = Number(rawValue);
            if (isNaN(numValue)) {
                warnings.push(`Linha ${rowNum}, período "${period}": valor "${rawValue}" não é numérico.`);
                return;
            }

            const payload: ParsedPayload = {
                unitId: resolvedUnitId,
                sourceDescription: asset.description,
                year: templateYear,
                period,
                ...injectedFields,
                [primaryField]: numValue,
            };
            payloads.push(payload);
        });
    }

    if (payloads.length === 0 && errors.length === 0) {
        warnings.push("Nenhum dado válido encontrado na planilha.");
    }

    return { payloads, warnings, errors };
}

// ── Helpers ─────────────────────────────────────────

function parseMetadata(sheet: ExcelJS.Worksheet): Record<string, string> {
    const meta: Record<string, string> = {};
    sheet.eachRow((row) => {
        const val = String(row.getCell(1).value || "");
        const idx = val.indexOf("=");
        if (idx > 0) {
            meta[val.substring(0, idx)] = val.substring(idx + 1);
        }
    });
    return meta;
}

function parseAssetFields(assetFields: string | Record<string, any>): Record<string, any> {
    if (typeof assetFields === "string") {
        try { return JSON.parse(assetFields || "{}"); } catch { return {}; }
    }
    return assetFields || {};
}

/**
 * Constantes para geração e leitura de templates Excel ESG.
 */

import type { Fill, Font, Alignment, Border } from 'exceljs';

// ── Meses ────────────────────────────────────────────
export const MONTHS_LIST = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

export const PERIODS_ALL = [...MONTHS_LIST, "Anual"];

// ── Metadata da planilha ────────────────────────────
export const TEMPLATE_VERSION = "2.0";
export const METADATA_SHEET_NAME = "__metadata";
export const DATA_SHEET_NAME = "Dados de Entrada";
export const ASSET_ID_COLUMN_HEADER = "__assetId";

// ── Layout da planilha ──────────────────────────────
/** Linha onde ficam os cabeçalhos das colunas */
export const HEADER_ROW = 4;
/** Primeira linha de dados (logo após os cabeçalhos) */
export const DATA_START_ROW = 5;
/** Número de linhas de instrução (linhas 2-3) */
export const INSTRUCTION_ROWS = 2;

// ── Colunas fixas (antes dos períodos) ──────────────
export const FIXED_COLUMNS = [
    { key: 'assetId', header: ASSET_ID_COLUMN_HEADER, width: 0.1 },  // Oculta
    { key: 'sourceDescription', header: 'Fonte Emissora', width: 22 },
    { key: 'frequency', header: 'Frequência', width: 14 },
];

// ── Estilos ─────────────────────────────────────────

export const TITLE_FONT: Partial<Font> = {
    bold: true,
    size: 16,
    color: { argb: 'FF1A5632' }, // Verde escuro
};

export const HEADER_FONT: Partial<Font> = {
    bold: true,
    size: 11,
    color: { argb: 'FFFFFFFF' },
};

export const HEADER_FILL: Fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF1A5632' }, // Verde escuro
};

export const INSTRUCTION_FILL: Fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE8F0FE' }, // Azul claro
};

export const LOCKED_FILL: Fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFD9D9D9' }, // Cinza
};

export const EDITABLE_FILL: Fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFFFFFFF' }, // Branco
};

export const INFO_CELL_FILL: Fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFF5F5F5' }, // Cinza bem claro
};

export const WRAP_ALIGNMENT: Partial<Alignment> = {
    wrapText: true,
    vertical: 'middle',
};

export const CENTER_ALIGNMENT: Partial<Alignment> = {
    horizontal: 'center',
    vertical: 'middle',
};

export const THIN_BORDER: Partial<Border> = {
    style: 'thin',
    color: { argb: 'FFD0D0D0' },
};

export const CELL_BORDER = {
    top: THIN_BORDER,
    left: THIN_BORDER,
    bottom: THIN_BORDER,
    right: THIN_BORDER,
};

// ── Senha de proteção ───────────────────────────────
/** 
 * Senha para proteção do worksheet.
 * Apenas proteção visual contra edição acidental, não é segurança real.
 */
export const PROTECTION_PASSWORD = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_EXCEL_PROTECTION_KEY) || 'ecofinance_template_2026';

// ── Mapa de nomes amigáveis para módulos ────────────
export const MODULE_FRIENDLY_NAMES: Record<string, string> = {
    'mobile_combustion': 'Combustão Móvel',
    'stationary_combustion': 'Combustão Estacionária',
    'electricity_purchase': 'Compra de Eletricidade',
    'energy_generation': 'Geração de Energia',
    'upstream_transport': 'Transporte Upstream',
    'business_travel_land': 'Viagem a Negócios (Terrestre)',
    'downstream_transport': 'Transporte Downstream',
    'waste_transport': 'Transporte de Resíduos',
    'air_travel': 'Viagens Aéreas',
    'employee_commuting': 'Deslocamento de Funcionários',
    'purchased_goods': 'Bens e Serviços Comprados',
    'capital_goods': 'Bens de Capital',
    'production_sales': 'Produção e Vendas',
    'ippu_lubricants': 'IPPU Lubrificantes',
    'fugitive_emissions': 'Emissões Fugitivas',
    'fertilizers': 'Fertilizantes',
    'effluents_controlled': 'Efluentes Controlados',
    'domestic_effluents': 'Efluentes Domésticos',
    'land_use_change': 'Mudança de Uso do Solo',
    'planted_forest': 'Floresta Plantada',
    'conservation_area': 'Área de Conservação',
    'home_office': 'Home Office',
    'solid_waste': 'Resíduos Sólidos',
};

export function getModuleFriendlyName(sourceType: string): string {
    return MODULE_FRIENDLY_NAMES[sourceType] || sourceType;
}

/**
 * Constantes para geração e leitura de templates Excel ESG.
 *
 * Layout por escopo: cada módulo define suas colunas fixas (antes dos períodos).
 * O gerador utiliza `getScopeColumnLayout()` para obter a configuração correta.
 *
 * Convenção de cores: ARGB fixo (não theme) para consistência entre arquivos.
 * Valores extraídos dos templates de referência do cliente.
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

// ── Coluna fixa (definição por escopo) ──────────────

/** Definição de uma coluna fixa no template */
export interface ScopeColumnDef {
    /** Chave interna para mapear o valor */
    key: string;
    /** Texto exibido no cabeçalho */
    header: string;
    /** Largura da coluna em unidades Excel */
    width: number;
}

/** Layout completo de um escopo */
export interface ScopeLayout {
    /** Colunas fixas (informativas, antes dos períodos). NÃO inclui __assetId. */
    fixedColumns: ScopeColumnDef[];
    /** Alturas de linhas especiais */
    rowHeights: {
        title: number;      // Row 1
        instruction: number; // Row 2
        detail: number;      // Row 3
        header: number;      // Row 4
    };
}

/**
 * Larguras de colunas de período (meses + anual),
 * baseadas nos templates de referência do cliente.
 * Chave = nome do período, valor = largura.
 */
export const PERIOD_COLUMN_WIDTHS: Record<string, number> = {
    'Janeiro':   10.78,
    'Fevereiro':  8.89,
    'Março':      8.89,
    'Abril':      8.89,
    'Maio':       8.89,
    'Junho':      8.89,
    'Julho':      8.89,
    'Agosto':     8.89,
    'Setembro':   9.78,
    'Outubro':    8.89,
    'Novembro':  10.22,
    'Dezembro':   9.89,
    'Anual':      8.89,
};

// ── Layouts por escopo ──────────────────────────────

const LAYOUT_STATIONARY_COMBUSTION: ScopeLayout = {
    fixedColumns: [
        { key: 'unitName',          header: 'Unidade Empresarial',       width: 30.44 },
        { key: 'sourceDescription', header: 'Fonte de Emissão',          width: 18.11 },
        { key: 'fuelOrVehicle',     header: 'Combustível',               width: 18.55 },
        { key: 'unitMeasure',       header: 'Unidade de medida',         width: 19.11 },
        { key: 'frequency',         header: 'Mensal ou anual?',          width: 14.55 },
        { key: 'responsible',       header: 'Responsável pelo reporte',  width: 14.55 },
    ],
    rowHeights: { title: 21, instruction: 15.75, detail: 76.5, header: 32.25 },
};

const LAYOUT_MOBILE_COMBUSTION: ScopeLayout = {
    fixedColumns: [
        { key: 'unitName',          header: 'Unidade Empresarial',            width: 30.44 },
        { key: 'sourceDescription', header: 'Fonte de Emissão',               width: 18.11 },
        { key: 'reportType',        header: 'Tipo de Reporte',                width: 18.11 },
        { key: 'fuelOrVehicle',     header: 'Combustível / Veículo utilizado', width: 18.55 },
        { key: 'unitMeasure',       header: 'Unidade de medida',              width: 19.11 },
        { key: 'frequency',         header: 'Mensal ou anual?',               width: 14.55 },
        { key: 'responsible',       header: 'Responsável pelo reporte',       width: 14.55 },
    ],
    rowHeights: { title: 21, instruction: 15.75, detail: 33.75, header: 32.25 },
};

const LAYOUT_FUGITIVE_EMISSIONS: ScopeLayout = {
    fixedColumns: [
        { key: 'unitName',          header: 'Unidade Empresarial',       width: 30.44 },
        { key: 'sourceDescription', header: 'Fonte de Emissão',          width: 18.11 },
        { key: 'fuelOrVehicle',     header: 'Gás reposto',              width: 18.55 },
        { key: 'unitMeasure',       header: 'Unidade de medida',         width: 19.11 },
        { key: 'frequency',         header: 'Mensal ou anual?',          width: 14.55 },
        { key: 'responsible',       header: 'Responsável pelo reporte',  width: 14.55 },
    ],
    rowHeights: { title: 25.5, instruction: 25.5, detail: 16.5, header: 36.75 },
};

/**
 * Layout padrão para módulos ainda não mapeados.
 * Usa o layout mais completo (Combustão Móvel) como base.
 */
const LAYOUT_DEFAULT: ScopeLayout = {
    fixedColumns: [
        { key: 'unitName',          header: 'Unidade Empresarial',            width: 30.44 },
        { key: 'sourceDescription', header: 'Fonte de Emissão',               width: 18.11 },
        { key: 'reportType',        header: 'Tipo de Reporte',                width: 18.11 },
        { key: 'fuelOrVehicle',     header: 'Combustível / Veículo utilizado', width: 18.55 },
        { key: 'unitMeasure',       header: 'Unidade de medida',              width: 19.11 },
        { key: 'frequency',         header: 'Mensal ou anual?',               width: 14.55 },
        { key: 'responsible',       header: 'Responsável pelo reporte',       width: 14.55 },
    ],
    rowHeights: { title: 21, instruction: 15.75, detail: 33.75, header: 32.25 },
};

/** Registro de layouts por módulo */
const SCOPE_LAYOUTS: Record<string, ScopeLayout> = {
    'stationary_combustion': LAYOUT_STATIONARY_COMBUSTION,
    'mobile_combustion':     LAYOUT_MOBILE_COMBUSTION,
    'fugitive_emissions':    LAYOUT_FUGITIVE_EMISSIONS,
};

/** Retorna a configuração de layout para um dado sourceType */
export function getScopeColumnLayout(sourceType: string): ScopeLayout {
    return SCOPE_LAYOUTS[sourceType] || LAYOUT_DEFAULT;
}

// ── Estilos (cores ARGB extraídas dos templates do cliente) ──

/** Fonte padrão para todas as células */
export const DEFAULT_FONT_NAME = 'Arial';

export const TITLE_FONT: Partial<Font> = {
    bold: true,
    size: 16,
    color: { argb: 'FF000000' }, // Preto (cliente usa theme:1 = preto)
    name: DEFAULT_FONT_NAME,
    family: 2,
};

export const HEADER_FONT: Partial<Font> = {
    bold: true,
    size: 12,
    color: { argb: 'FFFFFFFF' }, // Branco
    name: DEFAULT_FONT_NAME,
    family: 2,
};

export const INSTRUCTION_FONT: Partial<Font> = {
    bold: true,
    size: 12,
    color: { argb: 'FFFF0000' }, // Vermelho (conforme template com comentários)
    name: DEFAULT_FONT_NAME,
    family: 2,
};

export const DETAIL_FONT: Partial<Font> = {
    size: 12,
    color: { argb: 'FF000000' }, // Preto
    name: DEFAULT_FONT_NAME,
    family: 2,
};

export const DATA_FONT: Partial<Font> = {
    size: 12,
    color: { argb: 'FF000000' }, // Preto (cliente usa theme:1)
    name: DEFAULT_FONT_NAME,
    family: 2,
};

/**
 * Fill do cabeçalho (row 4).
 * Cliente: theme:6 tint:-0.5 ≈ verde escuro.
 * ARGB equivalente: #4F6228
 */
export const HEADER_FILL: Fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF4F6228' },
};

/**
 * Fill da linha de instrução (row 2-3).
 * No template limpo do cliente não há fill especial — mantemos sutil.
 */
export const INSTRUCTION_FILL: Fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFFFFFFF' }, // Branco (sem cor de fundo na instrução)
};

/**
 * Fill das células de dados bloqueadas (info).
 * Cliente: theme:0 tint:-0.25 ≈ cinza ~25%.
 * ARGB equivalente: #BFBFBF
 */
export const LOCKED_FILL: Fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFBFBFBF' },
};

/** Fill das células editáveis (branco) */
export const EDITABLE_FILL: Fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFFFFFFF' },
};

/**
 * Fill das colunas fixas de informação (dados pré-preenchidos).
 * Mesmo cinza ~25% do template do cliente.
 */
export const INFO_CELL_FILL: Fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFBFBFBF' },
};

// ── Alinhamentos ────────────────────────────────────

export const WRAP_ALIGNMENT: Partial<Alignment> = {
    wrapText: true,
    vertical: 'middle',
};

export const CENTER_ALIGNMENT: Partial<Alignment> = {
    horizontal: 'center',
    vertical: 'middle',
};

export const HEADER_ALIGNMENT: Partial<Alignment> = {
    horizontal: 'center',
    vertical: 'middle',
    wrapText: true,
};

// ── Bordas ──────────────────────────────────────────

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

// ── Colunas fixas legadas (mantidas para compatibilidade com FIXED_COLUMNS) ──
export const FIXED_COLUMNS = [
    { key: 'assetId', header: ASSET_ID_COLUMN_HEADER, width: 0.1 },  // Oculta
    { key: 'sourceDescription', header: 'Fonte Emissora', width: 22 },
    { key: 'frequency', header: 'Frequência', width: 14 },
];

/**
 * Configuração de campos editáveis por módulo ESG.
 *
 * Cada módulo define quais campos o usuário preenche no formulário de reporte.
 * Campos que vêm da configuração do asset (ex: fuelType, vehicleType) NÃO são
 * listados aqui — são injetados automaticamente pelo submit.
 */

import type { EsgModuleType } from "@/types/enums";

export interface ModuleField {
    /** Nome da coluna no banco (ex: "consumption") */
    name: string;
    /** Label exibido no formulário (ex: "Consumo (L)") */
    label: string;
    /** Tipo do campo */
    type: 'number' | 'text';
}

/**
 * Campos que vêm da configuração do asset e devem ser injetados no submit
 * apenas se existirem no assetFields. Chave = campo no banco, valor = chave no assetFields.
 */
export interface AssetInjectedField {
    name: string;
    assetKey: string;
    transform?: (val: any) => any;
}

/**
 * Campos de config do asset injetados no submit, por módulo.
 * Se um módulo não está aqui, nenhum campo extra é injetado.
 */
export const ASSET_INJECTED_FIELDS: Partial<Record<EsgModuleType, AssetInjectedField[]>> = {
    mobile_combustion: [
        { name: 'fuelType', assetKey: 'fuelType' },
        { name: 'vehicleType', assetKey: 'vehicleType' },
        { name: 'isCompanyControlled', assetKey: 'isCompanyControlled', transform: (v: any) => v === 'true' || v === true },
        { name: 'inputType', assetKey: 'inputType' },
        { name: 'consumptionUnit', assetKey: 'consumptionUnit' },
        { name: 'distanceUnit', assetKey: 'distanceUnit' },
    ],
    stationary_combustion: [
        { name: 'fuelType', assetKey: 'fuelType' },
        { name: 'isCompanyControlled', assetKey: 'isCompanyControlled', transform: (v: any) => v === 'true' || v === true },
        { name: 'unitMeasure', assetKey: 'unitMeasure' },
    ],
    fugitive_emissions: [
        { name: 'isCompanyControlled', assetKey: 'isCompanyControlled', transform: (v: any) => v === 'true' || v === true },
        { name: 'gasType', assetKey: 'gasType' },
        { name: 'unitMeasure', assetKey: 'unitMeasure' },
    ],
    lubricants_ippu: [
        { name: 'isCompanyControlled', assetKey: 'isCompanyControlled', transform: (v: any) => v === 'true' || v === true },
        { name: 'lubricantType', assetKey: 'lubricantType' },
        { name: 'unitMeasure', assetKey: 'unitMeasure' },
    ],
    fertilizers: [
        { name: 'isCompanyControlled', assetKey: 'isCompanyControlled', transform: (v: any) => v === 'true' || v === true },
        { name: 'fertilizerType', assetKey: 'fertilizerType' },
        { name: 'unitMeasure', assetKey: 'unitMeasure' },
    ],
};

/**
 * Campos editáveis no formulário de reporte, organizados por módulo.
 *
 * Cada entry define: name (coluna DB), label (UI), type (input type).
 * Se um módulo não estiver aqui, usa o fallback [{ name: 'consumption', label: 'Valor', type: 'number' }].
 */
export const MODULE_FIELDS: Record<string, ModuleField[]> = {
    // ── Escopo 1 ────────────────────────────────────────
    mobile_combustion: [
        { name: 'consumption', label: 'Consumo', type: 'number' },
        { name: 'distance', label: 'Distância (km)', type: 'number' },
    ],
    stationary_combustion: [
        { name: 'consumption', label: 'Consumo', type: 'number' },
    ],
    fugitive_emissions: [
        { name: 'quantityReplaced', label: 'Quantidade Reposta', type: 'number' },
    ],
    lubricants_ippu: [
        { name: 'consumption', label: 'Consumo', type: 'number' },
    ],
    fertilizers: [
        { name: 'quantityKg', label: 'Quantidade (kg)', type: 'number' },
        { name: 'percentNitrogen', label: '% Nitrogênio', type: 'number' },
        { name: 'percentCarbonate', label: '% Carbonato', type: 'number' },
    ],
    effluents_controlled: [
        { name: 'qtyEffluentM3', label: 'Volume Efluente (m³)', type: 'number' },
        { name: 'qtyOrganic', label: 'Carga Orgânica', type: 'number' },
        { name: 'qtyNitrogen', label: 'Carga de Nitrogênio', type: 'number' },
        { name: 'organicRemovedSludge', label: 'Orgânico Removido (lodo)', type: 'number' },
    ],
    domestic_effluents: [
        { name: 'numWorkers', label: 'Nº de Trabalhadores', type: 'number' },
        { name: 'avgWorkHours', label: 'Horas Médias Trabalhadas', type: 'number' },
    ],
    solid_waste: [
        { name: 'quantityGenerated', label: 'Quantidade Gerada', type: 'number' },
    ],
    land_use_change: [
        { name: 'areaHectares', label: 'Área (hectares)', type: 'number' },
    ],
    production_sales: [
        { name: 'quantitySold', label: 'Quantidade Vendida', type: 'number' },
    ],

    // ── Escopo 2 ────────────────────────────────────────
    electricity_purchase: [
        { name: 'consumption', label: 'Consumo', type: 'number' },
    ],
    energy_generation: [
        { name: 'totalGeneration', label: 'Geração Total', type: 'number' },
    ],

    // ── Escopo 3 ────────────────────────────────────────
    upstream_transport: [
        { name: 'consumption', label: 'Consumo de Combustível', type: 'number' },
        { name: 'distance', label: 'Distância (km)', type: 'number' },
        { name: 'transportedLoad', label: 'Carga Transportada', type: 'number' },
        { name: 'tripCount', label: 'Nº de Viagens', type: 'number' },
    ],
    downstream_transport: [
        { name: 'consumption', label: 'Consumo de Combustível', type: 'number' },
        { name: 'distance', label: 'Distância (km)', type: 'number' },
        { name: 'transportedLoad', label: 'Carga Transportada', type: 'number' },
        { name: 'tripCount', label: 'Nº de Viagens', type: 'number' },
    ],
    waste_transport: [
        { name: 'consumption', label: 'Consumo de Combustível', type: 'number' },
        { name: 'distance', label: 'Distância (km)', type: 'number' },
        { name: 'transportedLoad', label: 'Carga Transportada', type: 'number' },
        { name: 'tripCount', label: 'Nº de Viagens', type: 'number' },
    ],
    business_travel_land: [
        { name: 'consumption', label: 'Consumo de Combustível', type: 'number' },
        { name: 'distance', label: 'Distância (km)', type: 'number' },
    ],
    air_travel: [
        { name: 'tripCount', label: 'Nº de Viagens', type: 'number' },
    ],
    employee_commuting: [
        { name: 'consumption', label: 'Consumo de Combustível', type: 'number' },
        { name: 'distanceKm', label: 'Distância (km)', type: 'number' },
        { name: 'daysCommuted', label: 'Dias Deslocados', type: 'number' },
    ],
    purchased_goods: [
        { name: 'quantity', label: 'Quantidade', type: 'number' },
        { name: 'acquisitionValue', label: 'Valor de Aquisição (R$)', type: 'number' },
    ],
    capital_goods: [
        { name: 'quantity', label: 'Quantidade', type: 'number' },
        { name: 'acquisitionValue', label: 'Valor de Aquisição (R$)', type: 'number' },
    ],
    home_office: [
        { name: 'numEmployees', label: 'Nº de Funcionários', type: 'number' },
    ],

    // ── Remoções / Sequestro ────────────────────────────
    planted_forest: [
        { name: 'currentArea', label: 'Área Atual (ha)', type: 'number' },
        { name: 'areaPrePreLast', label: 'Área Pré-Anterior (ha)', type: 'number' },
        { name: 'areaHarvestedPreLast', label: 'Área Colhida Anterior (ha)', type: 'number' },
    ],
    conservation_area: [
        { name: 'areaStartYear', label: 'Área Início Ano (ha)', type: 'number' },
        { name: 'areaEndYear', label: 'Área Fim Ano (ha)', type: 'number' },
    ],
};

/** Fallback para módulos não mapeados */
export const DEFAULT_FIELDS: ModuleField[] = [
    { name: 'consumption', label: 'Valor', type: 'number' },
];

/** Retorna os campos editáveis para um módulo */
export function getModuleFields(moduleType: string): ModuleField[] {
    return MODULE_FIELDS[moduleType] || DEFAULT_FIELDS;
}

/** Retorna os campos do asset que devem ser injetados no submit */
export function getAssetInjectedFields(moduleType: string, assetConfig: Record<string, any>): Record<string, any> {
    const injected: Record<string, any> = {};
    const fields = ASSET_INJECTED_FIELDS[moduleType as EsgModuleType];

    if (fields) {
        fields.forEach(({ name, assetKey, transform }) => {
            const rawValue = assetConfig[assetKey];

            if (transform) {
                // Always inject transformed fields (handles defaults for required booleans)
                injected[name] = transform(rawValue);
            } else if (rawValue !== undefined && rawValue !== null) {
                injected[name] = rawValue;
            }
        });
    }

    return injected;
}

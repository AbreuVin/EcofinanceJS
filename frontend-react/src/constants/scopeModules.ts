import { ESG_MODULES } from "@/types/enums";

export const SCOPE_MODULES: Record<string, string[]> = {
    escopo_1: [
        'production_sales',
        'stationary_combustion',
        'mobile_combustion',
        'lubricants_ippu',
        'fugitive_emissions',
        'fertilizers',
        'effluents_controlled',
        'domestic_effluents',
        'land_use_change',
        'solid_waste',
    ],
    escopo_2: [
        'electricity_purchase',
    ],
    escopo_3: [
        'purchased_goods',
        'capital_goods',
        'upstream_transport',
        'business_travel_land',
        'downstream_transport',
        'waste_transport',
        'home_office',
        'air_travel',
        'employee_commuting',
        'energy_generation',
        'planted_forest',
        'conservation_area',
    ],
};

export const SCOPE_LABELS: Record<string, string> = {
    escopo_1: "Escopo 1",
    escopo_2: "Escopo 2",
    escopo_3: "Escopo 3",
};

export function getScopeModules(scopeKey: string) {
    const moduleValues = SCOPE_MODULES[scopeKey] || [];
    return ESG_MODULES
        .filter(mod => moduleValues.includes(mod.value))
        .sort((a, b) => a.label.localeCompare(b.label));
}

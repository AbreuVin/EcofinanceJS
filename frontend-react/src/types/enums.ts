export type UserRole = 'MASTER' | 'ADMIN' | 'USER';
export type ReportingFrequency = 'anual' | 'mensal';

export const ESG_MODULES = [
    // Scope 1 & 2 (Energy & Combustion)
    { label: 'Combustão Móvel', value: 'mobile_combustion' },
    { label: 'Combustão Estacionária', value: 'stationary_combustion' },
    { label: 'Compra de Eletricidade', value: 'electricity_purchase' },
    { label: 'Geração de Energia', value: 'energy_generation' },
    { label: 'Emissões Fugitivas', value: 'fugitive_emissions' },
    { label: 'Lubrificantes e IPPU', value: 'lubricants_ippu' },
    { label: 'Uso de Fertilizantes', value: 'fertilizers' },

    // Scope 3 (Logistics)
    { label: 'Transporte Upstream', value: 'upstream_transport' },
    { label: 'Transporte Downstream', value: 'downstream_transport' },
    { label: 'Transporte de Resíduos', value: 'waste_transport' },
    { label: 'Viagens a Negócios (Terrestre)', value: 'business_travel_land' },
    { label: 'Viagens Aéreas', value: 'air_travel' },
    { label: 'Deslocamento de Funcionários', value: 'employee_commuting' },

    // Scope 3 (Supply Chain & Goods)
    { label: 'Produção e Vendas', value: 'production_sales' },
    { label: 'Bens e Serviços Comprados', value: 'purchased_goods' },
    { label: 'Bens de Capital', value: 'capital_goods' },

    // Waste & Water
    { label: 'Resíduos Sólidos', value: 'solid_waste' },
    { label: 'Efluentes Controlados', value: 'effluents_controlled' },
    { label: 'Efluentes Domésticos', value: 'domestic_effluents' },

    // Land Use & Forestry
    { label: 'Mudança no Uso da Terra', value: 'land_use_change' },
    { label: 'Florestas Plantadas', value: 'planted_forest' },
    { label: 'Áreas de Conservação', value: 'conservation_area' },

    // Others
    { label: 'Home Office', value: 'home_office' },
];
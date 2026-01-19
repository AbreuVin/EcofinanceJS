export const ESG_MODULES = [
    { label: 'Combustão Móvel', value: 'mobile_combustion' },
    { label: 'Combustão Estacionária', value: 'stationary_combustion' },
    { label: 'Compra de Eletricidade', value: 'electricity_purchase' },
    { label: 'Geração de Energia', value: 'energy_generation' },
    { label: 'Emissões Fugitivas', value: 'fugitive_emissions' },
    { label: 'IPPU - Lubrificantes', value: 'lubricants_ippu' }, // Renamed
    { label: 'Fertilizantes', value: 'fertilizers' }, // Renamed

    { label: 'Logística de Insumo', value: 'upstream_transport' }, // Renamed
    { label: 'Logística de Produto Final', value: 'downstream_transport' }, // Renamed
    { label: 'Logística de Resíduos', value: 'waste_transport' }, // Renamed
    { label: 'Viagens a Negócios Terrestres', value: 'business_travel_land' },
    { label: 'Viagens Aéreas', value: 'air_travel' },
    { label: 'Transporte de Funcionários', value: 'employee_commuting' }, // Renamed

    { label: 'Dados de Produção e Venda', value: 'production_sales' }, // Renamed
    { label: 'Bens e Serviços Comprados', value: 'purchased_goods' },
    { label: 'Bens de Capital', value: 'capital_goods' },

    { label: 'Resíduos Sólidos', value: 'solid_waste' },
    { label: 'Efluentes Controlados', value: 'effluents_controlled' },
    { label: 'Efluentes Domésticos', value: 'domestic_effluents' },

    { label: 'Mudança do Uso do Solo', value: 'land_use_change' }, // Renamed
    { label: 'Área de Floresta Plantada', value: 'planted_forest' }, // Renamed
    { label: 'Área de Conservação', value: 'conservation_area' },

    { label: 'Home Office', value: 'home_office' },
] as const;

export type EsgModuleType = typeof ESG_MODULES[number]['value'];
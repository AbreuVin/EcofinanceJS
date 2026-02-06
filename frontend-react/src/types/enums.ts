export const UserRole = {
  MASTER: 'MASTER',
  ADMIN: 'ADMIN',
  USER: 'USER'
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export const ESG_MODULES = [
    { label: 'Combustão Móvel', value: 'mobile_combustion', description: '' },
    { label: 'Combustão Estacionária', value: 'stationary_combustion', description: '' },
    { label: 'Compra de Eletricidade', value: 'electricity_purchase', description: '' },
    { label: 'Geração de Energia', value: 'energy_generation', description: '' },
    { label: 'Emissões Fugitivas', value: 'fugitive_emissions', description: '' },
    { label: 'IPPU - Lubrificantes', value: 'lubricants_ippu', description: '' }, // Renamed
    { label: 'Fertilizantes', value: 'fertilizers', description: '' }, // Renamed

    { label: 'Logística de Insumo', value: 'upstream_transport', description: '' }, // Renamed
    { label: 'Logística de Produto Final', value: 'downstream_transport', description: '' }, // Renamed
    { label: 'Logística de Resíduos', value: 'waste_transport', description: '' }, // Renamed
    { label: 'Viagens a Negócios Terrestres', value: 'business_travel_land', description: '' },
    { label: 'Viagens Aéreas', value: 'air_travel', description: '' },
    { label: 'Transporte de Funcionários', value: 'employee_commuting', description: '' }, // Renamed

    { label: 'Dados de Produção e Venda', value: 'production_sales', description: '' }, // Renamed
    { label: 'Bens e Serviços Comprados', value: 'purchased_goods', description: '' },
    { label: 'Bens de Capital', value: 'capital_goods', description: '' },

    { label: 'Resíduos Sólidos', value: 'solid_waste', description: '' },
    { label: 'Efluentes Controlados', value: 'effluents_controlled', description: '' },
    { label: 'Efluentes Domésticos', value: 'domestic_effluents', description: '' },

    { label: 'Mudança do Uso do Solo', value: 'land_use_change', description: '' }, // Renamed
    { label: 'Área de Floresta Plantada', value: 'planted_forest', description: '' }, // Renamed
    { label: 'Área de Conservação', value: 'conservation_area', description: '' },

    { label: 'Home Office', value: 'home_office', description: '' },
] as const;

export type EsgModuleType = typeof ESG_MODULES[number]['value'];

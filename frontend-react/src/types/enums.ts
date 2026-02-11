export const UserRole = {
  MASTER: 'MASTER',
  ADMIN: 'ADMIN',
  USER: 'USER'
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export const ESG_MODULES = [
    { 
        label: 'Combustão Móvel', 
        value: 'mobile_combustion', 
        description: '', 
        assetDesc: `Preencher nessa planilha as informações de consumo de combustível em fontes móveis controladas pela empresa ou por terceiros (com exceção do transporte de insumos e logística de produto final que possuem abas específicas).
Informar também os dados sobre o consumo de combustível do avião de pequano porte da empresa, se pertinente.` 
    },
    { 
        label: 'Combustão Estacionária', 
        value: 'stationary_combustion', 
        description: '', 
        assetDesc: `Preencher nessa planilha as informações de consumo de combustível em fontes fixas controladas pela empresa ou por terceiros. Se a fonte por controlada por terceiros (escopo 3) informar na coluna J.
Atenção para a unidade de medida de cada combustível. Caso o controle do combustível se dê em outra unidade de medida, por favor, especifique na coluna ao lado.` 
    },
    { 
        label: 'Compra de Eletricidade', 
        value: 'electricity_purchase', 
        description: '', 
        assetDesc: `A informação de consumo de energia pode ser fornecida mensalmente ou anualmente. De preferência, mensalmente.` 
    },
    { 
        label: 'Geração de Energia', 
        value: 'energy_generation', 
        description: '', 
        assetDesc: `Orientação: Fornecer informações de geração de energia dos empreendimentos.` 
    },
    { 
        label: 'Emissões Fugitivas', 
        value: 'fugitive_emissions', 
        description: '', 
        assetDesc: `A informação de resposição de gases em ar-condicionado, sistemas de refrigeração e extintores podem ser conseguidas com os prestadores de serviço resposáveis por essas atividades.` 
    },
    { 
        label: 'IPPU - Lubrificantes', 
        value: 'lubricants_ippu', 
        description: '', 
        assetDesc: `Preencher nessa planilha as informações de uso de lubrificantes.` 
    }, 
    { 
        label: 'Fertilizantes', 
        value: 'fertilizers', 
        description: '', 
        assetDesc: `Orientação: Fornecer os dados de consumo de Fertilizantes nitrogenados e calcário utilizado em atividades de plantio.` 
    }, 

    { 
        label: 'Logística de Insumo', 
        value: 'upstream_transport', 
        description: '', 
        assetDesc: `Preencher nessa planilha as informações de logística de insumo controladas pela empresa ou por terceiros.` 
    }, 
    { 
        label: 'Logística de Produto Final', 
        value: 'downstream_transport', 
        description: '', 
        assetDesc: `Preencher nessa planilha as informações de logística de produto final realizada por terceiros.` 
    }, 
    { 
        label: 'Logística de Resíduos', 
        value: 'waste_transport', 
        description: '', 
        assetDesc: `Preencher nessa planilha as informações de logística de resíduos controladas por terceiros.` 
    }, 
    { 
        label: 'Viagens a Negócios Terrestres', 
        value: 'business_travel_land', 
        description: '', 
        assetDesc: `Preencher nessa planilha as informações de viagens a negócios em veículos cujo combustível não é controlado pela organização.
ATENÇÃO para a unidade de medida de cada combustível.` 
    },
    { 
        label: 'Viagens Aéreas', 
        value: 'air_travel', 
        description: '', 
        assetDesc: `No caso de escalas ou conexões, cada trecho deve ser inserido na planilha.` 
    },
    { 
        label: 'Transporte de Funcionários', 
        value: 'employee_commuting', 
        description: '', 
        assetDesc: `Preencher nessa planilha as informações de transporte de funcionários.
Por favor, informar o consumo de combustível para transporte. Se não houver esta informação, por favor informar a km percorrida ou endereços dos colaboradores.` 
    }, 

    { 
        label: 'Dados de Produção e Venda', 
        value: 'production_sales', 
        description: '', 
        assetDesc: `Por favor, forneça dados de produção de cada unidade empresarial. Esses dados serão utilizados para elaboração de indicadores relativos de emissões de GEE e para o cálculo de emissões de escopo 3.` 
    }, 
    { 
        label: 'Bens e Serviços Comprados', 
        value: 'purchased_goods', 
        description: '', 
        assetDesc: `Por favor, forneça dados de aquisição dos bens e serviços adquiridos pela organização.` 
    },
    { 
        label: 'Bens de Capital', 
        value: 'capital_goods', 
        description: '', 
        assetDesc: `Por favor, forneça dados de aquisição dos principais bens de capital no ano do invetário, em quantidade de unidades (ex. nova caldeira).` 
    },

    { 
        label: 'Resíduos Sólidos', 
        value: 'solid_waste', 
        description: '', 
        assetDesc: `Exemplo de local de resíduos controlado pela empresa: aterro próprio.
Para outros resíduos, especificar na coluna observações.` 
    },
    { 
        label: 'Efluentes Controlados', 
        value: 'effluents_controlled', 
        description: '', 
        assetDesc: `Preencher nessa planilha as informações referentes ao tratamento de efluentes industriais.
Se for aplicado mais de um tratamento para o efluente, acrescentar a informação na linha abaixo com os tratamentos de forma sequencial.
Inserir a informação de componente orgênico degradável e Nitrogênio da ENTRADA do tratamento ou destino final.` 
    },
    { 
        label: 'Efluentes Domésticos', 
        value: 'domestic_effluents', 
        description: '', 
        assetDesc: `Por favor, forneça dados de número de funcionários para cada unidade empresarial. Se não tiver o dado mensal, por favor fornecer o dado do final do ano.` 
    },

    { 
        label: 'Mudança do Uso do Solo', 
        value: 'land_use_change', 
        description: '', 
        assetDesc: `Por favor, especifique informações referentes à área de mudança do solo.` 
    }, 
    { 
        label: 'Área de Floresta Plantada', 
        value: 'planted_forest', 
        description: '', 
        assetDesc: '' 
    }, 
    { 
        label: 'Área de Conservação', 
        value: 'conservation_area', 
        description: '', 
        assetDesc: `Por favor, especifique informações referentes à área de conservação (Reservas legais, APP, etc.)` 
    },

    { 
        label: 'Home Office', 
        value: 'home_office', 
        description: '', 
        assetDesc: '' 
    },
] as const;

export type EsgModuleType = typeof ESG_MODULES[number]['value'];

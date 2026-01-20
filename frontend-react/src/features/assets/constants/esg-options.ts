// --- GLOBAL SHARED OPTIONS ---

export const YES_NO_OPTIONS = [
    { label: 'Sim', value: 'true' },
    { label: 'Não', value: 'false' },
];

export const REPORTING_FREQUENCY = [
    { label: 'Mensal', value: 'mensal' },
    { label: 'Anual', value: 'anual' },
];

export const MONTHS = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

export const PERIOD_OPTIONS = [
    "Anual", ...MONTHS
].map(p => ({ label: p, value: p }));

export const BIOMES = [
    "Amazônia", "Cerrado", "Mata_Atlântica", "Caatinga", "Pampa", "Pantanal"
].map(b => ({ label: b.replace('_', ' '), value: b }));

export const DAYS_OF_WEEK = [
    { id: "mon", label: "Segunda-feira" },
    { id: "tue", label: "Terça-feira" },
    { id: "wed", label: "Quarta-feira" },
    { id: "thu", label: "Quinta-feira" },
    { id: "fri", label: "Sexta-feira" },
    { id: "sat", label: "Sábado" },
    { id: "sun", label: "Domingo" },
];

export const PURCHASE_TYPES = [
    { label: "Produto", value: "Produto" },
    { label: "Serviço", value: "Serviço" }
];

export const LOGISTICS_MODES = [
    { label: "Transporte Marítimo", value: "Transporte Marítimo" },
    { label: "Transporte Ferroviário", value: "Transporte Ferroviário" },
    { label: "Transporte Rodoviário", value: "Transporte Rodoviário" }
];

export const REPORT_TYPES_LOGISTICS = [
    { label: "Consumo", value: "Consumo" },
    { label: "Distância", value: "Distância" }
];

export const FUEL_UNIT_MAP: Record<string, string> = {
    "Acetileno": "kg",
    "Alcatrão": "m³",
    "Asfaltos": "m³",
    "Bagaço de Cana": "Toneladas",
    "Biodiesel (B100)": "Litros",
    "Biogás (outros)": "Toneladas",
    "Biogás de aterro": "Toneladas",
    "Biometano": "Toneladas",
    "Caldo de Cana": "Toneladas",
    "Carvão Metalúrgico Importado": "Toneladas",
    "Carvão Metalúrgico Nacional": "Toneladas",
    "Carvão Vapor 3100 kcal / kg": "Toneladas",
    "Carvão Vapor 3300 kcal / kg": "Toneladas",
    "Carvão Vapor 3700 kcal / kg": "Toneladas",
    "Carvão Vapor 4200 kcal / kg": "Toneladas",
    "Carvão Vapor 4500 kcal / kg": "Toneladas",
    "Carvão Vapor 4700 kcal / kg": "Toneladas",
    "Carvão Vapor 5200 kcal / kg": "Toneladas",
    "Carvão Vapor 5900 kcal / kg": "Toneladas",
    "Carvão Vapor 6000 kcal / kg": "Toneladas",
    "Carvão Vapor sem Especificação": "Toneladas",
    "Carvão Vegetal": "Toneladas",
    "Coque de Carvão Mineral": "Toneladas",
    "Coque de Petróleo": "m³",
    "Etano": "Toneladas",
    "Etanol Anidro": "Litros",
    "Etanol Hidratado": "Litros",
    "Gás de Coqueria": "Toneladas",
    "Gás de Refinaria": "Toneladas",
    "Gás Liquefeito de Petróleo (GLP)": "Toneladas",
    "Gás Natural Seco": "m³",
    "Gás Natural Úmido": "m³",
    "Gasolina Automotiva (pura)": "Litros",
    "Gasolina de Aviação": "Litros",
    "Lenha Comercial": "Toneladas",
    "Licor Negro (Lixívia)": "Toneladas",
    "Líquidos de Gás Natural (LGN)": "Toneladas",
    "Lubrificantes": "Litros",
    "Melaço": "Toneladas",
    "Nafta": "m³",
    "Óleo Combustível": "Litros",
    "Óleo de Xisto": "Toneladas",
    "Óleo Diesel (puro)": "Litros",
    "Óleos Residuais": "Toneladas",
    "Outros Produtos de Petróleo": "Toneladas",
    "Parafina": "Toneladas",
    "Petróleo Bruto": "m³",
    "Querosene de Aviação": "Toneladas",
    "Querosene Iluminante": "Toneladas",
    "Resíduos Industriais": "TJ",
    "Resíduos Municipais (fração biomassa)": "Toneladas",
    "Resíduos Municipais (fração não-biomassa)": "Toneladas",
    "Resíduos Vegetais": "Toneladas",
    "Solventes": "Litros",
    "Turfa": "Toneladas",
    "Xisto Betuminoso e Areias Betuminosas": "Toneladas"
};

export const EFFLUENT_PARAMETER_UNITS = [
    { label: "mgDQO/L (Demanda Química de Oxigênio)", value: "mgDQO/L" },
    { label: "mgDBO/L (Demanda Biológica de Oxigênio)", value: "mgDBO/L" },
];

// --- MODULE SPECIFIC OPTIONS ---

// 1. Áreas de Conservação & Mudança de Uso do Solo
// Mapping of Biomes to Phytophysiognomies
export const BIOME_PHYTOPHYSIOGNOMIES: Record<string, string[]> = {
    "Amazônia": [
        "Floresta Ombrófila Aberta Aluvial", "Floresta Ombrófila Aberta Terras Baixas", "Floresta Ombrófila Aberta Submontana",
        "Floresta Estacional Decidual Terras Baixas", "Floresta Estacional Decidual Submontana", "Floresta Ombrófila Densa Aluvial",
        "Floresta Ombrófila Densa de Terras Baixas", "Floresta Ombrófila Densa Montana", "Floresta Ombrófila Densa Submontana",
        "Floresta Estacional Semidecidual aluvial", "Floresta Estacional Semidecidual de terras baixas", "Floresta Estacional Semidecidual montana",
        "Floresta Estacional Semidecidual Submontana", "Campinarana Arborizada", "Campinarana Arbustiva", "Campinarana Florestada",
        "Campinarana gramíneo lenhosa", "Vegetação com influência fluvial e/ou lacustre", "Pioneiras com influência fluviomarinha (mangue)",
        "Pioneiras com influência Marinha (restinga)", "Refúgio montano", "Savana Arborizada", "Savana Florestada", "Savana Gramíneo- Lenhosa",
        "Savana Parque", "Savana Estépica Arborizada", "Savana Estépica Florestada", "Savana Estépica Gramíneo Lenhosa", "Savana Estépica Parque",
        "Floresta Ombrófila Aberta Montana", "Floresta Estacional Decidual Aluvial", "Refúgio Alto-Montano", "Refúgio Submontano",
        "Contato Savana/Formações Pioneiras - Específico para Formação Pioneira com Influência Marinha (Restinga)", "Contato Savana/Floresta Estacional SN",
        "Contato Savana/Floresta Ombrófila SO", "Contato Savana/Savana-Estépica ST", "Contato Savana- Estépica/Floresta Estacional TN",
        "Contato Campinarana/Floresta Ombrófila LO", "Contato Floresta Ombrófila/Floresta Estacional ON", "Savana-Estépica", "Savana",
        "Áreas das Formações Pioneira", "Campinarana"
    ],
    "Cerrado": [
        "Floresta Ombrófila Aberta Aluvial", "Floresta Ombrófila Aberta das Terras Baixas", "Floresta Ombrófila Aberta Submontana",
        "Floresta Estacional Decidual Aluvial", "Floresta Estacional Decidual das Terras Baixas", "Floresta Estacional Decidual Montana/BA",
        "Floresta Estacional Decidual Montana/GO", "Floresta Estacional Decidual Montana/MG", "Floresta Estacional Decidual Montana/PI",
        "Floresta Estacional Decidual Montana/MS", "Floresta Estacional Decidual Montana/TO", "Floresta Estacional Decidual Submontana/BA",
        "Floresta Estacional Decidual Submontana/GO", "Floresta Estacional Decidual Submontana/MA", "Floresta Estacional Decidual Submontana/MG",
        "Floresta Estacional Decidual Submontana/PI", "Floresta Estacional Decidual Submontana/TO", "Floresta Estacional Decidual Submontana/MS",
        "Floresta Estacional Decidual Submontana/MT", "Floresta Estacional Decidual Submontana/SP", "Floresta Ombrófila Densa Aluvial",
        "Floresta Ombrófila Densa de Terras Baixas", "Floresta Ombrófila Densa Submontana", "Estepe Gramíneo-Lenhosa",
        "Floresta Estacional Semidecidual Aluvial/MA", "Floresta Estacional Semidecidual Aluvial/PA", "Floresta Estacional Semidecidual Aluvial/TO",
        "Floresta Estacional Semidecidual Aluvial/BA", "Floresta Estacional Semidecidual Aluvial/GO", "Floresta Estacional Semidecidual Aluvial/MG",
        "Floresta Estacional Semidecidual Aluvial/PI", "Floresta Estacional Semidecidual Aluvial/PR", "Floresta Estacional Semidecidual Aluvial/SP",
        "Floresta Estacional Semidecidual Aluvial/MS", "Floresta Estacional Semidecidual Aluvial/MT", "Floresta Estacional Semidecidual das Terras Baixas/MA",
        "Floresta Estacional Semidecidual das Terras Baixas/MT", "Floresta Estacional Semidecidual das Terras Baixas/GO", "Floresta Estacional Semidecidual das Terras Baixas/PI",
        "Floresta Estacional Semidecidual Montana/BA", "Floresta Estacional Semidecidual Montana/PI", "Floresta Estacional Semidecidual Montana/GO",
        "Floresta Estacional Semidecidual Montana/MG", "Floresta Estacional Semidecidual Montana/MS", "Floresta Estacional Semidecidual Montana/PR",
        "Floresta Estacional Semidecidual Montana/SP", "Floresta Estacional Semidecidual Montana/TO", "Floresta Estacional Semidecidual Submontana/BA",
        "Floresta Estacional Semidecidual Submontana/MA", "Floresta Estacional Semidecidual Submontana/PI", "Floresta Estacional Semidecidual Submontana/GO/MG/MS/MT/SP/TO",
        "Floresta Estacional Semidecidual Submontana/MG", "Floresta Estacional Semidecidual Submontana/MS", "Floresta Estacional Semidecidual Submontana/MT",
        "Floresta Estacional Semidecidual Submontana/SP", "Floresta Estacional Semidecidual Submontana/TO", "Floresta Ombrófila Mista Aluvial",
        "Floresta Ombrófila Mista Alto-montana", "Floresta Ombrófila Mista Montana", "Contato Floresta Ombrófila/Floresta Estacional", "Formação Pioneira",
        "Formação Pioneira com influência fluvial e/", "Formação Pioneira com influência fluvio- marinha (mangue)", "Formação Pioneira com influência marinha (restinga)",
        "Refúgio Montano", "Savana", "Savana Arborizada", "Savana Florestada/PR", "Savana Florestada/SP", "Savana Florestada/BA", "Savana Florestada/DF",
        "Savana Florestada/GO", "Savana Florestada/MG", "Savana Florestada/MS", "Savana Florestada/MT", "Savana Florestada/MA", "Savana Florestada/PI",
        "Savana Florestada/TO", "Savana Gramíneo-lenhosa", "Contato Savana/Floresta Ombrófila Mista", "Contato Savana/Floresta Estacional",
        "Contato Savana/Floresta Ombrófila", "Savana Parque", "Contato Savana/Savana- Estépica", "Contato Savana/Savana- Estépica/Floresta Estacional",
        "Savana-Estépica", "Savana Estépica Arborizada", "Savana Estépica Florestada", "Savana Estépica Gramíneo-lenhosa",
        "Contato Savana- Estépica/Floresta Estacional", "Savana Estépica Parque"
    ],
    "Mata_Atlântica": [
        "Floresta Ombrófila Aberta Aluvial", "Floresta Ombrófila Aberta Terras baixas", "Floresta Ombrófila Aberta Montana",
        "Floresta Ombrófila Aberta Submontana", "Floresta Estacional Decidual Aluvial", "Floresta Estacional Decidual Terras baixas",
        "Floresta Estacional Decidual Montana", "Floresta Estacional Decidual Submontana", "Floresta Ombrófila Densa (Floresta Tropical Pluvial)",
        "Floresta Ombrófila Densa Aluvial", "Floresta Ombrófila Densa Terras baixas", "Floresta Ombrófila Densa Alto-Montana",
        "Floresta Ombrófila Densa Montana", "Floresta Ombrófila Densa Submontana", "Estepe", "Estepe Gramíneo-Lenhosa",
        "Contato EstepeFloresta Ombrófila Mista", "Contato Estepe/Floresta Estacional", "Floresta Estacional Semidecidual",
        "Floresta Estacional Semidecidual Aluvial", "Floresta Estacional Semidecidual Terras baixas", "Floresta Estacional Semidecidual Montana",
        "Floresta Estacional Semidecidual Submontana", "Campinarana", "Campinarana arborizada", "Campinarana Gramíneo-Lenhosa",
        "Floresta Ombrófila Mista", "Floresta Ombrófila Mista Aluvial", "Floresta Ombrófila Mista Alto-Montana", "Floresta Ombrófila Mista Montana",
        "Floresta Ombrófila Mista Submontana", "Contato Floresta Estacional/Floresta Ombrófila Mista", "Contato Floresta Estacional/Formações Pioneiras Específico para Formação Pioneira com Influência Marinha (Restinga)",
        "Contato Floresta Ombrófila Densa/Floresta Ombrófila Mista", "Contato Floresta Ombrófila/Floresta Estacional",
        "Contato Floresta Ombrófila/Formações Pioneiras Específico para Formação Pioneira com Influência Marinha (Restinga)", "Áreas das Formações Pioneiras",
        "Vegetação com influência fluvial e/ou lacustre", "Vegetação com influência marinha (Restinga)", "Vegetação com influência marinha (Restinga)",
        "Refúgios Alto Montanos", "Refúgios montanos", "Savana", "Savana arborizada", "Savana florestada", "Savana Gramíneo-Lenhosa",
        "Contato Savana/Floresta Ombrófila Mista", "Contato Savana/Floresta Estacional", "Contato Savana/Floresta Ombrófila",
        "Contato Savana/Formações Pioneiras", "Savana parque", "Contato Savana/Formações pioneiras Específico para Formação Pioneira com Influência Marinha (Restinga)",
        "Contato Savana/Savana-Estépica", "Savana- Estépica arborizada", "Savana- Estépica florestada", "Savana- Estépica Gramíneo-Lenhosa",
        "Contato Savana-Estépica/Floresta Estacional"
    ],
    "Caatinga": [
        "Floresta Ombrófila Aberta Aluvial", "Floresta Ombrófila Aberta Terras Baixas", "Floresta Ombrófila Aberta Montana",
        "Afloramento Rochoso", "Floresta Ombrófila Aberta Submontana", "Floresta Estacional Decidual Aluvial",
        "Floresta Estacional Decidual Terras Baixas", "Floresta Estacional Decidual Montana", "Floresta Estacional Decidual Submontana",
        "Floresta Ombrófila Densa Aluvial", "Floresta Ombrófila Densa Montana", "Dunas", "Floresta Ombrófila Densa Submontana",
        "Floresta Estacional Semidecidual aluvial", "Floresta Estacional Semidecidual de terras baixas", "Floresta Estacional Semidecidual Montana",
        "Floresta Estacional Semidecidual Submontana", "Vegetação com influência fluvial e/ou lacustre", "Pioneiras com influência fluviomarinha (mangue)",
        "Pioneiras com influência Marinha (restinga)", "Refúgio Montano", "Savana Arborizada", "Savana Florestada", "Savana Gramíneo- Lenhosa",
        "Contato Savana/Floresta", "Savana Parque", "Contato Savana/Formações pioneiras Específico para Formação Pioneira com Influência Marinha (Restinga)",
        "Savana Estépica Arborizada (caatinga aberta)", "Savana Estépica Florestada (caatinga densa)", "Savana Estépica Gramíneo Lenhosa",
        "Contato Savana/Floresta Estacional", "Savana Estépica Parque"
    ],
    "Pampa": [
        "Floresta Estacional Decidual Aluvial", "Floresta Estacional Decidual Terras baixas", "Floresta Estacional Decidual Montana",
        "Floresta Estacional Decidual Submontana", "Floresta Ombrófla Densa Aluvial", "Floresta Ombrófla Densa Terras baixas",
        "Floresta Ombrófla Densa Montana", "Dunas", "Floresta Ombrófla Densa Submontana", "Estepe", "Estepe Arborizada",
        "Estepe Gramíneo Lenhosa", "Estepe Parque", "Contato Estepe- Floresta Ombrófila Mista", "Contato Estepe- Floresta Estacional",
        "Contato Estepe- Formações", "Floresta Estacional Semidecidual Aluvial", "Floresta Estacional Semidecidual Terras baixas",
        "Floresta Estacional Semidecidual Montana", "Floresta Estacional Semidecidual Submontana", "Floresta Ombrófla Mista Aluvial",
        "Floresta Ombrófla Mista Submontana", "Contato Floresta Estacional- Floresta Ombrófila Mista",
        "Contato Floresta Estacional- Formações Pioneiras com Influência Marinha (Restinga)", "Contato Floresta Ombrófila Densa-Floresta Ombrófila Mista",
        "Contato Floresta Ombrófila- Formações Pioneiras com Influência Marinha (Restinga)", "Áreas das Formações Pioneiras",
        "Vegetação com influência Fluvial e/ou lacustre", "Vegetação com influência Fluviomarinha", "Vegetação com influência Marinha (Restinga)",
        "Savana Estépica", "Savana Estépica Gramíneo-Lenhosa", "Savana Estépica Parque"
    ],
    "Pantanal": [
        "Floresta Estacional Decidual Aluvial", "Floresta Estacional Decidual Terras baixas", "Floresta Estacional Decidual Submontana",
        "Floresta Estacional Semidecidual Aluvial", "Floresta Estacional Semidecidual Terras baixas", "Floresta Estacional Semidecidual Submontana",
        "Contato Savana/Floresta Estacional", "Contato Savana- Estépica/Floresta Estacional", "Savana", "Savana arborizada", "Savana florestada",
        "Contato Savana/Savana- Estépica", "Savana-Estépica", "Savana- Estépica arborizada", "Savana- Estépica florestada", "Savana",
        "Savana Estépica Gramíneo- Lenhosa", "Savana parque", "Savana-Estépica parque"
    ]
};

// 2. Compra de Eletricidade
export const ENERGY_SOURCES = [
    "Sistema Interligado Nacional",
    "Mercado Livre Convencional",
    "Mercado Livre Incentivado",
    "Fonte Energética Específica"
].map(s => ({ label: s, value: s }));

export const SPECIFIC_ENERGY_SOURCES = [
    "Solar", "Eólica", "Biomassa", "Não identificado", "Outros tipos de fonte"
].map(s => ({ label: s, value: s }));

export const ELECTRICITY_UNITS = [
    { label: "kWh", value: "kWh" },
    { label: "MWh", value: "MWh" }
];

// 3. Resíduos Sólidos
export const WASTE_DESTINATIONS = [
    "Aterro", "Compostagem", "Incineração", "Cogeração", "Reciclagem"
].map(d => ({ label: d, value: d }));

export const WASTE_TYPES = [
    "A - Papéis/papelão",
    "C - Resíduos alimentares",
    "D - Madeira",
    "E - Resíduos de jardim e parque",
    "F - Fraldas",
    "G - Borracha e couro",
    "H - Lodo de esgoto",
    "I - Outros materiais inertes",
    "J - Outros Resíduos Orgânicos"
].map(t => ({ label: t, value: t }));

export const WEIGHT_UNITS = [
    { label: "Toneladas", value: "Toneladas" },
    { label: "Quilogramas", value: "Quilogramas" }
];

// 4. Combustão Móvel
export const MOBILE_REPORT_TYPES = [
    { label: 'Por Consumo (Litros/m³)', value: 'consumo' },
    { label: 'Por Distância (km)', value: 'distancia' },
];

export const VEHICLE_FUELS = [
    "Gasolina Automotiva", "Óleo Diesel", "Gás Natural Veicular (GNV)", "Gás Natural Liquefeito (GNL)",
    "Gás Liquefeito de Petróleo (GLP)", "Querosene de Aviação", "Gasolina de Aviação", "Lubrificantes",
    "Metanol", "Óleo Combustível", "Etanol Hidratado", "Biodiesel (B100)", "Biometano",
    "Bioquerosene (SAF)", "HVO (diesel verde)", "Biometanol", "Etanol Anidro"
].map(f => ({ label: f, value: f }));

export const FUEL_CONSUMPTION_UNITS = [
    { label: "Litros", value: "Litros" },
    { label: "m³", value: "m³" },
    { label: "kg", value: "kg" }
];

export const DISTANCE_UNITS = [
    { label: "Km", value: "Km" },
    { label: "Milhas", value: "Milhas" }
];

export const VEHICLE_TYPES = [
    "Automóvel a gasolina", "Automóvel a etanol", "Automóvel flex a gasolina", "Automóvel flex a etanol",
    "Motocicleta a gasolina", "Motocicleta flex a gasolina", "Motocicleta flex a etanol",
    "Veículo comercial leve a gasolina", "Veículo comercial leve a etanol",
    "Veículo comercial leve flex a gasolina", "Veículo comercial leve flex a etanol",
    "Veículo comercial leve a diesel", "Micro-ônibus a diesel", "Ônibus rodoviário a diesel",
    "Ônibus urbano a diesel", "Caminhão - rígido (3,5 a 7,5 toneladas)",
    "Caminhão - rígido (7,5 a 17 toneladas)", "Caminhão - rígido (acima de 17 toneladas)",
    "Caminhão - rígido (média)", "Caminhão - articulado (3,5 a 33 toneladas)",
    "Caminhão - articulado (acima de 33 toneladas)", "Caminhão - articulado (média)",
    "Caminhão - caminhão (média)", "Caminhão refrigerado - rígido (3,5 a 7,5 toneladas)",
    "Caminhão refrigerado - rígido (7,5 a 17 toneladas)", "Caminhão refrigerado - rígido (acima de 17 toneladas)",
    "Caminhão refrigerado - rígido (média)", "Caminhão refrigerado - articulado (3,5 a 33 toneladas)",
    "Caminhão refrigerado - articulado (acima de 33 toneladas)", "Caminhão refrigerado - articulado (média)",
    "Caminhão refrigerado - caminhão (média)", "Automóvel a GNV"
].map(v => ({ label: v, value: v }));

// 5. Combustão Estacionária
export const STATIONARY_FUELS = [
    "Acetileno", "Alcatrão", "Asfaltos", "Bagaço de Cana", "Biodiesel (B100)",
    "Biogás (outros)", "Biogás de aterro", "Biometano", "Caldo de Cana", "Carvão Metalúrgico Importado",
    "Carvão Metalúrgico Nacional", "Carvão Vapor 3100 kcal / kg", "Carvão Vapor 3300 kcal / kg",
    "Carvão Vapor 3700 kcal / kg", "Carvão Vapor 4200 kcal / kg", "Carvão Vapor 4500 kcal / kg",
    "Carvão Vapor 4700 kcal / kg", "Carvão Vapor 5200 kcal / kg", "Carvão Vapor 5900 kcal / kg",
    "Carvão Vapor 6000 kcal / kg", "Carvão Vapor sem Especificação", "Carvão Vegetal",
    "Coque de Carvão Mineral", "Coque de Petróleo", "Etano", "Etanol Anidro", "Etanol Hidratado",
    "Gás de Coqueria", "Gás de Refinaria", "Gás Liquefeito de Petróleo (GLP)", "Gás Natural Seco",
    "Gás Natural Úmido", "Gasolina Automotiva (pura)", "Gasolina de Aviação", "Lenha Comercial",
    "Licor Negro (Lixívia)", "Líquidos de Gás Natural (LGN)", "Lubrificantes", "Melaço", "Nafta",
    "Óleo Combustível", "Óleo de Xisto", "Óleo Diesel (puro)", "Óleos Residuais",
    "Outros Produtos de Petróleo", "Parafina", "Petróleo Bruto", "Querosene de Aviação",
    "Querosene Iluminante", "Resíduos Industriais", "Resíduos Municipais (fração biomassa)",
    "Resíduos Municipais (fração não-biomassa)", "Resíduos Vegetais", "Solventes", "Turfa",
    "Xisto Betuminoso e Areias Betuminosas"
].map(f => ({ label: f, value: f }));

export const STATIONARY_UNITS = [
    "kg", "m³", "Toneladas", "Litros", "TJ"
].map(u => ({ label: u, value: u }));

// 6. IPPU - Lubrificantes
export const LUBRICANT_TYPES = [
    { label: "Lubrificante", value: "Lubrificante" },
    { label: "Graxa", value: "Graxa" }
];

export const LUBRICANT_UNITS = [
    { label: "Litros", value: "Litros" },
    { label: "kg", value: "kg" }
];

// 7. Emissões Fugitivas
export const GAS_TYPES = [
    "Dióxido de carbono (CO2)", "Metano (CH4)", "Óxido nitroso (N2O)", "HFC-23", "HFC-32",
    "HFC-41", "HFC-125", "HFC-134", "HFC-134a", "HFC-143", "HFC-143a", "HFC-152", "HFC-152a",
    "HFC-161", "HFC-227ea", "HFC-236cb", "HFC-236ea", "HFC-236fa", "HFC-245ca", "HFC-245fa",
    "HFC-365mfc", "HFC-43-10mee", "Hexafluoreto de enxofre (SF6)", "Trifluoreto de nitrogênio (NF3)",
    "PFC-14", "PFC-116", "PFC-218", "PFC-318", "PFC-3-1-10", "PFC-4-1-12", "PFC-5-1-14", "PFC-9-1-18",
    "Trifluorometil pentafluoreto de enxofre (SF5CF3)", "Perfluorociclopropano (c-C3F6)", "R-400",
    "R-401A", "R-401B", "R-401C", "R-402A", "R-402B", "R-403A", "R-403B", "R-404A", "R-405A", "R-406A",
    "R-407A", "R-407B", "R-407C", "R-407D", "R-407E", "R-407F", "R-407G", "R-407H", "R-407I", "R-408A",
    "R-409A", "R-409B", "R-410A", "R-410B", "R-411A", "R-411B", "R-412A", "R-413A", "R-414A", "R-414B",
    "R-415A", "R-415B", "R-416A", "R-417A", "R-417B", "R-417C", "R-418A", "R-419A", "R-419B", "R-420A",
    "R-421A", "R-421B", "R-422A", "R-422B", "R-422C", "R-422D", "R-422E", "R-423A", "R-424A", "R-425A",
    "R-426A", "R-427A", "R-428A", "R-429A", "R-430A", "R-431A", "R-432A", "R-433A", "R-433B", "R-433C",
    "R-434A", "R-435A", "R-436A", "R-436B", "R-436C", "R-437A", "R-438A", "R-439A", "R-440A", "R-441A",
    "R-442A", "R-443A", "R-444B", "R-445A", "R-446A", "R-447A", "R-447B", "R-448A", "R-449A", "R-449B",
    "R-449C", "R-450A", "R-451A", "R-451B", "R-452A", "R-452B", "R-452C", "R-453A", "R-454A", "R-454B",
    "R-454C", "R-455A", "R-456A", "R-457A", "R-458A", "R-459A", "R-459B", "R-460A", "R-460B", "R-460C",
    "R-461A", "R-462A", "R-463A", "R-464A", "R-465A", "R-500", "R-501", "R-502", "R-503", "R-504",
    "R-505", "R-506", "R-507 ou R-507A", "R-508A", "R-508B", "R-509 ou R-509A", "R-510A", "R-511A",
    "R-512A", "R-513A", "R-513B", "R-514A", "R-515A", "R-516A", "CFC-11", "CFC-12", "CFC-13", "CFC-113",
    "CFC-114", "CFC-115", "Halon-1301", "Halon-1211", "Halon-2402", "Tetracloreto de carbono (CCl4)",
    "Bromometano (CH3Br)", "Methyl chloroform (CH3CCl3)", "HCFC-21", "HCFC-22 (R22)", "HCFC-123",
    "HCFC-124", "HCFC-141b", "HCFC-142b", "HCFC-225ca", "HCFC-225cb"
].map(g => ({ label: g, value: g }));

// 8. Efluentes Controlados
export const EFFLUENT_DESTINATION_TYPES = [
    { label: 'Tratamento', value: 'Tratamento' },
    { label: 'Destino Final', value: 'Destino Final' },
];

export const EFFLUENT_TREATMENT_TYPES = [
    "Tratamento aeróbio (lodo ativado, lagoa aerada, etc)", "Fossa séptica", "Reator anaeróbio",
    "Lagoa anaeróbia profunda (profundidade > 2 metros)", "Lagoa anaeróbia rasa (profundidade < 2 metros)",
    "Lagoa facultativa (profundidade < 2 metros)", "Lagoa de maturação (profundidade < 2 metros)", "Fossas secas"
].map(t => ({ label: t, value: t }));

export const EFFLUENT_FINAL_DESTINATIONS = [
    "Lançamento em corpos d'água (não especificado)", "Lançamento em corpos d'água (que não reservatórios, lagos e estuários)",
    "Lançamento em reservatórios, lagos e estuários", "Efluente parado a céu aberto", "Lançamento em reservatórios. lagos e estuários"
].map(d => ({ label: d, value: d }));

export const EFFLUENT_ORGANIC_UNITS = [
    { label: "mgDQO/L (Demanda química)", value: "mgDQO/L (Demanda química de oxigênio)" },
    { label: "mgDBO/L (Demanda biológica)", value: "mgDBO/L (Demanda biológica de oxigênio)" },
];

export const EFFLUENT_VOLUME_UNITS = [
    { label: "m³/ano", value: "m3/ano" },
    { label: "m³/mês", value: "m3/mês" }
];

// 9. Efluentes Domésticos
export const WORKER_TYPES = [
    { label: "Interno", value: "Interno" },
    { label: "Terceiro", value: "Terceiro" }
];

// 10. Mudança do Uso do Solo
export const LAND_USE_PREVIOUS_TYPES = [
    "Cultura anual", "Cultura de cana", "Cultura perene", "Pastagem", "Silvicultura",
    "Vegetação natural", "Assentamentos", "Outros usos"
].map(u => ({ label: u, value: u }));

export const LAND_VEGETATION_TYPES = [
    "Área de vegetação primária manejada",
    "Área de vegetação primária não manejada",
    "Área de vegetação secundária"
].map(t => ({ label: t, value: t }));

// 11. Bens e Serviços Comprados
export const PURCHASE_ITEM_TYPES = [
    { label: "Produto", value: "Produto" },
    { label: "Serviço", value: "Serviço" }
];

export const PURCHASE_UNITS = [
    "Tonelada", "Quilo", "Unidade", "M³", "Litro"
].map(u => ({ label: u, value: u }));

// 12. Logística (Upstream/Downstream/Waste)
export const TRANSPORT_MODES = [
    "Transporte Marítimo", "Transporte Ferroviário", "Transporte Rodoviário"
].map(m => ({ label: m, value: m }));

export const TRUCK_CLASS_TYPES = [
    "Caminhão - rígido (3,5 a 7,5 toneladas)", "Caminhão - rígido (7,5 a 17 toneladas)",
    "Caminhão - rígido (acima de 17 toneladas)", "Caminhão - rígido (média)",
    "Caminhão - articulado (3,5 a 33 toneladas)", "Caminhão - articulado (acima de 33 toneladas)",
    "Caminhão - articulado (média)", "Caminhão - caminhão (média)",
    "Caminhão refrigerado - rígido (3,5 a 7,5 toneladas)", "Caminhão refrigerado - rígido (7,5 a 17 toneladas)",
    "Caminhão refrigerado - rígido (acima de 17 toneladas)", "Caminhão refrigerado - rígido (média)",
    "Caminhão refrigerado - articulado (3,5 a 33 toneladas)", "Caminhão refrigerado - articulado (acima de 33 toneladas)",
    "Caminhão refrigerado - articulado (média)", "Caminhão refrigerado - caminhão (média)"
].map(c => ({ label: c, value: c }));

// 13. Viagens a Negócios Terrestres
export const BUSINESS_TRAVEL_MODES = [
    "Automóvel a gasolina", "Automóvel a etanol", "Automóvel flex a gasolina", "Automóvel flex a etanol",
    "Motocicleta a gasolina", "Motocicleta flex a gasolina", "Motocicleta flex a etanol",
    "Veículo comercial leve a gasolina", "Veículo comercial leve a etanol", "Veículo comercial leve flex a gasolina",
    "Veículo comercial leve flex a etanol", "Veículo comercial leve a diesel",
    "Micro-ônibus a diesel", "Ônibus rodoviário a diesel", "Ônibus urbano a diesel", "Trem", "Metrô"
].map(m => ({ label: m, value: m }));

// 14. Deslocamento de Funcionários
export const COMMUTING_MODES = [
    "Transporte fretado - Van", "Transporte fretado - ônibus de viagem", "Tranporte fretado - Automóvel pequeno",
    "Transporte público - Metrô", "Transporte público - ônibus", "Transporte público - trem urbano",
    "Veículo próprio - automóvel", "Veículo próprio - motocicleta", "Veículo próprio - bicicleta",
    "Uber", "Sem informação"
].map(m => ({ label: m, value: m }));

export const COMMUTING_REPORT_TYPES = [
    { label: "Consumo", value: "Consumo" },
    { label: "Distância", value: "Distância" },
    { label: "Endereço", value: "Endereço" }
];

// 15. Geração de Energia
export const GENERATION_SOURCES = [
    "Eólica", "Solar", "Hidro", "Biomassa", "Carvão"
].map(s => ({ label: s, value: s }));

export const GENERATION_UNITS = [
    { label: "KWh", value: "KWh" },
    { label: "MWh", value: "MWh" }
];

// 16. Espécies Florestais
export const FOREST_SPECIES = [
    "Amazônia", "Cerrado", "Mata Atlântica", "Caatinga", "Pampa", "Pantanal"
].map(b => ({ label: b, value: b }));
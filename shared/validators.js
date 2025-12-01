// arquivo: shared/validators.js

const normalizeString = (value) => {
    if (typeof value !== 'string') return '';
    return value
        .toLowerCase()
        .normalize('NFD').replace(/[\u0000-\u036f]/g, '')
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') 
        .trim();
};

export const validationSchemas = {
    electricity_purchase: {
        displayName: "Compra de Eletricidade",
        hasUnits: true,
        headerDisplayNames: {
            ano: "Ano",
            periodo: "Período",
            unidade_empresarial: "Unidade Empresarial",
            fonte_energia: "Fonte de Energia",
            especificar_fonte: "Especificar Fonte",
            consumo: "Consumo",
            unidade_medida: "Unidade de Medida",
            comentarios: "Comentários"
        },
        validOptions: {
            periodo: ["Anual", "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
            fonte_energia: ["Sistema Interligado Nacional", "Mercado Livre Convencional", "Mercado Livre Incentivado", "Fonte Energética Específica"],
            especificar_fonte: ["Solar", "Eólica", "Biomassa"],
            unidade_medida: ["kWh", "MWh"]
        },
        autoFillMap: {},
        validateRow: function(rowData) {
            const errors = {};
            const isFilled = (value) => value !== null && value !== undefined && value !== '';

            if (!rowData.ano || isNaN(parseInt(rowData.ano)) || String(rowData.ano).length !== 4) errors.ano = "Deve ser um ano com 4 dígitos.";
            if (!this.validOptions.periodo.includes(rowData.periodo)) errors.periodo = `Período inválido.`;
            if (!rowData.unidade_empresarial) errors.unidade_empresarial = "Obrigatório.";

            if (!this.validOptions.fonte_energia.includes(rowData.fonte_energia)) {
                errors.fonte_energia = "Selecione uma fonte de energia válida.";
            }

            const consumoVal = rowData.consumo;
            if (!isFilled(consumoVal) || isNaN(parseFloat(consumoVal)) || parseFloat(consumoVal) <= 0) {
                errors.consumo = `Entrada inválida ('${consumoVal}'). Insira um número decimal e positivo.`;
            }

            if (!this.validOptions.unidade_medida.includes(rowData.unidade_medida)) {
                errors.unidade_medida = "Selecione 'kWh' ou 'MWh'.";
            }

            // Regra Condicional para 'especificar_fonte'
            const isSIN = rowData.fonte_energia === 'Sistema Interligado Nacional';
            if (!isSIN) {
                if (!this.validOptions.especificar_fonte.includes(rowData.especificar_fonte)) {
                    errors.especificar_fonte = "Obrigatório selecionar uma especificação para esta fonte de energia.";
                }
            } else {
                if (isFilled(rowData.especificar_fonte)) {
                    errors.especificar_fonte = "Este campo só deve ser preenchido se a fonte não for SIN.";
                }
            }

            return { isValid: Object.keys(errors).length === 0, errors: errors, sanitizedData: rowData };
        }
    },
    solid_waste: {
        displayName: "Resíduos Sólidos",
        hasUnits: true,
        headerDisplayNames: {
            ano: "Ano",
            periodo: "Período",
            unidade_empresarial: "Unidade Empresarial",
            destinacao_final: "Destinação Final",
            tipo_residuo: "Tipo de Resíduo",
            quantidade_gerado: "Quantidade Gerado",
            unidade: "Unidade",
            informar_cidade_uf: "Cidade/UF de Destino",
            local_controlado_empresa: "O local de disposição é controlado pela empresa?",
            comentarios: "Comentários"
        },
        validOptions: {
            periodo: ["Anual", "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
            destinacao_final: ["Aterro", "Compostagem", "Incineração", "Cogeração", "Reciclagem"],
            tipo_residuo: [
                "A - Papéis/papelão",
                "C - Resíduos alimentares",
                "D - Madeira",
                "E - Resíduos de jardim e parque",
                "F - Fraldas",
                "G - Borracha e couro",
                "H - Lodo de esgoto",
                "I - Outros materiais inertes",
                "J - Outros Resíduos Orgânicos"
            ],
            unidade: ["Toneladas", "Quilogramas"],
            informar_cidade_uf: ["Sim", "Não"],
            local_controlado_empresa: ["Sim", "Não"]
        },
        autoFillMap: {},
        validateRow: function(rowData) {
            const errors = {};
            const isFilled = (value) => value !== null && value !== undefined && value !== '';

            if (!rowData.ano || isNaN(parseInt(rowData.ano)) || String(rowData.ano).length !== 4) errors.ano = "Deve ser um ano com 4 dígitos.";
            if (!this.validOptions.periodo.includes(rowData.periodo)) errors.periodo = `Período inválido.`;
            if (!rowData.unidade_empresarial) errors.unidade_empresarial = "Obrigatório.";

            if (!this.validOptions.destinacao_final.includes(rowData.destinacao_final)) {
                errors.destinacao_final = "Selecione uma destinação válida.";
            }

            if (!this.validOptions.tipo_residuo.includes(rowData.tipo_residuo)) {
                errors.tipo_residuo = "Selecione um tipo de resíduo válido.";
            }

            const quantidadeVal = rowData.quantidade_gerado;
            if (!isFilled(quantidadeVal) || isNaN(parseFloat(quantidadeVal)) || parseFloat(quantidadeVal) <= 0) {
                errors.quantidade_gerado = `Entrada inválida ('${quantidadeVal}'). Insira um número decimal e positivo.`;
            }

            if (!this.validOptions.unidade.includes(rowData.unidade)) {
                errors.unidade = "Selecione 'Toneladas' ou 'Quilogramas'.";
            }
            
            if (rowData.destinacao_final === 'Aterro') {
                // Validação removida pois o campo agora é texto livre preenchido pelo cadastro
            } else {
                if (isFilled(rowData.informar_cidade_uf)) {
                    errors.informar_cidade_uf = "Este campo só deve ser preenchido se a destinação for 'Aterro'.";
                }
            }
            
            const normalizedControlado = normalizeString(rowData.local_controlado_empresa);
            if (['sim', 's'].includes(normalizedControlado)) { rowData.local_controlado_empresa = 'Sim'; } 
            else if (['nao', 'n'].includes(normalizedControlado)) { rowData.local_controlado_empresa = 'Não'; }
            if (!this.validOptions.local_controlado_empresa.includes(rowData.local_controlado_empresa)) {
                errors.local_controlado_empresa = "Deve ser 'Sim' ou 'Não'.";
            }

            return { isValid: Object.keys(errors).length === 0, errors: errors, sanitizedData: rowData };
        }
    },
    combustao_movel: {
        displayName: "Combustão Móvel",
        hasUnits: true,
        headerDisplayNames: {
            ano: "Ano",
            periodo: "Período",
            unidade_empresarial: "Unidade Empresarial",
            descricao_fonte: "Descrição da Fonte",
            tipo_entrada: "Tipo de Entrada",
            combustivel: "Combustível",
            consumo: "Consumo",
            unidade_consumo: "Unidade de Consumo",
            distancia_percorrida: "Distância Percorrida",
            unidade_distancia: "Unidade da Distância",
            tipo_veiculo: "Tipo de Veículo",
            controlado_empresa: "Controlado pela Empresa?",
            comentarios: "Comentários"
        },
        displayValueMap: {
            tipo_entrada: {
                consumo: "Por Consumo",
                distancia: "Por Distância"
            }
        },
        validOptions: {
            periodo: ["Anual", "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
            controlado_empresa: ["Sim", "Não"],
            tipo_entrada: ["consumo", "distancia"],
            combustivel: [
                "Gasolina Automotiva", "Óleo Diesel", "Gás Natural Veicular (GNV)", "Gás Natural Liquefeito (GNL)", "Gás Liquefeito de Petróleo (GLP)", "Querosene de Aviação", "Gasolina de Aviação", "Lubrificantes", "Metanol", "Óleo Combustível", "Etanol Hidratado", "Biodiesel (B100)", "Biometano", "Bioquerosene (SAF)", "HVO (diesel verde)", "Biometanol", "Etanol Anidro"
            ],
            unidade_consumo: ["Litros", "m³", "kg"],
            unidade_distancia: ["Km", "Milhas"],
            tipo_veiculo: [
                "Automóvel a gasolina", "Automóvel a etanol", "Automóvel flex a gasolina", "Automóvel flex a etanol", "Motocicleta a gasolina", "Motocicleta flex a gasolina", "Motocicleta flex a etanol", "Veículo comercial leve a gasolina", "Veículo comercial leve a etanol", "Veículo comercial leve flex a gasolina", "Veículo comercial leve flex a etanol", "Veículo comercial leve a diesel", "Micro-ônibus a diesel", "Ônibus rodoviário a diesel", "Ônibus urbano a diesel", "Caminhão - rígido (3,5 a 7,5 toneladas)", "Caminhão - rígido (7,5 a 17 toneladas)", "Caminhão - rígido (acima de 17 toneladas)", "Caminhão - rígido (média)", "Caminhão - articulado (3,5 a 33 toneladas)", "Caminhão - articulado (acima de 33 toneladas)", "Caminhão - articulado (média)", "Caminhão - caminhão (média)", "Caminhão refrigerado - rígido (3,5 a 7,5 toneladas)", "Caminhão refrigerado - rígido (7,5 a 17 toneladas)", "Caminhão refrigerado - rígido (acima de 17 toneladas)", "Caminhão refrigerado - rígido (média)", "Caminhão refrigerado - articulado (3,5 a 33 toneladas)", "Caminhão refrigerado - articulado (acima de 33 toneladas)", "Caminhão refrigerado - articulado (média)", "Caminhão refrigerado - caminhão (média)", "Automóvel a GNV"
            ]
        },
        autoFillMap: {
            combustivel: {
                targetColumn: "unidade_consumo",
                map: {
                    "Gasolina Automotiva": "Litros", "Óleo Diesel": "Litros", "Gás Natural Veicular (GNV)": "m³", "Gás Natural Liquefeito (GNL)": "Litros", "Gás Liquefeito de Petróleo (GLP)": "kg", "Querosene de Aviação": "Litros", "Gasolina de Aviação": "Litros", "Lubrificantes": "Litros", "Metanol": "Litros", "Óleo Combustível": "Litros", "Etanol Hidratado": "Litros", "Biodiesel (B100)": "Litros", "Biometano": "m³", "Bioquerosene (SAF)": "Litros", "HVO (diesel verde)": "Litros", "Biometanol": "Litros", "Etanol Anidro": "Litros"
                }
            }
        },
        validateRow: function(rowData) {
            const errors = {};
            const isFilled = (value) => value !== null && value !== undefined && value !== '';
            
            if (!rowData.ano || isNaN(parseInt(rowData.ano)) || String(rowData.ano).length !== 4) errors.ano = "Deve ser um ano com 4 dígitos.";
            if (!this.validOptions.periodo.includes(rowData.periodo)) errors.periodo = `Período inválido.`;
            if (!rowData.descricao_fonte) errors.descricao_fonte = "Obrigatório.";
            
            const normalizedControlado = normalizeString(rowData.controlado_empresa);
            if (['sim', 's'].includes(normalizedControlado)) { rowData.controlado_empresa = 'Sim'; } else if (['nao', 'n'].includes(normalizedControlado)) { rowData.controlado_empresa = 'Não'; }
            if (!this.validOptions.controlado_empresa.includes(rowData.controlado_empresa)) { errors.controlado_empresa = "Deve ser 'Sim' ou 'Não'."; }

            if (!this.validOptions.tipo_entrada.includes(rowData.tipo_entrada)) {
                errors.tipo_entrada = "Deve ser 'consumo' ou 'distancia'.";
            } else {
                if (rowData.tipo_entrada === 'consumo') {
                    if (!this.validOptions.combustivel.includes(rowData.combustivel)) { errors.combustivel = "Selecione um combustível válido."; }
                    const consumoVal = rowData.consumo;
                    if (consumoVal === '' || isNaN(parseFloat(consumoVal))) { errors.consumo = `Entrada inválida ('${consumoVal}'). Insira um número.`; }
                    if (this.autoFillMap.combustivel.map[rowData.combustivel] !== rowData.unidade_consumo) { errors.unidade_consumo = `Unidade incorreta para o combustível.`; }
                    if (isFilled(rowData.distancia_percorrida)) errors.distancia_percorrida = "Deve estar vazio para entrada por consumo.";
                    if (isFilled(rowData.unidade_distancia)) errors.unidade_distancia = "Deve estar vazio para entrada por consumo.";
                    if (isFilled(rowData.tipo_veiculo)) errors.tipo_veiculo = "Deve estar vazio para entrada por consumo.";
                } else if (rowData.tipo_entrada === 'distancia') {
                    const distanciaVal = rowData.distancia_percorrida;
                    if (distanciaVal === '' || isNaN(parseFloat(distanciaVal))) { errors.distancia_percorrida = `Entrada inválida ('${distanciaVal}'). Insira um número.`; }
                    if (!this.validOptions.unidade_distancia.includes(rowData.unidade_distancia)) { errors.unidade_distancia = "Selecione 'Km' ou 'Milhas'."; }
                    if (!this.validOptions.tipo_veiculo.includes(rowData.tipo_veiculo)) { errors.tipo_veiculo = "Selecione um tipo de veículo válido."; }
                    if (isFilled(rowData.combustivel)) errors.combustivel = "Deve estar vazio para entrada por distância.";
                    if (isFilled(rowData.consumo)) errors.consumo = "Deve estar vazio para entrada por distância.";
                    if (isFilled(rowData.unidade_consumo)) errors.unidade_consumo = "Deve estar vazio para entrada por distância.";
                }
            }
            return { isValid: Object.keys(errors).length === 0, errors: errors, sanitizedData: rowData };
        }
    },
    combustao_estacionaria: {
        displayName: "Combustão Estacionária",
        hasUnits: true,
        headerDisplayNames: {
            ano: "Ano", periodo: "Período", unidade_empresarial: "Unidade Empresarial", descricao_da_fonte: "Descrição da Fonte", combustivel_estacionario: "Combustível", consumo: "Consumo", unidade: "Unidade", controlado_empresa: "Controlado pela Empresa?", comentarios: "Comentários"
        },
        validOptions: {
            periodo: ["Anual", "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
            combustivel_estacionario: ["Acetileno", "Alcatrão", "Asfaltos", "Bagaço de Cana", "Biodiesel (B100)", "Biogás (outros)", "Biogás de aterro", "Biometano", "Caldo de Cana", "Carvão Metalúrgico Importado", "Carvão Metalúrgico Nacional", "Carvão Vapor 2100 kcal / kg", "Carvão Vapor 2200 kcal / kg", "Carvão Vapor 2700 kcal / kg", "Carvão Vapor 4200 kcal / kg", "Carvão Vapor 4500 kcal / kg", "Carvão Vapor 4700 kcal / kg", "Carvão Vapor 5200 kcal / kg", "Carvão Vapor 5900 kcal / kg", "Carvão Vapor 6000 kcal / kg", "Carvão Vapor sem Especificação", "Carvão Vegetal", "Coque de Carvão Mineral", "Coque de Petróleo", "Etano", "Etanol Anidro", "Etanol Hidratado", "Gás de Coqueria", "Gás de Refinaria", "Gás Liquefeito de Petróleo (GLP)", "Gás Natural Seco", "Gás Natural Úmido", "Gasolina Automotiva", "Gasolina de Aviação", "Lenha Comercial", "Licor Negro (Lixívia)", "Líquidos de Gás Natural (LGN)", "Lubrificantes", "Melaço", "Nafta", "Óleo Combustível", "Óleo de Xisto", "Óleo Diesel", "Óleos Residuais", "Outros Produtos de Petróleo", "Parafina", "Petróleo Bruto", "Querosene de Aviação", "Querosene Iluminante", "Resíduos Industriais", "Resíduos Municipais (fração biomassa)", "Resíduos Municipais (fração não-biomassa)", "Resíduos Vegetais", "Solventes", "Turfa", "Xisto Betuminoso e Areias Betuminosas"],
            unidade: ["kg", "m2", "m3", "Toneladas", "Litros", "TJ"],
            controlado_empresa: ["Sim", "Não"],
        },
        autoFillMap: {
            combustivel_estacionario: {
                targetColumn: "unidade",
                map: { "Acetileno": "kg", "Alcatrão": "m2", "Asfaltos": "m2", "Bagaço de Cana": "Toneladas", "Biodiesel (B100)": "Litros", "Biogás (outros)": "Toneladas", "Biogás de aterro": "Toneladas", "Biometano": "Toneladas", "Caldo de Cana": "Toneladas", "Carvão Metalúrgico Importado": "Toneladas", "Carvão Metalúrgico Nacional": "Toneladas", "Carvão Vapor 2100 kcal / kg": "Toneladas", "Carvão Vapor 2200 kcal / kg": "Toneladas", "Carvão Vapor 2700 kcal / kg": "Toneladas", "Carvão Vapor 4200 kcal / kg": "Toneladas", "Carvão Vapor 4500 kcal / kg": "Toneladas", "Carvão Vapor 4700 kcal / kg": "Toneladas", "Carvão Vapor 5200 kcal / kg": "Toneladas", "Carvão Vapor 5900 kcal / kg": "Toneladas", "Carvão Vapor 6000 kcal / kg": "Toneladas", "Carvão Vapor sem Especificação": "Toneladas", "Carvão Vegetal": "Toneladas", "Coque de Carvão Mineral": "Toneladas", "Coque de Petróleo": "m2", "Etano": "Toneladas", "Etanol Anidro": "Litros", "Etanol Hidratado": "Litros", "Gás de Coqueria": "Toneladas", "Gás de Refinaria": "Toneladas", "Gás Liquefeito de Petróleo (GLP)": "Toneladas", "Gás Natural Seco": "m3", "Gás Natural Úmido": "m3", "Gasolina Automotiva": "Litros", "Gasolina de Aviação": "Litros", "Lenha Comercial": "Toneladas", "Licor Negro (Lixívia)": "Toneladas", "Líquidos de Gás Natural (LGN)": "Toneladas", "Lubrificantes": "Litros", "Melaço": "Toneladas", "Nafta": "m2", "Óleo Combustível": "Litros", "Óleo de Xisto": "Toneladas", "Óleo Diesel": "Litros", "Óleos Residuais": "Toneladas", "Outros Produtos de Petróleo": "Toneladas", "Parafina": "Toneladas", "Petróleo Bruto": "m3", "Querosene de Aviação": "Toneladas", "Querosene Iluminante": "Toneladas", "Resíduos Industriais": "TJ", "Resíduos Municipais (fração biomassa)": "Toneladas", "Resíduos Municipais (fração não-biomassa)": "Toneladas", "Resíduos Vegetais": "Toneladas", "Solventes": "Litros", "Turfa": "Toneladas", "Xisto Betuminoso e Areias Betuminosas": "Toneladas" }
            }
        },
        validateRow: function(rowData) {
            const errors = {};
            if (!rowData.ano || isNaN(parseInt(rowData.ano)) || String(rowData.ano).length !== 4) errors.ano = "Deve ser um ano com 4 dígitos.";
            if (!this.validOptions.periodo.includes(rowData.periodo)) errors.periodo = "Período inválido.";
            if (!rowData.descricao_da_fonte) errors.descricao_da_fonte = "Obrigatório.";
            if (!this.validOptions.combustivel_estacionario.includes(rowData.combustivel_estacionario)) errors.combustivel_estacionario = "Combustível inválido.";
            const consumoVal = rowData.consumo;
            if (consumoVal === '' || isNaN(parseFloat(consumoVal))) { errors.consumo = `Entrada inválida ('${consumoVal}'). Insira um número.`; }
            if (this.autoFillMap.combustivel_estacionario.map[rowData.combustivel_estacionario] !== rowData.unidade) errors.unidade = `Unidade incorreta para o combustível.`;
            const normalizedControlado = normalizeString(rowData.controlado_empresa);
            if (['sim', 's'].includes(normalizedControlado)) { rowData.controlado_empresa = 'Sim'; } else if (['nao', 'n'].includes(normalizedControlado)) { rowData.controlado_empresa = 'Não'; }
            if (!this.validOptions.controlado_empresa.includes(rowData.controlado_empresa)) { errors.controlado_empresa = "Deve ser 'Sim' ou 'Não'."; }
            return { isValid: Object.keys(errors).length === 0, errors: errors, sanitizedData: rowData };
        }
    },
    dados_producao_venda: {
        displayName: "Dados de Produção e Venda",
        hasUnits: true,
        headerDisplayNames: { ano: "Ano", periodo: "Período", unidade_empresarial: "Unidade Empresarial", produto: "Produto", quantidade_vendida: "Quantidade Vendida", unidade_medida: "Unidade de Medida", comentarios: "Comentários" },
        validOptions: { periodo: ["Anual", "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"] },
        autoFillMap: {},
        validateRow: function(rowData) {
            const errors = {};
            if (!rowData.ano || isNaN(parseInt(rowData.ano)) || String(rowData.ano).length !== 4) errors.ano = "Deve ser um ano com 4 dígitos.";
            if (!this.validOptions.periodo.includes(rowData.periodo)) errors.periodo = "Período inválido.";
            if (!rowData.unidade_empresarial) errors.unidade_empresarial = "Obrigatório.";
            if (!rowData.produto) errors.produto = "Obrigatório.";
            if (!rowData.unidade_medida) errors.unidade_medida = "Obrigatório.";
            const quantidadeVal = rowData.quantidade_vendida;
            const quantidadeNum = parseInt(quantidadeVal, 10);
            if (isNaN(quantidadeNum) || quantidadeNum <= 0 || String(quantidadeVal).includes('.') || String(quantidadeVal).includes(',')) { errors.quantidade_vendida = `Entrada inválida ('${quantidadeVal}'). Insira um número inteiro e positivo.`; }
            return { isValid: Object.keys(errors).length === 0, errors: errors, sanitizedData: rowData };
        }
    },
    ippu_lubrificantes: {
        displayName: "IPPU - Lubrificantes",
        hasUnits: true,
        headerDisplayNames: { ano: "Ano", periodo: "Período", unidade_empresarial: "Unidade Empresarial", fonte_emissao: "Fonte de Emissão / Equipamento", tipo_lubrificante: "Tipo de Lubrificante", consumo: "Consumo", unidade: "Unidade", controlado_empresa: "Controlado pela Empresa?", comentarios: "Comentários" },
        validOptions: { periodo: ["Anual", "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"], tipo_lubrificante: ["Lubrificante", "Graxa"], unidade: ["Litros", "kg"], controlado_empresa: ["Sim", "Não"] },
        autoFillMap: { tipo_lubrificante: { targetColumn: "unidade", map: { "Lubrificante": "Litros", "Graxa": "kg" } } },
        validateRow: function(rowData) {
            const errors = {};
            if (!rowData.ano || isNaN(parseInt(rowData.ano)) || String(rowData.ano).length !== 4) errors.ano = "Deve ser um ano com 4 dígitos.";
            if (!this.validOptions.periodo.includes(rowData.periodo)) errors.periodo = "Período inválido.";
            if (!rowData.fonte_emissao) errors.fonte_emissao = "Obrigatório.";
            if (!this.validOptions.tipo_lubrificante.includes(rowData.tipo_lubrificante)) errors.tipo_lubrificante = "Tipo inválido.";
            const consumoVal = rowData.consumo;
            const consumoNum = parseFloat(consumoVal);
            if (isNaN(consumoNum) || consumoNum <= 0) { errors.consumo = `Entrada inválida ('${consumoVal}'). Insira um número positivo.`; }
            if (this.autoFillMap.tipo_lubrificante.map[rowData.tipo_lubrificante] !== rowData.unidade) { errors.unidade = `Unidade incorreta para o tipo de lubrificante.`; }
            const normalizedControlado = normalizeString(rowData.controlado_empresa);
            if (['sim', 's'].includes(normalizedControlado)) { rowData.controlado_empresa = 'Sim'; } else if (['nao', 'n'].includes(normalizedControlado)) { rowData.controlado_empresa = 'Não'; }
            if (!this.validOptions.controlado_empresa.includes(rowData.controlado_empresa)) { errors.controlado_empresa = "Deve ser 'Sim' ou 'Não'."; }
            return { isValid: Object.keys(errors).length === 0, errors: errors, sanitizedData: rowData };
        }
    },
    emissoes_fugitivas: {
        displayName: "Emissões Fugitivas",
        hasUnits: true,
        headerDisplayNames: { ano: "Ano", periodo: "Período", unidade_empresarial: "Unidade Empresarial", fonte_emissao: "Fonte de Emissão / Equipamento", tipo_gas: "Tipo de Gás", quantidade_reposta: "Quantidade Reposta", unidade: "Unidade", controlado_empresa: "Controlado pela Empresa?", comentarios: "Comentários" },
        
        gasList: ["Dióxido de carbono (CO2)", "Metano (CH4)", "Óxido nitroso (N2O)", "HFC-23", "HFC-32", "HFC-41", "HFC-125", "HFC-134", "HFC-134a", "HFC-143", "HFC-143a", "HFC-152", "HFC-152a", "HFC-161", "HFC-227ea", "HFC-236cb", "HFC-236ea", "HFC-236fa", "HFC-245ca", "HFC-245fa", "HFC-365mfc", "HFC-43-10mee", "Hexafluoreto de enxofre (SF6)", "Trifluoreto de nitrogênio (NF3)", "PFC-14", "PFC-116", "PFC-218", "PFC-318", "PFC-3-1-10", "PFC-4-1-12", "PFC-5-1-14", "PFC-9-1-18", "Trifluorometil pentafluoreto de enxofre (SF5CF3)", "Perfluorociclopropano (c-C3F6)", "R-400", "R-401A", "R-401B", "R-401C", "R-402A", "R-402B", "R-403A", "R-403B", "R-404A", "R-405A", "R-406A", "R-407A", "R-407B", "R-407C", "R-407D", "R-407E", "R-407F", "R-407G", "R-407H", "R-407I", "R-408A", "R-409A", "R-409B", "R-410A", "R-410B", "R-411A", "R-411B", "R-412A", "R-413A", "R-414A", "R-414B", "R-415A", "R-415B", "R-416A", "R-417A", "R-417B", "R-417C", "R-418A", "R-419A", "R-419B", "R-420A", "R-421A", "R-421B", "R-422A", "R-422B", "R-422C", "R-422D", "R-422E", "R-423A", "R-424A", "R-425A", "R-426A", "R-427A", "R-428A", "R-429A", "R-430A", "R-431A", "R-432A", "R-433A", "R-433B", "R-433C", "R-434A", "R-435A", "R-436A", "R-436B", "R-436C", "R-437A", "R-438A", "R-439A", "R-440A", "R-441A", "R-442A", "R-443A", "R-444A", "R-444B", "R-445A", "R-446A", "R-447A", "R-447B", "R-448A", "R-449A", "R-449B", "R-449C", "R-450A", "R-451A", "R-451B", "R-452A", "R-452B", "R-452C", "R-453A", "R-454A", "R-454B", "R-454C", "R-455A", "R-456A", "R-457A", "R-458A", "R-459A", "R-459B", "R-460A", "R-460B", "R-460C", "R-461A", "R-462A", "R-463A", "R-464A", "R-465A", "R-500", "R-501", "R-502", "R-503", "R-504", "R-505", "R-506", "R-507 ou R-507A", "R-508A", "R-508B", "R-509 ou R-509A", "R-510A", "R-511A", "R-512A", "R-513A", "R-513B", "R-514A", "R-515A", "R-516A", "CFC-11", "CFC-12", "CFC-13", "CFC-113", "CFC-114", "CFC-115", "Halon-1301", "Halon-1211", "Halon-2402", "Tetracloreto de carbono (CCl4)", "Bromometano (CH3Br)", "Methyl chloroform (CH3CCl3)", "HCFC-21", "HCFC-22 (R22)", "HCFC-123", "HCFC-124", "HCFC-141b", "HCFC-142b", "HCFC-225ca", "HCFC-225cb"],
        
        get validOptions() { return { periodo: ["Anual", "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"], tipo_gas: this.gasList, unidade: ["kg"], controlado_empresa: ["Sim", "Não"] }; },
        autoFillMap: {},
        validateRow: function(rowData, optionsCache) {
            const errors = {};
            const validGasOptions = optionsCache?.tipo_gas || this.validOptions.tipo_gas;
            const validGasOptionsNormalized = validGasOptions.map(g => g.toLowerCase());
            const gasInputNormalized = (rowData.tipo_gas || '').toLowerCase();
            if (!rowData.ano || isNaN(parseInt(rowData.ano)) || String(rowData.ano).length !== 4) errors.ano = "Deve ser um ano com 4 dígitos.";
            if (!this.validOptions.periodo.includes(rowData.periodo)) errors.periodo = "Período inválido.";
            if (!rowData.unidade_empresarial) errors.unidade_empresarial = "Obrigatório.";
            if (!rowData.fonte_emissao) errors.fonte_emissao = "Obrigatório.";
            const normalizedControlado = normalizeString(rowData.controlado_empresa);
            if (['sim', 's'].includes(normalizedControlado)) { rowData.controlado_empresa = 'Sim'; } else if (['nao', 'n'].includes(normalizedControlado)) { rowData.controlado_empresa = 'Não'; }
            if (!this.validOptions.controlado_empresa.includes(rowData.controlado_empresa)) { errors.controlado_empresa = "Deve ser 'Sim' ou 'Não'."; }
            const quantidadeVal = rowData.quantidade_reposta;
            const quantidadeNum = parseFloat(quantidadeVal);
            if (isNaN(quantidadeNum) || quantidadeNum <= 0) { errors.quantidade_reposta = `Entrada inválida ('${quantidadeVal}'). Insira um número positivo.`; }
            if (rowData.unidade !== 'kg') errors.unidade = "Unidade deve ser 'kg'.";
            if (!gasInputNormalized || !validGasOptionsNormalized.includes(gasInputNormalized)) { errors.tipo_gas = "Obrigatório selecionar um gás da lista."; }
            return { isValid: Object.keys(errors).length === 0, errors: errors, sanitizedData: rowData };
        }
    },
    fertilizantes: {
        displayName: "Fertilizantes",
        hasUnits: true,
        headerDisplayNames: { ano: "Ano", periodo: "Período", unidade_empresarial: "Unidade Empresarial", tipo_fertilizante: "Tipo de Fertilizante", quantidade_kg: "Quantidade de Fertilizante", unidade: "Unidade", percentual_nitrogenio: "Percentual de Nitrogênio (%)", percentual_carbonato: "Percentual de Carbonato (%)", controlado_empresa: "Controlado pela Empresa?", comentarios: "Comentários" },
        validOptions: { periodo: ["Anual", "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"], unidade: ["kg"], controlado_empresa: ["Sim", "Não"] },
        autoFillMap: {},
        validateRow: function(rowData) {
            const errors = {};
            if (!rowData.ano || isNaN(parseInt(rowData.ano)) || String(rowData.ano).length !== 4) errors.ano = "Deve ser um ano com 4 dígitos.";
            if (!this.validOptions.periodo.includes(rowData.periodo)) errors.periodo = "Período inválido.";
            if (!rowData.unidade_empresarial) errors.unidade_empresarial = "Obrigatório.";
            if (!rowData.tipo_fertilizante) errors.tipo_fertilizante = "Obrigatório.";
            const quantidadeVal = rowData.quantidade_kg;
            const quantidadeNum = parseFloat(quantidadeVal);
            if (isNaN(quantidadeNum) || quantidadeNum <= 0) { errors.quantidade_kg = `Entrada inválida ('${quantidadeVal}'). Insira um número positivo.`; }
            const percNVal = rowData.percentual_nitrogenio;
            const percCVal = rowData.percentual_carbonato;
            const percN = parseFloat(percNVal);
            const percC = parseFloat(percCVal);
            if (isNaN(percN) || percN < 0 || percN > 100) { errors.percentual_nitrogenio = `Entrada inválida ('${percNVal}'). Insira um número de 0 a 100.`; }
            if (isNaN(percC) || percC < 0 || percC > 100) { errors.percentual_carbonato = `Entrada inválida ('${percCVal}'). Insira um número de 0 a 100.`; }
            if (rowData.unidade !== 'kg') errors.unidade = "Unidade deve ser 'kg'.";
            if (!isNaN(percN) && !isNaN(percC) && (percN + percC > 100)) {
                errors.percentual_nitrogenio = "A soma das porcentagens não pode exceder 100%.";
                errors.percentual_carbonato = "A soma das porcentagens não pode exceder 100%.";
            }
            const normalizedControlado = normalizeString(rowData.controlado_empresa);
            if (['sim', 's'].includes(normalizedControlado)) { rowData.controlado_empresa = 'Sim'; } else if (['nao', 'n'].includes(normalizedControlado)) { rowData.controlado_empresa = 'Não'; }
            if (!this.validOptions.controlado_empresa.includes(rowData.controlado_empresa)) { errors.controlado_empresa = "Deve ser 'Sim' ou 'Não'."; }
            return { isValid: Object.keys(errors).length === 0, errors: errors, sanitizedData: rowData };
        }
    },
    efluentes_controlados: {
        displayName: "Efluentes Controlados",
        hasUnits: true,
        headerDisplayNames: { ano: "Ano", periodo: "Período", unidade_empresarial: "Unidade Empresarial", tratamento_ou_destino: "Tratamento ou Destino Final?", tipo_tratamento: "Tipo de Tratamento", tipo_destino_final: "Tipo de Destino Final", qtd_efluente_liquido_m3: "Quantidade de Efluente Líquido Gerado", unidade_efluente_liquido: "Unidade do Efluente Líquido", qtd_componente_organico: "Quantidade de Componente Orgânico Degradável do Efluente", unidade_componente_organico: "Unidade do Componente Orgânico", qtd_nitrogenio_mg_l: "Quantidade de Nitrogênio no Efluente Gerado", unidade_nitrogenio: "Unidade do Nitrogênio", componente_organico_removido_lodo: "Componente Orgânico do Efluente Removido com o Lodo", unidade_comp_organico_removido_lodo: "Unidade do Componente Orgânico Removido", comentarios: "Comentários" },
        validOptions: {
            periodo: ["Anual", "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
            tratamento_ou_destino: ["Tratamento", "Destino Final"],
            tipo_tratamento: [ "Tratamento aeróbio (lodo ativado, lagoa aerada, etc)", "Fossa séptica", "Reator anaeróbio", "Lagoa anaeróbia profunda (profundidade > 2 metros)", "Lagoa anaeróbia rasa (profundidade < 2 metros)", "Lagoa facultativa (profundidade < 2 metros)", "Lagoa de maturação (profundidade < 2 metros)", "Fossas secas" ],
            tipo_destino_final: [ "Lançamento em corpos d'água (não especificado)", "Lançamento em corpos d'água (que não reservatórios, lagos e estuários)", "Lançamento em reservatórios, lagos e estuários", "Efluente parado a céu aberto", "Lançamento em reservatórios. lagos e estuários" ],
            unidade_componente_organico: [ "mgDQO/L (Demanda química de oxigênio)", "mgDBO/L (Demanda biológica de oxigênio)" ],
            unidade_comp_organico_removido_lodo: [ "mgDQO/L (Demanda química de oxigênio)", "mgDBO/L (Demanda biológica de oxigênio)" ],
            unidade_efluente_liquido: ["m3/ano", "m3/mês"]
        },
        autoFillMap: {},
        validateRow: function(rowData) {
            const errors = {};
            const isFilled = (value) => value !== null && value !== undefined && value !== '';
            if (!rowData.ano || isNaN(parseInt(rowData.ano)) || String(rowData.ano).length !== 4) errors.ano = "Deve ser um ano com 4 dígitos.";
            if (!this.validOptions.periodo.includes(rowData.periodo)) errors.periodo = "Período inválido.";
            if (!rowData.unidade_empresarial) errors.unidade_empresarial = "Obrigatório.";
            const qtdEfluenteVal = rowData.qtd_efluente_liquido_m3;
            if (isNaN(parseFloat(qtdEfluenteVal)) || parseFloat(qtdEfluenteVal) <= 0) { errors.qtd_efluente_liquido_m3 = `Entrada inválida ('${qtdEfluenteVal}'). Insira um número positivo.`; }
            const qtdCompOrgVal = rowData.qtd_componente_organico;
            if (isNaN(parseFloat(qtdCompOrgVal)) || parseFloat(qtdCompOrgVal) <= 0) { errors.qtd_componente_organico = `Entrada inválida ('${qtdCompOrgVal}'). Insira um número positivo.`; }
            const qtdNitroVal = rowData.qtd_nitrogenio_mg_l;
            if (isNaN(parseFloat(qtdNitroVal)) || parseFloat(qtdNitroVal) < 0) { errors.qtd_nitrogenio_mg_l = `Entrada inválida ('${qtdNitroVal}'). Insira um número positivo ou zero.`; }
            const compOrgRemovidoVal = rowData.componente_organico_removido_lodo;
            if (isFilled(compOrgRemovidoVal) && (isNaN(parseFloat(compOrgRemovidoVal)) || parseFloat(compOrgRemovidoVal) < 0)) { errors.componente_organico_removido_lodo = `Entrada inválida ('${compOrgRemovidoVal}'). Insira um número positivo ou zero.`; }
            if (!this.validOptions.unidade_efluente_liquido.includes(rowData.unidade_efluente_liquido)) { errors.unidade_efluente_liquido = "Unidade deve ser 'm3/ano' ou 'm3/mês'."; }
            if (!this.validOptions.unidade_componente_organico.includes(rowData.unidade_componente_organico)) errors.unidade_componente_organico = "Unidade do componente inválida.";
            if (rowData.unidade_nitrogenio !== 'kgN/m3') errors.unidade_nitrogenio = "Unidade deve ser 'kgN/m3'.";
            if (isFilled(compOrgRemovidoVal)) { if (!this.validOptions.unidade_comp_organico_removido_lodo.includes(rowData.unidade_comp_organico_removido_lodo)) errors.unidade_comp_organico_removido_lodo = "Unidade do componente removido inválida."; }
            if (rowData.unidade_comp_organico_removido_lodo && !isFilled(compOrgRemovidoVal)) { errors.componente_organico_removido_lodo = "Quantidade é obrigatória se a unidade for selecionada."; }
            if (!this.validOptions.tratamento_ou_destino.includes(rowData.tratamento_ou_destino)) { errors.tratamento_ou_destino = "Escolha entre 'Tratamento' e 'Destino Final'."; } else if (rowData.tratamento_ou_destino === 'Tratamento') {
                if (!this.validOptions.tipo_tratamento.includes(rowData.tipo_tratamento)) { errors.tipo_tratamento = "Selecione um tipo de tratamento válido."; }
                if (isFilled(rowData.tipo_destino_final)) { errors.tipo_destino_final = "Deve estar vazio quando 'Tratamento' é selecionado."; }
            } else if (rowData.tratamento_ou_destino === 'Destino Final') {
                if (!this.validOptions.tipo_destino_final.includes(rowData.tipo_destino_final)) { errors.tipo_destino_final = "Selecione um tipo de destino final válido."; }
                if (isFilled(rowData.tipo_tratamento)) { errors.tipo_tratamento = "Deve estar vazio quando 'Destino Final' é selecionado."; }
            }
            return { isValid: Object.keys(errors).length === 0, errors: errors, sanitizedData: rowData };
        }
    },
    efluentes_domesticos: {
        displayName: "Efluentes Domésticos",
        hasUnits: true,
        headerDisplayNames: { ano: "Ano", periodo: "Período", unidade_empresarial: "Unidade Empresarial", tipo_trabalhador: "Tipo de Trabalhador", num_trabalhadores: "Nº de Trabalhadores", carga_horaria_media: "Carga Horária Média (h/dia)", fossa_septica_propriedade: "Fossa séptica na propriedade?", comentarios: "Comentários" },
        validOptions: {
            periodo: ["Anual", "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
            tipo_trabalhador: ["Interno", "Terceiro"],
            fossa_septica_propriedade: ["Sim", "Não"]
        },
        autoFillMap: {},
        validateRow: function(rowData) {
            const errors = {};
            if (!rowData.ano || isNaN(parseInt(rowData.ano)) || String(rowData.ano).length !== 4) errors.ano = "Deve ser um ano com 4 dígitos.";
            if (!this.validOptions.periodo.includes(rowData.periodo)) errors.periodo = "Período inválido.";
            if (!rowData.unidade_empresarial) errors.unidade_empresarial = "Obrigatório.";
            if (!this.validOptions.tipo_trabalhador.includes(rowData.tipo_trabalhador)) { errors.tipo_trabalhador = "Selecione 'Interno' ou 'Terceiro'."; }
            const numTrabalhadoresVal = rowData.num_trabalhadores;
            const numTrabalhadores = parseInt(numTrabalhadoresVal, 10);
            if (isNaN(numTrabalhadores) || numTrabalhadores <= 0 || String(numTrabalhadoresVal).includes('.') || String(numTrabalhadoresVal).includes(',')) { 
                errors.num_trabalhadores = `Entrada inválida ('${numTrabalhadoresVal}'). Insira um número inteiro e positivo.`;
            }
            const cargaHorariaVal = rowData.carga_horaria_media;
            const cargaHoraria = parseFloat(cargaHorariaVal);
            if (isNaN(cargaHoraria) || cargaHoraria <= 0) { errors.carga_horaria_media = `Entrada inválida ('${cargaHorariaVal}'). Insira um número maior que zero.`; }
            const normalizedFossa = normalizeString(rowData.fossa_septica_propriedade);
            if (['sim', 's'].includes(normalizedFossa)) { rowData.fossa_septica_propriedade = 'Sim'; } else if (['nao', 'n'].includes(normalizedFossa)) { rowData.fossa_septica_propriedade = 'Não'; }
            if (!this.validOptions.fossa_septica_propriedade.includes(rowData.fossa_septica_propriedade)) { errors.fossa_septica_propriedade = "Deve ser 'Sim' ou 'Não'."; }
            return { isValid: Object.keys(errors).length === 0, errors: errors, sanitizedData: rowData };
        }
    },
    mudanca_uso_solo: {
        displayName: "Mudança do Uso do Solo",
        hasUnits: true,
        headerDisplayNames: { ano: "Ano", periodo: "Período", unidade_empresarial: "Unidade Organizacional", uso_solo_anterior: "Uso do Solo Anterior", bioma: "Bioma", fitofisionomia: "Fitofisionomia", tipo_area: "Tipo de Área", area_hectare: "Área (hectare)", comentarios: "Comentários" },
        validOptions: { periodo: ["Anual", "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"], uso_solo_anterior: ["Cultura anual", "Cultura de cana", "Cultura perene", "Pastagem", "Silvicultura", "Vegetação natural", "Assentamentos", "Outros usos"], bioma: ["Amazônia", "Cerrado", "Mata Atlântica", "Caatinga", "Pampa", "Pantanal"], tipo_area: ["Área de vegetação primária manejada", "Área de vegetação primária não manejada", "Área de vegetação secundária"] },
        autoFillMap: {},
        validateRow: function(rowData) {
            const errors = {};
            const isFilled = (value) => value !== null && value !== undefined && value !== '';
            if (!rowData.ano || isNaN(parseInt(rowData.ano)) || String(rowData.ano).length !== 4) errors.ano = "Deve ser um ano com 4 dígitos.";
            if (!this.validOptions.periodo.includes(rowData.periodo)) errors.periodo = "Período inválido.";
            if (!rowData.unidade_empresarial) errors.unidade_empresarial = "Obrigatório.";
            
            const areaVal = rowData.area_hectare;
            const area = parseFloat(areaVal);
            if (isNaN(area) || area <= 0) { errors.area_hectare = `Entrada inválida ('${areaVal}'). Insira um número positivo.`; }

            if (!this.validOptions.uso_solo_anterior.includes(rowData.uso_solo_anterior)) { errors.uso_solo_anterior = "Selecione uma opção válida."; }
            
            if (rowData.uso_solo_anterior === 'Vegetação natural') {
                if (!this.validOptions.bioma.includes(rowData.bioma)) { errors.bioma = "Bioma é obrigatório para Vegetação Natural."; }
                if (!rowData.fitofisionomia) { errors.fitofisionomia = "Fitofisionomia é obrigatório para Vegetação Natural."; }
                if (!this.validOptions.tipo_area.includes(rowData.tipo_area)) { errors.tipo_area = "Tipo de Área é obrigatório para Vegetação Natural."; }
            } else {
                if (isFilled(rowData.bioma)) { errors.bioma = "Deve estar vazio se o uso do solo não for 'Vegetação natural'."; }
                if (isFilled(rowData.fitofisionomia)) { errors.fitofisionomia = "Deve estar vazio se o uso do solo não for 'Vegetação natural'."; }
                if (isFilled(rowData.tipo_area)) { errors.tipo_area = "Deve estar vazio se o uso do solo não for 'Vegetação natural'."; }
            }
            return { isValid: Object.keys(errors).length === 0, errors: errors, sanitizedData: rowData };
        }
    }
};
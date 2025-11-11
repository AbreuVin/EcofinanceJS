// arquivo: shared/validators.js

export const validationSchemas = {
    combustao_movel: {
        displayName: "Combustão Móvel", // Escopo removido
        hasUnits: true,
        headerDisplayNames: {
            ano: "Ano",
            periodo: "Período",
            unidade_empresarial: "Unidade Empresarial",
            descricao_fonte: "Descrição da Fonte",
            controlado_empresa: "Controlado pela Empresa?", // Campo adicionado
            tipo_entrada: "Tipo de Entrada",
            combustivel: "Combustível",
            consumo: "Consumo",
            unidade_consumo: "Unidade de Consumo",
            distancia_percorrida: "Distância Percorrida",
            unidade_distancia: "Unidade da Distância",
            tipo_veiculo: "Tipo de Veículo",
        },
        validOptions: {
            periodo: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro", "Anual"],
            controlado_empresa: ["Sim", "Não"], // Opção adicionada
            tipo_entrada: ["consumo", "distancia"],
            combustivel: ["Óleo Diesel", "Gasolina", "Gás Natural Veicular", "Gás Liquefeito de Petróleo", "Querosene de Aviação", "Gasolina de Aviação", "Lubrificantes", "Óleo combustível residual", "Etanol", "Biodiesel"],
            unidade_consumo: ["Litros", "m³", "kg"],
            unidade_distancia: ["Km", "Milhas"],
            tipo_veiculo: [ "Automóvel a gasolina", "Automóvel a etanol", "Automóvel flex a gasolina", "Automóvel flex a etanol", "Motocicleta a gasolina", "Motocicleta flex a gasolina", "Motocicleta flex a etanol", "Veículo comercial leve a gasolina", "Veículo comercial leve a etanol", "Veículo comercial leve flex a gasolina", "Veículo comercial leve flex a etanol", "Veículo comercial leve a diesel", "Micro-ônibus a diesel", "Ônibus rodoviário a diesel", "Ônibus urbano a diesel", "Caminhão - rígido (3,5 a 7,5 toneladas)", "Caminhão - rígido (7,5 a 17 toneladas)", "Caminhão - rígido (acima de 17 toneladas)", "Caminhão - rígido (média)", "Caminhão - articulado (3,5 a 33 toneladas)", "Caminhão - articulado (acima de 33 toneladas)", "Caminhão - articulado (média)", "Caminhão - caminhão (média)", "Caminhão refrigerado - rígido (3,5 a 7,5 toneladas)", "Caminhão refrigerado - rígido (7,5 a 17 toneladas)", "Caminhão refrigerado - rígido (acima de 17 toneladas)", "Caminhão refrigerado - rígido (média)", "Caminhão refrigerado - articulado (3,5 a 33 toneladas)", "Caminhão refrigerado - articulado (acima de 33 toneladas)", "Caminhão refrigerado - articulado (média)", "Caminhão refrigerado - caminhão (média)", "Automóvel a GNV" ]
        },
        autoFillMap: {
            combustivel: {
                targetColumn: "unidade_consumo",
                map: { "Óleo Diesel": "Litros", "Gasolina": "Litros", "Gás Natural Veicular": "m³", "Gás Liquefeito de Petróleo": "kg", "Querosene de Aviação": "Litros", "Gasolina de Aviação": "Litros", "Lubrificantes": "Litros", "Óleo combustível residual": "Litros", "Etanol": "Litros", "Biodiesel": "Litros" }
            }
        },
        validateRow: function(rowData) {
            const errors = {};
            if (!rowData.ano || isNaN(parseInt(rowData.ano)) || String(rowData.ano).length !== 4) errors.ano = "Deve ser um ano com 4 dígitos.";
            if (!this.validOptions.periodo.includes(rowData.periodo)) errors.periodo = `Período inválido.`;
            if (!rowData.descricao_fonte) errors.descricao_fonte = "Obrigatório.";
            if (!this.validOptions.controlado_empresa.includes(rowData.controlado_empresa)) errors.controlado_empresa = "Deve ser 'Sim' ou 'Não'."; // Validação adicionada
            if (!this.validOptions.tipo_entrada.includes(rowData.tipo_entrada)) errors.tipo_entrada = "Deve ser 'consumo' ou 'distancia'.";
            if (rowData.tipo_entrada === 'consumo') {
                if (!this.validOptions.combustivel.includes(rowData.combustivel)) errors.combustivel = "Combustível inválido.";
                if (rowData.consumo === '' || isNaN(parseFloat(rowData.consumo))) errors.consumo = "Deve ser um número."; // Validação mantida simples
                if (this.autoFillMap.combustivel.map[rowData.combustivel] !== rowData.unidade_consumo) errors.unidade_consumo = `Unidade incorreta para o combustível.`;
            } else if (rowData.tipo_entrada === 'distancia') {
                if (rowData.distancia_percorrida === '' || isNaN(parseFloat(rowData.distancia_percorrida))) errors.distancia_percorrida = "Deve ser um número."; // Validação mantida simples
                if (!this.validOptions.unidade_distancia.includes(rowData.unidade_distancia)) errors.unidade_distancia = "Deve ser 'Km' ou 'Milhas'.";
                if (!this.validOptions.tipo_veiculo.includes(rowData.tipo_veiculo)) errors.tipo_veiculo = "Tipo de veículo inválido.";
            }
            return { isValid: Object.keys(errors).length === 0, errors: errors };
        }
    },
    combustao_estacionaria: {
        displayName: "Combustão Estacionária", // Escopo removido
        hasUnits: true,
        headerDisplayNames: {
            ano: "Ano",
            periodo: "Período",
            unidade_empresarial: "Unidade Empresarial",
            descricao_da_fonte: "Descrição da Fonte",
            combustivel: "Combustível",
            consumo: "Consumo",
            unidade: "Unidade",
            controlado_empresa: "Controlado pela Empresa?", // Campo adicionado
        },
        validOptions: {
            periodo: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro", "Anual"],
            combustivel: ["Gás Natural", "Óleo Diesel", "Gás Liquefeito de Petróleo", "Carvão Mineral", "Lenha", "Biogás"],
            unidade: ["m³", "Litros", "kg", "toneladas"],
            controlado_empresa: ["Sim", "Não"], // Opção adicionada
        },
        autoFillMap: {
            combustivel: {
                targetColumn: "unidade",
                map: { "Gás Natural": "m³", "Óleo Diesel": "Litros", "Gás Liquefeito de Petróleo": "kg", "Carvão Mineral": "toneladas", "Lenha": "toneladas", "Biogás": "m³" }
            }
        },
        validateRow: function(rowData) {
            const errors = {};
            if (!rowData.ano || isNaN(parseInt(rowData.ano)) || String(rowData.ano).length !== 4) errors.ano = "Deve ser um ano com 4 dígitos.";
            if (!this.validOptions.periodo.includes(rowData.periodo)) errors.periodo = "Período inválido.";
            if (!rowData.descricao_da_fonte) errors.descricao_da_fonte = "Obrigatório.";
            if (!this.validOptions.combustivel.includes(rowData.combustivel)) errors.combustivel = "Combustível inválido.";
            if (rowData.consumo === '' || isNaN(parseFloat(rowData.consumo))) errors.consumo = "Deve ser um número."; // Validação mantida simples
            if (this.autoFillMap.combustivel.map[rowData.combustivel] !== rowData.unidade) errors.unidade = `Unidade incorreta para o combustível.`;
            if (!this.validOptions.controlado_empresa.includes(rowData.controlado_empresa)) errors.controlado_empresa = "Deve ser 'Sim' ou 'Não'."; // Validação adicionada
            return { isValid: Object.keys(errors).length === 0, errors: errors };
        }
    },
    dados_producao_venda: {
        displayName: "Dados de Produção e Venda", // Escopo removido
        hasUnits: true,
        headerDisplayNames: {
            ano: "Ano",
            periodo: "Período",
            unidade_empresarial: "Unidade Empresarial",
            produto: "Produto",
            quantidade_vendida: "Quantidade Vendida",
            unidade_medida: "Unidade de Medida",
            uso_final_produtos: "Uso Final dos Produtos",
            rastreabilidade: "Rastreabilidade",
            comentarios: "Comentários"
        },
        validOptions: {
            periodo: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro", "Anual"],
        },
        autoFillMap: {},
        validateRow: function(rowData) {
            const errors = {};
            if (!rowData.ano || isNaN(parseInt(rowData.ano)) || String(rowData.ano).length !== 4) errors.ano = "Deve ser um ano com 4 dígitos.";
            if (!this.validOptions.periodo.includes(rowData.periodo)) errors.periodo = "Período inválido.";
            if (!rowData.unidade_empresarial) errors.unidade_empresarial = "Obrigatório.";
            if (!rowData.produto) errors.produto = "Obrigatório.";
            if (!rowData.unidade_medida) errors.unidade_medida = "Obrigatório.";
            if (!rowData.uso_final_produtos) errors.uso_final_produtos = "Obrigatório.";
            if (!rowData.rastreabilidade) errors.rastreabilidade = "Obrigatório.";
            const quantidade = parseInt(rowData.quantidade_vendida, 10);
            if (isNaN(quantidade) || quantidade <= 0 || String(rowData.quantidade_vendida).includes('.') || String(rowData.quantidade_vendida).includes(',')) {
                errors.quantidade_vendida = "Deve ser um número inteiro e positivo.";
            }
            return { isValid: Object.keys(errors).length === 0, errors: errors };
        }
    },
    ippu_lubrificantes: {
        displayName: "IPPU - Lubrificantes", // Escopo removido
        hasUnits: true,
        headerDisplayNames: {
            ano: "Ano",
            periodo: "Período",
            unidade_empresarial: "Unidade Empresarial",
            fonte_emissao: "Fonte de Emissão / Equipamento",
            tipo_lubrificante: "Tipo de Lubrificante",
            consumo: "Consumo",
            unidade: "Unidade",
            utilizacao: "Utilização do Lubrificante",
            controlado_empresa: "Controlado pela Empresa?",
        },
        validOptions: {
            periodo: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro", "Anual"],
            tipo_lubrificante: ["Lubrificante", "Graxa"],
            unidade: ["Litros", "kg"],
            controlado_empresa: ["Sim", "Não"]
        },
        autoFillMap: {},
        validateRow: function(rowData) {
            const errors = {};
            if (!rowData.ano || isNaN(parseInt(rowData.ano)) || String(rowData.ano).length !== 4) errors.ano = "Deve ser um ano com 4 dígitos.";
            if (!this.validOptions.periodo.includes(rowData.periodo)) errors.periodo = "Período inválido.";
            if (!rowData.fonte_emissao) errors.fonte_emissao = "Obrigatório.";
            if (!this.validOptions.tipo_lubrificante.includes(rowData.tipo_lubrificante)) errors.tipo_lubrificante = "Tipo inválido.";
            if (rowData.consumo === '' || isNaN(parseFloat(rowData.consumo)) || parseFloat(rowData.consumo) <= 0) errors.consumo = "Deve ser um número positivo.";
            if (!this.validOptions.unidade.includes(rowData.unidade)) errors.unidade = "Unidade inválida.";
            if (!rowData.utilizacao) errors.utilizacao = "Obrigatório.";
            if (!this.validOptions.controlado_empresa.includes(rowData.controlado_empresa)) errors.controlado_empresa = "Deve ser 'Sim' ou 'Não'.";
            return { isValid: Object.keys(errors).length === 0, errors: errors };
        }
    },
    emissoes_fugitivas: {
        displayName: "Emissões Fugitivas",
        hasUnits: true,
        headerDisplayNames: {
            ano: "Ano",
            periodo: "Período",
            unidade_empresarial: "Unidade Empresarial",
            fonte_emissao: "Fonte de Emissão / Equipamento",
            tipo_gas: "Tipo de Gás",
            quantidade_reposta: "Quantidade Reposta",
            unidade: "Unidade",
            controlado_empresa: "Controlado pela Empresa?",
            nome_comercial_gas: "Nome Comercial (Gás Composto)",
            gas_emissor_composicao: "Gás Emissor (na Composição)",
            percentual_emissao: "Percentual (%) na Composição",
            rastreabilidade: "Rastreabilidade",
            comentarios: "Comentários"
        },
        gasList: ["Dióxido de carbono (CO2)", "Metano (CH4)", "Óxido nitroso (N2O)", "HFC-23", "HFC-32", "HFC-41", "HFC-125", "HFC-134", "HFC-134a", "HFC-143", "HFC-143a", "HFC-152", "HFC-152a", "HFC-161", "HFC-227ea", "HFC-236cb", "HFC-236ea", "HFC-236fa", "HFC-245ca", "HFC-245fa", "HFC-365mfc", "HFC-43-10mee", "Hexafluoreto de enxofre (SF6)", "Trifluoreto de nitrogênio (NF3)", "PFC-14", "PFC-116", "PFC-218", "PFC-318", "PFC-3-1-10", "PFC-4-1-12", "PFC-5-1-14", "PFC-9-1-18", "Trifluorometil pentafluoreto de enxofre (SF5CF3)", "Perfluorociclopropano (c-C3F6)", "R-400", "R-401A", "R-401B", "R-401C", "R-402A", "R-402B", "R-403A", "R-403B", "R-404A", "R-405A", "R-406A", "R-407A", "R-407B", "R-407C", "R-407D", "R-407E", "R-407F", "R-407G", "R-407H", "R-407I", "R-408A", "R-409A", "R-409B", "R-410A", "R-410B", "R-411A", "R-411B", "R-412A", "R-413A", "R-414A", "R-414B", "R-415A", "R-415B", "R-416A", "R-417A", "R-417B", "R-417C", "R-418A", "R-419A", "R-419B", "R-420A", "R-421A", "R-421B", "R-422A", "R-422B", "R-422C", "R-422D", "R-422E", "R-423A", "R-424A", "R-425A", "R-426A", "R-427A", "R-428A", "R-429A", "R-430A", "R-431A", "R-432A", "R-433A", "R-433B", "R-433C", "R-434A", "R-435A", "R-436A", "R-436B", "R-436C", "R-437A", "R-438A", "R-439A", "R-440A", "R-441A", "R-442A", "R-443A", "R-444A", "R-444B", "R-445A", "R-446A", "R-447A", "R-447B", "R-448A", "R-449A", "R-449B", "R-449C", "R-500", "R-501", "R-502", "R-503", "R-504", "R-505", "R-506", "R-507 ou R-507A", "R-508A", "R-508B", "R-509 ou R-509A", "R-510A", "R-511A", "R-512A", "R-513A", "R-513B", "R-514A", "R-515A", "R-516A", "CFC-11", "CFC-12", "CFC-13", "CFC-113", "CFC-114", "CFC-115", "Halon-1301", "Halon-1211", "Halon-2402", "Tetracloreto de carbono (CCl4)", "Bromometano (CH3Br)", "Methyl chloroform (CH3CCl3)", "HCFC-21", "HCFC-22 (R22)", "HCFC-123", "HCFC-124", "HCFC-141b", "HCFC-142b", "HCFC-225ca", "HCFC-225cb"],
        get validOptions() {
            return {
                periodo: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro", "Anual"],
                tipo_gas: this.gasList,
                gas_emissor_composicao: this.gasList,
                controlado_empresa: ["Sim", "Não"],
                unidade: ["kg"]
            };
        },
        autoFillMap: {},
        validateRow: function(rowData, optionsCache) {
            const errors = {};
            const validOptions = {
                ...this.validOptions,
                tipo_gas: optionsCache?.tipo_gas || this.validOptions.tipo_gas,
                gas_emissor_composicao: optionsCache?.tipo_gas || this.validOptions.gas_emissor_composicao,
            };
            if (!rowData.ano || isNaN(parseInt(rowData.ano)) || String(rowData.ano).length !== 4) errors.ano = "Deve ser um ano com 4 dígitos.";
            if (!validOptions.periodo.includes(rowData.periodo)) errors.periodo = "Período inválido.";
            if (!rowData.unidade_empresarial) errors.unidade_empresarial = "Obrigatório.";
            if (!rowData.fonte_emissao) errors.fonte_emissao = "Obrigatório.";
            if (!validOptions.controlado_empresa.includes(rowData.controlado_empresa)) errors.controlado_empresa = "Deve ser 'Sim' ou 'Não'.";
            const quantidade = parseFloat(rowData.quantidade_reposta);
            if (isNaN(quantidade) || quantidade <= 0) errors.quantidade_reposta = "Deve ser um número positivo.";
            if (!validOptions.unidade.includes(rowData.unidade)) errors.unidade = "Unidade deve ser 'kg'.";
            const isCompositionStarted = rowData.nome_comercial_gas || rowData.gas_emissor_composicao || rowData.percentual_emissao;
            if (isCompositionStarted) {
                if (!rowData.nome_comercial_gas) errors.nome_comercial_gas = "Obrigatório se preencher composição.";
                if (!validOptions.gas_emissor_composicao.includes(rowData.gas_emissor_composicao)) errors.gas_emissor_composicao = "Obrigatório selecionar um gás da lista.";
                const percentual = parseFloat(rowData.percentual_emissao);
                if (isNaN(percentual) || percentual <= 0 || percentual > 100) {
                    errors.percentual_emissao = "Deve ser um número entre 0 e 100.";
                }
            } else {
                if (!validOptions.tipo_gas.includes(rowData.tipo_gas)) errors.tipo_gas = "Obrigatório selecionar um gás da lista.";
            }
            if (!rowData.rastreabilidade) errors.rastreabilidade = "Obrigatório.";
            return { isValid: Object.keys(errors).length === 0, errors: errors };
        }
    },
    fertilizantes: {
        displayName: "Fertilizantes", // Escopo removido
        hasUnits: true,
        headerDisplayNames: {
            ano: "Ano",
            periodo: "Período",
            unidade_empresarial: "Unidade Empresarial",
            especificacoes_insumo: "Especificações do Insumo",
            tipo_fertilizante: "Tipo de Fertilizante",
            quantidade_kg: "Quantidade de Fertilizante (kg)",
            unidade: "Unidade",
            percentual_nitrogenio: "Percentual de Nitrogênio (%)",
            percentual_carbonato: "Percentual de Carbonato (%)",
            controlado_empresa: "Controlado pela Empresa?",
            rastreabilidade: "Rastreabilidade",
            comentarios: "Comentários"
        },
        validOptions: {
            periodo: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro", "Anual"],
            controlado_empresa: ["Sim", "Não"]
        },
        autoFillMap: {},
        validateRow: function(rowData) {
            const errors = {};
            if (!rowData.ano || isNaN(parseInt(rowData.ano)) || String(rowData.ano).length !== 4) errors.ano = "Deve ser um ano com 4 dígitos.";
            if (!this.validOptions.periodo.includes(rowData.periodo)) errors.periodo = "Período inválido.";
            if (!rowData.unidade_empresarial) errors.unidade_empresarial = "Obrigatório.";
            if (!rowData.especificacoes_insumo) errors.especificacoes_insumo = "Obrigatório.";
            if (!rowData.tipo_fertilizante) errors.tipo_fertilizante = "Obrigatório.";
            const quantidade = parseFloat(rowData.quantidade_kg);
            if (isNaN(quantidade) || quantidade <= 0) errors.quantidade_kg = "Deve ser um número positivo.";
            if (rowData.unidade !== 'kg') errors.unidade = "Unidade deve ser 'kg'.";
            const percN = parseFloat(rowData.percentual_nitrogenio);
            if (isNaN(percN) || percN < 0 || percN > 100) errors.percentual_nitrogenio = "Deve ser um número obrigatório entre 0 e 100.";
            const percC = parseFloat(rowData.percentual_carbonato);
            if (isNaN(percC) || percC < 0 || percC > 100) errors.percentual_carbonato = "Deve ser um número obrigatório entre 0 e 100.";
            if (!this.validOptions.controlado_empresa.includes(rowData.controlado_empresa)) errors.controlado_empresa = "Deve ser 'Sim' ou 'Não'.";
            if (!rowData.rastreabilidade) errors.rastreabilidade = "Obrigatório.";
            return { isValid: Object.keys(errors).length === 0, errors: errors };
        }
    },
    efluentes_controlados: {
        displayName: "Efluentes Controlados",
        hasUnits: true,
        headerDisplayNames: {
            ano: "Ano",
            periodo: "Período",
            unidade_empresarial: "Unidade Empresarial",
            tratamento_ou_destino: "Tratamento ou Destino Final?",
            tipo_tratamento: "Tipo de Tratamento",
            tipo_destino_final: "Tipo de Destino Final",
            qtd_efluente_liquido_m3: "Quantidade de Efluente Líquido Gerado",
            unidade_efluente_liquido: "Unidade do Efluente Líquido",
            qtd_componente_organico: "Quantidade de Componente Orgânico Degradável do Efluente",
            unidade_componente_organico: "Unidade do Componente Orgânico",
            qtd_nitrogenio_mg_l: "Quantidade de Nitrogênio no Efluente Gerado",
            unidade_nitrogenio: "Unidade do Nitrogênio",
            componente_organico_removido_lodo: "Componente Orgânico do Efluente Removido com o Lodo",
            unidade_comp_organico_removido_lodo: "Unidade do Componente Orgânico Removido",
            rastreabilidade: "Rastreabilidade Interna",
            comentarios: "Comentários"
        },
        validOptions: {
            periodo: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro", "Anual"],
            tratamento_ou_destino: ["Tratamento", "Destino Final"],
            tipo_tratamento: ["Tratamento aeróbio (lodo ativado, lagoa aerada, etc)", "Fossa séptica", "Reator anaeróbio", "Lagoa anaeróbia profunda (profundidade > 2 metros)", "Lagoa anaeróbia rasa (profundidade < 2 metros)", "Lagoa facultativa (profundidade < 2 metros)", "Lagoa de maturação (profundidade < 2 metros)", "Fossas secas"],
            tipo_destino_final: ["Lançamento em corpos d'água (não especificado)", "Lançamento em corpos d'água (que não reservatórios, lagos e estuários)", "Lançamento em reservatórios, lagos e estuários", "Efluente parado a céu aberto"],
            unidade_componente_organico: ["mgDQO/L (Demanda química de oxigênio)", "mgDBO/L (Demanda biológica de oxigênio)"],
            unidade_comp_organico_removido_lodo: ["mgDQO/L (Demanda química de oxigênio)", "mgDBO/L (Demanda biológica de oxigênio)"]
        },
        autoFillMap: {},
        validateRow: function(rowData) {
            const errors = {};
            if (!rowData.ano || isNaN(parseInt(rowData.ano)) || String(rowData.ano).length !== 4) errors.ano = "Deve ser um ano com 4 dígitos.";
            if (!this.validOptions.periodo.includes(rowData.periodo)) errors.periodo = "Período inválido.";
            if (!rowData.unidade_empresarial) errors.unidade_empresarial = "Obrigatório.";
            if (isNaN(parseFloat(rowData.qtd_efluente_liquido_m3)) || parseFloat(rowData.qtd_efluente_liquido_m3) <= 0) errors.qtd_efluente_liquido_m3 = "Deve ser um número positivo.";
            if (rowData.unidade_efluente_liquido !== 'm3/ano') errors.unidade_efluente_liquido = "Unidade deve ser 'm3/ano'.";
            if (isNaN(parseFloat(rowData.qtd_componente_organico)) || parseFloat(rowData.qtd_componente_organico) <= 0) errors.qtd_componente_organico = "Deve ser um número positivo.";
            if (!this.validOptions.unidade_componente_organico.includes(rowData.unidade_componente_organico)) errors.unidade_componente_organico = "Unidade do componente inválida.";
            if (isNaN(parseFloat(rowData.qtd_nitrogenio_mg_l)) || parseFloat(rowData.qtd_nitrogenio_mg_l) <= 0) errors.qtd_nitrogenio_mg_l = "Deve ser um número positivo.";
            if (rowData.unidade_nitrogenio !== 'mg/L') errors.unidade_nitrogenio = "Unidade deve ser 'mg/L'.";
            if (rowData.componente_organico_removido_lodo) {
                if (isNaN(parseFloat(rowData.componente_organico_removido_lodo)) || parseFloat(rowData.componente_organico_removido_lodo) < 0) errors.componente_organico_removido_lodo = "Deve ser um número positivo ou zero.";
                if (!this.validOptions.unidade_comp_organico_removido_lodo.includes(rowData.unidade_comp_organico_removido_lodo)) errors.unidade_comp_organico_removido_lodo = "Unidade do componente removido inválida.";
            }
            if (rowData.unidade_comp_organico_removido_lodo && !rowData.componente_organico_removido_lodo) {
                 errors.componente_organico_removido_lodo = "Quantidade é obrigatória se a unidade for selecionada.";
            }
            if (!this.validOptions.tratamento_ou_destino.includes(rowData.tratamento_ou_destino)) {
                errors.tratamento_ou_destino = "Escolha entre 'Tratamento' e 'Destino Final'.";
            } else if (rowData.tratamento_ou_destino === 'Tratamento') {
                if (!this.validOptions.tipo_tratamento.includes(rowData.tipo_tratamento)) {
                    errors.tipo_tratamento = "Selecione um tipo de tratamento válido.";
                }
            } else if (rowData.tratamento_ou_destino === 'Destino Final') {
                if (!this.validOptions.tipo_destino_final.includes(rowData.tipo_destino_final)) {
                    errors.tipo_destino_final = "Selecione um tipo de destino final válido.";
                }
            }
            if (!rowData.rastreabilidade) errors.rastreabilidade = "Obrigatório.";
            return { isValid: Object.keys(errors).length === 0, errors: errors };
        }
    },
    efluentes_domesticos: {
        displayName: "Efluentes Domésticos",
        hasUnits: true,
        headerDisplayNames: {
            ano: "Ano",
            periodo: "Período",
            unidade_empresarial: "Unidade Empresarial",
            num_medio_colaboradores: "Nº Médio Mensal de Colaboradores",
            carga_horaria_media_colaboradores: "Carga Horária Média de Trabalho dos Colaboradores",
            num_medio_terceiros: "Nº Médio Mensal de Terceiros",
            carga_horaria_media_terceiros: "Carga Horária Média de Trabalho dos Terceiros",
            fossa_septica_propriedade: "Fossa séptica na propriedade da empresa?",
            rastreabilidade: "Rastreabilidade Interna",
            comentarios: "Comentários"
        },
        validOptions: {
            periodo: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro", "Anual"],
            fossa_septica_propriedade: ["Sim", "Não"]
        },
        autoFillMap: {},
        validateRow: function(rowData) {
            const errors = {};
            
            if (!rowData.ano || isNaN(parseInt(rowData.ano)) || String(rowData.ano).length !== 4) errors.ano = "Deve ser um ano com 4 dígitos.";
            if (!this.validOptions.periodo.includes(rowData.periodo)) errors.periodo = "Período inválido.";
            if (!rowData.unidade_empresarial) errors.unidade_empresarial = "Obrigatório.";

            const numColaboradores = parseInt(rowData.num_medio_colaboradores, 10);
            if (isNaN(numColaboradores) || numColaboradores < 0 || String(rowData.num_medio_colaboradores).includes('.') || String(rowData.num_medio_colaboradores).includes(',')) {
                errors.num_medio_colaboradores = "Deve ser um número inteiro e positivo.";
            }
            const numTerceiros = parseInt(rowData.num_medio_terceiros, 10);
            if (isNaN(numTerceiros) || numTerceiros < 0 || String(rowData.num_medio_terceiros).includes('.') || String(rowData.num_medio_terceiros).includes(',')) {
                errors.num_medio_terceiros = "Deve ser um número inteiro e positivo.";
            }

            const cargaColaboradores = parseFloat(rowData.carga_horaria_media_colaboradores);
            if (isNaN(cargaColaboradores) || cargaColaboradores < 0) {
                errors.carga_horaria_media_colaboradores = "Deve ser um número positivo.";
            }
             const cargaTerceiros = parseFloat(rowData.carga_horaria_media_terceiros);
            if (isNaN(cargaTerceiros) || cargaTerceiros < 0) {
                errors.carga_horaria_media_terceiros = "Deve ser um número positivo.";
            }

            if (!this.validOptions.fossa_septica_propriedade.includes(rowData.fossa_septica_propriedade)) {
                errors.fossa_septica_propriedade = "Escolha 'Sim' ou 'Não'.";
            }
            
            if (!rowData.rastreabilidade) errors.rastreabilidade = "Obrigatório.";

            return { isValid: Object.keys(errors).length === 0, errors: errors };
        }
    },
    // --- ATENÇÃO: NOVO SCHEMA ADICIONADO AQUI ---
    mudanca_uso_solo: {
        displayName: "Mudança do Uso do Solo",
        hasUnits: true,
        headerDisplayNames: {
            ano: "Ano",
            periodo: "Período",
            unidade_empresarial: "Unidade Organizacional",
            uso_solo_anterior: "Uso do Solo Anterior",
            bioma: "Bioma",
            fitofisionomia: "Fitofisionomia",
            tipo_area: "Tipo de Área",
            area_hectare: "Área (hectare)",
            rastreabilidade: "Rastreabilidade Interna",
            comentarios: "Comentários"
        },
        validOptions: {
            periodo: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro", "Anual"],
            uso_solo_anterior: ["Cultura anual", "Cultura de cana", "Cultura perene", "Pastagem", "Silvicultura", "Vegetação natural", "Assentamentos", "Outros usos"],
            bioma: ["Amazônia", "Cerrado", "Mata Atlântica", "Caatinga", "Pampa", "Pantanal"],
            tipo_area: ["Área de vegetação primária manejada", "Área de vegetação primária não manejada", "Área de vegetação secundária"]
        },
        autoFillMap: {},
        validateRow: function(rowData) {
            const errors = {};
            
            // Validações Gerais
            if (!rowData.ano || isNaN(parseInt(rowData.ano)) || String(rowData.ano).length !== 4) errors.ano = "Deve ser um ano com 4 dígitos.";
            if (!this.validOptions.periodo.includes(rowData.periodo)) errors.periodo = "Período inválido.";
            if (!rowData.unidade_empresarial) errors.unidade_empresarial = "Obrigatório.";

            // Validações de Campos Principais
            const area = parseFloat(rowData.area_hectare);
            if (isNaN(area) || area <= 0) {
                errors.area_hectare = "Deve ser um número positivo.";
            }
            if (!this.validOptions.uso_solo_anterior.includes(rowData.uso_solo_anterior)) {
                errors.uso_solo_anterior = "Selecione uma opção válida.";
            }
            
            // Lógica Condicional
            if (rowData.uso_solo_anterior === 'Vegetação natural') {
                if (!this.validOptions.bioma.includes(rowData.bioma)) {
                    errors.bioma = "Bioma é obrigatório para Vegetação Natural.";
                }
                if (!rowData.fitofisionomia) { // texto livre, basta verificar se não está vazio
                    errors.fitofisionomia = "Fitofisionomia é obrigatório para Vegetação Natural.";
                }
                if (!this.validOptions.tipo_area.includes(rowData.tipo_area)) {
                    errors.tipo_area = "Tipo de Área é obrigatório para Vegetação Natural.";
                }
            }
            
            if (!rowData.rastreabilidade) errors.rastreabilidade = "Obrigatório.";

            return { isValid: Object.keys(errors).length === 0, errors: errors };
        }
    }
    
};
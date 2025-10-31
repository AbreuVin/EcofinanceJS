// arquivo: shared/validators.js

export const validationSchemas = {
    combustao_movel: {
        displayName: "Combustão Móvel (E1)",
        hasUnits: true,
        headerDisplayNames: {
            ano: "Ano",
            periodo: "Período",
            unidade_empresarial: "Unidade Empresarial",
            descricao_fonte: "Descrição da Fonte",
            controlado_empresa: "Controlado pela Empresa?",
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
            controlado_empresa: ["Sim", "Não"],
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
            if (!this.validOptions.controlado_empresa.includes(rowData.controlado_empresa)) errors.controlado_empresa = "Deve ser 'Sim' ou 'Não'.";
            if (!this.validOptions.tipo_entrada.includes(rowData.tipo_entrada)) errors.tipo_entrada = "Deve ser 'consumo' ou 'distancia'.";
            if (rowData.tipo_entrada === 'consumo') {
                if (!this.validOptions.combustivel.includes(rowData.combustivel)) errors.combustivel = "Combustível inválido.";
                if (rowData.consumo === '' || isNaN(parseFloat(String(rowData.consumo)))) errors.consumo = "Deve ser um número.";
                if (this.autoFillMap.combustivel.map[rowData.combustivel] !== rowData.unidade_consumo) errors.unidade_consumo = `Unidade incorreta para o combustível.`;
            } else if (rowData.tipo_entrada === 'distancia') {
                if (rowData.distancia_percorrida === '' || isNaN(parseFloat(String(rowData.distancia_percorrida)))) errors.distancia_percorrida = "Deve ser um número.";
                if (!this.validOptions.unidade_distancia.includes(rowData.unidade_distancia)) errors.unidade_distancia = "Deve ser 'Km' ou 'Milhas'.";
                if (!this.validOptions.tipo_veiculo.includes(rowData.tipo_veiculo)) errors.tipo_veiculo = "Tipo de veículo inválido.";
            }
            return { isValid: Object.keys(errors).length === 0, errors: errors };
        }
    },
    combustao_estacionaria: {
        displayName: "Combustão Estacionária (E1)",
        hasUnits: true,
        headerDisplayNames: {
            ano: "Ano",
            periodo: "Período",
            unidade_empresarial: "Unidade Empresarial",
            descricao_da_fonte: "Descrição da Fonte",
            combustivel: "Combustível",
            consumo: "Consumo",
            unidade: "Unidade",
        },
        validOptions: {
            periodo: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro", "Anual"],
            combustivel: ["Gás Natural", "Óleo Diesel", "Gás Liquefeito de Petróleo", "Carvão Mineral", "Lenha", "Biogás"],
            unidade: ["m³", "Litros", "kg", "toneladas"]
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
            if (rowData.consumo === '' || isNaN(parseFloat(String(rowData.consumo)))) errors.consumo = "Deve ser um número.";
            if (this.autoFillMap.combustivel.map[rowData.combustivel] !== rowData.unidade) errors.unidade = `Unidade incorreta para o combustível.`;
            return { isValid: Object.keys(errors).length === 0, errors: errors };
        }
    },
    dados_producao_venda: {
        displayName: "Produção e Venda (E3)",
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
            const ano = parseInt(rowData.ano, 10);
            if (!ano || !Number.isInteger(ano) || String(rowData.ano).length !== 4) errors.ano = "Deve ser um ano com 4 dígitos.";
            if (!this.validOptions.periodo.includes(rowData.periodo)) errors.periodo = "Período inválido.";
            if (!rowData.unidade_empresarial) errors.unidade_empresarial = "Obrigatório.";
            if (!rowData.produto) errors.produto = "Obrigatório.";
            if (!rowData.unidade_medida) errors.unidade_medida = "Obrigatório.";
            if (!rowData.uso_final_produtos) errors.uso_final_produtos = "Obrigatório.";
            if (!rowData.rastreabilidade) errors.rastreabilidade = "Obrigatório.";
            const quantidade = parseInt(String(rowData.quantidade_vendida), 10);
            if (isNaN(quantidade) || quantidade <= 0 || String(rowData.quantidade_vendida).includes('.') || String(rowData.quantidade_vendida).includes(',')) {
                errors.quantidade_vendida = "Deve ser um número inteiro e positivo.";
            }
            return { isValid: Object.keys(errors).length === 0, errors: errors };
        }
    },
    ippu_lubrificantes: {
        displayName: "IPPU - Lubrificantes (E3)",
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
            if (rowData.consumo === '' || isNaN(parseFloat(String(rowData.consumo))) || parseFloat(String(rowData.consumo)) <= 0) errors.consumo = "Deve ser um número positivo.";
            if (!this.validOptions.unidade.includes(rowData.unidade)) errors.unidade = "Unidade inválida.";
            if (!rowData.utilizacao) errors.utilizacao = "Obrigatório.";
            if (!this.validOptions.controlado_empresa.includes(rowData.controlado_empresa)) errors.controlado_empresa = "Deve ser 'Sim' ou 'Não'.";
            return { isValid: Object.keys(errors).length === 0, errors: errors };
        }
    },
    emissoes_fugitivas: {
        displayName: "Emissões Fugitivas (E1)",
        hasUnits: true,
        headerDisplayNames: {
            ano: "Ano",
            periodo: "Período",
            unidade_empresarial: "Unidade Empresarial",
            fonte_emissao: "Fonte de Emissão / Equipamento",
            tipo_gas: "Tipo de Gás",
            quantidade_reposta: "Quantidade Reposta",
            unidade: "Unidade",
            nome_comercial_gas: "Nome Comercial (Gás Composto)",
            gas_emissor_composicao: "Gás Emissor (na Composição)",
            percentual_emissao: "Percentual (%) na Composição",
            rastreabilidade: "Rastreabilidade",
            comentarios: "Comentários"
        },
        gasList: ["Dióxido de carbono (CO2)", "Metano (CH4)", "Óxido nitroso (N2O)", "HFC-23", "HFC-32", "HFC-41", "HFC-125", "HFC-134", "HFC-134a", "HFC-143", "HFC-143a", "HFC-152", "HFC-152a", "HFC-161", "HFC-227ea", "HFC-236cb", "HFC-236ea", "HFC-236fa", "HFC-245ca", "HFC-245fa", "HFC-365mfc", "HFC-43-10mee", "Hexafluoreto de enxofre (SF6)", "Trifluoreto de nitrogênio (NF3)", "PFC-14", "PFC-116", "PFC-218", "PFC-318", "PFC-3-1-10", "PFC-4-1-12", "PFC-5-1-14", "PFC-9-1-18", "Trifluorometil pentafluoreto de enxofre (SF5CF3)", "Perfluorociclopropano (c-C3F6)", "R-400", "R-401A", "R-401B", "R-401C", "R-402A", "R-402B", "R-403A", "R-403B", "R-404A", "R-405A", "R-406A", "R-407A", "R-407B", "R-407C", "R-407D", "R-407E", "R-407F", "R-407G", "R-407H", "R-407I", "R-408A", "R-409A", "R-409B", "R-410A", "R-410B", "R-411A", "R-411B", "R-412A", "R-413A", "R-414A", "R-414B", "R-415A", "R-415B", "R-416A", "R-417A", "R-417B", "R-417C", "R-418A", "R-419A", "R-419B", "R-420A", "R-421A", "R-421B", "R-422A", "R-422B", "R-422C", "R-422D", "R-422E", "R-423A", "R-424A", "R-425A", "R-426A", "R-427A", "R-428A", "R-429A", "R-430A", "R-431A", "R-432A", "R-433A", "R-433B", "R-433C", "R-434A", "R-435A", "R-436A", "R-436B", "R-436C", "R-437A", "R-438A", "R-439A", "R-440A", "R-441A", "R-442A", "R-443A", "R-444A", "R-444B", "R-445A", "R-446A", "R-447A", "R-447B", "R-448A", "R-449A", "R-449B", "R-449C", "R-450A", "R-451A", "R-451B", "R-452A", "R-452B", "R-452C", "R-453A", "R-454A", "R-454B", "R-454C", "R-455A", "R-456A", "R-457A", "R-458A", "R-459A", "R-459B", "R-460A", "R-460B", "R-460C", "R-461A", "R-462A", "R-463A", "R-464A", "R-465A", "R-500", "R-501", "R-502", "R-503", "R-504", "R-505", "R-506", "R-507 ou R-507A", "R-508A", "R-508B", "R-509 ou R-509A", "R-510A", "R-511A", "R-512A", "R-513A", "R-513B", "R-514A", "R-515A", "R-516A", "CFC-11", "CFC-12", "CFC-13", "CFC-113", "CFC-114", "CFC-115", "Halon-1301", "Halon-1211", "Halon-2402", "Tetracloreto de carbono (CCl4)", "Bromometano (CH3Br)", "Methyl chloroform (CH3CCl3)", "HCFC-21", "HCFC-22 (R22)", "HCFC-123", "HCFC-124", "HCFC-141b", "HCFC-142b", "HCFC-225ca", "HCFC-225cb"],
        get validOptions() {
            return {
                periodo: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro", "Anual"],
                tipo_gas: this.gasList,
                gas_emissor_composicao: this.gasList
            };
        },
        autoFillMap: {},
        validateRow: function(rowData) {
            const errors = {};
            if (!rowData.ano || isNaN(parseInt(rowData.ano)) || String(rowData.ano).length !== 4) errors.ano = "Deve ser um ano com 4 dígitos.";
            if (!this.validOptions.periodo.includes(rowData.periodo)) errors.periodo = "Período inválido.";
            if (!rowData.unidade_empresarial) errors.unidade_empresarial = "Obrigatório.";
            if (!rowData.fonte_emissao) errors.fonte_emissao = "Obrigatório.";
            if (!this.validOptions.tipo_gas.includes(rowData.tipo_gas)) errors.tipo_gas = "Obrigatório.";
            
            const quantidade = parseFloat(String(rowData.quantidade_reposta));
            if (isNaN(quantidade) || quantidade <= 0) errors.quantidade_reposta = "Deve ser um número positivo.";
            
            if (rowData.unidade !== 'kg') errors.unidade = "Unidade deve ser 'kg'.";

            const isCompositionStarted = rowData.nome_comercial_gas || rowData.gas_emissor_composicao || rowData.percentual_emissao;
            if (isCompositionStarted) {
                if (!rowData.nome_comercial_gas) errors.nome_comercial_gas = "Obrigatório se preencher composição.";
                if (!this.validOptions.gas_emissor_composicao.includes(rowData.gas_emissor_composicao)) errors.gas_emissor_composicao = "Obrigatório selecionar um gás da lista.";
                
                const percentual = parseFloat(String(rowData.percentual_emissao));
                if (isNaN(percentual) || percentual <= 0 || percentual > 100) {
                    errors.percentual_emissao = "Deve ser um número entre 0 e 100.";
                }
            }
            if (!rowData.rastreabilidade) errors.rastreabilidade = "Obrigatório.";
            return { isValid: Object.keys(errors).length === 0, errors: errors };
        }
    },
    fertilizantes: {
        displayName: "Fertilizantes (E3)",
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
            
            const quantidade = parseFloat(String(rowData.quantidade_kg));
            if (isNaN(quantidade) || quantidade <= 0) errors.quantidade_kg = "Deve ser um número positivo.";

            if (rowData.unidade !== 'kg') errors.unidade = "Unidade deve ser 'kg'.";

            const percN = parseFloat(String(rowData.percentual_nitrogenio));
            if (isNaN(percN) || percN < 0 || percN > 100) errors.percentual_nitrogenio = "Deve ser um número obrigatório entre 0 e 100.";
            
            const percC = parseFloat(String(rowData.percentual_carbonato));
            if (isNaN(percC) || percC < 0 || percC > 100) errors.percentual_carbonato = "Deve ser um número obrigatório entre 0 e 100.";

            if (!this.validOptions.controlado_empresa.includes(rowData.controlado_empresa)) errors.controlado_empresa = "Deve ser 'Sim' ou 'Não'.";
            if (!rowData.rastreabilidade) errors.rastreabilidade = "Obrigatório.";

            return { isValid: Object.keys(errors).length === 0, errors: errors };
        }
    }
};
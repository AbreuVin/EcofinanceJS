// arquivo: frontend/validators.js

export const validationSchemas = {
    combustao_movel: {
        displayName: "Combustão Móvel",
        hasResponsibles: true, 
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
            responsavel: "Responsável", // <-- NOVO (SPRINT 11)
            email_do_responsavel: "E-mail do Responsável", // <-- NOVO (SPRINT 11)
            telefone_do_responsavel: "Telefone do Responsável" // <-- NOVO (SPRINT 11)
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
                if (rowData.consumo === '' || isNaN(parseFloat(rowData.consumo))) errors.consumo = "Deve ser um número.";
                if (this.autoFillMap.combustivel.map[rowData.combustivel] !== rowData.unidade_consumo) errors.unidade_consumo = `Unidade incorreta para o combustível.`;
            } else if (rowData.tipo_entrada === 'distancia') {
                if (rowData.distancia_percorrida === '' || isNaN(parseFloat(rowData.distancia_percorrida))) errors.distancia_percorrida = "Deve ser um número.";
                if (!this.validOptions.unidade_distancia.includes(rowData.unidade_distancia)) errors.unidade_distancia = "Deve ser 'Km' ou 'Milhas'.";
                if (!this.validOptions.tipo_veiculo.includes(rowData.tipo_veiculo)) errors.tipo_veiculo = "Tipo de veículo inválido.";
            }
            return { isValid: Object.keys(errors).length === 0, errors: errors };
        }
    },

    combustao_estacionaria: {
        displayName: "Combustão Estacionária",
        hasResponsibles: true, // <-- NOVO (SPRINT 11)
        hasUnits: true,
        headerDisplayNames: {
            ano: "Ano",
            periodo: "Período",
            unidade_empresarial: "Unidade Empresarial",
            descricao_da_fonte: "Descrição da Fonte",
            tipo_da_fonte: "Tipo da Fonte",
            combustivel: "Combustível",
            consumo: "Consumo",
            unidade: "Unidade",
            responsavel: "Responsável", // <-- NOVO (SPRINT 11)
            email_do_responsavel: "E-mail do Responsável", // <-- NOVO (SPRINT 11)
            telefone_do_responsavel: "Telefone do Responsável" // <-- NOVO (SPRINT 11)
        },
        validOptions: {
            periodo: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro", "Anual"],
            tipo_fonte: ["Gerador de Energia", "Caldeira", "Forno", "Aquecedor", "Outro"],
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
            if (!this.validOptions.tipo_fonte.includes(rowData.tipo_da_fonte)) errors.tipo_da_fonte = "Tipo de fonte inválido.";
            if (!this.validOptions.combustivel.includes(rowData.combustivel)) errors.combustivel = "Combustível inválido.";
            if (rowData.consumo === '' || isNaN(parseFloat(rowData.consumo))) errors.consumo = "Deve ser um número.";
            if (this.autoFillMap.combustivel.map[rowData.combustivel] !== rowData.unidade) errors.unidade = `Unidade incorreta para o combustível.`;
            
            return { isValid: Object.keys(errors).length === 0, errors: errors };
        }
    }
};
// arquivo: frontend/assets.js


import { validationSchemas } from '../shared/validators.js';

document.addEventListener('DOMContentLoaded', () => {
    
    
    const assetSchemas = {
        electricity_purchase: {
            displayName: "Compra de Eletricidade",
            fields: {
                fonte_energia: { label: "Fonte de Energia (Descrição)", type: "select" },
                especificar_fonte: { label: "Especificar Fonte Padrão", type: "select", showIf: { field: "fonte_energia", value: ["Mercado Livre Convencional", "Mercado Livre Incentivado", "Fonte Energética Específica"] } },
                unidade_medida: { label: "Unidade de Medida Padrão", type: "select" }
            }
        },
        solid_waste: {
            displayName: "Resíduos Sólidos",
            fields: {
                destinacao_final: { label: "Destinação Final (Descrição)", type: "select" },
                tipo_residuo: { label: "Tipo de Resíduo Padrão", type: "select" },
                unidade: { label: "Unidade Padrão", type: "select" },
                cidade_uf_destino: { label: "Cidade/UF de Destino", type: "text", placeholder: "Ex: Porto Alegre/RS", showIf: { field: "destinacao_final", value: "Aterro" } },
                local_controlado_empresa: { label: "Local Controlado pela Empresa?", type: "select" },
                responsible_contact_id: { label: "Responsável pela Informação", type: "select", isContact: true }
            }
        },
        purchased_goods_services: {
            displayName: "Bens e Serviços Comprados",
            fields: {
                tipo_item: { label: "Tipo (Produto ou Serviço) Padrão", type: "select" },
                unidade: { label: "Unidade de Medida Padrão", type: "select", showIf: { field: "tipo_item", value: "Produto" } },
                bens_terceiros: { label: "Bens comprados por terceiros? (Padrão)", type: "select" },
                responsible_contact_id: { label: "Responsável pela Informação", type: "select", isContact: true }
            }
        },
        capital_goods: {
            displayName: "Bens de Capital",
            fields: {
                responsible_contact_id: { label: "Responsável pela Informação", type: "select", isContact: true }
            }
        },
        upstream_transport: {
            displayName: "Logística de Insumo",
            fields: {
                modal_transporte: { label: "Modal de Transporte Padrão", type: "select" },
                tipo_reporte: { label: "Forma de Reporte Padrão", type: "select" },
                responsible_contact_id: { label: "Responsável pela Informação", type: "select", isContact: true }
            }
        },
        downstream_transport: {
            displayName: "Logística de Produto Final",
            fields: {
                insumo_transportado: { label: "Produto Transportado (Descrição)", type: "text" },
                modal_transporte: { label: "Modal de Transporte Padrão", type: "select" },
                tipo_reporte: { label: "Forma de Reporte Padrão", type: "select" },
                
                // Consumo
                combustivel: { label: "Combustível Padrão", type: "select", showIf: { field: "tipo_reporte", value: "Consumo" } },
                unidade_consumo: { label: "Unidade (Preenchimento Automático)", type: "text", showIf: { field: "tipo_reporte", value: "Consumo" }, disabled: true },
                
                // Distância
                classificacao_veiculo: { label: "Classificação do Veículo Padrão", type: "select", showIf: { field: "tipo_reporte", value: "Distância" } },
                unidade_distancia: { label: "Unidade de Distância Padrão", type: "select", showIf: { field: "tipo_reporte", value: "Distância" } },

                responsible_contact_id: { label: "Responsável pela Informação", type: "select", isContact: true }
            }
        },
        waste_transport: {
            displayName: "Logística de Resíduos",
            fields: {
                insumo_transportado: { label: "Resíduo Transportado (Descrição)", type: "text" },
                tipo_reporte: { label: "Forma de Reporte Padrão", type: "select" },
                
                // Consumo
                combustivel: { label: "Combustível Padrão", type: "select", showIf: { field: "tipo_reporte", value: "Consumo" } },
                unidade_consumo: { label: "Unidade (Preenchimento Automático)", type: "text", showIf: { field: "tipo_reporte", value: "Consumo" }, disabled: true },
                
                // Distância
                classificacao_veiculo: { label: "Classificação do Veículo Padrão", type: "select", showIf: { field: "tipo_reporte", value: "Distância" } },
                unidade_distancia: { label: "Unidade de Distância Padrão", type: "select", showIf: { field: "tipo_reporte", value: "Distância" } },

                responsible_contact_id: { label: "Responsável pela Informação", type: "select", isContact: true }
            }
        },
        home_office: {
            displayName: "Home Office",
            fields: {
                regime_trabalho: { 
                    label: "Dias da semana em Home Office (Regime)", 
                    type: "checkbox-group", 
                    options: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"]
                },
                responsible_contact_id: { label: "Responsável pela Informação", type: "select", isContact: true }
            }
        },
        air_travel: {
            displayName: "Viagens Aéreas",
            fields: {
                descricao_viagem: { label: "Descrição da Viagem (Grupo/Categoria)", type: "text", placeholder: "Ex: Viagens Comerciais, Diretoria..." },
                responsible_contact_id: { label: "Responsável pela Informação", type: "select", isContact: true }
            }
        },
        employee_commuting: {
            displayName: "Transporte de Funcionários",
            fields: {
                meio_utilizado: { label: "Meio Utilizado (Descrição)", type: "select" },
                tipo_reporte: { label: "Forma de Reporte Padrão", type: "select" },
                
                // Consumo
                tipo_combustivel: { label: "Combustível Padrão", type: "select", showIf: { field: "tipo_reporte", value: "Consumo" } },
                unidade_consumo: { label: "Unidade (Preenchimento Automático)", type: "text", showIf: { field: "tipo_reporte", value: "Consumo" }, disabled: true },

                responsible_contact_id: { label: "Responsável pela Informação", type: "select", isContact: true }
            }
        },
        energy_generation: {
            displayName: "Geração de Energia",
            fields: {
                fonte_geracao: { label: "Tipo de Fonte Padrão", type: "select" },
                unidade_medida: { label: "Unidade de Medida Padrão", type: "select" },
                responsible_contact_id: { label: "Responsável pela Informação", type: "select", isContact: true }
            }
        },
        // --- SPRINT 19: Floresta Plantada ---
        planted_forest: {
            displayName: "Área de Floresta Plantada",
            fields: {
                identificacao_area: { label: "Identificação da Área (Descrição)", type: "text", placeholder: "Ex: Talhão A - Fazenda Norte" },
                nome_especie: { label: "Espécie Padrão", type: "select" },
                responsible_contact_id: { label: "Responsável pela Informação", type: "select", isContact: true }
            }
        },
        // --- SPRINT 21: Área de Conservação (SEM DESCRIÇÃO MANUAL) ---
        conservation_area: {
            displayName: "Área de Conservação",
            fields: {
                // Bioma agora atua como "Descrição" na lista
                bioma: { label: "Bioma (Descrição)", type: "select" },
                fitofisionomia: { label: "Fitofisionomia", type: "select" }, 
                area_plantada: { label: "Área de conservação plantada?", type: "select" },
                plantio: { label: "Plantio", type: "text", placeholder: "Ex: 2010 ou 'Nativo'", showIf: { field: "area_plantada", value: "Sim" } },
                responsible_contact_id: { label: "Responsável pela Informação", type: "select", isContact: true }
            }
        },
        business_travel_land: {
            displayName: "Viagens a Negócios Terrestres",
            fields: {
                tipo_reporte: { label: "Forma de Reporte Padrão", type: "select" },
                
                // Campos GLOBAIS
                modal_viagem: { label: "Modal de Viagem Padrão", type: "select" },
                km_reembolsado: { label: "Reembolso de Km (Padrão)?", type: "select" },
                
                // Campos Específicos para Consumo
                combustivel: { label: "Combustível Padrão", type: "select", showIf: { field: "tipo_reporte", value: "Consumo" } }, 
                unidade_consumo: { label: "Unidade (Preenchimento Automático)", type: "text", showIf: { field: "tipo_reporte", value: "Consumo" }, disabled: true }, 

                responsible_contact_id: { label: "Responsável pela Informação", type: "select", isContact: true }
            }
        },
        combustao_estacionaria: { 
            displayName: "Combustão Estacionária", 
            fields: { 
                combustivel_estacionario: { label: "Combustível Padrão", type: "select" },
                unidade: { label: "Unidade de Consumo", type: "text", disabled: true },
                controlado_empresa: { label: "Controlado pela Empresa?", type: "select", options: ["Sim", "Não"] }
            } 
        },
        combustao_movel: { 
            displayName: "Combustão Móvel", 
            fields: { 
                tipo_entrada: { label: "Como os dados serão reportados?", type: "select" }, 
                combustivel: { label: "Combustível Padrão", type: "select", showIf: { field: "tipo_entrada", value: "consumo" } }, 
                unidade_consumo: { label: "Unidade de Consumo", type: "text", showIf: { field: "tipo_entrada", value: "consumo" }, disabled: true }, 
                tipo_veiculo: { label: "Tipo de Veículo Padrão", type: "select", showIf: { field: "tipo_entrada", value: "distancia" } },
                controlado_empresa: { label: "Controlado pela Empresa?", type: "select", options: ["Sim", "Não"] }
            } 
        },
        dados_producao_venda: { 
            displayName: "Dados de Produção e Venda", 
            fields: { 
                unidade_medida: { label: "Unidade de Medida Padrão", type: "text" } 
            } 
        },
        ippu_lubrificantes: { 
            displayName: "IPPU - Lubrificantes", 
            fields: { 
                tipo_lubrificante: { label: "Tipo de Lubrificante Padrão", type: "select" }, 
                unidade: { label: "Unidade de Consumo Padrão", type: "text", disabled: true },
                controlado_empresa: { label: "Controlado pela Empresa?", type: "select", options: ["Sim", "Não"] }
            } 
        },
        emissoes_fugitivas: { 
            displayName: "Emissões Fugitivas", 
            fields: { 
                tipo_gas: { label: "Gás Padrão", type: "select" },
                controlado_empresa: { label: "Controlado pela Empresa?", type: "select", options: ["Sim", "Não"] }
            } 
        },
        fertilizantes: { 
            displayName: "Fertilizantes", 
            fields: { 
                percentual_nitrogenio: { label: "Percentual de Nitrogênio Padrão (%)", type: "number", min: 0, max: 100, step: 0.01 }, 
                percentual_carbonato: { label: "Percentual de Carbonato Padrão (%)", type: "number", min: 0, max: 100, step: 0.01 },
                controlado_empresa: { label: "Controlado pela Empresa?", type: "select", options: ["Sim", "Não"] }
            } 
        },
        efluentes_controlados: {
            displayName: "Efluentes Controlados",
            fields: {
                tratamento_ou_destino: { label: "Tratamento ou Destino Final (Padrão)?", type: "select" },
                tipo_tratamento: { label: "Tipo de Tratamento Padrão", type: "select", showIf: { field: "tratamento_ou_destino", value: "Tratamento" } },
                tipo_destino_final: { label: "Tipo de Destino Final Padrão", type: "select", showIf: { field: "tratamento_ou_destino", value: "Destino Final" } },
                unidade_componente_organico: { label: "Unidade Padrão (Componente Orgânico)", type: "select" }
            }
        },
        // --- ATUALIZADO AQUI (Efluentes Domésticos) ---
        efluentes_domesticos: {
            displayName: "Efluentes Domésticos",
            fields: {
                tipo_trabalhador: { label: "Tipo de Trabalhador (Descrição)", type: "select", options: ["Interno", "Terceiro"] },
                fossa_septica_propriedade: { label: "Fossa séptica na propriedade da empresa?", type: "select", options: ["Sim", "Não"] },
                responsible_contact_id: { label: "Responsável pela Informação", type: "select", isContact: true }
            }
        },
        mudanca_uso_solo: {
            displayName: "Mudança do Uso do Solo",
            fields: {
                uso_solo_anterior: { label: "Uso do Solo Anterior (Padrão)", type: "select" },
                bioma: { label: "Bioma Padrão", type: "select", showIf: { field: "uso_solo_anterior", value: "Vegetação natural" } },
                fitofisionomia: { label: "Fitofisionomia Padrão", type: "text", showIf: { field: "uso_solo_anterior", value: "Vegetação natural" } },
                tipo_area: { label: "Tipo de Área Padrão", type: "select", showIf: { field: "uso_solo_anterior", value: "Vegetação natural" } }
            }
        }
    };
    
    const navPlaceholder = document.getElementById('nav-placeholder');
    const sourceSelector = document.getElementById('source-selector');
    const assetManagementSection = document.getElementById('asset-management-section');
    const form = document.getElementById('asset-form');
    const assetIdInput = document.getElementById('asset-id');
    const specificFieldsContainer = document.getElementById('specific-fields-container');
    const assetsThead = document.getElementById('assets-thead');
    const assetsTbody = document.getElementById('assets-tbody');
    const formTitle = document.getElementById('form-title');
    const tableTitle = document.getElementById('table-title');
    const cancelBtn = document.getElementById('cancel-btn');
    const unitSelect = document.getElementById('asset-unit');
    let currentSourceType = null;
    let contactsList = [];

    async function initializePage() { 
        if (navPlaceholder) { 
            fetch('nav.html').then(response => response.text()).then(data => { navPlaceholder.innerHTML = data; }); 
        } 
        const sortedSourceTypes = Object.keys(assetSchemas).sort((a, b) => 
            assetSchemas[a].displayName.localeCompare(assetSchemas[b].displayName)
        );
        sortedSourceTypes.forEach(sourceType => {
            const option = document.createElement('option');
            option.value = sourceType;
            option.textContent = assetSchemas[sourceType].displayName;
            sourceSelector.appendChild(option);
        });
        
        try { 
            const [unitsResponse, contactsResponse] = await Promise.all([ 
                fetch('/api/units'), 
                fetch('/api/contacts') 
            ]); 
            const unitsList = await unitsResponse.json(); 
            contactsList = await contactsResponse.json();
            
            unitSelect.innerHTML = '<option value="">-- Selecione --</option>'; 
            if (unitsList.length > 1) { 
                const allUnitsOption = document.createElement('option'); 
                allUnitsOption.value = 'all'; 
                allUnitsOption.textContent = '*** TODAS AS UNIDADES ***'; 
                unitSelect.appendChild(allUnitsOption); 
            } 
            unitsList.forEach(unit => { 
                const option = document.createElement('option'); 
                option.value = unit.id; 
                option.textContent = unit.name; 
                unitSelect.appendChild(option); 
            }); 
        } catch (error) { 
            console.error("Erro na inicialização da página:", error); 
        } 
    }
    
    async function handleSourceSelection() { 
        currentSourceType = sourceSelector.value; 
        resetForm(); 
        if (!currentSourceType) { 
            assetManagementSection.style.display = 'none'; 
            return; 
        } 
        const schema = assetSchemas[currentSourceType]; 
        formTitle.textContent = `Adicionar Nova Fonte`; 
        tableTitle.textContent = `Fontes de ${schema.displayName} Cadastradas`; 
        await buildDynamicForm(schema); 
        buildDynamicTableHeaders(schema); 
        loadAssetTypologies(); 
        assetManagementSection.style.display = 'block'; 
    }
    
    function buildDynamicTableHeaders(schema) { 
        assetsThead.innerHTML = ''; 
        const headerRow = document.createElement('tr'); 
        
        // --- Lista de Schemas que usam Descrição Customizada (ATUALIZADA) ---
        // Adicionado 'efluentes_domesticos'
        const usesCustomDescription = ['solid_waste', 'electricity_purchase', 'downstream_transport', 'waste_transport', 'home_office', 'air_travel', 'employee_commuting', 'energy_generation', 'planted_forest', 'conservation_area', 'efluentes_controlados', 'efluentes_domesticos'].includes(currentSourceType);
        const mainDescriptionKey = usesCustomDescription ? Object.keys(schema.fields)[0] : 'description';
        const mainDescriptionLabel = usesCustomDescription ? schema.fields[mainDescriptionKey].label : 'Descrição';

        let headers = `<th>${mainDescriptionLabel}</th><th>Unidade</th><th>Frequência</th>`; 
        
        for (const key in schema.fields) { 
            if (usesCustomDescription && key === mainDescriptionKey) continue;
            headers += `<th>${schema.fields[key].label}</th>`; 
        } 
        headers += '<th>Ações</th>'; 
        headerRow.innerHTML = headers; 
        assetsThead.appendChild(headerRow); 
    }
    
    async function loadAssetTypologies() { 
        if (!currentSourceType) return; 
        try { 
            const response = await fetch(`/api/asset-typologies?source_type=${currentSourceType}`); 
            const typologies = await response.json(); 
            assetsTbody.innerHTML = ''; 
            typologies.forEach(typo => { 
                const tr = document.createElement('tr'); 
                
                // --- Lista de Schemas que usam Descrição Customizada (ATUALIZADA) ---
                const usesCustomDescription = ['solid_waste', 'electricity_purchase', 'downstream_transport', 'waste_transport', 'home_office', 'air_travel', 'employee_commuting', 'energy_generation', 'planted_forest', 'conservation_area', 'efluentes_controlados', 'efluentes_domesticos'].includes(currentSourceType);
                const mainDescriptionKey = usesCustomDescription ? Object.keys(assetSchemas[currentSourceType].fields)[0] : 'description';

                const mainDescription = usesCustomDescription 
                    ? (typo.asset_fields[mainDescriptionKey] || typo.description) 
                    : typo.description;
                
                // Lógica de limpeza de dados para exibição
                const displayFields = { ...typo.asset_fields };
                if (currentSourceType === 'combustao_movel') {
                    const tipoEntrada = displayFields.tipo_entrada;
                    if (tipoEntrada === 'consumo') {
                        displayFields.tipo_veiculo = ''; 
                    } else if (tipoEntrada === 'distancia') {
                        displayFields.combustivel = ''; 
                        displayFields.unidade_consumo = '';
                    }
                } else if (currentSourceType === 'business_travel_land') {
                     const tipoReporte = displayFields.tipo_reporte;
                     if (tipoReporte === 'Consumo') {
                         // modal e reembolso são globais
                     } else if (tipoReporte === 'Distância') {
                         displayFields.combustivel = '';
                         displayFields.unidade_consumo = '';
                     }
                } else if (currentSourceType === 'downstream_transport' || currentSourceType === 'waste_transport') {
                     const tipoReporte = displayFields.tipo_reporte;
                     if (tipoReporte === 'Consumo') {
                         displayFields.classificacao_veiculo = '';
                         displayFields.unidade_distancia = '';
                     } else if (tipoReporte === 'Distância') {
                         displayFields.combustivel = '';
                         displayFields.unidade_consumo = '';
                     }
                } else if (currentSourceType === 'employee_commuting') {
                     const tipoReporte = displayFields.tipo_reporte;
                     if (tipoReporte === 'Consumo') {
                         // Mantém combustível
                     } else if (tipoReporte === 'Distância') {
                         displayFields.tipo_combustivel = '';
                         displayFields.unidade_consumo = '';
                     } else if (tipoReporte === 'Endereço') {
                         displayFields.tipo_combustivel = '';
                         displayFields.unidade_consumo = '';
                     }
                }
                
                const frequencyText = typo.reporting_frequency === 'mensal' ? 'Mensal' : 'Anual';
                let rowHtml = `<td>${mainDescription}</td><td>${typo.unit_name}</td><td>${frequencyText}</td>`; 
                const schema = assetSchemas[currentSourceType]; 
                
                for (const key in schema.fields) { 
                    if (usesCustomDescription && key === mainDescriptionKey) continue;
                    if (key === 'responsible_contact_id') {
                        rowHtml += `<td>${typo.responsible_contact_name || ''}</td>`;
                    } else {
                        rowHtml += `<td>${displayFields[key] || ''}</td>`; 
                    }
                } 
                rowHtml += `<td> <button class="action-btn edit-btn" data-id="${typo.id}">Editar</button> <button class="action-btn delete-btn" data-id="${typo.id}">Deletar</button> </td>`; 
                tr.innerHTML = rowHtml; 
                assetsTbody.appendChild(tr); 
            }); 
        } catch (error) { 
            console.error("Erro ao carregar tipologias:", error); 
        } 
    }
    
    async function handleFormSubmit(e) { 
        e.preventDefault(); 
        const id = assetIdInput.value; 
        const asset_fields = {}; 
        
        let responsibleContactId = null;
        let reportingFrequency = document.getElementById('reporting-frequency').value;

        form.querySelectorAll('[data-key]').forEach(input => {
             const fieldWrapper = input.closest('.form-group');
             if (fieldWrapper && fieldWrapper.style.display !== 'none') {
                 const key = input.dataset.key;
                 if (key === 'responsible_contact_id') {
                     responsibleContactId = input.value;
                 } else if (key !== 'reporting_frequency') {
                     asset_fields[key] = input.value;
                 }
             }
        });

        // --- VALIDAÇÃO ESPECÍFICA PARA FERTILIZANTES ---
        if (currentSourceType === 'fertilizantes') {
            const percN = parseFloat(asset_fields.percentual_nitrogenio) || 0;
            const percC = parseFloat(asset_fields.percentual_carbonato) || 0;
            if ((percN + percC) > 100) {
                alert(`A soma das porcentagens (${(percN + percC).toFixed(2)}%) excede 100%. Por favor, corrija os valores.`);
                return; // Interrompe o salvamento
            }
        }

        // --- Lista de Schemas que usam Descrição Customizada (ATUALIZADA) ---
        const usesCustomDescription = ['solid_waste', 'electricity_purchase', 'downstream_transport', 'waste_transport', 'home_office', 'air_travel', 'employee_commuting', 'energy_generation', 'planted_forest', 'conservation_area', 'efluentes_controlados', 'efluentes_domesticos'].includes(currentSourceType);
        const mainDescriptionKey = usesCustomDescription ? Object.keys(assetSchemas[currentSourceType].fields)[0] : null;

        const descriptionValue = usesCustomDescription
            ? asset_fields[mainDescriptionKey]
            : document.getElementById('asset-description').value;
        
        const unitValue = document.getElementById('asset-unit').value; 
        const data = { 
            description: descriptionValue, 
            unit_id: unitValue, 
            source_type: currentSourceType, 
            asset_fields: asset_fields,
            responsible_contact_id: responsibleContactId,
            reporting_frequency: reportingFrequency
        }; 
        
        const method = id ? 'PUT' : 'POST'; 
        const url = id ? `/api/asset-typologies/${id}` : '/api/asset-typologies'; 
        try { 
            const response = await fetch(url, { method: method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); 
            if (!response.ok) { 
                const errorData = await response.json(); 
                throw new Error(errorData.error || 'Falha ao salvar a fonte.'); 
            } 
            
            if (id) {
                resetForm();
            } else {
                assetIdInput.value = '';
            }
            
            loadAssetTypologies(); 
        } catch (error) { 
            console.error("Erro ao salvar:", error); 
            alert(`Ocorreu um erro ao salvar: ${error.message}`); 
        } 
    }
    
    async function handleTableClick(e) {
        const target = e.target;
        const id = target.dataset.id;
        if (!id) return;

        if (target.classList.contains('edit-btn')) {
            const response = await fetch(`/api/asset-typologies?source_type=${currentSourceType}`);
            const typologies = await response.json();
            const typoToEdit = typologies.find(t => t.id == id);
            
            if (typoToEdit) {
                assetIdInput.value = typoToEdit.id;
                
                // --- Lista de Schemas que usam Descrição Customizada (ATUALIZADA) ---
                const usesCustomDescription = ['solid_waste', 'electricity_purchase', 'downstream_transport', 'waste_transport', 'home_office', 'air_travel', 'employee_commuting', 'energy_generation', 'planted_forest', 'conservation_area', 'efluentes_controlados', 'efluentes_domesticos'].includes(currentSourceType);
                if (!usesCustomDescription) {
                    document.getElementById('asset-description').value = typoToEdit.description;
                }
                
                document.getElementById('asset-unit').value = typoToEdit.unit_id;
                
                await buildDynamicForm(assetSchemas[currentSourceType]); 
                
                document.getElementById('reporting-frequency').value = typoToEdit.reporting_frequency;

                form.querySelectorAll('[data-key]').forEach(input => {
                    const key = input.dataset.key;
                    if (key === 'responsible_contact_id') {
                        input.value = typoToEdit.responsible_contact_id || '';
                    } else if (typoToEdit.asset_fields[key] !== undefined) {
                        input.value = typoToEdit.asset_fields[key];
                        
                        // Lógica especial para checkbox-group
                        if (assetSchemas[currentSourceType].fields[key].type === 'checkbox-group') {
                            const selectedValues = (typoToEdit.asset_fields[key] || '').split(', ');
                            const container = input.closest('.form-group');
                            container.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                                cb.checked = selectedValues.includes(cb.value);
                            });
                        }
                    }
                        
                    const conditionalTriggers = ['tipo_entrada', 'tratamento_ou_destino', 'uso_solo_anterior', 'destinacao_final', 'fonte_energia', 'tipo_item', 'tipo_reporte', 'combustivel', 'tipo_combustivel', 'area_plantada', 'bioma', 'tipo_lubrificante'];
                    if (conditionalTriggers.includes(key)) {
                        input.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                });

                formTitle.textContent = `Editando Fonte: ${typoToEdit.description}`;
                cancelBtn.style.display = 'inline-block';
                window.scrollTo(0,0);
            }
        } else if (target.classList.contains('delete-btn')) {
            if (confirm('Tem certeza que deseja deletar esta fonte?')) {
                try {
                    await fetch(`/api/asset-typologies/${id}`, { method: 'DELETE' });
                    loadAssetTypologies();
                } catch (error) {
                    console.error("Erro ao deletar:", error);
                    alert('Ocorreu um erro ao deletar. Verifique o console.');
                }
            }
        }
    }
    
    function resetForm() {
        form.reset();
        assetIdInput.value = '';
        if (currentSourceType) {
            formTitle.textContent = `Adicionar Nova Fonte`;
        }
        cancelBtn.style.display = 'none';

        const descriptionGroup = document.getElementById('asset-description').parentElement;
        // --- Lista de Schemas que usam Descrição Customizada (ATUALIZADA) ---
        const usesCustomDescription = ['solid_waste', 'electricity_purchase', 'downstream_transport', 'waste_transport', 'home_office', 'air_travel', 'employee_commuting', 'energy_generation', 'planted_forest', 'conservation_area', 'efluentes_controlados', 'efluentes_domesticos'].includes(currentSourceType);

        if (usesCustomDescription) {
            descriptionGroup.style.display = 'none';
            descriptionGroup.querySelector('input').required = false;
        } else {
            descriptionGroup.style.display = '';
            descriptionGroup.querySelector('input').required = true;
        }

        const triggerFields = ['field-tipo_entrada', 'field-tratamento_ou_destino', 'uso_solo_anterior', 'field-combustivel', 'field-combustivel_estacionario', 'field-destinacao_final', 'field-fonte_energia', 'field-tipo_item', 'field-tipo_reporte', 'field-tipo_combustivel', 'field-area_plantada', 'field-bioma', 'field-tipo_lubrificante'];
        triggerFields.forEach(id => {
            const trigger = document.getElementById(id);
            if (trigger) trigger.dispatchEvent(new Event('change'));
        });
        
        // Resetar checkboxes
        form.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    }

    async function buildDynamicForm(schema) { 
        specificFieldsContainer.innerHTML = '';
        form.querySelectorAll('.dynamic-field').forEach(el => el.remove()); 
        
        const fieldElements = {};
        const triggerFields = new Set();
        const autoFillTriggers = new Set();
        // --- Lista de Schemas que usam Descrição Customizada (ATUALIZADA) ---
        const usesCustomDescription = ['solid_waste', 'electricity_purchase', 'downstream_transport', 'waste_transport', 'home_office', 'air_travel', 'employee_commuting', 'energy_generation', 'planted_forest', 'conservation_area', 'efluentes_controlados', 'efluentes_domesticos'].includes(currentSourceType);
        
        const firstRowContainer = document.querySelector('#asset-form .form-row');
        const descriptionFieldGroup = document.getElementById('asset-description').parentElement;

        const validationSchema = validationSchemas[currentSourceType];
        
        if (validationSchema && validationSchema.autoFillMap) {
            Object.keys(validationSchema.autoFillMap).forEach(key => autoFillTriggers.add(key));
        }

        let dependencyConfig = null;
        if (validationSchema && validationSchema.dependencyMap) {
            dependencyConfig = validationSchema.dependencyMap;
            triggerFields.add(dependencyConfig.triggerField);
        }

        for (const key in schema.fields) {
            if (schema.fields[key].showIf) {
                triggerFields.add(schema.fields[key].showIf.field);
            }
        }
        
        const frequencyWrapper = document.createElement('div');
        frequencyWrapper.className = 'form-row dynamic-field';
        frequencyWrapper.innerHTML = `
            <div class="form-group">
                <label for="reporting-frequency">Frequência de Reporte</label>
                <select id="reporting-frequency" data-key="reporting_frequency">
                    <option value="anual">Anual</option>
                    <option value="mensal">Mensal</option>
                </select>
            </div>
        `;
        specificFieldsContainer.appendChild(frequencyWrapper);


        for (const key in schema.fields) { 
            const field = schema.fields[key]; 
            const wrapper = document.createElement('div');
            wrapper.className = 'form-group dynamic-field';
            wrapper.id = `row-${key}`; 
            
            const label = document.createElement('label'); 
            label.setAttribute('for', `field-${key}`); 
            label.textContent = field.label; 
            
            let input; 
            
            if (field.type === 'select') {
                input = document.createElement('select');
            } else if (field.type === 'checkbox-group') {
                input = document.createElement('input');
                input.type = 'hidden'; 
                
                const checkboxContainer = document.createElement('div');
                checkboxContainer.style.display = 'flex';
                checkboxContainer.style.flexWrap = 'wrap';
                checkboxContainer.style.gap = '10px';
                checkboxContainer.style.marginTop = '5px';

                field.options.forEach(opt => {
                    const cbWrapper = document.createElement('div');
                    cbWrapper.style.display = 'flex';
                    cbWrapper.style.alignItems = 'center';
                    
                    const cb = document.createElement('input');
                    cb.type = 'checkbox';
                    cb.value = opt;
                    cb.id = `cb-${key}-${opt}`;
                    cb.style.marginRight = '5px';
                    
                    const cbLabel = document.createElement('label');
                    cbLabel.htmlFor = `cb-${key}-${opt}`;
                    cbLabel.textContent = opt;
                    cbLabel.style.fontWeight = 'normal';
                    cbLabel.style.marginBottom = '0';

                    cb.addEventListener('change', () => {
                        const checkedOptions = Array.from(checkboxContainer.querySelectorAll('input[type="checkbox"]:checked'))
                                                    .map(c => c.value);
                        input.value = checkedOptions.join(', ');
                    });

                    cbWrapper.appendChild(cb);
                    cbWrapper.appendChild(cbLabel);
                    checkboxContainer.appendChild(cbWrapper);
                });
                
                wrapper.appendChild(label);
                wrapper.appendChild(checkboxContainer);
            } else { 
                input = document.createElement('input'); 
                input.type = field.type || 'text';
                if(field.placeholder) input.placeholder = field.placeholder;
            }
            
            input.id = `field-${key}`; 
            input.dataset.key = key; 
            input.required = !field.showIf && field.type !== 'checkbox-group'; 
            if (field.disabled) input.disabled = true;

            if (field.type === 'select') {
                input.innerHTML = '<option value="">-- Selecione --</option>';

                if (field.isContact) {
                    contactsList.forEach(contact => {
                        const option = document.createElement('option');
                        option.value = contact.id;
                        option.textContent = `${contact.name} (${contact.unit_name || 'N/A'})`;
                        input.appendChild(option);
                    });
                } else {
                    const displayMap = validationSchema.displayValueMap?.[key];
                    const options = validationSchema.validOptions?.[key] || field.options || [];

                    options.forEach(opt => {
                        const option = document.createElement('option');
                        option.value = opt;
                        option.textContent = (displayMap && displayMap[opt]) ? displayMap[opt] : opt;
                        input.appendChild(option);
                    });
                }
            }
            
            fieldElements[key] = { row: wrapper, input: input, config: field };

            if (field.type !== 'checkbox-group') {
                wrapper.appendChild(label); 
                wrapper.appendChild(input); 
            } else {
                wrapper.appendChild(input); 
            }

            const mainDescriptionKey = usesCustomDescription ? Object.keys(schema.fields)[0] : null;

            if (usesCustomDescription && key === mainDescriptionKey) {
                firstRowContainer.insertBefore(wrapper, descriptionFieldGroup);
            } else {
                let targetRow = Array.from(specificFieldsContainer.querySelectorAll('.form-row.dynamic-field')).pop();
                if (!targetRow || targetRow.children.length >= 2) {
                    targetRow = document.createElement('div');
                    targetRow.className = 'form-row dynamic-field';
                    specificFieldsContainer.appendChild(targetRow);
                }
                wrapper.className = 'form-group dynamic-field';
                targetRow.appendChild(wrapper);
            }


            if (triggerFields.has(key) || autoFillTriggers.has(key)) {
                input.addEventListener('change', () => {
                    const selectedValue = input.value;
                    
                    // Lógica ShowIf
                    for (const fieldKey in fieldElements) {
                        const element = fieldElements[fieldKey];
                        const showIfConfig = element.config.showIf;
                        
                        if (showIfConfig && showIfConfig.field === key) {
                            const conditionValues = Array.isArray(showIfConfig.value) ? showIfConfig.value : [showIfConfig.value];
                            const isVisible = conditionValues.includes(selectedValue);
                            
                            element.row.style.display = isVisible ? '' : 'none';
                            element.input.required = isVisible;
                        }
                    }

                    // Lógica AutoFill
                    if (autoFillTriggers.has(key)) {
                        const rule = validationSchema.autoFillMap[key];
                        const targetValue = rule.map[selectedValue];
                        const targetField = fieldElements[rule.targetColumn];
                        if (targetField && targetValue !== undefined) {
                            targetField.input.value = targetValue;
                        } else if (targetField) {
                            targetField.input.value = '';
                        }
                    }

                    // Lógica de Dependência (Dropdown Dinâmico)
                    if (dependencyConfig && dependencyConfig.triggerField === key) {
                        const targetFieldKey = dependencyConfig.targetField;
                        const targetElement = fieldElements[targetFieldKey];
                        
                        if (targetElement && targetElement.input.tagName === 'SELECT') {
                            targetElement.input.innerHTML = '<option value="">-- Selecione --</option>';
                            const dependentOptions = dependencyConfig.data[selectedValue];
                            if (dependentOptions && Array.isArray(dependentOptions)) {
                                dependentOptions.forEach(opt => {
                                    const option = document.createElement('option');
                                    option.value = opt;
                                    option.textContent = opt;
                                    targetElement.input.appendChild(option);
                                });
                            }
                        }
                    }
                });
            }
        }
        
        new Set([...triggerFields, ...autoFillTriggers]).forEach(triggerKey => {
            const triggerElement = fieldElements[triggerKey];
            if (triggerElement) {
                triggerElement.input.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });
        
        resetForm();
    }
    
    sourceSelector.addEventListener('change', handleSourceSelection);
    form.addEventListener('submit', handleFormSubmit);
    assetsTbody.addEventListener('click', handleTableClick);
    cancelBtn.addEventListener('click', resetForm);
    
    initializePage();
});
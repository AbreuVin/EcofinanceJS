// arquivo: frontend/assets.js

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. SCHEMAS DE CONFIGURAÇÃO DOS ATIVOS ---
    const assetSchemas = {
        combustao_estacionaria: { displayName: "Combustão Estacionária", fields: { combustivel: { label: "Combustível", type: "select" }, controlado_empresa: { label: "Controlado pela Empresa?", type: "select", options: ["Sim", "Não"] } } },
        combustao_movel: { displayName: "Combustão Móvel", fields: { tipo_entrada: { label: "Como os dados serão reportados?", type: "select", options: ["Por Consumo", "Por Distância"] }, combustivel: { label: "Combustível Padrão", type: "select", showIf: { field: "tipo_entrada", value: "Por Consumo" } }, tipo_veiculo: { label: "Tipo de Veículo Padrão", type: "select" }, controlado_empresa: { label: "Controlado pela Empresa?", type: "select", options: ["Sim", "Não"] } } },
        dados_producao_venda: { displayName: "Dados de Produção e Venda", fields: { unidade_medida: { label: "Unidade de Medida", type: "text" }, uso_final_produtos: { label: "Uso Final (Padrão)", type: "text" } } },
        ippu_lubrificantes: { displayName: "IPPU - Lubrificantes", fields: { tipo_lubrificante: { label: "Tipo de Lubrificante", type: "select" }, unidade: { label: "Unidade de Consumo", type: "select" }, utilizacao: { label: "Utilização Padrão", type: "text" }, controlado_empresa: { label: "Controlado pela Empresa?", type: "select", options: ["Sim", "Não"] } } },
        emissoes_fugitivas: { 
            displayName: "Emissões Fugitivas", 
            fields: { 
                tipo_reporte_gas: {
                    label: "Tipo de Reporte do Gás",
                    type: "select",
                    options: ["Gás Puro", "Gás Composto"]
                },
                tipo_gas: { 
                    label: "Gás (Puro)", 
                    type: "select",
                    showIf: { field: "tipo_reporte_gas", value: "Gás Puro" }
                },
                nome_comercial_gas: {
                    label: "Nome Comercial (Gás Composto)",
                    type: "text",
                    showIf: { field: "tipo_reporte_gas", value: "Gás Composto" }
                },
                gas_emissor_composicao: {
                    label: "Gás Emissor (na Composição)",
                    type: "select",
                    showIf: { field: "tipo_reporte_gas", value: "Gás Composto" }
                },
                percentual_emissao: {
                    label: "Percentual (%) na Composição",
                    type: "number",
                    min: 0, max: 100, step: 0.01,
                    showIf: { field: "tipo_reporte_gas", value: "Gás Composto" }
                },
                unidade: {
                    label: "Unidade Padrão",
                    type: "select"
                },
                rastreabilidade: {
                    label: "Rastreabilidade Padrão",
                    type: "text"
                },
                controlado_empresa: { 
                    label: "Controlado pela Empresa?", 
                    type: "select", 
                    options: ["Sim", "Não"] 
                } 
            } 
        },
        fertilizantes: { displayName: "Fertilizantes", fields: { percentual_nitrogenio: { label: "Percentual de Nitrogênio (%)", type: "number", min: 0, max: 100, step: 0.01 }, percentual_carbonato: { label: "Percentual de Carbonato (%)", type: "number", min: 0, max: 100, step: 0.01 }, controlado_empresa: { label: "Controlado pela Empresa?", type: "select", options: ["Sim", "Não"] } } },
        efluentes_controlados: {
            displayName: "Efluentes Controlados",
            fields: {
                tratamento_ou_destino: {
                    label: "Tratamento ou Destino Final?",
                    type: "select"
                },
                tipo_tratamento: {
                    label: "Tipo de Tratamento Padrão",
                    type: "select",
                    showIf: { field: "tratamento_ou_destino", value: "Tratamento" }
                },
                tipo_destino_final: {
                    label: "Tipo de Destino Final Padrão",
                    type: "select",
                    showIf: { field: "tratamento_ou_destino", value: "Destino Final" }
                },
                unidade_componente_organico: {
                    label: "Unidade Padrão (Componente Orgânico)",
                    type: "select"
                },
                rastreabilidade: {
                    label: "Rastreabilidade Padrão",
                    type: "text"
                }
            }
        },
        efluentes_domesticos: {
            displayName: "Efluentes Domésticos",
            fields: {
                fossa_septica_propriedade: {
                    label: "Fossa Séptica na Propriedade (Padrão)?",
                    type: "select"
                },
                rastreabilidade: {
                    label: "Rastreabilidade Padrão",
                    type: "text"
                }
            }
        },
        // --- ATENÇÃO: NOVO SCHEMA ADICIONADO AQUI ---
        mudanca_uso_solo: {
            displayName: "Mudança do Uso do Solo",
            fields: {
                uso_solo_anterior: {
                    label: "Uso do Solo Anterior (Padrão)",
                    type: "select"
                },
                bioma: {
                    label: "Bioma",
                    type: "select",
                    showIf: { field: "uso_solo_anterior", value: "Vegetação natural" }
                },
                fitofisionomia: {
                    label: "Fitofisionomia",
                    type: "text",
                    showIf: { field: "uso_solo_anterior", value: "Vegetação natural" }
                },
                tipo_area: {
                    label: "Tipo de Área",
                    type: "select",
                    showIf: { field: "uso_solo_anterior", value: "Vegetação natural" }
                },
                 rastreabilidade: {
                    label: "Rastreabilidade Padrão",
                    type: "text"
                }
            }
        }
        // --- FIM DA ADIÇÃO ---
    };

    // --- 2. REFERÊNCIAS DO DOM e VARIÁVEIS DE ESTADO ---
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
    const reportingFrequencySelect = document.getElementById('reporting-frequency');
    const saveFrequencyBtn = document.getElementById('save-frequency-btn');
    const frequencyFeedback = document.getElementById('frequency-feedback');
    let currentSourceType = null;
    let allConfigs = [];

    // --- 3. FUNÇÕES PRINCIPAIS ---
    async function initializePage() { if (navPlaceholder) { fetch('nav.html').then(response => response.text()).then(data => { navPlaceholder.innerHTML = data; }); } for (const sourceType in assetSchemas) { const option = document.createElement('option'); option.value = sourceType; option.textContent = assetSchemas[sourceType].displayName; sourceSelector.appendChild(option); } try { const [unitsResponse, configsResponse] = await Promise.all([ fetch('/api/units'), fetch('/api/source-configurations') ]); const unitsList = await unitsResponse.json(); allConfigs = await configsResponse.json(); unitSelect.innerHTML = '<option value="">-- Selecione --</option>'; if (unitsList.length > 1) { const allUnitsOption = document.createElement('option'); allUnitsOption.value = 'all'; allUnitsOption.textContent = '*** TODAS AS UNIDADES ***'; unitSelect.appendChild(allUnitsOption); } unitsList.forEach(unit => { const option = document.createElement('option'); option.value = unit.id; option.textContent = unit.name; unitSelect.appendChild(option); }); } catch (error) { console.error("Erro na inicialização da página:", error); } }
    async function handleSourceSelection() { currentSourceType = sourceSelector.value; resetForm(); frequencyFeedback.textContent = ''; if (!currentSourceType) { assetManagementSection.style.display = 'none'; return; } const schema = assetSchemas[currentSourceType]; formTitle.textContent = `Adicionar Nova Fonte`; tableTitle.textContent = `Fontes de ${schema.displayName} Cadastradas`; const currentConfig = allConfigs.find(c => c.source_type === currentSourceType); reportingFrequencySelect.value = currentConfig ? currentConfig.reporting_frequency : 'anual'; await buildDynamicForm(schema); buildDynamicTableHeaders(schema); loadAssetTypologies(); assetManagementSection.style.display = 'block'; }
    function buildDynamicTableHeaders(schema) { assetsThead.innerHTML = ''; const headerRow = document.createElement('tr'); let headers = '<th>Descrição</th><th>Unidade</th>'; for (const key in schema.fields) { headers += `<th>${schema.fields[key].label}</th>`; } headerRow.innerHTML = headers; assetsThead.appendChild(headerRow); }
    async function loadAssetTypologies() { if (!currentSourceType) return; try { const response = await fetch(`/api/asset-typologies?source_type=${currentSourceType}`); const typologies = await response.json(); assetsTbody.innerHTML = ''; typologies.forEach(typo => { const tr = document.createElement('tr'); let rowHtml = `<td>${typo.description}</td><td>${typo.unit_name}</td>`; const schema = assetSchemas[currentSourceType]; for (const key in schema.fields) { rowHtml += `<td>${typo.asset_fields[key] || ''}</td>`; } rowHtml += `<td> <button class="action-btn edit-btn" data-id="${typo.id}">Editar</button> <button class="action-btn delete-btn" data-id="${typo.id}">Deletar</button> </td>`; tr.innerHTML = rowHtml; assetsTbody.appendChild(tr); }); } catch (error) { console.error("Erro ao carregar tipologias:", error); } }
    async function handleFormSubmit(e) { e.preventDefault(); const id = assetIdInput.value; const asset_fields = {}; specificFieldsContainer.querySelectorAll('input, select').forEach(input => { const fieldWrapper = input.closest('.form-row'); if (fieldWrapper.style.display !== 'none') { asset_fields[input.dataset.key] = input.value; } }); const unitValue = document.getElementById('asset-unit').value; const data = { description: document.getElementById('asset-description').value, unit_id: unitValue, source_type: currentSourceType, asset_fields: asset_fields }; const method = id ? 'PUT' : 'POST'; const url = id ? `/api/asset-typologies/${id}` : '/api/asset-typologies'; try { const response = await fetch(url, { method: method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.error || 'Falha ao salvar a fonte.'); } resetForm(); loadAssetTypologies(); } catch (error) { console.error("Erro ao salvar:", error); alert(`Ocorreu um erro ao salvar: ${error.message}`); } }
    
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
                document.getElementById('asset-description').value = typoToEdit.description;
                document.getElementById('asset-unit').value = typoToEdit.unit_id;
                
                await buildDynamicForm(assetSchemas[currentSourceType]); 
                
                specificFieldsContainer.querySelectorAll('input, select').forEach(input => {
                    const key = input.dataset.key;
                    if (typoToEdit.asset_fields[key]) {
                        input.value = typoToEdit.asset_fields[key];
                        // Dispara eventos 'change' para todos os campos que são gatilhos
                        if (input.id.includes('tipo_entrada') || input.id.includes('tipo_reporte_gas') || input.id.includes('tratamento_ou_destino') || input.id.includes('uso_solo_anterior')) {
                            input.dispatchEvent(new Event('change'));
                        }
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

        // Dispara o evento change para os gatilhos, garantindo que a UI resete ao estado inicial
        const triggerFields = ['field-tipo_entrada', 'field-tipo_reporte_gas', 'field-tratamento_ou_destino', 'field-uso_solo_anterior'];
        triggerFields.forEach(id => {
            const trigger = document.getElementById(id);
            if (trigger) trigger.dispatchEvent(new Event('change'));
        });
    }

    async function buildDynamicForm(schema) { 
        specificFieldsContainer.innerHTML = ''; 
        const fieldElements = {};
        const triggerFields = new Set(); 

        for (const key in schema.fields) {
            const field = schema.fields[key];
            if (field.showIf) {
                triggerFields.add(field.showIf.field);
            }
        }

        for (const key in schema.fields) { 
            const field = schema.fields[key]; 
            const formRow = document.createElement('div'); 
            formRow.className = 'form-row';
            formRow.id = `row-${key}`; 
            
            const formGroup = document.createElement('div'); 
            formGroup.className = 'form-group'; 
            const label = document.createElement('label'); 
            label.setAttribute('for', `field-${key}`); 
            label.textContent = field.label; 
            let input; 
            
            if (field.type === 'select') {
                input = document.createElement('select'); 
                input.innerHTML = '<option value="">-- Carregando... --</option>'; 
                
                try {
                    let options;
                    if (field.options) {
                        options = field.options;
                    } else {
                        const fieldKeyForApi = (key === 'gas_emissor_composicao') ? 'tipo_gas' : key;
                        const response = await fetch(`/api/options?field_key=${fieldKeyForApi}`);
                        const optionsFromApi = await response.json();
                        options = optionsFromApi.map(opt => opt.value);
                    }
                    
                    input.innerHTML = '<option value="">-- Selecione --</option>';
                    options.forEach(opt => { 
                        input.innerHTML += `<option value="${opt}">${opt}</option>`; 
                    });
                } catch (error) {
                    console.error(`Erro ao buscar opções para ${key}:`, error);
                    input.innerHTML = '<option value="">-- Erro ao carregar --</option>';
                }

            } else { 
                input = document.createElement('input'); 
                input.type = field.type || 'text'; 
                if (field.type === 'number') { 
                    if (field.min !== undefined) input.min = field.min; 
                    if (field.max !== undefined) input.max = field.max; 
                    if (field.step !== undefined) input.step = field.step; 
                } 
            } 
            
            input.id = `field-${key}`; 
            input.dataset.key = key; 
            input.required = !field.showIf;
            
            fieldElements[key] = { row: formRow, input: input, config: field };

            formGroup.appendChild(label); 
            formGroup.appendChild(input); 
            formRow.appendChild(formGroup); 
            specificFieldsContainer.appendChild(formRow); 

            if (triggerFields.has(key)) {
                input.addEventListener('change', () => {
                    const selectedValue = input.value;
                    for (const fieldKey in fieldElements) {
                        const element = fieldElements[fieldKey];
                        const showIfConfig = element.config.showIf;
                        if (showIfConfig && showIfConfig.field === key) {
                            if (selectedValue === showIfConfig.value) {
                                element.row.style.display = '';
                                element.input.required = true;
                            } else {
                                element.row.style.display = 'none';
                                element.input.required = false;
                            }
                        }
                    }
                });
            }
        }
        
        triggerFields.forEach(triggerKey => {
            const triggerElement = fieldElements[triggerKey];
            if (triggerElement) {
                triggerElement.input.dispatchEvent(new Event('change'));
            }
        });
    }
    
    async function handleSaveFrequency() { if (!currentSourceType) return; frequencyFeedback.textContent = 'Salvando...'; frequencyFeedback.style.color = 'blue'; try { const response = await fetch('/api/source-configurations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ source_type: currentSourceType, reporting_frequency: reportingFrequencySelect.value }) }); if (!response.ok) throw new Error('Falha ao salvar configuração.'); const existingConfig = allConfigs.find(c => c.source_type === currentSourceType); if (existingConfig) { existingConfig.reporting_frequency = reportingFrequencySelect.value; } else { allConfigs.push({ source_type: currentSourceType, reporting_frequency: reportingFrequencySelect.value }); } frequencyFeedback.textContent = 'Frequência salva com sucesso!'; frequencyFeedback.style.color = 'green'; } catch (error) { console.error('Erro ao salvar frequência:', error); frequencyFeedback.textContent = 'Erro ao salvar.'; frequencyFeedback.style.color = 'red'; } }
    
    // --- EVENT LISTENERS ---
    sourceSelector.addEventListener('change', handleSourceSelection);
    saveFrequencyBtn.addEventListener('click', handleSaveFrequency);
    form.addEventListener('submit', handleFormSubmit);
    assetsTbody.addEventListener('click', handleTableClick);
    cancelBtn.addEventListener('click', resetForm);
    
    initializePage();
});
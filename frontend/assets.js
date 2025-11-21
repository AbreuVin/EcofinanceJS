// arquivo: frontend/assets.js


import { validationSchemas } from '../shared/validators.js';

document.addEventListener('DOMContentLoaded', () => {
    
    
    const assetSchemas = {
        combustao_estacionaria: { 
            displayName: "Combustão Estacionária", 
            fields: { 
                combustivel_estacionario: { label: "Combustível Padrão", type: "select" },
                unidade: { label: "Unidade de Consumo", type: "text", disabled: true } 
            } 
        },
        combustao_movel: { 
            displayName: "Combustão Móvel", 
            fields: { 
                
                tipo_entrada: { label: "Como os dados serão reportados?", type: "select", options: ["Por Consumo", "Por Distância"] }, 
                combustivel_movel: { label: "Combustível Padrão", type: "select", showIf: { field: "tipo_entrada", value: "Por Consumo" } }, 
                unidade_consumo: { label: "Unidade de Consumo", type: "text", showIf: { field: "tipo_entrada", value: "Por Consumo" }, disabled: true }, 
                tipo_veiculo: { label: "Tipo de Veículo Padrão", type: "select" }
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
                unidade: { label: "Unidade de Consumo Padrão", type: "select" } 
            } 
        },
        emissoes_fugitivas: { 
            displayName: "Emissões Fugitivas", 
            fields: { 
                tipo_gas: { label: "Gás Padrão", type: "select" }
            } 
        },
        fertilizantes: { 
            displayName: "Fertilizantes", 
            fields: { 
                percentual_nitrogenio: { label: "Percentual de Nitrogênio Padrão (%)", type: "number", min: 0, max: 100, step: 0.01 }, 
                percentual_carbonato: { label: "Percentual de Carbonato Padrão (%)", type: "number", min: 0, max: 100, step: 0.01 }
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
        efluentes_domesticos: {
            displayName: "Efluentes Domésticos",
            fields: {
                fossa_septica_propriedade: { label: "Fossa Séptica na Propriedade (Padrão)?", type: "select" }
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
    const reportingFrequencySelect = document.getElementById('reporting-frequency');
    const saveFrequencyBtn = document.getElementById('save-frequency-btn');
    const frequencyFeedback = document.getElementById('frequency-feedback');
    let currentSourceType = null;
    let allConfigs = [];

    
    async function initializePage() { if (navPlaceholder) { fetch('nav.html').then(response => response.text()).then(data => { navPlaceholder.innerHTML = data; }); } for (const sourceType in assetSchemas) { const option = document.createElement('option'); option.value = sourceType; option.textContent = assetSchemas[sourceType].displayName; sourceSelector.appendChild(option); } try { const [unitsResponse, configsResponse] = await Promise.all([ fetch('/api/units'), fetch('/api/source-configurations') ]); const unitsList = await unitsResponse.json(); allConfigs = await configsResponse.json(); unitSelect.innerHTML = '<option value="">-- Selecione --</option>'; if (unitsList.length > 1) { const allUnitsOption = document.createElement('option'); allUnitsOption.value = 'all'; allUnitsOption.textContent = '*** TODAS AS UNIDADES ***'; unitSelect.appendChild(allUnitsOption); } unitsList.forEach(unit => { const option = document.createElement('option'); option.value = unit.id; option.textContent = unit.name; unitSelect.appendChild(option); }); } catch (error) { console.error("Erro na inicialização da página:", error); } }
    async function handleSourceSelection() { currentSourceType = sourceSelector.value; resetForm(); frequencyFeedback.textContent = ''; if (!currentSourceType) { assetManagementSection.style.display = 'none'; return; } const schema = assetSchemas[currentSourceType]; formTitle.textContent = `Adicionar Nova Fonte`; tableTitle.textContent = `Fontes de ${schema.displayName} Cadastradas`; const currentConfig = allConfigs.find(c => c.source_type === currentSourceType); reportingFrequencySelect.value = currentConfig ? currentConfig.reporting_frequency : 'anual'; await buildDynamicForm(schema); buildDynamicTableHeaders(schema); loadAssetTypologies(); assetManagementSection.style.display = 'block'; }
    function buildDynamicTableHeaders(schema) { assetsThead.innerHTML = ''; const headerRow = document.createElement('tr'); let headers = '<th>Descrição</th><th>Unidade</th>'; for (const key in schema.fields) { headers += `<th>${schema.fields[key].label}</th>`; } headers += '<th>Ações</th>'; headerRow.innerHTML = headers; assetsThead.appendChild(headerRow); }
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
                        
                        
                        if (input.id.includes('tipo_entrada') || input.id.includes('tratamento_ou_destino') || input.id.includes('uso_solo_anterior')) {
                            input.dispatchEvent(new Event('change', { bubbles: true }));
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

        const triggerFields = ['field-tipo_entrada', 'field-tratamento_ou_destino', 'field-uso_solo_anterior', 'field-combustivel_movel', 'field-combustivel_estacionario'];
        triggerFields.forEach(id => {
            const trigger = document.getElementById(id);
            if (trigger) trigger.dispatchEvent(new Event('change'));
        });
    }

    
    async function buildDynamicForm(schema) { 
        specificFieldsContainer.innerHTML = ''; 
        const fieldElements = {};
        const triggerFields = new Set();
        const autoFillTriggers = new Set();

        const validationSchema = validationSchemas[currentSourceType];
        if (validationSchema && validationSchema.autoFillMap) {
            Object.keys(validationSchema.autoFillMap).forEach(key => autoFillTriggers.add(key));
        }

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
            } else { 
                input = document.createElement('input'); 
                input.type = field.type || 'text'; 
            }
            
            input.id = `field-${key}`; 
            input.dataset.key = key; 
            input.required = !field.showIf;
            if (field.disabled) input.disabled = true;

            if (field.type === 'select') {
                input.innerHTML = '<option value="">-- Selecione --</option>';
                const displayMap = validationSchema.displayValueMap?.[key];
                const options = validationSchema.validOptions?.[key] || field.options || [];

                
                if (displayMap) {
                    
                    options.forEach(value => {
                        const option = document.createElement('option');
                        option.value = value;
                        option.textContent = displayMap[value] || value; 
                        input.appendChild(option);
                    });
                } else {
                    
                    options.forEach(opt => {
                        const option = document.createElement('option');
                        option.value = opt;
                        option.textContent = opt;
                        input.appendChild(option);
                    });
                }
            }
            
            fieldElements[key] = { row: formRow, input: input, config: field };

            formGroup.appendChild(label); 
            formGroup.appendChild(input); 
            formRow.appendChild(formGroup); 
            specificFieldsContainer.appendChild(formRow); 

            if (triggerFields.has(key) || autoFillTriggers.has(key)) {
                input.addEventListener('change', () => {
                    const selectedValue = input.value;
                    
                    for (const fieldKey in fieldElements) {
                        const element = fieldElements[fieldKey];
                        const showIfConfig = element.config.showIf;
                        
                        if (showIfConfig && showIfConfig.field === key) {
                            
                            const assetValueMap = { "Por Consumo": "consumo", "Por Distância": "distancia" };
                            const expectedValue = assetValueMap[showIfConfig.value] || showIfConfig.value;

                            const isVisible = selectedValue === expectedValue;
                            element.row.style.display = isVisible ? '' : 'none';
                            element.input.required = isVisible;
                        }
                    }

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
                });
            }
        }
        
        new Set([...triggerFields, ...autoFillTriggers]).forEach(triggerKey => {
            const triggerElement = fieldElements[triggerKey];
            if (triggerElement) {
                triggerElement.input.dispatchEvent(new Event('change'));
            }
        });
    }
    
    async function handleSaveFrequency() { if (!currentSourceType) return; frequencyFeedback.textContent = 'Salvando...'; frequencyFeedback.style.color = 'blue'; try { const response = await fetch('/api/source-configurations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ source_type: currentSourceType, reporting_frequency: reportingFrequencySelect.value }) }); if (!response.ok) throw new Error('Falha ao salvar configuração.'); const existingConfig = allConfigs.find(c => c.source_type === currentSourceType); if (existingConfig) { existingConfig.reporting_frequency = reportingFrequencySelect.value; } else { allConfigs.push({ source_type: currentSourceType, reporting_frequency: reportingFrequencySelect.value }); } frequencyFeedback.textContent = 'Frequência salva com sucesso!'; frequencyFeedback.style.color = 'green'; } catch (error) { console.error('Erro ao salvar frequência:', error); frequencyFeedback.textContent = 'Erro ao salvar.'; frequencyFeedback.style.color = 'red'; } }
    
    
    sourceSelector.addEventListener('change', handleSourceSelection);
    saveFrequencyBtn.addEventListener('click', handleSaveFrequency);
    form.addEventListener('submit', handleFormSubmit);
    assetsTbody.addEventListener('click', handleTableClick);
    cancelBtn.addEventListener('click', resetForm);
    
    initializePage();
});
// arquivo: frontend/assets.js

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. SCHEMAS DE CONFIGURAÇÃO DOS ATIVOS ---
    const assetSchemas = {
        combustao_estacionaria: {
            displayName: "Combustão Estacionária",
            fields: {
                tipo_da_fonte: { label: "Tipo da Fonte", type: "select", options: ["Gerador de Energia", "Caldeira", "Forno", "Aquecedor", "Outro"] },
                combustivel: { label: "Combustível", type: "select", isCustomizable: true, options: ["Gás Natural", "Óleo Diesel", "Gás Liquefeito de Petróleo", "Carvão Mineral", "Lenha", "Biogás"] }
            }
        },
        combustao_movel: {
            displayName: "Combustão Móvel",
            fields: {
                tipo_veiculo: { label: "Tipo de Veículo", type: "select", options: [ "Automóvel a gasolina", "Automóvel a etanol", "Automóvel flex a gasolina", "Automóvel flex a etanol", "Motocicleta a gasolina", "Motocicleta flex a gasolina", "Motocicleta flex a etanol", "Veículo comercial leve a gasolina", "Veículo comercial leve a etanol", "Veículo comercial leve flex a gasolina", "Veículo comercial leve flex a etanol", "Veículo comercial leve a diesel", "Micro-ônibus a diesel", "Ônibus rodoviário a diesel", "Ônibus urbano a diesel", "Caminhão - rígido (3,5 a 7,5 toneladas)", "Caminhão - rígido (7,5 a 17 toneladas)", "Caminhão - rígido (acima de 17 toneladas)", "Caminhão - rígido (média)", "Caminhão - articulado (3,5 a 33 toneladas)", "Caminhão - articulado (acima de 33 toneladas)", "Caminhão - articulado (média)", "Caminhão - caminhão (média)", "Caminhão refrigerado - rígido (3,5 a 7,5 toneladas)", "Caminhão refrigerado - rígido (7,5 a 17 toneladas)", "Caminhão refrigerado - rígido (acima de 17 toneladas)", "Caminhão refrigerado - rígido (média)", "Caminhão refrigerado - articulado (3,5 a 33 toneladas)", "Caminhão refrigerado - articulado (acima de 33 toneladas)", "Caminhão refrigerado - articulado (média)", "Caminhão refrigerado - caminhão (média)", "Automóvel a GNV" ] },
                controlado_empresa: { label: "Controlado pela Empresa?", type: "select", options: ["Sim", "Não"] }
            }
        },
        dados_producao_venda: {
            displayName: "Dados de Produção e Venda",
            fields: {
                produto: { label: "Nome do Produto", type: "text" },
                unidade_medida: { label: "Unidade de Medida", type: "text", isCustomizable: true },
                uso_final_produtos: { label: "Uso Final (Padrão)", type: "text" }
            }
        },
        ippu_lubrificantes: {
            displayName: "IPPU - Lubrificantes",
            fields: {
                tipo_lubrificante: { label: "Tipo", type: "select", isCustomizable: true, options: ["Lubrificante", "Graxa"]},
                unidade: { label: "Unidade de Consumo", type: "select", options: ["Litros", "kg"]},
                utilizacao: { label: "Utilização Padrão", type: "text" }
            }
        },
        emissoes_fugitivas: {
            displayName: "Emissões Fugitivas",
            fields: {
                tipo_gas: { label: "Tipo de Gás Padrão", type: "select", options: ["Dióxido de carbono (CO2)", "Metano (CH4)", "Óxido nitroso (N2O)", "HFC-134a", "HFC-404A", "HFC-410A", "HCFC-22", "HFC-32", "Outro (Gás Composto)"] }
            }
        },
        fertilizantes: {
            displayName: "Fertilizantes",
            fields: {
                tipo_fertilizante: { label: "Tipo de Fertilizante", type: "text", isCustomizable: true },
                percentual_nitrogenio: { label: "Percentual de Nitrogênio (%)", type: "number", min: 0, max: 100, step: 0.01 },
                percentual_carbonato: { label: "Percentual de Carbonato (%)", type: "number", min: 0, max: 100, step: 0.01 }
            }
        }
    };

    // --- 2. REFERÊNCIAS DO DOM ---
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
    const customOptionFieldSelector = document.getElementById('custom-option-field-selector');
    const customOptionManager = document.getElementById('custom-option-manager');
    const newCustomOptionValueInput = document.getElementById('new-custom-option-value');
    const addCustomOptionBtn = document.getElementById('add-custom-option-btn');
    const customOptionsListContainer = document.getElementById('custom-options-list-container');
    const customOptionFeedback = document.getElementById('custom-option-feedback');

    let currentSourceType = null;
    let allConfigs = []; 

    // --- 3. FUNÇÕES PRINCIPAIS ---

    async function initializePage() {
        if (navPlaceholder) { fetch('nav.html').then(response => response.text()).then(data => { navPlaceholder.innerHTML = data; }); }
        
        const customizableFields = {};
        for (const sourceType in assetSchemas) {
            const option = document.createElement('option');
            option.value = sourceType;
            option.textContent = assetSchemas[sourceType].displayName;
            sourceSelector.appendChild(option);

            for (const fieldKey in assetSchemas[sourceType].fields) {
                if (assetSchemas[sourceType].fields[fieldKey].isCustomizable) {
                    if (!customizableFields[fieldKey]) {
                        customizableFields[fieldKey] = assetSchemas[sourceType].fields[fieldKey].label;
                    }
                }
            }
        }
        
        for (const key in customizableFields) {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = customizableFields[key];
            customOptionFieldSelector.appendChild(option);
        }

        try {
            const [unitsResponse, configsResponse] = await Promise.all([ fetch('/api/units'), fetch('/api/source-configurations') ]);
            const unitsList = await unitsResponse.json();
            allConfigs = await configsResponse.json();
            unitSelect.innerHTML = '<option value="">-- Selecione --</option>';
            unitsList.forEach(unit => {
                const option = document.createElement('option');
                option.value = unit.id;
                option.textContent = unit.name;
                unitSelect.appendChild(option);
            });
        } catch (error) { console.error("Erro na inicialização da página:", error); }
    }

    async function handleSourceSelection() {
        currentSourceType = sourceSelector.value;
        resetForm();
        frequencyFeedback.textContent = '';
        if (!currentSourceType) {
            assetManagementSection.style.display = 'none';
            return;
        }

        const schema = assetSchemas[currentSourceType];
        formTitle.textContent = `Adicionar Nova Fonte`;
        tableTitle.textContent = `Fontes de ${schema.displayName} Cadastradas`;
        
        const currentConfig = allConfigs.find(c => c.source_type === currentSourceType);
        reportingFrequencySelect.value = currentConfig ? currentConfig.reporting_frequency : 'anual';

        await buildDynamicForm(schema);
        buildDynamicTableHeaders(schema);
        loadAssetTypologies();
        
        assetManagementSection.style.display = 'block';
    }

    function buildDynamicTableHeaders(schema) {
        assetsThead.innerHTML = '';
        const headerRow = document.createElement('tr');
        // Coluna "Qtd." foi REMOVIDA
        let headers = '<th>Descrição</th><th>Unidade</th>';
        for (const key in schema.fields) {
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
                // Coluna "quantity" foi REMOVIDA
                let rowHtml = `<td>${typo.description}</td><td>${typo.unit_name}</td>`;
                
                const schema = assetSchemas[currentSourceType];
                for (const key in schema.fields) {
                    rowHtml += `<td>${typo.asset_fields[key] || ''}</td>`;
                }

                rowHtml += `<td>
                    <button class="action-btn edit-btn" data-id="${typo.id}">Editar</button>
                    <button class="action-btn delete-btn" data-id="${typo.id}">Deletar</button>
                </td>`;
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
        specificFieldsContainer.querySelectorAll('input, select').forEach(input => {
            asset_fields[input.dataset.key] = input.value;
        });

        // "quantity" foi REMOVIDO do objeto de dados
        const data = {
            description: document.getElementById('asset-description').value,
            unit_id: document.getElementById('asset-unit').value,
            source_type: currentSourceType,
            asset_fields: asset_fields
        };

        const method = id ? 'PUT' : 'POST';
        const url = id ? `/api/asset-typologies/${id}` : '/api/asset-typologies';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error('Falha ao salvar a fonte.');

            resetForm();
            loadAssetTypologies();

        } catch (error) {
            console.error("Erro ao salvar:", error);
            alert('Ocorreu um erro ao salvar. Verifique o console para mais detalhes.');
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
                document.getElementById('asset-description').value = typoToEdit.description;
                document.getElementById('asset-unit').value = typoToEdit.unit_id;
                // "quantity" foi REMOVIDO daqui
                
                await buildDynamicForm(assetSchemas[currentSourceType]); 
                specificFieldsContainer.querySelectorAll('input, select').forEach(input => {
                    input.value = typoToEdit.asset_fields[input.dataset.key] || '';
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
    }

    // --- Demais funções e Listeners ---
    // (buildDynamicForm, handleAddCustomOption, etc. permanecem como no prompt anterior)
    async function buildDynamicForm(schema) { specificFieldsContainer.innerHTML = ''; for (const key in schema.fields) { const field = schema.fields[key]; const formRow = document.createElement('div'); formRow.className = 'form-row'; const formGroup = document.createElement('div'); formGroup.className = 'form-group'; const label = document.createElement('label'); label.setAttribute('for', `field-${key}`); label.textContent = field.label; let input; if (field.type === 'select') { input = document.createElement('select'); input.innerHTML = '<option value="">-- Selecione --</option>'; let options = field.options || []; if (field.isCustomizable) { try { const response = await fetch(`/api/custom-options?field_key=${key}`); const customOptions = await response.json(); options = customOptions.map(opt => opt.value); } catch (error) { console.error(`Erro ao buscar opções para ${key}:`, error); } } options.forEach(opt => { input.innerHTML += `<option value="${opt}">${opt}</option>`; }); } else { input = document.createElement('input'); input.type = field.type || 'text'; if (field.type === 'number') { if (field.min !== undefined) input.min = field.min; if (field.max !== undefined) input.max = field.max; if (field.step !== undefined) input.step = field.step; } } input.id = `field-${key}`; input.dataset.key = key; input.required = true; formGroup.appendChild(label); formGroup.appendChild(input); formRow.appendChild(formGroup); specificFieldsContainer.appendChild(formRow); } }
    async function handleSaveFrequency() { if (!currentSourceType) return; frequencyFeedback.textContent = 'Salvando...'; frequencyFeedback.style.color = 'blue'; try { const response = await fetch('/api/source-configurations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ source_type: currentSourceType, reporting_frequency: reportingFrequencySelect.value }) }); if (!response.ok) throw new Error('Falha ao salvar configuração.'); const existingConfig = allConfigs.find(c => c.source_type === currentSourceType); if (existingConfig) { existingConfig.reporting_frequency = reportingFrequencySelect.value; } else { allConfigs.push({ source_type: currentSourceType, reporting_frequency: reportingFrequencySelect.value }); } frequencyFeedback.textContent = 'Frequência salva com sucesso!'; frequencyFeedback.style.color = 'green'; } catch (error) { console.error('Erro ao salvar frequência:', error); frequencyFeedback.textContent = 'Erro ao salvar.'; frequencyFeedback.style.color = 'red'; } }
    async function handleCustomFieldSelection() { const fieldKey = customOptionFieldSelector.value; if (!fieldKey) { customOptionManager.style.display = 'none'; return; } await loadCustomOptions(fieldKey); customOptionManager.style.display = 'block'; }
    async function loadCustomOptions(fieldKey) { customOptionsListContainer.innerHTML = '<li>Carregando...</li>'; try { const response = await fetch(`/api/custom-options?field_key=${fieldKey}`); const options = await response.json(); customOptionsListContainer.innerHTML = ''; if (options.length === 0) { customOptionsListContainer.innerHTML = '<li>Nenhuma opção cadastrada.</li>'; } options.forEach(opt => { const li = document.createElement('li'); li.textContent = opt.value; const deleteBtn = document.createElement('button'); deleteBtn.textContent = 'X'; deleteBtn.dataset.id = opt.id; deleteBtn.onclick = () => handleDeleteCustomOption(opt.id); li.appendChild(deleteBtn); customOptionsListContainer.appendChild(li); }); } catch (error) { console.error('Erro ao carregar opções:', error); customOptionsListContainer.innerHTML = '<li>Erro ao carregar opções.</li>'; } }
    async function handleAddCustomOption() { const fieldKey = customOptionFieldSelector.value; const value = newCustomOptionValueInput.value.trim(); if (!fieldKey || !value) { customOptionFeedback.textContent = 'Selecione um campo e digite um valor.'; customOptionFeedback.style.color = 'red'; return; } try { await fetch('/api/custom-options', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ field_key: fieldKey, value: value }) }); newCustomOptionValueInput.value = ''; customOptionFeedback.textContent = ''; await loadCustomOptions(fieldKey); if (currentSourceType && assetSchemas[currentSourceType].fields[fieldKey]) { await buildDynamicForm(assetSchemas[currentSourceType]); } } catch (error) { console.error('Erro ao adicionar opção:', error); } }
    async function handleDeleteCustomOption(optionId) { if (!confirm('Tem certeza que deseja deletar esta opção?')) return; try { await fetch(`/api/custom-options/${optionId}`, { method: 'DELETE' }); const fieldKey = customOptionFieldSelector.value; await loadCustomOptions(fieldKey); if (currentSourceType && assetSchemas[currentSourceType].fields[fieldKey]) { await buildDynamicForm(assetSchemas[currentSourceType]); } } catch (error) { console.error('Erro ao deletar opção:', error); } }
    sourceSelector.addEventListener('change', handleSourceSelection);
    saveFrequencyBtn.addEventListener('click', handleSaveFrequency);
    customOptionFieldSelector.addEventListener('change', handleCustomFieldSelection);
    addCustomOptionBtn.addEventListener('click', handleAddCustomOption);
    form.addEventListener('submit', handleFormSubmit);
    assetsTbody.addEventListener('click', handleTableClick);
    cancelBtn.addEventListener('click', resetForm);
    initializePage();
});
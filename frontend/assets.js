// arquivo: frontend/assets.js

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. SCHEMAS DE CONFIGURAÇÃO DOS ATIVOS ---
    const assetSchemas = {
        combustao_estacionaria: {
            displayName: "Combustão Estacionária",
            fields: {
                combustivel: { label: "Combustível", type: "select", isCustomizable: true, options: ["Gás Natural", "Óleo Diesel", "Gás Liquefeito de Petróleo", "Carvão Mineral", "Lenha", "Biogás"] },
                controlado_empresa: { label: "Controlado pela Empresa?", type: "select", options: ["Sim", "Não"] }
            }
        },
        combustao_movel: {
            displayName: "Combustão Móvel",
            fields: {
                tipo_veiculo: { label: "Tipo de Veículo", type: "select", options: [ "Automóvel a gasolina" /* ... (lista original completa aqui) ... */, "Automóvel a GNV" ] },
                controlado_empresa: { label: "Controlado pela Empresa?", type: "select", options: ["Sim", "Não"] }
            }
        },
        dados_producao_venda: {
            displayName: "Dados de Produção e Venda",
            fields: {
                unidade_medida: { label: "Unidade de Medida", type: "text" }, // Não é mais customizável aqui
                uso_final_produtos: { label: "Uso Final (Padrão)", type: "text" }
            }
        },
        ippu_lubrificantes: {
            displayName: "IPPU - Lubrificantes",
            fields: {
                tipo_lubrificante: { label: "Tipo de Lubrificante", type: "select", isCustomizable: true, options: ["Lubrificante", "Graxa"]},
                unidade: { label: "Unidade de Consumo", type: "select", options: ["Litros", "kg"]},
                utilizacao: { label: "Utilização Padrão", type: "text" },
                controlado_empresa: { label: "Controlado pela Empresa?", type: "select", options: ["Sim", "Não"] }
            }
        },
        emissoes_fugitivas: {
            displayName: "Emissões Fugitivas",
            fields: {
                tipo_gas: { label: "Tipo de Gás Padrão", type: "select", options: ["Dióxido de carbono (CO2)", "Metano (CH4)", "Óxido nitroso (N2O)", "HFC-134a", "HFC-404A", "HFC-410A", "HCFC-22", "HFC-32", "Outro (Gás Composto)"] },
                controlado_empresa: { label: "Controlado pela Empresa?", type: "select", options: ["Sim", "Não"] }
            }
        },
        fertilizantes: {
            displayName: "Fertilizantes",
            fields: {
                percentual_nitrogenio: { label: "Percentual de Nitrogênio (%)", type: "number", min: 0, max: 100, step: 0.01 },
                percentual_carbonato: { label: "Percentual de Carbonato (%)", type: "number", min: 0, max: 100, step: 0.01 },
                controlado_empresa: { label: "Controlado pela Empresa?", type: "select", options: ["Sim", "Não"] }
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

    let currentSourceType = null;
    let allConfigs = []; 

    // --- 3. FUNÇÕES PRINCIPAIS ---

    async function initializePage() {
        if (navPlaceholder) { fetch('nav.html').then(response => response.text()).then(data => { navPlaceholder.innerHTML = data; }); }
        
        for (const sourceType in assetSchemas) {
            const option = document.createElement('option');
            option.value = sourceType;
            option.textContent = assetSchemas[sourceType].displayName;
            sourceSelector.appendChild(option);
        }
        
        try {
            const [unitsResponse, configsResponse] = await Promise.all([ fetch('/api/units'), fetch('/api/source-configurations') ]);
            const unitsList = await unitsResponse.json();
            allConfigs = await configsResponse.json();
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

    // A função buildDynamicTableHeaders permanece inalterada
    function buildDynamicTableHeaders(schema) {
        assetsThead.innerHTML = '';
        const headerRow = document.createElement('tr');
        let headers = '<th>Descrição</th><th>Unidade</th>';
        for (const key in schema.fields) {
            headers += `<th>${schema.fields[key].label}</th>`;
        }
        headers += '<th>Ações</th>';
        headerRow.innerHTML = headers;
        assetsThead.appendChild(headerRow);
    }
    
    // A função loadAssetTypologies permanece inalterada
    async function loadAssetTypologies() {
        if (!currentSourceType) return;
        try {
            const response = await fetch(`/api/asset-typologies?source_type=${currentSourceType}`);
            const typologies = await response.json();
            assetsTbody.innerHTML = '';

            typologies.forEach(typo => {
                const tr = document.createElement('tr');
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
    
    // A função handleFormSubmit permanece inalterada
    async function handleFormSubmit(e) {
        e.preventDefault();
        const id = assetIdInput.value;
        const asset_fields = {};
        specificFieldsContainer.querySelectorAll('input, select').forEach(input => {
            asset_fields[input.dataset.key] = input.value;
        });
        const unitValue = document.getElementById('asset-unit').value;
        const data = {
            description: document.getElementById('asset-description').value,
            unit_id: unitValue,
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

    // A função handleTableClick permanece inalterada
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
    
    // A função resetForm permanece inalterada
    function resetForm() {
        form.reset();
        assetIdInput.value = '';
        if (currentSourceType) {
            formTitle.textContent = `Adicionar Nova Fonte`;
        }
        cancelBtn.style.display = 'none';
    }

    // --- ATENÇÃO: MUDANÇA SIGNIFICATIVA AQUI ---
    async function buildDynamicForm(schema) { 
        specificFieldsContainer.innerHTML = ''; 
        for (const key in schema.fields) { 
            const field = schema.fields[key]; 
            const formRow = document.createElement('div'); 
            formRow.className = 'form-row'; 
            const formGroup = document.createElement('div'); 
            formGroup.className = 'form-group'; 
            const label = document.createElement('label'); 
            label.setAttribute('for', `field-${key}`); 
            label.textContent = field.label; 
            let input; 
            
            // Lógica refatorada para buscar opções da API
            if (field.type === 'select') {
                input = document.createElement('select'); 
                input.innerHTML = '<option value="">-- Carregando... --</option>'; 
                
                try {
                    // Chave para buscar no DB (ex: 'combustivel', 'tipo_veiculo')
                    const fieldKeyForApi = key; 
                    
                    // As opções agora vêm da API, não do schema local
                    const response = await fetch(`/api/options?field_key=${fieldKeyForApi}`);
                    const optionsFromApi = await response.json();
                    
                    input.innerHTML = '<option value="">-- Selecione --</option>'; // Limpa o "Carregando..."
                    
                    optionsFromApi.forEach(opt => { 
                        input.innerHTML += `<option value="${opt.value}">${opt.value}</option>`; 
                    });
                } catch (error) {
                    console.error(`Erro ao buscar opções para ${key}:`, error);
                    input.innerHTML = '<option value="">-- Erro ao carregar --</option>';
                }

            } else { // Para inputs de texto, número, etc.
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
            input.required = true; 
            formGroup.appendChild(label); 
            formGroup.appendChild(input); 
            formRow.appendChild(formGroup); 
            specificFieldsContainer.appendChild(formRow); 
        } 
    }
    
    // A função handleSaveFrequency permanece inalterada
    async function handleSaveFrequency() { 
        if (!currentSourceType) return; 
        frequencyFeedback.textContent = 'Salvando...'; 
        frequencyFeedback.style.color = 'blue'; 
        try { 
            const response = await fetch('/api/source-configurations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ source_type: currentSourceType, reporting_frequency: reportingFrequencySelect.value }) }); 
            if (!response.ok) throw new Error('Falha ao salvar configuração.'); 
            const existingConfig = allConfigs.find(c => c.source_type === currentSourceType); 
            if (existingConfig) { 
                existingConfig.reporting_frequency = reportingFrequencySelect.value; 
            } else { 
                allConfigs.push({ source_type: currentSourceType, reporting_frequency: reportingFrequencySelect.value }); 
            } 
            frequencyFeedback.textContent = 'Frequência salva com sucesso!'; 
            frequencyFeedback.style.color = 'green'; 
        } catch (error) { 
            console.error('Erro ao salvar frequência:', error); 
            frequencyFeedback.textContent = 'Erro ao salvar.'; 
            frequencyFeedback.style.color = 'red'; 
        } 
    }
    
    // Adicionando os event listeners
    sourceSelector.addEventListener('change', handleSourceSelection);
    saveFrequencyBtn.addEventListener('click', handleSaveFrequency);
    form.addEventListener('submit', handleFormSubmit);
    assetsTbody.addEventListener('click', handleTableClick);
    cancelBtn.addEventListener('click', resetForm);
    
    // Inicializa a página
    initializePage();
});
// arquivo: frontend/assets.js

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. SCHEMAS DE CONFIGURAÇÃO DOS ATIVOS ---
    // O "cérebro" desta página. Define como construir o formulário e a tabela para cada fonte.
    const assetSchemas = {
        combustao_estacionaria: {
            displayName: "Combustão Estacionária",
            fields: {
                tipo_da_fonte: { label: "Tipo da Fonte", type: "select", options: ["Gerador de Energia", "Caldeira", "Forno", "Aquecedor", "Outro"] },
                combustivel: { label: "Combustível", type: "select", options: ["Gás Natural", "Óleo Diesel", "Gás Liquefeito de Petróleo", "Carvão Mineral", "Lenha", "Biogás"] }
            }
        },
        combustao_movel: {
            displayName: "Combustão Móvel",
            fields: {
                tipo_veiculo: { label: "Tipo de Veículo", type: "select", options: [ "Automóvel a gasolina", "Automóvel a etanol", "Automóvel flex a gasolina", "Automóvel flex a etanol", "Motocicleta a gasolina", "Motocicleta flex a gasolina", "Motocicleta flex a etanol", "Veículo comercial leve a gasolina", "Veículo comercial leve a etanol", "Veículo comercial leve flex a gasolina", "Veículo comercial leve flex a etanol", "Veículo comercial leve a diesel", "Micro-ônibus a diesel", "Ônibus rodoviário a diesel", "Ônibus urbano a diesel", "Caminhão - rígido (3,5 a 7,5 toneladas)", "Caminhão - rígido (7,5 a 17 toneladas)", "Caminhão - rígido (acima de 17 toneladas)", "Caminhão - rígido (média)", "Caminhão - articulado (3,5 a 33 toneladas)", "Caminhão - articulado (acima de 33 toneladas)", "Caminhão - articulado (média)", "Caminhão - caminhão (média)", "Caminhão refrigerado - rígido (3,5 a 7,5 toneladas)", "Caminhão refrigerado - rígido (7,5 a 17 toneladas)", "Caminhão refrigerado - rígido (acima de 17 toneladas)", "Caminhão refrigerado - rígido (média)", "Caminhão refrigerado - articulado (3,5 a 33 toneladas)", "Caminhão refrigerado - articulado (acima de 33 toneladas)", "Caminhão refrigerado - articulado (média)", "Caminhão refrigerado - caminhão (média)", "Automóvel a GNV" ] },
                controlado_empresa: { label: "Controlado pela Empresa?", type: "select", options: ["Sim", "Não"] }
            }
        },
        // Adicionar outros schemas aqui no futuro (producao_venda, lubrificantes, etc.)
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

    let currentSourceType = null;
    let unitsList = [];

    // --- 3. FUNÇÕES PRINCIPAIS ---

    // Carrega navbar e preenche os seletores iniciais
    async function initializePage() {
        if (navPlaceholder) {
            fetch('nav.html').then(response => response.text()).then(data => { navPlaceholder.innerHTML = data; });
        }
        
        // Preenche o seletor de fontes
        for (const key in assetSchemas) {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = assetSchemas[key].displayName;
            sourceSelector.appendChild(option);
        }

        // Carrega a lista de unidades empresariais
        try {
            const response = await fetch('/api/units');
            unitsList = await response.json();
            unitSelect.innerHTML = '<option value="">-- Selecione --</option>';
            unitsList.forEach(unit => {
                const option = document.createElement('option');
                option.value = unit.id;
                option.textContent = unit.name;
                unitSelect.appendChild(option);
            });
        } catch (error) {
            console.error("Erro ao carregar unidades:", error);
        }
    }

    // Função chamada quando o usuário seleciona uma fonte de emissão
    function handleSourceSelection() {
        currentSourceType = sourceSelector.value;
        if (!currentSourceType) {
            assetManagementSection.style.display = 'none';
            return;
        }

        const schema = assetSchemas[currentSourceType];
        formTitle.textContent = `Adicionar Nova Fonte de Emissão de ${schema.displayName}`;
        tableTitle.textContent = `Tipologias de ${schema.displayName} Cadastradas`;
        
        buildDynamicForm(schema);
        buildDynamicTableHeaders(schema);
        loadAssetTypologies();
        
        assetManagementSection.style.display = 'block';
    }

    // Constrói os campos específicos do formulário
    function buildDynamicForm(schema) {
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
            if (field.type === 'select') {
                input = document.createElement('select');
                input.innerHTML = '<option value="">-- Selecione --</option>';
                field.options.forEach(opt => {
                    input.innerHTML += `<option value="${opt}">${opt}</option>`;
                });
            } else { // Padrão é 'text'
                input = document.createElement('input');
                input.type = 'text';
            }
            input.id = `field-${key}`;
            input.dataset.key = key; // Guarda a chave original do campo
            input.required = true;

            formGroup.appendChild(label);
            formGroup.appendChild(input);
            formRow.appendChild(formGroup);
            specificFieldsContainer.appendChild(formRow);
        }
    }

    // Constrói os cabeçalhos da tabela
    function buildDynamicTableHeaders(schema) {
        assetsThead.innerHTML = '';
        const headerRow = document.createElement('tr');
        let headers = '<th>Descrição</th><th>Unidade</th><th>Qtd.</th>';
        for (const key in schema.fields) {
            headers += `<th>${schema.fields[key].label}</th>`;
        }
        headers += '<th>Ações</th>';
        headerRow.innerHTML = headers;
        assetsThead.appendChild(headerRow);
    }

    // Carrega e exibe as tipologias da API
    async function loadAssetTypologies() {
        if (!currentSourceType) return;
        try {
            const response = await fetch(`/api/asset-typologies?source_type=${currentSourceType}`);
            const typologies = await response.json();
            assetsTbody.innerHTML = '';

            typologies.forEach(typo => {
                const tr = document.createElement('tr');
                let rowHtml = `<td>${typo.description}</td><td>${typo.unit_name}</td><td>${typo.quantity}</td>`;
                
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

    // Lida com o submit do formulário (Criar ou Atualizar)
    async function handleFormSubmit(e) {
        e.preventDefault();
        const id = assetIdInput.value;
        
        const asset_fields = {};
        specificFieldsContainer.querySelectorAll('input, select').forEach(input => {
            asset_fields[input.dataset.key] = input.value;
        });

        const data = {
            description: document.getElementById('asset-description').value,
            unit_id: document.getElementById('asset-unit').value,
            quantity: document.getElementById('asset-quantity').value,
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
            if (!response.ok) throw new Error('Falha ao salvar a tipologia.');

            resetForm();
            loadAssetTypologies();

        } catch (error) {
            console.error("Erro ao salvar:", error);
        }
    }

    // Lida com cliques na tabela (Editar ou Deletar)
    async function handleTableClick(e) {
        const target = e.target;
        const id = target.dataset.id;
        if (!id) return;

        if (target.classList.contains('edit-btn')) {
            // Buscar dados completos do ativo para preencher o form
            const response = await fetch(`/api/asset-typologies?source_type=${currentSourceType}`);
            const typologies = await response.json();
            const typoToEdit = typologies.find(t => t.id == id);
            
            if (typoToEdit) {
                assetIdInput.value = typoToEdit.id;
                document.getElementById('asset-description').value = typoToEdit.description;
                document.getElementById('asset-unit').value = typoToEdit.unit_id;
                document.getElementById('asset-quantity').value = typoToEdit.quantity;
                
                specificFieldsContainer.querySelectorAll('input, select').forEach(input => {
                    input.value = typoToEdit.asset_fields[input.dataset.key] || '';
                });

                formTitle.textContent = `Editando Tipologia: ${typoToEdit.description}`;
                cancelBtn.style.display = 'inline-block';
                window.scrollTo(0,0); // Rola a página para o topo
            }
        } else if (target.classList.contains('delete-btn')) {
            if (confirm('Tem certeza que deseja deletar esta tipologia?')) {
                try {
                    await fetch(`/api/asset-typologies/${id}`, { method: 'DELETE' });
                    loadAssetTypologies();
                } catch (error) {
                    console.error("Erro ao deletar:", error);
                }
            }
        }
    }

    function resetForm() {
        form.reset();
        assetIdInput.value = '';
        formTitle.textContent = `Adicionar Nova Tipologia de ${assetSchemas[currentSourceType].displayName}`;
        cancelBtn.style.display = 'none';
    }


    // --- 4. EVENT LISTENERS ---
    sourceSelector.addEventListener('change', handleSourceSelection);
    form.addEventListener('submit', handleFormSubmit);
    assetsTbody.addEventListener('click', handleTableClick);
    cancelBtn.addEventListener('click', resetForm);

    // --- 5. INICIALIZAÇÃO ---
    initializePage();
});
// arquivo: frontend/admin.js

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. SCHEMAS E CONFIGURAÇÕES ---
    // ATENÇÃO: Esta lista agora inclui TODOS os campos de dropdown que a Ecofinance pode gerenciar.
    // As chaves (ex: 'combustivel_movel') são únicas para evitar conflitos, mas podem apontar para o mesmo
    // field_key no banco de dados ('combustivel').
    const managedFieldsConfig = {
        // --- Combustão Móvel ---
        combustivel_movel: { displayName: "Combustível (Móvel)", fieldKey: "combustivel" },
        tipo_veiculo: { displayName: "Tipo de Veículo (Móvel)", fieldKey: "tipo_veiculo" },
        unidade_consumo: { displayName: "Unidade de Consumo (Móvel)", fieldKey: "unidade_consumo" },
        unidade_distancia: { displayName: "Unidade de Distância (Móvel)", fieldKey: "unidade_distancia" },
        
        // --- Combustão Estacionária ---
        combustivel_estacionaria: { displayName: "Combustível (Estacionária)", fieldKey: "combustivel" },
        unidade_estacionaria: { displayName: "Unidade (Estacionária)", fieldKey: "unidade" },
        
        // --- IPPU Lubrificantes ---
        tipo_lubrificante: { displayName: "Tipo de Lubrificante (IPPU)", fieldKey: "tipo_lubrificante" },
        unidade_lubrificante: { displayName: "Unidade (IPPU)", fieldKey: "unidade" },
        
        // --- Emissões Fugitivas ---
        tipo_gas: { displayName: "Tipo de Gás (Fugitivas)", fieldKey: "tipo_gas" },
        
        // --- Outros ---
        periodo: { displayName: "Período de Reporte (Global)", fieldKey: "periodo" },
    };

    // --- 2. REFERÊNCIAS DO DOM ---
    const navPlaceholder = document.getElementById('nav-placeholder');
    const customOptionFieldSelector = document.getElementById('custom-option-field-selector');
    const customOptionManager = document.getElementById('custom-option-manager');
    const newCustomOptionValueInput = document.getElementById('new-custom-option-value');
    const addCustomOptionBtn = document.getElementById('add-custom-option-btn');
    const customOptionsListContainer = document.getElementById('custom-options-list-container');
    const customOptionFeedback = document.getElementById('custom-option-feedback');
    
    let currentFieldKey = null; // Armazena a chave do campo selecionado para o DB

    // --- 3. FUNÇÕES DE LÓGICA ---

    async function handleCustomFieldSelection() {
        const selectedManagerKey = customOptionFieldSelector.value;
        if (!selectedManagerKey) {
            customOptionManager.style.display = 'none';
            currentFieldKey = null;
            return;
        }
        
        // Pega a chave real para consultar o banco de dados
        currentFieldKey = managedFieldsConfig[selectedManagerKey].fieldKey;
        
        await loadCustomOptions(currentFieldKey);
        customOptionManager.style.display = 'block';
    }

    async function loadCustomOptions(fieldKey) {
        customOptionsListContainer.innerHTML = '<li>Carregando...</li>';
        try {
            // ATENÇÃO: A URL da API foi atualizada para /api/options
            const response = await fetch(`/api/options?field_key=${fieldKey}`);
            if (!response.ok) throw new Error('Falha ao buscar opções.');
            
            const options = await response.json();
            customOptionsListContainer.innerHTML = '';
            
            if (options.length === 0) {
                customOptionsListContainer.innerHTML = '<li>Nenhuma opção cadastrada para este campo.</li>';
            } else {
                options.forEach(opt => {
                    const li = document.createElement('li');
                    li.textContent = opt.value;
                    const deleteBtn = document.createElement('button');
                    deleteBtn.textContent = 'X';
                    deleteBtn.title = 'Deletar esta opção';
                    deleteBtn.dataset.id = opt.id;
                    deleteBtn.onclick = () => handleDeleteCustomOption(opt.id);
                    li.appendChild(deleteBtn);
                    customOptionsListContainer.appendChild(li);
                });
            }
        } catch (error) {
            console.error('Erro ao carregar opções:', error);
            customOptionsListContainer.innerHTML = '<li>Erro ao carregar opções. Verifique o console.</li>';
        }
    }

    async function handleAddCustomOption() {
        const value = newCustomOptionValueInput.value.trim();

        if (!currentFieldKey || !value) {
            customOptionFeedback.textContent = 'Por favor, selecione um campo e digite um valor para a nova opção.';
            customOptionFeedback.style.color = 'red';
            return;
        }

        try {
            // ATENÇÃO: A URL da API foi atualizada para /api/options
            const response = await fetch('/api/options', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ field_key: currentFieldKey, value: value })
            });

            if (!response.ok) {
                 const errorData = await response.json();
                 if (response.status === 500 && errorData.error.includes('UNIQUE constraint failed')) {
                     throw new Error(`A opção "${value}" já existe para este campo.`);
                 }
                 throw new Error(errorData.message || 'Erro desconhecido do servidor.');
            }

            newCustomOptionValueInput.value = '';
            customOptionFeedback.textContent = '';
            await loadCustomOptions(currentFieldKey);

        } catch (error) {
            console.error('Erro ao adicionar opção:', error);
            customOptionFeedback.textContent = `Erro: ${error.message}`;
            customOptionFeedback.style.color = 'red';
        }
    }

    async function handleDeleteCustomOption(optionId) {
        if (!confirm('Tem certeza que deseja deletar esta opção? Ela será removida de todos os lugares onde aparece.')) return;
        
        try {
            // ATENÇÃO: A URL da API foi atualizada para /api/options
            const response = await fetch(`/api/options/${optionId}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Falha ao deletar opção.');

            await loadCustomOptions(currentFieldKey);

        } catch (error) {
            console.error('Erro ao deletar opção:', error);
            alert('Ocorreu um erro ao deletar a opção. Verifique o console.');
        }
    }

    // --- 4. INICIALIZAÇÃO DA PÁGINA ---
    function initializePage() {
        if (navPlaceholder) {
            fetch('nav.html')
                .then(response => response.ok ? response.text() : Promise.reject('nav.html não encontrado.'))
                .then(data => { navPlaceholder.innerHTML = data; })
                .catch(error => console.error('Erro ao carregar a barra de navegação:', error));
        }

        customOptionFieldSelector.innerHTML = '<option value="">-- Selecione um Campo --</option>';
        // Popula o seletor usando a nova configuração
        for (const key in managedFieldsConfig) {
            const option = document.createElement('option');
            option.value = key; // Usa a chave única do objeto (ex: combustivel_movel)
            option.textContent = managedFieldsConfig[key].displayName; // Mostra o nome amigável
            customOptionFieldSelector.appendChild(option);
        }

        customOptionFieldSelector.addEventListener('change', handleCustomFieldSelection);
        addCustomOptionBtn.addEventListener('click', handleAddCustomOption);
    }

    // --- 5. EXECUÇÃO ---
    initializePage();

});
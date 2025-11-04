// arquivo: frontend/admin.js

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. SCHEMAS E CONFIGURAÇÕES ---
    // Precisamos de uma definição de quais campos são customizáveis.
    // Em vez de importar o schema gigante, definimos apenas o que precisamos.
    const customizableFieldsConfig = {
        combustivel: "Combustível (Comb. Estacionária)",
        tipo_lubrificante: "Tipo de Lubrificante (IPPU)",
        // ATENÇÃO: "unidade_medida" foi removido daqui conforme a decisão da reunião.
    };

    // --- 2. REFERÊNCIAS DO DOM ---
    const navPlaceholder = document.getElementById('nav-placeholder');
    const customOptionFieldSelector = document.getElementById('custom-option-field-selector');
    const customOptionManager = document.getElementById('custom-option-manager');
    const newCustomOptionValueInput = document.getElementById('new-custom-option-value');
    const addCustomOptionBtn = document.getElementById('add-custom-option-btn');
    const customOptionsListContainer = document.getElementById('custom-options-list-container');
    const customOptionFeedback = document.getElementById('custom-option-feedback');

    // --- 3. FUNÇÕES DE LÓGICA ---

    // Lógica movida de assets.js
    async function handleCustomFieldSelection() {
        const fieldKey = customOptionFieldSelector.value;
        if (!fieldKey) {
            customOptionManager.style.display = 'none';
            return;
        }
        await loadCustomOptions(fieldKey);
        customOptionManager.style.display = 'block';
    }

    // Lógica movida de assets.js
    async function loadCustomOptions(fieldKey) {
        customOptionsListContainer.innerHTML = '<li>Carregando...</li>';
        try {
            const response = await fetch(`/api/custom-options?field_key=${fieldKey}`);
            if (!response.ok) throw new Error('Falha ao buscar opções.');
            
            const options = await response.json();
            customOptionsListContainer.innerHTML = '';
            
            if (options.length === 0) {
                customOptionsListContainer.innerHTML = '<li>Nenhuma opção customizada cadastrada para este campo.</li>';
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

    // Lógica movida de assets.js
    async function handleAddCustomOption() {
        const fieldKey = customOptionFieldSelector.value;
        const value = newCustomOptionValueInput.value.trim();

        if (!fieldKey || !value) {
            customOptionFeedback.textContent = 'Por favor, selecione um campo e digite um valor para a nova opção.';
            customOptionFeedback.style.color = 'red';
            return;
        }

        try {
            const response = await fetch('/api/custom-options', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ field_key: fieldKey, value: value })
            });

            if (!response.ok) {
                 const errorData = await response.json();
                 // Trata erro de duplicidade que pode vir do banco (UNIQUE constraint)
                 if (response.status === 500 && errorData.error.includes('UNIQUE constraint failed')) {
                     throw new Error(`A opção "${value}" já existe para este campo.`);
                 }
                 throw new Error(errorData.message || 'Erro desconhecido do servidor.');
            }

            newCustomOptionValueInput.value = '';
            customOptionFeedback.textContent = '';
            await loadCustomOptions(fieldKey); // Recarrega a lista

        } catch (error) {
            console.error('Erro ao adicionar opção:', error);
            customOptionFeedback.textContent = `Erro: ${error.message}`;
            customOptionFeedback.style.color = 'red';
        }
    }

    // Lógica movida de assets.js
    async function handleDeleteCustomOption(optionId) {
        if (!confirm('Tem certeza que deseja deletar esta opção? Ela será removida de todos os lugares onde aparece.')) return;
        
        try {
            const response = await fetch(`/api/custom-options/${optionId}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Falha ao deletar opção.');

            const fieldKey = customOptionFieldSelector.value;
            await loadCustomOptions(fieldKey); // Recarrega a lista

        } catch (error) {
            console.error('Erro ao deletar opção:', error);
            alert('Ocorreu um erro ao deletar a opção. Verifique o console.');
        }
    }

    // --- 4. INICIALIZAÇÃO DA PÁGINA ---
    function initializePage() {
        // Carrega a barra de navegação
        if (navPlaceholder) {
            fetch('nav.html')
                .then(response => response.ok ? response.text() : Promise.reject('nav.html não encontrado.'))
                .then(data => { navPlaceholder.innerHTML = data; })
                .catch(error => console.error('Erro ao carregar a barra de navegação:', error));
        }

        // Popula o seletor de campos customizáveis
        customOptionFieldSelector.innerHTML = '<option value="">-- Selecione um Campo --</option>';
        for (const key in customizableFieldsConfig) {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = customizableFieldsConfig[key];
            customOptionFieldSelector.appendChild(option);
        }

        // Adiciona os event listeners aos elementos da página
        customOptionFieldSelector.addEventListener('change', handleCustomFieldSelection);
        addCustomOptionBtn.addEventListener('click', handleAddCustomOption);
    }

    // --- 5. EXECUÇÃO ---
    initializePage();

});
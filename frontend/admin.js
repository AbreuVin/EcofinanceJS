// arquivo: frontend/admin.js

document.addEventListener('DOMContentLoaded', () => {
    
    
    
    const managedFieldsConfig = {
        // --- Globais ---
        periodo: { displayName: "Período de Reporte (Global)", fieldKey: "periodo" },

        // --- Combustíveis ---
        combustivel: { displayName: "Combustíveis (Móvel & Estacionária)", fieldKey: "combustivel" },

        // --- Combustão Móvel ---
        tipo_veiculo: { displayName: "Tipo de Veículo (Móvel)", fieldKey: "tipo_veiculo" },
        unidade_consumo: { displayName: "Unidade de Consumo (Móvel)", fieldKey: "unidade_consumo" },
        unidade_distancia: { displayName: "Unidade de Distância (Móvel)", fieldKey: "unidade_distancia" },
        
        // --- IPPU & Outros ---
        tipo_lubrificante: { displayName: "Tipo de Lubrificante (IPPU)", fieldKey: "tipo_lubrificante" },
        
        // --- Emissões Fugitivas ---
        tipo_gas: { displayName: "Tipo de Gás (Fugitivas)", fieldKey: "tipo_gas" },
        
        // --- Unidades Genéricas ---
        
        unidade: { displayName: "Unidades de Medida (Padrão)", fieldKey: "unidade" }
    };

    
    const navPlaceholder = document.getElementById('nav-placeholder');
    const customOptionFieldSelector = document.getElementById('custom-option-field-selector');
    const customOptionManager = document.getElementById('custom-option-manager');
    const newCustomOptionValueInput = document.getElementById('new-custom-option-value');
    const addCustomOptionBtn = document.getElementById('add-custom-option-btn');
    const customOptionsListContainer = document.getElementById('custom-options-list-container');
    const customOptionFeedback = document.getElementById('custom-option-feedback');
    
    let currentFieldKey = null;

    
    async function handleCustomFieldSelection() { const selectedManagerKey = customOptionFieldSelector.value; if (!selectedManagerKey) { customOptionManager.style.display = 'none'; currentFieldKey = null; return; } currentFieldKey = managedFieldsConfig[selectedManagerKey].fieldKey; await loadCustomOptions(currentFieldKey); customOptionManager.style.display = 'block'; }
    async function loadCustomOptions(fieldKey) { customOptionsListContainer.innerHTML = '<li>Carregando...</li>'; try { const response = await fetch(`/api/options?field_key=${fieldKey}`); if (!response.ok) throw new Error('Falha ao buscar opções.'); const options = await response.json(); customOptionsListContainer.innerHTML = ''; if (options.length === 0) { customOptionsListContainer.innerHTML = '<li>Nenhuma opção cadastrada para este campo.</li>'; } else { options.forEach(opt => { const li = document.createElement('li'); li.textContent = opt.value; const deleteBtn = document.createElement('button'); deleteBtn.textContent = 'X'; deleteBtn.title = 'Deletar esta opção'; deleteBtn.dataset.id = opt.id; deleteBtn.onclick = () => handleDeleteCustomOption(opt.id); li.appendChild(deleteBtn); customOptionsListContainer.appendChild(li); }); } } catch (error) { console.error('Erro ao carregar opções:', error); customOptionsListContainer.innerHTML = '<li>Erro ao carregar opções. Verifique o console.</li>'; } }
    async function handleAddCustomOption() { const value = newCustomOptionValueInput.value.trim(); if (!currentFieldKey || !value) { customOptionFeedback.textContent = 'Por favor, selecione um campo e digite um valor para a nova opção.'; customOptionFeedback.style.color = 'red'; return; } try { const response = await fetch('/api/options', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ field_key: currentFieldKey, value: value }) }); if (!response.ok) { const errorData = await response.json(); if (response.status === 500 && errorData.error.includes('UNIQUE constraint failed')) { throw new Error(`A opção "${value}" já existe para este campo.`); } throw new Error(errorData.message || 'Erro desconhecido do servidor.'); } newCustomOptionValueInput.value = ''; customOptionFeedback.textContent = ''; await loadCustomOptions(currentFieldKey); } catch (error) { console.error('Erro ao adicionar opção:', error); customOptionFeedback.textContent = `Erro: ${error.message}`; customOptionFeedback.style.color = 'red'; } }
    async function handleDeleteCustomOption(optionId) { if (!confirm('Tem certeza que deseja deletar esta opção? Ela será removida de todos os lugares onde aparece.')) return; try { const response = await fetch(`/api/options/${optionId}`, { method: 'DELETE' }); if (!response.ok) throw new Error('Falha ao deletar opção.'); await loadCustomOptions(currentFieldKey); } catch (error) { console.error('Erro ao deletar opção:', error); alert('Ocorreu um erro ao deletar a opção. Verifique o console.'); } }

    
    function initializePage() {
        if (navPlaceholder) {
            fetch('nav.html')
                .then(response => response.ok ? response.text() : Promise.reject('nav.html não encontrado.'))
                .then(data => { navPlaceholder.innerHTML = data; })
                .catch(error => console.error('Erro ao carregar a barra de navegação:', error));
        }

        
        const selector = customOptionFieldSelector;
        selector.innerHTML = '<option value="">-- Selecione um Campo --</option>';
        
        
        const sortedKeys = Object.keys(managedFieldsConfig).sort((a, b) => 
            managedFieldsConfig[a].displayName.localeCompare(managedFieldsConfig[b].displayName)
        );

        sortedKeys.forEach(key => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = managedFieldsConfig[key].displayName;
            selector.appendChild(option);
        });

        customOptionFieldSelector.addEventListener('change', handleCustomFieldSelection);
        addCustomOptionBtn.addEventListener('click', handleAddCustomOption);
    }

    
    initializePage();

});
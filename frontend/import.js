// arquivo: frontend/import.js

import { validationSchemas } from './validators.js';

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. REFERÊNCIAS ---
    const tableSelector = document.getElementById('table-selector');
    const uploadSection = document.getElementById('upload-section');
    const uploadInstructions = document.getElementById('upload-instructions');
    const uploadForm = document.getElementById('upload-form');
    const fileInput = document.getElementById('file-input');
    const feedbackDiv = document.getElementById('feedback');
    const tableContainer = document.getElementById('table-container');
    const tableActions = document.getElementById('table-actions');
    const addRowBtn = document.getElementById('add-row-btn'); // <-- NOVO (SPRINT 12)
    const saveButton = document.getElementById('save-data-btn');
    
    let currentSchema = null;
    let contactsList = [];

    // --- 2. FUNÇÕES PRINCIPAIS (com refatorações) ---

    function loadNavbar() {
        const navPlaceholder = document.getElementById('nav-placeholder');
        if (navPlaceholder) {
            fetch('nav.html').then(response => response.ok ? response.text() : Promise.reject('nav.html não encontrado.')).then(data => { navPlaceholder.innerHTML = data; }).catch(error => console.error('Erro ao carregar a barra de navegação:', error));
        }
    }

    async function fetchContacts() {
        try {
            const response = await fetch('/api/contacts');
            if (!response.ok) throw new Error('Falha ao buscar contatos');
            contactsList = await response.json();
        } catch (error) {
            console.error('Erro ao buscar contatos:', error);
            contactsList = [];
        }
    }
    
    function generateTable(data) {
        if (!currentSchema) return;
        createEmptyTableAndHeaders(); // Cria a estrutura da tabela
        const tbody = tableContainer.querySelector('tbody');
        const headers = Object.keys(currentSchema.headerDisplayNames);
        data.forEach(rowData => {
            const row = buildTableRow(rowData, headers);
            tbody.appendChild(row);
            updateRowAppearance(row, headers);
        });
        checkTableAndToggleSaveButton();
    }

    // --- NOVO (SPRINT 12): Cria a estrutura da tabela (cabeçalho e corpo) ---
    function createEmptyTableAndHeaders() {
        tableContainer.innerHTML = ''; // Limpa antes de criar
        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');
        const headerRow = document.createElement('tr');
        const headers = Object.keys(currentSchema.headerDisplayNames);

        headers.forEach(headerKey => {
            const displayName = currentSchema.headerDisplayNames[headerKey] || headerKey;
            headerRow.innerHTML += `<th>${displayName}</th>`;
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);
        table.appendChild(tbody);
        tableContainer.appendChild(table);

        // Adiciona os listeners ao novo tbody
        tbody.addEventListener('blur', (e) => handleTableChange(e, headers), true);
        tbody.addEventListener('change', (e) => handleTableChange(e, headers));
    }

    // --- REATORADO (SPRINT 12): Lógica de criação de linha isolada ---
    function buildTableRow(rowData, headers) {
        const row = document.createElement('tr');
        headers.forEach(header => {
            const cell = document.createElement('td');
            const currentValue = rowData[header] || "";

            if (header === 'responsavel' && currentSchema.hasResponsibles) {
                const select = document.createElement('select');
                select.innerHTML = '<option value="">-- Selecione --</option>';
                contactsList.forEach(contact => {
                    const option = document.createElement('option');
                    option.value = contact.name;
                    option.textContent = contact.name;
                    if (contact.name === currentValue) option.selected = true;
                    select.appendChild(option);
                });
                cell.appendChild(select);
            } else if (currentSchema.validOptions && currentSchema.validOptions[header]) {
                const select = document.createElement('select');
                currentSchema.validOptions[header].forEach(optionText => {
                    const option = document.createElement('option');
                    option.value = optionText;
                    option.textContent = optionText;
                    if (optionText === currentValue) option.selected = true;
                    select.appendChild(option);
                });
                cell.appendChild(select);
            } else {
                if (header === 'email_do_responsavel' || header === 'telefone_do_responsavel') {
                    cell.setAttribute('contenteditable', 'false');
                    cell.style.backgroundColor = '#f0f0f0';
                } else {
                    cell.setAttribute('contenteditable', 'true');
                }
                cell.textContent = currentValue;
            }
            row.appendChild(cell);
        });

        if (rowData.responsavel) { // Preenchimento inicial do responsável
            const responsavelCell = Array.from(row.cells)[headers.indexOf('responsavel')];
            if (responsavelCell) handleResponsibleChange(responsavelCell, headers);
        }
        return row;
    }
    
    // --- 3. EVENT HANDLERS ---
    
    tableSelector.addEventListener('change', async () => {
        const selectedKey = tableSelector.value;
        currentSchema = validationSchemas[selectedKey];
        tableContainer.innerHTML = '';
        feedbackDiv.textContent = '';
        if (currentSchema) {
            if (currentSchema.hasResponsibles) await fetchContacts();
            uploadInstructions.textContent = `Selecione um arquivo (CSV ou XLSX) para os dados de "${currentSchema.displayName}", ou adicione linhas manualmente.`;
            uploadSection.style.display = 'block';
            tableActions.style.display = 'flex'; // <-- MUDANÇA (SPRINT 12)
            saveButton.style.display = 'none';
        } else {
            uploadSection.style.display = 'none';
            tableActions.style.display = 'none'; // <-- MUDANÇA (SPRINT 12)
        }
    });

    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        feedbackDiv.textContent = 'Enviando e validando arquivo...';
        const file = fileInput.files[0];
        if (!file) { feedbackDiv.textContent = 'Por favor, selecione um arquivo.'; return; }
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await fetch('/api/upload', { method: 'POST', body: formData });
            if (!response.ok) throw new Error(`Erro: ${response.statusText}`);
            const data = await response.json();
            generateTable(data);
        } catch (error) {
            feedbackDiv.textContent = `Falha no upload: ${error.message}`;
            feedbackDiv.style.color = 'red';
        }
    });

    // --- NOVO (SPRINT 12): Evento de clique para adicionar linha ---
    addRowBtn.addEventListener('click', () => {
        if (!currentSchema) return;

        let tbody = tableContainer.querySelector('tbody');
        // Se a tabela não existir, cria a estrutura primeiro
        if (!tbody) {
            createEmptyTableAndHeaders();
            tbody = tableContainer.querySelector('tbody');
        }
        
        const headers = Object.keys(currentSchema.headerDisplayNames);
        const newRow = buildTableRow({}, headers); // Cria linha com dados vazios
        tbody.appendChild(newRow);

        updateRowAppearance(newRow, headers);
        checkTableAndToggleSaveButton();
    });

    // (O resto do código, como a função `saveButton.addEventListener`, `handleTableChange`, etc, permanece o mesmo)
    // As funções auxiliares de validação também não mudam
    function getCellValue(cell) { const input = cell.querySelector('select, input'); return input ? input.value : cell.textContent; }
    function checkTableAndToggleSaveButton() {
        const hasAnyErrors = tableContainer.querySelector('.invalid-cell');
        const hasRows = tableContainer.querySelector('tbody tr');
        if (hasAnyErrors || !hasRows) {
            saveButton.style.display = 'none';
            if (hasAnyErrors && hasRows) feedbackDiv.textContent = "Dados inválidos. Corrija as células em vermelho.";
        } else {
            saveButton.style.display = 'block';
            feedbackDiv.textContent = 'Todos os dados são válidos! Você já pode salvar.';
            feedbackDiv.style.color = 'green';
        }
    }
    function updateRowAppearance(rowElement, headers) {
        if (!currentSchema) return;
        const cells = rowElement.querySelectorAll('td');
        const rowData = {};
        headers.forEach((header, index) => { rowData[header] = getCellValue(cells[index]); });
        const validation = currentSchema.validateRow(rowData);
        cells.forEach((cell, index) => {
            const header = headers[index];
            if (validation.errors[header]) {
                cell.classList.add('invalid-cell');
                cell.setAttribute('title', validation.errors[header]);
            } else {
                cell.classList.remove('invalid-cell');
                cell.removeAttribute('title');
            }
        });
    }
    function handleTableChange(event, headers) { /* ...código inalterado... */ }
    function handleResponsibleChange(responsibleCell, headers) { /* ...código inalterado... */ }
    saveButton.addEventListener('click', async () => { /* ...código inalterado... */ });

    // --- 4. INICIALIZAÇÃO ---
    populateSelector();
    loadNavbar();
    function populateSelector() {
        tableSelector.innerHTML = '<option value="">-- Selecione uma tabela --</option>';
        for (const key in validationSchemas) {
            tableSelector.innerHTML += `<option value="${key}">${validationSchemas[key].displayName}</option>`;
        }
    }
});
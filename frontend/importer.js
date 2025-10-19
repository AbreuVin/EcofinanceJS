// arquivo: frontend/importer.js

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
    const addRowBtn = document.getElementById('add-row-btn');
    const saveButton = document.getElementById('save-data-btn');
    const downloadCsvBtn = document.getElementById('download-csv-btn');
    const downloadXlsxBtn = document.getElementById('download-xlsx-btn');

    let currentSchema = null;
    let contactsList = [];

    // --- 2. FUNÇÕES PRINCIPAIS E AUXILIARES ---

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
        createEmptyTableAndHeaders();
        const tbody = tableContainer.querySelector('tbody');
        const headers = Object.keys(currentSchema.headerDisplayNames);
        data.forEach(rowData => {
            const row = buildTableRow(rowData, headers);
            tbody.appendChild(row);
            updateRowAppearance(row, headers);
        });
        checkTableAndToggleSaveButton();
    }

    function createEmptyTableAndHeaders() {
        tableContainer.innerHTML = '';
        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');
        const headerRow = document.createElement('tr');
        const headers = Object.keys(currentSchema.headerDisplayNames);
        headers.forEach(headerKey => {
            const displayName = currentSchema.headerDisplayNames[headerKey] || headerKey;
            headerRow.innerHTML += `<th>${displayName}</th>`;
        });
        headerRow.innerHTML += `<th>Ações</th>`;
        thead.appendChild(headerRow);
        table.appendChild(thead);
        table.appendChild(tbody);
        tableContainer.appendChild(table);
        tbody.addEventListener('click', handleTableClick);
        tbody.addEventListener('blur', (e) => handleTableChange(e, headers), true);
        tbody.addEventListener('change', (e) => handleTableChange(e, headers));
    }

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
        const actionsCell = document.createElement('td');
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'X';
        deleteBtn.className = 'delete-row-btn';
        deleteBtn.title = 'Deletar esta linha';
        actionsCell.appendChild(deleteBtn);
        row.appendChild(actionsCell);
        if (rowData.responsavel) {
            const responsavelCell = Array.from(row.cells)[headers.indexOf('responsavel')];
            if (responsavelCell) handleResponsibleChange(responsavelCell, headers);
        }
        return row;
    }
    
    function getCellValue(cell) { const input = cell.querySelector('select, input'); return input ? input.value : cell.textContent; }
    
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

    function checkTableAndToggleSaveButton() {
        const hasAnyErrors = tableContainer.querySelector('.invalid-cell');
        const hasRows = tableContainer.querySelector('tbody tr');
        if (hasAnyErrors || !hasRows) {
            saveButton.style.display = 'none';
            if (hasAnyErrors && hasRows) {
                feedbackDiv.textContent = "Dados inválidos. Corrija as células em vermelho.";
                feedbackDiv.style.color = 'red';
            } else if (!hasRows) {
                 feedbackDiv.textContent = "";
            }
        } else {
            saveButton.style.display = 'block';
            feedbackDiv.textContent = 'Todos os dados são válidos! Você já pode salvar.';
            feedbackDiv.style.color = 'green';
        }
    }
    
    function handleTableClick(event) {
        if (event.target.classList.contains('delete-row-btn')) {
            const rowToDelete = event.target.closest('tr');
            if (confirm('Tem certeza que deseja deletar esta linha?')) {
                rowToDelete.remove();
                checkTableAndToggleSaveButton();
            }
        }
    }

    function handleTableChange(event, headers) {
        const element = event.target;
        if (element.tagName === 'TD' || element.tagName === 'SELECT') {
            const cell = element.closest('td');
            const headerOfEditedCell = headers[cell.cellIndex];
            const editedRow = cell.parentElement;
            if (currentSchema.autoFillMap && currentSchema.autoFillMap[headerOfEditedCell]) {
                const rule = currentSchema.autoFillMap[headerOfEditedCell];
                const triggerValue = getCellValue(cell);
                const targetValue = rule.map[triggerValue];
                if (targetValue !== undefined) {
                    const targetHeader = rule.targetColumn;
                    const targetCellIndex = headers.indexOf(targetHeader);
                    if (targetCellIndex > -1) {
                        const targetCell = editedRow.querySelectorAll('td')[targetCellIndex];
                        const targetInput = targetCell.querySelector('select, input');
                        if (targetInput) targetInput.value = targetValue;
                        else targetCell.textContent = targetValue;
                    }
                }
            }
            if (headerOfEditedCell === 'responsavel' && currentSchema.hasResponsibles) {
                handleResponsibleChange(cell, headers);
            }
            updateRowAppearance(editedRow, headers);
            checkTableAndToggleSaveButton();
        }
    }

    function handleResponsibleChange(responsibleCell, headers) {
        const editedRow = responsibleCell.parentElement;
        const selectedName = getCellValue(responsibleCell);
        const contact = contactsList.find(c => c.name === selectedName);
        const emailIndex = headers.indexOf('email_do_responsavel');
        const phoneIndex = headers.indexOf('telefone_do_responsavel');
        if (emailIndex > -1) {
            const emailCell = editedRow.querySelectorAll('td')[emailIndex];
            emailCell.textContent = contact ? contact.email || '' : '';
        }
        if (phoneIndex > -1) {
            const phoneCell = editedRow.querySelectorAll('td')[phoneIndex];
            phoneCell.textContent = contact ? contact.phone || '' : '';
        }
    }

    tableSelector.addEventListener('change', async () => {
        const selectedKey = tableSelector.value;
        currentSchema = validationSchemas[selectedKey];
        tableContainer.innerHTML = '';
        feedbackDiv.textContent = '';
        if (currentSchema) {
            if (currentSchema.hasResponsibles) await fetchContacts();
            uploadInstructions.textContent = `Selecione um arquivo (CSV ou XLSX) para os dados de "${currentSchema.displayName}", ou adicione linhas manualmente.`;
            uploadSection.style.display = 'block';
            tableActions.style.display = 'flex';
            saveButton.style.display = 'none';
            downloadCsvBtn.href = `/api/template/${selectedKey}?format=csv`;
            downloadXlsxBtn.href = `/api/template/${selectedKey}?format=xlsx`;
            downloadCsvBtn.style.display = 'inline-block';
            downloadXlsxBtn.style.display = 'inline-block';
        } else {
            uploadSection.style.display = 'none';
            tableActions.style.display = 'none';
            downloadCsvBtn.style.display = 'none';
            downloadXlsxBtn.style.display = 'none';
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

    addRowBtn.addEventListener('click', () => {
        if (!currentSchema) return;
        let tbody = tableContainer.querySelector('tbody');
        if (!tbody) {
            createEmptyTableAndHeaders();
            tbody = tableContainer.querySelector('tbody');
        }
        const headers = Object.keys(currentSchema.headerDisplayNames);
        const newRow = buildTableRow({}, headers);
        tbody.appendChild(newRow);
        updateRowAppearance(newRow, headers);
        checkTableAndToggleSaveButton();
    });

    saveButton.addEventListener('click', async () => {
        if (!currentSchema || !tableSelector.value) return;
        const tableRows = document.querySelectorAll('#table-container tbody tr');
        
        const headersText = Array.from(document.querySelectorAll('#table-container thead th'))
            .map(th => th.textContent)
            .filter(text => text !== 'Ações');

        const dataToSave = [];
        tableRows.forEach(row => {
            const rowData = {};
            headersText.forEach((headerText, index) => {
                const cell = row.querySelectorAll('td')[index];
                let headerKey = '';
                for (const key in currentSchema.headerDisplayNames) {
                    if (currentSchema.headerDisplayNames[key] === headerText) {
                        headerKey = key;
                        break;
                    }
                }
                if (headerKey) {
                    rowData[headerKey] = getCellValue(cell);
                }
            });
            dataToSave.push(rowData);
        });

        try {
            const response = await fetch(`/api/save-data/${tableSelector.value}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSave),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message);
            const friendlyTableName = currentSchema.displayName;
            feedbackDiv.textContent = `Dados de "${friendlyTableName}" salvos com sucesso!`;
            feedbackDiv.style.color = 'green';
            saveButton.style.display = 'none';
        } catch (error) {
            feedbackDiv.textContent = `Erro ao salvar: ${error.message}`;
            feedbackDiv.style.color = 'red';
        }
    });

    function populateSelector() {
        tableSelector.innerHTML = '<option value="">-- Selecione uma tabela --</option>';
        for (const key in validationSchemas) {
            tableSelector.innerHTML += `<option value="${key}">${validationSchemas[key].displayName}</option>`;
        }
    }
    loadNavbar();
    populateSelector();
});
// arquivo: frontend/importer.js

import { validationSchemas } from '../shared/validators.js';

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
    const exportBtn = document.getElementById('export-btn');
    const downloadCsvBtn = document.getElementById('download-csv-btn');
    const downloadXlsxBtn = document.getElementById('download-xlsx-btn');
    const downloadIntelligentBtn = document.getElementById('download-intelligent-btn');

    let currentSchema = null;
    let contactsList = [];
    let unitsList = [];

    // --- 2. FUNÇÕES PRINCIPAIS E AUXILIARES ---

    function loadNavbar() {
        const navPlaceholder = document.getElementById('nav-placeholder');
        if (navPlaceholder) { fetch('nav.html').then(response => response.ok ? response.text() : Promise.reject('nav.html não encontrado.')).then(data => { navPlaceholder.innerHTML = data; }).catch(error => console.error('Erro ao carregar a barra de navegação:', error)); }
    }

    async function fetchContacts() {
        try {
            const response = await fetch('/api/contacts');
            if (!response.ok) throw new Error('Falha ao buscar contatos');
            contactsList = await response.json();
        } catch (error) { console.error('Erro ao buscar contatos:', error); contactsList = []; }
    }

    async function fetchUnits() {
        try {
            const response = await fetch('/api/units');
            if (!response.ok) throw new Error('Falha ao buscar unidades');
            unitsList = await response.json();
        } catch (error) { console.error('Erro ao buscar unidades:', error); unitsList = []; }
    }
    
    function generateTable(data) {
        if (!currentSchema) return;
        createEmptyTableAndHeaders();
        const tbody = tableContainer.querySelector('tbody');
        const headers = Object.keys(currentSchema.headerDisplayNames);
        data.forEach(rowData => {
            // Converte nomes de cabeçalho do Excel para chaves de schema
            const mappedRowData = {};
            for (const excelHeader in rowData) {
                const schemaKey = Object.keys(currentSchema.headerDisplayNames).find(
                    key => currentSchema.headerDisplayNames[key] === excelHeader
                );
                if (schemaKey) {
                    mappedRowData[schemaKey] = rowData[excelHeader];
                }
            }
            const row = buildTableRow(mappedRowData, headers);
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
            if (header === 'unidade_empresarial' && currentSchema.hasUnits) {
                const select = document.createElement('select');
                select.innerHTML = '<option value="">-- Selecione --</option>';
                unitsList.forEach(unit => {
                    const option = document.createElement('option');
                    option.value = unit.name;
                    option.textContent = unit.name;
                    if (unit.name === currentValue) option.selected = true;
                    select.appendChild(option);
                });
                cell.appendChild(select);
            } else if (header === 'responsavel' && currentSchema.hasResponsibles) {
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
                select.innerHTML = '<option value="">-- Selecione --</option>';
                currentSchema.validOptions[header].forEach(optionText => {
                    const option = document.createElement('option');
                    option.value = optionText;
                    option.textContent = optionText;
                    if (optionText === currentValue) option.selected = true;
                    select.appendChild(option);
                });
                cell.appendChild(select);
            } else {
                if (['email_do_responsavel', 'telefone_do_responsavel', 'area_do_responsavel', 'unidade'].includes(header)) {
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
        const cells = Array.from(rowElement.querySelectorAll('td')).slice(0, headers.length);
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
        const areDataValid = !hasAnyErrors && hasRows;
        saveButton.style.display = areDataValid ? 'block' : 'none';
        exportBtn.style.display = areDataValid ? 'block' : 'none';
        if (hasAnyErrors && hasRows) {
            feedbackDiv.textContent = "Dados inválidos. Corrija as células em vermelho.";
            feedbackDiv.style.color = 'red';
        } else if (areDataValid) {
            feedbackDiv.textContent = 'Todos os dados são válidos! Você já pode salvar ou baixar.';
            feedbackDiv.style.color = 'green';
        } else if (!hasRows) {
            feedbackDiv.textContent = "";
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
                        targetCell.textContent = targetValue;
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
        const areaIndex = headers.indexOf('area_do_responsavel');

        if (emailIndex > -1) { editedRow.querySelectorAll('td')[emailIndex].textContent = contact ? contact.email || '' : ''; }
        if (phoneIndex > -1) { editedRow.querySelectorAll('td')[phoneIndex].textContent = contact ? contact.phone || '' : ''; }
        if (areaIndex > -1) { editedRow.querySelectorAll('td')[areaIndex].textContent = contact ? contact.area || '' : ''; }
    }
    
    tableSelector.addEventListener('change', async () => {
        const selectedKey = tableSelector.value;
        currentSchema = validationSchemas[selectedKey];
        tableContainer.innerHTML = '';
        feedbackDiv.textContent = '';
        if (currentSchema) {
            const fetchPromises = [];
            if (currentSchema.hasResponsibles) { fetchPromises.push(fetchContacts()); }
            if (currentSchema.hasUnits) { fetchPromises.push(fetchUnits()); }
            await Promise.all(fetchPromises);
            uploadInstructions.textContent = `Faça o upload de um arquivo (CSV ou XLSX), ou adicione linhas manualmente.`;
            uploadSection.style.display = 'block';
            tableActions.style.display = 'flex';
            saveButton.style.display = 'none';
            exportBtn.style.display = 'none';
            downloadCsvBtn.href = `/api/template/${selectedKey}?format=csv`;
            downloadXlsxBtn.href = `/api/template/${selectedKey}?format=xlsx`;
            downloadCsvBtn.style.display = 'inline-block';
            downloadXlsxBtn.style.display = 'inline-block';
            downloadIntelligentBtn.style.display = 'inline-block';
        } else {
            uploadSection.style.display = 'none';
            tableActions.style.display = 'none';
            downloadCsvBtn.style.display = 'none';
            downloadXlsxBtn.style.display = 'none';
            downloadIntelligentBtn.style.display = 'none';
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
    
    downloadIntelligentBtn.addEventListener('click', async () => {
        const sourceType = tableSelector.value;
        if (!sourceType) return;
        
        const year = prompt("Por favor, digite o ano de reporte (ex: 2024):", new Date().getFullYear());
        if (!year || isNaN(parseInt(year)) || year.length !== 4) {
            alert("Ano inválido. Por favor, digite um ano com 4 dígitos.");
            return;
        }

        feedbackDiv.textContent = 'Gerando template inteligente...';
        feedbackDiv.style.color = 'blue';

        try {
            const response = await fetch(`/api/intelligent-template/${sourceType}?year=${year}`);
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Falha ao gerar o arquivo no servidor.');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            
            const disposition = response.headers.get('Content-Disposition');
            let filename = `${sourceType}_template_preenchido.xlsx`;
            if (disposition && disposition.indexOf('attachment') !== -1) {
                const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                const matches = filenameRegex.exec(disposition);
                if (matches != null && matches[1]) { 
                    filename = matches[1].replace(/['"]/g, '');
                }
            }
            a.download = filename;

            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
            feedbackDiv.textContent = 'Template gerado com sucesso!';
            feedbackDiv.style.color = 'green';
        } catch (error) {
            feedbackDiv.textContent = `Erro ao gerar template: ${error.message}`;
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
        const headers = Object.keys(currentSchema.headerDisplayNames);
        const dataToSave = [];

        tableRows.forEach(row => {
            const rowData = {};
            const cells = row.querySelectorAll('td');
            headers.forEach((headerKey, index) => {
                rowData[headerKey] = getCellValue(cells[index]);
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

    exportBtn.addEventListener('click', async () => {
        if (!currentSchema) return;
        const tableRows = document.querySelectorAll('#table-container tbody tr');
        const headersText = Array.from(document.querySelectorAll('#table-container thead th')).map(th => th.textContent).filter(text => text !== 'Ações');
        const dataToExport = [];
        tableRows.forEach(row => {
            const rowData = {};
            headersText.forEach((headerText, index) => {
                const cell = row.querySelectorAll('td')[index];
                rowData[headerText] = getCellValue(cell);
            });
            dataToExport.push(rowData);
        });
        if (dataToExport.length === 0) {
            alert("Não há dados para exportar.");
            return;
        }
        try {
            const payload = {
                data: dataToExport,
                tableName: tableSelector.value
            };
            const response = await fetch('/api/export', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!response.ok) { throw new Error('Falha ao gerar o arquivo Excel no servidor.'); }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            const disposition = response.headers.get('Content-Disposition');
            let filename = `${tableSelector.value}_export.xlsx`;
            if (disposition && disposition.indexOf('attachment') !== -1) {
                const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                const matches = filenameRegex.exec(disposition);
                if (matches != null && matches[1]) { 
                    filename = matches[1].replace(/['"]/g, '');
                }
            }
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
        } catch (error) {
            feedbackDiv.textContent = `Erro ao exportar: ${error.message}`;
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
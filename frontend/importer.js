// arquivo: frontend/importer.js

import { validationSchemas } from '../shared/validators.js';

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. REFERÊNCIAS E CONSTANTES ---
    const tableSelector = document.getElementById('table-selector');
    const uploadSection = document.getElementById('upload-section');
    const uploadInstructions = document.getElementById('upload-instructions');
    const uploadForm = document.getElementById('upload-form');
    const fileInput = document.getElementById('file-input');
    const feedbackDiv = document.getElementById('feedback');
    const tableContainer = document.getElementById('table-container');
    const tableActions = document.getElementById('table-actions');
    const saveButton = document.getElementById('save-data-btn');
    const downloadIntelligentBtn = document.getElementById('download-intelligent-btn');
    
    // --- ATENÇÃO: BOTÕES DE TEMPLATE VAZIO REMOVIDOS DO HTML E DO JS ---
    const downloadCsvBtn = document.getElementById('download-csv-btn');
    const downloadXlsxBtn = document.getElementById('download-xlsx-btn');
    if(downloadCsvBtn) downloadCsvBtn.parentElement.remove();
    if(downloadXlsxBtn) downloadXlsxBtn.parentElement.remove();
    if(downloadIntelligentBtn) downloadIntelligentBtn.textContent = 'Baixar Template'; // Renomeia o botão

    const NUMERIC_FIELDS = [
        'consumo', 'distancia_percorrida', 'quantidade_vendida', 
        'quantidade_reposta', 'percentual_emissao', 'quantidade_kg', 
        'percentual_nitrogenio', 'percentual_carbonato', 'area_hectare',
        'qtd_efluente_liquido_m3', 'qtd_componente_organico', 'qtd_nitrogenio_mg_l',
        'componente_organico_removido_lodo', 'num_medio_colaboradores', 
        'carga_horaria_media_colaboradores', 'num_medio_terceiros', 
        'carga_horaria_media_terceiros'
    ];

    let currentSchema = null;
    let unitsList = [];
    let managedOptionsCache = {}; 

    function loadNavbar() {
        const navPlaceholder = document.getElementById('nav-placeholder');
        if (navPlaceholder) { 
            fetch('nav.html')
                .then(response => response.ok ? response.text() : Promise.reject('nav.html não encontrado.'))
                .then(data => { 
                    navPlaceholder.innerHTML = data; 
                    document.title = 'Reporte de Dados - Ecofinance';
                    const h1 = document.querySelector('.container h1');
                    if(h1) h1.textContent = 'Reporte de Dados';
                })
                .catch(error => console.error('Erro ao carregar a barra de navegação:', error)); 
        }
    }

    async function fetchUnits() {
        try {
            const response = await fetch('/api/units');
            if (!response.ok) throw new Error('Falha ao buscar unidades');
            unitsList = await response.json();
        } catch (error) { console.error('Erro ao buscar unidades:', error); unitsList = []; }
    }

    async function fetchManagedOptions(schema) {
        managedOptionsCache = {}; 
        const optionKeysToFetch = Object.keys(schema.validOptions || {});
        
        try {
            const fetchPromises = optionKeysToFetch.map(key =>
                fetch(`/api/options?field_key=${key}`)
                    .then(res => res.ok ? res.json() : Promise.reject(`Falha ao buscar opções para ${key}`))
                    .then(options => ({ key, options: options.map(opt => opt.value) }))
            );
            const results = await Promise.all(fetchPromises);
            results.forEach(({ key, options }) => { managedOptionsCache[key] = options; });
        } catch (error) {
            console.error("Erro fatal ao carregar opções gerenciadas:", error);
            feedbackDiv.textContent = 'Erro ao carregar opções de seleção. A página pode não funcionar corretamente.';
            feedbackDiv.style.color = 'red';
        }
    }
    
    function generateTable(data, fromUpload = false) {
        if (!currentSchema) return;
        
        // Se a tabela for gerada a partir do pré-carregamento e não tiver fontes, exibe uma mensagem
        if (!fromUpload && data.length === 0) {
            tableContainer.innerHTML = `<p style="text-align: center; margin: 2rem 0;">Nenhuma fonte cadastrada para este tipo. Cadastre uma fonte na aba "Cadastro de Fontes" para preencher os dados aqui.</p>`;
            checkTableAndToggleSaveButton();
            return;
        }

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
            cell.dataset.header = header;
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
            } else if (managedOptionsCache[header]) {
                const select = document.createElement('select');
                select.innerHTML = '<option value="">-- Selecione --</option>';
                const options = managedOptionsCache[header] || [];
                options.forEach(optionText => {
                    const option = document.createElement('option');
                    option.value = optionText;
                    option.textContent = optionText;
                    if (optionText === currentValue) option.selected = true;
                    select.appendChild(option);
                });
                cell.appendChild(select);
            } else {
                cell.setAttribute('contenteditable', 'true');
                let displayValue = currentValue;
                if (NUMERIC_FIELDS.includes(header) && currentValue !== '' && !isNaN(parseFloat(currentValue))) {
                    displayValue = parseFloat(currentValue).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 20 });
                }
                cell.textContent = displayValue;
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

        const sourceType = tableSelector.value;
        if (sourceType === 'combustao_movel') {
            applyCombustaoMovelLogic(row);
        } else if (sourceType === 'efluentes_controlados') {
            applyEfluentesControladosLogic(row);
        }
        
        return row;
    }
    
    function getCellValue(cell) {
        const input = cell.querySelector('select, input');
        let value = input ? input.value : cell.textContent;
        if (NUMERIC_FIELDS.includes(cell.dataset.header) && typeof value === 'string') {
            return value.replace(/\./g, '').replace(',', '.');
        }
        return value;
    }
    
    function updateRowAppearance(rowElement, headers) {
        if (!currentSchema) return;
        const cells = Array.from(rowElement.querySelectorAll('td')).slice(0, headers.length);
        const rowData = {};
        headers.forEach((header, index) => { rowData[header] = getCellValue(cells[index]); });
        
        const validation = currentSchema.validateRow(rowData, managedOptionsCache);

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
        saveButton.style.display = areDataValid ? 'inline-block' : 'none';
        
        if (hasAnyErrors && hasRows) {
            feedbackDiv.textContent = "Dados inválidos. Corrija as células em vermelho.";
            feedbackDiv.style.color = 'red';
        } else if (areDataValid) {
            feedbackDiv.textContent = 'Todos os dados são válidos! Você pode preencher na tela ou salvar.';
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

    const setFieldsState = (row, fields, disable, clear) => {
        fields.forEach(fieldName => {
            const cell = row.querySelector(`td[data-header="${fieldName}"]`);
            if (cell) {
                const input = cell.querySelector('select');
                if (disable) {
                    if(clear) {
                        if (input) input.value = '';
                        else cell.textContent = '';
                    }
                    cell.setAttribute('contenteditable', 'false');
                    cell.style.backgroundColor = '#e9ecef';
                    if (input) input.disabled = true;
                } else {
                    cell.setAttribute('contenteditable', 'true');
                    cell.style.backgroundColor = '';
                    if (input) input.disabled = false;
                }
            }
        });
    };

    function applyCombustaoMovelLogic(row) {
        const tipoEntradaCell = row.querySelector(`td[data-header="tipo_entrada"]`);
        if (!tipoEntradaCell) return;
        const tipoEntrada = getCellValue(tipoEntradaCell);
        const consumoFields = ['combustivel_movel', 'consumo', 'unidade_consumo'];
        const distanciaFields = ['distancia_percorrida', 'unidade_distancia', 'tipo_veiculo'];
        if (tipoEntrada === 'consumo') {
            setFieldsState(row, distanciaFields, true, true);
            setFieldsState(row, consumoFields, false, false);
        } else if (tipoEntrada === 'distancia') {
            setFieldsState(row, consumoFields, true, true);
            setFieldsState(row, distanciaFields, false, false);
        } else {
            setFieldsState(row, distanciaFields, true, false);
            setFieldsState(row, consumoFields, true, false);
        }
    }

    function applyEfluentesControladosLogic(row) {
        const tipoDestinoCell = row.querySelector(`td[data-header="tratamento_ou_destino"]`);
        if(!tipoDestinoCell) return;
        const tipoDestino = getCellValue(tipoDestinoCell);
        const tratamentoField = ['tipo_tratamento'];
        const destinoFinalField = ['tipo_destino_final'];
        if (tipoDestino === 'Tratamento') {
            setFieldsState(row, destinoFinalField, true, true);
            setFieldsState(row, tratamentoField, false, false);
        } else if (tipoDestino === 'Destino Final') {
            setFieldsState(row, tratamentoField, true, true);
            setFieldsState(row, destinoFinalField, false, false);
        } else {
            setFieldsState(row, destinoFinalField, true, false);
            setFieldsState(row, tratamentoField, true, false);
        }
    }

    function handleTableChange(event, headers) {
        const element = event.target;
        const cell = element.closest('td');
        if (!cell) return;
        
        const editedRow = cell.parentElement;
        const headerOfEditedCell = cell.dataset.header;
        const sourceType = tableSelector.value;

        if (currentSchema.autoFillMap && currentSchema.autoFillMap[headerOfEditedCell]) {
            const rule = currentSchema.autoFillMap[headerOfEditedCell];
            const triggerValue = getCellValue(cell);
            const targetHeader = rule.targetColumn;
            const targetCell = editedRow.querySelector(`td[data-header="${targetHeader}"]`);
            if (targetCell) {
                const targetValue = rule.map[triggerValue];
                const targetInput = targetCell.querySelector('select');
                if (targetValue !== undefined) {
                    if (targetInput) targetInput.value = targetValue;
                    else targetCell.textContent = targetValue;
                    targetCell.setAttribute('contenteditable', 'false');
                    targetCell.style.backgroundColor = '#e9ecef';
                    if (targetInput) targetInput.disabled = true;
                } else {
                    if (targetInput) targetInput.value = '';
                    else targetCell.textContent = '';
                    targetCell.setAttribute('contenteditable', 'true');
                    targetCell.style.backgroundColor = '';
                    if (targetInput) targetInput.disabled = false;
                }
            }
        }

        if (sourceType === 'combustao_movel' && headerOfEditedCell === 'tipo_entrada') {
            applyCombustaoMovelLogic(editedRow);
        } else if (sourceType === 'efluentes_controlados' && headerOfEditedCell === 'tratamento_ou_destino') {
            applyEfluentesControladosLogic(editedRow);
        }
        
        updateRowAppearance(editedRow, headers);
        checkTableAndToggleSaveButton();
    }

    // --- ATENÇÃO: LISTENER DO tableSelector COMPLETAMENTE REFEITO ---
    tableSelector.addEventListener('change', async () => {
        const selectedKey = tableSelector.value;
        currentSchema = validationSchemas[selectedKey];
        
        // Limpa a tela e mostra feedback de carregamento
        tableContainer.innerHTML = '';
        feedbackDiv.textContent = 'Carregando...';
        feedbackDiv.style.color = 'blue';
        saveButton.style.display = 'none';

        if (currentSchema) {
            uploadSection.style.display = 'block';
            tableActions.style.display = 'flex';
            downloadIntelligentBtn.style.display = 'inline-block';
            
            try {
                // Busca as dependências (unidades, opções de dropdown)
                await Promise.all([
                    currentSchema.hasUnits ? fetchUnits() : Promise.resolve(),
                    fetchManagedOptions(currentSchema) 
                ]);

                // Busca os dados do template pré-preenchido
                feedbackDiv.textContent = 'Carregando fontes cadastradas...';
                const response = await fetch(`/api/intelligent-template/${selectedKey}?format=json`);
                if (!response.ok) throw new Error('Falha ao carregar template de dados.');
                
                const data = await response.json();
                
                feedbackDiv.textContent = '';
                generateTable(data, false); // O 'false' indica que não é de um upload de arquivo

            } catch (error) {
                console.error("Erro ao carregar dados da fonte:", error);
                feedbackDiv.textContent = `Erro: ${error.message}`;
                feedbackDiv.style.color = 'red';
            }

        } else {
            // Esconde tudo se nenhuma fonte for selecionada
            uploadSection.style.display = 'none';
            tableActions.style.display = 'none';
            downloadIntelligentBtn.style.display = 'none';
            feedbackDiv.textContent = '';
        }
    });

    uploadForm.addEventListener('submit', async (e) => { 
        e.preventDefault(); 
        feedbackDiv.textContent = 'Enviando e validando arquivo...'; 
        const file = fileInput.files[0]; 
        if (!file) { 
            feedbackDiv.textContent = 'Por favor, selecione um arquivo.'; 
            return; 
        } 
        const formData = new FormData(); 
        formData.append('file', file); 
        formData.append('source_type', tableSelector.value); 
        try { 
            const response = await fetch('/api/upload', { method: 'POST', body: formData }); 
            if (!response.ok) throw new Error(`Erro: ${response.statusText}`); 
            const data = await response.json(); 
            generateTable(data, true); // O 'true' indica que os dados vêm de um upload
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
        feedbackDiv.textContent = 'Gerando template...'; 
        feedbackDiv.style.color = 'blue'; 
        try { 
            // A chamada para a rota de download não muda
            const response = await fetch(`/api/intelligent-template/${sourceType}?year=${year}`); 
            if (!response.ok) { 
                const error = await response.json(); 
                throw new Error(error.message || 'Falha ao gerar o arquivo no servidor.'); 
            } 
            const blob = await response.blob(); 
            const url = window.URL.createObjectURL(blob); 
            const a = document.createElement('a'); 
            a.style.display = 'none'; a.href = url; 
            const disposition = response.headers.get('Content-Disposition'); 
            let filename = `${sourceType}_template.xlsx`; 
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
            const response = await fetch(`/api/save-data/${tableSelector.value}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dataToSave), }); 
            const result = await response.json(); 
            if (!response.ok) throw new Error(result.message); 
            const friendlyTableName = currentSchema.displayName; 
            feedbackDiv.textContent = `Dados de "${friendlyTableName}" salvos com sucesso!`; 
            feedbackDiv.style.color = 'green'; 
            saveButton.style.display = 'none'; 
            tableContainer.innerHTML = ''; 
        } catch (error) { 
            feedbackDiv.textContent = `Erro ao salvar: ${error.message}`; 
            feedbackDiv.style.color = 'red'; 
        } 
    });

    function populateSelector() {
        tableSelector.innerHTML = '<option value="">-- Selecione uma tabela --</option>';
        const sortedKeys = Object.keys(validationSchemas).sort((a, b) => 
            validationSchemas[a].displayName.localeCompare(validationSchemas[b].displayName)
        );
        sortedKeys.forEach(key => {
            tableSelector.innerHTML += `<option value="${key}">${validationSchemas[key].displayName}</option>`;
        });
    }

    loadNavbar();
    populateSelector();
});
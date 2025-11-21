// arquivo: frontend/importer.js

import { validationSchemas } from '../shared/validators.js';

document.addEventListener('DOMContentLoaded', () => {
    
    // --- ELEMENTOS DO DOM ---
    const tableSelector = document.getElementById('table-selector');
    const uploadSection = document.getElementById('upload-section');
    const uploadForm = document.getElementById('upload-form');
    const fileInput = document.getElementById('file-input');
    const feedbackDiv = document.getElementById('feedback');
    const tableContainer = document.getElementById('table-container');
    const tableActions = document.getElementById('table-actions');
    const saveButton = document.getElementById('save-data-btn');
    const downloadIntelligentBtn = document.getElementById('download-intelligent-btn');
    
    if(downloadIntelligentBtn) downloadIntelligentBtn.textContent = 'Baixar Template';

    const INTEGER_FIELDS = [
        'quantidade_vendida', 
        'num_trabalhadores'
    ];

    const DECIMAL_FIELDS = [
        'consumo', 'distancia_percorrida', 'quantidade_reposta', 
        'quantidade_kg', 'percentual_nitrogenio', 'percentual_carbonato', 
        'area_hectare', 'qtd_efluente_liquido_m3', 'qtd_componente_organico', 
        'qtd_nitrogenio_mg_l', 'componente_organico_removido_lodo', 
        'carga_horaria_media'
    ];
    
    const FIXED_FIELDS = {
        emissoes_fugitivas: {
            unidade: 'kg'
        },
        fertilizantes: {
            unidade: 'kg'
        }
    };

    let currentSchema = null;
    let unitsList = [];
    let managedOptionsCache = {}; 
    let maskInstances = {};
    let maskIdCounter = 0;

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
        const optionKeysToFetch = new Set(); 

        if (schema && schema.validOptions) {
            for (const key in schema.validOptions) {
                managedOptionsCache[key] = schema.validOptions[key];
                // Condição ajustada para não buscar opções para campos com apenas 1 ou 2 valores (Sim/Não)
                if (schema.validOptions[key].length > 2) {
                     optionKeysToFetch.add(key);
                }
            }
        }
        
        if (optionKeysToFetch.size === 0) { return; }

        try {
            const fetchPromises = Array.from(optionKeysToFetch).map(key =>
                fetch(`/api/options?field_key=${key}`)
                    .then(res => res.ok ? res.json() : Promise.reject(`Falha ao buscar opções para ${key}`))
                    .then(options => ({ key, options: options.map(opt => opt.value) }))
            );
            const results = await Promise.all(fetchPromises);
            
            results.forEach(({ key, options }) => {
                 if(options.length > 0) {
                    managedOptionsCache[key] = [...new Set([...(managedOptionsCache[key] || []), ...options])];
                 }
            });
        } catch (error) {
            console.error("Erro ao carregar opções gerenciadas:", error);
            feedbackDiv.textContent = 'Erro ao carregar opções de seleção. A página pode não funcionar corretamente.';
            feedbackDiv.style.color = 'red';
        }
    }
    
    function generateTable(data, fromUpload = false) {
        if (!currentSchema) return;
        
        if (!fromUpload && data.length === 0) {
            tableContainer.innerHTML = `<p style="text-align: center; margin: 2rem 0;">Nenhuma fonte cadastrada para este tipo. Cadastre uma fonte na aba "Cadastro de Fontes" para preencher os dados aqui.</p>`;
            checkTableAndToggleSaveButton();
            return;
        }

        createEmptyTableAndHeaders();
        const tbody = tableContainer.querySelector('tbody');
        const headers = Object.keys(currentSchema.headerDisplayNames);
        const sourceType = tableSelector.value;

        data.forEach((rowData) => {
            
            if (sourceType === 'combustao_movel') {
                if (rowData.tipo_entrada === 'consumo') {
                    rowData.distancia_percorrida = ''; rowData.unidade_distancia = ''; rowData.tipo_veiculo = '';
                } else if (rowData.tipo_entrada === 'distancia') {
                    rowData.combustivel = ''; rowData.consumo = ''; rowData.unidade_consumo = '';
                }
            } 
            else if (sourceType === 'efluentes_controlados') {
                if (rowData.tratamento_ou_destino === 'Tratamento') {
                    rowData.tipo_destino_final = '';
                } else if (rowData.tratamento_ou_destino === 'Destino Final') {
                    rowData.tipo_tratamento = '';
                }
            }
            else if (sourceType === 'mudanca_uso_solo') {
                if (rowData.uso_solo_anterior !== 'Vegetação natural') {
                    rowData.bioma = ''; rowData.fitofisionomia = ''; rowData.tipo_area = '';
                }
            }

            const rowElement = buildTableRow(rowData, headers);
            tbody.appendChild(rowElement);
            updateRowAppearance(rowElement, rowData);
        });
        checkTableAndToggleSaveButton();
    }

    function createEmptyTableAndHeaders() {
        Object.values(maskInstances).forEach(mask => mask.destroy());
        maskInstances = {};
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
            let currentValue = rowData[header] || "";
            
            const fixedFieldRules = FIXED_FIELDS[tableSelector.value];
            const isFixed = fixedFieldRules && fixedFieldRules[header];
            
            if (isFixed) {
                currentValue = fixedFieldRules[header];
            }

            const isAutoFilledUnit = currentSchema.autoFillMap && 
                                     Object.values(currentSchema.autoFillMap)
                                           .some(rule => rule.targetColumn === header);
            
            // --- ATENÇÃO: INÍCIO DA CORREÇÃO FINAL (ORDEM DA LÓGICA) ---
            // A verificação de campos fixos e auto-preenchidos agora tem prioridade máxima.
            if (isFixed || isAutoFilledUnit) {
                cell.textContent = currentValue;
                cell.setAttribute('contenteditable', 'false');
                cell.style.backgroundColor = '#e9ecef';
                cell.style.color = '#495057';

            } else if (INTEGER_FIELDS.includes(header) || DECIMAL_FIELDS.includes(header)) {
                const input = document.createElement('input');
                input.type = 'text';
                input.value = typeof currentValue === 'number' ? String(currentValue).replace('.', ',') : currentValue;
                const maskId = `mask-${maskIdCounter++}`;
                input.id = maskId;
                cell.appendChild(input);
                
                let maskOptions;
                if (INTEGER_FIELDS.includes(header)) {
                    maskOptions = { mask: Number, scale: 0, thousandsSeparator: '.', lazy: false };
                } else { 
                    maskOptions = { mask: Number, scale: 10, thousandsSeparator: '.', radix: ',', mapToRadix: ['.'], lazy: false };
                }
                maskInstances[maskId] = IMask(input, maskOptions);

            } else if (header === 'unidade_empresarial' && currentSchema.hasUnits) {
                const select = document.createElement('select');
                select.innerHTML = '<option value="">-- Selecione --</option>';
                unitsList.forEach(unit => { const option = document.createElement('option'); option.value = unit.name; option.textContent = unit.name; select.appendChild(option); });
                cell.appendChild(select);
                select.value = currentValue;

            } else if (managedOptionsCache[header]) {
                const select = document.createElement('select');
                select.innerHTML = '<option value="">-- Selecione --</option>';
                const options = managedOptionsCache[header] || [];
                const displayMap = currentSchema.displayValueMap?.[header];
                if (displayMap) { options.forEach(value => { const option = document.createElement('option'); option.value = value; option.textContent = displayMap[value] || value; select.appendChild(option); }); } else { options.forEach(optionText => { const option = document.createElement('option'); option.value = optionText; option.textContent = optionText; select.appendChild(option); }); }
                cell.appendChild(select);
                select.value = currentValue;
                
            } else {
                cell.setAttribute('contenteditable', 'true');
                cell.textContent = currentValue;
            }
            // --- FIM DA CORREÇÃO FINAL ---
            row.appendChild(cell);
        });
        const actionsCell = document.createElement('td');
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'X';
        deleteBtn.className = 'delete-row-btn';
        deleteBtn.title = 'Deletar esta linha';
        actionsCell.appendChild(deleteBtn);
        row.appendChild(actionsCell);
        
        return row;
    }
    
    function getCellValue(cell) {
        const maskedInput = cell.querySelector('input[id^="mask-"]');
        if (maskedInput && maskInstances[maskedInput.id]) {
            return maskInstances[maskedInput.id].unmaskedValue;
        }
        const input = cell.querySelector('select, input');
        return input ? input.value : cell.textContent;
    }
    
    function getRowDataFromDOM(rowElement, headers) {
        const rowData = {};
        headers.forEach((header) => {
            const cell = rowElement.querySelector(`td[data-header="${header}"]`);
            if(cell) {
                 rowData[header] = getCellValue(cell);
            }
        });
        return rowData;
    }
    
    function updateRowAppearance(rowElement, rowData) {
        if (!currentSchema) return;

        const headers = Object.keys(currentSchema.headerDisplayNames);
        const validation = currentSchema.validateRow(rowData, managedOptionsCache);
        const sanitizedData = validation.sanitizedData;

        headers.forEach(header => {
            const cell = rowElement.querySelector(`td[data-header="${header}"]`);
            if (!cell) return;

            const elementToStyle = cell.querySelector('input, select') || cell;

            if (elementToStyle.tagName === 'SELECT' || elementToStyle.tagName === 'INPUT') {
                if(elementToStyle.value !== sanitizedData[header]) {
                    elementToStyle.value = sanitizedData[header];
                }
            }
            
            if (validation.errors[header]) {
                if (elementToStyle.style.backgroundColor !== 'rgb(233, 236, 239)') {
                    elementToStyle.classList.add('invalid-cell');
                }
                elementToStyle.setAttribute('title', validation.errors[header]);
            } else {
                elementToStyle.classList.remove('invalid-cell');
                elementToStyle.removeAttribute('title');
            }
        });

        const sourceType = tableSelector.value;
        if (sourceType === 'combustao_movel') {
            const consumoFields = ['combustivel', 'consumo', 'unidade_consumo'];
            const distanciaFields = ['distancia_percorrida', 'unidade_distancia', 'tipo_veiculo'];
            if (sanitizedData.tipo_entrada === 'consumo') {
                setFieldsState(rowElement, distanciaFields, true, false);
                setFieldsState(rowElement, consumoFields, false, false);
            } else if (sanitizedData.tipo_entrada === 'distancia') {
                setFieldsState(rowElement, consumoFields, true, false);
                setFieldsState(rowElement, distanciaFields, false, false);
            } else {
                setFieldsState(rowElement, distanciaFields, true, false);
                setFieldsState(rowElement, consumoFields, true, false);
            }
        } else if (sourceType === 'efluentes_controlados') {
            const tratamentoField = ['tipo_tratamento'];
            const destinoFinalField = ['tipo_destino_final'];
            if (sanitizedData.tratamento_ou_destino === 'Tratamento') {
                setFieldsState(rowElement, destinoFinalField, true, false);
                setFieldsState(rowElement, tratamentoField, false, false);
            } else if (sanitizedData.tratamento_ou_destino === 'Destino Final') {
                setFieldsState(rowElement, tratamentoField, true, false);
                setFieldsState(rowElement, destinoFinalField, false, false);
            } else {
                setFieldsState(rowElement, destinoFinalField, true, false);
                setFieldsState(rowElement, tratamentoField, true, false);
            }
        }
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
            feedbackDiv.textContent = 'Todos os dados são válidos! Você pode salvar.';
            feedbackDiv.style.color = 'green';
        } else if (!hasRows) {
            feedbackDiv.textContent = "";
        }
    }
    
    function handleTableClick(event) {
        if (event.target.classList.contains('delete-row-btn')) {
            const rowToDelete = event.target.closest('tr');
            if (confirm('Tem certeza que deseja deletar esta linha?')) {
                rowToDelete.querySelectorAll('input[id^="mask-"]').forEach(input => {
                    if (maskInstances[input.id]) {
                        maskInstances[input.id].destroy();
                        delete maskInstances[input.id];
                    }
                });
                rowToDelete.remove();
                checkTableAndToggleSaveButton();
            }
        }
    }

    const setFieldsState = (row, fields, disable, clear) => {
        fields.forEach(fieldName => {
            const cell = row.querySelector(`td[data-header="${fieldName}"]`);
            if (cell) {
                const input = cell.querySelector('select, input');
                if (disable) {
                    if (clear) {
                        if (input) {
                            if (input.id && maskInstances[input.id]) {
                                maskInstances[input.id].value = '';
                            } else {
                                input.value = '';
                            }
                        } else {
                            cell.textContent = '';
                        }
                    }
                    cell.style.backgroundColor = '#e9ecef';
                    if (input) input.disabled = true;
                } else {
                    const isAutoFilledUnit = currentSchema.autoFillMap && Object.values(currentSchema.autoFillMap).some(rule => rule.targetColumn === fieldName);
                    if(!isAutoFilledUnit) {
                        cell.style.backgroundColor = '';
                        if (input) input.disabled = false;
                    }
                }
            }
        });
    };

    function handleTableChange(event, headers) {
        const element = event.target;
        const cell = element.closest('td');
        if (!cell) return;
        
        const editedRow = cell.parentElement;
        const headerOfEditedCell = cell.dataset.header;

        let rowData = getRowDataFromDOM(editedRow, headers);

        if (currentSchema.autoFillMap && currentSchema.autoFillMap[headerOfEditedCell]) {
            const rule = currentSchema.autoFillMap[headerOfEditedCell];
            const triggerValue = getCellValue(cell);
            const targetHeader = rule.targetColumn;
            const targetCell = editedRow.querySelector(`td[data-header="${targetHeader}"]`);
            if (targetCell) {
                const targetValue = rule.map[triggerValue] || '';
                targetCell.textContent = targetValue;
                rowData[targetHeader] = targetValue;
            }
        }
        
        const validation = currentSchema.validateRow(rowData, managedOptionsCache);
        const sanitizedData = validation.sanitizedData;
       
        updateRowAppearance(editedRow, sanitizedData);
        checkTableAndToggleSaveButton();
    }

    tableSelector.addEventListener('change', async () => {
        const selectedKey = tableSelector.value;
        currentSchema = validationSchemas[selectedKey];
        
        uploadForm.reset(); 

        tableContainer.innerHTML = '';
        tableActions.style.display = 'none'; 
        feedbackDiv.textContent = 'Carregando...';
        feedbackDiv.style.color = 'blue';
        saveButton.style.display = 'none';

        if (currentSchema) {
            uploadSection.style.display = 'block';
            tableActions.style.display = 'flex';
            downloadIntelligentBtn.style.display = 'inline-block';
            
            try {
                await Promise.all([
                    currentSchema.hasUnits ? fetchUnits() : Promise.resolve(),
                    fetchManagedOptions(currentSchema) 
                ]);
                feedbackDiv.textContent = 'Carregando fontes cadastradas...';
                const response = await fetch(`/api/intelligent-template/${selectedKey}?format=json`);
                if (!response.ok) throw new Error('Falha ao carregar template de dados.');
                
                const data = await response.json();
                
                feedbackDiv.textContent = '';
                generateTable(data, false);

            } catch (error) {
                console.error("Erro ao carregar dados da fonte:", error);
                feedbackDiv.textContent = `Erro: ${error.message}`;
                feedbackDiv.style.color = 'red';
            }

        } else {
            uploadSection.style.display = 'none';
            tableActions.style.display = 'none';
            downloadIntelligentBtn.style.display = 'none';
            feedbackDiv.textContent = '';
        }
    });
    
    uploadForm.addEventListener('submit', async (e) => { e.preventDefault(); feedbackDiv.textContent = 'Enviando e validando arquivo...'; const file = fileInput.files[0]; if (!file) { feedbackDiv.textContent = 'Por favor, selecione um arquivo.'; return; } const formData = new FormData(); formData.append('file', file); formData.append('source_type', tableSelector.value); try { const response = await fetch('/api/upload', { method: 'POST', body: formData }); if (!response.ok) throw new Error(`Erro: ${response.statusText}`); const data = await response.json(); generateTable(data, true); } catch (error) { feedbackDiv.textContent = `Falha no upload: ${error.message}`; feedbackDiv.style.color = 'red'; } });
    downloadIntelligentBtn.addEventListener('click', async () => { const sourceType = tableSelector.value; if (!sourceType) return; const year = prompt("Por favor, digite o ano de reporte (ex: 2024):", new Date().getFullYear()); if (!year || isNaN(parseInt(year)) || year.length !== 4) { alert("Ano inválido. Por favor, digite um ano com 4 dígitos."); return; } feedbackDiv.textContent = 'Gerando template...'; feedbackDiv.style.color = 'blue'; try { const response = await fetch(`/api/intelligent-template/${sourceType}?year=${year}`); if (!response.ok) { const error = await response.json(); throw new Error(error.message || 'Falha ao gerar o arquivo no servidor.'); } const blob = await response.blob(); const url = window.URL.createObjectURL(blob); const a = document.createElement('a'); a.style.display = 'none'; a.href = url; const disposition = response.headers.get('Content-Disposition'); let filename = `${sourceType}_template.xlsx`; if (disposition && disposition.indexOf('attachment') !== -1) { const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/; const matches = filenameRegex.exec(disposition); if (matches != null && matches[1]) { filename = matches[1].replace(/['"]/g, ''); } } a.download = filename; document.body.appendChild(a); a.click(); window.URL.revokeObjectURL(url); a.remove(); feedbackDiv.textContent = 'Template gerado com sucesso!'; feedbackDiv.style.color = 'green'; } catch (error) { feedbackDiv.textContent = `Erro ao gerar template: ${error.message}`; feedbackDiv.style.color = 'red'; } });
    saveButton.addEventListener('click', async () => { if (!currentSchema || !tableSelector.value) return; const headers = Object.keys(currentSchema.headerDisplayNames); const dataToSave = []; document.querySelectorAll('#table-container tbody tr').forEach(row => { dataToSave.push(getRowDataFromDOM(row, headers)); }); try { const response = await fetch(`/api/save-data/${tableSelector.value}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dataToSave), }); const result = await response.json(); if (!response.ok) throw new Error(result.message); const friendlyTableName = currentSchema.displayName; feedbackDiv.textContent = `Dados de "${friendlyTableName}" salvos com sucesso!`; feedbackDiv.style.color = 'green'; saveButton.style.display = 'none'; tableContainer.innerHTML = ''; } catch (error) { feedbackDiv.textContent = `Erro ao salvar: ${error.message}`; feedbackDiv.style.color = 'red'; } });
    function populateSelector() { tableSelector.innerHTML = '<option value="">-- Selecione uma tabela --</option>'; const sortedKeys = Object.keys(validationSchemas).sort((a, b) => validationSchemas[a].displayName.localeCompare(validationSchemas[b].displayName)); sortedKeys.forEach(key => { tableSelector.innerHTML += `<option value="${key}">${validationSchemas[key].displayName}</option>`; }); }

    loadNavbar();
    populateSelector();
});
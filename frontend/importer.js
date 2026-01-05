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
    const exportButton = document.getElementById('export-btn');
    const downloadIntelligentBtn = document.getElementById('download-intelligent-btn');
    
    if(downloadIntelligentBtn) downloadIntelligentBtn.textContent = 'Baixar Template';

    const INTEGER_FIELDS = [ 'quantidade_vendida', 'num_trabalhadores', 'numero_viagens', 'num_funcionarios', 'dias_deslocados', 'idade_antepenultimo', 'idade_penultimo' ];
    const DECIMAL_FIELDS = [ 'consumo', 'distancia_percorrida', 'quantidade_reposta', 'quantidade_kg', 'percentual_nitrogenio', 'percentual_carbonato', 'area_hectare', 'qtd_efluente_liquido_m3', 'qtd_componente_organico', 'qtd_nitrogenio_mg_l', 'componente_organico_removido_lodo', 'carga_horaria_media', 'quantidade_gerado', 'quantidade', 'valor_aquisicao', 'distancia_trecho', 'carga_transportada', 'distancia_km', 'total_geracao', 'area_antepenultimo', 'area_colhida_penultimo', 'area_atual', 'area_inicio_ano', 'area_fim_ano' ];

    let currentSchema = null;
    let unitsList = [];
    let managedOptionsCache = {}; 
    let maskInstances = {};
    let maskIdCounter = 0;
    let currentReportYear = null;
    
    // --- VARIÁVEL: Armazena a "Verdade" do Banco de Dados para cruzamento ---
    let referenceData = []; 

    // --- UTILS ---
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
                if (schema.validOptions[key].length > 2) {
                     optionKeysToFetch.add(key);
                }
            }
        }
        if (optionKeysToFetch.size === 0) return;
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

    function resolveDynamicHeader(displayName, reportYear) {
        if (!reportYear) return displayName;
        const yearInt = parseInt(reportYear);
        if (isNaN(yearInt)) return displayName;

        return displayName
            .replace('{ANO}', yearInt)
            .replace('{ANO-1}', yearInt - 1)
            .replace('{ANO-2}', yearInt - 2);
    }

    // --- LÓGICA DE RASCUNHO (LOCALSTORAGE) ---
    function getDraftKey() {
        if (!currentSchema || !currentReportYear) return null;
        return `ecofinance_draft_${tableSelector.value}_${currentReportYear}`;
    }

    function saveDraft() {
        const key = getDraftKey();
        if (!key) return;
        
        const headers = Object.keys(currentSchema.headerDisplayNames);
        const activeRowsData = [];
        
        document.querySelectorAll('#table-container tbody tr').forEach(row => {
            activeRowsData.push(getRowDataFromDOM(row, headers));
        });

        if (activeRowsData.length > 0) {
            localStorage.setItem(key, JSON.stringify(activeRowsData));
        } else {
            localStorage.removeItem(key); 
        }
    }

    function checkAndLoadDraft() {
        const key = getDraftKey();
        if (key) return; // (Nota: A lógica anterior tinha 'if (!key) return'. Corrigindo para consistência, mas aqui o fluxo original estava ok)

        const savedDraft = localStorage.getItem(key);
        if (savedDraft) {
            const draftData = JSON.parse(savedDraft);
            if (draftData.length > 0) {
                if (confirm(`Encontramos um rascunho não salvo com ${draftData.length} linhas para o ano ${currentReportYear}. Deseja restaurá-lo?`)) {
                    generateTable(draftData, false); 
                    feedbackDiv.textContent = 'Rascunho restaurado com sucesso. Não se esqueça de salvar!';
                    feedbackDiv.style.color = 'blue';
                } else {
                    localStorage.removeItem(key); 
                }
            }
        }
    }

    function clearDraft() {
        const key = getDraftKey();
        if (key) localStorage.removeItem(key);
    }

    function createResizableHeaders(table) {
        const cols = table.querySelectorAll('th');
        [].forEach.call(cols, function (col) {
            const resizer = document.createElement('div');
            resizer.classList.add('resizer');
            resizer.style.height = `${table.offsetHeight}px`; 
            col.appendChild(resizer);
            createResizableColumn(col, resizer);
        });
    }

    function createResizableColumn(col, resizer) {
        let x = 0;
        let w = 0;

        const mouseDownHandler = function (e) {
            x = e.clientX;
            const styles = window.getComputedStyle(col);
            w = parseInt(styles.width, 10);

            document.addEventListener('mousemove', mouseMoveHandler);
            document.addEventListener('mouseup', mouseUpHandler);
            resizer.classList.add('resizing');
        };

        const mouseMoveHandler = function (e) {
            const dx = e.clientX - x;
            col.style.width = `${w + dx}px`;
        };

        const mouseUpHandler = function () {
            document.removeEventListener('mousemove', mouseMoveHandler);
            document.removeEventListener('mouseup', mouseUpHandler);
            resizer.classList.remove('resizing');
        };

        resizer.addEventListener('mousedown', mouseDownHandler);
    }

    function sanitizeAndPreprocessRow(rowData) {
        const sourceType = tableSelector.value;
        const cleanedRow = { ...rowData }; 

        if (sourceType === 'emissoes_fugitivas') {
            const gasValue = cleanedRow['tipo_gas'];
            if (gasValue) {
                const validGasOptions = managedOptionsCache['tipo_gas'] || [];
                const gasMap = new Map(validGasOptions.map(gas => [gas.toLowerCase(), gas]));
                const normalizedGas = gasMap.get(String(gasValue).toLowerCase());
                if (normalizedGas) {
                    cleanedRow['tipo_gas'] = normalizedGas;
                }
            }
        }

        if (sourceType === 'electricity_purchase') {
            if (cleanedRow.fonte_energia === 'Sistema Interligado Nacional') {
                cleanedRow.especificar_fonte = ''; 
            }
        }

        if (sourceType === 'combustao_movel' && cleanedRow.tipo_entrada) {
            if (cleanedRow.tipo_entrada === 'consumo') {
                ['distancia_percorrida', 'unidade_distancia', 'tipo_veiculo'].forEach(k => cleanedRow[k] = '');
            } else if (cleanedRow.tipo_entrada === 'distancia') {
                ['combustivel', 'consumo', 'unidade_consumo'].forEach(k => cleanedRow[k] = '');
            }
        } else if (sourceType === 'efluentes_controlados' && cleanedRow.tratamento_ou_destino) {
            if (cleanedRow.tratamento_ou_destino === 'Tratamento') {
                cleanedRow.tipo_destino_final = '';
            } else if (cleanedRow.tratamento_ou_destino === 'Destino Final') {
                cleanedRow.tipo_tratamento = '';
            }
        } else if (sourceType === 'mudanca_uso_solo' && cleanedRow.uso_solo_anterior) {
            if (cleanedRow.uso_solo_anterior !== 'Vegetação natural') {
                ['bioma', 'fitofisionomia', 'tipo_area'].forEach(k => cleanedRow[k] = '');
            }
        } else if (sourceType === 'purchased_goods_services' && cleanedRow.tipo_item) {
            if (cleanedRow.tipo_item === 'Serviço') {
                cleanedRow.quantidade = '';
                cleanedRow.unidade = '';
            }
        } else if (sourceType === 'upstream_transport' && cleanedRow.tipo_reporte) {
            if (cleanedRow.tipo_reporte === 'Consumo') {
                ['classificacao_veiculo', 'distancia_trecho', 'unidade_distancia', 'carga_transportada', 'numero_viagens'].forEach(k => cleanedRow[k] = '');
            } else if (cleanedRow.tipo_reporte === 'Distância') {
                ['combustivel', 'consumo', 'unidade_consumo'].forEach(k => cleanedRow[k] = '');
            }
        } else if (sourceType === 'business_travel_land' && cleanedRow.tipo_reporte) {
            if (cleanedRow.tipo_reporte === 'Consumo') {
                ['distancia_percorrida', 'unidade_distancia'].forEach(k => cleanedRow[k] = '');
            } else if (cleanedRow.tipo_reporte === 'Distância') {
                ['combustivel', 'consumo', 'unidade_consumo'].forEach(k => cleanedRow[k] = '');
            }
        } else if ((sourceType === 'downstream_transport' || sourceType === 'waste_transport') && cleanedRow.tipo_reporte) {
            if (cleanedRow.tipo_reporte === 'Consumo') {
                ['classificacao_veiculo', 'distancia_trecho', 'unidade_distancia', 'carga_transportada', 'numero_viagens'].forEach(k => cleanedRow[k] = '');
            } else if (cleanedRow.tipo_reporte === 'Distância') {
                ['combustivel', 'consumo', 'unidade_consumo'].forEach(k => cleanedRow[k] = '');
            }
        } else if (sourceType === 'employee_commuting' && cleanedRow.tipo_reporte) {
            if (cleanedRow.tipo_reporte === 'Consumo') {
                ['distancia_km', 'endereco_funcionario', 'endereco_trabalho'].forEach(k => cleanedRow[k] = '');
            } else if (cleanedRow.tipo_reporte === 'Distância') {
                ['tipo_combustivel', 'consumo', 'unidade_consumo', 'endereco_funcionario', 'endereco_trabalho'].forEach(k => cleanedRow[k] = '');
            } else if (cleanedRow.tipo_reporte === 'Endereço') {
                ['tipo_combustivel', 'consumo', 'unidade_consumo', 'distancia_km'].forEach(k => cleanedRow[k] = '');
            }
        } else if (sourceType === 'conservation_area') {
            if (cleanedRow.area_plantada === 'Não') {
                cleanedRow.plantio = ''; 
            }
        }
        
        return cleanedRow;
    }

    // --- FUNÇÃO: Merge com Fonte da Verdade (Cadastro) ---
    function mergeUploadedDataWithReference(uploadedRows) {
        if (!referenceData || referenceData.length === 0) return uploadedRows;
        
        const descriptionKeyMap = { 
            combustao_estacionaria: 'descricao_da_fonte', 
            combustao_movel: 'descricao_fonte', 
            ippu_lubrificantes: 'fonte_emissao', 
            emissoes_fugitivas: 'fonte_emissao', 
            fertilizantes: 'tipo_fertilizante',
            // --- ATUALIZAÇÃO: Efluentes Domésticos ---
            efluentes_domesticos: 'tipo_trabalhador'
        };
        const descKey = descriptionKeyMap[tableSelector.value];

        return uploadedRows.map(row => {
            let match = null;
            
            if (row.id_fonte) {
                match = referenceData.find(ref => String(ref.id_fonte) === String(row.id_fonte));
            }

            if (!match && descKey && row.unidade_empresarial && row[descKey]) {
                match = referenceData.find(ref => 
                    ref.unidade_empresarial === row.unidade_empresarial &&
                    ref[descKey] === row[descKey] &&
                    ref.periodo === row.periodo 
                );
            }

            if (match) {
                if (!row.id_fonte) row.id_fonte = match.id_fonte;
                
                // Injeções Gerais
                if (match.controlado_empresa) row.controlado_empresa = match.controlado_empresa;
                if (match.unidade) row.unidade = match.unidade;
                
                // Injeções Específicas
                if (match.unidade_consumo) row.unidade_consumo = match.unidade_consumo;
                if (match.combustivel_estacionario) row.combustivel_estacionario = match.combustivel_estacionario;
                if (match.tipo_gas) row.tipo_gas = match.tipo_gas;
                if (match.tipo_lubrificante) row.tipo_lubrificante = match.tipo_lubrificante;
                
                // --- ATUALIZAÇÃO: Injeta Fossa Séptica ---
                if (match.fossa_septica_propriedade) row.fossa_septica_propriedade = match.fossa_septica_propriedade;
            }
            
            return row;
        });
    }

    function generateTable(data, fromUpload = false) {
        if (!currentSchema) return;
        
        let processedData = data;
        if (fromUpload) {
            processedData = mergeUploadedDataWithReference(data);
        }

        let tbody = tableContainer.querySelector('tbody');
        if (!tbody) {
             if (!fromUpload && processedData.length === 0) {
                tableContainer.innerHTML = `<p style="text-align: center; margin: 2rem 0;">Nenhuma fonte cadastrada para o ano de ${currentReportYear}. Cadastre na aba "Cadastro de Fontes".</p>`;
                return;
            }
            createEmptyTableAndHeaders();
            tbody = tableContainer.querySelector('tbody');
        }

        const headers = Object.keys(currentSchema.headerDisplayNames);

        processedData.forEach((originalRowData, index) => {
            const cleanedData = fromUpload ? sanitizeAndPreprocessRow(originalRowData) : originalRowData;
            const validationResult = currentSchema.validateRow(cleanedData, managedOptionsCache);
            const rowElement = buildTableRow(cleanedData, headers, index);
            tbody.appendChild(rowElement);

            for (const header in validationResult.errors) {
                const cell = rowElement.querySelector(`td[data-header="${header}"]`);
                if (cell) {
                    const el = cell.querySelector('input, select') || cell;
                    el.classList.add('invalid-cell');
                    el.setAttribute('title', validationResult.errors[header]);
                }
            }
            
            updateDisabledFields(rowElement, cleanedData);
        });
        
        const table = tableContainer.querySelector('table');
        if(table) createResizableHeaders(table);

        checkTableAndToggleSaveButton();
    }


    function createEmptyTableAndHeaders() {
        Object.values(maskInstances).forEach(mask => mask.destroy());
        maskInstances = {};
        maskIdCounter = 0;
        tableContainer.innerHTML = '';
        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');
        const headerRow = document.createElement('tr');
        const headers = Object.keys(currentSchema.headerDisplayNames);
        
        headers.forEach(headerKey => {
            const th = document.createElement('th');
            const rawDisplayName = currentSchema.headerDisplayNames[headerKey] || headerKey;
            th.textContent = resolveDynamicHeader(rawDisplayName, currentReportYear);
            headerRow.appendChild(th);
        });
        
        const actionsTh = document.createElement('th');
        actionsTh.textContent = 'Ações';
        headerRow.appendChild(actionsTh);

        thead.appendChild(headerRow);
        table.appendChild(thead);
        table.appendChild(tbody);
        tableContainer.appendChild(table);
        
        tbody.addEventListener('click', handleTableClick);
        tbody.addEventListener('blur', (e) => handleTableChange(e, headers), true);
        tbody.addEventListener('change', (e) => handleTableChange(e, headers));
    }

    function buildTableRow(rowData, headers, rowIndex) {
        const row = document.createElement('tr');
        
        if (rowData.id_fonte) {
            row.dataset.idFonte = rowData.id_fonte;
        }

        headers.forEach(header => {
            const cell = document.createElement('td');
            cell.dataset.header = header;
            const currentValue = rowData[header] || "";
            const isAutoFilledUnit = currentSchema.autoFillMap && Object.values(currentSchema.autoFillMap).some(rule => rule.targetColumn === header);
            
            let forceDisabled = false;
            // --- LÓGICA DE BLOQUEIO VISUAL (Fonte da Verdade) ---
            if (header === 'controlado_empresa' && ['combustao_estacionaria', 'combustao_movel', 'ippu_lubrificantes', 'emissoes_fugitivas', 'fertilizantes'].includes(tableSelector.value)) {
                forceDisabled = true;
            }
            if (header === 'unidade' && ['combustao_estacionaria', 'ippu_lubrificantes'].includes(tableSelector.value)) {
                forceDisabled = true;
            }
            if (header === 'unidade_consumo' && tableSelector.value === 'combustao_movel') {
                forceDisabled = true;
            }
            // --- ATUALIZAÇÃO: Bloqueio para Efluentes Domésticos ---
            if (header === 'fossa_septica_propriedade' && tableSelector.value === 'efluentes_domesticos') {
                forceDisabled = true;
            }

            let options = managedOptionsCache[header];
            if (currentSchema.dependencyMap && currentSchema.dependencyMap.targetField === header) {
                const triggerHeader = currentSchema.dependencyMap.triggerField;
                const triggerValue = rowData[triggerHeader];
                if (triggerValue && currentSchema.dependencyMap.data[triggerValue]) {
                    options = currentSchema.dependencyMap.data[triggerValue];
                } else {
                    options = []; 
                }
            }

            if (header === 'informar_cidade_uf') {
                cell.textContent = currentValue;
                cell.setAttribute('contenteditable', 'false');
                cell.style.backgroundColor = '#e9ecef';
                cell.style.color = '#495057';
            }
            else if (isAutoFilledUnit || (options && options.length === 1)) {
                cell.textContent = (options && options.length === 1) ? options[0] : currentValue;
                cell.setAttribute('contenteditable', 'false');
                cell.style.backgroundColor = '#e9ecef';
                cell.style.color = '#495057';
            } else if (options) {
                const select = document.createElement('select');
                select.innerHTML = '<option value="">-- Selecione --</option>';
                const displayMap = currentSchema.displayValueMap?.[header];
                options.forEach(optionValue => {
                    const option = document.createElement('option');
                    option.value = optionValue;
                    option.textContent = (displayMap && displayMap[optionValue]) ? displayMap[optionValue] : optionValue;
                    select.appendChild(option);
                });
                cell.appendChild(select);
                select.value = currentValue;
                
                if (forceDisabled) {
                    select.disabled = true;
                    select.style.backgroundColor = '#f0f0f0'; 
                    select.title = "Este dado é definido no Cadastro da Fonte.";
                }

            } else if (DECIMAL_FIELDS.includes(header) || INTEGER_FIELDS.includes(header)) {
                const input = document.createElement('input');
                input.type = 'text';
                let safeValue = currentValue;
                if (typeof safeValue === 'string') {
                    const testValue = safeValue.replace(',', '.').trim();
                    if (testValue === '' || isNaN(parseFloat(testValue))) {
                        safeValue = '';
                    }
                }
                input.value = (safeValue !== '' && safeValue !== null && safeValue !== undefined) ? String(safeValue).replace('.', ',') : '';
                const maskId = `mask-${maskIdCounter++}`;
                input.id = maskId;
                cell.appendChild(input);
                let maskOptions;
                if (INTEGER_FIELDS.includes(header)) {
                    maskOptions = { mask: Number, scale: 0, thousandsSeparator: '.', lazy: false };
                } else { 
                    maskOptions = { mask: Number, scale: 10, thousandsSeparator: '.', radix: ',', mapToRadix: ['.', ','], lazy: false };
                }
                maskInstances[maskId] = IMask(input, maskOptions);
            } else if (header === 'unidade_empresarial' && currentSchema.hasUnits) {
                const select = document.createElement('select');
                select.innerHTML = '<option value="">-- Selecione --</option>';
                unitsList.forEach(unit => { const option = document.createElement('option'); option.value = unit.name; option.textContent = unit.name; select.appendChild(option); });
                cell.appendChild(select);
                select.value = currentValue;
            } else {
                if (forceDisabled) {
                    cell.setAttribute('contenteditable', 'false');
                    cell.textContent = currentValue;
                    cell.style.backgroundColor = '#f0f0f0';
                    cell.title = "Este dado é definido no Cadastro da Fonte.";
                } else {
                    cell.setAttribute('contenteditable', 'true');
                    cell.textContent = currentValue;
                }
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
        return row;
    }
    
    function getCellValue(cell) {
        const maskedInput = cell.querySelector('input[id^="mask-"]');
        if (maskedInput && maskInstances[maskedInput.id]) return maskInstances[maskedInput.id].unmaskedValue;
        const input = cell.querySelector('select, input');
        return input ? input.value : cell.textContent;
    }
    
    function getRowDataFromDOM(rowElement, headers) {
        const rowData = {};
        
        if (rowElement.dataset.idFonte) {
            rowData.id_fonte = rowElement.dataset.idFonte;
        }

        headers.forEach((header) => {
            const cell = rowElement.querySelector(`td[data-header="${header}"]`);
            if(cell) rowData[header] = getCellValue(cell);
        });
        return rowData;
    }
    
    function updateDisabledFields(rowElement, sanitizedData) {
        const sourceType = tableSelector.value;
        if (sourceType === 'combustao_movel') {
            const consumoFields = ['combustivel', 'consumo', 'unidade_consumo'];
            const distanciaFields = ['distancia_percorrida', 'unidade_distancia', 'tipo_veiculo'];
            if (sanitizedData.tipo_entrada === 'consumo') {
                setFieldsState(rowElement, distanciaFields, true, true);
                setFieldsState(rowElement, consumoFields, false, false);
            } else if (sanitizedData.tipo_entrada === 'distancia') {
                setFieldsState(rowElement, consumoFields, true, true);
                setFieldsState(rowElement, distanciaFields, false, false);
            } else {
                setFieldsState(rowElement, distanciaFields, true, false);
                setFieldsState(rowElement, consumoFields, true, false);
            }
        } else if (sourceType === 'electricity_purchase') {
            const especificarFonteField = ['especificar_fonte'];
            const isSIN = sanitizedData.fonte_energia === 'Sistema Interligado Nacional';
            setFieldsState(rowElement, especificarFonteField, isSIN, isSIN);
        } else if (sourceType === 'efluentes_controlados') {
            const tratamentoField = ['tipo_tratamento'];
            const destinoFinalField = ['tipo_destino_final'];
            if (sanitizedData.tratamento_ou_destino === 'Tratamento') {
                setFieldsState(rowElement, destinoFinalField, true, true);
                setFieldsState(rowElement, tratamentoField, false, false);
            } else if (sanitizedData.tratamento_ou_destino === 'Destino Final') {
                setFieldsState(rowElement, tratamentoField, true, true);
                setFieldsState(rowElement, destinoFinalField, false, false);
            } else {
                setFieldsState(rowElement, destinoFinalField, true, false);
                setFieldsState(rowElement, tratamentoField, true, false);
            }
        } else if (sourceType === 'mudanca_uso_solo') {
             const vegNaturalFields = ['bioma', 'fitofisionomia', 'tipo_area'];
             if (sanitizedData.uso_solo_anterior !== 'Vegetação natural') {
                setFieldsState(rowElement, vegNaturalFields, true, true);
             } else {
                setFieldsState(rowElement, vegNaturalFields, false, false);
             }
        } else if (sourceType === 'purchased_goods_services') {
            const qtdUnidFields = ['quantidade', 'unidade'];
            if (sanitizedData.tipo_item === 'Serviço') {
                setFieldsState(rowElement, qtdUnidFields, true, true);
            } else {
                setFieldsState(rowElement, qtdUnidFields, false, false);
            }
        } else if (sourceType === 'upstream_transport') {
            const consumoFields = ['combustivel', 'consumo', 'unidade_consumo'];
            const distanciaFields = ['classificacao_veiculo', 'distancia_trecho', 'unidade_distancia', 'carga_transportada', 'numero_viagens'];
            
            if (sanitizedData.tipo_reporte === 'Consumo') {
                setFieldsState(rowElement, distanciaFields, true, true); 
                setFieldsState(rowElement, consumoFields, false, false); 
            } else if (sanitizedData.tipo_reporte === 'Distância') {
                setFieldsState(rowElement, consumoFields, true, true); 
                setFieldsState(rowElement, distanciaFields, false, false); 
            } else {
                setFieldsState(rowElement, consumoFields, true, false);
                setFieldsState(rowElement, distanciaFields, true, false);
            }
        } else if (sourceType === 'business_travel_land') {
            const consumoFields = ['combustivel', 'consumo', 'unidade_consumo'];
            const distanciaFields = ['distancia_percorrida', 'unidade_distancia'];
            if (sanitizedData.tipo_reporte === 'Consumo') {
                setFieldsState(rowElement, distanciaFields, true, true);
                setFieldsState(rowElement, consumoFields, false, false);
            } else if (sanitizedData.tipo_reporte === 'Distância') {
                setFieldsState(rowElement, consumoFields, true, true);
                setFieldsState(rowElement, distanciaFields, false, false);
            } else {
                setFieldsState(rowElement, consumoFields, true, false);
                setFieldsState(rowElement, distanciaFields, true, false);
            }
        } else if (sourceType === 'downstream_transport' || sourceType === 'waste_transport') {
            const consumoFields = ['combustivel', 'consumo', 'unidade_consumo'];
            const distanciaFields = ['classificacao_veiculo', 'distancia_trecho', 'unidade_distancia', 'carga_transportada', 'numero_viagens'];
            if (sanitizedData.tipo_reporte === 'Consumo') {
                setFieldsState(rowElement, distanciaFields, true, true);
                setFieldsState(rowElement, consumoFields, false, false);
            } else if (sanitizedData.tipo_reporte === 'Distância') {
                setFieldsState(rowElement, consumoFields, true, true);
                setFieldsState(rowElement, distanciaFields, false, false);
            } else {
                setFieldsState(rowElement, consumoFields, true, false);
                setFieldsState(rowElement, distanciaFields, true, false);
            }
        } else if (sourceType === 'employee_commuting') {
            const consumoFields = ['tipo_combustivel', 'consumo', 'unidade_consumo'];
            const distanciaFields = ['distancia_km'];
            const enderecoFields = ['endereco_funcionario', 'endereco_trabalho'];

            if (sanitizedData.tipo_reporte === 'Consumo') {
                setFieldsState(rowElement, consumoFields, false, false);
                setFieldsState(rowElement, distanciaFields, true, true);
                setFieldsState(rowElement, enderecoFields, true, true);
            } else if (sanitizedData.tipo_reporte === 'Distância') {
                setFieldsState(rowElement, consumoFields, true, true);
                setFieldsState(rowElement, distanciaFields, false, false);
                setFieldsState(rowElement, enderecoFields, true, true);
            } else if (sanitizedData.tipo_reporte === 'Endereço') {
                setFieldsState(rowElement, consumoFields, true, true);
                setFieldsState(rowElement, distanciaFields, true, true);
                setFieldsState(rowElement, enderecoFields, false, false);
            } else {
                setFieldsState(rowElement, consumoFields, true, false);
                setFieldsState(rowElement, distanciaFields, true, false);
                setFieldsState(rowElement, enderecoFields, true, false);
            }
        } else if (sourceType === 'conservation_area') {
            const plantioField = ['plantio'];
            if (sanitizedData.area_plantada === 'Sim') {
                setFieldsState(rowElement, plantioField, false, false);
            } else {
                setFieldsState(rowElement, plantioField, true, true);
            }
        }
    }

    function updateValidationAppearance(rowElement) {
        const headers = Object.keys(currentSchema.headerDisplayNames);
        const rowData = getRowDataFromDOM(rowElement, headers);
        const validationResult = currentSchema.validateRow(rowData, managedOptionsCache);
        
        headers.forEach(header => {
            const cell = rowElement.querySelector(`td[data-header="${header}"]`);
            if (!cell) return;
            const el = cell.querySelector('input, select') || cell;
            el.classList.remove('invalid-cell');
            el.removeAttribute('title');
            if (validationResult.errors[header]) {
                el.classList.add('invalid-cell');
                el.setAttribute('title', validationResult.errors[header]);
            }
        });
    }

    function checkTableAndToggleSaveButton() {
        const hasAnyErrors = tableContainer.querySelector('.invalid-cell');
        const activeRows = Array.from(tableContainer.querySelectorAll('tbody tr')).filter(row => {
            const allInputs = Array.from(row.querySelectorAll('input, select'));
            const allDisabled = allInputs.length > 0 && allInputs.every(el => el.disabled);
            return !allDisabled && !row.classList.contains('saved-row');
        });
        
        const hasActiveRows = activeRows.length > 0;
        const areDataValid = !hasAnyErrors && hasActiveRows;

        saveButton.style.display = areDataValid ? 'inline-block' : 'none';
        
        const hasAnyRows = tableContainer.querySelector('tbody tr');
        exportButton.style.display = hasAnyRows ? 'inline-block' : 'none';

        if (hasAnyErrors && hasActiveRows) {
            feedbackDiv.textContent = "Dados inválidos. Corrija as células em vermelho.";
            feedbackDiv.style.color = 'red';
        } else if (areDataValid) {
            feedbackDiv.textContent = 'Todos os dados são válidos! Você pode salvar.';
            feedbackDiv.style.color = 'green';
        } else if (!hasActiveRows && hasAnyRows) {
            feedbackDiv.textContent = "Todos os dados exibidos já foram salvos ou estão travados.";
            feedbackDiv.style.color = 'green';
        } else {
            feedbackDiv.textContent = "";
        }
    }
    
    function handleTableClick(event) {
        if (event.target.classList.contains('delete-row-btn')) {
            const rowToDelete = event.target.closest('tr');
            if (confirm('Tem certeza que deseja remover esta linha da visualização?')) {
                rowToDelete.querySelectorAll('input[id^="mask-"]').forEach(input => {
                    if (maskInstances[input.id]) {
                        maskInstances[input.id].destroy();
                        delete maskInstances[input.id];
                    }
                });
                rowToDelete.remove();
                checkTableAndToggleSaveButton();
                saveDraft(); 
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
                                maskInstances[input.id].unmaskedValue = '';
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
                    
                    const isSystemLocked = (fieldName === 'controlado_empresa' && ['combustao_estacionaria', 'combustao_movel', 'ippu_lubrificantes', 'emissoes_fugitivas', 'fertilizantes'].includes(tableSelector.value)) 
                                        || (fieldName === 'unidade' && ['combustao_estacionaria', 'ippu_lubrificantes'].includes(tableSelector.value))
                                        || (fieldName === 'unidade_consumo' && tableSelector.value === 'combustao_movel')
                                        || (fieldName === 'fossa_septica_propriedade' && tableSelector.value === 'efluentes_domesticos');

                    if(!isAutoFilledUnit && !isSystemLocked) {
                        cell.style.backgroundColor = '';
                        const rowIsLocked = row.querySelector('.delete-row-btn').disabled === true;
                        if (input && !rowIsLocked) input.disabled = false;
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
        let rowData = getRowDataFromDOM(editedRow, headers);

        const headerOfEditedCell = cell.dataset.header;
        
        // 1. AutoFill Logic
        if (currentSchema.autoFillMap && currentSchema.autoFillMap[headerOfEditedCell]) {
            const rule = currentSchema.autoFillMap[headerOfEditedCell];
            const triggerValue = getCellValue(cell);
            const targetHeader = rule.targetColumn;
            const targetCell = editedRow.querySelector(`td[data-header="${targetHeader}"]`);
            if (targetCell) {
                targetCell.textContent = triggerValue ? (rule.map[triggerValue] || '') : '';
            }
            rowData = getRowDataFromDOM(editedRow, headers);
        }

        // 2. Dependency Logic
        if (currentSchema.dependencyMap && currentSchema.dependencyMap.triggerField === headerOfEditedCell) {
            const triggerValue = getCellValue(cell);
            const targetHeader = currentSchema.dependencyMap.targetField;
            const targetCell = editedRow.querySelector(`td[data-header="${targetHeader}"]`);
            
            if (targetCell) {
                const targetSelect = targetCell.querySelector('select');
                if (targetSelect) {
                    targetSelect.innerHTML = '<option value="">-- Selecione --</option>';
                    
                    if (triggerValue && currentSchema.dependencyMap.data[triggerValue]) {
                        const newOptions = currentSchema.dependencyMap.data[triggerValue];
                        newOptions.forEach(opt => {
                            const option = document.createElement('option');
                            option.value = opt;
                            option.textContent = opt;
                            targetSelect.appendChild(option);
                        });
                    }
                    targetSelect.value = "";
                }
            }
            rowData = getRowDataFromDOM(editedRow, headers);
        }
        
        updateDisabledFields(editedRow, rowData);
        updateValidationAppearance(editedRow);
        checkTableAndToggleSaveButton();
        
        saveDraft();
    }

    tableSelector.addEventListener('change', async () => {
        const selectedKey = tableSelector.value;
        currentSchema = validationSchemas[selectedKey];
        
        uploadForm.reset(); 
        tableContainer.innerHTML = '';
        tableActions.style.display = 'none'; 
        feedbackDiv.textContent = '';
        saveButton.style.display = 'none';
        exportButton.style.display = 'none';
        currentReportYear = null;
        referenceData = []; 

        if (currentSchema) {
            const year = prompt("Por favor, digite o ano de reporte (ex: 2024):", new Date().getFullYear());
            if (!year || isNaN(parseInt(year)) || year.length !== 4) {
                alert("Ano inválido. Por favor, selecione a fonte novamente e digite um ano com 4 dígitos.");
                tableSelector.value = ""; 
                uploadSection.style.display = 'none';
                return;
            }
            currentReportYear = year; 

            uploadSection.style.display = 'block';
            tableActions.style.display = 'flex';
            downloadIntelligentBtn.style.display = 'inline-block';
            feedbackDiv.textContent = 'Carregando...';
            feedbackDiv.style.color = 'blue';

            try {
                await Promise.all([
                    currentSchema.hasUnits ? fetchUnits() : Promise.resolve(),
                    fetchManagedOptions(currentSchema) 
                ]);
                feedbackDiv.textContent = `Carregando fontes cadastradas para o ano de ${currentReportYear}...`;
                
                const response = await fetch(`/api/intelligent-template/${selectedKey}?format=json&year=${currentReportYear}`);
                if (!response.ok) throw new Error('Falha ao carregar template de dados.');
                
                const data = await response.json();
                referenceData = data; 

                feedbackDiv.textContent = '';
                generateTable(data, false);
                
                checkAndLoadDraft();
                
                setTimeout(() => {
                    uploadSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);

            } catch (error) {
                console.error("Erro ao carregar dados da fonte:", error);
                feedbackDiv.textContent = `Erro: ${error.message}`;
                feedbackDiv.style.color = 'red';
            }
        } else {
            uploadSection.style.display = 'none';
        }
    });
    
    uploadForm.addEventListener('submit', async (e) => { 
        e.preventDefault(); 
        feedbackDiv.textContent = 'Enviando e validando arquivo...'; 
        const file = fileInput.files[0]; 
        if (!file) { feedbackDiv.textContent = 'Por favor, selecione um arquivo.'; return; } 
        const formData = new FormData(); 
        formData.append('file', file); 
        formData.append('source_type', tableSelector.value); 
        try { 
            const response = await fetch('/api/upload', { method: 'POST', body: formData }); 
            if (!response.ok) throw new Error(`Erro: ${response.statusText}`); 
            const data = await response.json(); 
            generateTable(data, true); 
            saveDraft();
        } catch (error) { 
            feedbackDiv.textContent = `Falha no upload: ${error.message}`; 
            feedbackDiv.style.color = 'red'; 
        } 
    });
    
    exportButton.addEventListener('click', async () => {
        if (!currentSchema || !tableSelector.value) return;
        
        const headers = Object.keys(currentSchema.headerDisplayNames);
        const dataToExport = [];
        
        document.querySelectorAll('#table-container tbody tr').forEach(row => {
            dataToExport.push(getRowDataFromDOM(row, headers));
        });

        if (dataToExport.length === 0) {
            alert("Não há dados na tabela para exportar.");
            return;
        }

        const friendlyData = dataToExport.map(row => {
            const newRow = {};
            delete row.id_fonte; 
            for (const key in row) {
                let displayName = currentSchema.headerDisplayNames[key] || key;
                displayName = resolveDynamicHeader(displayName, currentReportYear);
                newRow[displayName] = row[key];
            }
            return newRow;
        });

        try {
            const response = await fetch('/api/export', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ data: friendlyData, tableName: tableSelector.value })
            });
            
            if (!response.ok) throw new Error("Erro ao gerar arquivo de exportação.");
            
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `${tableSelector.value}_dados_${currentReportYear}.xlsx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            feedbackDiv.textContent = 'Dados exportados com sucesso!';
            feedbackDiv.style.color = 'green';
        } catch (error) {
            console.error("Erro na exportação:", error);
            feedbackDiv.textContent = 'Erro ao exportar dados.';
            feedbackDiv.style.color = 'red';
        }
    });

    downloadIntelligentBtn.addEventListener('click', async () => { 
        const sourceType = tableSelector.value; 
        if (!sourceType || !currentReportYear) {
            alert("Por favor, selecione uma fonte e um ano primeiro.");
            return;
        }

        feedbackDiv.textContent = 'Gerando template...'; 
        feedbackDiv.style.color = 'blue'; 
        try { 
            const response = await fetch(`/api/intelligent-template/${sourceType}?year=${currentReportYear}`); 
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

    function lockSavedRows() {
        const tbody = tableContainer.querySelector('tbody');
        if (!tbody) return;
        
        tbody.querySelectorAll('tr').forEach(row => {
            if (!row.classList.contains('saved-row')) {
                row.classList.add('saved-row');
                row.style.backgroundColor = '#d4edda'; 
                
                row.querySelectorAll('input, select').forEach(el => {
                    el.disabled = true;
                });
                
                const deleteBtn = row.querySelector('.delete-row-btn');
                if (deleteBtn) {
                    deleteBtn.disabled = true;
                    deleteBtn.style.opacity = '0.5';
                    deleteBtn.title = 'Item já salvo no banco de dados.';
                }
            }
        });
    }

    saveButton.addEventListener('click', async () => { 
        if (!currentSchema || !tableSelector.value) return; 
        
        const headers = Object.keys(currentSchema.headerDisplayNames); 
        const dataToSave = []; 
        
        document.querySelectorAll('#table-container tbody tr').forEach(row => { 
            if (!row.classList.contains('saved-row')) {
                dataToSave.push(getRowDataFromDOM(row, headers)); 
            }
        }); 
        
        if (dataToSave.length === 0) {
            feedbackDiv.textContent = "Não há novos dados para salvar.";
            return;
        }

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
            
            lockSavedRows();
            clearDraft();
            checkTableAndToggleSaveButton(); 
            
        } catch (error) { 
            feedbackDiv.textContent = `Erro ao salvar: ${error.message}`; 
            feedbackDiv.style.color = 'red'; 
        } 
    });
    
    function populateSelector() { tableSelector.innerHTML = '<option value="">-- Selecione uma tabela --</option>';
    const sortedKeys = Object.keys(validationSchemas).sort((a, b) => validationSchemas[a].displayName.localeCompare(validationSchemas[b].displayName)); sortedKeys.forEach(key => { tableSelector.innerHTML += `<option value="${key}">${validationSchemas[key].displayName}</option>`; }); }

    loadNavbar();
    populateSelector();
});
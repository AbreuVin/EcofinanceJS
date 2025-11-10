// arquivo: backend/server.js

// --- 1. IMPORTAÇÕES ---
const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const csv = require('csv-parser');
const xlsx = require('xlsx');
const fs = require('fs');
const bcrypt = require('bcrypt');
const db = require('./database.js'); 
const { validationSchemas } = require('../shared/validators.js');

// --- 2. CONFIGURAÇÕES ---
const app = express();
const PORT = process.env.PORT || 8080;
const saltRounds = 10;
const upload = multer({ dest: path.join(__dirname, 'uploads/') });

// --- 3. MIDDLEWARES ---
app.use(cors());
app.use(express.json());
const frontendPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendPath));
const sharedPath = path.join(__dirname, '..', 'shared');
app.use('/shared', express.static(sharedPath));

app.use((req, res, next) => {
    if (req.path.endsWith('.js')) res.contentType('text/javascript');
    next();
});

// --- 4. ROTA PRINCIPAL ---
app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'login.html'));
});

// --- 5. ROTAS DA API ---

// Rota de Registro - Sem alterações
app.post('/api/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword], function(err) {
            if (err) return res.status(409).json({ message: 'Este e-mail já está em uso.' });
            res.status(201).json({ message: 'Usuário criado com sucesso!', userId: this.lastID });
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
});

// Rota de Login - Sem alterações
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
        if (err) return res.status(500).json({ message: 'Erro interno no servidor.' });
        if (!user) return res.status(401).json({ message: 'Credenciais inválidas.' });
        const match = await bcrypt.compare(password, user.password);
        if (match) {
            res.status(200).json({ message: 'Login bem-sucedido!' });
        } else {
            res.status(401).json({ message: 'Credenciais inválidas.' });
        }
    });
});

// --- ATENÇÃO: ROTAS DE RESPONSÁVEIS (CONTACTS) MODIFICADAS ---

app.get('/api/contacts', (req, res) => {
    // A consulta agora usa LEFT JOIN para buscar o nome da unidade.
    const sqlContacts = `
        SELECT 
            c.id, c.name, c.unit_id, c.area, c.email, c.phone,
            u.name as unit_name 
        FROM contacts c
        LEFT JOIN units u ON c.unit_id = u.id
        ORDER BY c.name
    `;
    db.all(sqlContacts, [], (err, contacts) => {
        if (err) return res.status(500).json({ "error": err.message });

        const sqlAssociations = "SELECT * FROM contact_source_associations";
        db.all(sqlAssociations, [], (err, associations) => {
            if (err) return res.status(500).json({ "error": err.message });
            
            const contactsWithSources = contacts.map(contact => {
                const associatedSources = associations
                    .filter(assoc => assoc.contact_id === contact.id)
                    .map(assoc => assoc.source_type);
                return { ...contact, sources: associatedSources };
            });

            res.json(contactsWithSources);
        });
    });
});

app.post('/api/contacts', (req, res) => {
    // A rota agora espera 'unit_id' no corpo da requisição
    const { name, unit_id, area, email, phone, sources = [] } = req.body;
    if (!name) return res.status(400).json({ "error": "O nome é obrigatório." });

    // O SQL agora inclui a coluna 'unit_id'
    db.run("INSERT INTO contacts (name, unit_id, area, email, phone) VALUES (?, ?, ?, ?, ?)", [name, unit_id, area, email, phone], function(err) {
        if (err) return res.status(500).json({ "error": err.message });
        
        const contactId = this.lastID;
        if (sources.length === 0) {
            return res.status(201).json({ "id": contactId });
        }

        const placeholders = sources.map(() => '(?, ?)').join(',');
        const sql = `INSERT INTO contact_source_associations (contact_id, source_type) VALUES ${placeholders}`;
        
        const params = [];
        sources.forEach(sourceType => {
            params.push(contactId, sourceType);
        });

        db.run(sql, params, function(err) {
            if (err) return res.status(500).json({ "error": `Erro ao salvar associações: ${err.message}` });
            res.status(201).json({ "id": contactId });
        });
    });
});

app.put('/api/contacts/:id', (req, res) => {
    const contactId = req.params.id;
    // A rota agora espera 'unit_id' no corpo da requisição
    const { name, unit_id, area, email, phone, sources = [] } = req.body;

    db.serialize(() => {
        db.run("BEGIN TRANSACTION");
        // O SQL de UPDATE agora inclui a coluna 'unit_id'
        db.run("UPDATE contacts SET name = ?, unit_id = ?, area = ?, email = ?, phone = ? WHERE id = ?", [name, unit_id, area, email, phone, contactId]);
        db.run("DELETE FROM contact_source_associations WHERE contact_id = ?", [contactId]);

        if (sources.length > 0) {
            const placeholders = sources.map(() => '(?, ?)').join(',');
            const sql = `INSERT INTO contact_source_associations (contact_id, source_type) VALUES ${placeholders}`;
            const params = [];
            sources.forEach(sourceType => params.push(contactId, sourceType));
            db.run(sql, params);
        }

        db.run("COMMIT", (err) => {
            if (err) {
                db.run("ROLLBACK");
                return res.status(500).json({ "error": `Erro na transação: ${err.message}` });
            }
            res.status(200).json({ changes: 1 });
        });
    });
});

app.delete('/api/contacts/:id', (req, res) => {
    db.run("DELETE FROM contacts WHERE id = ?", [req.params.id], function(err) {
        if (err) return res.status(500).json({ "error": err.message });
        res.status(200).json({ deleted: this.changes });
    });
});

// Rotas de Unidades Empresariais - Sem alterações
app.get('/api/units', (req, res) => {
    db.all("SELECT * FROM units ORDER BY name", [], (err, rows) => {
        if (err) { res.status(500).json({ "error": err.message }); return; }
        res.json(rows);
    });
});
app.post('/api/units', (req, res) => {
    const { name, cidade, estado, pais, numero_colaboradores } = req.body;
    if (!name) { return res.status(400).json({ "error": "O nome da unidade é obrigatório." }); }
    const sql = "INSERT INTO units (name, cidade, estado, pais, numero_colaboradores) VALUES (?, ?, ?, ?, ?)";
    const params = [name, cidade, estado, pais, numero_colaboradores];
    db.run(sql, params, function(err) {
        if (err) { res.status(500).json({ "error": err.message }); return; }
        res.status(201).json({ "id": this.lastID });
    });
});
app.put('/api/units/:id', (req, res) => {
    const { name, cidade, estado, pais, numero_colaboradores } = req.body;
    const sql = "UPDATE units SET name = ?, cidade = ?, estado = ?, pais = ?, numero_colaboradores = ? WHERE id = ?";
    const params = [name, cidade, estado, pais, numero_colaboradores, req.params.id];
    db.run(sql, params, function(err) {
        if (err) { res.status(500).json({ "error": err.message }); return; }
        res.status(200).json({ changes: this.changes });
    });
});
app.delete('/api/units/:id', (req, res) => {
    db.run("DELETE FROM units WHERE id = ?", [req.params.id], function(err) {
        if (err) { res.status(500).json({ "error": err.message }); return; }
        res.status(200).json({ deleted: this.changes });
    });
});


// Rota de Upload de Arquivo - Sem alterações
app.post('/api/upload', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('Nenhum arquivo enviado.');
        }
        const filePath = req.file.path;
        const { source_type } = req.body; 

        const normalizeHeader = (header) => {
            return header.toString()
                .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                .toLowerCase()
                .trim()
                .replace(/[\(\)]/g, '')
                .replace(/[^\w\s-]/g, '')
                .replace(/[\s-]+/g, '_');
        };
        
        const processAndSendData = (data) => {
            const processedData = data.map(row => {
                const newRow = {};
                for (const key in row) {
                    let value = row[key];
                    if (typeof value === 'string') {
                        value = value.replace(/\.(?=.*\d{3},)/g, '').replace(',', '.');
                    }
                    newRow[key] = value;
                }
                return newRow;
            });
            fs.unlinkSync(filePath);
            res.status(200).json(processedData);
        };
        
        const schema = validationSchemas[source_type];
        if (!schema) {
            fs.unlinkSync(filePath);
            return res.status(400).json({ message: 'Tipo de fonte inválido fornecido.' });
        }
        const headerMap = {};
        for(const key in schema.headerDisplayNames) {
            headerMap[normalizeHeader(schema.headerDisplayNames[key])] = key;
        }

        if (req.file.originalname.endsWith('.xlsx') || req.file.originalname.endsWith('.xls')) {
            const workbook = xlsx.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            
            const jsonData = xlsx.utils.sheet_to_json(worksheet, { defval: "", raw: false });

            const results = jsonData.map(row => {
                const newRow = {};
                for (const excelHeader in row) {
                    const normalized = normalizeHeader(excelHeader);
                    const schemaKey = headerMap[normalized];
                    if (schemaKey) {
                        newRow[schemaKey] = row[excelHeader];
                    }
                }
                return newRow;
            });
            
            processAndSendData(results);
        } else {
            let results = [];
            fs.createReadStream(filePath)
                .pipe(csv({
                    mapHeaders: ({ header }) => headerMap[normalizeHeader(header)] || normalizeHeader(header)
                }))
                .on('data', (data) => results.push(data))
                .on('end', () => {
                    processAndSendData(results);
                });
        }
    } catch (error) {
        console.error("Erro no upload:", error);
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ message: 'Erro interno ao processar o arquivo.' });
    }
});


// Rota de Download de Template - Sem alterações
app.get('/api/template/:tableName', (req, res) => {
    const { tableName } = req.params;
    const { format = 'csv' } = req.query;
    const schema = validationSchemas[tableName];
    if (!schema) { return res.status(404).send('Tipo de tabela não encontrado.'); }
    const headers = Object.values(schema.headerDisplayNames);
    if (format === 'xlsx') {
        const workbook = xlsx.utils.book_new();
        const worksheet = xlsx.utils.aoa_to_sheet([headers]);
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Dados');
        const buffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' });
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=${tableName}_template.xlsx`);
        res.status(200).send(buffer);
    } else {
        const csvContent = headers.join(',');
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=${tableName}_template.csv`);
        res.status(200).send(csvContent);
    }
});

// Rota de Exportação de Dados da Tela - Sem alterações
app.post('/api/export', (req, res) => {
    const { data, tableName } = req.body;
    if (!Array.isArray(data) || data.length === 0) { return res.status(400).send('Nenhum dado fornecido para exportação.'); }
    try {
        const worksheet = xlsx.utils.json_to_sheet(data);
        if (data.length > 0) {
            const headers = Object.keys(data[0]);
            worksheet['!cols'] = headers.map(header => {
                const maxLength = Math.max(...data.map(row => (row[header] || "").toString().length), header.length);
                return { wch: maxLength + 2 };
            });
        }
        const workbook = xlsx.utils.book_new();
        const sheetName = (tableName ? tableName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Dados Exportados').substring(0, 31);
        xlsx.utils.book_append_sheet(workbook, worksheet, sheetName);
        const buffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' });
        const fileName = tableName ? `${tableName}_export.xlsx` : 'export.xlsx';
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
        res.status(200).send(buffer);
    } catch (error) {
        console.error("Erro ao exportar para Excel:", error);
        res.status(500).json({ message: "Erro interno ao gerar o arquivo Excel." });
    }
});

// Rota para Salvar Dados das Fontes
app.post('/api/save-data/:tableName', (req, res) => {
    const { tableName } = req.params;
    const dataRows = req.body;
    
    // --- ATENÇÃO: MUDANÇA 1 AQUI ---
    const allowedTables = { 
        combustao_movel: 'mobile_combustion_data', 
        combustao_estacionaria: 'stationary_combustion_data', 
        dados_producao_venda: 'production_sales_data', 
        ippu_lubrificantes: 'lubricants_ippu_data', 
        emissoes_fugitivas: 'fugitive_emissions_data', 
        fertilizantes: 'fertilizers_data',
        efluentes_controlados: 'effluents_controlled_data' // Nova fonte adicionada
    };
    // --- FIM DA MUDANÇA 1 ---

    if (!allowedTables[tableName]) { return res.status(400).json({ message: "Tipo de tabela inválido." }); }
    if (!dataRows || dataRows.length === 0) { return res.status(400).json({ message: "Nenhum dado para salvar." }); }
    const dbTableName = allowedTables[tableName];
    const columns = Object.keys(dataRows[0]);
    const placeholders = columns.map(() => '?').join(', ');
    const sql = `INSERT INTO ${dbTableName} (${columns.join(', ')}) VALUES (${placeholders})`;
    db.serialize(() => {
        db.run("BEGIN TRANSACTION");
        let errorOccurred = false;
        dataRows.forEach(row => {
            if (errorOccurred) return;
            const values = columns.map(col => row[col]);
            db.run(sql, values, (err) => {
                if (err) { console.error("Erro ao inserir linha:", err); errorOccurred = true; }
            });
        });
        const operation = errorOccurred ? "ROLLBACK" : "COMMIT";
        db.run(operation, (err) => {
            if (err) { return res.status(500).json({ message: `Erro crítico durante a transação (${operation}).` }); }
            if (errorOccurred) { return res.status(500).json({ message: "Erro ao salvar os dados. A transação foi revertida." }); }
            res.status(201).json({ message: `Dados de "${tableName}" salvos com sucesso!` });
        });
    });
});

// Rotas de Tipologias de Fontes (Assets) - Sem alterações
app.get('/api/asset-typologies', (req, res) => {
    const { source_type } = req.query;
    let sql = "SELECT T.*, U.name as unit_name FROM asset_typologies T JOIN units U ON T.unit_id = U.id";
    const params = [];
    if (source_type) {
        sql += " WHERE T.source_type = ?";
        params.push(source_type);
    }
    sql += " ORDER BY U.name, T.description";
    
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(500).json({ "error": err.message });
            return;
        }
        
        const results = rows.map(row => {
            const fields = JSON.parse(row.asset_fields || '{}');
            return { ...row, asset_fields: fields };
        });
        
        res.json(results);
    });
});
app.post('/api/asset-typologies', (req, res) => {
    const { unit_id, source_type, description, asset_fields } = req.body;
    if (!unit_id || !source_type || !description || !asset_fields) { return res.status(400).json({ "error": "Campos obrigatórios faltando." }); }
    const assetFieldsStr = JSON.stringify(asset_fields);

    if (unit_id === 'all') {
        db.all("SELECT id FROM units", [], (err, units) => {
            if (err) return res.status(500).json({ "error": `Erro ao buscar unidades: ${err.message}` });
            if (!units || units.length === 0) return res.status(404).json({ "error": "Nenhuma unidade cadastrada para aplicar a regra." });

            const sql = `INSERT INTO asset_typologies (unit_id, source_type, description, asset_fields) VALUES (?, ?, ?, ?)`;
            db.serialize(() => {
                db.run("BEGIN TRANSACTION");
                let errorOccurred = false;
                units.forEach(unit => {
                    if (errorOccurred) return;
                    db.run(sql, [unit.id, source_type, description, assetFieldsStr], function(err) {
                        if (err) { console.error("Erro ao inserir tipologia para unidade " + unit.id, err); errorOccurred = true; }
                    });
                });
                const operation = errorOccurred ? "ROLLBACK" : "COMMIT";
                db.run(operation, (err) => {
                    if (err) return res.status(500).json({ message: `Erro crítico durante a transação (${operation}).` });
                    if (errorOccurred) return res.status(500).json({ message: "Erro ao salvar as fontes. A operação foi revertida." });
                    res.status(201).json({ "message": `Fonte '${description}' criada para ${units.length} unidades com sucesso.` });
                });
            });
        });
    } else {
        const sql = `INSERT INTO asset_typologies (unit_id, source_type, description, asset_fields) VALUES (?, ?, ?, ?)`;
        db.run(sql, [unit_id, source_type, description, assetFieldsStr], function(err) {
            if (err) { return res.status(500).json({ "error": err.message }); }
            res.status(201).json({ "id": this.lastID });
        });
    }
});
app.put('/api/asset-typologies/:id', (req, res) => {
    const { unit_id, source_type, description, asset_fields } = req.body;
    if (!unit_id || !source_type || !description || !asset_fields) { return res.status(400).json({ "error": "Campos obrigatórios faltando." }); }
    const sql = `UPDATE asset_typologies SET unit_id = ?, source_type = ?, description = ?, asset_fields = ? WHERE id = ?`;
    const params = [unit_id, source_type, description, JSON.stringify(asset_fields), req.params.id];
    db.run(sql, params, function(err) {
        if (err) { res.status(500).json({ "error": err.message }); return; }
        res.status(200).json({ changes: this.changes });
    });
});
app.delete('/api/asset-typologies/:id', (req, res) => {
    db.run("DELETE FROM asset_typologies WHERE id = ?", [req.params.id], function(err) {
        if (err) { res.status(500).json({ "error": err.message }); return; }
        res.status(200).json({ deleted: this.changes });
    });
});

// --- ATENÇÃO: ROTAS DE OPÇÕES CUSTOMIZÁVEIS FORAM RENOMEADAS E REFATORADAS ---
// Agora chamadas de "Opções Gerenciadas"
app.get('/api/options', (req, res) => {
    const { field_key } = req.query;
    if (!field_key) { return res.status(400).json({ "error": "O parâmetro 'field_key' é obrigatório." }); }
    
    db.all("SELECT * FROM managed_options WHERE field_key = ? ORDER BY value", [field_key], (err, rows) => {
        if (err) { res.status(500).json({ "error": err.message }); return; }
        res.json(rows);
    });
});

app.post('/api/options', (req, res) => {
    const { field_key, value } = req.body;
    if (!field_key || !value) { return res.status(400).json({ "error": "Campos 'field_key' e 'value' são obrigatórios." }); }
    
    db.run("INSERT INTO managed_options (field_key, value) VALUES (?, ?)", [field_key, value], function(err) {
        if (err) { 
            console.error("Erro ao inserir em managed_options:", err.message);
            res.status(500).json({ "error": err.message }); 
            return;
        }
        res.status(201).json({ "id": this.lastID });
    });
});

app.delete('/api/options/:id', (req, res) => {
    db.run("DELETE FROM managed_options WHERE id = ?", [req.params.id], function(err) {
        if (err) { res.status(500).json({ "error": err.message }); return; }
        res.status(200).json({ deleted: this.changes });
    });
});
// --- FIM DA REFATORAÇÃO DAS ROTAS ---

// Rota de Configuração de Fontes - Sem alterações
app.get('/api/source-configurations', (req, res) => {
    db.all("SELECT * FROM source_configurations", [], (err, rows) => {
        if (err) { res.status(500).json({ "error": err.message }); return; }
        res.json(rows);
    });
});
app.post('/api/source-configurations', (req, res) => {
    const { source_type, reporting_frequency } = req.body;
    if (!source_type || !reporting_frequency) { return res.status(400).json({ "error": "Campos 'source_type' e 'reporting_frequency' são obrigatórios." }); }
    db.run(`UPDATE source_configurations SET reporting_frequency = ? WHERE source_type = ?`, [reporting_frequency, source_type], function (err) {
        if (err) { return res.status(500).json({ "error": err.message }); }
        if (this.changes === 0) {
            db.run(`INSERT INTO source_configurations (source_type, reporting_frequency) VALUES (?, ?)`, [source_type, reporting_frequency], function (err) {
                if (err) { return res.status(500).json({ "error": err.message }); }
                res.status(201).json({ message: "Configuração criada com sucesso." });
            });
        } else {
            res.status(200).json({ message: "Configuração atualizada com sucesso." });
        }
    });
});

// Rota de Template Inteligente
app.get('/api/intelligent-template/:sourceType', (req, res) => {
    const { sourceType } = req.params;
    const { unitId, year } = req.query;
    const schema = validationSchemas[sourceType];
    if (!schema) { return res.status(404).send('Tipo de fonte não encontrado.'); }

    // --- ATENÇÃO: MUDANÇA 2 AQUI ---
    const descriptionKeyMap = { 
        combustao_estacionaria: 'descricao_da_fonte', 
        combustao_movel: 'descricao_fonte', 
        dados_producao_venda: 'produto', 
        ippu_lubrificantes: 'fonte_emissao', 
        emissoes_fugitivas: 'fonte_emissao', 
        fertilizantes: 'especificacoes_insumo',
        efluentes_controlados: 'tratamento_ou_destino' // Nova fonte adicionada
    };
    // --- FIM DA MUDANÇA 2 ---
    
    const getFrequency = new Promise((resolve, reject) => { db.get("SELECT reporting_frequency FROM source_configurations WHERE source_type = ?", [sourceType], (err, row) => { if (err) return reject(err); resolve(row ? row.reporting_frequency : 'anual'); }); });
    
    const getTypologies = new Promise((resolve, reject) => {
        let sql = "SELECT T.*, U.name as unit_name FROM asset_typologies T JOIN units U ON T.unit_id = U.id WHERE T.source_type = ?";
        const params = [sourceType];
        if (unitId && unitId !== 'all') { sql += " AND T.unit_id = ?"; params.push(unitId); }
        db.all(sql, params, (err, rows) => { if (err) return reject(err); resolve(rows); });
    });

    Promise.all([getFrequency, getTypologies]).then(([frequency, typologies]) => {
        const dataForExcel = [];
        const headers = schema.headerDisplayNames;
        const headerKeys = Object.keys(headers);
        const reportYear = year || new Date().getFullYear();
        const mainDescriptionKey = descriptionKeyMap[sourceType];
        const periods = frequency === 'mensal' ? ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"] : ["Anual"];

        typologies.forEach(typo => {
            const assetFields = JSON.parse(typo.asset_fields || '{}');
            
            periods.forEach(period => {
                const row = {};
                headerKeys.forEach(key => { row[headers[key]] = ''; });

                row[headers['ano']] = reportYear;
                row[headers['periodo']] = period;
                row[headers['unidade_empresarial']] = typo.unit_name;
                if (mainDescriptionKey && headers[mainDescriptionKey]) { row[headers[mainDescriptionKey]] = typo.description; }
                
                for (const assetKey in assetFields) { 
                    if (headers.hasOwnProperty(assetKey)) { 
                        row[headers[assetKey]] = assetFields[assetKey]; 
                    } 
                }
                
                if (sourceType === 'combustao_movel') {
                    const tipoEntrada = assetFields.tipo_entrada;
                    if (tipoEntrada === 'Por Consumo') {
                        row[headers['tipo_entrada']] = 'consumo';
                        if (schema.autoFillMap && schema.autoFillMap.combustivel) {
                            const rule = schema.autoFillMap.combustivel;
                            const triggerValue = assetFields.combustivel;
                            if (triggerValue) {
                                const targetValue = rule.map[triggerValue];
                                if (targetValue !== undefined) {
                                    row[headers[rule.targetColumn]] = targetValue;
                                }
                            }
                        }
                    } else if (tipoEntrada === 'Por Distância') {
                        row[headers['tipo_entrada']] = 'distancia';
                    }
                }
                else if (sourceType === 'emissoes_fugitivas') {
                    if (!row[headers['unidade']]) {
                        row[headers['unidade']] = 'kg';
                    }
                }
                else if (schema.autoFillMap) {
                    for (const triggerKey in schema.autoFillMap) {
                        const rule = schema.autoFillMap[triggerKey];
                        const triggerValue = row[headers[triggerKey]];
                        if (triggerValue) {
                            const targetValue = rule.map[triggerValue];
                            if (targetValue !== undefined) {
                                row[headers[rule.targetColumn]] = targetValue;
                            }
                        }
                    }
                }
                
                dataForExcel.push(row);
            });
        });
        
        try {
            const worksheet = xlsx.utils.json_to_sheet(dataForExcel, { header: Object.values(headers) });
            worksheet['!cols'] = Object.values(headers).map(header => ({ wch: Math.max(header.length, 15) + 2 }));
            const workbook = xlsx.utils.book_new();
            const sheetName = schema.displayName.substring(0, 31);
            xlsx.utils.book_append_sheet(workbook, worksheet, sheetName);
            const buffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' });
            const fileName = `${sourceType}_template_preenchido_${reportYear}.xlsx`;
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
            res.status(200).send(buffer);
        } catch (error) {
            console.error("Erro ao gerar o template inteligente:", error);
            res.status(500).json({ message: "Erro interno ao gerar o arquivo Excel." });
        }
    }).catch(err => {
        console.error("Erro ao processar dados para o template:", err);
        res.status(500).json({ message: "Erro interno ao processar a geração do template." });
    });
});


// --- 6. INICIALIZAÇÃO ---

app.listen(PORT, () => {
    console.log(`Servidor iniciado com sucesso na porta ${PORT}`);
});
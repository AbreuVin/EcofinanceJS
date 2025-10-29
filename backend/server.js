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
const PORT = process.env.PORT || 3000;
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

// Rota de Registro
app.post('/api/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword], function(err) {
            if (err) return res.status(409).json({ message: 'Este e-mail já está em uso.' });
            res.status(201).json({ message: 'Usuário criado com sucesso!', userId: this.lastID });
        });
    } catch (error) { res.status(500).json({ message: 'Erro interno no servidor.' }); }
});

// Rota de Login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
        if (err) return res.status(500).json({ message: 'Erro interno no servidor.' });
        if (!user) return res.status(401).json({ message: 'Credenciais inválidas.' });
        const match = await bcrypt.compare(password, user.password);
        if (match) res.status(200).json({ message: 'Login bem-sucedido!' });
        else res.status(401).json({ message: 'Credenciais inválidas.' });
    });
});

// Rotas de Responsáveis (Contacts)
app.get('/api/contacts', (req, res) => {
    db.all("SELECT * FROM contacts ORDER BY name", [], (err, rows) => {
        if (err) return res.status(500).json({ "error": err.message });
        res.json(rows);
    });
});

app.post('/api/contacts', (req, res) => {
    const { name, area, email, phone } = req.body;
    if (!name) return res.status(400).json({ "error": "O nome é obrigatório." });
    db.run("INSERT INTO contacts (name, area, email, phone) VALUES (?, ?, ?, ?)", [name, area, email, phone], function(err) {
        if (err) return res.status(500).json({ "error": err.message });
        res.status(201).json({ "id": this.lastID });
    });
});

app.put('/api/contacts/:id', (req, res) => {
    const { name, area, email, phone } = req.body;
    db.run("UPDATE contacts SET name = ?, area = ?, email = ?, phone = ? WHERE id = ?", [name, area, email, phone, req.params.id], function(err) {
        if (err) return res.status(500).json({ "error": err.message });
        res.status(200).json({ changes: this.changes });
    });
});

app.delete('/api/contacts/:id', (req, res) => {
    db.run("DELETE FROM contacts WHERE id = ?", [req.params.id], function(err) {
        if (err) return res.status(500).json({ "error": err.message });
        res.status(200).json({ deleted: this.changes });
    });
});

// Rotas de Unidades Empresariais
app.get('/api/units', (req, res) => {
    db.all("SELECT * FROM units ORDER BY name", [], (err, rows) => {
        if (err) {
            res.status(500).json({ "error": err.message });
            return;
        }
        res.json(rows);
    });
});

app.post('/api/units', (req, res) => {
    const { name, cidade, estado, pais, cep } = req.body;
    if (!name) {
        return res.status(400).json({ "error": "O nome da unidade é obrigatório." });
    }
    db.run("INSERT INTO units (name, cidade, estado, pais, cep) VALUES (?, ?, ?, ?, ?)", [name, cidade, estado, pais, cep], function(err) {
        if (err) { res.status(500).json({ "error": err.message }); return; }
        res.status(201).json({ "id": this.lastID });
    });
});

app.put('/api/units/:id', (req, res) => {
    const { name, cidade, estado, pais, cep } = req.body;
    db.run("UPDATE units SET name = ?, cidade = ?, estado = ?, pais = ?, cep = ? WHERE id = ?", [name, cidade, estado, pais, cep, req.params.id], function(err) {
        if (err) { res.status(500).json({ "error": err.message }); return; }
        res.status(200).json({ changes: this.changes });
    });
});

app.delete('/api/units/:id', (req, res) => {
    db.run("DELETE FROM units WHERE id = ?", [req.params.id], function(err) {
        if (err) {
            res.status(500).json({ "error": err.message });
            return;
        }
        res.status(200).json({ deleted: this.changes });
    });
});

// Rota de Upload de Arquivo
app.post('/api/upload', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('Nenhum arquivo enviado.');
        }
        const filePath = req.file.path;
        let results = [];

        if (req.file.originalname.endsWith('.csv')) {
            fs.createReadStream(filePath)
                .pipe(csv({ mapHeaders: ({ header }) => header.toLowerCase().trim().replace(/\s+/g, '_').replace(/[^\w-]/g, '') }))
                .on('data', (data) => results.push(data))
                .on('end', () => {
                    fs.unlinkSync(filePath);
                    res.status(200).json(results);
                });
        } else if (req.file.originalname.endsWith('.xlsx') || req.file.originalname.endsWith('.xls')) {
            const workbook = xlsx.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1, defval: "" });

            if (!jsonData || jsonData.length < 1) {
                throw new Error("A planilha está vazia ou a primeira linha (cabeçalho) não foi encontrada.");
            }
            const headers = jsonData[0].map(h => h.toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim().replace(/\s+/g, '_').replace(/[^\w-]/g, ''));
            const data = jsonData.slice(1).map(row => {
                const rowData = {};
                headers.forEach((header, index) => {
                    rowData[header] = row[index] || "";
                });
                return rowData;
            });
            results = data;
            fs.unlinkSync(filePath);
            res.status(200).json(results);
        } else {
            fs.unlinkSync(filePath);
            return res.status(400).json({ message: 'Formato de arquivo não suportado. Use CSV ou XLSX.' });
        }
    } catch (error) {
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ message: 'Erro interno ao processar o arquivo.' });
    }
});

// Rota de Download de Template
app.get('/api/template/:tableName', (req, res) => {
    const { tableName } = req.params;
    const { format = 'csv' } = req.query;
    const schema = validationSchemas[tableName];

    if (!schema) {
        return res.status(404).send('Tipo de tabela não encontrado.');
    }

    const headers = Object.values(schema.headerDisplayNames);

    if (format === 'xlsx') {
        const workbook = xlsx.utils.book_new();
        const worksheet = xlsx.utils.aoa_to_sheet([headers]);
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Dados');
        const buffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' });
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=${tableName}_template.xlsx`);
        res.status(200).send(buffer);
    } else { // Padrão para CSV
        const csvContent = headers.join(',');
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=${tableName}_template.csv`);
        res.status(200).send(csvContent);
    }
});

app.post('/api/export', (req, res) => {
    const data = req.body.data;
    const tableName = req.body.tableName;

    if (!Array.isArray(data) || data.length === 0) {
        return res.status(400).send('Nenhum dado fornecido para exportação.');
    }

    try {
        const worksheet = xlsx.utils.json_to_sheet(data);
        const colWidths = [];
        if (data.length > 0) {
            const headers = Object.keys(data[0]);
            for (let i = 0; i < headers.length; i++) {
                let maxLength = headers[i].length;
                for (let j = 0; j < data.length; j++) {
                    const cellValue = data[j][headers[i]];
                    if (cellValue != null && cellValue.toString().length > maxLength) {
                        maxLength = cellValue.toString().length;
                    }
                }
                colWidths.push({ wch: maxLength + 2 });
            }
            worksheet['!cols'] = colWidths;
        }
        
        const workbook = xlsx.utils.book_new();
        const sheetName = tableName ? tableName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Dados Exportados';
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

app.post('/api/save-data/:tableName', (req, res) => { const { tableName } = req.params; const dataRows = req.body; const allowedTables = { combustao_movel: 'mobile_combustion_data', combustao_estacionaria: 'stationary_combustion_data', dados_producao_venda: 'production_sales_data', ippu_lubrificantes: 'lubricants_ippu_data', emissoes_fugitivas: 'fugitive_emissions_data', fertilizantes: 'fertilizers_data' }; if (!allowedTables[tableName]) { return res.status(400).json({ message: "Tipo de tabela inválido." }); } if (!dataRows || dataRows.length === 0) { return res.status(400).json({ message: "Nenhum dado para salvar."}); } const dbTableName = allowedTables[tableName]; const columns = Object.keys(dataRows[0]); const placeholders = columns.map(() => '?').join(', '); const sql = `INSERT INTO ${dbTableName} (${columns.join(', ')}) VALUES (${placeholders})`; db.serialize(() => { db.run("BEGIN TRANSACTION"); let errorOccurred = false; dataRows.forEach(row => { if (errorOccurred) return; const values = columns.map(col => row[col]); db.run(sql, values, (err) => { if(err) { console.error("Erro ao inserir linha:", err); errorOccurred = true; } }); }); const operation = errorOccurred ? "ROLLBACK" : "COMMIT"; db.run(operation, (err) => { if (err) { return res.status(500).json({ message: `Erro crítico durante a transação (${operation}).` }); } if (errorOccurred) { return res.status(500).json({ message: "Erro ao salvar os dados. A transação foi revertida." }); } res.status(201).json({ message: `Dados de "${tableName}" salvos com sucesso!` }); }); }); });
app.get('/api/asset-typologies', (req, res) => { const { source_type } = req.query; let sql = "SELECT T.*, U.name as unit_name FROM asset_typologies T JOIN units U ON T.unit_id = U.id"; const params = []; if (source_type) { sql += " WHERE T.source_type = ?"; params.push(source_type); } sql += " ORDER BY T.description"; db.all(sql, params, (err, rows) => { if (err) { res.status(500).json({ "error": err.message }); return; } const results = rows.map(row => { try { return { ...row, asset_fields: JSON.parse(row.asset_fields) }; } catch (e) { console.error(`Invalid JSON in asset_fields for typology id ${row.id}:`, row.asset_fields); return row; } }); res.json(results); }); });
app.post('/api/asset-typologies', (req, res) => { const { unit_id, source_type, description, asset_fields } = req.body; if (!unit_id || !source_type || !description || !asset_fields) { return res.status(400).json({ "error": "Campos obrigatórios faltando." }); } const sql = `INSERT INTO asset_typologies (unit_id, source_type, description, asset_fields) VALUES (?, ?, ?, ?)`; const params = [unit_id, source_type, description, JSON.stringify(asset_fields)]; db.run(sql, params, function(err) { if (err) { res.status(500).json({ "error": err.message }); return; } res.status(201).json({ "id": this.lastID }); }); });
app.put('/api/asset-typologies/:id', (req, res) => { const { unit_id, source_type, description, asset_fields } = req.body; if (!unit_id || !source_type || !description || !asset_fields) { return res.status(400).json({ "error": "Campos obrigatórios faltando." }); } const sql = `UPDATE asset_typologies SET unit_id = ?, source_type = ?, description = ?, asset_fields = ? WHERE id = ?`; const params = [unit_id, source_type, description, JSON.stringify(asset_fields), req.params.id]; db.run(sql, params, function(err) { if (err) { res.status(500).json({ "error": err.message }); return; } res.status(200).json({ changes: this.changes }); }); });
app.delete('/api/asset-typologies/:id', (req, res) => { db.run("DELETE FROM asset_typologies WHERE id = ?", [req.params.id], function(err) { if (err) { res.status(500).json({ "error": err.message }); return; } res.status(200).json({ deleted: this.changes }); }); });
app.get('/api/custom-options', (req, res) => { const { field_key } = req.query; if (!field_key) { return res.status(400).json({ "error": "O parâmetro 'field_key' é obrigatório." }); } db.all("SELECT * FROM custom_options WHERE field_key = ? ORDER BY value", [field_key], (err, rows) => { if (err) { res.status(500).json({ "error": err.message }); return; } res.json(rows); }); });
app.post('/api/custom-options', (req, res) => { const { field_key, value } = req.body; if (!field_key || !value) { return res.status(400).json({ "error": "Campos 'field_key' e 'value' são obrigatórios." }); } db.run("INSERT INTO custom_options (field_key, value) VALUES (?, ?)", [field_key, value], function(err) { if (err) { res.status(500).json({ "error": err.message }); return; } res.status(201).json({ "id": this.lastID }); }); });
app.delete('/api/custom-options/:id', (req, res) => { db.run("DELETE FROM custom_options WHERE id = ?", [req.params.id], function(err) { if (err) { res.status(500).json({ "error": err.message }); return; } res.status(200).json({ deleted: this.changes }); }); });
app.get('/api/source-configurations', (req, res) => { db.all("SELECT * FROM source_configurations", [], (err, rows) => { if (err) { res.status(500).json({ "error": err.message }); return; } res.json(rows); }); });
app.post('/api/source-configurations', (req, res) => { const { source_type, reporting_frequency } = req.body; if (!source_type || !reporting_frequency) { return res.status(400).json({ "error": "Campos 'source_type' e 'reporting_frequency' são obrigatórios." }); } db.run(`UPDATE source_configurations SET reporting_frequency = ? WHERE source_type = ?`, [reporting_frequency, source_type], function (err) { if (err) { return res.status(500).json({ "error": err.message }); } if (this.changes === 0) { db.run(`INSERT INTO source_configurations (source_type, reporting_frequency) VALUES (?, ?)`, [source_type, reporting_frequency], function (err) { if (err) { return res.status(500).json({ "error": err.message }); } res.status(201).json({ message: "Configuração criada com sucesso." }); }); } else { res.status(200).json({ message: "Configuração atualizada com sucesso." }); } }); });

// ROTA INTELIGENTE ATUALIZADA (SPRINT 15.5)
app.get('/api/intelligent-template/:sourceType', (req, res) => {
    const { sourceType } = req.params;
    const { unitId, year } = req.query;

    const schema = validationSchemas[sourceType];
    if (!schema) {
        return res.status(404).send('Tipo de fonte não encontrado.');
    }

    const getFrequency = new Promise((resolve, reject) => {
        db.get("SELECT reporting_frequency FROM source_configurations WHERE source_type = ?", [sourceType], (err, row) => {
            if (err) return reject(err);
            resolve(row ? row.reporting_frequency : 'anual');
        });
    });

    const getTypologies = new Promise((resolve, reject) => {
        let sql = "SELECT T.*, U.name as unit_name FROM asset_typologies T JOIN units U ON T.unit_id = U.id WHERE T.source_type = ?";
        const params = [sourceType];
        if (unitId && unitId !== 'all') { // Adiciona filtro se não for "todas"
            sql += " AND T.unit_id = ?";
            params.push(unitId);
        }
        db.all(sql, params, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });

    Promise.all([getFrequency, getTypologies]).then(([frequency, typologies]) => {
        const dataForExcel = [];
        const headers = schema.headerDisplayNames;
        const headerKeys = Object.keys(headers);
        const reportYear = year || new Date().getFullYear();

        const periods = frequency === 'mensal' 
            ? ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
            : ["Anual"];

        typologies.forEach(typo => {
            const assetFields = JSON.parse(typo.asset_fields || '{}');
            
            periods.forEach(period => {
                const row = {};
                headerKeys.forEach(key => {
                    const headerName = headers[key];
                    // Preenchimento pré-definido
                    if (key === 'ano') row[headerName] = reportYear;
                    else if (key === 'periodo') row[headerName] = period;
                    else if (key === 'unidade_empresarial') row[headerName] = typo.unit_name;
                    // Mapeamento dinâmico para descrições
                    else if (['descricao_da_fonte', 'descricao_fonte', 'fonte_emissao', 'especificacoes_insumo', 'produto'].includes(key)) {
                        row[headerName] = typo.description;
                    }
                    // Mapeamento dos campos JSON
                    else {
                        row[headerName] = assetFields[key] || '';
                    }
                });
                dataForExcel.push(row);
            });
        });
        
        try {
            const worksheet = xlsx.utils.json_to_sheet(dataForExcel, { header: Object.values(headers) });
            const colWidths = Object.values(headers).map(header => ({ wch: Math.max(header.length, 15) + 2 }));
            worksheet['!cols'] = colWidths;
            
            const workbook = xlsx.utils.book_new();
            xlsx.utils.book_append_sheet(workbook, worksheet, schema.displayName);

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


// --- 6. INICIALIZAÇÃO DO SERVIDOR ---
app.listen(PORT, () => {
    console.log(`Servidor iniciado com sucesso na porta ${PORT}`);
});
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

// --- 2. CONFIGURAÇÕES ---
const app = express();
const PORT = 3000;
const saltRounds = 10;
const upload = multer({ dest: path.join(__dirname, 'uploads/') });

// --- 3. MIDDLEWARES ---
app.use(cors());
app.use(express.json());
const frontendPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendPath));
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

// Rota GET Contatos
app.get('/api/contacts', (req, res) => {
    db.all("SELECT * FROM contacts ORDER BY name", [], (err, rows) => {
        if (err) return res.status(500).json({ "error": err.message });
        res.json(rows);
    });
});

// Rota POST Contatos
app.post('/api/contacts', (req, res) => {
    const { name, area, email, phone } = req.body;
    if (!name) return res.status(400).json({ "error": "O nome é obrigatório." });
    db.run("INSERT INTO contacts (name, area, email, phone) VALUES (?, ?, ?, ?)", [name, area, email, phone], function(err) {
        if (err) return res.status(500).json({ "error": err.message });
        res.status(201).json({ "id": this.lastID });
    });
});

// Rota PUT Contatos
app.put('/api/contacts/:id', (req, res) => {
    const { name, area, email, phone } = req.body;
    db.run("UPDATE contacts SET name = ?, area = ?, email = ?, phone = ? WHERE id = ?", [name, area, email, phone, req.params.id], function(err) {
        if (err) return res.status(500).json({ "error": err.message });
        res.status(200).json({ changes: this.changes });
    });
});

// Rota DELETE Contatos
app.delete('/api/contacts/:id', (req, res) => {
    db.run("DELETE FROM contacts WHERE id = ?", [req.params.id], function(err) {
        if (err) return res.status(500).json({ "error": err.message });
        res.status(200).json({ deleted: this.changes });
    });
});

// Dentro de backend/server.js, substitua a rota de upload

app.post('/api/upload', upload.single('file'), (req, res) => {
    console.log("--- ROTA /api/upload INICIADA ---");

    if (!req.file) {
        console.log("ERRO: Nenhum arquivo foi recebido pelo multer.");
        return res.status(400).send('Nenhum arquivo enviado.');
    }

    console.log("Arquivo recebido:", req.file.originalname);
    const filePath = req.file.path;
    let results = [];

    try {
        if (req.file.originalname.endsWith('.csv')) {
            console.log("Processando arquivo CSV...");
            fs.createReadStream(filePath)
                .pipe(csv({ mapHeaders: ({ header }) => header.toLowerCase().trim().replace(/\s+/g, '_').replace(/[^\w-]/g, '') }))
                .on('data', (data) => results.push(data))
                .on('end', () => {
                    fs.unlinkSync(filePath);
                    console.log("Processamento CSV concluído. Enviando dados.");
                    res.status(200).json(results);
                });

        } else if (req.file.originalname.endsWith('.xlsx') || req.file.originalname.endsWith('.xls')) {
            console.log("Processando arquivo Excel...");
            
            const workbook = xlsx.readFile(filePath);
            console.log("1. Arquivo Excel lido com sucesso.");

            const sheetName = workbook.SheetNames[0];
            console.log("2. Nome da primeira aba:", sheetName);

            const worksheet = workbook.Sheets[sheetName];
            const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1, defval: "" });
            console.log("3. Dados convertidos para array de arrays.");

            if (!jsonData || jsonData.length < 1) {
                throw new Error("A planilha está vazia ou a primeira linha (cabeçalho) não foi encontrada.");
            }

            const headers = jsonData[0].map(h => h.toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim().replace(/\s+/g, '_').replace(/[^\w-]/g, ''));
            console.log("4. Cabeçalhos padronizados:", headers);
            
            const data = jsonData.slice(1).map(row => {
                const rowData = {};
                headers.forEach((header, index) => {
                    rowData[header] = row[index];
                });
                return rowData;
            });
            
            results = data;
            fs.unlinkSync(filePath);
            console.log("5. Processamento Excel concluído. Enviando dados.");
            res.status(200).json(results);

        } else {
            fs.unlinkSync(filePath);
            console.log("ERRO: Formato de arquivo não suportado.");
            return res.status(400).json({ message: 'Formato de arquivo não suportado. Use CSV ou XLSX.' });
        }
    } catch (error) {
        // Este é o log mais importante
        console.error("!!! ERRO CAPTURADO DENTRO DO BLOCO CATCH !!!", error);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        res.status(500).json({ message: 'Erro interno ao processar o arquivo.' });
    }
});
// SALVAR DADOS (NOVA ROTA DINÂMICA)
app.post('/api/save-data/:tableName', (req, res) => {
    const { tableName } = req.params;
    const dataRows = req.body;
    const allowedTables = { 
        combustao_movel: 'mobile_combustion_data',
        combustao_estacionaria: 'stationary_combustion_data' // <-- NOVO
    };
    if (!allowedTables[tableName]) return res.status(400).json({ message: "Tipo de tabela inválido." });
    const dbTableName = allowedTables[tableName];
    const columns = Object.keys(dataRows[0]);
    const placeholders = columns.map(() => '?').join(', ');
    const sql = `INSERT INTO ${dbTableName} (${columns.join(', ')}) VALUES (${placeholders})`;
    db.serialize(() => {
        db.run("BEGIN TRANSACTION");
        dataRows.forEach(row => {
            const values = columns.map(col => row[col]);
            db.run(sql, values);
        });
        db.run("COMMIT", (err) => {
            if (err) return res.status(500).json({ message: "Erro ao salvar os dados." });
            res.status(201).json({ message: `Dados de "${tableName}" salvos com sucesso!` });
        });
    });
});
const HOST = '0.0.0.0';
// --- 6. INICIALIZAÇÃO DO SERVIDOR ---
app.listen(PORT, () => {
    console.log(`Servidor iniciado com sucesso! Acesse em http://localhost:${PORT}`);
});
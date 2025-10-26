// arquivo: backend/database.js

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'ecofinance.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao abrir o banco de dados', err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite em:', dbPath);
    
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE,
            password TEXT
        )`, (err) => {
            if (err) console.error('Erro tabela users:', err);
            else console.log('Tabela "users" pronta.');
        });

        db.run(`CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            area TEXT,
            email TEXT,
            phone TEXT
        )`, (err) => {
            if (err) console.error('Erro tabela contacts:', err);
            else console.log('Tabela "contacts" pronta.');
        });

        // --- TABELA FALTANTE ADICIONADA AQUI ---
        db.run(`CREATE TABLE IF NOT EXISTS units (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            address TEXT
        )`, (err) => {
            if (err) console.error('Erro tabela units:', err);
            else console.log('Tabela "units" pronta.');
        });
        // --- FIM DA ADIÇÃO ---
        
        db.run(`CREATE TABLE IF NOT EXISTS mobile_combustion_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ano INTEGER,
            periodo TEXT,
            unidade_empresarial TEXT,
            descricao_fonte TEXT,
            controlado_empresa BOOLEAN,
            tipo_entrada TEXT,
            combustivel TEXT,
            consumo REAL,
            unidade_consumo TEXT,
            distancia_percorrida REAL,
            unidade_distancia TEXT,
            tipo_veiculo TEXT,
            responsavel TEXT,
            email_do_responsavel TEXT,
            telefone_do_responsavel TEXT
        )`, (err) => {
            if (err) console.error('Erro tabela mobile_combustion_data:', err);
            else console.log('Tabela "mobile_combustion_data" pronta.');
        });

        db.run(`CREATE TABLE IF NOT EXISTS stationary_combustion_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ano INTEGER,
            periodo TEXT,
            unidade_empresarial TEXT,
            descricao_da_fonte TEXT,
            tipo_da_fonte TEXT,
            combustivel TEXT,
            consumo REAL,
            unidade TEXT,
            responsavel TEXT,
            email_do_responsavel TEXT,
            telefone_do_responsavel TEXT
        )`, (err) => {
            if (err) console.error('Erro tabela stationary_combustion_data:', err);
            else console.log('Tabela "stationary_combustion_data" pronta.');
        });
    });
  }
});

module.exports = db;
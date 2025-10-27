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

        db.run(`CREATE TABLE IF NOT EXISTS units (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            cidade TEXT,
            estado TEXT,
            pais TEXT,
            cep TEXT
        )`, (err) => {
            if (err) console.error('Erro tabela units:', err);
            else console.log('Tabela "units" pronta.');
        });
        
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

        db.run(`CREATE TABLE IF NOT EXISTS production_sales_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ano INTEGER NOT NULL,
            periodo TEXT,
            unidade_empresarial TEXT NOT NULL,
            produto TEXT NOT NULL,
            quantidade_vendida INTEGER CHECK(quantidade_vendida > 0),
            unidade_medida TEXT NOT NULL,
            uso_final_produtos TEXT NOT NULL,
            responsavel TEXT NOT NULL,
            area_responsavel TEXT,
            email_do_responsavel TEXT,
            telefone_do_responsavel TEXT,
            rastreabilidade TEXT,
            comentarios TEXT
        )`, (err) => {
            if (err) console.error('Erro tabela production_sales_data:', err);
            else console.log('Tabela "production_sales_data" pronta.');
        });

        db.run(`CREATE TABLE IF NOT EXISTS lubricants_ippu_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ano INTEGER,
            periodo TEXT,
            unidade_empresarial TEXT,
            fonte_emissao TEXT,
            tipo_lubrificante TEXT,
            consumo REAL,
            unidade TEXT,
            utilizacao TEXT,
            controlado_empresa BOOLEAN,
            responsavel TEXT,
            email_do_responsavel TEXT,
            telefone_do_responsavel TEXT
        )`, (err) => {
            if (err) console.error('Erro tabela lubricants_ippu_data:', err);
            else console.log('Tabela "lubricants_ippu_data" pronta.');
        });

        db.run(`CREATE TABLE IF NOT EXISTS fugitive_emissions_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ano INTEGER,
            periodo TEXT,
            unidade_empresarial TEXT,
            fonte_emissao TEXT,
            tipo_gas TEXT,
            quantidade_reposta REAL,
            unidade TEXT,
            nome_comercial_gas TEXT,
            gas_emissor_composicao TEXT,
            percentual_emissao REAL,
            responsavel TEXT,
            email_do_responsavel TEXT,
            telefone_do_responsavel TEXT,
            rastreabilidade TEXT,
            comentarios TEXT
        )`, (err) => {
            if (err) console.error('Erro tabela fugitive_emissions_data:', err);
            else console.log('Tabela "fugitive_emissions_data" pronta.');
        });

        db.run(`CREATE TABLE IF NOT EXISTS fertilizers_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ano INTEGER,
            periodo TEXT,
            unidade_empresarial TEXT,
            especificacoes_insumo TEXT,
            tipo_fertilizante TEXT,
            quantidade_kg REAL,
            unidade TEXT,
            percentual_nitrogenio REAL,
            percentual_carbonato REAL,
            controlado_empresa BOOLEAN,
            responsavel TEXT,
            email_do_responsavel TEXT,
            telefone_do_responsavel TEXT,
            rastreabilidade TEXT,
            comentarios TEXT
        )`, (err) => {
            if (err) console.error('Erro tabela fertilizers_data:', err);
            else console.log('Tabela "fertilizers_data" pronta.');
        });

        // --- NOVAS TABELAS (SPRINT 15 - FASE 1) ---

        db.run(`CREATE TABLE IF NOT EXISTS asset_typologies (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            unit_id INTEGER NOT NULL,
            source_type TEXT NOT NULL,
            quantity INTEGER NOT NULL,
            description TEXT NOT NULL,
            asset_fields TEXT,
            is_active BOOLEAN DEFAULT TRUE
        )`, (err) => {
            if (err) console.error('Erro tabela asset_typologies:', err);
            else console.log('Tabela "asset_typologies" pronta.');
        });

        db.run(`CREATE TABLE IF NOT EXISTS custom_options (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            field_key TEXT NOT NULL,
            value TEXT NOT NULL,
            UNIQUE(user_id, field_key, value)
        )`, (err) => {
            if (err) console.error('Erro tabela custom_options:', err);
            else console.log('Tabela "custom_options" pronta.');
        });

        db.run(`CREATE TABLE IF NOT EXISTS source_configurations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            source_type TEXT NOT NULL,
            reporting_frequency TEXT NOT NULL,
            UNIQUE(user_id, source_type)
        )`, (err) => {
            if (err) console.error('Erro tabela source_configurations:', err);
            else console.log('Tabela "source_configurations" pronta.');
        });

    });
  }
});

module.exports = db;
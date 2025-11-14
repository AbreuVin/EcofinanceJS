// arquivo: backend/database.js

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const { validationSchemas } = require('../shared/validators.js');

const dbPath = path.resolve(__dirname, 'ecofinance.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao abrir o banco de dados', err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite em:', dbPath);
    
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE, password TEXT)`, (err) => { if (err) console.error('Erro tabela users:', err); else console.log('Tabela "users" pronta.'); });
        
        // --- ATENÇÃO: COLUNA "area" REMOVIDA ---
        db.run(`CREATE TABLE IF NOT EXISTS contacts (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, unit_id INTEGER, email TEXT, phone TEXT, FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE SET NULL)`, (err) => { if (err) console.error('Erro tabela contacts:', err); else console.log('Tabela "contacts" pronta.'); });
        
        db.run(`CREATE TABLE IF NOT EXISTS units (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, cidade TEXT, estado TEXT, pais TEXT, numero_colaboradores INTEGER)`, (err) => { if (err) console.error('Erro tabela units:', err); else console.log('Tabela "units" pronta.'); });
        db.run(`CREATE TABLE IF NOT EXISTS mobile_combustion_data (id INTEGER PRIMARY KEY AUTOINCREMENT, ano INTEGER, periodo TEXT, unidade_empresarial TEXT, descricao_fonte TEXT, controlado_empresa BOOLEAN, tipo_entrada TEXT, combustivel TEXT, consumo REAL, unidade_consumo TEXT, distancia_percorrida REAL, unidade_distancia TEXT, tipo_veiculo TEXT)`, (err) => { if (err) console.error('Erro tabela mobile_combustion_data:', err); else console.log('Tabela "mobile_combustion_data" pronta.'); });
        db.run(`CREATE TABLE IF NOT EXISTS stationary_combustion_data (id INTEGER PRIMARY KEY AUTOINCREMENT, ano INTEGER, periodo TEXT, unidade_empresarial TEXT, descricao_da_fonte TEXT, combustivel TEXT, consumo REAL, unidade TEXT, controlado_empresa BOOLEAN)`, (err) => { if (err) console.error('Erro tabela stationary_combustion_data:', err); else console.log('Tabela "stationary_combustion_data" pronta.'); });

        // --- ATENÇÃO: COLUNAS "uso_final_produtos" E "rastreabilidade" REMOVIDAS ---
        db.run(`CREATE TABLE IF NOT EXISTS production_sales_data (id INTEGER PRIMARY KEY AUTOINCREMENT, ano INTEGER NOT NULL, periodo TEXT, unidade_empresarial TEXT NOT NULL, produto TEXT NOT NULL, quantidade_vendida INTEGER CHECK(quantidade_vendida > 0), unidade_medida TEXT NOT NULL, comentarios TEXT)`, (err) => { if (err) console.error('Erro tabela production_sales_data:', err); else console.log('Tabela "production_sales_data" pronta.'); });
        
        // --- ATENÇÃO: COLUNA "utilizacao" REMOVIDA ---
        db.run(`CREATE TABLE IF NOT EXISTS lubricants_ippu_data (id INTEGER PRIMARY KEY AUTOINCREMENT, ano INTEGER, periodo TEXT, unidade_empresarial TEXT, fonte_emissao TEXT, tipo_lubrificante TEXT, consumo REAL, unidade TEXT, controlado_empresa BOOLEAN)`, (err) => { if (err) console.error('Erro tabela lubricants_ippu_data:', err); else console.log('Tabela "lubricants_ippu_data" pronta.'); });
        
        // --- ATENÇÃO: COLUNAS DE GÁS COMPOSTO E "rastreabilidade" REMOVIDAS ---
        db.run(`CREATE TABLE IF NOT EXISTS fugitive_emissions_data (id INTEGER PRIMARY KEY AUTOINCREMENT, ano INTEGER, periodo TEXT, unidade_empresarial TEXT, fonte_emissao TEXT, tipo_gas TEXT, quantidade_reposta REAL, unidade TEXT, controlado_empresa BOOLEAN, comentarios TEXT)`, (err) => { if (err) console.error('Erro tabela fugitive_emissions_data:', err); else console.log('Tabela "fugitive_emissions_data" pronta.'); });

        // --- ATENÇÃO: COLUNAS "especificacoes_insumo" E "rastreabilidade" REMOVIDAS ---
        db.run(`CREATE TABLE IF NOT EXISTS fertilizers_data (id INTEGER PRIMARY KEY AUTOINCREMENT, ano INTEGER, periodo TEXT, unidade_empresarial TEXT, tipo_fertilizante TEXT, quantidade_kg REAL, unidade TEXT, percentual_nitrogenio REAL, percentual_carbonato REAL, controlado_empresa BOOLEAN, comentarios TEXT)`, (err) => { if (err) console.error('Erro tabela fertilizers_data:', err); else console.log('Tabela "fertilizers_data" pronta.'); });
        
        // --- ATENÇÃO: COLUNA "rastreabilidade" REMOVIDA ---
        db.run(`
            CREATE TABLE IF NOT EXISTS effluents_controlled_data (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ano INTEGER NOT NULL,
                periodo TEXT NOT NULL,
                unidade_empresarial TEXT NOT NULL,
                tratamento_ou_destino TEXT NOT NULL,
                tipo_tratamento TEXT,
                tipo_destino_final TEXT,
                qtd_efluente_liquido_m3 REAL NOT NULL,
                unidade_efluente_liquido TEXT NOT NULL,
                qtd_componente_organico REAL NOT NULL,
                unidade_componente_organico TEXT NOT NULL,
                qtd_nitrogenio_mg_l REAL NOT NULL,
                unidade_nitrogenio TEXT NOT NULL,
                componente_organico_removido_lodo REAL,
                unidade_comp_organico_removido_lodo TEXT,
                comentarios TEXT
            )
        `, (err) => { if (err) console.error('Erro tabela effluents_controlled_data:', err); else console.log('Tabela "effluents_controlled_data" pronta.'); });
        
        // --- ATENÇÃO: COLUNA "rastreabilidade" REMOVIDA ---
        db.run(`
            CREATE TABLE IF NOT EXISTS domestic_effluents_data (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ano INTEGER NOT NULL,
                periodo TEXT NOT NULL,
                unidade_empresarial TEXT NOT NULL,
                num_medio_colaboradores INTEGER NOT NULL,
                carga_horaria_media_colaboradores REAL NOT NULL,
                num_medio_terceiros INTEGER NOT NULL,
                carga_horaria_media_terceiros REAL NOT NULL,
                fossa_septica_propriedade TEXT NOT NULL,
                comentarios TEXT
            )
        `, (err) => { if (err) console.error('Erro tabela domestic_effluents_data:', err); else console.log('Tabela "domestic_effluents_data" pronta.'); });
        
        // --- ATENÇÃO: COLUNA "rastreabilidade" REMOVIDA ---
        db.run(`
            CREATE TABLE IF NOT EXISTS land_use_change_data (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ano INTEGER NOT NULL,
                periodo TEXT NOT NULL,
                unidade_empresarial TEXT NOT NULL,
                uso_solo_anterior TEXT NOT NULL,
                bioma TEXT,
                fitofisionomia TEXT,
                tipo_area TEXT,
                area_hectare REAL NOT NULL,
                comentarios TEXT
            )
        `, (err) => { if (err) console.error('Erro tabela land_use_change_data:', err); else console.log('Tabela "land_use_change_data" pronta.'); });
        
        db.run(`CREATE TABLE IF NOT EXISTS asset_typologies (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, unit_id INTEGER NOT NULL, source_type TEXT NOT NULL, description TEXT NOT NULL, asset_fields TEXT, is_active BOOLEAN DEFAULT TRUE)`, (err) => { if (err) console.error('Erro tabela asset_typologies:', err); else console.log('Tabela "asset_typologies" pronta.'); });
        db.run(`CREATE TABLE IF NOT EXISTS managed_options (id INTEGER PRIMARY KEY AUTOINCREMENT, field_key TEXT NOT NULL, value TEXT NOT NULL, UNIQUE(field_key, value))`, (err) => { if (err) console.error('Erro tabela managed_options:', err); else console.log('Tabela "managed_options" pronta.'); });
        db.run(`DROP TABLE IF EXISTS custom_options`, (err) => { if (err) console.error('Erro ao remover tabela antiga custom_options:', err); });
        db.run(`CREATE TABLE IF NOT EXISTS source_configurations (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, source_type TEXT NOT NULL, reporting_frequency TEXT NOT NULL, UNIQUE(user_id, source_type))`, (err) => { if (err) console.error('Erro tabela source_configurations:', err); else console.log('Tabela "source_configurations" pronta.'); });
        db.run(`CREATE TABLE IF NOT EXISTS contact_source_associations (contact_id INTEGER NOT NULL, source_type TEXT NOT NULL, PRIMARY KEY (contact_id, source_type), FOREIGN KEY (contact_id) REFERENCES contacts (id) ON DELETE CASCADE)`, (err) => { if (err) console.error('Erro tabela contact_source_associations:', err); else console.log('Tabela "contact_source_associations" pronta.'); });

        
        console.log('Iniciando o seeding de opções padrão...');
        const sql = `INSERT OR IGNORE INTO managed_options (field_key, value) VALUES (?, ?)`;
        let totalOptions = 0;
        
        
        for (const schemaKey in validationSchemas) {
            const schema = validationSchemas[schemaKey];
            const options = schema.validOptions || {};
            
            for (const fieldKey in options) {
                const optionValues = Array.isArray(options[fieldKey]) ? options[fieldKey] : [];
                optionValues.forEach(value => {
                    db.run(sql, [fieldKey, value]);
                    totalOptions++;
                });
            }
        }
        console.log(`Seeding de opções padrão concluído. ${totalOptions} opções verificadas.`);
        
    });
  }
});

module.exports = db;
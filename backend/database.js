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
        // --- TABELAS DE SISTEMA ---
        db.run(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE, password TEXT)`, (err) => { if (err) console.error('Erro tabela users:', err); });
        
        db.run(`CREATE TABLE IF NOT EXISTS contacts (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, unit_id INTEGER, email TEXT, phone TEXT, FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE SET NULL)`, (err) => { if (err) console.error('Erro tabela contacts:', err); });
        
        db.run(`CREATE TABLE IF NOT EXISTS units (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, cidade TEXT, estado TEXT, pais TEXT, numero_colaboradores INTEGER)`, (err) => { if (err) console.error('Erro tabela units:', err); });

        // --- TABELAS DE DADOS (Com a coluna 'comentarios' garantida nos Creates) ---
        
        db.run(`CREATE TABLE IF NOT EXISTS mobile_combustion_data (id INTEGER PRIMARY KEY AUTOINCREMENT, ano INTEGER, periodo TEXT, unidade_empresarial TEXT, descricao_fonte TEXT, controlado_empresa BOOLEAN, tipo_entrada TEXT, combustivel TEXT, consumo REAL, unidade_consumo TEXT, distancia_percorrida REAL, unidade_distancia TEXT, tipo_veiculo TEXT, comentarios TEXT)`, (err) => { if (err) console.error('Erro tabela mobile_combustion_data:', err); });
        
        db.run(`CREATE TABLE IF NOT EXISTS stationary_combustion_data (id INTEGER PRIMARY KEY AUTOINCREMENT, ano INTEGER, periodo TEXT, unidade_empresarial TEXT, descricao_da_fonte TEXT, combustivel_estacionario TEXT, consumo REAL, unidade TEXT, controlado_empresa BOOLEAN, comentarios TEXT)`, (err) => { if (err) console.error('Erro tabela stationary_combustion_data:', err); });

        db.run(`CREATE TABLE IF NOT EXISTS production_sales_data (id INTEGER PRIMARY KEY AUTOINCREMENT, ano INTEGER NOT NULL, periodo TEXT, unidade_empresarial TEXT NOT NULL, produto TEXT NOT NULL, quantidade_vendida INTEGER CHECK(quantidade_vendida > 0), unidade_medida TEXT NOT NULL, comentarios TEXT)`, (err) => { if (err) console.error('Erro tabela production_sales_data:', err); });
        
        db.run(`CREATE TABLE IF NOT EXISTS lubricants_ippu_data (id INTEGER PRIMARY KEY AUTOINCREMENT, ano INTEGER, periodo TEXT, unidade_empresarial TEXT, fonte_emissao TEXT, tipo_lubrificante TEXT, consumo REAL, unidade TEXT, controlado_empresa BOOLEAN, comentarios TEXT)`, (err) => { if (err) console.error('Erro tabela lubricants_ippu_data:', err); });
        
        db.run(`CREATE TABLE IF NOT EXISTS fugitive_emissions_data (id INTEGER PRIMARY KEY AUTOINCREMENT, ano INTEGER, periodo TEXT, unidade_empresarial TEXT, fonte_emissao TEXT, tipo_gas TEXT, quantidade_reposta REAL, unidade TEXT, controlado_empresa BOOLEAN, comentarios TEXT)`, (err) => { if (err) console.error('Erro tabela fugitive_emissions_data:', err); });

        db.run(`CREATE TABLE IF NOT EXISTS fertilizers_data (id INTEGER PRIMARY KEY AUTOINCREMENT, ano INTEGER, periodo TEXT, unidade_empresarial TEXT, tipo_fertilizante TEXT, quantidade_kg REAL, unidade TEXT, percentual_nitrogenio REAL, percentual_carbonato REAL, controlado_empresa BOOLEAN, comentarios TEXT)`, (err) => { if (err) console.error('Erro tabela fertilizers_data:', err); });
        
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
        `, (err) => { if (err) console.error('Erro tabela effluents_controlled_data:', err); });
        
        // Recriação de tabela que sofreu alteração estrutural recente
        db.run(`CREATE TABLE IF NOT EXISTS domestic_effluents_data (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ano INTEGER NOT NULL,
                periodo TEXT NOT NULL,
                unidade_empresarial TEXT NOT NULL,
                tipo_trabalhador TEXT NOT NULL,
                num_trabalhadores INTEGER NOT NULL,
                carga_horaria_media REAL NOT NULL,
                fossa_septica_propriedade TEXT NOT NULL,
                comentarios TEXT
            )`, (err) => { if (err) console.error('Erro tabela domestic_effluents_data:', err); });
        
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
        `, (err) => { if (err) console.error('Erro tabela land_use_change_data:', err); });
        
        db.run(`
            CREATE TABLE IF NOT EXISTS solid_waste_data (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ano INTEGER,
                periodo TEXT,
                unidade_empresarial TEXT,
                destinacao_final TEXT,
                tipo_residuo TEXT,
                quantidade_gerado REAL,
                unidade TEXT,
                informar_cidade_uf TEXT,
                local_controlado_empresa TEXT,
                responsavel TEXT,
                area_responsavel TEXT,
                email TEXT,
                telefone TEXT,
                rastreabilidade_interna TEXT,
                comentarios TEXT
            )
        `, (err) => { if (err) console.error('Erro tabela solid_waste_data:', err); });

        db.run(`
            CREATE TABLE IF NOT EXISTS electricity_purchase_data (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ano INTEGER,
                periodo TEXT,
                unidade_empresarial TEXT,
                fonte_energia TEXT,
                especificar_fonte TEXT,
                consumo REAL,
                unidade_medida TEXT,
                responsavel TEXT,
                area_responsavel TEXT,
                email TEXT,
                telefone TEXT,
                rastreabilidade TEXT,
                comentarios TEXT
            )
        `, (err) => { if (err) console.error('Erro tabela electricity_purchase_data:', err); });

        db.run(`
            CREATE TABLE IF NOT EXISTS purchased_goods_services_data (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ano INTEGER,
                periodo TEXT,
                unidade_empresarial TEXT,
                descricao_item TEXT,
                tipo_item TEXT,
                quantidade REAL,
                unidade TEXT,
                valor_aquisicao REAL,
                bens_terceiros TEXT,
                responsavel TEXT,
                area_responsavel TEXT,
                email TEXT,
                telefone TEXT,
                comentarios TEXT
            )
        `, (err) => { if (err) console.error('Erro tabela purchased_goods_services_data:', err); });

        db.run(`
            CREATE TABLE IF NOT EXISTS capital_goods_data (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ano INTEGER,
                periodo TEXT,
                unidade_empresarial TEXT,
                bem_capital TEXT,
                quantidade INTEGER,
                unidade TEXT,
                valor_aquisicao REAL,
                responsavel TEXT,
                area_responsavel TEXT,
                email TEXT,
                telefone TEXT,
                comentarios TEXT
            )
        `, (err) => { if (err) console.error('Erro tabela capital_goods_data:', err); });

        db.run(`
            CREATE TABLE IF NOT EXISTS upstream_transport_data (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ano INTEGER,
                periodo TEXT,
                unidade_empresarial TEXT,
                insumo_transportado TEXT,
                modal_transporte TEXT,
                tipo_reporte TEXT,
                combustivel TEXT,
                consumo REAL,
                unidade_consumo TEXT,
                classificacao_veiculo TEXT,
                distancia_trecho REAL,
                unidade_distancia TEXT,
                carga_transportada REAL,
                numero_viagens INTEGER,
                local_embarque TEXT,
                local_destino TEXT,
                responsavel TEXT,
                area_responsavel TEXT,
                email TEXT,
                telefone TEXT,
                comentarios TEXT
            )
        `, (err) => { if (err) console.error('Erro tabela upstream_transport_data:', err); });

        db.run(`
            CREATE TABLE IF NOT EXISTS business_travel_land_data (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ano INTEGER,
                periodo TEXT,
                unidade_empresarial TEXT,
                descricao_viagem TEXT,
                modal_viagem TEXT,
                tipo_reporte TEXT,
                combustivel TEXT,
                consumo REAL,
                unidade_consumo TEXT,
                distancia_percorrida REAL,
                unidade_distancia TEXT,
                km_reembolsado TEXT,
                responsavel TEXT,
                area_responsavel TEXT,
                email TEXT,
                telefone TEXT,
                comentarios TEXT
            )
        `, (err) => { if (err) console.error('Erro tabela business_travel_land_data:', err); });

        db.run(`
            CREATE TABLE IF NOT EXISTS downstream_transport_data (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ano INTEGER,
                periodo TEXT,
                unidade_empresarial TEXT,
                insumo_transportado TEXT,
                modal_transporte TEXT,
                tipo_reporte TEXT,
                combustivel TEXT,
                consumo REAL,
                unidade_consumo TEXT,
                classificacao_veiculo TEXT,
                distancia_trecho REAL,
                unidade_distancia TEXT,
                carga_transportada REAL,
                numero_viagens INTEGER,
                local_embarque TEXT,
                local_destino TEXT,
                responsavel TEXT,
                area_responsavel TEXT,
                email TEXT,
                telefone TEXT,
                comentarios TEXT
            )
        `, (err) => { if (err) console.error('Erro tabela downstream_transport_data:', err); });

        db.run(`
            CREATE TABLE IF NOT EXISTS waste_transport_data (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ano INTEGER,
                periodo TEXT,
                unidade_empresarial TEXT,
                insumo_transportado TEXT,
                tipo_reporte TEXT,
                combustivel TEXT,
                consumo REAL,
                unidade_consumo TEXT,
                classificacao_veiculo TEXT,
                distancia_trecho REAL,
                unidade_distancia TEXT,
                carga_transportada REAL,
                numero_viagens INTEGER,
                responsavel TEXT,
                area_responsavel TEXT,
                email TEXT,
                telefone TEXT,
                comentarios TEXT
            )
        `, (err) => { if (err) console.error('Erro tabela waste_transport_data:', err); });

        db.run(`
            CREATE TABLE IF NOT EXISTS home_office_data (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ano INTEGER,
                periodo TEXT,
                unidade_empresarial TEXT,
                regime_trabalho TEXT,
                num_funcionarios INTEGER,
                responsavel TEXT,
                area_responsavel TEXT,
                email TEXT,
                telefone TEXT,
                comentarios TEXT
            )
        `, (err) => { if (err) console.error('Erro tabela home_office_data:', err); });

        db.run(`
            CREATE TABLE IF NOT EXISTS air_travel_data (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ano INTEGER,
                periodo TEXT,
                unidade_empresarial TEXT,
                descricao_viagem TEXT,
                codigo_aeroporto_partida TEXT,
                codigo_aeroporto_chegada TEXT,
                numero_viagens INTEGER,
                responsavel TEXT,
                area_responsavel TEXT,
                email TEXT,
                telefone TEXT,
                comentarios TEXT
            )
        `, (err) => { if (err) console.error('Erro tabela air_travel_data:', err); });

        db.run(`
            CREATE TABLE IF NOT EXISTS employee_commuting_data (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ano INTEGER,
                periodo TEXT,
                unidade_empresarial TEXT,
                descricao_identificadora TEXT,
                meio_utilizado TEXT,
                tipo_reporte TEXT,
                tipo_combustivel TEXT,
                consumo REAL,
                unidade_consumo TEXT,
                distancia_km REAL,
                endereco_funcionario TEXT,
                endereco_trabalho TEXT,
                dias_deslocados INTEGER,
                responsavel TEXT,
                area_responsavel TEXT,
                email TEXT,
                telefone TEXT,
                comentarios TEXT
            )
        `, (err) => { if (err) console.error('Erro tabela employee_commuting_data:', err); });

        db.run(`
            CREATE TABLE IF NOT EXISTS energy_generation_data (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ano INTEGER,
                periodo TEXT,
                unidade_empresarial TEXT,
                descricao_fonte TEXT,
                fonte_geracao TEXT,
                total_geracao REAL,
                unidade_medida TEXT,
                responsavel TEXT,
                area_responsavel TEXT,
                email TEXT,
                telefone TEXT,
                comentarios TEXT
            )
        `, (err) => { if (err) console.error('Erro tabela energy_generation_data:', err); });

        db.run(`
            CREATE TABLE IF NOT EXISTS planted_forest_data (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ano INTEGER,
                periodo TEXT,
                unidade_empresarial TEXT,
                identificacao_area TEXT,
                nome_especie TEXT,
                area_antepenultimo REAL,
                idade_antepenultimo INTEGER,
                idade_penultimo INTEGER,
                area_colhida_penultimo REAL,
                area_atual REAL,
                responsavel TEXT,
                area_responsavel TEXT,
                email TEXT,
                telefone TEXT,
                comentarios TEXT
            )
        `, (err) => { if (err) console.error('Erro tabela planted_forest_data:', err); });

        db.run(`
            CREATE TABLE IF NOT EXISTS conservation_area_data (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ano INTEGER,
                periodo TEXT,
                unidade_empresarial TEXT,
                descricao TEXT,
                bioma TEXT,
                fitofisionomia TEXT,
                area_plantada TEXT,
                plantio TEXT,
                area_inicio_ano REAL,
                area_fim_ano REAL,
                motivo_alteracao TEXT,
                responsavel TEXT,
                area_responsavel TEXT,
                email TEXT,
                telefone TEXT,
                comentarios TEXT
            )
        `, (err) => { if (err) console.error('Erro tabela conservation_area_data:', err); });


        // --- TABELAS AUXILIARES ---
        db.run(`CREATE TABLE IF NOT EXISTS asset_typologies (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, unit_id INTEGER NOT NULL, source_type TEXT NOT NULL, description TEXT NOT NULL, asset_fields TEXT, is_active BOOLEAN DEFAULT TRUE, responsible_contact_id INTEGER REFERENCES contacts(id) ON DELETE SET NULL, reporting_frequency TEXT DEFAULT 'anual' NOT NULL)`, (err) => { if (err) console.error('Erro tabela asset_typologies:', err); });
        
        db.run(`CREATE TABLE IF NOT EXISTS managed_options (id INTEGER PRIMARY KEY AUTOINCREMENT, field_key TEXT NOT NULL, value TEXT NOT NULL, UNIQUE(field_key, value))`, (err) => { if (err) console.error('Erro tabela managed_options:', err); });
        db.run(`CREATE TABLE IF NOT EXISTS contact_source_associations (contact_id INTEGER NOT NULL, source_type TEXT NOT NULL, PRIMARY KEY (contact_id, source_type), FOREIGN KEY (contact_id) REFERENCES contacts (id) ON DELETE CASCADE)`, (err) => { if (err) console.error('Erro tabela contact_source_associations:', err); });

        // --- SEEDING DE OPÇÕES PADRÃO ---
        console.log('Iniciando o seeding de opções padrão...');
        const sqlOption = `INSERT OR IGNORE INTO managed_options (field_key, value) VALUES (?, ?)`;
        for (const schemaKey in validationSchemas) {
            const schema = validationSchemas[schemaKey];
            const options = schema.validOptions || {};
            for (const fieldKey in options) {
                const optionValues = Array.isArray(options[fieldKey]) ? options[fieldKey] : [];
                optionValues.forEach(value => {
                    db.run(sqlOption, [fieldKey, value]);
                });
            }
        }

        // --- AUTO-MIGRAÇÃO DE COLUNA 'comentarios' ---
        // Adiciona a coluna 'comentarios' em tabelas antigas que possam não ter
        const tablesToCheck = [
            'mobile_combustion_data',
            'stationary_combustion_data',
            'production_sales_data',
            'lubricants_ippu_data',
            'fugitive_emissions_data',
            'fertilizers_data',
            'effluents_controlled_data',
            'domestic_effluents_data',
            'land_use_change_data',
            'solid_waste_data',
            'electricity_purchase_data',
            'purchased_goods_services_data',
            'capital_goods_data',
            'upstream_transport_data',
            'business_travel_land_data',
            'downstream_transport_data',
            'waste_transport_data',
            'home_office_data',
            'air_travel_data',
            'employee_commuting_data',
            'energy_generation_data',
            'planted_forest_data',
            'conservation_area_data'
        ];

        tablesToCheck.forEach(table => {
            db.run(`ALTER TABLE ${table} ADD COLUMN comentarios TEXT`, (err) => {
                // Ignora erro se a coluna já existir
                if (err && !err.message.includes("duplicate column name")) {
                    console.error(`Erro ao adicionar comentarios em ${table}:`, err.message);
                }
            });
        });
        
        console.log('Banco de dados pronto e verificado.');
    });
  }
});

module.exports = db;
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.PG_Host,
    port: process.env.PG_Port,
    user: process.env.PG_User,
    password: process.env.PG_Pass,
    database: process.env.PG_Database,
    max: 10,                            
    connectionTimeoutMillis: 10000,     
    allowExitOnIdle: true,              
    idleTimeoutMillis: 30000            
});

async function testConnection() {
    let client;

    try {
        client = await pool.connect(); 
        console.log('Conectado com sucesso!!'); 
    } catch (err) { 
        console.log(`
            Falha na conexão:
            código do erro: ${err.code}
            erro: ${err}
        `);
    } finally {
        client.release();
    }
};

async function createTables() {
    try {

        /* TravelerStatus é INT:
            0: Preso > 30 dias de duração,
            1: Ativo,
            2: Inativo
        */
        /* TravelerReputation é INT:
            Ele se inicia em 50
            Se uma alteração for aprovada, +5,
            Else, -10
        */
        await pool.query(`
            CREATE TABLE IF NOT EXISTS travelers (
                TravelerID SERIAL UNIQUE PRIMARY KEY,
                Traveler varchar(255) NOT NULL UNIQUE,
                TravelerSecret varchar(255) NOT NULL,
                TravelerReputation INT NOT NULL DEFAULT 50,
                TravelerStatus INT NOT NULL DEFAULT 1,
                Travels INT[]
        )`).then('travelers table has been sucessfuly created');
        
        /* EventEra é INT:
            0: Todas > utilizada apenas em buscas, não deve ser inserida na DB,
            1: Primitiva,
            2: Média,
            3: Moderna,
            4: Pós humana
        */
        await pool.query(`
            CREATE TABLE IF NOT EXISTS events (
                EventID SERIAL UNIQUE PRIMARY KEY,
                EventName varchar(255) NOT NULL,
                EventDate DATE NOT NULL UNIQUE,
                EventDescription varchar(255),
                EventEra INT NOT NULL
        )`).then(console.log('events table has been sucessfuly created'));
        
        /* InterferenceType é INT:
            1: Correção,
            2: Modificação
        */
        /* InterferenceStatus é INT:
            0: Em análise > se ela se encaixa fora das regras de status do traveler, fica em analise,
            1: Aprovada,
            2: Negada
        */
        await pool.query(`
            CREATE TABLE IF NOT EXISTS interferences (
                InterferenceID SERIAL UNIQUE PRIMARY KEY,
                InterferenceType INT NOT NULL DEFAULT 2,
                InterferenceStatus INT NOT NULL DEFAULT 0,
                TravelerID INT NOT NULL
        )`).then(console.log('interferences table has been sucessfuly created'));
        
        /* 
            Abaixo, definimos alguns campos, o TravelerID é quem foi, e o EventID e para quando ele foi.
            Temos tbm o TravelStatus:
                1: Sucesso,
                2: Falha
        */
        await pool.query(`
            CREATE TABLE IF NOT EXISTS travels (
                TravelID SERIAL UNIQUE PRIMARY KEY,
                TravelerID INT NOT NULL,
                EventID INT NOT NULL,
                TravelStatus INT NOT NULL DEFAULT 1
            )`).then(console.log('travels table has been sucessfuly created'));
    } catch (err) {
        console.log(`
            Falha na criação das tabelas:
            código do erro: ${err.code}
            erro: ${err}
        `);
    }
}

testConnection().then(createTables())

module.exports= pool
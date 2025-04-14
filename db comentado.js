//Vamos começar importando o pg, ele que vai permitir a comunicação com uma database postgreSQL
require('dotenv').config();
const { Pool } = require('pg');

/*
    Percebam que eu importei o dotenv novamente, vamos usa-lo novamente por que definiremos algumas variaveis
    que estarão definidas dentro dele, por razões de segurança mesmo :D
*/

//Vamos agora, criar uma nova instancia do postgre
const pool = new Pool({
    host: process.env.PG_Host,
    port: process.env.PG_Port,
    user: process.env.PG_User,
    password: process.env.PG_Pass,
    database: process.env.PG_Database,
    max: 10,                            //10 conexões simultaneas é o máximo que nós definimos aqui
    connectionTimeoutMillis: 10000,     //10s de connectionTimeout
    allowExitOnIdle: true,              //Permite que o node.js se encerre mesmo enquanto existem conexões abertas (mesmo que inativas, se nn definirmos como true, o node não encerra basicamente)
    idleTimeoutMillis: 30000            //30s de idleTimeout
});

//Agora que já instanciamos, vamos fazer duas funções:

//A função que testa a conexão:
async function testConnection() {
    //Vamos definir cliente, que usaremos mais tarde em testes de conexão
    let client;

    /*
        Abaixo, temos uma estrutura try-catch, no try, vamos nos conectar a database
        e fazer um log indicando q está tudo certo
        Porém, se algum erro, durante quaisquer parte do try, ocorrer, o catch captura
        esse erro e faz o tratamento correto
        Se tudo der certo, rodamos client.release(), que meio que libera a conexão mas nn encerra
    */
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

//Agora, nossa segunda função, a createTables()
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
            CREATE TABLE IF NOT EXISTS viajantes (
                TravelerID SERIAL UNIQUE PRIMARY KEY,
                Traveler varchar(255) NOT NULL UNIQUE,
                TravelerSecret varchar(255) NOT NULL,
                TravelerReputation INT NOT NULL DEFAULT 50,
                TravelerStatus INT NOT NULL DEFAULT 1,
                Travels INT[]
        )`).then('Tabela viajantes criada com sucesso (ou já existe)');
        
        /* EventEra é INT:
            0: Todas > utilizada apenas em buscas, não deve ser inserida na DB,
            1: Primitiva,
            2: Média,
            3: Moderna,
            4: Pós humana
        */
        await pool.query(`
            CREATE TABLE IF NOT EXISTS eventos (
                EventID SERIAL UNIQUE PRIMARY KEY,
                EventName varchar(255) NOT NULL,
                EventDate DATE NOT NULL UNIQUE,
                EventDescription varchar(255),
                EventEra INT NOT NULL
        )`).then(console.log('Tabela eventos criada com sucesso (ou já existe)'));
        
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
            CREATE TABLE IF NOT EXISTS interferencias (
                InterferenceID SERIAL UNIQUE PRIMARY KEY,
                InterferenceType INT NOT NULL DEFAULT 2,
                InterferenceStatus INT NOT NULL DEFAULT 0,
                TravelerID INT NOT NULL
        )`).then(console.log('Tabela interferencias criada com sucesso (ou já existe)'));
        
        /* 
            Abaixo, definimos alguns campos, o TravelerID é quem foi, e o EventID e para quando ele foi.
            Temos tbm o TravelStatus:
                1: Sucesso,
                2: Falha
        */
        await pool.query(`
            CREATE TABLE IF NOT EXISTS viagens (
                TravelID SERIAL UNIQUE PRIMARY KEY,
                TravelerID INT NOT NULL,
                EventID INT NOT NULL,
                TravelStatus INT NOT NULL DEFAULT 1
            )`).then(console.log('Tabela viagens criada com sucesso (ou já existe)'));
    } catch (err) {
        console.log(`
            Falha na criação da tabela:
            código do erro: ${err.code}
            erro: ${err}
        `);
    }
}

//Chamada de função, para garantir q ela seja executada
testConnection().then(createTables())

//Agora vamos exportar o módulo
module.exports= pool
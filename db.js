//Vamos começar importando o pg, ele que vai permitir a comunicação com uma database postgreSQL
require('dotenv').config();
const Pool = require('pg');

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
    max: 10, //10 conexões simultaneas é o máximo que nós definimos aqui
    connectionTimeoutMillis: 10000, //10s de connectionTimeout
    allowExitOnIdle: true, //Permite que o node.js se encerre mesmo enquanto existem conexões abertas (mesmo que inativas, se nn definirmos como true, o node não encerra basicamente)
    idleTimeoutMillis: 30000 //30s de idleTimeout
});

//Agora que já instanciamos, vamos fazer duas funções:

//A função que testa a conexão:
async function testConnection() {
    let client;
    try {
        client = pool.connect();
        console.log('Conectado com sucesso!!');
    } catch (err) {
        console.log(`
            Falha na conexão:
            código do erro: ${err.code}
            erro: ${err}`);
    } finally {
        client.release();
    }
};

testConnection()
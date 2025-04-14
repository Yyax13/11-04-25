//Iniciamos o desafio com o setup básico
//Primeiro, vamos importar os módulos que serão usados
require('dotenv').config;
const express = require('express');
const bcrypt = require('bcrypt');
const chance = require('chance').Chance();
const uuidv4 = require('uuid').v4;

//Além dos módulos vindos do npm, vou importar o arquivo db.js, que vai nos ajudar a manipular o banco de dados.
const pool = require('../db');

//Agora vamos definir nosso app, usaremos express para facilitar as coisas
const app = express();
app.use(express.json()); 
app.use(express.static(path.join(__dirname, "public")));

//Definiremos que a porta em que o app vai rodar no .env
const PORT = process.env.PORT || 3001;
const sessions = {}; //Aqui, iremos armazenar cookies de sessão

//Vou iniciar criando a func createResult(), que vou usar para padronizar os responses nos endpoints
function createResult() {

    //Vou definir result, mais tarde veremos sua aplicação
    const result = {
        status: null,       //Status http
        success: null,      //Verificamos se a requisição foi um sucesso
        message: null,      //Mensagem para o front
        others: {}          //Quaisquer variaveis ou objetos serão inseridos aq
    };

    //Retornando result
    return result
};

/*
    Vamos começar a criar as funções de hash de senha, para ajudar aqueles que ainda não entendem
    sobre o assunto, deixei o arquivo `como usar hash.md` para ajuda-los
*/

//A primeira função que vamos fazer, é a hashPass, ela deve receber apenas a senha (unhash)
function hashPass(passwd) {

    //Primeiro, chamamos o createResult para padronizar a resposta
    const result = createResult();

    //Estrutura try-catch

    try {
        const salt = bcrypt.genSalt(process.env.Hash_Salt);
        const hash = bcrypt.hash(passwd, salt);

        //Optei por não utilizar result.status, afinal, os dados retornados dessa request nn vão para o client-side
        result.success = true;
        result.message = 'Sucessfuly hash passwd';
        result.others = { hash: hash };
        console.log(result.message);

    } catch (err) {
        result.success = false;
        result.message = `
            Falha na criação da tabela:
            código do erro: ${err.code}
            erro: ${err}
        `;
        result.others = { error: err }

        //console.log para facilitar o debug
        console.log(result.message);

    } finally {
        //Agora retornamos o resultado
        return result
    }
};

//A segunda função, será o checkHash(), que recebe senha crua (user input), e retorna true ou false
function checkHash(passwd, hash) {
    
}

//Vamos iniciar nosso web-app e criar um log que indica a porta em que ele está rodando
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta: ${PORT}`);
});
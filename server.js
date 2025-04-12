//Iniciamos o desafio com o setup básico
//Primeiro, vamos importar os módulos que serão usados
require('dotenv').config;
const express = require('express');
const bcrypt = require('bcrypt');
const chance = require('chance').Chance();
const uuidv4 = require('uuid').v4;

//Além dos módulos vindos do npm, vou importar o arquivo db.js, que vai nos ajudar a manipular o banco de dados.
const pool = require('./db');

//Agora vamos definir nosso app, usaremos express para facilitar as coisas
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

//Definiremos que a porta em que o app vai rodar no .env
const PORT = process.env.PORT || 3001;
const sessions = {}; //Aqui, iremos armazenar cookies de sessão

//Vou iniciar criando a func createResult(), que vou usar para padronizar os responses nos endpoints
function createResult() {
    return {
        status: null,
        success: null,
        message: null,
        others: {}
    };
};


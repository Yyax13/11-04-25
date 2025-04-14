require('dotenv').config;
const express = require('express');
const bcrypt = require('bcrypt');
const chance = require('chance').Chance();
const uuidv4 = require('uuid').v4;

const pool = require('./db');

const app = express();
app.use(express.json()); 
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3001;
const sessions = {};

function createResult() {
    const result = {
        status: null,
        success: null,
        message: null,
        others: {}
    };
    return result;
};

function hashPass(passwd) {
    const result = createResult();
    try {
        const salt = bcrypt.genSalt(process.env.Hash_Salt);
        const hash = bcrypt.hash(passwd, salt);
        result.success = true;
        result.message = 'Sucessfuly hash passwd';
        result.others = { hash: hash };
        console.log(result.message);
    } catch (err) {
        result.success = false;
        result.message = `\n            Falha na criação da tabela:\n            código do erro: ${err.code}\n            erro: ${err}\n        `;
        result.others = { error: err };
        console.log(result.message);
    } finally {
        return result;
    }
};

function checkHash(passwd, hash) {
    const result = createResult();
    try {
        //Amanhã faço
    } catch (err) {
        //Idem
    }
}

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta: ${PORT}`);
});
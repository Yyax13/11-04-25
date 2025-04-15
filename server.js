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

function genResult() {
    const result = {
        status: null,
        success: null,
        message: null,
        others: {}
    };
    return result;
};

function hashPass(passwd) {
    const result = genResult();

    try {
        const salt = bcrypt.genSalt(process.env.Hash_Salt);
        const hash = bcrypt.hash(passwd, salt);

        result.success = true;
        result.message = 'Successfuly hash passwd';
        result.others = { hash: hash };

        console.log(result.message);

    } catch (err) {
        result.success = false;
        result.message = `
        Password hash failed:
        error code: ${err.code}
        error: ${err}\n        `;
        result.others = { error: err };

        console.log(result.message);

    } finally {
        return result;

    }
};

function checkHash(passwd, hash) {
    const result = genResult();

    try {
        const match = bcrypt.compare(passwd, hash);

        result.success = match;
        result.message = 'Is pass valid: ' + match;
        result.others = {
            match: match
        };

    } catch (err) {
        result.success = false;
        result.message = `
        Check hash failed:
        error code: ${err.code}
        error: ${err}\n        `;
        result.others = { error: err };

        console.log(result.message);

    } finally {
        return result

    }
};

async function signUp(Traveler, TravelerSecret) {
    const result = genResult();
    
    const hashTravelerSecret = hashPass(TravelerSecret);
    
    try {
        const {rows: insertInDB} = await pool.query(`
            INSERT INTO travelers (Traveler, TravelerSecret) VALUES ($1, $2) RETURNING TravelerID, Traveler
        `, [Traveler, hashTravelerSecret]);
        
        result.status = 201;
        result.success = true;
        result.message = `
        Successfuly signUp:
        TravelerID: ${insertInDB[0].TravelerID},
        Traveler: ${insertInDB[0].Traveler}`
        result.others = {
            Traveler: insertInDB[0].Traveler,
            TravelerID: insertInDB[0].TravelerID
        };

    } catch (err) {
        result.status = 500;
        result.success = false;
        result.message = `
        Internal server error on signUp function:
        error code: ${err.code},
        error: ${err}`;
        result.others = {error: err};

        console.error(result.message);

    } finally {
        return result

    }
}

async function signIn(Traveler, TravelerSecret) {
    const result = genResult();

    try {
        const {rows: secretFromDB} = await pool.query(`
            SELECT Traveler, TravelerSecret FROM travelers WHERE Traveler = ($1)
        `, [Traveler]);

        if (secretFromDB.length === 0) {
            throw new Error('TravelerNotFound', {reason: 'Traveler: ' + Traveler + ', send by the user on the client-side, do not exists in database', errorStatus: 400});
        } 

        //Amanhã termino, falta fazer o match
    } catch (err) {
        if (err.message == 'TravelerNotFound') {
            result.status = 400;
            result.success = false;
            result.message = `Traveler ${Traveler} do not exists in database, check if the user signed up`;
            result.others = {
                error: err
            };

            console.error(message)

        } else {
            result.status = 500;
            result.success = false;
            result.message = `
            Internal server error:
            error code: ${err.code},
            error: ${err}`;
            result.others = {
                error: err
            };

            console.error(message);
        }

    } finally {
        return result

    }
}

app.listen(PORT, () => {
    console.log(`App listening on port: ${PORT}`);
});
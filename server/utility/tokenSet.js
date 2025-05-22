const db = require('../config/database');

// in memory store
// const Tokens = new Set();

// insert the token in db
async function setToken(rToken) {
    try {

        await db.query(`INSERT INTO jwt(token) VALUES (?)`, [rToken]);

    } catch (error) {
        console.error("Token Insertion error: ", error);
    }
}

// see if the tooken exist in db
async function hasToken(rToken) {
    try {

        const [result] = await db.query(`SELECT 1 FROM jwt WHERE token = ?`, [rToken]);
        return result.length > 0;

    } catch (error) {
        console.error("Token finding error: ", error);
    }
}

// delete token
async function delToken(rToken) {
    try {

        await db.query(`DELETE FROM jwt WHERE token = ?`, [rToken]);

    } catch (error) {
        console.error("Token deletation error: ", error);
    }
}


module.exports =
{
    // Tokens,
    setToken,
    hasToken,
    delToken
};

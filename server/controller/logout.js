// const db = require('../config/database');
const { delToken } = require('../utility/tokenSet');

// Logout function: it clears cookies
async function logout(req, res) {
    try {

        const rtoken = req.cookies.refreshToken;
        // console.log(rtoken);

        // Remove the token from memory
        // Tokens.delete(rtoken);
        await delToken(rtoken);

        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');

        res.sendStatus(200);

    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = logout;


/* require('dotenv').config();
const Tokens = require('../utility/tokenSet');

// Logout Route
async function logout(req, res) {
    try {
        const token = req.cookies.accessToken;
        Tokens.delete(token); // Remove the token

        res.clearCookie('accessToken', {
            httpOnly: true,
            sameSite: process.env.NODE_ENV === 'production' ? 'Strict' : 'None',
            secure: true,
        
            // don't use maxAge in clearCookie
        });

        // res.sendStatus(204);
        res.sendStatus(200);

    } catch (error) {
        // console.error('Logout error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = logout; */
require('dotenv').config();
const generateAccessToken = require('../utility/generateAccessToken');
const Tokens = require('../utility/tokenSet');
const tokenExpire = require('../utility/tokenExpire');

// Login function
async function login(req, res) {
    try {

        const { username } = req.body;

        const user = { username };
        const accessToken = await generateAccessToken(user);

        Tokens.add(accessToken);

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            sameSite: process.env.NODE_ENV === 'production' ? 'Strict' : 'None',
            secure: true,
            maxAge: (tokenExpire * 60) * 1000,  //  tokenExpire min
        });

        // res.json({ accessToken });
        // res.json("OK");
        res.sendStatus(200);

    } catch (error) {
        // console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = login;
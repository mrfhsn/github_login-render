const jwt = require('jsonwebtoken');
require('dotenv').config();

const Tokens = require('../utility/tokenSet');
const tokenExpire = require('../utility/tokenExpire');
const generateAccessToken = require('../utility/generateAccessToken');

// const SECRET_KEY = process.env.SECRET_KEY;
const SECRET_KEY = process.env.JWT_SECRET;

// Authentication Middleware
function authenticateToken(req, res, next) {
    try {

        const token = req.cookies.accessToken; // Get from cookie

        if (!token) {
            return res.status(401).json({ error: 'No access token provided' });
            // return res.status(401);
        }

        if (!Tokens.has(token)) {
            return res.status(403).json({ error: 'Invalid token' });
            // return res.status(403);
        }

        jwt.verify(token, SECRET_KEY, async (err, user) => {

            const decoded = jwt.decode(token);
            const expiresIn = decoded.exp * 1000 - Date.now();
    
            if (expiresIn < (tokenExpire / 2) * 60 * 1000) { // Less than half of tokenExpire

                console.log('authToken User: ' + user);
                // const newToken = await generateAccessToken({ username: user.username });
                const newToken = await generateAccessToken(user);
    
                Tokens.add(newToken);
                Tokens.delete(token); // Revoke old token
    
                res.cookie('accessToken', newToken, {
                    httpOnly: true,
                    sameSite: process.env.NODE_ENV == 'production' ? 'Strict' : 'None',
                    secure: true,
                    maxAge: (tokenExpire * 60) * 1000,  //  tokenExpire min
                });
            }

            if (err) {
                Tokens.delete(token);   // if the token is expired, but is in memory
                return res.status(403).json({ error: 'Token verification failed' });
            }

            req.user = user;        // ??
            next(); 
        });

    } catch (error) {
        // console.error('Authentication error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


module.exports = authenticateToken;
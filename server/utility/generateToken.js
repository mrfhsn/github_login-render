const jwt = require('jsonwebtoken');
require('dotenv').config();
const tokenExpire = require('./tokenExpire');

const ACCESS_SECRET_KEY = process.env.ACCESS_SECRET_KEY;
const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY;

// Access Token generation with proper expiry
async function generateAccessToken(user) {
    try {
        // return jwt.sign(user, SECRET_KEY, { expiresIn: '1m' });
        return jwt.sign(user, ACCESS_SECRET_KEY, { expiresIn: `${tokenExpire}m` });

    } catch (error) {
        console.error('Access token generation failed:', error);
        throw new Error('Token generation failed');
    }
}

// Refresh Token generation with proper expiry
async function generateRefreshToken(user) {
    try {
        // return jwt.sign(user, SECRET_KEY, { expiresIn: '1h' });
        return jwt.sign(user, REFRESH_SECRET_KEY, { expiresIn: `${tokenExpire}h` });

    } catch (error) {
        console.error('Refresh token generation failed:', error);
        throw new Error('Token generation failed');
    }
}

module.exports = { generateAccessToken, generateRefreshToken };
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { hasToken, delToken } = require('../utility/tokenSet');
const tokenExpire = require('../utility/tokenExpire');
const { generateAccessToken } = require('../utility/generateToken');

const ACCESS_SECRET_KEY = process.env.ACCESS_SECRET_KEY;
const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY;

// Authentication Middleware
async function authAccessToken(req, res, next) {

    try {

        // Get from cookie
        const accessToken = req.cookies.accessToken;
        const refreshToken = req.cookies.refreshToken;

        if (!accessToken || !refreshToken) {
            return res.status(401).json({ error: 'No token provided' });
        }


        // If access token is expired, check refresh token
        const decodedAccessToken = jwt.decode(accessToken);
        if (decodedAccessToken && (decodedAccessToken.exp * 1000) < Date.now()) {

            // check rtoken in db
            // if (!Tokens.has(refreshToken)) {
            const hasRefreshToken = await hasToken(refreshToken);
            if (!hasRefreshToken) {
                return res.status(403).json({ error: 'Invalid Refresh Token' });
            }

            // If refresh token is expired
            const decodedRefreshToken = jwt.decode(refreshToken);
            if (decodedRefreshToken && (decodedRefreshToken.exp * 1000) < Date.now()) {
                // delete it, even if it is not db
                await delToken(refreshToken);
                return res.status(403).json({ error: 'Refresh Token expired, Log in again' });
            }


            try {
                // Verifying the refresh token
                const user = jwt.verify(refreshToken, REFRESH_SECRET_KEY);
                const user_info = user.user_info;
                // console.log(user);
                const newAccessToken = await generateAccessToken({ user_info });

                // Send new access token in cookies
                res.cookie('accessToken', newAccessToken, {
                    httpOnly: true,
                    sameSite: process.env.NODE_ENV === 'production' ? 'Strict' : 'None',
                    secure: true,
                    maxAge: ((tokenExpire + 1) * 60) * 60 * 1000,  // tokenExpire+1 hour for cookie expire
                    partitioned: true,
                });

                req.user = user;
                next();

            } catch (error) {
                await delToken(refreshToken);
                console.error(error);
                return res.status(403).json({ error: 'Refresh Token verification failed' });
            }
        }

        else {
            try {
                // If access token is not expired
                const user = jwt.verify(accessToken, ACCESS_SECRET_KEY);

                req.user = user;
                next()

            } catch (error) {
                console.error(error);
                return res.status(403).json({ error: 'Access Token verification failed' });
            }
        }

    } catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = authAccessToken;


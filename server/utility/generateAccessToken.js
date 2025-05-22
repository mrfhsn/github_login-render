const jwt = require('jsonwebtoken');
require('dotenv').config();

const tokenExpire = require('../utility/tokenExpire');

// const SECRET_KEY = process.env.SECRET_KEY;
const SECRET_KEY = process.env.JWT_SECRET;

// Token generation with proper expiry
async function generateAccessToken(user) {
    try {
        // return jwt.sign(user, SECRET_KEY, { expiresIn: '1m' });
        return jwt.sign(user, SECRET_KEY, { expiresIn: `${tokenExpire}m` });

/*         const token = jwt.sign(
            // user,
            {
                // id: user.id,
                // github_id: user.github_id,
                user_id: user.user_id,
                username: user.username
            },
            SECRET_KEY,
            // { expiresIn: '24h' }
            { expiresIn: `${tokenExpire}m` }
        );
        return token; */

    } catch (error) {
        console.error('Access token generation failed:', error);
        throw new Error('Token generation failed');
    }
}

module.exports = generateAccessToken;
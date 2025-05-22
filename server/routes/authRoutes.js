const router = require('express').Router();
const passport = require('passport');
// const jwt = require('jsonwebtoken');
// const authenticateToken = require('../middleware/authenticateToken');
const authAccessToken = require('../middleware/authAccessToken');
const db = require('../config/database');
require('dotenv').config();

// const generateAccessToken = require('../utility/generateAccessToken');
const { generateAccessToken, generateRefreshToken } = require('../utility/generateToken');
// const Tokens = require('../utility/tokenSet');
const { setToken } = require('../utility/tokenSet');
const tokenExpire = require('../utility/tokenExpire');

const frontendUrl = process.env.FRONTEND_URL;
// console.log(frontendUrl);

router.get('/github',
    passport.authenticate('github', {
        scope: [
            'repo',              // Full access to private/public repos (includes create, delete, read, write)
            'read:user',         // Read access to user profile info
            'user:email'         // Read access to user email
        ]
    })
);

router.get('/github/callback',
    // passport.authenticate('github', { failureRedirect: 'http://localhost:5173/login' }),
    passport.authenticate('github', { failureRedirect: `${frontendUrl}/login` }), async (req, res) => {

        try {

            // const user = { username };
            const user = req.user;
            // console.log(user);
            const user_info = { user_id: user.user_id, role: user.role };
            // console.log(user_info);

            const accessToken = await generateAccessToken({ user_info });
            const refreshToken = await generateRefreshToken({ user_info });

            // Tokens.add(accessToken);
            await setToken(refreshToken);

            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                sameSite: process.env.NODE_ENV == 'production' ? 'Strict' : 'None',
                secure: true,
                maxAge: ((tokenExpire + 1) * 60) * 60 * 1000,  // ${tokenExpire}+1  in hour for cookie expire
                partitioned: true
            });

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                sameSite: process.env.NODE_ENV === 'production' ? 'Strict' : 'None',
                secure: true,
                maxAge: ((tokenExpire + 1) * 60) * 60 * 1000,  // ${tokenExpire}+1  in hour for cookie expire
                partitioned: true
            });

            // res.json({ accessToken });
            // res.sendStatus(200);
            res.redirect(`${frontendUrl}/profile`);

        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }

    }
);


// router.get('/user', authenticateToken, async (req, res) => {
router.get('/user', authAccessToken, async (req, res) => {
    // console.log(req.user.id);

    try {

        const { user_id, role } = req.user.user_info;
        // const [user] = await db.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
        const [user] = await db.query('SELECT * FROM user WHERE user_id = ?', [user_id]);
        // const user = await db.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
        // console.log(user);
        if (user.length > 0) {
            // Don't send sensitive information to client
            // console.log(user[0]);

            // delete user.github_access_token;
            delete user[0].gh_token;
            res.json({ user: user[0] });

            // res.json({ user: user });

        } else {
            res.status(404).json({ message: 'User not found' });
        }

    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }

});

module.exports = router;

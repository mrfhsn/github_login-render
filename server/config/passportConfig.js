const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const db = require('./database');
require('dotenv').config();


// const cbURL = process.env.SERVER_URL + process.env.GITHUB_CALLBACK_URL;

// Passport configuration
passport.use(new GitHubStrategy({

    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.SERVER_URL + process.env.GITHUB_CALLBACK_URL

},
    async function (accessToken, refreshToken, profile, done) {
        try {
            // Check if user exists
            let [user] = await db.query('SELECT * FROM user WHERE user_id = ?', [profile.id]);
            // console.log(profile);

            // if user is not found (new user)
            if (!user.length) {

                const newUser = {
                    user_id: profile.id,
                    username: profile.username,
                    name: profile.displayName,
                    email: profile._json.email,
                    avatar_url: profile._json.avatar_url,
                    gh_token: accessToken // Store GitHub's access token
                };

                // console.log(newUser);

                await db.query(
                    'INSERT INTO user (user_id, gh_username, email, avatar_url, gh_token) VALUES (?, ?, ?, ?, ?)',
                    [newUser.user_id, newUser.username, newUser.email, newUser.avatar_url, newUser.gh_token]
                );

                // [user] = await db.query('SELECT * FROM user WHERE user_id = ?', [profile.id]);
                [user] = await db.query('SELECT user_id, role FROM user WHERE user_id = ?', [profile.id]);

            }
            else {
                // Update existing user's GitHub access token
                await db.query(
                    'UPDATE user SET gh_token = ? WHERE user_id = ?',
                    [accessToken, profile.id]
                );
            }

            return done(null, user[0]);

        } catch (err) {
            // console.error(err);
            return done(err, null);
            // return done(null, err);
        }
    }
));



/* passport.use(new GitHubStrategy({

    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.SERVER_URL + process.env.GITHUB_CALLBACK_URL
    
},
    function (accessToken, profile, done) {

        db.query('SELECT * FROM user WHERE user_id = ?', [profile.id])
            .then(([user]) => {

                if (!user.length) {
                    const newUser = {
                        user_id: profile.id,
                        username: profile.username,
                        name: profile.displayName,
                        email: profile._json.email,
                        avatar_url: profile._json.avatar_url,
                        gh_token: accessToken
                    };

                    return db.query(
                        'INSERT INTO user (user_id, gh_username, email, avatar_url, gh_token) VALUES (?, ?, ?, ?, ?)',
                        [newUser.user_id, newUser.username, newUser.email, newUser.avatar_url, newUser.gh_token]
                    );
                }
                else {
                    return db.query(
                        'UPDATE user SET gh_token = ? WHERE user_id = ?',
                        [accessToken, profile.id]
                    );
                }
            })
            .then(() => {
                return db.query('SELECT user_id, role FROM user WHERE user_id = ?', [profile.id]);
            })
            .then(([user]) => {
                done(null, user[0]);
            })
            .catch(err => {
                done(err, null);
            });
    }
)); */


// Add these passport serialize/deserialize functions
passport.serializeUser((user, done) => {
    // done(null, user.id);
    done(null, user.user_id);
});

// passport.deserializeUser(async (id, done) => {
passport.deserializeUser(async (user_id, done) => {
    try {

        const [user] = await db.query('SELECT * FROM user WHERE user_id = ?', [user_id]);
        // console.log(user);

        if (user.length > 0) {
            done(null, user[0]);  // Only call done if user is found
        }
        else {
            done(new Error('User not found'), null);  // Handle the case where the user is not found
        }

    } catch (err) {
        done(err, null);
    }
});


module.exports = passport;
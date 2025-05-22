// this was the raw code
// don't remove this



// In production, use Redis or a database instead
// const refreshTokens = new Set();
// const Tokens = new Set();
// const tokenExpire = 2;  // in min

// // Token generation with proper expiry
// const generateAccessToken = (user) => {
//     try {
//         // return jwt.sign(user, SECRET_KEY, { expiresIn: '1m' });
//         return jwt.sign(user, SECRET_KEY, { expiresIn: `${tokenExpire}m` });
//     } catch (error) {
//         console.error('Access token generation failed:', error);
//         throw new Error('Token generation failed');
//     }
// };


// Login Route
// app.post('/login', async (req, res) => {
//     try {
//         const { username } = req.body;

//         if (!username || typeof username !== 'string') {
//             return res.status(400).json({ error: 'Invalid username' });
//         }

//         const user = { username };
//         const accessToken = generateAccessToken(user);

//         Tokens.add(accessToken);

//         res.cookie('accessToken', accessToken, {
//             httpOnly: true,
//             sameSite: process.env.NODE_ENV === 'production' ? 'Strict' : 'None',
//             secure: true,
//             maxAge: (tokenExpire * 60) * 1000,  //  tokenExpire min
//         });

//         // res.json({ accessToken });
//         // res.json("OK");
//         res.sendStatus(200);

//     } catch (error) {
//         console.error('Login error:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// Protected Route
// app.get('/protected', authenticateToken, (req, res) => {
//     try {
//         res.json({ message: 'Protected data accessed', user: req.user });
//     } catch (error) {
//         console.error('Protected route error:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });


// // Logout Route
// app.post('/logout', (req, res) => {
//     try {
//         const token = req.cookies.accessToken;
//         Tokens.delete(token); // Remove the token

//         res.clearCookie('accessToken', {
//             httpOnly: true,
//             sameSite: process.env.NODE_ENV === 'production' ? 'Strict' : 'None',
//             secure: true,
        
//             // don't use maxAge in clearCookie
//         });

//         res.sendStatus(204);

//     } catch (error) {
//         console.error('Logout error:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });


// // Authentication Middleware
// function authenticateToken(req, res, next) {
//     try {

//         const token = req.cookies.accessToken; // Get from cookie

//         if (!token) {
//             return res.status(401).json({ error: 'No token provided' });
//         }

//         if (!Tokens.has(token)) {
//             return res.status(403).json({ error: 'Invalid token' });
//         }

//         jwt.verify(token, SECRET_KEY, (err, user) => {

//             const decoded = jwt.decode(token);
//             const expiresIn = decoded.exp * 1000 - Date.now();
    
//             if (expiresIn < (tokenExpire / 2) * 60 * 1000) { // Less than 1 min
//                 const newToken = generateAccessToken({ username: user.username });
    
//                 Tokens.add(newToken);
//                 Tokens.delete(token); // Revoke old token
    
//                 res.cookie('accessToken', newToken, {
//                     httpOnly: true,
//                     sameSite: process.env.NODE_ENV === 'production' ? 'Strict' : 'None',
//                     secure: true,
//                     maxAge: (tokenExpire * 60) * 1000,  //  tokenExpire min
//                 });
//             }

//             if (err) {
//                 Tokens.delete(token);   // if the token is expired, but is in memory
//                 return res.status(403).json({ error: 'Token verification failed' });
//             }

//             req.user = user;
//             next(); 
//         });

//     } catch (error) {
//         console.error('Authentication error:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// }
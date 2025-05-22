const express = require('express');
const session = require('express-session');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
require('dotenv').config();

const passport = require('./config/passportConfig');
const apiRoutes = require('./routes/apiRoutes');

const app = express();

// const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'];
const ALLOWED_ORIGIN = process.env.FRONTEND_URL;

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());

// app.use(cors({
//     origin: 'http://localhost:5173',
//     credentials: true
// }));
app.use(cors({
    origin: function (origin, callback) {
        // if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        if (!origin || origin == ALLOWED_ORIGIN) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));


app.use(express.json());
const server = http.createServer(app);


// Add session middleware (needed for OAuth flow)
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 1000 // Short-lived session, just for OAuth flow
    }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session()); // Need this for OAuth flow


// ------------------------------------

// Routes
app.use('/api', apiRoutes);

// ------------------------------------

// if (process.env.NODE_ENV === 'production') {
// Serve static files from the React app (Vite build output)
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// For any other routes, send the React app (single-page app)
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
});
// }

// ------------------------------------


// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});


// if (process.env.VERCEL_ENV === undefined) {
server.listen(3000, () => {
    console.log('http://localhost:3000');
});
// }

// Export for Vercel serverless functions
// module.exports = app;
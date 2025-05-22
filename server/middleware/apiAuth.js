const jwt = require('jsonwebtoken');

const authAPIToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access token required' });
    }

    // console.log('token: ' + token);
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }

        // console.log('user: ' + user.id);
        req.user = user;
        next();
    });
};

module.exports = authAPIToken;
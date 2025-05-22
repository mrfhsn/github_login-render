require('dotenv').config();

// Protected Route
async function protected(req, res) {
    try {
        res.json({ message: 'Protected data accessed', user: req.user });
    } catch (error) {
        // console.error('Protected route error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = protected;

require('dotenv').config();
const axios = require('axios');
const db = require('../config/database');

// https://api.github.com/search/repositories?q=user:mrfhsn

async function getRepos(req, res) {
    const { id } = req.params;
    // console.log(id);

    try {
        const [user] = await db.query('SELECT gh_username, gh_token FROM user WHERE user_id = ?', [id]);
        // console.log(user[0]);

        const api = axios.create({
            headers: {
                'Authorization': `Bearer ${user[0].gh_token}`
            },
            withCredentials: true,
        });

        const repo = await api.get(`https://api.github.com/search/repositories?q=user:${user[0].gh_username}`);
        // console.log(repo);

        // res.sendStatus(200).json({ repo: repo });    // don't use this
        res.json({ repo: repo.data });
        // res.send(repo);

    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = getRepos;
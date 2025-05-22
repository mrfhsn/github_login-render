const router = require('express').Router();
const authRoutes = require('../routes/authRoutes');
const logout = require('../controller/logout');
const getRepos = require('../controller/getRepos');

const authAccessToken = require('../middleware/authAccessToken');


router.get('/', (req, res) => {
    res.status(200).json("ok");
})

router.use('/auth', authRoutes);

router.post('/logout', logout);

router.get('/repos/:id', authAccessToken, getRepos);


module.exports = router;

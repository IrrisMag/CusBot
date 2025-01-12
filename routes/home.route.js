const express = require('express');
const router = express.Router();



const { showHome, showBot } = require('../controllers/home.controller');

router.get('/', showHome);

router.get('/bot', showBot);



module.exports = router;
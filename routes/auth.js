const controller = require('../controller/auth');

const express = require('express');
const router = express.Router();

router.post('/login', controller.postLogin);
router.get('/register', controller.getRegister);
router.get('/login', controller.getLogin);

module.exports = router;

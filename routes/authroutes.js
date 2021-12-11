const express = require('express');
const router = express.Router();
const { renderLogin, renderRegister, createUser, login } = require('../controller/user')

router.route('/register')
    .post(createUser)
    .get(renderRegister);

router.route('/login')
    .post(login)
    .get(renderLogin);



module.exports = router;
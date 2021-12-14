const express = require('express');
const router = express.Router();
const { renderLogin, renderRegister, createUser, login, renderLogout } = require('../controller/user')

router.route('/register')
    .post(createUser)
    .get(renderRegister);

router.route('/login')
    .post(login)
    .get(renderLogin);

router.route('/logout')
    .get(renderLogout);


module.exports = router;

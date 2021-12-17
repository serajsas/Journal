const express = require('express');
const router = express.Router();
const { renderLogin, renderRegister, createUser, login, renderLogout, renderResetPassword,
    resetPassword, continueReset, renderUpdatePassword, updatePassword } = require('../controller/user')

router.route('/register')
    .post(createUser)
    .get(renderRegister);

router.route('/login')
    .post(login)
    .get(renderLogin);

router.route('/logout')
    .get(renderLogout);
router.route('/resetpassword')
    .get(renderResetPassword)
    .post(resetPassword);
router.route('/continuereset')
    .get(continueReset);
router.route('/updatepassword')
    .get(renderUpdatePassword)
    .post(updatePassword);

module.exports = router;

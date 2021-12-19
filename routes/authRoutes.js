const express = require('express');
const router = express.Router();
const { renderLogin, renderRegister, createUser, login, renderLogout, renderResetPassword,
    resetPassword, getResetPasswordPage, renderUpdatePassword, updatePassword, updatePasswordAfterReset } = require('../controller/user')

router.route('/register')
    .post(createUser)
    .get(renderRegister);

router.route('/login')
    .post(login)
    .get(renderLogin);

router.route('/logout')
    .get(renderLogout);

router.route('/updatepassword')
    .get(renderUpdatePassword)
    .post(updatePassword);


router.route('/resetpassword')
    .get(renderResetPassword)
    .post(resetPassword);
router.route('/resetpassword/:id')
    .get(getResetPasswordPage)
    .post(updatePasswordAfterReset);


// router.route('/updatepasswordafterreset')
//     .get(updatePassowrdAfterReset);
module.exports = router;

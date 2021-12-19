const User = require('../models/user');
const bcrypt = require('bcrypt')
const { sendCodeEmail, sendRegisterEmail } = require('../utils/emailSender')
const { generateRandomCode, decrypt } = require('../utils/crypto')
/**
 * 
 * @param {any} req 
 * @param {any} res 
 * 
 */
const createUser = async function (req, res, next) {
    const user = new User(req.body);
    if (!user.email || !user.password || !user.username)
        return res.render('./pages/register', { message: "Missing Credentials" });
    const foundUser = await User.findUser(user.username, user.email);
    if (foundUser)
        return res.render('./pages/register', { message: "User Already Exists, try new username or email!" });
    try {
        await user.save()
    } catch (err) {
        console.log(err);
    }
    sendRegisterEmail(user);
    return res.redirect('/login');
}

const login = async function (req, res) {
    if (req.session.loggedIn)
        return res.redirect('/blogs')
    const user = new User(req.body);
    if (!user.username || !user.password)
        return res.render('./pages/login', { message: "Missing Credentials" })

    // username fields can read username or email
    const email = user.username;
    const foundUser = await User.findUser(user.username, email);


    if (foundUser != null) {
        const match = await bcrypt.compare(user.password, foundUser.password);
        if (!match)
            return res.render('./pages/login', { message: "Check your username or password" })
    } else {
        return res.render('./pages/login', { message: "Check your username or password" })
    }

    if (!req.session.loggedIn) {
        req.session.loggedIn = foundUser._id;
        req.session.username = foundUser.username;
    }
    let journals = foundUser.blogs.map(journal => {
        return {
            _id: journal._id,
            title: decrypt(journal.title),
            body: decrypt(journal.body),
            date: journal.date
        }
    })

    return res.render("./pages/blogs", { name: foundUser.username, journals, message: false });
}

const renderLogin = async function (req, res) {
    if (req.session.loggedIn) {
        // find the user and redirect to the home page 
        const user = await User.findUserByID(req.session.loggedIn);
        if (user) {
            return res.redirect('/blogs')
        }
    }
    return res.render('./pages/login', { message: false });
}

const renderRegister = function (req, res) {
    return res.render('./pages/register', { message: false });
}

const renderLogout = function (req, res) {
    req.session.destroy(function (err) {
        if (!err) {
            return res.redirect('/')
        }
    })
}
const renderResetPassword = function (req, res) {
    return res.render('./pages/initialResetPassword', { message: false })
}

const resetPassword = async function (req, res) {
    const foundUser = await User.findUser(req.body.username, req.body.username);
    if (!foundUser)
        return res.render('./pages/initialResetPassword', { message: "User is not found, please try again with valid Username or Email" })
    const randomCode = generateRandomCode();
    sendCodeEmail(foundUser, randomCode);

    req.session.resetPasswordID = foundUser._id;
    req.session.code = randomCode;
    return res.redirect(`/resetpassword/${foundUser._id}`)
}

const getResetPasswordPage = async function (req, res) {
    if (!req.session.resetPasswordID)
        return res.render('./pages/initialResetPassword', { message: "Error occured while resetting your password, please try again" })

    return res.render('./pages/successfulPasswordReset', { message: "Please check your email for the code", id: req.params.id })
}

const updatePasswordAfterReset = async function (req, res) {
    if (!req.session.resetPasswordID || !req.params.id || !req.session.code) {
        return res.render('./pages/initialResetPassword', { message: "Error occured while resetting your password, please try again" })
    }
    if (req.body.newPassword != req.body.confirmNewPassword)
        return res.render('./pages/successfulPasswordReset', { message: "Passwords do not match", id: req.params.id })

    const user = await User.findUserByID(req.session.resetPasswordID);
    const match = req.session.code == req.body.code;

    if (!match)
        return res.render('./pages/initialResetPassword', { message: "Error occured while resetting your password, please try again" })

    user.password = req.body.newPassword;

    try {
        await user.save();
    } catch (err) {
        return res.render('./pages/initialResetPassword', { message: "Error occured while resetting your password, please try again" })
    }
    return res.redirect('/login')
}

const updatePassword = async function (req, res) {
    if (!req.session.loggedIn) {
        return res.render('./pages/login', { message: "Please login to update your password" })
    }
    if (req.body.newPassword != req.body.confirmNewPassword)
        return res.render('./pages/updatePassword', { message: "Passwords do not match" });

    const user = await User.findUserByID(req.session.loggedIn);
    const match = await bcrypt.compare(req.body.oldPassword, user.password);

    if (!match)
        return res.render('./pages/updatePassword', { message: "Please check your password" });

    user.password = req.body.newPassword;

    try {
        await user.save();
    } catch (err) {
        return res.render('./pages/updatePassword', { message: "Error saving the password, try again" });
    }
    let journals = user.blogs.map(journal => {
        return {
            _id: journal._id,
            title: decrypt(journal.title),
            body: decrypt(journal.body),
            date: journal.date
        }
    })
    res.render("./pages/blogs", { name: req.session.username, journals, message: "Password updated successfully" });
}

const renderUpdatePassword = function (req, res) {
    if (!req.session.loggedIn)
        return res.render('./pages/login', { message: "Please login to update your password" })
    return res.render('./pages/updatePassword', { message: false });
}

const renderClosePage = function (req, res) {
    return res.render('./pages/closePage');
}
module.exports = {
    createUser, renderLogin, renderRegister, login, renderLogout,
    renderResetPassword, resetPassword, getResetPasswordPage,
    renderUpdatePassword, updatePassword, renderClosePage, updatePasswordAfterReset
}
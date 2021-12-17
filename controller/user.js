const User = require('../models/user');
const bcrypt = require('bcrypt')

/**
 * 
 * @param {any} req 
 * @param {any} res 
 * 
 */
const createUser = async function (req, res, next) {
    const user = new User(req.body);
    if (!user.email || !user.password || !user.username)
        return res.render('./pages/register', { err: new Error("Missing Credentials") });
    const foundUser = await User.findUser(user.username, user.email);
    if (foundUser)
        return res.render('./pages/register', { err: new Error("User Already Exists, try new username or email!") });
    user.save()
        .then(() => {
            res.redirect('/login');
        })
        .catch((err) => {
            console.log(err);
        })
}

const login = async function (req, res) {
    if (req.session.loggedIn)
        return res.redirect('/home')
    const user = new User(req.body);
    if (!user.username || !user.password)
        return res.render('./pages/login', { err: new Error("Missing Credentials") })

    // username fields can read username or email
    const email = user.username;
    const foundUser = await User.findUser(user.username, email);


    if (foundUser != null) {
        const match = await bcrypt.compare(user.password, foundUser.password);
        if (!match)
            return res.render('./pages/login', { err: new Error("Check your username or password") })
    } else {
        return res.render('./pages/login', { err: new Error("Check your username or password") })
    }

    if (!req.session.loggedIn) {
        req.session.loggedIn = foundUser._id;
        req.session.username = foundUser.username;
    }
    return res.render("./pages/blogs", { name: foundUser.username, journals: foundUser.blogs });
}

const renderLogin = async function (req, res) {
    if (req.session.loggedIn) {
        // find the user and redirect to the home page 
        const user = await User.findUserByID(req.session.loggedIn);
        if (user) {
            return res.redirect('/blogs')
        }
    }
    return res.render('./pages/login', { err: false });
}

const renderRegister = function (req, res) {
    return res.render('./pages/register', { err: false });
}

const renderLogout = function (req, res) {
    req.session.destroy(function (err) {
        if (!err) {
            return res.redirect('/')
        }
    })
}
const renderResetPassword = function (req, res) {
    return res.render('./pages/resetPassword', { err: false })
}

const resetPassword = async function (req, res) {
    if (req.body.newPassword != req.body.confirmNewPassword)
        return res.render('./pages/continueResetPassword', { err: new Error("Passwords do not match") });
    const foundUser = await User.findUser(req.session.usernameToReset, req.session.usernameToReset);
    if (!foundUser)
        return res.render('./pages/continueResetPassword', { err: new Error("Check your password") });
    const match = await bcrypt.compare(req.body.oldPassword, foundUser.password);
    if (!match) {
        return res.render('./pages/continueResetPassword', { err: new Error("Check your credentials") });
    }
    foundUser.password = req.body.newPassword;
    try {
        await foundUser.save();
    } catch (err) {
        return res.render('./pages/continueResePassword',
            { err: new Error("Error occured while resetting your password, try again...") });
    }
    return res.redirect('/login');
}

const continueReset = async function (req, res) {
    const { username } = req.query;
    console.log(username)
    const foundUser = await User.findUser(username, username);
    if (!foundUser)
        return res.render('./pages/resetPassword', { err: new Error("Check your username or email") })
    req.session.usernameToReset = username;
    return res.render('./pages/continueResetPassword', { err: false });
}

const updatePassword = async function (req, res) {
    if (!req.session.loggedIn) {
        return res.render('./pages/login', { err: new Error("Please login to update your password") })
    }
    if (req.body.newPassword != req.body.confirmNewPassword)
        return res.render('./pages/updatePassword', { err: new Error("Passwords do not match") });
    const user = await User.findUserByID(req.session.loggedIn);
    user.password = req.body.newPassword;
    try {
        await user.save();
    } catch (err) {
        console.log(err)
        return res.render('./pages/updatePassword', { err: new Error("Error saving the password, try again") });
    }
    return res.redirect('/blogs')
}

const renderUpdatePassword = function (req, res) {
    if (!req.session.loggedIn)
        return res.render('./pages/login', { err: new Error("Please login to update your password") })
    return res.render('./pages/updatePassword', { err: false });
}
module.exports = {
    createUser, renderLogin, renderRegister, login, renderLogout,
    renderResetPassword, resetPassword, continueReset, renderUpdatePassword, updatePassword
}
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

const login = async function (req, res, next) {
    if (req.session.loggedIn)
        return res.redirect('/home')
    const user = new User(req.body);
    if (!user.username || !user.password)
        return res.render('./pages/login', { err: new Error("Missing Credentials") })

    const foundUser = await User.findUser(user.username, user.email);

    if (foundUser != null) {
        const match = await bcrypt.compare(user.password, foundUser.password);
        if (!match)
            return res.render('./pages/login', { err: new Error("Check your username or password") })
    }else{
        return res.render('./pages/login', { err: new Error("Check your username or password") })
    }

    if (!req.session.loggedIn){
        req.session.loggedIn = foundUser._id;
        req.session.username = foundUser.username;
    }
    return res.redirect('/blogs')
}

const renderLogin = function (req, res) {
    if (req.session.loggedIn) {
        // find the user and redirect to the home page 
        const user = User.findUserByID(req.session.loggedIn);
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
module.exports = { createUser, renderLogin, renderRegister, login, renderLogout }
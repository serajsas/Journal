const User = require('../models/user');
/**
 * 
 * @param {any} req 
 * @param {any} res 
 * 
 */
const createUser = async function (req, res, next) {
    const user = new User(req.body);
    console.log(user._id);
    let foundUser = await User.findUser(user.username, user.email);
    if (!user.email || !user.password || !user.username ||
        foundUser != null)
        return res.render('./pages/register', false);

    user.save()
        .then(() => {
            res.redirect('/home');
        })
        .catch((err) => {
            console.log(err);
        })

}
const login = async function (req, res, next) {
    const user = new User(req.body);
    // this should be verify user 
    let foundUser = await User.findUser(user.username, user.email);
    // console.log("in controller/user/login method " + foundUser._id);
    // foundUser.isVerified should be true but for testing now i will keep it false
    if (foundUser != null && foundUser.isVerified === false && foundUser != null) {
        req.session.id = user._id;
        req.session.isVerified = user._id;
        // I want to check if the user password is wrong or if the user is not found in the database
    } else if(foundUser != null ) {
        return res.redirect('login');
    }
    res.redirect('/home');
}
const renderLogin = function (req, res) {
    return res.render('./pages/login', { isVerified: req.session.isVerified });
}

const renderRegister = function (req, res) {
    return res.render('./pages/register');
}
module.exports = { createUser, renderLogin, renderRegister, login }
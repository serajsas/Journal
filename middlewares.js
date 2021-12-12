const User = require('./models/user');

const isLoggedIn = function (req, res, next) {
    if (req.session.loggedIn) {
        // find the user and redirect to the home page 
        const user = User.findUserByID(req.session.loggedIn);
        if (user) {
            return next();
        }
    }
    res.render('./pages/login', { err: false })
}

module.exports = { isLoggedIn }
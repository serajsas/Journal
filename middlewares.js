const User = require('./models/user');

const isLoggedIn = async function (req, res, next) {
    if (req.session.loggedIn) {
        // find the user and redirect to the home page 
        try {
            const user = await User.findUserByID(req.session.loggedIn);
            if (user) {
                return next();
            } else {
                return res.render('./pages/login', { err: false })
            }
        } catch (err) {
            console.log(err);
        }
    }
    res.render('./pages/login', { err: false })
}

module.exports = { isLoggedIn }
const User = require('./models/user');

const isLoggedIn = function(req,res,next){
    const user = User.findUser(req.body);
    console.log("in middleware/isLoggedIn: " + user)
    if(user != null && user.isVerified == true)
        return next();
    return res.redirect('/login');
}

module.exports = {isLoggedIn}
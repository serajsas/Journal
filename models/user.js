const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username cannot be blank']
    },
    password: {
        type: String,
        required: [true, 'Password cannot be blank']
    },
    email: {
        type: String,
        required: [true, 'email cannot be blank']
    },
    isVerified: {
        type: Boolean,
        default: false
    }
})


module.exports = mongoose.model('User', userSchema);

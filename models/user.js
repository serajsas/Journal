const mongoose = require('mongoose')
const crypto = require("crypto");
const bcrypt = require("bcrypt");
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
    },
    verificationCode: {
        type: String,
        default: String(-1)
    }
})

/**
 * 
 * @param {string} username 
 * @param {string} email 
 * @returns returns user if it exists otherwise returns null
 */
userSchema.statics.findUser = async function (username, email) {
    const user = await this.findOne({ $or: [{ username }, { email }] });
    return user == null ? null : user;
}

/**
 * Adds a verification code to the user and hashes the password before saving it
 */
userSchema.pre('save', async function (next) {
    if (this.isVerified === false) {
        this.verificationCode = crypto.randomBytes(4).toString('hex');
    }
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
})

/**
 * 
 * @param {string} email 
 * @returns a string which contains the user's code
 */
userSchema.statics.getUserCode = async function (email) {
    const foundUser = await this.findOne({ email });
    return foundUser.code;
}

module.exports = mongoose.model('User', userSchema);

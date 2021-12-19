const mongoose = require('mongoose')
const bcrypt = require("bcrypt");
const journal = require('./journal');
const { sendResetPasswordEmail } = require('../utils/emailSender')

const Schema = mongoose.Schema;
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
    blogs: [journal.schema]
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
 * 
 * @param {string} username 
 * @param {string} email 
 * @returns returns user if it exists otherwise returns null
 */
 userSchema.statics.updateUser = async function (username, email,password) {
    const user = await this.findOne({ $or: [{ username }, { email }] });
    user.password = password;
    try{
        await user.save();
        return true;
    }catch(err){
        return false;
    }
}

userSchema.statics.findUserByID = async function (id) {
    const user = await this.findById(id);
    return user == null ? null : user;
}



userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    sendResetPasswordEmail(this);
    next();
})


module.exports = mongoose.model('User', userSchema);
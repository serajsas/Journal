const crypto = require("crypto")
const CryptoJS = require("crypto-js");

if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const encrypt = (text)=>{
    return CryptoJS.AES.encrypt(text,process.env.SESSION_SECRET).toString();
}

const decrypt = (hash) =>{
    return CryptoJS.AES.decrypt(hash, process.env.SESSION_SECRET).toString(CryptoJS.enc.Utf8);
}
const generateRandomCode = ()=>{
    return crypto.randomBytes(4).toString('hex');
}

const encryptJournal = function (journal) {
    journal.title = encrypt(journal.title);
    journal.body = encrypt(journal.body);
}
const decryptJournal = function (journal) {
    journal.title = decrypt(journal.title);
    journal.body = decrypt(journal.body);
}

module.exports = {
    generateRandomCode,encryptJournal,decryptJournal,decrypt
};
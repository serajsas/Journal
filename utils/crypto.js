const crypto = require("crypto")
const CryptoJS = require("crypto-js");

if (process.env.NODE_ENV !== "production") {
    console.log("We are developing")
    require('dotenv').config();
}
const encrypt = (text)=>{
    // JSON.stringify({ text })
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

// const toDecrypt = "U2FsdGVkX19kXcmB2ZNfkL/YSnOBelaakEBDcil8D3zZKCCNoQpSq+IdrzJAVNLVGLKcaqmT6w3aubwQEXA5Smk142NtTKhwjSZ/tUD7h7LlPrV/2HmnXrhDEcaRMsoS76X5qotyuEIICZMfiOv07ybwJuEBSOFlY3F+Ogw9C8ABMt+k+4o4XxqmuxpRZBTd2tGAqvV5FVsEo89MSMaN1BTiFikx2cc0SPMZfOggB+Iuv52gNw9P95JY6XqwYupuhzjSIqdEm1kV5PuJ2Bj8qw==";

// console.log("Text decrypted " + decrypt(toDecrypt))

// const toEncrypt = "Hello world";

// const hash = encrypt(toEncrypt);
// console.log("hash " + hash)
// console.log("text decrypted " + decrypt(hash))

console.log("Environment secret is " + process.env.SESSION_SECRET)

module.exports = {
    generateRandomCode,encryptJournal,decryptJournal,decrypt
};
const crypto = require("crypto")


const generateRandomCode = ()=>{
    return crypto.randomBytes(4).toString('hex');
}
module.exports = {
    generateRandomCode
};
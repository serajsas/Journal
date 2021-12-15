const SimpleCrypto = require("simple-crypto-js").default

const secretKey = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3';
const simpleCrypto = new SimpleCrypto(secretKey)

const encrypt = (text) => {

    return simpleCrypto.encrypt(text);
};

const decrypt = (hash) => {

    return simpleCrypto.decrypt(hash)
};

module.exports = {
    encrypt,
    decrypt
};
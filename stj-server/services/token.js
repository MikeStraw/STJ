const jwt = require('jsonwebtoken');

const OPT_ALGORITHM = 'HS256';
const OPT_EXPIRES = '3h';
const OPT_ISSUER  = 'STJ-Server';

const signOptions = {
    algorithm:  OPT_ALGORITHM,
    expiresIn:  OPT_EXPIRES,
    issuer:     OPT_ISSUER
};
const verifyOptions = {
    algorithm:  OPT_ALGORITHM,
    expiresIn:  OPT_EXPIRES,
    issuer:     OPT_ISSUER
};

const SECRET = 'stj-server-blah-blah-blah';  // TODO:  should be env var and/or from command line.

module.exports = {
    sign: (payload) => {
        return jwt.sign(payload, SECRET, signOptions);
    },

    verify: (token) => {
        try{
            return jwt.verify(token, SECRET, verifyOptions);
        }catch (err){
            return false;
        }
    },

    decode: (token) => {
        return jwt.decode(token, {complete: true});   //returns null if token is invalid
    }
};
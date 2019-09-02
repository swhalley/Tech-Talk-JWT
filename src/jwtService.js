const jwt = require('jsonwebtoken');

//SMELL - This should never be hard coded in the code. Pull in via environment variable or use a certificate
const signingKey = 'wdQ:`1iGu)fbU%W:El1^J<mVv{Z&+x7';

module.exports.giveMeAToken = () => {
    const signOptions = {
        issuer:  'Binary Star',
        subject:  'sean.whalley@binarystar.ca',
        audience:  'http://localhost:3000',
        expiresIn:  '2m',
        algorithm:  'HS256'
    };

    const payload = {
        roles : ['user', 'admin']
    }

    const token = jwt.sign( 
        payload, 
        signingKey,
        signOptions);

    return token;
}

module.exports.checkToken = ( token ) => {
    //by default, expiration date is checked and you have to opt out of it.
    const verifyOptions = {};

    //in a synchronous fashion, verify will throw an error if not valid.
    return jwt.verify( 
        token,
        signingKey,
        verifyOptions );
}

module.exports.tellMeAboutTheToken = ( token ) => {
    //No token needed as header and payload are only base64 encoded.
    var decoded = jwt.decode(token, {complete: true});

    return {
        header : decoded.header,
        body: decoded.payload
    };
}

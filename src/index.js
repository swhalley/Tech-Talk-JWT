const express = require('express');
const jwtService = require('./jwtService');
const jsonwebtoken = require('jsonwebtoken');

const app = express();

const jwtMiddleware = (req, res, next) => {
    //Format of the header is 
    //Authorization: Bearer <token>
    const rawToken = req.headers['authorization'] || '';
    const bearerToken = rawToken.slice(7); 

    try {
        jwtService.checkToken( bearerToken );
        next();
    } catch( error ){
        if( error instanceof jsonwebtoken.TokenExpiredError) 
            console.log('the token you tried to use is expired');
        else if (error instanceof jsonwebtoken.JsonWebTokenError)
            console.log('Looks like someone tampered with the key as the signature doesn\'t match');

        console.log( error );
        res.sendStatus(401); //Unauthorized
    }
}

app.get('/login', (req, res)=> {
    res.send( jwtService.giveMeAToken() );
});

app.get( '/secure', jwtMiddleware, (req, res) =>{
    res.send('Hello From a secure page');
});

app.get( '/about', jwtMiddleware, (req, res) => {
    const rawToken = req.headers['authorization'] || '';
    const bearerToken = rawToken.slice(7);

    res.json( jwtService.tellMeAboutTheToken( bearerToken) );
});


const server = app.listen( process.env.NODE_APP_PORT || 3000, () => {
    console.log( `Server running on port ${server.address().port}` );
});
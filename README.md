# Introduction
* JWT stands for JSON Web Token.
* JWT is a Claim. Meaning you "claim" to be someone
* Recently put together a course for work, Realized I knew less about authentication/authorization than I thought I did.

# How JWT Differs from Cookie-Auth or OAuth
* JWT vs Cookie-Auth
   * Cookie-Auth is stateful on the server. Each session is also stored on the server. Same Origin Policy limits who can use the cookie
   * JWT is stateless. You `claim` to be someone and any server sharing a shared secret can authorize you.
   * In this way, JWT is better for API's. Cookie-Auth is better for client/server applications.
   * Authentication server can be on one box, and the token generated can be used to access various API's in your org. No need for stickey sessions on load balancers etc.

* JWT vs OAuth
   * JWT is about how the key or token is signed
   * OAuth is about sharing authentication over multiple sites.
   * OAuth, in some cases uses JWT for their tokens.

# Deconstructing a JSON Web Token
* http://jwt.io
* dot (.) separator.
* `<header>.<body>.<signature>`
* All pieces are Base64 Encoded

### Header
```
{
   "alg": "HS256",
   "typ": "JWT"
}
```
   * HS256 = HMAC + SHA256
   * HS256 is the easiest of the algorithms to start with
   * There are many more options, including using certificate chains to validate. 

### Body
```
{
  "sub": "user-123",
  "name": "John Doe",
  "iat": 1516239022
  "exp": 1516239722
}
```

* iss (issuer): Issuer of the JWT
* sub (subject): Subject of the JWT (the user)
* aud (audience): Recipient for which the JWT is intended
* exp (expiration time): Time after which the JWT expires
* nbf (not before time): Time before which the JWT must not be accepted for processing
* iat (issued at time): Time at which the JWT was issued; can be used to determine age of the JWT
* jti (JWT ID): Unique identifier; can be used to prevent the JWT from being replayed (allows a token to be used only once)
* Other - Anything you want. 

Some form of randomness in the tokens is good. Or all tokens for a given user will look the same.

### Signature
   * hmac( base64EncodedHeader.base64EncodedBody, signingKey, 'sha256')
   * The result of the hmac command is also base64 encoded. 
   * Not an easy calculation to do by hand. See code in packages `jsonwebtoken`, `jws` and `jwa` to see how complicated it is to calculate the signature.

Note - Examples taken from jwt.io main page.

### End Result
<span style="color:red">eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.</span><span style="color:blue">eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.</span><span style="color:purple">SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c</span>

You can paste this into the form on http://jwt.io and see the contents of the header and body. 

# Can a JWT be hacked?
* Yes, with enough time the signing key can be guessed
* On an AWS server farm and enough samples, a 6-digit key took 54 minutes to crack
* signing key recommended to be 256-digits or more (depending on hashing algorithm). 

# Validating the JWT
* Validation confirms that the server signed the token.
* Passed as header `Authorization: Bearer <token>`
* Server takes header and body, with its already known secret and runs the signature algorithm again. If the signatures match, it is known that the token wasn't modified.

# Why Use a Package to Help
* JWT only determines that the key was signed by a known/trusted server. 
* Signature is really complicated to calculate yourself
* Does not check for expiry or what user has access to. This must be done aside from token validation.

# Example in Nodejs
* src/index.js - All the express pieces including a JWT middleware
* src/jwtService.js - All the JWT internal bits. Utilizing the package `jsonwebtoken` from Auth0.

# Logging Out
* Nope, the server doesn't keep track of sessions.
* In the frontend, logout is as simple as deleting the token so the user doesn't have access to it anymore.


//
// lib/makeToken.js
//
// makeToken(user)
//
// Generate an access token for a given user
//
// Notes:   the client shouldn't be considered secure,
//          so the JWT shouldn't contain anything more
//          than what is absolutely necessary to authorize
//          a user in the API.  No passwords, no secrets, etc...
//
const jwt = require('jsonwebtoken');

const { AUTH_SECRET } = require('./secrets');

const { APPLICATION_ID, TOKEN_DURATION = '15m' } = process.env;

module.exports = (user, duration = TOKEN_DURATION) =>
  //
  // generate a couchdb access token with an expiration.
  //
  jwt.sign(
    {
      sub: user._id,
      '_couchdb.roles': user.roles, // private claim for couchdb (and our API)
      //
      // [`_${APPLICATION_ID}.xxx`]:  yyy // private claim example
      //
    },
    AUTH_SECRET,
    {
      algorithm: 'HS256',
      expiresIn: duration,
      keyid: APPLICATION_ID, // i.e. "swat"
    }
  );

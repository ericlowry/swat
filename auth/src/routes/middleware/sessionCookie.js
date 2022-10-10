//
// middleware/sessionCookie.js
//
// installs session cookie features into the route's request
//
const debug = require('debug')('auth:session-cookie');
const parseDuration = require('parse-duration');

const { SESSION_COOKIE_NAME = 'st' } = process.env;

const SESSION_DURATION = parseDuration(process.env.SESSION_DURATION, 's');

const development = process.env.NODE_ENV === 'development';

const SESSION_COOKIE_BASE_OPTS = {
  sameSite: development ? 'lax' : 'strict',
  httpOnly: development ? false : true,
  secure: development ? false : true,
  path: '/',
};

module.exports = (req, _, next) => {
  //
  // req.sessionCookie
  //
  // Return the current user's session token (if any)
  //
  req.sessionCookie = req.cookies[SESSION_COOKIE_NAME];

  //
  // req.setSessionCookie(sessionToken)
  //
  // Set the user's session cookie.
  //
  req.setSessionCookie = function (sessionToken) {
    debug(`➔ ${SESSION_COOKIE_NAME}=${sessionToken}`);
    const cookieOpts = {
      ...SESSION_COOKIE_BASE_OPTS,
      expires: new Date(Date.now() + SESSION_DURATION * 1000),
    };
    this.res.cookie(SESSION_COOKIE_NAME, sessionToken, cookieOpts);
  };

  //
  // req.clearSessionCookie(sessionToken)
  //
  // Clear the users session cookie
  //
  req.clearSessionCookie = function () {
    this.res.clearCookie(SESSION_COOKIE_NAME, SESSION_COOKIE_BASE_OPTS);
  };

  next();
};

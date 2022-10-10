//
// session.js
//
// Get the current user's profile, data and a fresh access token.
//
const debug = require('debug')('auth:profile');

const { Unauthorized } = require('http-errors');
const cache = require('../lib/cache');

const makeProfile = require('../lib/makeProfile');
const makeToken = require('../lib/makeToken');
const cacheSession = require('../lib/cacheSession');

const Users = require('../lib/db')('users');

module.exports = async (req, res) => {
  // do we have a session cookie?
  if (!req.sessionCookie) {
    debug('no cookie');
    throw new Unauthorized();
  }

  // sessionKey is the redis cache key
  const sessionKey = req.sessionCookie;

  // does the session exist in the cache?
  const session = await cache.GET(sessionKey);
  if (!session) throw new Unauthorized();

  // does the user from the session exist?
  const user = await Users.get(session.id);
  if (!user) {
    req.clearSessionCookie();
    throw new Unauthorized();
  }

  // does the user's version match the session's version?
  if (user.version !== session.version) {
    req.clearSessionCookie();
    throw new Unauthorized();
  }

  // update the session with the user's current record (data hasn't changed)
  await cacheSession(sessionKey, user, session.data);

  // update the browser's session cookie (extend it's expiration)
  req.setSessionCookie(sessionKey);

  // create the user's client profile
  const profile = makeProfile(user);

  // generate a new JWT access token
  const token = makeToken(user);

  res.send({
    token,
    profile,
    data: session.data, // hasn't changed
  });
};

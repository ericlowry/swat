//
// cacheSession(sessionKey,user,data)
//
// Construct user session and writes it to the cache
//
// Note:  Everything in to "data" will be available
//        to the client as session data.
//
const assert = require('assert');
const cache = require('../lib/cache');
const parseDuration = require('parse-duration');

const SESSION_DURATION = parseDuration(process.env.SESSION_DURATION, 's');

async function cacheSession(sessionKey, user, data = {}) {
  assert(typeof sessionKey === 'string' && sessionKey);
  assert(typeof user === 'object');
  assert(typeof user._id === 'string' && user._id);
  assert(typeof user.version === 'string' && user.version);
  assert(typeof data === 'object');

  // construct a session for the user
  const session = {
    id: user._id, // extract the user id from doc
    version: user.version,
    data,
  };

  // cache the user's session into the redis cache
  await cache.SETEX(sessionKey, SESSION_DURATION, session);

  return session;
}

module.exports = cacheSession;

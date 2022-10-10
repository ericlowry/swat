const debug = require('debug')('auth:local-login');
const express = require('express');
const router = express.Router();
const { Unauthorized } = require('http-errors');
const bcrypt = require('bcryptjs');
const { generate: uuid } = require('short-uuid');

const makeProfile = require('../lib/makeProfile');
const makeToken = require('../lib/makeToken');
const cacheSession = require('../lib/cacheSession');

const Users = require('../lib/db')('users');

const checkPassword = async (password, hash) => bcrypt.compare(password, hash);

// extract body or query values from a request
const bq = (req, p) => (req.body[p] || req.query[p] || '').trim();

async function localLogin(req, res) {
  const name = bq(req, 'name');
  const password = bq(req, 'password');

  req.clearSessionCookie();

  debug(req.body)

  // did we get a name?
  if (!name) {
    debug(`no name`);
    throw new Unauthorized();
  }

  debug(`authenticating "${name}"`);

  // did we get a password?
  if (!password) {
    debug(`no password`);
    throw new Unauthorized();
  }

  let user;
  try {
    user = await Users.get(name);
  } catch (error) {
    if (error.statusCode !== 404) throw error; // unexpected
    debug(`local user "${name}" doesn't exist`);
    throw new Unauthorized();
  }

  // does the user have a password?
  if (typeof user.password !== 'string') {
    console.warn(`WARNING: User "${name}" does not have a password`);
    throw new Unauthorized();
  }

  // is the password correct?
  const match = await checkPassword(password, user.password);
  if (!match) {
    debug(`user '${name}' - password mismatch`);
    throw new Unauthorized();
  }

  // is the user active?
  if (user.status !== 'active') {
    const err = new Unauthorized();
    err.errors = ['user is not active'];
    throw err;
  }

  // construct a unique session key
  const sessionKey = uuid();

  await cacheSession(sessionKey, user, {}); // no session data

  // update the browser's session cookie
  req.setSessionCookie(sessionKey);

  // create the user's client profile
  const profile = makeProfile(user);

  // generate an access token JWT
  const token = makeToken(user);

  res.send({
    profile,
    token,
    data: {}, // no initial session data
  });
}

//
// GET /auth/local/login
//
router.get('/login', localLogin);

//
// POST /auth/local/login
//
router.post('/login', localLogin);

module.exports = router;

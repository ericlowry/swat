//
// session-data.js: manage the user's client side session data
//
// Provides the following endpoints:
//
// GET /auth/session/data - get the current user's session data
//
// POST /auth/session/data - update the session data
//
const debug = require('debug')('auth:session-data');
const assert = require('assert');
const express = require('express');
const router = express.Router();
const { Unauthorized } = require('http-errors');

const cache = require('../lib/cache');
const cacheSession = require('../lib/cacheSession');

router.use(async (req, res, next) => {
  assert(!req.sessionKey && !req.session);
  req.sessionKey = req.sessionCookie;
  if (!req.sessionKey) throw new Unauthorized();
  try {
    req.session = await cache.GET(req.sessionKey);
    next();
  } catch (error) {
    console.warn(`WARNING: /auth/session - no cache for ${req.sessionKey}`);
    throw new Unauthorized();
  }
});

//
// GET /auth/session/data - get the current session data
//
router.get('/', (req, res) => {
  res.send(req.session.data);
});

//
// POST /auth/session/data - update the user's session data
//
router.post('/', async (req, res) => {
  // construct a "minimal" user to pass to cacheSession()
  const mockUser = {
    _id: req.session.id,
    version: req.session.version,
  };
  debug(mockUser);
  await cacheSession(req.sessionKey, mockUser, req.body);
  res.send({ ok: true });
});

module.exports = router;

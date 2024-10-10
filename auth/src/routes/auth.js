const debug = require('debug')('auth:route');
const express = require('express');
const router = express.Router();
const pkg = require('../../package.json');

const cache = require('../lib/cache');

//
// GET /_up - service is up!
//
router.get('/_up', (req, res) => {
  res.send({ status: 'ok', services: ['auth', 'cache'] });
});

//
// GET /version
//
router.get('/version', function (req, res, next) {
  res.send({
    name: pkg.name,
    version: pkg.version,
    description: pkg.description,
  });
});

//
// * / - session cookie middleware stuff
//
router.use('/', require('./middleware/sessionCookie'));

//
// * /local
//
router.use('/local', require('./local-login'));

//
// GET /session
//
router.get('/session', require('./session'));

//
// * /session/data
//
router.use('/session/data', require('./session-data'));

//
// POST /logout - destroys a user's session (in place)
//
router.post('/logout', async (req, res) => {
  const sessionKey = req.sessionCookie;
  if (sessionKey) {
    debug(`destroying session: ${sessionKey}`);
    await cache.DEL(sessionKey);
  } else {
    debug(`no session to destroy`);
  }
  req.clearSessionCookie();
  res.send({ ok: true });
});

//
// POST /logout - destroys a user's session and redirect to home
//
router.get('/logout', (req, res) => {
  req.clearSessionCookie();
  res.redirect(process.env.CLIENT_REDIRECT);
});

module.exports = router;

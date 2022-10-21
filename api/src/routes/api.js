//
// route/api.js - main api route
//
const _debug = require('debug');
const express = require('express');
const router = express.Router();
const pkg = require('../../package.json');
const nano = require('nano')(process.env.COUCHDB);
const { NotAcceptable } = require('http-errors');
const { APPLICATION_ID } = process.env;

// middleware
const tokenAuthorization = require('./tokenAuthorization');
const hasRole = require('./hasRole');

//
// GET /_up - service is up!
//
router.get('/_up', (req, res) => {
  res.send({ status: 'ok', services: ['api'] });
});

//
// GET /version
//
router.get('/version', function (req, res) {
  res.send({
    name: pkg.name,
    version: pkg.version,
    description: pkg.description,
    application: process.env.APPLICATION_ID,
  });
});

//
// GET /secret - only admins can request the secret
//
router.get('/secret', tokenAuthorization, hasRole('_admin'), (req, res) => {
  res.send({ secret: process.env.AUTH_SECRET });
});

//
// GET /is-unique/db/view/key - check if key doesn't exists in db's view
//
router.use(
  '/is-unique/:db/:view/:key',
  tokenAuthorization,
  hasRole('user'),
  async (req, res) => {
    const debug = _debug('api:is-unique');
    const { db, view, key } = req.params;
    if (!db || !view || !key) throw new NotAcceptable('invalid path');
    const uri =
      `${APPLICATION_ID}-${db}` +
      `/_design/${APPLICATION_ID}-api` +
      `/_view/${view}` +
      `?reduce=false` +
      `&limit=2` +
      `&key=[${JSON.stringify(key)}]`;

    debug(uri);

    const viewResults = await nano.request(uri).catch(error => {
      const newError = new NotAcceptable('invalid path');
      newError.errors = [error.message];
      throw newError;
    });

    if (viewResults.rows.length > 1)
      console.warn(`WARNING: ${db}/${view}/${key} is NOT_UNIQUE`);

    res.send({ unique: !viewResults.rows.length });
  }
);

module.exports = router;

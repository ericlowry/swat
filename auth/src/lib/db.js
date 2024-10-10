//
// lib/db.js
//
const { COUCHDB } = require('./secrets');
const nano = require('nano')(COUCHDB);
const { APPLICATION_ID } = process.env;
module.exports = name => nano.use(`${APPLICATION_ID}-${name}`);

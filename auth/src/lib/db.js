//
// lib/db.js
//
const nano = require('nano')(process.env.COUCHDB);
const { APPLICATION_ID } = process.env;
module.exports = name => nano.use(`${APPLICATION_ID}-${name}`);

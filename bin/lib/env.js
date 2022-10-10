
const path = require('path');
const ENV_PATH = path.normalize(path.join(__dirname, '..', '..', '.env'));
const prestoENV = require('dotenv').config({ path: ENV_PATH });
const debug = require('debug')('presto:env');
//debug(prestoENV);

const assert = require('assert');

const { 
    APPLICATION_ID, 
    COUCHDB: _COUCHDB_, 
    ADMIN_USER,
    ADMIN_PASSWORD
} = process.env;

assert(APPLICATION_ID, 'Missing environment variable APPLICATION_ID');
assert(_COUCHDB_, 'Missing environment COUCHDB');
assert(ADMIN_USER, 'Missing environment COUCHDB_USER');
assert(ADMIN_PASSWORD, 'Missing environment COUCHDB_PASSWORD');

let COUCHDB;
try {
  COUCHDB = eval('`' + _COUCHDB_ + '`');
} catch (err) {
  console.error(err);
  throw new Error('unable to parse COUCHDB environment variable');
}
assert(COUCHDB, 'Invalid environment variable COUCHDB');
//debug(COUCHDB);

module.exports = {
 APPLICATION_ID,
 COUCHDB,
 COUCHDB_USER: ADMIN_USER,
 COUCHDB_PASSWORD: ADMIN_PASSWORD,
}

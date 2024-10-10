const fs = require('fs');
const AUTH_SECRET = fs.readFileSync('/run/secrets/AUTH_SECRET').toString();
const COUCHDB_USER =  fs.readFileSync('/run/secrets/COUCHDB_USER').toString();
const COUCHDB_PASSWORD =  fs.readFileSync('/run/secrets/COUCHDB_PASSWORD').toString();

const COUCHDB = `http://${COUCHDB_USER}:${COUCHDB_PASSWORD}@db:5984`

module.exports = {
    AUTH_SECRET,
    COUCHDB
}

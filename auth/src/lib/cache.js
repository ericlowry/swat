//
// lib/cache.js
//
const debug = require('debug')('auth:cache');
const redis = require('redis');
const { REDIS } = process.env;
const client = redis.createClient(REDIS);

client.on('connect', () => {
  debug('connected to cache');
});

client.on('error', error => {
  console.error('ERROR: REDIS');
  console.error(error);
});

module.exports = {
  //
  // async SETEX(key,exp,value)
  //
  //
  SETEX: (key, exp, value) =>
    new Promise((resolve, reject) => {
      client.SETEX(key, exp, JSON.stringify(value), (err, resp) => {
        if (err) return reject(err);
        resolve(resp);
      });
    }),

  //
  // async GET(key)
  //
  GET: key =>
    new Promise((resolve, reject) => {
      client.GET(key, (err, resp) => {
        if (err) return reject(err);
        try {
          const json = JSON.parse(resp);
          resolve(JSON.parse(resp));
        } catch (e) {
          reject(e);
        }
      });
    }),

  //
  // async DEL(key) - delete key
  //
  DEL: key =>
    new Promise((resolve, reject) => {
      client.DEL(key, (err, resp) => {
        if (err) return reject(err);
        resolve(true);
      });
    }),

  //
  // quit(callback) - a means to force the client to quit (for testing)
  //
  quit: cb => client.quit(cb),
};

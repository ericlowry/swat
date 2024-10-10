//
// tokenAuthorization
//
// JWT Bearer Token authorization scheme
//
const debug = require("debug")("api:authorization");
const { createError, Unauthorized } = require("http-errors");
const jwt = require("jsonwebtoken");
const { AUTH_SECRET } = require('../lib/secrets')

module.exports = (req, _, next) => {
  // has this middleware already been applied?
  if (req.ctx) console.warn("WARNING: req.ctx is already set");

  const authorization = req.headers.authorization;
  if (!authorization) {
    debug("no authorization header");
    throw new Unauthorized();
  }

  const token = authorization.split(" ")[1];
  if (!token) {
    debug("no token");
    throw new Unauthorized();
  }

  try {
    const payload = jwt.verify(token, AUTH_SECRET);
    debug(payload);

    req.ctx = {
      id: payload.sub,
      roles: payload["_couchdb.roles"],
    };

    debug(`${req.ctx.id} (${req.ctx.roles.join(",")})`);
  } catch (e) {
    debug(JSON.stringify(e));
    debug(`token: ${token}`);
    throw new Unauthorized("Access Token Expired");
  }

  next();
};

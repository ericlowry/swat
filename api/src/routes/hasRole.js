//
// hasRole(roleOrRoles)
//
// middleware to add role based authorization to a route
//
// throws:
//    Unauthorized -  when we don't have a user
//    Forbidden     - when our user doesn't have an acceptable role
//
// usage:
//
//   route.get('/secret', hasRole('admin'), (req,res)=>{ ... });
//
const assert = require('assert');

const { Unauthorized, Forbidden } = require('http-errors');

module.exports = roleOrRoles => (req, _, next) => {
  const acceptableRoles = Array.isArray(roleOrRoles)
    ? roleOrRoles
    : [roleOrRoles];

  assert(acceptableRoles.length, 'no acceptable roles in hasRoles()');

  if (!req.ctx) return new Unauthorized();
  assert(Array.isArray(req.ctx.roles));

  // ensure that our user has one of the required roles
  if (acceptableRoles.find(role => req.ctx.roles.includes(role))) return next();

  // requestor doesn't have the required role...
  throw new Forbidden();
};

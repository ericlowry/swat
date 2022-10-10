//
// lib/makeProfile.js
//
// Construct user's profile for use by the client
//
// Notes:   the client shouldn't be considered secure,
//          so the profile shouldn't contain anything
//          more than is absolutely necessary to render
//          the UI.  No passwords, no secrets, etc...
//
module.exports = user => ({
  id: user._id,
  label: user.label,
  roles: user.roles,
});

//
// models/users-model.js
//
const bcrypt = require('bcryptjs');
const { generate: uuid } = require('short-uuid');
const { APPLICATION_ID, ADMIN_PASSWORD } = process.env;

module.exports = {
  name: 'users',

  version: '1.0.0',
  partitioned: false,
  readOnly: true,

  requiredDocs: [
    {
      _id: 'admin',
      type: 'user',
      realm: 'local',
      label: 'Administrator',
      roles: ['user', 'power', 'admin', '_admin'],
      password: bcrypt.hashSync(ADMIN_PASSWORD, 12),
      version: uuid(),
      status: 'active',
      tags: [],
    },
  ],

  sampleDocs: [
    {
      _id: 'eric',
      type: 'user',
      realm: 'local',
      label: 'Eric',
      roles: ['user', 'power', 'admin', '_admin'],
      password: bcrypt.hashSync(ADMIN_PASSWORD, 12),
      status: 'active',
      version: uuid(),
      tags: [],
    },
    {
      _id: 'eric@myrealms.org',
      type: 'user',
      realm: 'gmail',
      label: 'Eric (gmail)',
      roles: ['user', 'power', 'admin', '_admin'],
      // no password...
      status: 'active',
      version: uuid(),
      tags: [],
    },
  ],

  views: {
    [`${APPLICATION_ID}-client`]: {
      default: ({ type, _id, realm, label, roles, status }) =>
        type === 'user' && emit([_id.toUpperCase()], {
          id: _id,
          realm,
          label,
          roles,
          status,
        }),
    },

    [`${APPLICATION_ID}-api`]: {
      'by-id': ({ type, _id }) => type === 'user' && emit([_id], 1),
    },
  },

  _security: {
    admins: {
      roles: ['_admin', 'admin'],
    },
    members: {
      roles: [], // nobody
    },
  },
};

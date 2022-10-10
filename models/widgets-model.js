//
// model/app/widgets-model.js
//
const { APPLICATION_ID } = process.env;

module.exports = {
  name: 'widgets',
  docType: 'widget',
  groupLabel: 'Widgets',
  docLabel: 'Widget',

  version: '1.0.0',
  readOnly: true,
  partitioned: false,

  requiredDocs: [
    // required docs go here...
  ],

  sampleDocs: [
    {
      _id: 'widget-01',
      type: 'widget',
      label: 'Widget 01',
      status: 'active',
      tags: ['new', 'featured'],
    },
    {
      _id: 'widget-02',
      type: 'widget',
      label: 'Widget 02',
      status: 'active',
      tags: ['easy-to-use'],
    },
    {
      _id: 'widget-03',
      type: 'widget',
      label: 'Widget 03',
      status: 'active',
      tags: ['on-sale'],
    },
    {
      _id: 'widget-04',
      type: 'widget',
      label: 'Widget 04',
      status: 'active',
      tags: [],
    },
    {
      _id: 'widget-05',
      type: 'widget',
      label: 'Widget 05',
      status: 'active',
      tags: ['out-of-stock'],
    },
    {
      _id: 'widget-06',
      type: 'widget',
      label: 'Widget 06',
      status: 'inactive',
      tags: ['discontinued'],
    },
    {
      _id: 'widget-07',
      type: 'widget',
      label: 'Widget 07',
      status: 'active',
      tags: ['new'],
    },
    {
      _id: 'widget-08',
      type: 'widget',
      label: 'Widget 08',
      status: 'active',
      tags: [],
    },
    {
      _id: 'widget-09',
      type: 'widget',
      label: 'Widget 09',
      status: 'active',
      tags: ['new', 'on-sale'],
    },
    {
      _id: 'widget-10',
      type: 'widget',
      label: 'Widget 10',
      status: 'active',
      tags: [],
    },
  ],

  views: {
    // views used by the web client
    [`${APPLICATION_ID}-client`]: {
      'default': ({ type, _id, label, tags, status }) =>
        type === 'widget' &&
        emit([label.toUpperCase()], {
          id: _id,
          label,
          tags,
          status,
        }),
      'by-tag': ({ type, tags }) =>
        type === 'widget' && tags && tags.map(tag => emit([tag], 1)),
      'by-status': ({ type, status }) =>
        type === 'widget' && status && emit([status], 1),
    },

    // views used by the API
    [`${APPLICATION_ID}-api`]: {
      'by-id': ({ type, _id }) => type === 'widget' && emit([_id], 1),
    },
  },

  _security: {
    admins: {
      roles: ['_admin', 'admin'],
    },
    members: {
      roles: ['user'],
    },
  },
};

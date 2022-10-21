//
// widgetModel.js
//
// widget db functions
//

import {
  createDocument,
  retrieveDocument,
  updateDocument,
  deleteDocument,
  documentExists,
} from './lib/dbInterface';

const dbCollection = 'widgets';

export function createWidget(doc) {
  return createDocument(dbCollection, doc);
}

export function retrieveWidget(id) {
  return retrieveDocument(dbCollection, id);
}

export function updateWidget(doc) {
  return updateDocument(dbCollection, doc);
}

export function deleteWidget(id, rev) {
  return deleteDocument(dbCollection, id, rev);
}

export function widgetExists(id) {
  return documentExists(dbCollection, id);
}

//
// dbInterface.js
//
// fetch a couchdb document from a collection
//
import fetchIt from '../../lib/fetchIt';
import { HttpNotFoundError } from 'fetch-http-errors';

const DB_URL = process.env.REACT_APP_DB_URL || '/db';

const APP_ID = process.env.REACT_APP_APPLICATION_ID;

export function createDocument(dbCollection, doc) {
  return fetchIt(`${DB_URL}/${APP_ID}-${dbCollection}/${doc._id}`, {
    method: 'PUT',
    body: doc,
  });
}

export function retrieveDocument(dbCollection, id) {
  return fetchIt(`${DB_URL}/${APP_ID}-${dbCollection}/${id}`);
}

export function updateDocument(dbCollection, doc) {
  return fetchIt(`${DB_URL}/${APP_ID}-${dbCollection}/${doc._id}`, {
    method: 'PUT',
    body: doc,
  });
}

export function deleteDocument(dbCollection, id, rev) {
  return fetchIt(`${DB_URL}/${APP_ID}-${dbCollection}/${id}/?rev=${rev}`, {
    method: 'DELETE',
  });
}

export function documentExists(dbCollection, id) {
  return retrieveDocument(dbCollection, id)
    .then(() => true)
    .catch(err => {
      if (!(err instanceof HttpNotFoundError)) throw err; // rethrow any unexpected error
      return false;
    });
}

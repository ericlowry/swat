//
// dbDocQueryFn()
//
import fetchIt from './fetchIt';

const APP_ID = process.env.REACT_APP_APPLICATION_ID;

export default function dbDocMutateFn(collection, docId, doc) {
  return fetchIt(`/db/${APP_ID}-${collection}/${docId}`, {
    method: 'PUT',
    body: doc,
  });
}

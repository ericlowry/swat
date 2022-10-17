//
// dbDocQueryFn()
//
import fetchIt from './fetchIt';

const APP_ID = process.env.REACT_APP_APPLICATION_ID;

export default function dbDocMutateFn(collection,doc) {
  const docId = doc._id;
  return fetchIt(`/db/${APP_ID}-${collection}/${docId}`, { method: 'POST', body: doc });
}

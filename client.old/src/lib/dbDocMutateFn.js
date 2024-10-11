//
// dbDocQueryFn()
//
import fetchIt from './fetchIt';

const APP_ID = process.env.REACT_APP_APPLICATION_ID;

export default function dbDocMutateFn(collection) {
  return doc => {
    const uri = doc._id
      ? `/db/${APP_ID}-${collection}/${doc._id}`
      : `/db/${APP_ID}-${collection}`;
    return fetchIt(uri, {
      method: 'PUT',
      body: doc,
    });
  };
}

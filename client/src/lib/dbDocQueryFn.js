//
// dbDocQueryFn()
//
import fetchIt from './fetchIt';

const APP_ID = process.env.REACT_APP_APPLICATION_ID;

export default function dbDocQueryFn({ queryKey }) {
  const [collection, docId] = queryKey;
  return fetchIt(`/db/${APP_ID}-${collection}/${docId}`);
}

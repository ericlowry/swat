//
// dbDocQueryFn()
//
import fetchIt from './fetchIt';

const APP_ID = process.env.REACT_APP_APPLICATION_ID;

export default function dbDocQueryFn({ queryKey }) {
  const [type, collection, docId] = queryKey;
  if (type !== 'doc') throw new Error('not a doc query');
  return fetchIt(`/db/${APP_ID}-${collection}/${docId}`);
}

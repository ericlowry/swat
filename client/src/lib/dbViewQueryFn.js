//
// dbViewQueryFn()
//
import fetchIt from './fetchIt';

const APP_ID = process.env.REACT_APP_APPLICATION_ID;

export default function dbViewQueryFn({ queryKey }) {
  const [type, collection, view, skip = 0, limit = 9999 ] = queryKey;
  if (type !== 'view') throw new Error('not a view query');
  return fetchIt(`/db/${APP_ID}-${collection}/_design/${APP_ID}-client/_view/${view}?reduce=false&skip=${skip}&limit=${limit}`)
}

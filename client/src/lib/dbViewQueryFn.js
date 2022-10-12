//
// dbViewQueryFn()
//

import { handleHttpErrors, HttpUnauthorizedError } from 'fetch-http-errors';
import fetchOptions from './fetchOptions';
import fetchAuthSession from './fetchAuthSession';

import Debug from 'debug';
const debug = Debug('client:dbViewQueryFn');

const APP_ID = process.env.REACT_APP_APPLICATION_ID;

function fetchView(accessToken, collection, view, skip = 0, limit = 9999) {
  return fetch(
    `/db/${APP_ID}-${collection}/_design/${APP_ID}-client/_view/${view}?reduce=false&skip=${skip}&limit=${limit}`,
    fetchOptions({ accessToken })
  )
    .then(handleHttpErrors)
    .then(res => res.json());
}

export default function dbViewQueryFn({ queryKey }) {
  const [type, collection, view, skip, limit] = queryKey;
  if (type !== 'view') throw new Error('not a view query');
  const accessToken = sessionStorage.getItem('accessToken');
  return fetchView(accessToken, collection, view, skip, limit).catch(err => {
    if (!(err instanceof HttpUnauthorizedError)) throw err; // unexpected error, rethrow it
    debug('refreshing accessToken');
    return fetchAuthSession().then(([newAccessToken]) => {
      sessionStorage.setItem('accessToken', newAccessToken); // save it for later
      return fetchView(newAccessToken, collection, view, skip, limit);
    });
  });
}

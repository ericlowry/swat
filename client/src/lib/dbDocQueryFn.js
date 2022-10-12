//
// dbDocQueryFn()
//

import { handleHttpErrors, HttpUnauthorizedError } from 'fetch-http-errors';
import fetchOptions from './fetchOptions';
import fetchAuthSession from './fetchAuthSession';

import Debug from 'debug';
const debug = Debug('client:dbDocQueryFn');

const APP_ID = process.env.REACT_APP_APPLICATION_ID;

function fetchDoc(accessToken, collection, docId) {
  return fetch(
    `/db/${APP_ID}-${collection}/${docId}`,
    fetchOptions({ accessToken })
  )
    .then(handleHttpErrors)
    .then(res => res.json());
}

export default function dbDocQueryFn({ queryKey }) {
  const [type, collection, docId] = queryKey;
  if (type !== 'doc') throw new Error('not a doc query');
  const accessToken = sessionStorage.getItem('accessToken');
  return fetchDoc(accessToken, collection, docId).catch(err => {
    if (!(err instanceof HttpUnauthorizedError)) throw err; // unexpected error, rethrow it
    debug('refreshing accessToken');
    return fetchAuthSession().then(([newAccessToken]) => {
      sessionStorage.setItem('accessToken', newAccessToken); // save it for later
      return fetchDoc(newAccessToken, collection, docId);
    });
  });
}

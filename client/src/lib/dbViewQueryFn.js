//
// dbViewQueryFn()
//

import { handleHttpErrors, HttpUnauthorizedError } from 'fetch-http-errors';
import fetchAuthSession from './fetchAuthSession';

import Debug from 'debug';
const debug = Debug('client:dbViewQueryFn');

const appID = process.env.REACT_APP_APPLICATION_ID;

const fetchView = (accessToken, collection, view, skip, limit) =>
  fetch(
    `/db/${appID}-${collection}/_design/${appID}-client/_view/${view}?reduce=false&skip=${skip}&limit=${limit}`,
    {
      method: 'GET',
      credentials: 'include',
      headers: {
        Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
      },
    }
  )
    .then(handleHttpErrors)
    .then(res => res.json());

export default function dbViewQueryFn({ queryKey }) {
  const [collection, view, skip, limit] = queryKey;
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

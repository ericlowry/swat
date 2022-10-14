//
// fetchIt() - authenticated fetch
//
// Attempt to fetch something with the current access token,
// if fetch throws an Unauthorized (401) error,
// get a fresh accessToken and try again.
//
// returns a promise that resolves to a JSON object,
// or throws an Http{Something*}Error
//

import { handleHttpErrors, HttpUnauthorizedError } from 'fetch-http-errors';
import fetchOptions from './fetchOptions';
import fetchAuthSession from './fetchAuthSession';

import Debug from 'debug';
const debug = Debug('client:fetchIt');

export default function fetchIt(resource, options) {
  const accessToken = sessionStorage.getItem('accessToken');
  return fetch(resource, fetchOptions({ ...options, accessToken }))
    .then(handleHttpErrors)
    .then(res => res.json()) // success on the first attempt
    .catch(err => {
      if (!(err instanceof HttpUnauthorizedError)) throw err; // unexpected error, rethrow it
      debug('refreshing accessToken');
      return fetchAuthSession().then(([accessToken]) => {
        sessionStorage.setItem('accessToken', accessToken); // save it for later
        return fetch(resource, fetchOptions({ ...options, accessToken }))
          .then(handleHttpErrors)
          .then(res => res.json()); // success on the second attempt
      });
    });
}

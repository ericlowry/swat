//
// fetchAuthSession()
//

import fetchOptions from './fetchOptions';
import { handleHttpErrors } from 'fetch-http-errors';

export default function fetchAuthSession() {
  return fetch('/auth/session', fetchOptions())
    .then(handleHttpErrors)
    .then(res => res.json())
    .then(data => [data.token, data.profile, data.data]);
}

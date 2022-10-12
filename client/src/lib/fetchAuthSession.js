//
// fetchAuthSession()
//

import { handleHttpErrors } from 'fetch-http-errors';

export default function fetchAuthSession() {
  return fetch('/auth/session', {
    headers: {
      'Accept': 'application/json',
    },
    credentials: 'include',
  })
    .then(handleHttpErrors)
    .then(res => res.json())
    .then(data => [data.token, data.profile, data.data]);
}

//
// useAuth() - Authentication/Authorization State Manager
//
import { createContext, useContext, useState } from 'react';
import { handleHttpErrors, HttpUnauthorizedError } from 'fetch-http-errors';
import { useQuery } from 'react-query';

import fetchOptions from '../lib/fetchOptions';
import fetchAuthSession from '../lib/fetchAuthSession';

const Ctx = createContext();

// on page load, ensure the token is empty
sessionStorage.setItem('accessToken', '');

//
// Provider
//
export const AuthProvider = ({ children }) => {
  const [profile, setProfile] = useState();
  const [session, setSession] = useState();
  const { isLoading, error } = useQuery(
    'session',
    () =>
      fetchAuthSession()
        .then(([myAccessToken, myProfile, mySession]) => {
          sessionStorage.setItem('accessToken', myAccessToken);
          setProfile(myProfile);
          setSession(mySession);
          return true;
        })
        .catch(err => {
          if (!(err instanceof HttpUnauthorizedError)) throw err; // rethrow unexpected errors
        }),
    { refetchOnWindowFocus: false }
  );

  function clearAuthState() {
    setProfile();
    setSession();
    sessionStorage.setItem('accessToken', '');
  }

  async function localLogin(name, password) {
    clearAuthState();
    return fetch(
      '/auth/local/login',
      fetchOptions({ method: 'POST', body: { name, password } })
    )
      .then(handleHttpErrors)
      .then(res => res.json())
      .then(resJSON => {
        setProfile(resJSON.profile);
        setSession(resJSON.data);
        sessionStorage.setItem('accessToken', resJSON.token);
        return true;
      });
  }

  function logout() {
    clearAuthState();
    return fetch('/auth/logout', fetchOptions({ method: 'POST' }))
      .then(() => true)
      .catch(() => false);
  }

  return (
    <Ctx.Provider
      value={{ isLoading, error, profile, session, localLogin, logout }}
    >
      {children}
    </Ctx.Provider>
  );
};

//
// Consumer
//
export default function useAuth() {
  return useContext(Ctx);
}

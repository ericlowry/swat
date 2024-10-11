//
// useAuth() - Authentication/Authorization State Manager
//
import { createContext, useContext, useEffect, useState } from 'react';
import { handleHttpErrors, HttpUnauthorizedError } from 'fetch-http-errors';

import fetchOptions from '../lib/fetchOptions';
import fetchAuthSession from '../lib/fetchAuthSession';

const Ctx = createContext();

// on page load, ensure that we don't have a token
sessionStorage.setItem('accessToken', '');

//
// Provider
//
export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();
  const [profile, setProfile] = useState();
  const [session, setSession] = useState();

  useEffect(() => {
    fetchAuthSession()
      .then(([myAccessToken, myProfile, mySession]) => {
        sessionStorage.setItem('accessToken', myAccessToken);
        setProfile(myProfile);
        setSession(mySession);
      })
      .catch(err => {
        if (!(err instanceof HttpUnauthorizedError)) setError(err); // rethrow unexpected errors
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

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

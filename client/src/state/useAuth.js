//
// useAuth() - Authentication/Authorization State Manager
//
import { createContext, useContext, useState } from 'react';
import { useQuery } from 'react-query';

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
      fetch('/auth/session', {
        headers: {
          'Accept': 'application/json',
        },
        credentials: 'include',
      })
        .then(res => res.json())
        .then(raw => {
          setProfile(raw.profile);
          setSession(raw.data);
          sessionStorage.setItem('accessToken', raw.token);
          return true;
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
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        password,
      }),
      mode: 'cors',
      credentials: 'include',
    };

    return fetch('/auth/local/login', options)
      .then(res => {
        if (!res.ok) throw new Error(`Unable to login (${res.status})`);
        return res.json();
      })
      .then(resJSON => {
        setProfile(resJSON.profile);
        setSession(resJSON.data);
        sessionStorage.setItem('accessToken', resJSON.token);
        return true;
      });
  }

  function logout() {
    clearAuthState();
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      credentials: 'include',
    };
    fetch('/auth/logout', options).then(() => true);
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

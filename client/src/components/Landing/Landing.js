import useAuth from '../../state/useAuth';

import { Link, Navigate } from 'react-router-dom';

export default function Landing() {
  const { profile } = useAuth();
  if (profile) return <Navigate to="/home" />;
  return (
    <>
      <h1>Welcome To {process.env.REACT_APP_CLIENT_BRAND}</h1>
      <p>Perhaps you want to <Link to="/login">login</Link>?</p>
    </>
  );
}

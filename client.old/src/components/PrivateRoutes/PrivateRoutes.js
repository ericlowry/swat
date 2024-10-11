import { Outlet, Navigate } from 'react-router-dom';
import useAuth from '../../state/useAuth';

export default function PrivateRoutes() {
  const { profile } = useAuth();
  return profile ? <Outlet /> : <Navigate to="/login" />;
}

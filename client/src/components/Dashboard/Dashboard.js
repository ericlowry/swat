import useAuth from '../../state/useAuth';

import Badge from 'react-bootstrap/Badge';
import Widgets from '../Widgets';

export default function Dashboard() {
  const { profile } = useAuth();
  return (
    <>
      <h1>Dashboard</h1>
      <h4>for: {profile.label} </h4>
      <h6>
        roles:{' '}
        {profile.roles.map(role => (
          <Badge key={role} className="ms-1">
            {role}
          </Badge>
        ))}
      </h6>
      <Widgets className="mt-5" />
    </>
  );
}

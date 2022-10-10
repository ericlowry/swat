import useAuth from '../../state/useAuth';
import { useQuery } from 'react-query';

import Badge from 'react-bootstrap/Badge';

const appID = process.env.REACT_APP_APPLICATION_ID;

function dbFetchView(collection, view) {
  return () => {
    const accessToken = sessionStorage.getItem('accessToken');
    return fetch(
      `/db/${appID}-${collection}/_design/${appID}-client/_view/${view}?reduce=false`,
      {
        method: 'GET',
        credentials: 'include',
        headers: {
          Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
        },
      }
    ).then(res => res.json());
  };
}

function Widgets({ ...rest }) {
  const { isLoading, error, data } = useQuery(
    'widgets',
    dbFetchView('widgets', 'default')
  );
  if (isLoading) return 'Loading...';
  if (error) return 'Error';
  return (
    <div {...rest}>
      <ul className="list-group">
        {data.rows.map(row => (
          <li className="list-group-item" key={row.id}>
            {row.value.label}{' '}
            <Badge
              bg={row.value.status === 'inactive' ? 'danger' : 'success'}
              className="ms-1"
            >
              {row.value.status}
            </Badge>
            {row.value.tags.map(tag => (
              <Badge key={tag} bg="info" className="ms-1">
                {tag}
              </Badge>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
}

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

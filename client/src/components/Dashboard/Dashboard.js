import { useState } from 'react';
import useAuth from '../../state/useAuth';

import { useQuery } from 'react-query';
import dbViewQueryFn from '../../lib/dbViewQueryFn';

import Badge from 'react-bootstrap/Badge';

//import Debug from 'debug';
//const debug = Debug('client:Dashboard');

function Widgets({ ...rest }) {
  const [skip, setSkip] = useState(0);
  const { isLoading, error, data } = useQuery(
    ['widgets', 'default', skip, 5],
    dbViewQueryFn, { keepPreviousData: true }
  );

  if (isLoading) return 'Loading...';
  if (error) return 'Error';
  if (!data) return 'oops!';

  return (
    <div {...rest}>
      <ul className="list-group">
        {data.rows.map((row, i) => (
          <li className="list-group-item" key={row.id}>
            {skip + i + 1}: {row.value.label}
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
      <button disabled={skip === 0} onClick={() => setSkip(prev => prev - 5)}>
        Prev
      </button>
      <button disabled={skip+5 >= data.total_rows} onClick={() => setSkip(prev => prev + 5)}>Next</button>
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

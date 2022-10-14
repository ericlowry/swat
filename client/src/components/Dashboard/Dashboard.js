import useAuth from '../../state/useAuth';
import { useQuery } from 'react-query';
import dbViewQueryFn from '../../lib/dbViewQueryFn';
import Badge from 'react-bootstrap/Badge';
import WidgetsList from '../WidgetsList';
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';

const skip = 0;
const pageSize = 5;

export default function Dashboard() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { isLoading, error, data } = useQuery(
    ['view', 'widgets', 'default', skip, pageSize],
    dbViewQueryFn,
    { keepPreviousData: true }
  );

  if (isLoading) return 'Loading...';
  if (error) return 'Error';

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
      <br />
      <WidgetsList data={data} />
      <Stack direction="horizontal" gap={2}>
        <div className="me-auto">
          Widgets {data.rows.length} of {data.total_rows}
        </div>
        <Button
          onClick={() => navigate('/widgets/1')}
        >
          More
        </Button>
      </Stack>
    </>
  );
}

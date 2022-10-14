import { useQuery } from 'react-query';
import dbViewQueryFn from '../../lib/dbViewQueryFn';

import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';

import Stack from 'react-bootstrap/Stack';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';

const pageSize = 5;

export default function Widgets() {
  const navigate = useNavigate();
  const { page } = useParams();
  const { isLoading, error, data, isFetching } = useQuery(
    [
      'view',
      'widgets',
      'default',
      ((Number.parseInt(page) || 1) - 1) * pageSize, // rows to skip
      pageSize,
    ],
    dbViewQueryFn,
    { keepPreviousData: true }
  );

  if (isLoading) return 'Loading...';
  if (error) return 'Error';

  const pageNumber = Number.parseInt(page);
  if (!Number.parseInt(page)) return <Navigate to="/widgets/1" replace />;

  const pageCount = Math.ceil(data.total_rows / pageSize);

  return (
    <div>
      <h1>Widgets</h1>
      <ul className="list-group" style={{ minHeight: '14rem' }}>
        {data.rows.map((row, i) => (
          <li className="list-group-item" key={row.id}>
            <Link to={`/widget/${row.id}`}>view</Link> {row.value.label}
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
      <Stack direction="horizontal" gap={2}>
        <div className="me-auto">
          Page {pageNumber} of {pageCount}
        </div>
        <Button
          disabled={isFetching || pageNumber === 1}
          onClick={() => navigate(`/widgets/${pageNumber - 1}`, { replace: true })}
        >
          Prev
        </Button>
        <div className="vr" />
        <Button
          disabled={isFetching || pageNumber >= pageCount}
          onClick={() => navigate(`/widgets/${pageNumber + 1}`, { replace: true })}
        >
          Next
        </Button>
      </Stack>
    </div>
  );
}

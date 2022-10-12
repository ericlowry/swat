import { useState } from 'react';

import { useQuery } from 'react-query';
import dbViewQueryFn from '../../lib/dbViewQueryFn';

import { Link } from 'react-router-dom';

import Stack from 'react-bootstrap/Stack';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';

const pageSize = 5;

export default function Widgets({ ...rest }) {
  const [skip, setSkip] = useState(0);
  const { isLoading, error, data, isFetching } = useQuery(
    ['view', 'widgets', 'default', skip, pageSize],
    dbViewQueryFn,
    { keepPreviousData: true }
  );

  if (isLoading) return 'Loading...';
  if (error) return 'Error';

  const pageCount = Math.ceil(data.total_rows / pageSize);
  const currPage = skip / pageSize + 1;

  return (
    <div {...rest}>
      <ul className="list-group" style={{ minHeight: '14rem' }}>
        {data.rows.map((row, i) => (
          <li className="list-group-item" key={row.id}>
            <Link to={`/widget/${row.id}`}>view</Link>{' '}
            {row.value.label}
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
          Page {currPage} of {pageCount}
        </div>
        <Button
          disabled={isFetching || skip === 0}
          onClick={() => setSkip(prev => prev - 5)}
        >
          Prev
        </Button>
        <div className="vr" />
        <Button
          disabled={isFetching || skip + 5 >= data.total_rows}
          onClick={() => setSkip(prev => prev + 5)}
        >
          Next
        </Button>
      </Stack>
    </div>
  );
}

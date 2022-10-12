import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import dbDocQueryFn from '../../lib/dbDocQueryFn';

export default function Widget() {
  const { id } = useParams();
  const { isLoading, error, data } = useQuery(
    ['doc', 'widgets', id],
    dbDocQueryFn
  );

  if (isLoading) return 'loading...';
  if (error) {
    console.error(error);
    return 'error...';
  }

  return (
    <>
      <h1>Widget: {id}</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  );
}

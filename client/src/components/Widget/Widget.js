import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import dbDocQueryFn from '../../lib/dbDocQueryFn';
import { useForm } from 'react-hook-form';

import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';

function EditWidget({ widget }) {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      id: widget._id,
      label: widget.label,
      status: widget.status,
      tags: widget.tags.join(','),
    },
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = data => {
    console.log(data);
  }

  return (
    <>
      <pre>{JSON.stringify(widget, null, 2)}</pre>{' '}
      <div className="d-flex justify-content-center mt-5">
        <Card style={{ maxWidth: '350px' }}>
          <Card.Body>
            <h2 className="text-center mb-4">Widget</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Form.Group id="id" className="mb-3">
                <Form.Label htmlFor="id">ID</Form.Label>
                <Form.Control
                  type="text"
                  {...register('id', { required: 'ID is required' })}
                  disabled
                />
                <Form.Text className="text-muted">
                  id can't be changed after creation
                </Form.Text>
                {errors['user'] && <p>{errors['id']?.message}</p>}
              </Form.Group>
              <Form.Group id="label" className="mb-3">
                <Form.Label htmlFor="label">Label</Form.Label>
                <Form.Control
                  type="text"
                  {...register('label', { required: 'Label is required' })}
                />
                {errors['label'] && <p>{errors['label']?.message}</p>}
              </Form.Group>
              <Form.Group id="status" className="mb-3">
                <Form.Label htmlFor="status">Status</Form.Label>
                <Form.Select aria-label="Widget Status" {...register('status')}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </Form.Select>
              </Form.Group>
              <Form.Group id="tags" className="mb-3">
                <Form.Label htmlFor="label">Tags</Form.Label>
                <Form.Control type="text" {...register('tags')} />
                <Form.Text className="text-muted">
                  comma separated, spaces ignored
                </Form.Text>
                {errors['label'] && <p>{errors['label']?.message}</p>}
              </Form.Group>
              <Button disabled={loading} className="w-100 mt-4" type="submit">
                Update
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </>
  );
}

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

  return <EditWidget widget={data} />;
}

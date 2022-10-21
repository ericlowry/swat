import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import dbDocQueryFn from '../../lib/dbDocQueryFn';
import dbDocMutateFn from '../../lib/dbDocMutateFn';
import { useForm } from 'react-hook-form';
import { generate as uuid } from 'short-uuid';

import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
import fetchIt from '../../lib/fetchIt';

export default function NewWidget() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const mutation = useMutation(dbDocMutateFn('widgets'), {
    onSuccess: () => {
      queryClient.invalidateQueries(['widgets']);
    },
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      _id: uuid(),
      label: '',
      status: 'active',
      tags: '',
    },
  });

  const [error, setError] = useState('');

  const onSubmit = data => {
    const doc = {
      _id: data._id,
      type: 'widget',
      label: data.label,
      status: data.status,
      tags: data.tags.replace(/ /g, '').split(','),
    };
    //console.log(doc);
    mutation.mutate(doc, {
      onSuccess: (data, variables, context) => {
        navigate(-1);
      },
      onError: err => {
        setError('oops - try again later');
      },
    });
  };

  return (
    <>
      {}
      <div className="d-flex justify-content-center mt-5">
        <Card style={{ minWidth: '700px' }}>
          <Card.Body>
            <h2 className="text-center mb-4">Widget</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Form.Group id="id" className="mb-3">
                <Form.Label>ID</Form.Label>
                <Form.Control
                  type="text"
                  {...register('_id', {
                    required: true,
                    validate: {
                      isUnique: value =>
                        fetchIt(`/api/is-unique/widgets/by-id/${value.trim()}`).then(
                          res => res.unique
                        ),
                    },
                  })}
                  spellCheck={false}
                />
                {errors['_id'] && <p>{errors['_id'].type === 'isUnique' ? 'id is not unique' : errors['_id'].message || errors['_id'].type }</p>}
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
              <Stack direction="horizontal" gap={2}>
                <Button
                  className="me-auto w-100"
                  disabled={mutation.isLoading}
                  type="submit"
                >
                  Create
                </Button>
                <Button
                  variant="secondary"
                  disabled={mutation.isLoading}
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
              </Stack>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </>
  );
}

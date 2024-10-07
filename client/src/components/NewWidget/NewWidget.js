import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from 'react-query';
import { useForm } from 'react-hook-form';
import { generate as uuid } from 'short-uuid';

import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
//import fetchIt from '../../lib/fetchIt';

import { createWidget, widgetExists } from '../../models/widgetModel';
import { HttpConflictError } from 'fetch-http-errors';

export default function NewWidget() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const mutation = useMutation(createWidget, {
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

  const FieldError = field => (
    <div className="invalid-feedback">{errors[field]?.message}</div>
  );

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
      onSuccess: data => {
        console.log(data);
        navigate(-1);
      },
      onError: (err, data) => {
        if (err instanceof HttpConflictError) {
          setError(`document with ${data._id} already exists`);
        } else {
          setError('unable to create document - try again later');
        }
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
              <Form.Group controlId="customId" className="mb-3">
                <Form.Label>ID</Form.Label>
                <Form.Control
                  type="text"
                  {...register('_id', {
                    required: 'ID is required',
                    validate: {
                      isUnique: value =>
                        widgetExists(value.trim()).then(exists =>
                          exists ? `Document ID already exists` : true
                        ),
                    },
                  })}
                  spellCheck={false}
                  />
                {errors['_id'] && <p className="text-danger">{errors['_id'].message || 'bad id'}</p>}
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

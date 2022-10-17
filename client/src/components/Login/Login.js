import { useState } from 'react';
import useAuth from '../../state/useAuth';
import { useNavigate } from 'react-router-dom';

//import { Link } from 'react-router-dom'

import { useForm } from 'react-hook-form';

import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';

export default function Login() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { localLogin } = useAuth();

  const navigate = useNavigate();

  async function onSubmit({ user, password }) {
    try {
      setError('');
      setLoading(true);
      await localLogin(user, password);
      navigate('/home');
    } catch {
      setError('Failed to log in!');
    }
    setLoading(false);
  }

  return (
    <>
      <div className="d-flex justify-content-center mt-5">
        <Card style={{ maxWidth: '350px' }}>
          <Card.Body>
            <h2 className="text-center mb-4">Log In</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Form.Group id="user">
                <Form.Label htmlFor="user">User</Form.Label>
                <Form.Control
                  type="text"
                  {...register('user', { required: 'User is required' })}
                />
                {errors['user'] && <p>{errors['user']?.message}</p>}
              </Form.Group>
              <Form.Group id="password" className="mt-3">
                <Form.Label htmlFor="password">Password</Form.Label>
                <Form.Control
                  type="password"
                  {...register('password', {
                    required: 'Password is required',
                  })}
                />
                {errors['password'] && <p>{errors['password']?.message}</p>}
              </Form.Group>
              <Button disabled={loading} className="w-100 mt-4" type="submit">
                Log In
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </>
  );
}

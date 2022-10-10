import { useRef, useState } from 'react';
import useAuth from '../../state/useAuth';
import { useNavigate } from 'react-router-dom';

//import { Link } from 'react-router-dom'

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';

export default function Login() {
  const userRef = useRef();
  const passwordRef = useRef();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { localLogin } = useAuth();

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError('');
      setLoading(true);
      await localLogin(userRef.current.value, passwordRef.current.value);
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
            <Form onSubmit={handleSubmit}>
              <Form.Group id="user">
                <Form.Label>User</Form.Label>
                <Form.Control type="text" ref={userRef} required />
              </Form.Group>
              <Form.Group id="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" ref={passwordRef} required />
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

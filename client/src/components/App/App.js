import './App.css';

import { Routes, Route } from 'react-router-dom';

import useAuth from '../../state/useAuth';

import Container from 'react-bootstrap/Container';

import NavBar from '../NavBar';
import Landing from '../Landing';
import Login from '../Login';
import Dashboard from '../Dashboard';
import PrivateRoutes from '../PrivateRoutes';
import Widget from '../Widget';
import Widgets from '../Widgets';

import { ReactQueryDevtools } from 'react-query/devtools';

const NotFound = () => <h1>Not Found (404)</h1>;
const About = () => <h1>About</h1>;

function App() {
  const { isLoading } = useAuth();

  if (isLoading)
    return (
      <>
        <NavBar />
      </>
    );
    
  return (
    <>
      <NavBar />
      <Container className="mt-2">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route element={<PrivateRoutes />}>
            <Route path="/home" element={<Dashboard />} />
            <Route path="/widgets/:page" element={<Widgets />} />
            <Route path="/widget/:id" element={<Widget />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Container>
      <ReactQueryDevtools />
    </>
  );
}

export default App;

import './App.css';

import { Routes, Route, Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import NavBar from '../NavBar';

const Dashboard = () => <h1>Dashboard</h1>;
const About = () => <h1>About</h1>;

function App() {
  return (
    <>
      <NavBar />
      <Container className="mt-2">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;

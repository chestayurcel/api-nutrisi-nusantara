import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import Gallery from './Gallery';
import Dashboard from './Dashboard';

function App() {
  return (
    <Router>
       <Routes>
          {/* Halaman Utama (Home) */}
          <Route path="/" element={<HomeLayout />} />
          
          {/* Halaman Developer (Dashboard) */}
          <Route path="/developer" element={<Dashboard />} />
       </Routes>
    </Router>
  );
}

// Layout Halaman Utama (Wrapper)
function HomeLayout() {
    return (
        <div className="bg-light min-vh-100">
             <Navbar bg="white" expand="lg" className="shadow-sm sticky-top">
                <Container>
                    <Navbar.Brand as={Link} to="/" className="fw-bold text-success">
                        🥗 NusaNutrisi
                    </Navbar.Brand>
                    <Nav className="ms-auto">
                        <Nav.Link as={Link} to="/" className="me-3">Galeri Resep</Nav.Link>
                        {/* Tombol Menuju Dashboard ala OpenRouter */}
                        <Button as={Link} to="/developer" variant="dark" className="px-4 rounded-pill">
                            For Developers
                        </Button>
                    </Nav>
                </Container>
            </Navbar>
            
            {/* Panggil Komponen Galeri di sini */}
            <Gallery /> 
        </div>
    );
}

export default App;
import { Container, Row, Col, Button, Navbar, Nav, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function LandingPage() {
    return (
        <div className="bg-white min-vh-100 d-flex flex-column">
            {/* Navbar Transparan/Putih */}
            <Navbar expand="lg" className="nav-luxury py-3 sticky-top">
                <Container>
                    <Navbar.Brand as={Link} to="/" className="fw-bold text-emerald fs-4">
                        🥗 NusaNutrisi
                    </Navbar.Brand>
                    <Nav className="ms-auto">
                        <Link to="/auth" className="btn btn-outline-success rounded-pill px-4 me-2">Login</Link>
                        <Link to="/auth" className="btn btn-luxury">Get Started</Link>
                    </Nav>
                </Container>
            </Navbar>

            {/* Hero Section */}
            <Container className="flex-grow-1 d-flex align-items-center py-5">
                <Row className="align-items-center w-100">
                    <Col md={6} className="mb-4 mb-md-0">
                        <h1 className="display-4 fw-bold text-dark mb-3">
                            Resep Nusantara, <br />
                            <span className="text-emerald">Data Terpercaya.</span>
                        </h1>
                        <p className="lead text-secondary mb-4">
                            Platform data kuliner #1 di Indonesia yang menyediakan ribuan resep autentik lengkap dengan informasi nilai gizi yang akurat untuk kebutuhan aplikasi atau gaya hidup sehat Anda.
                        </p>
                        <div className="d-flex gap-3">
                            <Link to="/auth" className="btn btn-luxury btn-lg shadow">
                                Akses Galeri Resep
                            </Link>
                            <Link to="/auth" className="btn btn-outline-success btn-lg rounded-pill">
                                Integrasi API
                            </Link>
                        </div>
                    </Col>
                    <Col md={6} className="text-center">
                        {/* Ilustrasi Demo Fitur (Mockup) */}
                        <div className="position-relative">
                            <div className="bg-emerald rounded-circle position-absolute top-50 start-50 translate-middle opacity-10" style={{width: '400px', height: '400px'}}></div>
                            <img 
                                src="https://dummyimage.com/600x400/0f5132/fff&text=Premium+Recipe+Data" 
                                alt="App Demo" 
                                className="img-fluid rounded-4 shadow-lg position-relative card-luxury"
                            />
                        </div>
                    </Col>
                </Row>
            </Container>

            {/* Fitur Highlights */}
            <div className="bg-soft py-5">
                <Container>
                    <Row className="text-center g-4">
                        <Col md={4}>
                            <Card className="h-100 card-luxury p-4">
                                <h3 className="fs-1 mb-3">🍲</h3>
                                <h5 className="fw-bold">1000+ Resep Asli</h5>
                                <p className="text-muted small">Koleksi masakan dari Sabang sampai Merauke yang terverifikasi.</p>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card className="h-100 card-luxury p-4">
                                <h3 className="fs-1 mb-3">⚡</h3>
                                <h5 className="fw-bold">API Cepat & Stabil</h5>
                                <p className="text-muted small">Infrastruktur handal untuk developer yang ingin membangun aplikasi.</p>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card className="h-100 card-luxury p-4">
                                <h3 className="fs-1 mb-3">🥑</h3>
                                <h5 className="fw-bold">Kalkulasi Gizi Otomatis</h5>
                                <p className="text-muted small">Setiap resep dilengkapi data kalori, protein, dan lemak yang akurat.</p>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
            
            <footer className="text-center py-4 text-muted small">
                © 2024 NusaNutrisi Inc. All rights reserved.
            </footer>
        </div>
    );
}

export default LandingPage;
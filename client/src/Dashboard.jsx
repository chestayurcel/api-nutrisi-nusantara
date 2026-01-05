import { useState } from 'react';
import axios from 'axios';
import { Container, Card, Form, Button, Alert, Row, Col, Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:3000/api/v1';

function Dashboard() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [apiKey, setApiKey] = useState(null);
    const [error, setError] = useState(null);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const res = await axios.post(`${API_BASE_URL}/auth/register`, { name, email });
            setApiKey(res.data.data.api_key);
        } catch (err) {
            setError(err.response?.data?.message || 'Terjadi kesalahan');
        }
    };

    return (
        <div className="bg-dark min-vh-100 text-light">
            {/* Navbar Khusus Dashboard */}
            <Navbar bg="black" variant="dark" className="border-bottom border-secondary">
                <Container>
                    <Navbar.Brand as={Link} to="/" className="fw-bold text-success">
                        &larr; Kembali ke Galeri
                    </Navbar.Brand>
                    <Nav className="ms-auto">
                        <Nav.Link href="http://localhost:3000/api-docs" target="_blank">
                            Dokumentasi API ↗
                        </Nav.Link>
                    </Nav>
                </Container>
            </Navbar>

            <Container className="py-5">
                <Row className="justify-content-center">
                    <Col md={8} lg={6}>
                        <div className="text-center mb-5">
                            <h2 className="fw-bold">Developer Console</h2>
                            <p className="text-secondary">Dapatkan akses ke ribuan data nutrisi masakan Indonesia.</p>
                        </div>

                        {/* Jika belum punya key, tampilkan Form */}
                        {!apiKey ? (
                            <Card className="bg-black text-light border-secondary shadow-lg">
                                <Card.Body className="p-4">
                                    <h4 className="mb-3">Dapatkan API Key Gratis</h4>
                                    {error && <Alert variant="danger">{error}</Alert>}
                                    
                                    <Form onSubmit={handleRegister}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Nama Lengkap</Form.Label>
                                            <Form.Control 
                                                type="text" 
                                                placeholder="Contoh: Budi Developer" 
                                                className="bg-dark text-light border-secondary"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                required
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-4">
                                            <Form.Label>Email Developer</Form.Label>
                                            <Form.Control 
                                                type="email" 
                                                placeholder="dev@example.com" 
                                                className="bg-dark text-light border-secondary"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                        </Form.Group>
                                        <Button variant="success" type="submit" className="w-100 py-2 fw-bold">
                                            Generate API Key 🚀
                                        </Button>
                                    </Form>
                                </Card.Body>
                            </Card>
                        ) : (
                            /* Jika SUDAH punya key, tampilkan Key-nya */
                            <Card className="bg-black text-light border-success shadow-lg">
                                <Card.Body className="p-5 text-center">
                                    <h1 className="display-1 mb-3">🎉</h1>
                                    <h4 className="text-success fw-bold">Selamat Datang, {name}!</h4>
                                    <p className="text-secondary">Ini adalah kunci akses Anda. Simpan baik-baik!</p>
                                    
                                    <div className="bg-dark p-3 rounded border border-secondary d-flex justify-content-between align-items-center my-4">
                                        <code className="text-warning fs-5">{apiKey}</code>
                                        <Button size="sm" variant="outline-light" onClick={() => navigator.clipboard.writeText(apiKey)}>
                                            Copy
                                        </Button>
                                    </div>

                                    <div className="d-grid gap-2">
                                        <Button href="http://localhost:3000/api-docs" target="_blank" variant="outline-success">
                                            Baca Dokumentasi Integrasi
                                        </Button>
                                        <Button variant="link" className="text-secondary" onClick={() => setApiKey(null)}>
                                            Generate Key Baru
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        )}

                        {/* Fitur Pemanis ala "Standard Industri" */}
                        <div className="mt-5 text-secondary small">
                            <Row className="text-center">
                                <Col>
                                    <h5 className="text-light">99.9%</h5>
                                    <span>Uptime SLA</span>
                                </Col>
                                <Col>
                                    <h5 className="text-light">100ms</h5>
                                    <span>Latency</span>
                                </Col>
                                <Col>
                                    <h5 className="text-light">1k Req</h5>
                                    <span>Free Tier</span>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Dashboard;
import { useState } from 'react';
import axios from 'axios';
import { Container, Card, Form, Button, Alert, Row, Col, Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:3000/api/v1';

function Dashboard() {
    // State Mode
    const [isLoginMode, setIsLoginMode] = useState(false); 

    // Form State
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    // Result State
    const [userData, setUserData] = useState(null); 
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // --- HANDLE LOGIN / REGISTER ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const endpoint = isLoginMode ? '/auth/login' : '/auth/register';
            const payload = isLoginMode 
                ? { email, password } 
                : { name, email, password };

            const res = await axios.post(`${API_BASE_URL}${endpoint}`, payload);
            
            setUserData(res.data.data);
            setName(res.data.data.name);
            
        } catch (err) {
            setError(err.response?.data?.message || 'Terjadi kesalahan sistem');
        } finally {
            setLoading(false);
        }
    };

    // --- HANDLE REGENERATE KEY (BARU) ---
    const handleRegenerate = async () => {
        if(!window.confirm("Apakah Anda yakin? API Key lama akan hangus dan kuota akan direset ke 1000.")) return;

        setLoading(true);
        try {
            // Menggunakan email & password yang masih tersimpan di state form
            const res = await axios.post(`${API_BASE_URL}/auth/regenerate`, { email, password });
            
            // Update tampilan dengan data baru
            setUserData(res.data.data);
            alert("Berhasil! API Key baru telah dibuat.");
        } catch (err) {
            alert("Gagal reset key: " + (err.response?.data?.message || "Server Error"));
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        setUserData(null);
        setEmail('');
        setPassword('');
        setName('');
    };

    return (
        <div className="bg-dark min-vh-100 text-light font-monospace">
            {/* Navbar */}
            <Navbar bg="black" variant="dark" className="border-bottom border-secondary px-3">
                <Navbar.Brand as={Link} to="/" className="fw-bold text-success">
                    &larr; NusaNutrisi
                </Navbar.Brand>
                <Nav className="ms-auto">
                    <Nav.Link href="http://localhost:3000/api-docs" target="_blank">Docs</Nav.Link>
                    {userData && (
                        <Button variant="outline-danger" size="sm" onClick={handleLogout} className="ms-3">
                            Logout
                        </Button>
                    )}
                </Nav>
            </Navbar>

            <Container className="py-5">
                <Row className="justify-content-center">
                    <Col md={6} lg={5}>
                        
                        <div className="text-center mb-4">
                            <h2 className="fw-bold text-white">Developer Console</h2>
                            <p className="text-secondary small">Manage your API Keys and usage.</p>
                        </div>

                        {/* KONDISI 1: SUDAH LOGIN */}
                        {userData ? (
                            <Card className="bg-black text-light border-success shadow-lg">
                                <Card.Body className="p-4 text-center">
                                    <div className="mb-3">
                                        <span className="display-4">👋</span>
                                    </div>
                                    <h4 className="text-success fw-bold">Welcome, {userData.name}</h4>
                                    <p className="text-light small">API Key Aktif Anda:</p>
                                    
                                    <div className="bg-dark p-3 rounded border border-secondary d-flex justify-content-between align-items-center my-3">
                                        <code className="text-warning user-select-all">{userData.api_key}</code>
                                        <Button size="sm" variant="outline-light" onClick={() => navigator.clipboard.writeText(userData.api_key)}>
                                            Copy
                                        </Button>
                                    </div>

                                    <div className="row g-2 mt-4">
                                        <div className="col-6">
                                            <div className="p-2 border border-secondary rounded bg-dark">
                                                <small className="text-light d-block">Quota</small>
                                                <strong>{userData.quota}</strong>
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div className="p-2 border border-secondary rounded bg-dark">
                                                <small className="text-light d-block">Status</small>
                                                <strong className="text-success">Active</strong>
                                            </div>
                                        </div>
                                    </div>

                                    {/* TOMBOL REGENERATE BARU */}
                                    <div className="mt-4 pt-3 border-top border-secondary">
                                        <Button 
                                            variant="outline-warning" 
                                            size="sm" 
                                            className="w-100"
                                            onClick={handleRegenerate}
                                            disabled={loading}
                                        >
                                            {loading ? 'Processing...' : '🔄 Generate New Key (Reset Quota)'}
                                        </Button>
                                        <p className="text-secondary mt-2" style={{fontSize: '0.7rem'}}>
                                            *Key lama akan hangus. Quota kembali ke 1000.
                                        </p>
                                    </div>

                                </Card.Body>
                            </Card>

                        ) : (
                            /* KONDISI 2: BELUM LOGIN */
                            <Card className="bg-black text-light border-secondary shadow">
                                <Card.Header className="bg-dark border-secondary d-flex justify-content-center p-0">
                                    <button 
                                        className={`btn flex-fill rounded-0 py-3 ${!isLoginMode ? 'btn-success fw-bold' : 'text-secondary btn-dark'}`}
                                        onClick={() => { setIsLoginMode(false); setError(null); }}
                                    >
                                        Register
                                    </button>
                                    <button 
                                        className={`btn flex-fill rounded-0 py-3 ${isLoginMode ? 'btn-success fw-bold' : 'text-secondary btn-dark'}`}
                                        onClick={() => { setIsLoginMode(true); setError(null); }}
                                    >
                                        Login
                                    </button>
                                </Card.Header>

                                <Card.Body className="p-4">
                                    {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}
                                    
                                    <Form onSubmit={handleSubmit}>
                                        {!isLoginMode && (
                                            <Form.Group className="mb-3">
                                                <Form.Label className="fw-bold text-light">Full Name</Form.Label>
                                                <Form.Control 
                                                    type="text" 
                                                    className="bg-dark text-light border-secondary"
                                                    style={{color: 'white'}}
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    required
                                                />
                                            </Form.Group>
                                        )}

                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-bold text-light">Email Address</Form.Label>
                                            <Form.Control 
                                                type="email" 
                                                className="bg-dark text-light border-secondary"
                                                style={{color: 'white'}}
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-4">
                                            <Form.Label className="fw-bold text-light">Password</Form.Label>
                                            <Form.Control 
                                                type="password" 
                                                className="bg-dark text-light border-secondary"
                                                style={{color: 'white'}}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                            />
                                        </Form.Group>

                                        <Button 
                                            variant="light" 
                                            type="submit" 
                                            className="w-100 fw-bold py-2"
                                            disabled={loading}
                                        >
                                            {loading ? 'Processing...' : (isLoginMode ? 'Access Console' : 'Create Account')}
                                        </Button>
                                    </Form>
                                </Card.Body>
                            </Card>
                        )}
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Dashboard;
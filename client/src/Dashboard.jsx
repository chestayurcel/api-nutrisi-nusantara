import { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Card, Button, Row, Col, Navbar, Nav, Form, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:3000/api/v1';

function Dashboard() {
    const navigate = useNavigate();

    // 1. Ambil data user dari LocalStorage
    // (Data ini tersimpan saat login di AuthPage)
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user_data')));
    
    // State untuk fitur Regenerate Key
    const [showRegenerateForm, setShowRegenerateForm] = useState(false);
    const [regenEmail, setRegenEmail] = useState('');
    const [regenPassword, setRegenPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null); // Untuk notifikasi sukses/gagal

    // 2. Cek apakah user sudah login
    useEffect(() => {
        if (!user) {
            navigate('/auth');
        }
    }, [user, navigate]);

    const handleLogout = () => {
        if (window.confirm('Keluar dari Developer Console?')) {
            localStorage.removeItem('user_data');
            navigate('/');
        }
    };

    // 3. Fungsi Reset API Key (Panggil Endpoint /regenerate)
    const handleRegenerate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const res = await axios.post(`${API_BASE_URL}/auth/regenerate`, {
                email: regenEmail,
                password: regenPassword
            });

            // Jika sukses:
            // 1. Update data user di State & LocalStorage dengan data baru (Key baru)
            const newUser = { ...user, api_key: res.data.data.api_key, quota: 1000 };
            setUser(newUser);
            localStorage.setItem('user_data', JSON.stringify(newUser));

            // 2. Reset Form
            setMessage({ type: 'success', text: 'Berhasil! API Key baru telah aktif.' });
            setShowRegenerateForm(false);
            setRegenEmail('');
            setRegenPassword('');

        } catch (err) {
            setMessage({ type: 'danger', text: err.response?.data?.message || 'Gagal mereset key.' });
        } finally {
            setLoading(false);
        }
    };

    // Jika user null (sedang redirect), jangan tampilkan apa-apa
    if (!user) return null;

    return (
        <div className="bg-soft min-vh-100 font-sans">
            
            {/* --- NAVBAR --- */}
            <Navbar className="nav-luxury sticky-top py-3 mb-5 border-bottom">
                <Container>
                    <Navbar.Brand as={Link} to="/gallery" className="fw-bold text-emerald">
                        &larr; Kembali ke Galeri
                    </Navbar.Brand>
                    <Nav className="ms-auto align-items-center">
                        <Button variant="link" className="text-danger text-decoration-none small fw-bold" onClick={handleLogout}>
                            Logout
                        </Button>
                    </Nav>
                </Container>
            </Navbar>

            {/* --- KONTEN DASHBOARD --- */}
            <Container>
                <Row className="justify-content-center">
                    <Col md={8} lg={6}>
                        
                        {/* Header Profile */}
                        <div className="text-center mb-5">
                            <div className="bg-emerald text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3 shadow" style={{width:'80px', height:'80px', fontSize:'2rem'}}>
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <h2 className="fw-bold text-dark">Developer Console</h2>
                            <p className="text-muted">Kelola akses API dan pantau penggunaan kuota Anda.</p>
                        </div>

                        {/* Pesan Notifikasi (Jika ada) */}
                        {message && (
                            <Alert variant={message.type} onClose={() => setMessage(null)} dismissible>
                                {message.text}
                            </Alert>
                        )}

                        {/* KARTU API KEY UTAMA */}
                        <Card className="card-luxury mb-4 border-0">
                            <Card.Body className="p-4">
                                <h5 className="fw-bold text-emerald mb-3">🔑 API Key Aktif</h5>
                                <div className="p-3 bg-light rounded border border-secondary border-opacity-25 d-flex align-items-center justify-content-between">
                                    <code className="text-dark fs-6 user-select-all text-break me-2">
                                        {user.api_key}
                                    </code>
                                    <Button 
                                        size="sm" 
                                        variant="outline-success" 
                                        className="rounded-pill px-3"
                                        onClick={() => {
                                            navigator.clipboard.writeText(user.api_key);
                                            alert('API Key disalin!');
                                        }}
                                    >
                                        Copy
                                    </Button>
                                </div>
                                <div className="mt-3 text-muted small">
                                    <i className="bi bi-info-circle me-1"></i>
                                    Gunakan key ini pada header <code>x-api-key</code> di setiap request.
                                </div>
                            </Card.Body>
                        </Card>

                        {/* STATUS KUOTA */}
                        <Row className="g-4 mb-4">
                            <Col xs={6}>
                                <Card className="card-luxury h-100 border-0 text-center py-3">
                                    <Card.Body>
                                        <small className="text-muted text-uppercase ls-1">Sisa Kuota</small>
                                        <h2 className={`fw-bold mt-2 ${user.quota < 100 ? 'text-danger' : 'text-dark'}`}>
                                            {user.quota}
                                        </h2>
                                        <small className="text-muted">Request / hari</small>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col xs={6}>
                                <Card className="card-luxury h-100 border-0 text-center py-3">
                                    <Card.Body>
                                        <small className="text-muted text-uppercase ls-1">Status Akun</small>
                                        <h2 className="fw-bold text-success mt-2">Active</h2>
                                        <small className="text-muted">Free Tier</small>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>

                        {/* DANGER ZONE (RESET KEY) */}
                        <Card className="border border-danger border-opacity-25 bg-white shadow-sm">
                            <Card.Body className="p-4">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h6 className="fw-bold text-danger mb-1">Reset API Key & Kuota</h6>
                                        <p className="text-muted small mb-0">Jika kuota habis atau key bocor.</p>
                                    </div>
                                    {!showRegenerateForm && (
                                        <Button 
                                            variant="outline-danger" 
                                            size="sm" 
                                            className="rounded-pill"
                                            onClick={() => setShowRegenerateForm(true)}
                                        >
                                            Reset Sekarang
                                        </Button>
                                    )}
                                </div>

                                {/* Form Konfirmasi Reset */}
                                {showRegenerateForm && (
                                    <div className="mt-4 pt-3 border-top">
                                        <p className="small text-muted mb-3">
                                            Masukkan kredensial Anda untuk konfirmasi. 
                                            <strong className="text-danger"> Key lama akan hangus.</strong>
                                        </p>
                                        <Form onSubmit={handleRegenerate}>
                                            <Form.Group className="mb-2">
                                                <Form.Control 
                                                    type="email" 
                                                    placeholder="Email terdaftar" 
                                                    className="bg-light"
                                                    value={regenEmail}
                                                    onChange={e => setRegenEmail(e.target.value)}
                                                    required
                                                />
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Control 
                                                    type="password" 
                                                    placeholder="Password" 
                                                    className="bg-light"
                                                    value={regenPassword}
                                                    onChange={e => setRegenPassword(e.target.value)}
                                                    required
                                                />
                                            </Form.Group>
                                            <div className="d-flex gap-2">
                                                <Button type="submit" variant="danger" size="sm" className="px-4" disabled={loading}>
                                                    {loading ? <Spinner animation="border" size="sm"/> : 'Konfirmasi Reset'}
                                                </Button>
                                                <Button 
                                                    variant="secondary" 
                                                    size="sm" 
                                                    onClick={() => setShowRegenerateForm(false)}
                                                >
                                                    Batal
                                                </Button>
                                            </div>
                                        </Form>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>

                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Dashboard;
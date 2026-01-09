import { useState } from 'react';
import axios from 'axios';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Navigation from './components/Navigation';

const API_BASE_URL = 'http://localhost:3000/api/v1';

function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const endpoint = isLogin ? '/auth/login' : '/auth/register';
            const payload = isLogin ? { email, password } : { name, email, password };

            const res = await axios.post(`${API_BASE_URL}${endpoint}`, payload);
            
            // Simpan data user (termasuk API Key) ke LocalStorage
            localStorage.setItem('user_data', JSON.stringify(res.data.data));

            // Redirect ke halaman Galeri
            navigate('/gallery');
            
        } catch (err) {
            setError(err.response?.data?.message || 'Terjadi kesalahan');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-soft min-vh-100 d-flex flex-column">
            <Navigation />

            <Container className="py-5 mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-5">
                        <Card className="card-luxury p-4">
                            <div className="text-center mb-4">
                                <h3 className="fw-bold text-emerald">{isLogin ? 'Selamat Datang' : 'Buat Akun Baru'}</h3>
                                <p className="text-muted small">Akses ribuan data kuliner premium.</p>
                            </div>

                            {error && <Alert variant="danger">{error}</Alert>}

                            <Form onSubmit={handleSubmit}>
                                {!isLogin && (
                                    <Form.Group className="mb-3">
                                        <Form.Label>Nama Lengkap</Form.Label>
                                        <Form.Control type="text" value={name} onChange={e => setName(e.target.value)} required />
                                    </Form.Group>
                                )}
                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                                </Form.Group>
                                <Form.Group className="mb-4">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                                </Form.Group>

                                <Button type="submit" className="btn-luxury w-100 mb-3" disabled={loading}>
                                    {loading ? 'Memproses...' : (isLogin ? 'Masuk Sekarang' : 'Daftar Gratis')}
                                </Button>
                            </Form>

                            <div className="text-center">
                                <button className="btn btn-link text-muted text-decoration-none" onClick={() => setIsLogin(!isLogin)}>
                                    {isLogin ? 'Belum punya akun? Daftar' : 'Sudah punya akun? Login'}
                                </button>
                            </div>
                        </Card>
                    </div>
                </div>
            </Container>
        </div>
    );
}

export default AuthPage;
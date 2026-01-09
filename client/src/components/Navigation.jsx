import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function Navigation() {
    const navigate = useNavigate();
    const location = useLocation();

    // 1. Cek User Login dari LocalStorage
    const user = JSON.parse(localStorage.getItem('user_data'));

    // 2. Fungsi Logout
    const handleLogout = () => {
        if (window.confirm('Yakin ingin keluar?')) {
            localStorage.removeItem('user_data');
            navigate('/');
        }
    };

    // 3. Tentukan apakah kita di halaman Auth (Login/Register)
    // Jika di halaman auth, kita sembunyikan tombol-tombol agar bersih
    const isAuthPage = location.pathname === '/auth';

    return (
        <Navbar 
            expand="lg" 
            className="bg-white shadow-sm border-bottom sticky-top" 
            style={{ zIndex: 1030 }} // Pastikan layer paling atas
        >
            <Container>
                {/* Logo Brand */}
                <Navbar.Brand as={Link} to="/" className="fw-bold text-emerald fs-4 d-flex align-items-center">
                    🥗 NusaNutrisi
                    {/* Badge Kecil jika User Login */}
                    {user && <span className="badge bg-success bg-opacity-10 text-success fs-6 fw-normal ms-2 rounded-pill px-2 py-1 border border-success border-opacity-25" style={{fontSize: '0.7rem'}}>Pro</span>}
                </Navbar.Brand>

                {/* Toggle Mobile Menu */}
                <Navbar.Toggle aria-controls="basic-navbar-nav" />

                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto align-items-center gap-2">
                        
                        {/* SKENARIO 1: HALAMAN AUTH (LOGIN/REGISTER) */}
                        {isAuthPage ? (
                             <span className="text-muted small">Gerbang Data Kuliner</span>
                        ) : (
                            /* SKENARIO 2: USER SUDAH LOGIN */
                            user ? (
                                <>
                                    <span className="text-secondary d-none d-lg-block small me-2">
                                        Halo, <strong>{user.name.split(' ')[0]}</strong>
                                    </span>
                                    
                                    <Link to="/gallery" className={`btn btn-sm ${location.pathname === '/gallery' ? 'btn-success' : 'btn-outline-success border-0'}`}>
                                        Galeri
                                    </Link>
                                    
                                    <Link to="/console" className={`btn btn-sm ${location.pathname === '/console' ? 'btn-success' : 'btn-outline-success border-0'}`}>
                                        Console
                                    </Link>
                                    
                                    <Button 
                                        variant="link" 
                                        className="text-danger text-decoration-none fw-bold small" 
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                /* SKENARIO 3: USER BELUM LOGIN (PUBLIC) */
                                <>
                                    <Link to="/auth" className="btn btn-luxury btn-sm px-4 shadow-sm">
                                        Masuk / Daftar
                                    </Link>
                                </>
                            )
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Navigation;
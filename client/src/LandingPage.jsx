import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Navigation from './components/Navigation';
import CalculatorDemo from './components/CalculatorDemo';

function LandingPage() {
    return (
        <div className="bg-white min-vh-100 d-flex flex-column">
            
            <Navigation />

            {/* --- HERO SECTION --- */}
            <Container className="flex-grow-1 d-flex align-items-center py-5 mt-4 pt-4">
                <Row className="align-items-center w-100">
                    <Col md={6} className="mb-4 mb-md-0">
                        <BadgeHighlight text="v1.0 Public Release" />
                        <h1 className="display-4 fw-bold text-dark mb-3 mt-3">
                            Satu API untuk Ribuan <br />
                            <span className="text-emerald">Resep & Nutrisi.</span>
                        </h1>
                        <p className="lead text-secondary mb-4" style={{lineHeight: '1.6'}}>
                            Bangun aplikasi kesehatan atau kuliner Anda lebih cepat dengan database resep Nusantara yang terverifikasi dan kalkulasi gizi otomatis.
                        </p>
                        
                        <div className="d-flex flex-wrap gap-3">
                            <Link to="/auth" className="btn btn-luxury btn-lg shadow px-5">
                                Coba Gratis
                            </Link>
                            
                            <a href="" target="_blank" rel="noreferrer" className="btn btn-outline-success btn-lg rounded-pill px-4">
                                Baca Dokumentasi ↗
                            </a>
                        </div>
                        
                        <p className="mt-4 small text-muted">
                            <i className="bi bi-check-circle-fill text-success me-2"></i>
                            Gratis 1.000 request/hari &bull; Tidak perlu kartu kredit
                        </p>
                    </Col>
                    
                    <Col md={6} className="text-center position-relative">
                        {/* Komponen Kalkulator Demo */}
                        <div className="p-md-4 position-relative" style={{zIndex: 2}}>
                            <CalculatorDemo />
                        </div>
                    </Col>
                </Row>
            </Container>

            {/* --- FITUR HIGHLIGHTS --- */}
            <div className="bg-soft py-5 border-top border-light">
                <Container>
                    <div className="text-center mb-5">
                        <small className="text-emerald fw-bold text-uppercase ls-1">Kenapa NusaNutrisi?</small>
                        <h2 className="fw-bold mt-2">Infrastruktur Data Kuliner Modern</h2>
                    </div>
                    <Row className="g-4">
                        <FeatureCard 
                            icon="🍲" 
                            title="Database Autentik" 
                            desc="Resep asli Indonesia dari Sabang sampai Merauke yang telah dikurasi oleh ahli kuliner."
                        />
                        <FeatureCard 
                            icon="⚡" 
                            title="Low Latency API" 
                            desc="Response time rata-rata di bawah 100ms. Cocok untuk aplikasi mobile dan web real-time."
                        />
                        <FeatureCard 
                            icon="🔒" 
                            title="Keamanan Terjamin" 
                            desc="Akses aman menggunakan API Key mechanism dan rate limiting untuk melindungi aplikasi Anda."
                        />
                    </Row>
                </Container>
            </div>
            
            <footer className="text-center py-4 bg-white border-top text-muted small">
                <Container>
                    &copy; 2026 NusaNutrisi API. Dibuat dengan ❤️ untuk developer Indonesia.
                </Container>
            </footer>
        </div>
    );
}

function BadgeHighlight({ text }) {
    return (
        <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 rounded-pill px-3 py-2 mb-3 fw-normal">
            ✨ {text}
        </span>
    );
}

function FeatureCard({ icon, title, desc }) {
    return (
        <Col md={4}>
            <Card className="h-100 card-luxury p-4 border-0 bg-white">
                <div className="bg-soft rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width:'60px', height:'60px', fontSize:'1.5rem'}}>
                    {icon}
                </div>
                <h5 className="fw-bold mb-2">{title}</h5>
                <p className="text-muted small mb-0">{desc}</p>
            </Card>
        </Col>
    );
}

export default LandingPage;
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Modal, Spinner, Navbar, Nav, Form, InputGroup, Badge, ListGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:3000/api/v1';

function Gallery() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // State Modal Detail
  const [showModal, setShowModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  
  const navigate = useNavigate();

  // 1. Ambil data user dari LocalStorage (Simulasi Sesi Login)
  // Data ini didapat saat user berhasil Login/Register di halaman Auth
  const user = JSON.parse(localStorage.getItem('user_data'));

  // 2. Cek Login & Fetch Data
  useEffect(() => {
    // Jika user belum login, tendang ke halaman Auth
    if (!user) {
        navigate('/auth'); 
        return;
    }
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      // Request ke Backend menggunakan API Key milik User yang sedang login
      const response = await axios.get(`${API_BASE_URL}/recipes`, {
        headers: { 'x-api-key': user.api_key }
      });
      setRecipes(response.data.data);
      setLoading(false);
    } catch (err) {
      console.error("Gagal mengambil data:", err);
      // Jika error 401/403 (Key tidak valid/habis), logout paksa
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          alert("Sesi habis atau kuota API Key Anda habis. Silakan login ulang.");
          localStorage.removeItem('user_data');
          navigate('/auth');
      }
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if(window.confirm('Yakin ingin keluar?')) {
        localStorage.removeItem('user_data');
        navigate('/');
    }
  };

  // Logic Modal Detail
  const handleShowDetail = async (id) => {
    try {
      // Ambil detail lengkap (termasuk ingredients)
      const response = await axios.get(`${API_BASE_URL}/recipes/${id}`, {
        headers: { 'x-api-key': user.api_key }
      });
      setSelectedRecipe(response.data.data);
      setShowModal(true);
    } catch (error) { 
        alert("Gagal memuat detail resep. Cek koneksi server."); 
    }
  };

  // Logic Pencarian (Filter Lokal)
  const filteredRecipes = recipes.filter(recipe => 
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-soft min-vh-100 font-sans">
      
      {/* --- NAVBAR PREMIUM --- */}
      <Navbar className="nav-luxury sticky-top py-3 mb-5 border-bottom">
        <Container>
            <Navbar.Brand className="fw-bold text-emerald fs-4">
                🥗 NusaNutrisi <span className="text-muted fs-6 fw-normal">| Premium Gallery</span>
            </Navbar.Brand>
            <Nav className="ms-auto align-items-center gap-3">
                <span className="text-secondary d-none d-md-block small">
                    Halo, <strong>{user?.name}</strong>
                </span>
                <Link to="/console" className="btn btn-outline-success rounded-pill btn-sm px-3">
                    Developer Console
                </Link>
                <Button variant="link" className="text-danger text-decoration-none fw-bold small" onClick={handleLogout}>
                    Logout
                </Button>
            </Nav>
        </Container>
      </Navbar>

      {/* --- KONTEN UTAMA --- */}
      <Container>
        
        {/* Header Section */}
        <div className="text-center mb-5">
            <h2 className="fw-bold text-dark display-6">Koleksi Resep Nusantara</h2>
            <p className="text-muted">Akses data kuliner eksklusif dengan rincian nutrisi presisi.</p>
            
            {/* Search Bar Mewah */}
            <Row className="justify-content-center mt-4">
                <Col md={6}>
                    <InputGroup className="shadow-sm rounded-pill overflow-hidden border">
                        <InputGroup.Text className="bg-white border-0 ps-4">
                            🔍
                        </InputGroup.Text>
                        <Form.Control
                            placeholder="Cari resep (misal: Rendang, Soto)..."
                            className="border-0 py-3"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{boxShadow: 'none'}}
                        />
                    </InputGroup>
                </Col>
            </Row>
        </div>

        {/* Loading Spinner */}
        {loading && (
            <div className="text-center py-5">
                <Spinner animation="border" variant="success" />
                <p className="mt-2 text-muted">Sedang mengambil data dari server...</p>
            </div>
        )}

        {/* State Data Kosong */}
        {!loading && filteredRecipes.length === 0 && (
            <div className="text-center py-5">
                <h3 className="text-muted">🍲</h3>
                <p className="text-secondary">Tidak ada resep yang ditemukan.</p>
            </div>
        )}

        {/* Grid Kartu Resep */}
        <Row xs={1} md={2} lg={3} className="g-4 pb-5">
          {filteredRecipes.map((recipe) => (
            <Col key={recipe.id}>
              <Card className="h-100 card-luxury border-0">
                <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
                    <Card.Img 
                        variant="top" 
                        src={recipe.image_url} 
                        style={{width:'100%', height:'100%', objectFit:'cover'}} 
                    />
                    <div className="position-absolute top-0 end-0 m-3">
                        <Badge bg="light" text="dark" className="shadow-sm">
                            🔥 {recipe.total_calories || 0} kkal
                        </Badge>
                    </div>
                </div>
                <Card.Body className="d-flex flex-column p-4">
                  <Card.Title className="fw-bold text-dark mb-2">{recipe.title}</Card.Title>
                  <Card.Text className="text-muted small flex-grow-1" style={{lineHeight: '1.6'}}>
                    {recipe.description.length > 80 
                        ? recipe.description.substring(0, 80) + '...' 
                        : recipe.description}
                  </Card.Text>
                  <Button 
                    variant="success" 
                    className="w-100 rounded-pill mt-3 btn-luxury shadow-sm" 
                    onClick={() => handleShowDetail(recipe.id)}
                  >
                    Lihat Detail Resep
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* --- MODAL DETAIL RESEP --- */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        {selectedRecipe && (
            <>
                <Modal.Header closeButton className="border-0 pb-0">
                    {/* Header kosong agar lebih bersih */}
                </Modal.Header>
                <Modal.Body className="px-4 pb-4">
                    <Row>
                        {/* Kolom Kiri: Gambar & Instruksi */}
                        <Col md={6}>
                            <h3 className="fw-bold text-emerald mb-3">{selectedRecipe.title}</h3>
                            <img 
                                src={selectedRecipe.image_url} 
                                className="img-fluid rounded-4 shadow-sm mb-4 w-100" 
                                alt={selectedRecipe.title} 
                            />
                            <h6 className="fw-bold text-dark">Cara Memasak:</h6>
                            <div className="p-3 bg-light rounded-3 border border-light">
                                <p style={{whiteSpace: 'pre-line', fontSize: '0.9rem', marginBottom: 0, color: '#4b5563'}}>
                                    {selectedRecipe.instructions}
                                </p>
                            </div>
                        </Col>

                        {/* Kolom Kanan: Nutrisi & Bahan */}
                        <Col md={6} className="mt-4 mt-md-0">
                            {/* Card Nutrisi Highlight */}
                            <Card className="bg-emerald text-white mb-4 border-0 rounded-4 shadow-sm" 
                                  style={{background: 'linear-gradient(135deg, #064e3b 0%, #10b981 100%)'}}>
                                <Card.Body className="text-center py-4">
                                    <h6 className="opacity-75 mb-1 text-uppercase small ls-1">Total Energi</h6>
                                    <h1 className="fw-bold display-4 mb-0">
                                        {selectedRecipe.total_nutrition_per_serving.calories}
                                        <span className="fs-6 fw-normal"> kkal</span>
                                    </h1>
                                    <div className="d-flex justify-content-center gap-4 mt-3 pt-3 border-top border-white border-opacity-25">
                                        <div>
                                            <small className="d-block opacity-75">Protein</small>
                                            <strong>{selectedRecipe.total_nutrition_per_serving.protein}g</strong>
                                        </div>
                                        <div>
                                            <small className="d-block opacity-75">Karbo</small>
                                            <strong>{selectedRecipe.total_nutrition_per_serving.carbs}g</strong>
                                        </div>
                                        <div>
                                            <small className="d-block opacity-75">Lemak</small>
                                            <strong>{selectedRecipe.total_nutrition_per_serving.fats}g</strong>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>

                            <h6 className="fw-bold mb-3">Rincian Bahan:</h6>
                            <ListGroup variant="flush" className="small">
                                {selectedRecipe.ingredients.map((item, idx) => (
                                    <ListGroup.Item key={idx} className="d-flex justify-content-between align-items-center px-0 border-bottom">
                                        <div>
                                            <i className="bi bi-dot text-success me-1"></i>
                                            <strong>{item.ingredient_name}</strong>
                                            <span className="text-muted ms-1">({item.quantity})</span>
                                        </div>
                                        <Badge bg="light" text="dark" className="border">
                                            {item.notes}
                                        </Badge>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer className="border-0 pt-0">
                    <Button variant="secondary" onClick={() => setShowModal(false)} className="rounded-pill px-4">
                        Tutup
                    </Button>
                </Modal.Footer>
            </>
        )}
      </Modal>
    </div>
  );
}

export default Gallery;
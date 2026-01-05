import { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Modal, Spinner, Badge, ListGroup, Form, InputGroup } from 'react-bootstrap';

// Konfigurasi API
const API_BASE_URL = 'http://localhost:3000/api/v1';
// PENTING: Gunakan salah satu API Key yang valid dari database Anda
const API_KEY = 'SECRET-KEY-12345'; 

function Gallery() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fitur Pencarian
  const [searchTerm, setSearchTerm] = useState('');
  
  // State Modal Detail
  const [showModal, setShowModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // 1. Fetch Data saat Aplikasi dimuat
  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      // Request ke Backend
      const response = await axios.get(`${API_BASE_URL}/recipes`, {
        headers: { 'x-api-key': API_KEY }
      });
      setRecipes(response.data.data);
      setLoading(false);
    } catch (err) {
      console.error("Gagal mengambil data:", err);
      setError("Gagal memuat resep. Pastikan server backend menyala.");
      setLoading(false);
    }
  };

  // 2. Fetch Detail Resep saat tombol diklik
  const handleShowDetail = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/recipes/${id}`, {
        headers: { 'x-api-key': API_KEY }
      });
      setSelectedRecipe(response.data.data);
      setShowModal(true);
    } catch (error) {
      alert("Gagal memuat detail resep");
    }
  };

  // Logic Filter Pencarian
  const filteredRecipes = recipes.filter(recipe => 
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* --- HERO SECTION (BANNER ATAS) --- */}
      <div className="hero-section text-center">
        <Container>
            <h1 className="display-4 fw-bold mb-3">Jelajahi Cita Rasa Nusantara</h1>
            <p className="lead mb-4 opacity-75">
                Koleksi resep masakan tradisional Indonesia lengkap dengan informasi nilai gizi akurat.
            </p>
            
            {/* Search Bar */}
            <Row className="justify-content-center">
                <Col md={6}>
                    <InputGroup className="mb-3">
                        <Form.Control
                            placeholder="Cari resep (misal: Soto, Rendang)..."
                            className="search-input text-dark"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </InputGroup>
                </Col>
            </Row>
        </Container>
      </div>

      {/* --- CONTENT UTAMA --- */}
      <Container className="mb-5" style={{ minHeight: '50vh' }}>
        
        {/* State: Loading */}
        {loading && (
          <div className="text-center py-5">
            <Spinner animation="grow" variant="success" />
            <p className="mt-3 text-muted">Sedang menyiapkan bahan-bahan...</p>
          </div>
        )}

        {/* State: Error */}
        {error && (
            <div className="alert alert-danger text-center shadow-sm border-0">
                <strong>Terjadi Kesalahan:</strong> {error}
            </div>
        )}

        {/* State: Data Kosong (Hasil Search Nihil) */}
        {!loading && !error && filteredRecipes.length === 0 && (
            <div className="text-center py-5">
                <h3>🍲</h3>
                <h5 className="text-muted">Resep tidak ditemukan</h5>
                <p>Coba kata kunci lain.</p>
            </div>
        )}

        {/* GRID RESEP */}
        <Row xs={1} md={2} lg={3} className="g-4">
          {filteredRecipes.map((recipe) => (
            <Col key={recipe.id}>
              <Card className="h-100 shadow-sm hover-card bg-white">
                <div style={{ overflow: 'hidden', height: '220px' }}>
                    <Card.Img 
                      variant="top" 
                      src={recipe.image_url} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                </div>
                <Card.Body className="d-flex flex-column">
                  <div className="mb-2">
                    <Badge bg="success" className="me-2">Resep Asli</Badge>
                    <Badge bg="light" text="dark" className="border">
                        {recipe.total_calories ? `± ${recipe.total_calories} kkal` : 'Info Gizi Tersedia'}
                    </Badge>
                  </div>
                  <Card.Title className="fw-bold text-dark">{recipe.title}</Card.Title>
                  <Card.Text className="text-secondary small flex-grow-1">
                    {recipe.description.length > 80 
                        ? recipe.description.substring(0, 80) + '...' 
                        : recipe.description}
                  </Card.Text>
                  <Button 
                    variant="outline-success" 
                    className="w-100 mt-3 rounded-pill fw-bold"
                    onClick={() => handleShowDetail(recipe.id)}
                  >
                    Lihat Resep & Nutrisi
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* --- FOOTER SIMPLE --- */}
      <footer className="bg-light text-center py-4 mt-auto border-top">
        <Container>
            <p className="text-muted small mb-0">
                &copy; 2024 NusaNutrisi API. Dibuat untuk melestarikan kuliner Indonesia.
            </p>
        </Container>
      </footer>

      {/* --- MODAL DETAIL (Sama seperti sebelumnya tapi dirapikan) --- */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        {selectedRecipe && (
          <>
            <Modal.Header closeButton className="border-0">
              <Modal.Title className="fw-bold text-success">{selectedRecipe.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="px-4 pb-4">
              <Row>
                <Col md={6} className="mb-3">
                  <img 
                    src={selectedRecipe.image_url} 
                    className="img-fluid rounded-4 shadow-sm mb-3 w-100" 
                    alt={selectedRecipe.title} 
                  />
                  <h6 className="fw-bold">Cara Memasak:</h6>
                  <div className="p-3 bg-light rounded-3 border">
                    <p style={{ whiteSpace: 'pre-line', fontSize: '0.9rem', marginBottom: 0 }}>
                        {selectedRecipe.instructions}
                    </p>
                  </div>
                </Col>

                <Col md={6}>
                  {/* Card Nutrisi Highlight */}
                  <Card className="border-success mb-3 bg-success bg-opacity-10">
                    <Card.Body>
                      <h6 className="fw-bold text-success mb-3">Informasi Nilai Gizi (Per Porsi)</h6>
                      <div className="d-flex justify-content-between mb-2 border-bottom border-success border-opacity-25 pb-1">
                        <span>🔥 Kalori Total</span>
                        <strong className="text-success">{selectedRecipe.total_nutrition_per_serving.calories} kkal</strong>
                      </div>
                      <div className="row text-center mt-3">
                          <div className="col-4">
                              <small className="d-block text-muted">Protein</small>
                              <strong>{selectedRecipe.total_nutrition_per_serving.protein}g</strong>
                          </div>
                          <div className="col-4 border-start border-end border-success border-opacity-25">
                              <small className="d-block text-muted">Karbo</small>
                              <strong>{selectedRecipe.total_nutrition_per_serving.carbs}g</strong>
                          </div>
                          <div className="col-4">
                              <small className="d-block text-muted">Lemak</small>
                              <strong>{selectedRecipe.total_nutrition_per_serving.fats}g</strong>
                          </div>
                      </div>
                    </Card.Body>
                  </Card>

                  <h6 className="fw-bold mt-4">Bahan-bahan:</h6>
                  <ListGroup variant="flush" className="small">
                    {selectedRecipe.ingredients.map((item, idx) => (
                      <ListGroup.Item key={idx} className="d-flex justify-content-between align-items-center px-0 border-bottom">
                        <div>
                          <i className="bi bi-circle-fill text-success me-2" style={{fontSize: '5px'}}></i>
                          <strong>{item.ingredient_name}</strong>
                          <span className="text-muted ms-1">({item.quantity})</span>
                          <div className="text-muted fst-italic ms-3" style={{fontSize: '0.85em'}}>
                             {item.notes}
                          </div>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer className="border-0">
              <Button variant="secondary" onClick={() => setShowModal(false)} className="rounded-pill px-4">
                Tutup
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </>
  );
}

export default Gallery;
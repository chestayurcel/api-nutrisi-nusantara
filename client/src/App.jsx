import { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Navbar, Row, Col, Card, Button, Modal, Spinner, Badge, ListGroup } from 'react-bootstrap';

const API_BASE_URL = 'http://localhost:3000/api/v1';
const API_KEY = 'SECRET-KEY-12345';

function App() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // 1. Fetch Data saat Aplikasi dimuat
  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/recipes`, {
        headers: { 'x-api-key': API_KEY }
      });
      setRecipes(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
      setLoading(false);
    }
  };

  // 2. Fetch Detail Resep saat tombol diklik
  const handleShowDetail = async (id) => {
    try {
      // Tampilkan modal loading dulu (opsional) atau langsung fetch
      const response = await axios.get(`${API_BASE_URL}/recipes/${id}`, {
        headers: { 'x-api-key': API_KEY }
      });
      setSelectedRecipe(response.data.data);
      setShowModal(true);
    } catch (error) {
      alert("Gagal memuat detail resep");
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedRecipe(null);
  };

  return (
    <div className="bg-light min-vh-100">
      {/* --- Navbar --- */}
      <Navbar bg="success" variant="dark" className="shadow-sm mb-4">
        <Container>
          <Navbar.Brand href="#home" className="fw-bold">🥗 NusaNutrisi React</Navbar.Brand>
        </Container>
      </Navbar>

      {/* --- Content Utama --- */}
      <Container>
        <div className="text-center mb-5">
          <h1 className="fw-bold text-dark">Galeri Resep Nusantara</h1>
          <p className="text-muted">Integrasi React Frontend + Node.js Backend</p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="success" />
            <p className="mt-2">Sedang mengambil data dari dapur...</p>
          </div>
        ) : (
          /* Grid Resep */
          <Row xs={1} md={3} className="g-4">
            {recipes.map((recipe) => (
              <Col key={recipe.id}>
                <Card className="h-100 shadow-sm border-0 hover-effect">
                  <Card.Img 
                    variant="top" 
                    src={recipe.image_url} 
                    style={{ height: '200px', objectFit: 'cover' }} 
                  />
                  <Card.Body>
                    <Card.Title className="fw-bold">{recipe.title}</Card.Title>
                    <Card.Text className="text-truncate text-muted">
                      {recipe.description}
                    </Card.Text>
                    <Button 
                      variant="outline-success" 
                      className="w-100 mt-2"
                      onClick={() => handleShowDetail(recipe.id)}
                    >
                      Lihat Detail & Nutrisi
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>

      {/* --- Modal Detail Resep --- */}
      <Modal show={showModal} onHide={handleClose} size="lg" centered>
        {selectedRecipe && (
          <>
            <Modal.Header closeButton className="bg-success text-white">
              <Modal.Title>{selectedRecipe.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row>
                {/* Kolom Kiri: Gambar & Instruksi */}
                <Col md={6}>
                  <img 
                    src={selectedRecipe.image_url} 
                    className="img-fluid rounded mb-3 w-100" 
                    alt={selectedRecipe.title} 
                  />
                  <h6 className="fw-bold">Cara Memasak:</h6>
                  <p style={{ whiteSpace: 'pre-line', fontSize: '0.9rem' }}>
                    {selectedRecipe.instructions}
                  </p>
                </Col>

                {/* Kolom Kanan: Nutrisi & Bahan */}
                <Col md={6}>
                  {/* Card Nutrisi */}
                  <Card className="bg-light mb-3 border-success">
                    <Card.Body>
                      <h6 className="fw-bold text-success">Total Nutrisi (Per Porsi)</h6>
                      <hr />
                      <div className="d-flex justify-content-between mb-1">
                        <span>🔥 Kalori</span>
                        <strong className="text-dark">{selectedRecipe.total_nutrition_per_serving.calories} kkal</strong>
                      </div>
                      <div className="d-flex justify-content-between mb-1">
                        <span>🥩 Protein</span>
                        <strong>{selectedRecipe.total_nutrition_per_serving.protein} g</strong>
                      </div>
                      <div className="d-flex justify-content-between mb-1">
                        <span>🍚 Karbo</span>
                        <strong>{selectedRecipe.total_nutrition_per_serving.carbs} g</strong>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span>🥑 Lemak</span>
                        <strong>{selectedRecipe.total_nutrition_per_serving.fats} g</strong>
                      </div>
                    </Card.Body>
                  </Card>

                  {/* List Bahan */}
                  <h6 className="fw-bold">Rincian Bahan:</h6>
                  <ListGroup variant="flush" className="small">
                    {selectedRecipe.ingredients.map((item, idx) => (
                      <ListGroup.Item key={idx} className="d-flex justify-content-between align-items-center px-0">
                        <div>
                          <strong>{item.ingredient_name}</strong>
                          <div className="text-muted" style={{fontSize: '0.8em'}}>
                             {item.notes} ({item.quantity})
                          </div>
                        </div>
                        <Badge bg="secondary" pill>
                          {item.nutrition_contribution.calories} kkal
                        </Badge>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Tutup
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </div>
  );
}

export default App;
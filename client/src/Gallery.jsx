import { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Modal, Spinner, Navbar, Nav, Form, InputGroup, Badge, ListGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:3000/api/v1';

function Gallery() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  
  const navigate = useNavigate();

  // Ambil user dari localStorage
  const user = JSON.parse(localStorage.getItem('user_data'));

  useEffect(() => {
    if (!user) {
        navigate('/auth'); // Tendang kalau belum login
        return;
    }
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      // GUNAKAN API KEY MILIK USER SENDIRI
      const response = await axios.get(`${API_BASE_URL}/recipes`, {
        headers: { 'x-api-key': user.api_key }
      });
      setRecipes(response.data.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user_data');
    navigate('/');
  };

  const handleShowDetail = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/recipes/${id}`, {
        headers: { 'x-api-key': user.api_key }
      });
      setSelectedRecipe(response.data.data);
      setShowModal(true);
    } catch (error) { alert("Gagal memuat detail"); }
  };

  const filteredRecipes = recipes.filter(recipe => 
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-soft min-vh-100">
      {/* NAVBAR PREMIUM */}
      <Navbar className="nav-luxury sticky-top py-3 mb-4">
        <Container>
            <Navbar.Brand className="fw-bold text-emerald">🥗 NusaNutrisi Premium</Navbar.Brand>
            <Nav className="ms-auto align-items-center">
                <span className="text-muted me-3 d-none d-md-block">Halo, {user?.name}</span>
                <Link to="/console" className="btn btn-outline-success rounded-pill btn-sm me-2">Developer Console</Link>
                <Button variant="link" className="text-danger text-decoration-none" onClick={handleLogout}>Logout</Button>
            </Nav>
        </Container>
      </Navbar>

      <Container>
        {/* Header Content */}
        <div className="text-center mb-5">
            <h2 className="fw-bold text-dark">Koleksi Resep Eksklusif</h2>
            <p className="text-muted">Akses penuh ke data resep dan nutrisi.</p>
            <Row className="justify-content-center mt-3">
                <Col md={6}>
                    <InputGroup>
                        <Form.Control
                            placeholder="Cari resep favoritmu..."
                            className="border-0 shadow-sm py-3 px-4 rounded-pill"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </InputGroup>
                </Col>
            </Row>
        </div>

        {/* Loading */}
        {loading && <div className="text-center"><Spinner animation="border" variant="success" /></div>}

        {/* Grid Resep */}
        <Row xs={1} md={3} className="g-4 pb-5">
          {filteredRecipes.map((recipe) => (
            <Col key={recipe.id}>
              <Card className="h-100 card-luxury">
                <div style={{ height: '200px', overflow: 'hidden' }}>
                    <Card.Img variant="top" src={recipe.image_url} style={{width:'100%', height:'100%', objectFit:'cover'}} />
                </div>
                <Card.Body>
                  <div className="mb-2">
                    <Badge bg="success" className="me-2 rounded-pill">Premium</Badge>
                    <small className="text-muted">{recipe.total_calories || '0'} kkal</small>
                  </div>
                  <Card.Title className="fw-bold">{recipe.title}</Card.Title>
                  <Button variant="outline-success" className="w-100 rounded-pill mt-3" onClick={() => handleShowDetail(recipe.id)}>
                    Lihat Detail
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        {selectedRecipe && (
            <>
                <Modal.Header closeButton className="border-0"><Modal.Title className="fw-bold text-emerald">{selectedRecipe.title}</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col md={6}>
                            <img src={selectedRecipe.image_url} className="img-fluid rounded-4 mb-3" alt="" />
                            <p style={{whiteSpace: 'pre-line'}}>{selectedRecipe.instructions}</p>
                        </Col>
                        <Col md={6}>
                            <Card className="bg-emerald text-white mb-3 border-0 rounded-4">
                                <Card.Body>
                                    <h5>Nutrisi per Porsi</h5>
                                    <h2 className="fw-bold">{selectedRecipe.total_nutrition_per_serving.calories} kkal</h2>
                                </Card.Body>
                            </Card>
                            <h6>Bahan-bahan:</h6>
                            <ListGroup variant="flush">
                                {selectedRecipe.ingredients.map((item, idx) => (
                                    <ListGroup.Item key={idx}>{item.ingredient_name} ({item.quantity})</ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Col>
                    </Row>
                </Modal.Body>
            </>
        )}
      </Modal>
    </div>
  );
}

export default Gallery;
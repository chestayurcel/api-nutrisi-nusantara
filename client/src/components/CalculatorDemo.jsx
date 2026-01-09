import { useState, useMemo } from 'react';
import { Card, Form, InputGroup, Button, Badge, ListGroup } from 'react-bootstrap';

// Data Dummy Statis untuk Demo
const demoIngredients = [
    { id: 'd1', name: 'Nasi Putih', calPer100g: 130 },
    { id: 'd2', name: 'Telur Ayam', calPer100g: 155 },
    { id: 'd3', name: 'Daging Ayam Suwir', calPer100g: 165 },
    { id: 'd4', name: 'Kecap Manis', calPer100g: 200 },
    { id: 'd5', name: 'Minyak Goreng', calPer100g: 884 },
    { id: 'd6', name: 'Bawang Merah & Putih', calPer100g: 80 },
    { id: 'd7', name: 'Kerupuk Udang', calPer100g: 530 },
];

function CalculatorDemo() {
    // State items
    const [addedItems, setAddedItems] = useState([]);
    
    // State form
    const [selectedIngId, setSelectedIngId] = useState(demoIngredients[0].id);
    const [weightInput, setWeightInput] = useState(100);

    // --- LOGIKA TAMBAH ---
    const handleAddItem = () => {
        const ingredient = demoIngredients.find(item => item.id === selectedIngId);
        if (!ingredient || weightInput <= 0) return;

        const calculatedCal = Math.round((weightInput / 100) * ingredient.calPer100g);

        const newItem = {
            id: Date.now(), // ID unik
            name: ingredient.name,
            weight: weightInput,
            totalCal: calculatedCal
        };

        setAddedItems([...addedItems, newItem]);
    };

    // --- LOGIKA HAPUS SATU ---
    const handleRemoveItem = (itemId) => {
        setAddedItems(addedItems.filter(item => item.id !== itemId));
    };

    // --- LOGIKA RESET ---
    const handleReset = () => {
        setAddedItems([]);
        setWeightInput(100);
    };

    // --- LOGIKA TOTAL ---
    const grandTotalCalories = useMemo(() => {
        return addedItems.reduce((total, item) => total + item.totalCal, 0);
    }, [addedItems]);

    return (
        <Card className="card-luxury border-0 shadow-lg position-relative" style={{zIndex: 10}}>
             {/* Badge Live Demo */}
             <div className="position-absolute top-0 end-0 m-3">
                <Badge bg="success" className="bg-opacity-10 text-success border border-success border-opacity-25 fw-normal">
                    ⚡ Live Demo
                </Badge>
            </div>

            <Card.Body className="p-4">
                <h5 className="fw-bold text-emerald mb-1">Kalkulator Nutrisi</h5>
                <p className="text-muted small mb-3">Simulasi hitung kalori Nasi Goreng.</p>

                {/* --- FORM INPUT --- */}
                <div className="bg-soft p-3 rounded-3 mb-3 border">
                    <div className="d-flex gap-2 mb-2">
                        <Form.Select 
                            className="border-0 shadow-sm flex-grow-1"
                            value={selectedIngId}
                            onChange={(e) => setSelectedIngId(e.target.value)}
                        >
                            {demoIngredients.map(ing => (
                                <option key={ing.id} value={ing.id}>{ing.name}</option>
                            ))}
                        </Form.Select>
                    </div>
                    <div className="d-flex gap-2">
                         <InputGroup className="shadow-sm" style={{maxWidth: '120px'}}>
                            <Form.Control
                                type="number"
                                min="1"
                                className="border-0 text-center"
                                value={weightInput}
                                onChange={(e) => setWeightInput(Number(e.target.value))}
                            />
                            <InputGroup.Text className="bg-white border-0 small text-muted">gr</InputGroup.Text>
                        </InputGroup>
                        <Button variant="success" className="flex-grow-1 btn-luxury shadow-sm py-2" onClick={handleAddItem}>
                            + Tambah
                        </Button>
                    </div>
                </div>

                {/* --- LIST ITEM (Scrollable) --- */}
                <div className="mb-3 border-top border-bottom py-2" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {addedItems.length === 0 ? (
                        <div className="text-center text-muted py-4 small fst-italic bg-light rounded">
                            Belum ada bahan. Tambahkan di atas!
                        </div>
                    ) : (
                        <ListGroup variant="flush">
                            {addedItems.map(item => (
                                <ListGroup.Item key={item.id} className="d-flex justify-content-between align-items-center px-2 py-2 border-0 border-bottom">
                                    <div style={{lineHeight: '1.2'}}>
                                        <div className="fw-bold text-dark small">{item.name}</div>
                                        <small className="text-muted">{item.weight}g</small>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <span className="fw-bold text-emerald me-3 small">{item.totalCal} kkal</span>
                                        <button 
                                            className="btn btn-link text-danger p-0 border-0" 
                                            onClick={() => handleRemoveItem(item.id)}
                                            title="Hapus item"
                                        >
                                            <i className="bi bi-x-circle-fill"></i>
                                        </button>
                                    </div>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                </div>

                {/* --- FOOTER: TOTAL & RESET (REVISI WARNA) --- */}
                {/* Mengubah background jadi terang (bg-soft) dan teks jadi gelap/hijau */}
                <div className="bg-soft p-3 rounded-3 shadow-sm border-top">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        {/* Teks "Total Estimasi" jadi abu-abu (text-muted) */}
                        <span className="text-muted text-uppercase ls-1 small">Total Estimasi</span>
                        
                        {/* Tombol Reset jadi merah outline (btn-outline-danger) */}
                        {addedItems.length > 0 && (
                            <button 
                                onClick={handleReset} 
                                className="btn btn-sm btn-outline-danger py-0 px-2 rounded-pill" 
                                style={{fontSize: '0.7rem'}}
                            >
                                Reset ↺
                            </button>
                        )}
                    </div>
                    {/* Angka Total jadi hijau emerald (text-emerald) */}
                    <h2 className="fw-bold mb-0 text-center text-emerald">
                        {grandTotalCalories} <span className="fs-6 fw-normal text-muted">kkal</span>
                    </h2>
                </div>
            </Card.Body>
        </Card>
    );
}

export default CalculatorDemo;
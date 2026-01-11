const db = require('../config/database');

const index = async (req, res) => {
    try {
        // Langsung ambil dari database, urutkan A-Z
        const [rows] = await db.query('SELECT * FROM ingredients ORDER BY name ASC');
        
        res.status(200).json({
            status: 'success',
            message: 'Data retrieved successfully',
            data: rows,
            meta: {
                total: rows.length
            }
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

const show = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query('SELECT * FROM ingredients WHERE id = ?', [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ status: 'fail', message: 'Bahan tidak ditemukan' });
        }
        
        res.status(200).json({
            status: 'success',
            data: rows[0]
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

module.exports = { index, show };
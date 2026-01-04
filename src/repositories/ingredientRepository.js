const db = require('../config/database');

const getAll = async (keyword, limit, offset) => {
    const sql = `
        SELECT id, name, calories, protein, carbs, fats, unit 
        FROM ingredients 
        WHERE name LIKE ? 
        LIMIT ? OFFSET ?
    `;
    
    const params = [`%${keyword}%`, parseInt(limit), parseInt(offset)];
    
    const [rows] = await db.query(sql, params); 
    return rows;
};

const countTotal = async (keyword) => {
    const sql = `SELECT COUNT(*) as total FROM ingredients WHERE name LIKE ?`;
    const [rows] = await db.query(sql, [`%${keyword}%`]);
    return rows[0].total;
};

const getById = async (id) => {
    const sql = `SELECT * FROM ingredients WHERE id = ?`;
    const [rows] = await db.query(sql, [id]); 
    return rows[0]; 
};

const getByIds = async (ids) => {
    if (ids.length === 0) return [];
    
    // Membuat placeholder tanda tanya sejumlah ID, misal: (?, ?, ?)
    const placeholders = ids.map(() => '?').join(',');
    
    const sql = `SELECT * FROM ingredients WHERE id IN (${placeholders})`;
    const [rows] = await db.query(sql, ids);
    return rows;
};

module.exports = {
    getAll,
    countTotal,
    getById,
    getByIds
};
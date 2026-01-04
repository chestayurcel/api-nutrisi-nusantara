const db = require('../config/database');

const getAll = async (keyword, limit, offset) => {
    const sql = `
        SELECT id, name, calories, protein, carbs, fats, unit 
        FROM ingredients 
        WHERE name LIKE ? 
        LIMIT ? OFFSET ?
    `;
    const params = [`%${keyword}%`, limit, offset];
    
    const [rows] = await db.execute(sql, params);
    return rows;
};

const countTotal = async (keyword) => {
    const sql = `SELECT COUNT(*) as total FROM ingredients WHERE name LIKE ?`;
    const [rows] = await db.execute(sql, [`%${keyword}%`]);
    return rows[0].total;
};

const getById = async (id) => {
    const sql = `SELECT * FROM ingredients WHERE id = ?`;
    const [rows] = await db.execute(sql, [id]);
    return rows[0];
};

module.exports = {
    getAll,
    countTotal,
    getById
};
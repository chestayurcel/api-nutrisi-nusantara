const db = require('../config/database');

// Ambil daftar resep (Header saja)
const getAll = async (limit, offset) => {
    const sql = `
        SELECT id, title, description, image_url, serving_size 
        FROM recipes 
        LIMIT ? OFFSET ?
    `;
    const [rows] = await db.query(sql, [limit, offset]);
    return rows;
};

const countTotal = async () => {
    const [rows] = await db.query('SELECT COUNT(*) as total FROM recipes');
    return rows[0].total;
};

// Ambil Detail Resep (Header)
const getRecipeHeader = async (id) => {
    const sql = `SELECT * FROM recipes WHERE id = ?`;
    const [rows] = await db.query(sql, [id]);
    return rows[0];
};

// Ambil Bahan-bahan penyusun Resep (JOIN table)
const getRecipeIngredients = async (recipeId) => {
    const sql = `
        SELECT 
            ri.quantity_gram, 
            ri.notes,
            i.id as ingredient_id,
            i.name, 
            i.calories as ref_calories, -- Kalori per 100g (dari master)
            i.protein as ref_protein,
            i.carbs as ref_carbs,
            i.fats as ref_fats
        FROM recipe_ingredients ri
        JOIN ingredients i ON ri.ingredient_id = i.id
        WHERE ri.recipe_id = ?
    `;
    const [rows] = await db.query(sql, [recipeId]);
    return rows;
};

module.exports = {
    getAll,
    countTotal,
    getRecipeHeader,
    getRecipeIngredients
};
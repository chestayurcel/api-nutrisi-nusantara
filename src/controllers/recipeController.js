const db = require('../config/database');

// 1. GET ALL RECIPES (Untuk Halaman Galeri)
const index = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM recipes');

        res.status(200).json({
            status: 'success',
            data: rows,
            meta: { 
                total: rows.length,
                page: 1,
                limit: rows.length 
            }
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// 2. GET RECIPE BY ID (Untuk Modal Detail)
const show = async (req, res) => {
    try {
        const { id } = req.params;

        const [recipeRows] = await db.query('SELECT * FROM recipes WHERE id = ?', [id]);
        
        if (recipeRows.length === 0) {
            return res.status(404).json({ status: 'fail', message: 'Resep tidak ditemukan' });
        }
        
        const recipe = recipeRows[0];

        // Ambil Data Bahan-bahan
        const [ingredients] = await db.query(`
            SELECT 
                i.name as ingredient_name, 
                ri.quantity_gram as quantity,
                ri.notes,
                i.calories, i.protein, i.carbs, i.fats
            FROM recipe_ingredients ri
            JOIN ingredients i ON ri.ingredient_id = i.id
            WHERE ri.recipe_id = ?
        `, [id]);

        // Hitung Nutrisi Detail (Protein/Carbs/Fats) untuk ditampilkan di Modal
        let totalNutrition = { calories: 0, protein: 0, carbs: 0, fats: 0 };
        
        ingredients.forEach(item => {
            const ratio = item.quantity / 100; 
            totalNutrition.calories += item.calories * ratio;
            totalNutrition.protein += item.protein * ratio;
            totalNutrition.carbs += item.carbs * ratio;
            totalNutrition.fats += item.fats * ratio;
        });

        // Masukkan hasil hitungan ke object recipe
        recipe.total_nutrition_per_serving = {
            calories: Math.round(totalNutrition.calories),
            protein: Math.round(totalNutrition.protein),
            carbs: Math.round(totalNutrition.carbs),
            fats: Math.round(totalNutrition.fats)
        };

        recipe.ingredients = ingredients;

        res.status(200).json({
            status: 'success',
            data: recipe
        });

    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

module.exports = { index, show };
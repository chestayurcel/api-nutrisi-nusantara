const recipeService = require('../services/recipeService');

const index = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const result = await recipeService.getRecipes(page, limit);
        
        res.status(200).json({
            status: 'success',
            data: result.data,
            meta: result.meta
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

const show = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await recipeService.getRecipeDetail(id);
        
        res.status(200).json({
            status: 'success',
            data: result
        });
    } catch (error) {
        if (error.message === 'Recipe not found') {
            return res.status(404).json({ status: 'fail', message: 'Resep tidak ditemukan' });
        }
        res.status(500).json({ status: 'error', message: error.message });
    }
};

module.exports = { index, show };
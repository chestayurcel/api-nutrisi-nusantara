const ingredientService = require('../services/ingredientService');

const index = async (req, res) => {
    try {
        const result = await ingredientService.getIngredients(req.query);
        
        res.status(200).json({
            status: 'success',
            message: 'Data retrieved successfully',
            data: result.data,
            meta: result.meta
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

const show = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await ingredientService.getIngredientDetail(id);
        
        res.status(200).json({
            status: 'success',
            data: result
        });
    } catch (error) {
        if (error.message === 'Ingredient not found') {
            return res.status(404).json({ status: 'fail', message: 'Bahan tidak ditemukan' });
        }
        res.status(500).json({ status: 'error', message: error.message });
    }
};

module.exports = {
    index,
    show
};
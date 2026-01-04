const ingredientRepository = require('../repositories/ingredientRepository');

const getIngredients = async (queryParams) => {
    // 1. Ambil parameter dari controller, set default jika kosong
    const keyword = queryParams.q || '';
    const page = parseInt(queryParams.page) || 1;
    const limit = parseInt(queryParams.limit) || 10;
    const offset = (page - 1) * limit;

    // 2. Panggil Repository
    const data = await ingredientRepository.getAll(keyword, limit, offset);
    const totalItems = await ingredientRepository.countTotal(keyword);

    // 3. Format Output (Return Meta Data Pagination)
    return {
        data: data,
        meta: {
            page: page,
            limit: limit,
            total_items: totalItems,
            total_pages: Math.ceil(totalItems / limit)
        }
    };
};

const getIngredientDetail = async (id) => {
    const ingredient = await ingredientRepository.getById(id);
    
    if (!ingredient) {
        throw new Error('Ingredient not found');
    }
    
    return ingredient;
};

module.exports = {
    getIngredients,
    getIngredientDetail
};
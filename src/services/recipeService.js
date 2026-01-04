const recipeRepository = require('../repositories/recipeRepository');

const getRecipes = async (page = 1, limit = 10) => {
    const offset = (page - 1) * limit;
    const data = await recipeRepository.getAll(limit, offset);
    const totalItems = await recipeRepository.countTotal();

    return {
        data,
        meta: {
            page,
            limit,
            total_items: totalItems,
            total_pages: Math.ceil(totalItems / limit)
        }
    };
};

const getRecipeDetail = async (id) => {
    // 1. Ambil Header
    const recipe = await recipeRepository.getRecipeHeader(id);
    if (!recipe) throw new Error('Recipe not found');

    // 2. Ambil Bahan-bahannya
    const ingredients = await recipeRepository.getRecipeIngredients(id);

    // 3. LOGIC: Hitung Total Nutrisi
    let totalNutrition = {
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0
    };

    // Map ingredients untuk menghitung kontribusi gizi masing-masing bahan
    // Rumus: (Berat Pakai / 100) * Nilai Gizi
    const ingredientsWithCalculation = ingredients.map(item => {
        const ratio = item.quantity_gram / 100;
        
        const cal = item.ref_calories * ratio;
        const pro = item.ref_protein * ratio;
        const carb = item.ref_carbs * ratio;
        const fat = item.ref_fats * ratio;

        // Tambahkan ke total
        totalNutrition.calories += cal;
        totalNutrition.protein += pro;
        totalNutrition.carbs += carb;
        totalNutrition.fats += fat;

        return {
            ingredient_name: item.name,
            quantity: `${item.quantity_gram} gram`,
            notes: item.notes,
            nutrition_contribution: {
                calories: parseFloat(cal.toFixed(1)),
                protein: parseFloat(pro.toFixed(1))
            }
        };
    });

    // 4. Gabungkan hasil
    return {
        ...recipe,
        total_nutrition_per_serving: {
            calories: parseFloat(totalNutrition.calories.toFixed(1)),
            protein: parseFloat(totalNutrition.protein.toFixed(1)),
            carbs: parseFloat(totalNutrition.carbs.toFixed(1)),
            fats: parseFloat(totalNutrition.fats.toFixed(1))
        },
        ingredients: ingredientsWithCalculation
    };
};

module.exports = {
    getRecipes,
    getRecipeDetail
};
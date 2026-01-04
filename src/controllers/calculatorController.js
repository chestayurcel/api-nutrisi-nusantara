const ingredientRepository = require('../repositories/ingredientRepository');

const calculate = async (req, res) => {
    try {
        const { items } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ status: 'fail', message: 'Item tidak boleh kosong' });
        }

        // 1. Ambil semua ID bahan dari request body
        const ids = items.map(item => item.id);
        
        // 2. Ambil data nutrisi aslinya dari Database
        const ingredientsMaster = await ingredientRepository.getByIds(ids);

        // 3. Lakukan Perhitungan
        let totalNutrition = { calories: 0, protein: 0, carbs: 0, fats: 0 };
        const detailedItems = [];

        items.forEach(reqItem => {
            // Cari data master yang cocok dengan ID request
            const master = ingredientsMaster.find(i => i.id === reqItem.id);
            
            if (master) {
                const ratio = reqItem.weight / 100;
                
                // Hitung per item
                const cal = master.calories * ratio;
                const pro = master.protein * ratio;
                const carb = master.carbs * ratio;
                const fat = master.fats * ratio;

                // Tambahkan ke Total
                totalNutrition.calories += cal;
                totalNutrition.protein += pro;
                totalNutrition.carbs += carb;
                totalNutrition.fats += fat;

                detailedItems.push({
                    name: master.name,
                    weight: `${reqItem.weight} gram`,
                    calories: parseFloat(cal.toFixed(1))
                });
            }
        });

        // 4. Kirim Response
        res.status(200).json({
            status: 'success',
            data: {
                total_nutrition: {
                    calories: parseFloat(totalNutrition.calories.toFixed(1)),
                    protein: parseFloat(totalNutrition.protein.toFixed(1)),
                    carbs: parseFloat(totalNutrition.carbs.toFixed(1)),
                    fats: parseFloat(totalNutrition.fats.toFixed(1))
                },
                items_breakdown: detailedItems
            }
        });

    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

module.exports = { calculate };
const express = require('express');
const router = express.Router();
const ingredientController = require('../controllers/ingredientController');
const apiKeyMiddleware = require('../middleware/apiKeyMiddleware');

router.use(apiKeyMiddleware);

// GET /api/v1/ingredients
router.get('/', ingredientController.index);

// GET /api/v1/ingredients/:id (Contoh: /api/v1/ingredients/1)
router.get('/:id', ingredientController.show);

module.exports = router;
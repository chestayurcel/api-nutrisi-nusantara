const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');

router.get('/', recipeController.index);
router.get('/:id', recipeController.show);

module.exports = router;
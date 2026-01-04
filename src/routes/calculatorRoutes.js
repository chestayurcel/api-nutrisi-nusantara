const express = require('express');
const router = express.Router();
const calculatorController = require('../controllers/calculatorController');

// POST /api/v1/calculate
router.post('/', calculatorController.calculate);

module.exports = router;
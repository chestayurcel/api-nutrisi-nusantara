const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.registerDeveloper);
router.post('/login', authController.loginDeveloper);
router.post('/regenerate', authController.regenerateApiKey);

module.exports = router;
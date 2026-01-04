const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();
const ingredientRoutes = require('./routes/ingredientRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const calculatorRoutes = require('./routes/calculatorRoutes');
const authRoutes = require('./routes/authRoutes');
const apiKeyAuth = require('./middleware/apiKeyMiddleware');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');

const app = express();
const PORT = process.env.PORT || 3000;

// === Middleware ===
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// === Documentation Route ===
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// === Routes ===
app.use('/api/v1/ingredients', apiKeyAuth, ingredientRoutes);
app.use('/api/v1/recipes', apiKeyAuth, recipeRoutes);
app.use('/api/v1/calculate', apiKeyAuth, calculatorRoutes);
app.use('/api/v1/auth', authRoutes);

// === Test Route ===
app.get('/', (req, res) => {
    res.json({
        message: 'Selamat Datang di API Nutrisi & Resep Nusantara',
        version: '1.0.0',
        server_time: new Date()
    });
});

// === Error Handling Global ===
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: 'error',
        message: 'Terjadi kesalahan pada server'
    });
});

// === Start Server ===
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Nusantara Food API',
      version: '1.0.0',
      description: 'Dokumentasi API untuk Resep dan Nutrisi Makanan Indonesia.',
    },
    servers: [
      {
        url: 'http://localhost:3000/api/v1',
      },
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-api-key',
        },
      },
    },
    security: [
      {
        ApiKeyAuth: [],
      },
    ],
    // --- DISINI KITA DEFINISIKAN PATHS SECARA MANUAL (LEBIH AMAN) ---
    paths: {
      '/recipes': {
        get: {
          tags: ['Recipes'],
          summary: 'Mengambil daftar semua resep',
          parameters: [
            {
              in: 'query',
              name: 'page',
              schema: { type: 'integer' },
              description: 'Nomor halaman',
            },
            {
              in: 'query',
              name: 'limit',
              schema: { type: 'integer' },
              description: 'Jumlah data per halaman',
            },
          ],
          responses: {
            200: {
              description: 'Berhasil mengambil data',
            },
          },
        },
      },
      '/recipes/{id}': {
        get: {
          tags: ['Recipes'],
          summary: 'Mengambil detail resep',
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: { type: 'integer' },
              description: 'ID Resep',
            },
          ],
          responses: {
            200: {
              description: 'Detail ditemukan',
            },
            404: {
              description: 'Tidak ditemukan',
            },
          },
        },
      },
    },
  },
  // Kosongkan apis karena kita sudah mendefinisikan paths di atas
  apis: [], 
};

const specs = swaggerJsdoc(options);
module.exports = specs;
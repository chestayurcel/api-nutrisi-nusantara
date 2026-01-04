const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');

/**
 * @swagger
 * tags:
 * name: Recipes
 * description: Manajemen data resep masakan
 */

/**
 * @swagger
 * /recipes:
 * get:
 * summary: Mengambil daftar semua resep
 * tags: [Recipes]
 * parameters:
 * - in: query
 * name: page
 * schema:
 * type: integer
 * description: Nomor halaman (pagination)
 * - in: query
 * name: limit
 * schema:
 * type: integer
 * description: Jumlah data per halaman
 * responses:
 * 200:
 * description: Berhasil mengambil data resep
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * status:
 * type: string
 * example: success
 * data:
 * type: array
 * items:
 * type: object
 * properties:
 * id:
 * type: integer
 * title:
 * type: string
 * description:
 * type: string
 */
router.get('/', recipeController.index);

/**
 * @swagger
 * /recipes/{id}:
 * get:
 * summary: Mengambil detail resep beserta nutrisinya
 * tags: [Recipes]
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: integer
 * description: ID Resep
 * responses:
 * 200:
 * description: Detail resep ditemukan
 * 404:
 * description: Resep tidak ditemukan
 */
router.get('/:id', recipeController.show);

module.exports = router;
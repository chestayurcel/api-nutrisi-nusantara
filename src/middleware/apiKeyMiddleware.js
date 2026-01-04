const db = require('../config/database');

const apiKeyAuth = async (req, res, next) => {
    try {
        // 1. Ambil API Key dari Header
        const apiKey = req.headers['x-api-key'];

        if (!apiKey) {
            return res.status(401).json({
                status: 'fail',
                message: 'Akses ditolak. Harap sertakan x-api-key di header.'
            });
        }

        // 2. Cek ke Database apakah Key ada dan Aktif
        const sql = `SELECT * FROM developers WHERE api_key = ? AND is_active = 1`;
        const [rows] = await db.query(sql, [apiKey]);

        if (rows.length === 0) {
            return res.status(403).json({
                status: 'fail',
                message: 'API Key tidak valid atau tidak aktif.'
            });
        }

        const developer = rows[0];

        // 3. (Opsional) Cek Kuota
        if (developer.request_quota <= 0) {
            return res.status(429).json({
                status: 'fail',
                message: 'Kuota request harian Anda habis.'
            });
        }

        // 4. (Opsional) Kurangi Kuota (Simple Logic)
        await db.query('UPDATE developers SET request_quota = request_quota - 1 WHERE id = ?', [developer.id]);

        // 5. Simpan data developer di object request (biar bisa dipakai di controller kalau perlu)
        req.developer = developer;

        next();

    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

module.exports = apiKeyAuth;
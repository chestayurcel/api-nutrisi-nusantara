const db = require('../config/database');
const crypto = require('crypto');

const registerDeveloper = async (req, res) => {
    try {
        const { name, email } = req.body;

        // 1. Cek email duplikat
        const [existing] = await db.query('SELECT id FROM developers WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ status: 'fail', message: 'Email sudah terdaftar' });
        }

        // 2. Generate API Key Random (Mirip OpenRouter: "sk-...")
        const apiKey = 'sk-nusa-' + crypto.randomBytes(16).toString('hex');

        // 3. Simpan ke DB
        await db.query(
            'INSERT INTO developers (name, email, api_key, request_quota) VALUES (?, ?, ?, 1000)', 
            [name, email, apiKey]
        );

        // 4. Return Key ke User
        res.status(201).json({
            status: 'success',
            message: 'Registrasi berhasil',
            data: {
                name: name,
                api_key: apiKey,
                quota: 1000
            }
        });

    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

module.exports = { registerDeveloper };
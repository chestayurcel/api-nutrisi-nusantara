const db = require('../config/database');
const crypto = require('crypto');
const bcrypt = require('bcryptjs'); // Library enkripsi password

// --- REGISTER ---
const registerDeveloper = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 1. Cek email duplikat
        const [existing] = await db.query('SELECT id FROM developers WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ status: 'fail', message: 'Email sudah terdaftar. Silakan Login.' });
        }

        // 2. Enkripsi Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Generate API Key
        const apiKey = 'sk-nusa-' + crypto.randomBytes(16).toString('hex');

        // 4. Simpan ke DB
        await db.query(
            'INSERT INTO developers (name, email, password, api_key, request_quota) VALUES (?, ?, ?, ?, 1000)', 
            [name, email, hashedPassword, apiKey]
        );

        res.status(201).json({
            status: 'success',
            message: 'Registrasi berhasil',
            data: { name, api_key: apiKey, quota: 1000 }
        });

    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// --- LOGIN ---
const loginDeveloper = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Cari user berdasarkan email
        const [users] = await db.query('SELECT * FROM developers WHERE email = ?', [email]);

        if (users.length === 0) {
            return res.status(401).json({ status: 'fail', message: 'Email atau password salah' });
        }

        const developer = users[0];

        // 2. Cek Password (Bandingkan input user dengan hash di DB)
        const isMatch = await bcrypt.compare(password, developer.password);

        if (!isMatch) {
            return res.status(401).json({ status: 'fail', message: 'Email atau password salah' });
        }

        // 3. Jika sukses, kembalikan API Key miliknya
        res.status(200).json({
            status: 'success',
            message: 'Login berhasil',
            data: {
                name: developer.name,
                api_key: developer.api_key,
                quota: developer.request_quota
            }
        });

    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// --- REGENERATE KEY (RESET QUOTA) ---
const regenerateApiKey = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Cari user
        const [users] = await db.query('SELECT * FROM developers WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ status: 'fail', message: 'User tidak ditemukan' });
        }
        const developer = users[0];

        // 2. Verifikasi Password
        const isMatch = await bcrypt.compare(password, developer.password);
        if (!isMatch) {
            return res.status(401).json({ status: 'fail', message: 'Password salah' });
        }

        // 3. Generate Key Baru
        const newApiKey = 'sk-nusa-' + crypto.randomBytes(16).toString('hex');

        // 4. Update di Database (Key Baru & Reset Quota 1000)
        await db.query(
            'UPDATE developers SET api_key = ?, request_quota = 1000 WHERE id = ?', 
            [newApiKey, developer.id]
        );

        res.status(200).json({
            status: 'success',
            message: 'API Key berhasil diperbarui',
            data: {
                name: developer.name,
                api_key: newApiKey,
                quota: 1000
            }
        });

    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

module.exports = { registerDeveloper, loginDeveloper, regenerateApiKey };
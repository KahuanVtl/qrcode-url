// Importação das bibliotecas
const express = require('express');
require('dotenv').config();
const { Pool } = require('pg');
const qr = require('qrcode');
const app = express();
const port = 8080;

// Conexão com o banco de dados PostgreSQL
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

app.use(express.json());

// Criar tabela se não existir
async function createTable() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS urls (
                id SERIAL PRIMARY KEY,
                original_url TEXT NOT NULL,
                short_code TEXT UNIQUE NOT NULL,
                access_count INTEGER DEFAULT 0
            );
        `);
        console.log("Tabela criada/verificada com sucesso!");
    } catch (error) {
        console.error("Erro ao criar tabela:", error);
    }
}
createTable();

// Rota para gerar QR Code
app.post('/api/generate', async (req, res) => {  // Corrigido aqui
    try {
        const { url } = req.body;
        if (!url) return res.status(400).json({ error: 'URL é obrigatória' });

        const shortCode = Math.random().toString(36).substr(2, 6);
        const qrCodeURL = `http://localhost:${port}/track/${shortCode}`;

        await pool.query('INSERT INTO urls (original_url, short_code) VALUES ($1, $2)', [url, shortCode]);

        qr.toDataURL(qrCodeURL, (err, qrImage) => {
            if (err) return res.status(500).json({ error: 'Erro ao gerar QR Code' });
            res.json({ qrCodeURL, qrImage });
        });
    } catch (error) {
        console.error("Erro ao gerar QR Code:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});

// Rota para rastrear acessos ao QR Code
app.get('/track/:code', async (req, res) => {
    try {
        const { code } = req.params;
        const result = await pool.query('SELECT original_url FROM urls WHERE short_code = $1', [code]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'URL não encontrada' });
        }

        await pool.query('UPDATE urls SET access_count = access_count + 1 WHERE short_code = $1', [code]);
        res.redirect(result.rows[0].original_url);
    } catch (error) {
        console.error("Erro ao rastrear QR Code:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});

// Rota para ver estatísticas
app.get('/stats', async (req, res) => {
    try {
        const result = await pool.query('SELECT short_code, original_url, access_count FROM urls');
        res.json(result.rows);
    } catch (error) {
        console.error("Erro ao buscar estatísticas:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

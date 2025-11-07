// backend/server.js
require('dotenv').config(); // <-- loads backend/.env into process.env

const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'vibe.db');

app.use(cors());
app.use(express.json()); // built-in body parser

// Ensure DB file exists (optional - helpful for first run)
if (!fs.existsSync(DB_PATH)) {
  console.warn(`Database file not found at ${DB_PATH}. Run npm run init-db to create it.`);
}

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) return console.error('DB open error', err);
  console.log('Connected to SQLite DB at', DB_PATH);
});

// helper to get userId from request (query or header). fallback to demo user id = 1
function getUserId(req) {
  const q = req.query.userId || req.headers['x-user-id'];
  if (q) return Number(q);
  return process.env.DEFAULT_USER_ID ? Number(process.env.DEFAULT_USER_ID) : 1; // demo user
}

// --- API routes ---

// GET /api/products
app.get('/api/products', (req, res) => {
  db.all('SELECT id, name, price FROM products', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// GET /api/cart
app.get('/api/cart', (req, res) => {
  const userId = getUserId(req);
  const sql = `SELECT c.id, c.productId, c.qty, p.name, p.price
               FROM cart c JOIN products p ON c.productId = p.id
               WHERE c.userId = ?`;
  db.all(sql, [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const items = rows.map(r => ({ id: r.id, productId: r.productId, name: r.name, price: r.price, qty: r.qty }));
    const total = items.reduce((s, it) => s + it.price * it.qty, 0);
    res.json({ userId, items, total: Number(total.toFixed(2)) });
  });
});

// POST /api/cart
app.post('/api/cart', (req, res) => {
  const userId = getUserId(req);
  const { productId, qty } = req.body;
  if (!productId || !qty) return res.status(400).json({ error: 'productId and qty required' });

  const findSql = 'SELECT id, qty FROM cart WHERE productId = ? AND userId = ?';
  db.get(findSql, [productId, userId], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (row) {
      const newQty = row.qty + qty;
      db.run('UPDATE cart SET qty = ? WHERE id = ?', [newQty, row.id], function(err2) {
        if (err2) return res.status(500).json({ error: err2.message });
        res.json({ id: row.id, productId, qty: newQty, userId });
      });
    } else {
      db.run('INSERT INTO cart (userId, productId, qty) VALUES (?, ?, ?)', [userId, productId, qty], function(err3) {
        if (err3) return res.status(500).json({ error: err3.message });
        res.status(201).json({ id: this.lastID, productId, qty, userId });
      });
    }
  });
});

// DELETE /api/cart/:id
app.delete('/api/cart/:id', (req, res) => {
  const userId = getUserId(req);
  const id = Number(req.params.id);
  db.run('DELETE FROM cart WHERE id = ? AND userId = ?', [id, userId], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Not found or not yours' });
    res.json({ success: true });
  });
});

// POST /api/checkout
app.post('/api/checkout', (req, res) => {
  const userId = getUserId(req);
  const { cartItems, name, email } = req.body;
  if (!Array.isArray(cartItems) || cartItems.length === 0) return res.status(400).json({ error: 'cartItems required' });

  const ids = cartItems.map(c => c.productId);
  const placeholders = ids.map(() => '?').join(',');
  const sql = `SELECT id, price FROM products WHERE id IN (${placeholders})`;
  db.all(sql, ids, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const priceMap = {};
    rows.forEach(r => priceMap[r.id] = r.price);
    let total = 0;
    cartItems.forEach(ci => {
      const p = priceMap[ci.productId] || 0;
      total += p * (ci.qty || 0);
    });
    total = Number(total.toFixed(2));

    const receipt = { total, timestamp: new Date().toISOString(), name: name || null, email: email || null, userId: userId || null };

    // clear cart for this user
    db.run('DELETE FROM cart WHERE userId = ?', [userId], (delErr) => {
      if (delErr) console.warn('Failed to clear cart:', delErr.message);
      res.json({ receipt });
    });
  });
});

// Optional static serving (after API routes)
app.use(express.static(path.join(__dirname, 'public')));

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Server error' });
});

app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));

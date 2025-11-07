// backend/seed-fakestore.js
const fetch = require('node-fetch'); // npm i node-fetch@2
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, 'vibe.db');
const db = new sqlite3.Database(DB_PATH);

async function seed() {
  try {
    console.log('Fetching fakestore products...');
    const res = await fetch('https://fakestoreapi.com/products');
    const data = await res.json();

    // keep only title and price
    const items = data.map(p => ({ title: p.title, price: Number(p.price) }));

    await new Promise((resolve, reject) => {
      db.serialize(() => {
        db.run('BEGIN');
        db.run('DELETE FROM products');
        const stmt = db.prepare('INSERT INTO products (name, price) VALUES (?, ?)');
        items.forEach(it => stmt.run(it.title, it.price));
        stmt.finalize();
        db.run('COMMIT', (err) => {
          if (err) return reject(err);
          resolve();
        });
      });
    });

    console.log('Seeded products from fakestore. Count:', items.length);
  } catch (err) {
    console.error('Seed failed', err);
  } finally {
    db.close();
  }
}

seed();

// backend/db.js
require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const DB_FILE = process.env.DB_PATH ? path.resolve(process.env.DB_PATH) : path.join(__dirname, 'vibe.db');
const INIT_SQL = fs.readFileSync(path.join(__dirname, 'data-init.sql'), 'utf8');

const db = new sqlite3.Database(DB_FILE);

db.serialize(() => {
  db.exec(INIT_SQL, (err) => {
    if (err) {
      console.error('Failed to initialize DB:', err);
      process.exit(1);
    }
    console.log('Database initialized at', DB_FILE);
    db.close();
  });
});

-- Recreate tables with user support
DROP TABLE IF EXISTS products;
CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  price REAL NOT NULL
);

INSERT INTO products (name, price) VALUES
('Vibe T-Shirt', 19.99),
('Vibe Hoodie', 39.99),
('Vibe Cap', 12.5),
('Vibe Sneakers', 59.99),
('Vibe Backpack', 29.99);

DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT UNIQUE,
  createdAt TEXT DEFAULT (datetime('now'))
);

-- Seed a mock user
INSERT INTO users (name, email) VALUES ('Demo User', 'demo@vibe.test');

DROP TABLE IF EXISTS cart;
CREATE TABLE cart (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER,
  productId INTEGER NOT NULL,
  qty INTEGER NOT NULL DEFAULT 1,
  createdAt TEXT DEFAULT (datetime('now')),
  FOREIGN KEY(userId) REFERENCES users(id)
);

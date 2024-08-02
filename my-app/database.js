// database.js
const Database = require('better-sqlite3');
const db = new Database('quittance.db');

// Create tables if they don't exist
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    tenant_id INTEGER NOT NULL,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id)
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS tenants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    name TEXT NOT NULL,
    ice TEXT,
    address TEXT NOT NULL,
    representative TEXT,
    representative_cin TEXT,
    representative_name TEXT,
    representative_prenom TEXT,
    cin TEXT
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS properties (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    city TEXT NOT NULL,
    land_title TEXT NOT NULL,
    tenant_id INTEGER,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id)
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS contracts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    property_id INTEGER NOT NULL,
    tenant_id INTEGER NOT NULL,
    start_date TEXT NOT NULL,
    price INTEGER NOT NULL,
    FOREIGN KEY (property_id) REFERENCES properties(id),
    FOREIGN KEY (tenant_id) REFERENCES tenants(id)
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    contract_id INTEGER NOT NULL,
    due_date TEXT NOT NULL,
    amount INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    payment_date TEXT,
    FOREIGN KEY (contract_id) REFERENCES contracts(id)
  )
`).run();

module.exports = db;

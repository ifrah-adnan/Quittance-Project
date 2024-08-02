// database.js
const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.resolve(process.cwd(), 'quittance.db');
const db = new Database(dbPath);

// Drop existing tables if necessary
// db.prepare(`DROP TABLE IF EXISTS properties`).run();
// db.prepare(`DROP TABLE IF EXISTS tenants`).run();
// db.prepare(`DROP TABLE IF EXISTS contracts`).run();
// db.prepare(`DROP TABLE IF EXISTS payments`).run();

// Create tables if they don't exist
db.prepare(`CREATE TABLE IF NOT EXISTS properties (
  id INTEGER PRIMARY KEY,
  name TEXT,
  address TEXT,
  postal_code TEXT,
  city TEXT,
  land_title TEXT
)`).run();

db.prepare(`CREATE TABLE IF NOT EXISTS tenants (
  id INTEGER PRIMARY KEY,
  type TEXT, -- 'enterprise' or 'person'
  name TEXT,
  ice TEXT, -- only for enterprise
  address TEXT,
  representative TEXT, -- only for enterprise
  representative_cin TEXT, -- only for enterprise
  representative_name TEXT, -- only for enterprise
  representative_prenom TEXT, -- only for enterprise
  cin TEXT -- only for person
)`).run();

db.prepare(`CREATE TABLE IF NOT EXISTS contracts (
  id INTEGER PRIMARY KEY,
  property_id INTEGER,
  tenant_id INTEGER,
  start_date TEXT,
  price INTEGER,
  FOREIGN KEY (property_id) REFERENCES properties(id),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id)
)`).run();

db.prepare(`CREATE TABLE IF NOT EXISTS payments (
  id INTEGER PRIMARY KEY,
  contract_id INTEGER,
  due_date TEXT,
  amount INTEGER,
  status TEXT DEFAULT 'pending', -- 'pending' or 'paid'
  payment_date TEXT,
  FOREIGN KEY (contract_id) REFERENCES contracts(id)
)`).run();

module.exports = db;

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./railway.db');

db.serialize(() => {
  // 1. Users Table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )`);

  // 2. Trains Table
  db.run(`CREATE TABLE IF NOT EXISTS trains (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    train_number TEXT,
    train_name TEXT,
    source TEXT,
    destination TEXT,
    price INTEGER
  )`);

  // 3. Bookings Table
  db.run(`CREATE TABLE IF NOT EXISTS bookings (
    pnr TEXT PRIMARY KEY,
    passenger_name TEXT,
    train_name TEXT,
    seat_number TEXT
  )`);

  // Add default user (admin / 12345)
  db.get("SELECT COUNT(*) AS count FROM users", (err, row) => {
    if (row && row.count === 0) {
      db.run("INSERT INTO users (username, password) VALUES ('admin', '12345')");
    }
  });

  // Add sample trains
  db.get("SELECT COUNT(*) AS count FROM trains", (err, row) => {
    if (row && row.count === 0) {
      db.run("INSERT INTO trains (train_number, train_name, source, destination, price) VALUES ('12951', 'Express Superfast', 'Delhi', 'Mumbai', 1500)");
      db.run("INSERT INTO trains (train_number, train_name, source, destination, price) VALUES ('12002', 'Shatabdi Express', 'Delhi', 'Bhopal', 900)");
      db.run("INSERT INTO trains (train_number, train_name, source, destination, price) VALUES ('22436', 'Vande Bharat Speed', 'Delhi', 'Varanasi', 1750)");
    }
  });
});

module.exports = db;
const express = require('express');
const path = require('path');
const db = require('./database');

const app = express();
app.use(express.json());

// Serve static frontend files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// 1. Login API
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, row) => {
    if (row) {
      res.json({ success: true, message: 'Login successful' });
    } else {
      res.json({ success: false, message: 'Invalid credentials' });
    }
  });
});

// 2. Get All Trains API
app.get('/api/trains', (req, res) => {
  db.all('SELECT * FROM trains', [], (err, rows) => {
    res.json(rows);
  });
});

// 3. Book Ticket API
app.post('/api/book', (req, res) => {
  const { passenger_name, train_name } = req.body;
  const pnr = 'PNR' + Math.floor(10000 + Math.random() * 90000);
  const seat = 'B' + Math.floor(1 + Math.random() * 40);

  db.run(
    'INSERT INTO bookings (pnr, passenger_name, train_name, seat_number) VALUES (?, ?, ?, ?)',
    [pnr, passenger_name, train_name, seat],
    function (err) {
      if (err) return res.status(500).json({ success: false });
      res.json({ success: true, pnr, seat });
    }
  );
});

// 4. View Ticket by PNR API
app.get('/api/pnr/:id', (req, res) => {
  db.get('SELECT * FROM bookings WHERE pnr = ?', [req.params.id], (err, row) => {
    if (row) {
      res.json({ found: true, booking: row });
    } else {
      res.json({ found: false });
    }
  });
});

// Start server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
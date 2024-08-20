const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', 
  password: '', 
  database: 'pedagoplanet'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database');
});

app.post('/api/login', (req, res) => {
  res.json({ message: 'Login successful' });
});

app.get('/api/users/:userId', (req, res) => {
  const userId = req.params.userId;
  db.query('SELECT * FROM users WHERE id = ?', [userId], (err, result) => {
    if (err) {
      return res.status(500).send({ message: 'Error retrieving user', error: err });
    }
    if (result.length === 0) {
      return res.status(404).send({ message: 'User not found' });
    }
    res.send(result[0]);
  });
});

app.listen(8080, () => {
  console.log('Server running on http://localhost:8080');
});

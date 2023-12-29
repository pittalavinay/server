const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 8085;

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

const mysqlConnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'ViNaY@9014',
  database: 'villan',
  multipleStatements: true,
});

mysqlConnection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

app.post('/send', (req, res) => {
  const { username, email, password } = req.body;

  const sql = 'INSERT INTO aut (username, email, password) VALUES (?, ?, ?)';
  mysqlConnection.query(sql, [username, email, password], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      console.log('Data inserted successfully');
      res.json({ message: 'Data inserted successfully' });
    }
  });
});

app.listen(port, () => {
  console.log('Server started on port ' + port);
});
app.get('/login', (req, res) => {
  const { email, password } = req.query;

  const sql = 'SELECT * FROM aut WHERE email = ? AND password = ?';
  mysqlConnection.query(sql, [email, password], (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      if (results.length > 0) {
        res.json({ authenticated: true });
      } else {
        res.json({ authenticated: false });
      }
    }
  });
});
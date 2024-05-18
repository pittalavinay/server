const express = require("express");
const cors = require("cors");
const knex = require("knex");
require("dotenv").config();

const app = express();
app.use(express.json());

// Allow requests only from your GitHub Pages domain
app.use(
  cors({
    origin: ["https://vinaypittala.github.io", "http://localhost:3000"],
  })
);

const data = { name: "vinay", phone: "979849", age: "78" };

// Initialize knex with PostgreSQL connection
const db = knex({
  client: "pg",
  connection: {
    host: process.env.DB_URL,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT, // Default PostgreSQL port
    ssl: {
      rejectUnauthorized: false, // Accept self-signed certificates (change to `true` for production environments with trusted certificates)
    },
  },
});

// Check database connection
db.raw("SELECT 1")
  .then(() => console.log("Database connected"))
  .catch((err) => {
    console.error("Database not connected:", err);
    process.exit(1); // Exit the process if the database connection fails
  });

app.get("/", (req, res) => {
  res.send(data);
});

app.post('/send', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    await db('aut').insert({ username, email, password });
    console.log('Data inserted successfully');
    res.json({ message: 'Data inserted successfully' });
  } catch (err) {
    console.error('Error inserting data:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/login', async (req, res) => {
  const { email, password } = req.query;

  try {
    const results = await db('aut').where({ email, password });
    if (results.length > 0) {
      res.json({ authenticated: true });
    } else {
      res.json({ authenticated: false });
    }
  } catch (err) {
    console.error('Error querying database:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 8085;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

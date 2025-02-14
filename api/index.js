const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");

const app = express(); // Create an Express app for routing
app.use(cors()); // Enable CORS for all requests
const port = 3000; // Port number for the server

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "123456",
  database: "webpack-registration-starter-db",
  port: 3310
};

//JSON
app.use(express.json());

app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please enter all fields" });
  }

  try {
    const connection = await mysql.createConnection(dbConfig);
    const query = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    await connection.execute(query, [name, email, password]);
    await connection.end();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/register", async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute("SELECT * FROM users");
    await connection.end();
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

async function initDatabase() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [tables] = await connection.execute("SHOW TABLES LIKE 'users'");

    if (tables.length === 0) {
      const query = `CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`;

      await connection.execute(query);
      console.log("Table created successfully");
    }
    await connection.end();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
initDatabase().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});

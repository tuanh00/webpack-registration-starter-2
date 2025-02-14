const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express(); // Create an Express app for routing
app.use(cors()); // Enable CORS for all requests

const dbConfig = {
  host: "127.0.0.1",
  user: process.env.MARIADB_USER,
  password: process.env.MARIADB_PASSWORD,
  database: process.env.MARIADB_DATABASE,
};

//JSON
app.use(express.json());

app.post("/api/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    console.log("Missing fields:", { username, email, password }); // Debugging log
    return res.status(400).json({ message: "Please enter all fields" });
  }

  try {
    const connection = await mysql.createConnection(dbConfig);
    const query =
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    await connection.execute(query, [username, email, password]);
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

app.listen(process.env.API_PORT, () => {
  console.log(`Server running on port ${process.env.API_PORT}`);
});

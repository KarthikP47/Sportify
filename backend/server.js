const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root", // Change if needed
  password: "Karthikp480+12", // Your MySQL password
  database: "Sportify", // Replace with your database name
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL database ✅");
  }
});

// Secret Key for JWT (Add this in your .env file)
const SECRET_KEY = process.env.SECRET_KEY || "your_secret_key_here";

// ✅ SIGNUP Route
app.post("/api/signup", async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
  db.query(sql, [username, email, hashedPassword], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "User registration failed" });
    }
    res.json({ message: "User registered successfully!" });
  });
});

// ✅ LOGIN Route
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });

    if (results.length === 0) return res.status(401).json({ error: "User not found" });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(401).json({ error: "Incorrect password" });

    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ message: "Login successful!", token });
  });
});

// ✅ GET USERS (Test API)
app.get("/api/users", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(results);
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} 🚀`);
});

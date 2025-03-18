import express from "express";
import mysql from "mysql2";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: "http://localhost:5173" })); // Allow requests from frontend
app.use(express.json()); // Parse JSON request bodies

// MySQL Database Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "1311",
  database: process.env.DB_NAME || "sportify_db",
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
  } else {
    console.log("✅ Connected to MySQL Database");
  }
});

app.post("/api/signup", async (req, res) => {
  const { username, email, password, profile_picture, is_admin } = req.body;

  if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
  }

  try {
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user into database
      const sql =
          "INSERT INTO users (username, email, password_hash, profile_picture, is_admin) VALUES (?, ?, ?, ?, ?)";
      db.query(sql, [username, email, hashedPassword, profile_picture || null, is_admin || 0], (err, result) => {
          if (err) {
              console.error("❌ Error inserting user:", err);
              return res.status(500).json({ message: "Signup failed" });
          }
          res.status(201).json({ message: "✅ User registered successfully" });
      });
  } catch (error) {
      res.status(500).json({ message: "❌ Error processing signup", error });
  }
});

// 🔹 LOGIN API
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
  }

  // Find user in database
  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], async (err, results) => {
      if (err) {
          console.error("❌ Error checking user:", err);
          return res.status(500).json({ message: "Login failed" });
      }

      if (results.length === 0) {
          console.log("❌ No user found with this email:", email);
          return res.status(401).json({ message: "Invalid email or password" });
      }

      const user = results[0];

      // Compare entered password with hashed password from database
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);

      if (!isPasswordValid) {
          return res.status(401).json({ message: "Invalid email or password" });
      }

      // Generate JWT token
      const token = jwt.sign({ user_id: user.user_id, is_admin: user.is_admin }, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });

      res.status(200).json({ message: "✅ Login successful", token });
  });
});

// Define Top 5 Leagues
const topLeagues = [39, 140, 61, 78, 135]; // EPL, La Liga, Bundesliga, Serie A, Ligue 1

// ✅ Fetch Standings API
app.get("/api/standings/:leagueId", async (req, res) => {
  const { leagueId } = req.params;

  try {
    const response = await axios.get(
      `https://api.football-data.org/v4/competitions/${leagueId}/standings`,
      {
        headers: {
          "X-Auth-Token": process.env.FOOTBALL_API_KEY,
        },
      }
    );

    res.json(response.data.standings[0]?.table || []);
  } catch (error) {
    console.error("❌ Error fetching standings:", error.message);
    res.status(500).json({ message: "Failed to fetch standings" });
  }
});

const getDateRange = () => {
  const today = new Date();
  const twoWeeksLater = new Date();
  twoWeeksLater.setDate(today.getDate() + 14); // Add 14 days

  const formatDate = (date) => date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  return {
      dateFrom: formatDate(today),
      dateTo: formatDate(twoWeeksLater),
  };
};

// Proxy endpoint to fetch fixtures for a specific competition
app.get('/api/fixtures/:leagueId', async (req, res) => {
  try {
      const { leagueId } = req.params;
      const { dateFrom, dateTo } = getDateRange(); // Get date range

      const response = await axios.get(
          `https://api.football-data.org/v4/competitions/${leagueId}/matches`,
          {
              headers: {
                  'X-Auth-Token': process.env.FOOTBALL_API_KEY,
              },
              params: {
                  dateFrom,
                  dateTo,
              },
          }
      );
      res.json(response.data);
  } catch (error) {
      console.error('Error fetching fixtures:', error.message);
      res.status(500).json({ error: 'Failed to fetch fixtures' });
  }
});

// ✅ Live Matches API (Updated with correct endpoint)
app.get("/api/live-matches", async (req, res) => {
  try {
    const url = "https://v3.football.api-sports.io/fixtures?live=all";
    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": process.env.LIVE_SCORES_API_KEY,
        "x-rapidapi-host": process.env.LIVE_SCORES_API_HOST,
      },
    };

    const response = await axios.get(url, options);
    const allMatches = response.data.response || [];

    console.log("🔵 Raw API Response:", allMatches); // Log the raw response

    // Return all live matches globally
    console.log("✅ All Live Matches:", allMatches);
    res.json(allMatches);
  } catch (error) {
    console.error("❌ Error fetching live matches:", error.message);
    console.error("🔴 API Response:", error.response?.data); // Log the API error response
    res.status(500).json({ message: "Failed to fetch live matches" });
  }
});


// ✅ Previous Matches API
app.get("/api/previous-matches", async (req, res) => {
  try {
    const url = "https://v3.football.api-sports.io/fixtures?status=FT&last=10";
    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": process.env.FOOTBALL_API_KEY_K,
        "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
      },
    };

    const response = await axios.get(url, options);
    const allMatches = response.data.response || [];

    const filteredMatches = allMatches.filter((match) =>
      topLeagues.includes(match.league.id)
    );

    console.log("✅ Filtered Previous Matches:", filteredMatches);
    res.json(filteredMatches);
  } catch (error) {
    console.error("❌ Error fetching previous matches:", error.message);
    res.status(500).json({ message: "Failed to fetch previous matches" });
  }
});

// ✅ Upcoming Matches API
app.get("/api/upcoming-matches", async (req, res) => {
  try {
    const url = "https://v3.football.api-sports.io/fixtures?status=NS&next=10";
    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": process.env.FOOTBALL_API_KEY_K,
        "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
      },
    };

    const response = await axios.get(url, options);
    const allMatches = response.data.response || [];

    const filteredMatches = allMatches.filter((match) =>
      topLeagues.includes(match.league.id)
    );

    console.log("✅ Filtered Upcoming Matches:", filteredMatches);
    res.json(filteredMatches);
  } catch (error) {
    console.error("❌ Error fetching upcoming matches:", error.message);
    res.status(500).json({ message: "Failed to fetch upcoming matches" });
  }
});

// ✅ Match Details API
app.get("/api/match-details/:fixtureId", async (req, res) => {
  const { fixtureId } = req.params;

  try {
    const url = `https://v3.football.api-sports.io/fixtures?id=${fixtureId}`;
    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": process.env.FOOTBALL_API_KEY_K,
        "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
      },
    };

    const response = await axios.get(url, options);
    const matchDetails = response.data.response[0];

    if (!matchDetails) {
      return res.status(404).json({ message: "Match details not found" });
    }

    // Fetch lineups and events
    const lineupUrl = `https://v3.football.api-sports.io/fixtures/lineups?fixture=${fixtureId}`;
    const eventsUrl = `https://v3.football.api-sports.io/fixtures/events?fixture=${fixtureId}`;

    const [lineupResponse, eventsResponse] = await Promise.all([
      axios.get(lineupUrl, options),
      axios.get(eventsUrl, options),
    ]);

    // Add lineups and events to matchDetails
    matchDetails.lineups = lineupResponse.data.response || [];
    matchDetails.events = eventsResponse.data.response || [];

    res.json(matchDetails);
  } catch (error) {
    console.error("❌ Error fetching match details:", error.message);
    res.status(500).json({ message: "Failed to fetch match details" });
  }
});

const authenticate = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Unauthorized: No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    if (!req.user.user_id) {
      console.error("❌ ERROR: `user_id` is missing from token!");
      return res.status(401).json({ message: "Unauthorized: Invalid token (missing user_id)" });
    }
    next();
  } catch (error) {
    console.error("❌ Token Verification Error:", error.message);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

// ✅ Create Post
app.post("/api/posts", authenticate, async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) return res.status(400).json({ message: "Title and content are required" });

  try {
    const sql = "INSERT INTO posts (user_id, title, content, likes) VALUES (?, ?, ?, 0)";
    const [result] = await db.promise().query(sql, [req.user.user_id, title, content]);

    res.status(201).json({ message: "✅ Post created successfully", post_id: result.insertId });
  } catch (error) {
    console.error("❌ Post Creation Error:", error);
    res.status(500).json({ message: "Error creating post", error: error.message });
  }
});

// ✅ Get Posts with Pagination
app.get("/api/posts", async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const offset = (page - 1) * limit;

  try {
    const [posts] = await db.promise().query(
      `SELECT posts.id, posts.title, posts.content, users.username, posts.created_at, posts.likes 
       FROM posts 
       JOIN users ON posts.user_id = users.user_id 
       ORDER BY posts.created_at DESC 
       LIMIT ? OFFSET ?`, 
      [limit, offset]
    );

    res.status(200).json(posts);
  } catch (error) {
    console.error("❌ Fetch Posts Error:", error);
    res.status(500).json({ message: "Error fetching posts" });
  }
});


// ✅ Delete Post (Only Author or Admin)
app.delete("/api/posts/:postId", authenticate, async (req, res) => {
  const { postId } = req.params;

  try {
    const [post] = await db.promise().query("SELECT user_id FROM posts WHERE id = ?", [postId]);

    if (!post.length) return res.status(404).json({ message: "Post not found" });
    if (post[0].user_id !== req.user.user_id && !req.user.is_admin)
      return res.status(403).json({ message: "Unauthorized to delete this post" });

    await db.promise().query("DELETE FROM posts WHERE id = ?", [postId]);
    res.status(200).json({ message: "✅ Post deleted successfully" });
  } catch (error) {
    console.error("❌ Delete Post Error:", error);
    res.status(500).json({ message: "Error deleting post" });
  }
});

// ✅ Like Post API (Increments likes in `posts` table)
app.post("/posts/:postId/like", async (req, res) => {
  const postId = req.params.postId;

  try {
    // Check if post exists
    const [post] = await db.query("SELECT likes FROM posts WHERE id = ?", [postId]);
    if (post.length === 0) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Increment like count
    await db.query("UPDATE posts SET likes = likes + 1 WHERE id = ?", [postId]);

    res.json({ message: "Post liked successfully" });
  } catch (error) {
    console.error("Error liking post:", error);
    res.status(500).json({ error: "Database error" });
  }
});

// ✅ Comment on a Post
// app.post("/api/posts/:postId/comments", authenticate, async (req, res) => {
//   const { postId } = req.params;
//   const { comment } = req.body;

//   if (!comment) return res.status(400).json({ message: "Comment cannot be empty" });

//   try {
//     await db.promise().query("INSERT INTO comments (post_id, user_id, comment) VALUES (?, ?, ?)", [
//       postId,
//       req.user.user_id,
//       comment,
//     ]);
//     res.status(201).json({ message: "✅ Comment added successfully" });
//   } catch (error) {
//     console.error("❌ Add Comment Error:", error);
//     res.status(500).json({ message: "Error adding comment" });
//   }
// });

// ✅ Start Server
app.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port}`);
});

// Log all registered routes
app._router.stack.forEach((r) => {
  if (r.route) {
    console.log(r.route.path);
  }
});

export default db;
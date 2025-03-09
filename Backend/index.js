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
  password: process.env.DB_PASSWORD || "1379",
  database: process.env.DB_NAME || "sportify_db",
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
  } else {
    console.log("✅ Connected to MySQL Database");
  }
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

// ✅ Live Matches API
app.get("/api/live-matches", async (req, res) => {
  try {
    const url = "https://v3.football.api-sports.io/fixtures?live=all";
    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": process.env.FOOTBALL_API_KEY_K,
        "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
      },
    };

    const response = await axios.get(url, options);
    const allMatches = response.data.response || [];

    console.log("Raw API Response:", allMatches); // Log the raw response

    const filteredMatches = allMatches.filter((match) =>
      topLeagues.includes(match.league.id)
    );

    console.log("✅ Filtered Live Matches:", filteredMatches);
    res.json(filteredMatches);
  } catch (error) {
    console.error("❌ Error fetching live matches:", error.message);
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
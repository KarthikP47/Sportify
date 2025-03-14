import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./LiveScores.css";
const LiveScores = () => {
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchLiveMatches = async (retryCount = 3) => {
    try {
      const response = await fetch("http://localhost:5000/api/live-matches");

      if (!response.ok) {
        throw new Error("Failed to fetch live matches");
      }

      const data = await response.json();
      console.log("🔵 Backend Response:", data);
      setFixtures(data || []);
    } catch (err) {
      if (retryCount > 0) {
        console.log(`Retrying... Attempts left: ${retryCount}`);
        setTimeout(() => fetchLiveMatches(retryCount - 1), 2000);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveMatches();
  }, []);

  // Format match time
  const formatMatchTime = (timestamp) => {
    const date = new Date(timestamp * 1000); // Convert timestamp to milliseconds
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Get elapsed time and match half
  const getElapsedTime = (status) => {
    if (status.elapsed) {
      return `${status.elapsed}'`;
    }
    return status.long; // Fallback to status if elapsed time is not available
  };

  // Group matches by leagueId
  const groupMatchesByLeague = (matches) => {
    const groupedMatches = {};

    matches.forEach((match) => {
      const leagueId = match.league?.id || "Unknown League";
      if (!groupedMatches[leagueId]) {
        groupedMatches[leagueId] = [];
      }
      groupedMatches[leagueId].push(match);
    });

    return groupedMatches;
  };

  // Handle match card click
  const handleMatchClick = (fixtureId) => {
    navigate(`/match-details/${fixtureId}`);
  };

  // Render loading state
  if (loading) {
    return <div className="loading">Loading live matches...</div>;
  }

  // Render error state
  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  const groupedMatches = groupMatchesByLeague(fixtures);

  return (
    <div className="live-scores-container">
      <h1 className="live-scores-header">Live Scores</h1>
      {Object.keys(groupedMatches).length > 0 ? (
        Object.entries(groupedMatches).map(([leagueId, matches]) => (
          <div key={leagueId} className="league-container">
            <h2 className="league-name">
              {matches[0].league?.name || "Unknown League"} ({matches[0].league?.country || "Unknown Country"})
            </h2>
            <div className="matches-grid">
              {matches.map((match) => (
                <div
                  key={match.fixture.id}
                  className="match-card"
                  onClick={() => handleMatchClick(match.fixture.id)}
                >
                  <div className="match-header">
                    <span className="match-time">
                      {formatMatchTime(match.fixture.timestamp)}
                    </span>
                    <span className="match-status">
                      {getElapsedTime(match.fixture.status)}
                    </span>
                  </div>
                  <div className="teams-container">
                    <div className="team">
                      <img
                        src={match.teams.home.logo || "/fallback-team-logo.png"}
                        alt={match.teams.home.name}
                        className="team-logo"
                        onError={(e) => (e.target.style.display = "none")}
                      />
                      <span className="team-name">{match.teams.home.name}</span>
                    </div>
                    <div className="score">
                      {match.goals.home} : {match.goals.away}
                    </div>
                    <div className="team">
                      <img
                        src={match.teams.away.logo || "/fallback-team-logo.png"}
                        alt={match.teams.away.name}
                        className="team-logo"
                        onError={(e) => (e.target.style.display = "none")}
                      />
                      <span className="team-name">{match.teams.away.name}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <p className="no-matches">No live matches at the moment.</p>
      )}
    </div>
  );
};

export default LiveScores;
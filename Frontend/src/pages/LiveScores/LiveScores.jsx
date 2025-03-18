import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./LiveScores.css";
import PremierLeagueLogo from "../../assets/premier-league.png";
import Ligue1Logo from "../../assets/ligue-1.png";
const LiveScores = () => {
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLeague, setSelectedLeague] = useState(null); // Track selected league
  const navigate = useNavigate();

  // Define top 5 leagues
const topLeagues = [
  { id: 2021, name: "Premier League", logo: PremierLeagueLogo },
  { id: 2014, name: "La Liga", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/LaLiga_EA_Sports_2023_Vertical_Logo.svg/1280px-LaLiga_EA_Sports_2023_Vertical_Logo.svg.png" },
  { id: 2002, name: "Bundesliga", logo: "https://upload.wikimedia.org/wikipedia/en/d/df/Bundesliga_logo_%282017%29.svg" },
  { id: 2015, name: "Ligue 1", logo: Ligue1Logo },
  { id: 2019, name: "Serie A", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1pmHGka453VFWxuaH2VZ8zE0_IN83JKkyeXevykISJqTvTCRs4KUNUR1e6pS5nckPHUY&usqp=CAU" },
];

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
        groupedMatches[leagueId] = {
          name: match.league?.name || "Unknown League",
          logo: match.league?.logo || "/fallback-league-logo.png",
          matches: [],
        };
      }
      groupedMatches[leagueId].matches.push(match);
    });

    return groupedMatches;
  };

  // Handle match card click
  const handleMatchClick = (fixtureId) => {
    navigate(`/match-details/${fixtureId}`);
  };

  // Handle league button click
  const handleLeagueClick = (leagueId) => {
    setSelectedLeague(leagueId);
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

  // Filter matches for the selected league or "Others"
  const filteredMatches =
    selectedLeague === "others"
      ? Object.entries(groupedMatches)
          .filter(
            ([leagueId]) =>
              !topLeagues.some((league) => league.id === Number(leagueId))
          )
          .flatMap(([, leagueData]) => leagueData.matches)
      : selectedLeague
      ? groupedMatches[selectedLeague]?.matches || []
      : Object.values(groupedMatches).flatMap((leagueData) => leagueData.matches);

  return (
    <div className="live-scores-container">

      {/* Top 5 League Buttons and Others Button */}
      <div className="live-league-buttons">
        {topLeagues.map((league) => (
          <button
            key={league.id}
            className={`live-league-button ${
              selectedLeague === league.id ? "active" : ""
            }`}
            onClick={() => handleLeagueClick(league.id)}
          >
            <img
              src={league.logo}
              alt={league.name}
              className="league-button-logo"
              onError={(e) => (e.target.style.display = "none")}
            />
            {league.name}
          </button>
        ))}
        <button
          className={`live-league-button ${
            selectedLeague === "others" || !selectedLeague ? "active" : ""
          }`}
          onClick={() => setSelectedLeague("others")} // Show other leagues or all leagues
        >
          Others
        </button>
      </div>

      {/* Display Matches */}
      {filteredMatches.length > 0 ? (
        Object.entries(groupedMatches).map(([leagueId, leagueData]) => (
          <div key={leagueId} className="competition-container">
            <div className="competition-header">
              <img
                src={leagueData.logo}
                alt={leagueData.name}
                className="competition-logo"
                onError={(e) => (e.target.style.display = "none")}
              />
              <span className="competition-name">{leagueData.name}</span>
            </div>
            <div className="matches-grid">
              {leagueData.matches.map((match) => (
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
                    {/* Team 1 */}
                    <div className="team">
                      <img
                        src={match.teams.home.logo || "/fallback-team-logo.png"}
                        alt={match.teams.home.name}
                        className="team-logo"
                        onError={(e) => (e.target.style.display = "none")}
                      />
                      <span className="team-name">{match.teams.home.name}</span>
                      <span className="score">{match.goals.home}</span>
                    </div>
                    {/* Team 2 */}
                    <div className="team">
                      <img
                        src={match.teams.away.logo || "/fallback-team-logo.png"}
                        alt={match.teams.away.name}
                        className="team-logo"
                        onError={(e) => (e.target.style.display = "none")}
                      />
                      <span className="team-name">{match.teams.away.name}</span>
                      <span className="score">{match.goals.away}</span>
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
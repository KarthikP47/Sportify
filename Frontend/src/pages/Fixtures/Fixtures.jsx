import React, { useState } from "react";
import axios from "axios";
import "./Fixtures.css";

import PremierLeagueLogo from "../../assets/premier-league.png";
import Ligue1Logo from "../../assets/ligue-1.png";

const leagues = [
  { id: 2021, name: "Premier League", logo: PremierLeagueLogo },
  { id: 2014, name: "La Liga", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/LaLiga_EA_Sports_2023_Vertical_Logo.svg/1280px-LaLiga_EA_Sports_2023_Vertical_Logo.svg.png" },
  { id: 2002, name: "Bundesliga", logo: "https://upload.wikimedia.org/wikipedia/en/d/df/Bundesliga_logo_%282017%29.svg" },
  { id: 2015, name: "Ligue 1", logo: Ligue1Logo },
  { id: 2019, name: "Serie A", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1pmHGka453VFWxuaH2VZ8zE0_IN83JKkyeXevykISJqTvTCRs4KUNUR1e6pS5nckPHUY&usqp=CAU" },
];

const LeagueFixtures = () => {
  const [fixtures, setFixtures] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedLeague, setSelectedLeague] = useState(null);

  const fetchFixtures = async (leagueId) => {
    setLoading(true);
    setError("");
    setSelectedLeague(leagueId); // Set the selected league
    try {
      const response = await axios.get(`http://localhost:5000/api/fixtures/${leagueId}`);
      setFixtures(response.data.matches);
    } catch (err) {
      console.error("API Error:", err.response || err.message);
      setError("Failed to fetch fixtures.");
    }
    setLoading(false);
  };

  return (
    <div className="fixtures-page">
      {/* League Buttons - Move to Top After Selection */}
      <div className="fixtures-league-buttons">
        {leagues.map((league) => (
          <button
            key={league.id}
            onClick={() => fetchFixtures(league.id)}
            className={selectedLeague === league.id ? "active" : ""}
          >
            <img src={league.logo} alt={league.name} className="league-logo" />
            {league.name}
          </button>
        ))}
      </div>

      {loading && <p>Loading fixtures...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Fixtures List */}
      {fixtures && (
        <div className="fixtures-list">
          {fixtures.length === 0 ? (
            <p>No upcoming fixtures available.</p>
          ) : (
            fixtures.map((fixture) => (
              <div key={fixture.id} className="fixture-item">
                <div className="fixture-teams">
                  <div className="team">
                    <img src={fixture.homeTeam.crest} alt={fixture.homeTeam.name} className="team-logo" />
                    <span className="team-name">{fixture.homeTeam.name}</span>
                  </div>
                  <div className="vs">vs</div>
                  <div className="team">
                    <img src={fixture.awayTeam.crest} alt={fixture.awayTeam.name} className="team-logo" />
                    <span className="team-name">{fixture.awayTeam.name}</span>
                  </div>
                </div>
                <div className="fixture-date-time">
                  <p>{new Date(fixture.utcDate).toLocaleDateString()}</p>
                  <p>{new Date(fixture.utcDate).toLocaleTimeString()}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default LeagueFixtures;
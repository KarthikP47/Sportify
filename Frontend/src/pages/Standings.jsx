import React, { useState } from "react";
import axios from "axios";
import "./Standings.css"; // Updated CSS file

const leagues = [
  { id: 2021, name: "Premier League", logo: "https://logos-world.net/wp-content/uploads/2023/02/Premier-League-Symbol.png" },
  { id: 2014, name: "La Liga", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/LaLiga_EA_Sports_2023_Vertical_Logo.svg/1280px-LaLiga_EA_Sports_2023_Vertical_Logo.svg.png" },
  { id: 2002, name: "Bundesliga", logo: "https://upload.wikimedia.org/wikipedia/en/d/df/Bundesliga_logo_%282017%29.svg" },
  { id: 2015, name: "Ligue 1", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/8/83/Ligue_1_2024.svg/800px-Ligue_1_2024.svg.png" },
  { id: 2019, name: "Serie A", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1pmHGka453VFWxuaH2VZ8zE0_IN83JKkyeXevykISJqTvTCRs4KUNUR1e6pS5nckPHUY&usqp=CAU" },
];


const Leagues = () => {
  const [standings, setStandings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchStandings = async (leagueId) => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`http://localhost:5000/api/standings/${leagueId}`);
      setStandings(response.data);
    } catch (err) {
      console.error("API Error:", err.response || err.message);
      setError("Failed to fetch standings.");
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="league-buttons">
        {leagues.map((league) => (
          <button key={league.id} onClick={() => fetchStandings(league.id)}>
          <img src={league.logo} alt={league.name} className="league-logo" />
            {league.name}
          </button>
        ))}
      </div>

      {loading && <p>Loading standings...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {standings && (
        <div className="table-wrapper">
          <div className="table-container">
            <table className="standings-table">
              <thead>
                <tr>
                  <th>Pos</th>
                  <th></th>
                  <th>Team</th>
                  <th>MP</th>
                  <th>W</th>
                  <th>D</th>
                  <th>L</th>
                  <th>GD</th>
                  <th>PTS</th>
                </tr>
              </thead>
              <tbody>
                {standings.map((team) => (
                  <tr key={team.team.id}>
                    <td className="position">{team.position}</td>
                    <td className="bullet-column">
                        <span className="bullet"></span>
                     </td>
                     <td>
                      <div className="team-info">
                        <img src={team.team.crest} alt={team.team.name} className="team-logo" />
                        <span>{team.team.name}</span>
                      </div>
                    </td>
                    <td>{team.playedGames}</td>
                    <td>{team.won}</td>
                    <td>{team.draw}</td>
                    <td>{team.lost}</td>
                    <td>{team.goalDifference}</td>
                    <td className="points">{team.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leagues;

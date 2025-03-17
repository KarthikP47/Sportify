import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./MatchDetails.css";

const MatchDetails = () => {
  const { fixtureId } = useParams();
  const [matchDetails, setMatchDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMatchDetails = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/match-details/${fixtureId}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Match details not found");
        } else {
          throw new Error("Failed to fetch match details");
        }
      }

      const data = await response.json();
      console.log("🔵 Backend Response:", data); // Log the backend response
      setMatchDetails(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatchDetails();
  }, [fixtureId]);

  if (loading) {
    return <div className="loading">Loading match details...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!matchDetails) {
    return <div className="error">No match details available.</div>;
  }

  return (
    <div className="match-details-container">
      {/* Match Header */}
      <div className="match-details-header">
        <div className="match-details-league">{matchDetails.league.name}</div>
        <div className="match-details-scoreboard">
          <div className="match-details-team">
            <img
              src={matchDetails.teams.home.logo}alt={matchDetails.teams.home.name}className="team-logo"
            />
            <span className="match-details-team-name">{matchDetails.teams.home.name}</span>
          </div>
          <span className="match-details-score">{matchDetails.goals.home} : {matchDetails.goals.away}</span>
          <div className="match-details-team">
            <img
               src={matchDetails.teams.away.logo}
               alt={matchDetails.teams.away.name}
               className="team-logo"
            />
            <span className="match-details-team-name">
            {matchDetails.teams.away.name}
            </span>
          </div>
        </div>
        <div className="match-details-status">
          <span className="match-details-live">{matchDetails.fixture.status.elapsed}</span>
        </div>
      </div>
      {/* Match Overview (yest1.png) */}
      <div className="match-overview">
        <div className="match-overview-left">
          <div className="match-time">
            <span>{new Date(matchDetails.fixture.date).toLocaleString()}</span>
          </div>
          <div className="match-events">
            {matchDetails.events && matchDetails.events.length > 0 ? (
              matchDetails.events.map((event, index) => (
                <div key={index} className="event">
                  <span>{event.time.elapsed}'</span>
                  <span>{event.player.name}</span>
                  <span>{event.type}</span>
                </div>
              ))
            ) : (
              <p>No events available.</p>
            )}
          </div>
        </div>
        <div className="match-overview-right">
          <div className="lineups-container">
            {/* Home Team Lineup */}
            <div className="lineup home-lineup">
              <h3>{matchDetails.teams.home.name}</h3>
              <img
                src={matchDetails.teams.home.logo}
                alt={matchDetails.teams.home.name}
                className="team-logo"
              />
              <div className="formation-container">
                {matchDetails.lineups && matchDetails.lineups[0] ? (
                  matchDetails.lineups[0].startXI.map((player, index) => (
                    <div key={index} className="player">
                      <span>{player.player.name}</span>
                      <span>({player.player.number})</span>
                    </div>
                  ))
                ) : (
                  <p>No lineup available.</p>
                )}
              </div>
            </div>

            {/* Away Team Lineup */}
            <div className="lineup away-lineup">
              <h3>{matchDetails.teams.away.name}</h3>
              <img
                src={matchDetails.teams.away.logo}
                alt={matchDetails.teams.away.name}
                className="team-logo"
              />
              <div className="formation-container">
                {matchDetails.lineups && matchDetails.lineups[1] ? (
                  matchDetails.lineups[1].startXI.map((player, index) => (
                    <div key={index} className="player">
                      <span>{player.player.name}</span>
                      <span>({player.player.number})</span>
                    </div>
                  ))
                ) : (
                  <p>No lineup available.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Substitutes and Coaches (yest2.png) */}
      <div className="match-details-substitutes-coaches-container">
  {/* Home Team Substitutes & Coach */}
  <div className="match-details-team-section">
    <h4>{matchDetails.teams.home.name} Substitutes</h4>
    <ul className="match-details-substitutes-list">
      {matchDetails.lineups && matchDetails.lineups[0]?.substitutes ? (
        matchDetails.lineups[0].substitutes.map((player) => (
          <li key={player.player.id}>
            {player.player.name} ({player.player.number})
          </li>
        ))
      ) : (
        <li>No substitutes available.</li>
      )}
    </ul>
    <h4>Coach</h4>
    <p>{matchDetails.lineups[0]?.coach?.name || "Unknown"}</p>
  </div>

  {/* Away Team Substitutes & Coach */}
  <div className="match-details-team-section">
    <h4>{matchDetails.teams.away.name} Substitutes</h4>
    <ul className="match-details-substitutes-list">
      {matchDetails.lineups && matchDetails.lineups[1]?.substitutes ? (
        matchDetails.lineups[1].substitutes.map((player) => (
          <li key={player.player.id}>
            {player.player.name} ({player.player.number})
          </li>
        ))
      ) : (
        <li>No substitutes available.</li>
      )}
    </ul>
    <h4>Coach</h4>
    <p>{matchDetails.lineups[1]?.coach?.name || "Unknown"}</p>
  </div>
</div>
      {/* Statistics (yest3.png) */}
      <div className="match-details-statistics-container">
  <h4>Statistics</h4>
  <div className="match-details-statistics-grid">
    {/* Iterate through each statistic type and display values for both teams */}
    {matchDetails.statistics && matchDetails.statistics[0]?.statistics.map((stat, index) => {
      const awayStat = matchDetails.statistics[1]?.statistics.find(
        (awayStat) => awayStat.type === stat.type
      );

      return (
        <div key={index} className="match-details-statistic">
          <span className="match-details-stat-value">{stat.value || "N/A"}</span>
          <span className="match-details-stat-type">{stat.type}</span>
          <span className="match-details-stat-value">{awayStat?.value || "N/A"}</span>
        </div>
      );
    })}
  </div>
</div>
    </div>
  );
};

export default MatchDetails;
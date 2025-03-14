import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./MatchDetails.css"; // Import the CSS file for styling

const MatchDetails = () => {
  const { fixtureId } = useParams(); // Get the fixture ID from the URL
  const [matchDetails, setMatchDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch match details
  const fetchMatchDetails = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/match-details/${fixtureId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch match details");
      }

      const data = await response.json();
      setMatchDetails(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch match details on component mount and set up polling
  useEffect(() => {
    fetchMatchDetails(); // Initial fetch

    // Poll the API every 10 seconds for live updates
    const intervalId = setInterval(fetchMatchDetails, 10000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
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

  // Sort events by time elapsed
  const sortedEvents = matchDetails.events
    ? matchDetails.events.sort((a, b) => a.time.elapsed - b.time.elapsed)
    : [];

  return (
    <div className="match-details-container">
      {/* Match Header */}
      <div className="match-header">
        <h1 className="match-title">
          {matchDetails.teams.home.name} vs {matchDetails.teams.away.name}
        </h1>
        <div className="match-score">
          {matchDetails.goals.home} : {matchDetails.goals.away}
        </div>
        <div className="match-status">{matchDetails.fixture.status.long}</div>
      </div>

      {/* Match Events */}
      <div className="match-events">
        <h2>Match Events</h2>
        <table className="events-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Type</th>
              <th>Detail</th>
              <th>Player</th>
            </tr>
          </thead>
          <tbody>
            {sortedEvents.length > 0 ? (
              sortedEvents.map((event) => (
                <tr
                  key={`${event.time.elapsed}-${event.type}`}
                  className="event-row"
                >
                  <td>{event.time.elapsed}'</td>
                  <td>{event.type}</td>
                  <td>{event.detail}</td>
                  <td>{event.player?.name || "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No events available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Teams and Lineups */}
      <div className="teams-container">
        <div className="team">
          <h3>{matchDetails.teams.home.name}</h3>
          <img
            src={matchDetails.teams.home.logo}
            alt={matchDetails.teams.home.name}
            className="team-logo"
          />
          <ul className="players-list">
            {matchDetails.lineups &&
            matchDetails.lineups[0] &&
            matchDetails.lineups[0].startXI ? (
              matchDetails.lineups[0].startXI.map((player) => (
                <li key={player.player.id} className="player-item">
                  {player.player.name}
                </li>
              ))
            ) : (
              <li>No lineup available.</li>
            )}
          </ul>
        </div>
        <div className="team">
          <h3>{matchDetails.teams.away.name}</h3>
          <img
            src={matchDetails.teams.away.logo}
            alt={matchDetails.teams.away.name}
            className="team-logo"
          />
          <ul className="players-list">
            {matchDetails.lineups &&
            matchDetails.lineups[1] &&
            matchDetails.lineups[1].startXI ? (
              matchDetails.lineups[1].startXI.map((player) => (
                <li key={player.player.id} className="player-item">
                  {player.player.name}
                </li>
              ))
            ) : (
              <li>No lineup available.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MatchDetails;
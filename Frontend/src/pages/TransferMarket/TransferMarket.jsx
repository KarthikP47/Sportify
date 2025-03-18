import React, { useState, useEffect } from "react";
import "./TransferMarket.css";

const TransferMarket = () => {
  const [transfers, setTransfers] = useState([]);
  const [filteredTransfers, setFilteredTransfers] = useState([]);
  const [leagues] = useState(["La Liga", "Premier League", "Serie A", "Bundesliga", "Ligue 1"]);
  const [teams, setTeams] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [ageRange, setAgeRange] = useState({ from: "", to: "" });
  const [feeRange, setFeeRange] = useState({ from: "", to: "" });
  const [hasMore, setHasMore] = useState(true); // To track if more transfers are available

  // Fetch initial transfers
  useEffect(() => {
    fetchInitialTransfers();
  }, []);

  const fetchInitialTransfers = () => {
    fetch(`http://localhost:5000/api/transfers/filter?limit=50&offset=0`)
      .then((response) => response.json())
      .then((data) => {
        console.log("✅ Initial transfers fetched:", data);
        setTransfers(data);
        setFilteredTransfers(data);
        setHasMore(data.length === 50); // Check if more transfers are available
      })
      .catch((error) => console.error("❌ Error fetching initial transfers:", error));
  };

  const handleLeagueChange = (e) => {
    setSelectedLeague(e.target.value);
    setSelectedTeam("");

    const leagueTeams = {
      "La Liga": ["Real Madrid", "Barcelona", "Atletico Madrid"],
      "Premier League": ["Manchester United", "Liverpool", "Chelsea"],
      "Serie A": ["Juventus", "AC Milan", "Inter Milan"],
      "Bundesliga": ["Bayern Munich", "Dortmund", "RB Leipzig"],
      "Ligue 1": ["PSG", "Marseille", "Lyon"],
    };
    setTeams(leagueTeams[e.target.value] || []);
  };

  const handleFilter = () => {
    const params = new URLSearchParams();

    if (selectedLeague) params.append("league", selectedLeague);
    if (selectedTeam) params.append("team", selectedTeam);
    if (ageRange.from) params.append("ageFrom", ageRange.from);
    if (ageRange.to) params.append("ageTo", ageRange.to);
    if (feeRange.from) params.append("feeFrom", feeRange.from);
    if (feeRange.to) params.append("feeTo", feeRange.to);

    // Fetch filtered transfers from the backend
    fetch(`http://localhost:5000/api/transfers/filter?${params.toString()}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("✅ Filtered transfers fetched:", data);
        setTransfers(data); // Reset the transfers state with filtered data
        setFilteredTransfers(data); // Set the filtered results
        setHasMore(data.length === 50); // Check if more transfers are available
      })
      .catch((error) => console.error("❌ Error fetching filtered transfers:", error));
  };

  const loadMoreTransfers = () => {
    const newOffset = transfers.length;
    const params = new URLSearchParams();
  
    if (selectedLeague) params.append("league", selectedLeague);
    if (selectedTeam) params.append("team", selectedTeam);
    if (ageRange.from) params.append("ageFrom", ageRange.from);
    if (ageRange.to) params.append("ageTo", ageRange.to);
    if (feeRange.from) params.append("feeFrom", feeRange.from);
    if (feeRange.to) params.append("feeTo", feeRange.to);
  
    params.append("limit", 50);
    params.append("offset", newOffset);
  
    fetch(`http://localhost:5000/api/transfers/filter?${params.toString()}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("✅ More transfers fetched:", data);
        setTransfers([...transfers, ...data]); // Append new data to existing transfers
        setFilteredTransfers([...filteredTransfers, ...data]); // Update filtered transfers
        setHasMore(data.length === 50); // Check if more transfers are available
      })
      .catch((error) => console.error("❌ Error fetching more transfers:", error));
  };
  return (
    <div className="transfer-market-container">
      <h2>Transfer Market</h2>

      {/* Filtering Options */}
      <div className="filters">
        <select onChange={handleLeagueChange} value={selectedLeague}>
          <option value="">Select League</option>
          {leagues.map((league) => (
            <option key={league} value={league}>
              {league}
            </option>
          ))}
        </select>
        <select onChange={(e) => setSelectedTeam(e.target.value)} value={selectedTeam} disabled={!teams.length}>
          <option value="">Select Team</option>
          {teams.map((team) => (
            <option key={team} value={team}>
              {team}
            </option>
          ))}
        </select>
        <input type="number" placeholder="Age From" onChange={(e) => setAgeRange({ ...ageRange, from: e.target.value })} />
        <input type="number" placeholder="Age To" onChange={(e) => setAgeRange({ ...ageRange, to: e.target.value })} />
        <input type="number" placeholder="Fee From (€)" onChange={(e) => setFeeRange({ ...feeRange, from: e.target.value })} />
        <input type="number" placeholder="Fee To (€)" onChange={(e) => setFeeRange({ ...feeRange, to: e.target.value })} />
        <button onClick={handleFilter}>Search</button>
      </div>

      {/* Transfer Cards */}
      <div className="transfers-list">
        {filteredTransfers.length === 0 ? (
          <p>❌ No Transfers Found</p>
        ) : (
          filteredTransfers.map((transfer, index) => (
            <div key={index} className="transfer-card">
              <p><strong>{transfer.player_name}</strong></p>
              <p>To: {transfer.to_team}</p>
              <p>From: {transfer.from_team}</p>
              <p>Age: {transfer.age || "N/A"}</p>
              <p>Position: {transfer.position || "N/A"}</p>
              <p>Fee: {transfer.fee || "N/A"}</p>
              <p>League: {transfer.league_name}</p>
              <p>Year: {transfer.year_of_transfer}</p>
              <p>Type: {transfer.type_of_transfer}</p>
            </div>
          ))
        )}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <button className="load-more" onClick={loadMoreTransfers}>
          Load More
        </button>
      )}
    </div>
  );
};

export default TransferMarket;
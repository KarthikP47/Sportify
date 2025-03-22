import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function TeamPage() {
  const [leagues, setLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState(null);
  const [teams, setTeams] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the top 5 leagues
    axios.get("http://localhost:5000/api/leagues")
      .then((res) => setLeagues(res.data))
      .catch((err) => console.error("Error fetching leagues:", err));
  }, []);

  const fetchTeams = (leagueId) => {
    setSelectedLeague(leagueId);
    setTeams([]); // Clear previous teams

    axios.get(`http://localhost:5000/api/teams/${leagueId}`)
      .then((res) => setTeams(res.data))
      .catch((err) => console.error("Error fetching teams:", err));
  };

  const handleTeamClick = (teamId) => {
    navigate(`/team/${teamId}`);
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Top 5 European Leagues</h1>
      
      {/* Leagues List */}
      <div className="flex space-x-4 mb-6">
        {leagues.map((league) => (
          <button
            key={league.id}
            onClick={() => fetchTeams(league.id)}
            className={`p-2 border rounded ${selectedLeague === league.id ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            {league.name}
          </button>
        ))}
      </div>

      {/* Teams List */}
      {selectedLeague && (
        <div>
          <h2 className="text-2xl font-semibold mb-3">Teams</h2>
          <ul>
            {teams.map((team) => (
              <li
                key={team.id}
                onClick={() => handleTeamClick(team.id)}
                className="cursor-pointer p-2 border-b hover:bg-gray-100"
              >
                {team.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default TeamPage;

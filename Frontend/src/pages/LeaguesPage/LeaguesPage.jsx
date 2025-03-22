import { useEffect, useState } from "react";
import axios from "axios";

function LeaguesPage() {
  const [leagues, setLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState(null);
  const [activeTab, setActiveTab] = useState("teams");
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/leagues")
      .then((res) => setLeagues(res.data))
      .catch((err) => console.error("Error fetching leagues:", err));
  }, []);

  const fetchTeams = (leagueId) => {
    axios.get(`http://localhost:5000/api/teams/${leagueId}`)
      .then((res) => setTeams(res.data))
      .catch((err) => console.error("Error fetching teams:", err));
  };

  const handleLeagueClick = (leagueId) => {
    setSelectedLeague(leagueId);
    setActiveTab("teams");
    fetchTeams(leagueId);
  };

  const topFive = ["Premier League", "La Liga", "Bundesliga", "Serie A", "Ligue 1"];
  const topLeagues = leagues.filter(l => topFive.includes(l.league_name));

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Top European Leagues</h1>

      {/* Top 5 League Buttons */}
      <div className="flex flex-wrap gap-4 mb-6">
        {topLeagues.map((league) => (
          <button
            key={league.league_id}
            onClick={() => handleLeagueClick(league.league_id)}
            className={`flex items-center p-3 border rounded shadow ${
              selectedLeague === league.league_id ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            <img
              src={`/images/${league.logo}`}
              alt={league.league_name}
              className="w-10 h-10 mr-3"
            />
            {league.league_name}
          </button>
        ))}
      </div>

      {/* Tabs for the selected league */}
      {selectedLeague && (
        <div>
          <div className="flex space-x-4 mb-4">
            <button
              className={`p-2 px-4 border rounded ${
                activeTab === "teams" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
              onClick={() => setActiveTab("teams")}
            >
              Teams
            </button>
            <button
              className={`p-2 px-4 border rounded ${
                activeTab === "fixtures" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
              onClick={() => setActiveTab("fixtures")}
            >
              Fixtures
            </button>
            <button
              className={`p-2 px-4 border rounded ${
                activeTab === "standings" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
              onClick={() => setActiveTab("standings")}
            >
              Standings
            </button>
            <button
              className={`p-2 px-4 border rounded ${
                activeTab === "stats" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
              onClick={() => setActiveTab("stats")}
            >
              Stats
            </button>
          </div>

          {/* Render selected tab content */}
          <div>
            {activeTab === "teams" && (
              <div>
                <h2 className="text-2xl font-semibold mb-3">Teams</h2>
                <ul>
                  {teams.map((team) => (
                    <li
                      key={team.team_id}
                      className="p-2 border-b flex items-center"
                    >
                      <img
                        src={`/images/${team.logo}`}
                        alt={team.team_name}
                        className="w-10 h-10 mr-3"
                      />
                      <div>
                        <p className="font-bold">{team.team_name}</p>
                        <p className="text-sm text-gray-600">
                          Stadium: {team.stadium}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === "fixtures" && <p>Show Fixtures Here</p>}
            {activeTab === "standings" && <p>Show Standings Here</p>}
            {activeTab === "stats" && <p>Show Stats Here</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export default LeaguesPage;

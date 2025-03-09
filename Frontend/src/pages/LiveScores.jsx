import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LiveScores = () => {
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLiveMatches = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/live-matches");

        if (!response.ok) {
          throw new Error("Failed to fetch live matches");
        }

        const data = await response.json();
        setFixtures(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveMatches();
  }, []);

  const formatMatchTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const groupMatchesByLeague = (matches) => {
    const groupedMatches = {};

    matches.forEach((match) => {
      const leagueName = match.league.name;
      if (!groupedMatches[leagueName]) {
        groupedMatches[leagueName] = [];
      }
      groupedMatches[leagueName].push(match);
    });

    return groupedMatches;
  };

  const handleMatchClick = (fixtureId) => {
    navigate(`/match-details/${fixtureId}`);
  };

  if (loading) {
    return <div className="text-center text-gray-600">Loading live matches...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  const groupedMatches = groupMatchesByLeague(fixtures);

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Live Scores</h1>
      <div className="space-y-6">
        {Object.keys(groupedMatches).length > 0 ? (
          Object.entries(groupedMatches).map(([leagueName, matches]) => (
            <div key={leagueName} className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-700 border-b-2 border-gray-200 pb-2">
                {leagueName}
              </h2>
              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {matches.map((fixture) => (
                  <div
                    key={fixture.fixture.id}
                    className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleMatchClick(fixture.fixture.id)}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm text-gray-600">
                        {formatMatchTime(fixture.fixture.timestamp)}
                      </span>
                      <span className="text-sm text-gray-600">
                        {fixture.fixture.status.long}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col items-center">
                        <img
                          src={fixture.teams.home.logo}
                          alt={fixture.teams.home.name}
                          className="w-12 h-12 mb-2"
                        />
                        <span className="text-sm font-medium text-gray-800">
                          {fixture.teams.home.name}
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-gray-800">
                        {fixture.goals.home} : {fixture.goals.away}
                      </div>
                      <div className="flex flex-col items-center">
                        <img
                          src={fixture.teams.away.logo}
                          alt={fixture.teams.away.name}
                          className="w-12 h-12 mb-2"
                        />
                        <span className="text-sm font-medium text-gray-800">
                          {fixture.teams.away.name}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">No live matches at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default LiveScores;
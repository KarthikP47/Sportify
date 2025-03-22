import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function TeamDetails() {
  const { teamId } = useParams();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/team/${teamId}`)
      .then((res) => {
        setTeam(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching team details:", err);
        setLoading(false);
      });
  }, [teamId]);

  if (loading) return <p>Loading team details...</p>;
  if (!team) return <p>Team not found.</p>;

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold">{team.name}</h1>
      <img src={team.crest} alt={team.name} className="w-32 h-32" />
      <p>Founded: {team.founded}</p>
      <p>Stadium: {team.venue}</p>
      <p>
        Website: <a href={team.website} className="text-blue-500" target="_blank" rel="noopener noreferrer">
          {team.website}
        </a>
      </p>
    </div>
  );
}

export default TeamDetails;

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Rumors.css"; // Import the CSS file

const Rumors = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchRumors = async () => {
    setLoading(true);
    setError("");

    try {
      // Fetch rumor news from your backend
      const response = await axios.get("http://localhost:5000/api/rumors"); // Backend endpoint
      setNews(response.data);
    } catch (err) {
      console.error("Error fetching rumor news:", err.message);
      setError("Failed to fetch rumor news.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRumors();
  }, []);

  return (
    <div className="rumors-market">
      <h2>FOOTBALL TRANSFER RUMORS AND NEWS</h2>
      {loading && <p>Loading rumor news...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="news-list">
        {news.map((article, index) => (
          <div key={index} className="news-item">
            <a href={article.url} target="_blank" rel="noopener noreferrer">
              <h3>{article.title}</h3>
            </a>
            <p>{article.description}</p>
            {article.urlToImage && (
              <img src={article.urlToImage} alt={article.title} className="news-image" />
            )}
            <p className="news-source">Source: {article.source.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rumors;
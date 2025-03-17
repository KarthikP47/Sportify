import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TransferMarket.css"; // Optional: Add styling

const TransferMarket = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTransferNews = async () => {
    setLoading(true);
    setError("");

    try {
      // Fetch transfer news from your backend
      const response = await axios.get("http://localhost:5000/api/transfers"); // Backend endpoint
      setNews(response.data);
    } catch (err) {
      console.error("Error fetching transfer news:", err.message);
      setError("Failed to fetch transfer news.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransferNews();
  }, []);

  return (
    <div className="transfer-market">
      <h2>Transfer Market News</h2>
      {loading && <p>Loading transfer news...</p>}
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

export default TransferMarket;
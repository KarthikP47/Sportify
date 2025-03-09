import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css"; // ✅ Ensure correct import path

const HomePage = () => {
  const navigate = useNavigate();

  const features = [
  ];

  return (
    <div className="homepage-container">
      <h1 className="homepage-title">SPORTIFY</h1>
      <p className="homepage-subtitle">Your Ultimate Football Feed App</p>
      <div className="feature-buttons">
        {features.map((feature, index) => (
          <button
            key={index}
            onClick={() => navigate(feature.path)}
            className="feature-button"
          >
            {feature.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default HomePage;

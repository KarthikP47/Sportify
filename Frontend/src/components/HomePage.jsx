import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Live Scores",
      description: "Real-time match updates & statistics",
      action: () => navigate("/live-scores"),
      emoji: "⚽",
      bgClass: "feature-bg-1"
    },
    {
      title: "Fixtures",
      description: "Upcoming matches & schedules",
      action: () => navigate("/fixtures"),
      emoji: "📅",
      bgClass: "feature-bg-2"
    },
    {
      title: "Standings",
      description: "League tables & rankings",
      action: () => navigate("/standings"),
      emoji: "🏆",
      bgClass: "feature-bg-3"
    },
    {
      title: "Transfer Market",
      description: "Latest rumors & signings",
      action: () => navigate("/transfers"),
      emoji: "💰",
      bgClass: "feature-bg-4"
    },
    {
      title: "News",
      description: "Rumors and Other news",
      action: () => navigate("/rumors"),
      emoji: "📊",
      bgClass: "feature-bg-5"
    },
    {
      title: "Community",
      description: "Join football discussions",
      action: () => navigate("/forum"),
      emoji: "💬",
      bgClass: "feature-bg-6"
    }
  ];

  const highlights = [
    {
      title: "Manchester Derby Ends in Drama!",
      description: "City secures a late victory against United in a thrilling 3-2 encounter.",
      time: "2 hours ago"
    },
    {
      title: "Barcelona Announces New Signing",
      description: "Young star joins for record fee ahead of new season.",
      time: "5 hours ago"
    },
    {
      title: "Champions League Draw Results",
      description: "Group stage matchups revealed for 2023/24 season.",
      time: "1 day ago"
    }
  ];

  return (
    <div className="homepage-container">
      {/* Hero Section Below Navbar */}
      <div className="hero-section">
        <h1 className="homepage-title">SPORTIFY</h1>
        <p className="homepage-subtitle">Your Ultimate Football Companion</p>
      </div>

      {/* Main Content Area */}
      <main className="main-content">
        {/* Features Grid Section */}
        <section className="features-section">
          <h2 className="section-title">Discover Football Features</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div 
                className={`feature-card ${feature.bgClass}`} 
                key={index} 
                onClick={feature.action}
              >
                <div className="feature-emoji">{feature.emoji}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <div className="feature-hover-effect"></div>
              </div>
            ))}
          </div>
        </section>

        {/* Highlights Section */}
        <section className="highlights-section">
          <h2 className="section-title">Latest Highlights</h2>
          <div className="highlights-grid">
            {highlights.map((highlight, index) => (
              <div className="highlight-card" key={index}>
                <div className="highlight-badge">New</div>
                <h3>{highlight.title}</h3>
                <p>{highlight.description}</p>
                <span className="highlight-time">{highlight.time}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    alert("Logged out successfully!");
    navigate("/login");
  };

  return (
    <div className="home-container">
      {/* Navigation Bar */}
      <nav className="navbar">
        <h2 className="logo" onClick={() => navigate("/homepage")}>Sportify</h2> 
        <div className="nav-buttons">
          <button onClick={() => navigate("/homepage")}>Home</button>
          <button onClick={() => alert("Profile Clicked!")}>Profile</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="content">
        <h1>Welcome to the Sportify Page</h1>
        <p>The Ultimate Football Feed Website.</p>
      </div>
    </div>
  );
}

export default Home;

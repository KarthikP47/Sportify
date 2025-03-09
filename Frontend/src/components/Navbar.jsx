import { Link } from "react-router-dom";
import "./Navbar.css"; // Import the CSS file for styling
import { IoIosFootball } from "react-icons/io";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Left Section - Logo & Menu */}
        <div className="navbar-left">
        <Link to="/home" className="navbar-logo flex items-center">
               Sp<span className="relative top-[-2px]"><IoIosFootball /></span>rtify
            </Link>

          <ul className="navbar-menu">
            <li className="navbar-item">
              <Link to="/live-scores" className="navbar-link">Matches</Link>
            </li>
            <li className="navbar-item">
              <Link to="/standings" className="navbar-link">League Standings</Link>
            </li>
            <li className="navbar-item">
              <Link to="/transfers" className="navbar-link">Transfer Market</Link>
            </li>
            <li className="navbar-item">
              <Link to="/rumors" className="navbar-link">Rumors</Link>
            </li>
            <li className="navbar-item">
              <Link to="/forum" className="navbar-link">Forum</Link>
            </li>
          </ul>
        </div>

        {/* Right Section - Login & Sign Up */}
        <div className="navbar-right">
          <Link to="/login" className ="navbar-button">Sign-in</Link>
          <Link to="/signup" className="navbar-button">Join</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

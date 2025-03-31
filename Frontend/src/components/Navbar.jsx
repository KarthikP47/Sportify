import { Link } from "react-router-dom";
import "./Navbar.css";
import { IoIosFootball } from "react-icons/io";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

function Navbar() {
  const { isLoggedIn, user, logout } = useContext(AuthContext);

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
              <Link to="/fixtures" className="navbar-link">Fixtures</Link>
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

        {/* Right Section - Profile or Login/Join */}
        <div className="navbar-right">
          {isLoggedIn ? (
            <div className="navbar-profile">
              <Link to="/profile" className="navbar-button">
                {user?.username}
              </Link>
              <button onClick={logout} className="navbar-button">
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="navbar-button">Sign-in</Link>
              <Link to="/signup" className="navbar-button">Join</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
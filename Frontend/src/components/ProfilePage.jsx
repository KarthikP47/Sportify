import React, { useContext } from "react";
import { AuthContext } from "./AuthContext";
import { Navigate } from "react-router-dom"; // Import Navigate for redirection
import "./ProfilePage.css";

const ProfilePage = () => {
  const { user, isLoggedIn,logout } = useContext(AuthContext);

  // Redirect to login if not logged in
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="profile-container">
      <h1>Profile</h1>
      <div className="profile-details">
        <div className="profile-picture">
          <img
            src={user?.profile_picture || "https://via.placeholder.com/150"} // Default profile picture
            alt="Profile"
          />
        </div>
        <div className="profile-info">
          <p>
            <strong>Username:</strong> {user?.username}
          </p>
          <p>
            <strong>Email:</strong> {user?.email}
          </p>
          <p>
            <strong>Age:</strong> {user?.age || "Not specified"}
          </p>
          <p>
            <strong>Location:</strong> {user?.location || "Not specified"}
          </p>
        </div>
      </div>

      <button onClick={logout} className="logout-button">
        Logout
      </button>
    </div>
  );
};

export default ProfilePage;
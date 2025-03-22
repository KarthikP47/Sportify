import React, { useContext, useState } from "react";
import { AuthContext } from "./AuthContext";
import { Navigate } from "react-router-dom";
import "./ProfilePage.css";

const ProfilePage = () => {
  const { user, isLoggedIn, logout } = useContext(AuthContext);
  const [profileImage, setProfileImage] = useState(user?.profile_picture || "https://via.placeholder.com/150");

  // Redirect to login if not logged in
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  // Handle Image Selection
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setProfileImage(imageURL);
    }
  };

  return (
    <div className="profile-container">
      <h1>Profile</h1>
      <div className="profile-details">
        <div className="profile-picture">
          <img src={profileImage} alt="Profile" />
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>
        <div className="profile-info">
          <p><strong>Username:</strong> {user?.username}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Age:</strong> {user?.age || "Not specified"}</p>
          <p><strong>Location:</strong> {user?.location || "Not specified"}</p>
        </div>
      </div>

      <button onClick={logout} className="logout-button">Logout</button>
    </div>
  );
};

export default ProfilePage;

import React, { useContext } from "react";
import { AuthContext } from "./AuthContext";

const ProfilePage = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="profile-container">
      <h1>Profile</h1>
      <p>Username: {user?.username}</p>
      <p>Email: {user?.email}</p>
      {/* Add more user details here */}
    </div>
  );
};

export default ProfilePage;
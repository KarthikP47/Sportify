import React, { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import "./LoginPage.css";
import { AuthContext } from "./AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Access location state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter both email and password");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Login Response Data:", data); // Debugging: Log the response data

      // Use the login function from AuthContext to update the state
      login(data.token, data.user);

      alert("Login Successful!");
      navigate("/home");
    } catch (error) {
      console.error("Login error:", error);
      alert("Invalid Credentials");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Welcome Back</h2>
        {location.state?.message && ( // Display the message if it exists
          <p className="login-message">{location.state.message}</p>
        )}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
          />
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
        <p className="switch-text">
          Don't have an account?{" "}
          <span onClick={() => navigate("/signup")} className="switch-link">
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
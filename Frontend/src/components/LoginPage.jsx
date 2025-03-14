import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css"; // Ensure the CSS file is correctly imported

const LoginPage = () => { // ✅ Define the component
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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

      localStorage.setItem("token", data.token);
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

export default LoginPage; // ✅ Ensure this is here

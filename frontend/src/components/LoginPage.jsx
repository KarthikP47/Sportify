import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    if (response.ok) {
      alert(data.message);
      localStorage.setItem("token", data.token);
      navigate("/homepage");
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="login-container">
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Sign In</button>
      </form>
      <p>Don't have an account? <span onClick={() => navigate("/signup")}>Sign Up</span></p>
    </div>
  );
}

export default LoginPage;

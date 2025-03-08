import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username_or_email: "", password: "" });

    useEffect(() => {
      const token = localStorage.getItem("token");
      if (token) {
        navigate("/");
      }
    }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/users/login/", formData);
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("refresh_token", response.data.refresh_token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      const user = response.data.user;
      if (!user.first_name || !user.last_name || !user.profile_photo || !user.date_of_birth || !user.mobile_number) {
        navigate("/add-profile");
      } else {
        navigate("/");
      }
    } catch (error) {
      alert("Invalid credentials.");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username or Email" onChange={(e) => setFormData({ ...formData, username_or_email: e.target.value })} required />
        <input type="password" placeholder="Password" onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
        <button type="submit">Login</button>
      </form>
      <p>
        <a href="/forgot-password">Forgot Password?</a>
      </p>
      <p>
        <a href="/register">Sign Up</a>
      </p>
    </div>
  );
};

export default Login;

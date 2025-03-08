import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailFromURL = params.get("email");
    if (!emailFromURL) {
      setError("Invalid reset link. Please request a new password reset.");
    } else {
      setEmail(emailFromURL);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      await axios.post("https://testhost.pythonanywhere.com/api/users/reset-password/", { email, password });
      alert("Password reset successful. Please login with your new password.");
      navigate("/login");
    } catch (error) {
      setError("Failed to reset password. Please try again.");
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="email" value={email} disabled />
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;
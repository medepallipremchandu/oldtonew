import React, { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleReset = async () => {
    try {
      await axios.post("https://testhost.pythonanywhere.com/api/users/forgot-password/", { email });
      alert("Password reset link sent! Check your email.");
    } catch (error) {
      alert("User not found.");
    }
  };

  return (
    <div>
      <h2>Forgot Password</h2>
      <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <button onClick={handleReset}>Send Reset Link</button>
    </div>
  );
};

export default ForgotPassword;

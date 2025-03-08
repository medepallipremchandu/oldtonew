import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const OTPVerify = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState("");
  const [resendDisabled, setResendDisabled] = useState(false);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    let interval;
    if (resendDisabled && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setResendDisabled(false);
      setTimer(60);
    }
    return () => clearInterval(interval);
  }, [resendDisabled, timer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://testhost.pythonanywhere.com/api/users/verify-otp/", {
        email: location.state.email,
        otp,
      });
      alert("OTP Verified. You can now login.");
      navigate("/login");
    } catch (error) {
      alert("Invalid OTP.");
    }
  };

  const handleResendOTP = async () => {
    try {
      await axios.post("https://testhost.pythonanywhere.com/api/users/resend-otp/", {
        email: location.state.email,
      });
      alert("New OTP sent to your email.");
      setResendDisabled(true);
    } catch (error) {
      alert("Error sending OTP. Please try again later.");
    }
  };

  return (
    <div>
      <h2>Verify OTP</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter OTP"
          onChange={(e) => setOtp(e.target.value)}
          required
        />
        <button type="submit">Verify</button>
      </form>
      <button
        onClick={handleResendOTP}
        disabled={resendDisabled}
        style={{ marginTop: "10px", cursor: resendDisabled ? "not-allowed" : "pointer" }}
      >
        {resendDisabled ? `Resend OTP in ${timer}s` : "Resend OTP"}
      </button>
    </div>
  );
};

export default OTPVerify;
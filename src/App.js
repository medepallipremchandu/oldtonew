import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/protection/ProtectedRoute";
import Navbar from "./components/navbardashboard/Navbar";
import Register from "./components/registerlogin/Register";
import OTPVerify from "./components/otpverification/OTPVerify";
import Login from "./components/registerlogin/Login";
import ForgotPassword from "./components/registerlogin/ForgotPassword";
import ResetPassword from "./components/registerlogin/ResetPassword";
import AddProfile from "./components/profile/AddProfile";
import Dashboard from "./components/navbardashboard/Dashboard";
import Profile from "./components/profile/Profile";
import EditProfile from "./components/profile/EditProfile";
import ResumeUpload from "./components/resume/ResumeUpload";
import Aboutus from "./components/contactaboutusservices/Aboutus";
import Contactus from "./components/contactaboutusservices/Contactus";
import Services from "./components/contactaboutusservices/Services";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
      <Route path="/" element={<Dashboard />} />\
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<OTPVerify />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/add-profile" element={<AddProfile />} />
        <Route path="/about-us" element={<Aboutus />} />
        <Route path="/contact-us" element={<Contactus />} />
        <Route path="/services" element={<Services />} />

        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
        <Route path="/resume-upload" element={<ProtectedRoute><ResumeUpload /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
};

export default App;

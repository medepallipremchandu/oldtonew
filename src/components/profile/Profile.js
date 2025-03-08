import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    axios.get("https://testhost.pythonanywhere.com/api/users/profile/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setProfile(response.data);
        setLoading(false);
      })
      .catch(() => {
        alert("Session expired. Please login again.");
        localStorage.clear();
        navigate("/login");
      });
  }, [navigate]);

  if (loading) return <h2>Loading...</h2>;

  return (
    <div>
      <h2>User Profile</h2>
      {profile.profile_photo ? (
        <img src={profile.profile_photo} alt="Profile" width="150" height="150" style={{ borderRadius: "50%" }} />
      ) : (
        <p>No Profile Photo</p>
      )}
      <p><strong>First Name:</strong> {profile.first_name || "N/A"}</p>
      <p><strong>Last Name:</strong> {profile.last_name || "N/A"}</p>
      <p><strong>Username:</strong> {profile.username}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Date of Birth:</strong> {profile.date_of_birth || "N/A"}</p>
      <p><strong>Mobile Number:</strong> {profile.mobile_number || "N/A"}</p>
      <p><strong>Last Login:</strong> {profile.last_login ? new Date(profile.last_login).toLocaleString() : "N/A"}</p>
      <button onClick={() => navigate("/edit-profile")}>Edit Profile</button>
      <button onClick={() => navigate("/")}>Back to Dashboard</button>
    </div>
  );
};

export default Profile;
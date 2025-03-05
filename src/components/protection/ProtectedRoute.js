import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const [isProfileComplete, setIsProfileComplete] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkProfileCompletion = async () => {
      if (!token) {
        setIsProfileComplete(false);
        return;
      }
      try {
        const response = await axios.get("https://testhost.pythonanywhere.com/api/users/profile/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const profileData = response.data;
        const isComplete =
          profileData.first_name &&
          profileData.last_name &&
          profileData.profile_photo &&
          profileData.date_of_birth &&
          profileData.mobile_number;
        setIsProfileComplete(isComplete);
      } catch (error) {
        console.error("Profile fetch error:", error);
        setIsProfileComplete(false);
      } finally {
        setLoading(false);
      }
    };
    checkProfileCompletion();
  }, [token]);
  if (!token) {
    return <Navigate to="/login" />;
  }
  if (loading) {
    return <p>Loading...</p>;
  }
  if (!isProfileComplete) {
    return <Navigate to="/add-profile" />;
  }
  return children;
};

export default ProtectedRoute;

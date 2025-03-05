import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    profile_photo: null,
    date_of_birth: "",
    mobile_number: "",
  });
  const [preview, setPreview] = useState(null);

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
        const user = response.data;
        const isProfileComplete = user.first_name && user.last_name && user.profile_photo && user.date_of_birth && user.mobile_number;
        if (isProfileComplete) {
          navigate("/");
        }
      })
      .catch(() => {
        alert("Session expired. Please login again.");
        localStorage.clear();
        navigate("/login");
      });
  }, [navigate]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, profile_photo: file });
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const formDataObj = new FormData();
      formDataObj.append("first_name", formData.first_name);
      formDataObj.append("last_name", formData.last_name);
      formDataObj.append("profile_photo", formData.profile_photo);
      formDataObj.append("date_of_birth", formData.date_of_birth);
      formDataObj.append("mobile_number", formData.mobile_number);
      await axios.patch("http://localhost:8000/api/users/profile/", formDataObj, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      alert("Profile added successfully!");
      localStorage.setItem("profile_complete", "true");
      navigate("/");
    } catch (error) {
      alert("Failed to add profile.");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div>
      <h2>Complete Your Profile</h2>
      <form onSubmit={handleSubmit}>
        {preview && <img src={preview} alt="Profile Preview" width="100" height="100" style={{ borderRadius: "50%" }} />}
        <input type="file" onChange={handleFileChange} required />
        <input
          type="text"
          placeholder="First Name"
          value={formData.first_name}
          onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          value={formData.last_name}
          onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
          required
        />
        <input
          type="date"
          value={formData.date_of_birth}
          onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Mobile Number"
          value={formData.mobile_number}
          onChange={(e) => setFormData({ ...formData, mobile_number: e.target.value })}
          required
        />
        <button type="submit">Save Profile</button>
      </form>
      <button onClick={handleLogout} style={{ backgroundColor: "red", color: "white", marginTop: "10px" }}>
        Logout
      </button>
    </div>
  );
};

export default AddProfile;

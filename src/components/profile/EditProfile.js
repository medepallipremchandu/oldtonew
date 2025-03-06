import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    date_of_birth: "",
    mobile_number: "",
    profile_photo: null,
  });
  const [preview, setPreview] = useState(null);
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
        setFormData(response.data);
        setPreview(response.data.profile_photo);
        setLoading(false);
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

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const formDataObj = new FormData();
  
      if (formData.profile_photo instanceof File) {
        formDataObj.append("profile_photo", formData.profile_photo);
      }
      formDataObj.append("first_name", formData.first_name);
      formDataObj.append("last_name", formData.last_name);
      formDataObj.append("username", formData.username);
      formDataObj.append("date_of_birth", formData.date_of_birth);
      formDataObj.append("mobile_number", formData.mobile_number);
  
      await axios.patch("https://testhost.pythonanywhere.com/api/users/profile/", formDataObj, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
  
      alert("Profile updated!");
      navigate("/profile");
    } catch (error) {
      alert("Update failed.");
    }
  };  

  if (loading) return <h2>Loading...</h2>;

  return (
    <div>
      <h2>Edit Profile</h2>
      <form onSubmit={handleUpdate}>
        <img src={preview} alt="Profile Preview" width="100" height="100" style={{ borderRadius: "50%" }} />
        <input type="file" onChange={handleFileChange} />
        <input
          type="text"
          placeholder="First Name"
          value={formData.first_name}
          onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={formData.last_name}
          onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        />
        <input
          type="date"
          value={formData.date_of_birth || ""}
          onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
        />
        <input
          type="text"
          placeholder="Mobile Number"
          value={formData.mobile_number || ""}
          onChange={(e) => setFormData({ ...formData, mobile_number: e.target.value })}
        />
        <button type="submit">Save</button>
        <button type="button" onClick={() => navigate("/profile")}>Cancel</button>
      </form>
    </div>
  );
};

export default EditProfile;

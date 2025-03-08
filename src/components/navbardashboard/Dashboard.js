import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const token = localStorage.getItem("token");
  const [stats, setStats] = useState({
    total_resumes_all: 0,
    today_resumes_all: 0,
    user_resumes_total: null,
    user_resumes_today: null
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await axios.get("http://localhost:8000/api/users/resume-stats/", { headers });
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching resume stats:", error);
      }
    };

    fetchStats();
  }, [token]);

  return (
    <div style={styles.container}>
      <h1>Welcome to Resume Builder</h1>
      <p>Create, edit, and optimize your resume with AI.</p>
      

      <div style={styles.statsContainer}>
        <h3>Resume Processing Stats</h3>
        

        {token ? (
          <>
            <p><strong>👤 Total Resumes Processed (You):</strong> {stats.user_resumes_total}</p>
            <p><strong>🕒 Resumes Processed Today (You):</strong> {stats.user_resumes_today}</p>
          </>
        ) 
        : (
          <p><em>
            {/* Login to see your stats. */}
          </em></p>
        )
        }
      </div>

      {!token ? (
        <div>

          <p><strong>📌 Total Resumes Processed (All Users):</strong> {stats.total_resumes_all}</p>
          <p><strong>📆 Resumes Processed Today (All Users):</strong> {stats.today_resumes_all}</p>

          <h2>Services</h2>
          <p>Our platform helps you generate professional resumes with AI.</p>

          <h2>About Us</h2>
          <p>We are dedicated to providing the best resume-building experience.</p>

          <p><strong>Sign up or log in to get started:</strong></p>
          <Link to="/register" style={styles.button}>Sign Up</Link>
          <Link to="/login" style={styles.button}>Login</Link>
        </div>
      ) : (
        <div>
          <h2>Your Dashboard</h2>
          <p>Welcome back! Start creating and managing your resumes.</p>
          <ul>
            <Link to="/profile" style={styles.button}>View Profile</Link>
            <Link to="/resume-upload" style={styles.button}>Upload & Generate Resume</Link>
          </ul>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    padding: "20px",
  },
  button: {
    display: "inline-block",
    margin: "10px",
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "white",
    textDecoration: "none",
    borderRadius: "5px",
  },
  statsContainer: { 
    border: "1px solid #ccc", 
    padding: "10px", 
    marginTop: "20px" 
  },
};

export default Dashboard;

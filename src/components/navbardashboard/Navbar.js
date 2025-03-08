import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    navigate("/");
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>Resume Builder</div>
      <ul style={styles.navLinks}>
        <li><Link to="/" style={styles.link}>Dashboard</Link></li>
        {!token ? (
          <>
            <li><Link to="/services" style={styles.link}>Services</Link></li>
            <li><Link to="/about-us" style={styles.link}>About Us</Link></li>
            {/* <li><Link to="/contact-us" style={styles.link}>Contact Us</Link></li> */}
            <li><Link to="/register" style={styles.link}>Sign Up</Link></li>
            <li><Link to="/login" style={styles.link}>Login</Link></li>
          </>
        ) : (
          <>
            <li><Link to="/resume-upload" style={styles.link}>Resume Upload</Link></li>
            <li><Link to="/services" style={styles.link}>Services</Link></li>
            <li><Link to="/about-us" style={styles.link}>About Us</Link></li>
            <li><Link to="/contact-us" style={styles.link}>Contact Us</Link></li>
            <li><Link to="/profile" style={styles.link}>Profile</Link></li>
            <li><button onClick={handleLogout} style={styles.logoutButton}>Logout</button></li>
          </>
        )}
      </ul>
    </nav>
  );
};

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    background: "#007bff",
    color: "#fff",
  },
  logo: {
    fontSize: "20px",
    fontWeight: "bold",
  },
  navLinks: {
    listStyle: "none",
    display: "flex",
    gap: "20px",
    margin: 0,
    padding: 0,
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    fontSize: "16px",
  },
  logoutButton: {
    background: "red",
    color: "white",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer",
    fontSize: "16px",
  },
};

export default Navbar;

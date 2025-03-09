import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { default_navy_items, login_navy_items } from "../../constants.js/text";
import "./navbar_style.css";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <a className="resume-builder-logo" href="/">
        Resume Builder
      </a>
      <ul className="nav-items">
        {token
          ? login_navy_items.map((item, index) => (
              <li key={index} className="nav-item">
                <Link
                  to={item.toLowerCase().replace(" ", "-")}
                >
                  {item}
                </Link>
              </li>
            ))
          : default_navy_items.map((item, index) => (
              <li key={index} className="nav-item">
                <Link
                  to={item.toLowerCase().replace(" ", "-")}
                >
                  {item}
                </Link>
              </li>
            ))}
      </ul>
      <svg
          className="menu-icon"
          onClick={() => {

            const navItems = document.querySelector(".nav-items");
            if(navItems.classList.contains("show-nav-items")){
              navItems.classList.remove("show-nav-items");
              navItems.classList.add("hide-nav-items");
              navItems.style.top = "-100%";
            }else{
              navItems.classList.remove("hide-nav-items");
              navItems.classList.add("show-nav-items");
              navItems.style.top = "50px";
            }
          }}
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          width="100"
          height="100"
          viewBox="0 0 50 50"
        >
          <path d="M 5 8 A 2.0002 2.0002 0 1 0 5 12 L 45 12 A 2.0002 2.0002 0 1 0 45 8 L 5 8 z M 5 23 A 2.0002 2.0002 0 1 0 5 27 L 45 27 A 2.0002 2.0002 0 1 0 45 23 L 5 23 z M 5 38 A 2.0002 2.0002 0 1 0 5 42 L 45 42 A 2.0002 2.0002 0 1 0 45 38 L 5 38 z"></path>
        </svg>
    </nav>

    // <nav style={styles.navbar}>
    //   <div style={styles.logo}>Resume Builder</div>
    //   <ul style={styles.navLinks}>
    //     <li><Link to="/" style={styles.link}>Dashboard</Link></li>
    //     {!token ? (
    //       <>
    //         <li><Link to="/services" style={styles.link}>Services</Link></li>
    //         <li><Link to="/about-us" style={styles.link}>About Us</Link></li>
    //         {/* <li><Link to="/contact-us" style={styles.link}>Contact Us</Link></li> */}
    //         <li><Link to="/register" style={styles.link}>Sign Up</Link></li>
    //         <li><Link to="/login" style={styles.link}>Login</Link></li>
    //       </>
    //     ) : (
    //       <>
    //         <li><Link to="/resume-upload" style={styles.link}>Resume Upload</Link></li>
    //         <li><Link to="/services" style={styles.link}>Services</Link></li>
    //         <li><Link to="/about-us" style={styles.link}>About Us</Link></li>
    //         <li><Link to="/contact-us" style={styles.link}>Contact Us</Link></li>
    //         <li><Link to="/profile" style={styles.link}>Profile</Link></li>
    //         <li><button onClick={handleLogout} style={styles.logoutButton}>Logout</button></li>
    //       </>
    //     )}
    //   </ul>
    // </nav>
  );
};

export default Navbar;

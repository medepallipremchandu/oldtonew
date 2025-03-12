import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  default_navy_items,
  login_navy_items,
  openMenuIconSvg,
  closeMenuIconSvg,
  profileIconSvg,
} from "../../constants.js/text";
import "./navbar_style.css";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [showMenu, setShowMenu] = useState(false); // Show or hide the menu
  const menuRef = useRef(null); // Reference to the menu

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    navigate("/");
  };

  const handleToggleMenu = () => {
    setShowMenu((prev) => !prev);
  };

  useEffect(() => {
    if (menuRef.current) {
      menuRef.current.style.top = showMenu ? "50px" : "-100%";
    }
  }, [showMenu]);

  return (
    <nav className="navbar">
      <a className="resume-builder-logo" href="/">
        Resume Builder
      </a>
      <ul className={`nav-items ${showMenu ? "open" : ""}`} ref={menuRef}>
        {token
          ? login_navy_items.map((item, index) => (
              <li key={index} className="nav-item">
                <Link
                  to={item.toLowerCase().replace(" ", "-")}
                  onClick={() => {
                    if (item === "Logout") {
                      handleLogout();
                    }
                    showMenu && handleToggleMenu();
                  }}
                >
                  {item}
                </Link>
              </li>
            ))
          : default_navy_items.map((item, index) => (
              <li key={index} className="nav-item">
                {
                  <Link
                    to={"/" + item.toLowerCase().replace(" ", "-")}
                    onClick={showMenu && handleToggleMenu}
                  >
                    {item}
                  </Link>
                }
              </li>
            ))}
      </ul>
      {!showMenu
        ? openMenuIconSvg(handleToggleMenu)
        : closeMenuIconSvg(handleToggleMenu)}
    </nav>
  );
};

export default Navbar;

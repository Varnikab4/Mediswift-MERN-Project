// src/components/Layout.js
import React, { useEffect, useState } from "react";
import "../styles/Layout.css";
import { adminMenu, doctorMenu, userMenu } from "../Data/data";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { message, Badge } from "antd";
import { FaStethoscope } from "react-icons/fa";

const Layout = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();

  // State for sliding welcome message
  const [currentIndex, setCurrentIndex] = useState(0);
  const welcomeMessage = "Welcome to MEDISWIFT";

  // Logout function
  const handleLogout = () => {
    localStorage.clear();
    message.success("Logout Successfully");
    navigate("/login");
  };

  // ******doctor menu with Analyzer option********//
  const doctorMenu = [
    {
      name: "Home",
      path: "/",
      icon: "fa-solid fa-house",
    },
    {
      name: "Appointments",
      path: "/doctor-appointments",
      icon: "fa-solid fa-calendar-check",
    },
    {
      name: "Report Analyzer",
      path: "/analyzer",
      icon: "fa-solid fa-file-medical",
    },
    {
      name: "NewsBlog",
      path: "/newsBlog",
      icon: "fa-solid fa-chart-line",
    },
    {
      name: "Profile",
      path: `/doctor/profile/${user?._id}`,
      icon: "fa-solid fa-user",
    },
    {
      name: "Logout",
      path: "/logout",
      icon: "fa-solid fa-right-from-bracket",
    },
  ];

  // ******user menu with Analyzer option********//
  const userMenu = [
    {
      name: "Home",
      path: "/",
      icon: "fa-solid fa-house",
    },
    {
      name: "Appointments",
      path: "/appointments",
      icon: "fa-solid fa-list",
    },
    {
      name: "Apply Doctor",
      path: "/apply-doctor",
      icon: "fa-solid fa-user-doctor",
    },
    {
      name: "Doctors",
      path: "/doctorslist", 
      icon: "fa-solid fa-user-doctor",
    },
    {
      name: "Report Analyzer",
      path: "/analyzer",
      icon: "fa-solid fa-file-medical",
    },
    {
      name: "NewsBlog",
      path: "/newsBlog",
      icon: "fa-solid fa-chart-line",
    },
    {
      name: "Profile",
      path: "/profile",
      icon: "fa-solid fa-user",
    },
    {
      name: "Logout",
      path: "/logout",
      icon: "fa-solid fa-right-from-bracket",
    },
  ];

  // ******admin menu with Analyzer option********//
  const adminMenu = [
    {
      name: "Home",
      path: "/",
      icon: "fa-solid fa-house",
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: "fa-solid fa-user",
    },
    {
      name: "Doctors",
      path: "/admin/doctors",
      icon: "fa-solid fa-user-doctor",
    },
    {
      name: "Report Analyzer",
      path: "/analyzer",
      icon: "fa-solid fa-file-medical",
    },
    {
      name: "Profile",
      path: "/profile",
      icon: "fa-solid fa-user",
    },
    {
      name: "Logout",
      path: "/logout",
      icon: "fa-solid fa-right-from-bracket",
    },
  ];

  // Determine which menu to render based on the user's role
  const SidebarMenu = user?.isAdmin
    ? adminMenu
    : user?.isDoctor
    ? doctorMenu
    : userMenu;

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex(
        (prevIndex) => (prevIndex + 1) % (welcomeMessage.length + 1)
      );
    }, 500); // Change the interval as needed

    return () => clearInterval(intervalId);
  }, [welcomeMessage.length]);

  // Smooth scroll to section or navigate to homepage first
  const handleNavigation = (sectionId) => {
    if (location.pathname !== "/") {
      navigate(`/#${sectionId}`); // Navigate to homepage with hash
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <div className="main">
      <div className="layout">
        <div className="sidebar">
          <div className="logo">
            <h5 className="hospital-name">
              <FaStethoscope className="mediswift-icon" /> MEDISWIFT
            </h5>
            <hr />
          </div>
          <div className="menu">
            {SidebarMenu.map((menu) => {
              const isActive = location.pathname === menu.path;

              // Handle logout click for Logout menu
              if (menu.name === "Logout") {
                return (
                  <div
                    className={`menu-item ${isActive && "active"}`}
                    onClick={handleLogout}
                    key={menu.name}
                  >
                    <i className={menu.icon}></i>
                    <span>{menu.name}</span>
                  </div>
                );
              }

              return (
                <div
                  className={`menu-item ${isActive && "active"}`}
                  key={menu.name}
                >
                  <i className={menu.icon}></i>
                  <Link to={menu.path}>{menu.name}</Link>
                </div>
              );
            })}
          </div>
        </div>
        <div className="content">
          {/* Fixed Header & Navigation Menu */}
          <div className="header">
            <div className="header-content" style={{ cursor: "pointer" }}>
              <div className="welcome-slider">
                {welcomeMessage.split("").map((letter, index) => (
                  <span
                    key={index}
                    className={`slider-letter ${
                      index < currentIndex ? "visible" : ""
                    }`}
                  >
                    {letter === " " ? "\u00A0" : letter}
                  </span>
                ))}
              </div>
              <Badge
                count={user?.notification.length}
                onClick={() => {
                  navigate("/notification");
                }}
              >
                <i className="fa-solid fa-bell"></i>
              </Badge>
              <Link to={user?.isDoctor ? `/doctor/profile/${user?._id}` : "/profile"}>{user?.name}</Link>
            </div>
          </div>

          {/* Fixed Navigation Menu */}
          <div className="nav-menu fixed-nav">
            <Link to="/">Home</Link>
            <span onClick={() => handleNavigation("about-section")}>
              About Us
            </span>
            <span onClick={() => handleNavigation("services-section")}>
              Services
            </span>
            <span onClick={() => handleNavigation("health-calculators")}>
              BMI Calculator
            </span>
            <span onClick={() => handleNavigation("footer")}>Contact</span>
          </div>

          {/* Main Body Content */}
          <div className="body">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
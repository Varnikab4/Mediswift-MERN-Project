import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaCalendarAlt,
  FaUserPlus,
  FaFileAlt,
  FaBell,
  FaRobot,
  FaClipboardList,
  FaChartLine,
} from "react-icons/fa";
import HealthCalculators from "../components/HealthCalculators"; // Import HealthCalculators component
import "../styles/Homepage.css";
import Layout from "../components/Layout";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

const quotes = [
  "Health is wealth. - Anonymous",
  "The greatest wealth is health. - Virgil",
  "A healthy outside starts from the inside. - Robert Urich",
  "Your body hears everything your mind says. - Naomi Judd",
  "Health is not just about what you’re eating. It’s also about what you’re thinking and saying. - Anonymous",
];

const Homepage = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [currentQuote, setCurrentQuote] = useState(quotes[0]);

  const getUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const res = await axios.post(
        "/api/v1/user/getUserData",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUserData(res.data.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError(error.response?.data?.message || "Failed to fetch user data");
    }
  };

  useEffect(() => {
    getUserData();

    const quoteInterval = setInterval(() => {
      setCurrentQuote((prevQuote) => {
        const currentIndex = quotes.indexOf(prevQuote);
        return quotes[(currentIndex + 1) % quotes.length];
      });
    }, 8000);

    return () => clearInterval(quoteInterval);
  }, []);

  return (
    <Layout>
      {/* Existing content starts here */}
      <div className="homepage-container">
        <div className="left-column">
          <div className="image-container">
            <img
              src="./assets/doc-img.png"
              alt="Doctor"
              className="doctor-image"
            />
          </div>
        </div>
        <div className="right-column">
          <h1>Transforming Healthcare</h1>
          <p>A Journey to Better Lives</p>
          <Link to="/doctorslist">
            {" "}
            <button className="cta-button">
              <FaCalendarAlt /> Book a Consultation
            </button>
          </Link>
          {error && <p className="error">{error}</p>}
        </div>
      </div>

      <div className="hero-section">
        <video autoPlay loop muted controls className="hero-video">
          <source src="/assets/vid-nurse.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="hero-text">
          <h1>CARING FOR LIFE</h1>
          <p>Leading the Way in Medical Excellence.</p>
        </div>
      </div>

      {/* Quotes Section */}
      <div className="challenges-section">
        <div className="challenges-content">
          <h2
            style={{
              color: "red",
              fontWeight: "bold",
              fontSize: "45px",
              textAlign: "center",
            }}
          >
            {currentQuote}
          </h2>
        </div>
        <div className="challenges-image-container">
          <img
            src="./assets/challenges-image.png"
            alt="Challenges"
            className="challenges-image"
          />
        </div>
      </div>

      {/* About Section */}
      <div id="about-section" className="medswift-section">
        <h2>About Our MEDISWIFT</h2>
        <p>
          MEDSWIFT is a comprehensive and integrated Hospital Management System
          tailored to meet the needs of hospital systems, medical centers,
          multi-specialty clinics, and medical practitioners. This
          all-encompassing system connects hospitals, satellite clinics, and
          medical stores through its Multi-Location functionality. Unlike
          traditional paper-based methods, it leverages technology to pull up
          server or cloud information swiftly, ensuring top performance.
        </p>
        <p>
          Our user-friendly EHR Software eliminates handwriting errors and
          allows easy access to revenue streams, patient records, and essential
          real-time metrics. The software also facilitates the electronic
          sharing of patient records, empowering both patients and providers to
          view lab results, chat securely, and schedule appointments online.
        </p>
        <p>
          A customizable alert system sends reminders via text, IM, and email to
          enhance patient care. Booking appointments with doctors based on their
          specialty, rating, fees, and availability is simple. Plus, organizing
          doctor schedules, compiling patient notes, and handling payments
          become effortless tasks.
        </p>
        <p>
          With MEDSWIFT, doctors and patients can check their calendars on
          mobile devices, contributing to a more organized life. The software is
          available for both on-premise and on-cloud installations, all built on
          best practices from around the globe.
        </p>
      </div>

      {/* Services Section */}
      <div id="services-section" className="services-section">
        <h2 style={{ color: "purple", textAlign: "center" }}>
          Modules of MEDISWIFT
        </h2>
        <div className="services-container">
          <div className="service-card">
            <div className="icon-container">
              <FaCalendarAlt className="icon" />
            </div>
            <h3>Automated Appointment Scheduling</h3>
            <p>
              Streamlining the booking process to save time and enhance patient
              satisfaction. Our system allows patients to book, reschedule, or
              cancel appointments with ease.
            </p>
          </div>
          <div className="service-card">
            <div className="icon-container">
              <FaUserPlus className="icon" />
            </div>
            <h3>Patient Registration System</h3>
            <p>
              Enhancing the onboarding process for new patients by simplifying
              data collection and improving accuracy. This module captures vital
              information efficiently.
            </p>
          </div>
          <div className="service-card">
            <div className="icon-container">
              <FaFileAlt className="icon" />
            </div>
            <h3>Doctor-Patient Management</h3>
            <p>
              An integrated platform for maintaining comprehensive patient
              records, enabling doctors to access medical history, treatments,
              and notes seamlessly.
            </p>
          </div>
          <div className="service-card">
            <div className="icon-container">
              <FaBell className="icon" />
            </div>
            <h3>Real-Time Alerts</h3>
            <p>
              Keeping patients informed about their appointments, medications,
              and important health reminders through real-time notifications via
              SMS and email.
            </p>
          </div>
          <div className="service-card">
            <div className="icon-container">
              <FaRobot className="icon" />
            </div>
            <h3>Chatbot Integration</h3>
            <p>
              A virtual assistant providing 24/7 support for patients, helping
              them with queries, appointment bookings, and medication reminders
              at any time.
            </p>
          </div>
          <div className="service-card">
            <div className="icon-container">
              <FaClipboardList className="icon" />
            </div>
            <h3>Regular Reminders</h3>
            <p>
              Automatic reminders sent to both doctors and patients regarding
              upcoming appointments and essential health checks, ensuring no
              appointments are missed.
            </p>
          </div>
          <div className="service-card">
            <div className="icon-container">
              <FaChartLine className="icon" />
            </div>
            <h3>Data Analytics</h3>
            <p>
              Providing insightful analytics for informed decision-making,
              helping healthcare providers optimize operations, improve patient
              care, and enhance resource allocation.
            </p>
          </div>
          <div className="service-card">
            <div className="icon-container">
              <FaFileAlt className="icon" />
            </div>
            <h3>Report Analysis</h3>
            <p>
              AI-powered medical report analysis to help you understand your lab
              results and health conditions better with expert insights.
            </p>
          </div>

          <div className="service-card">
            <div className="icon-container">
              <FaClipboardList className="icon" />
            </div>
            <h3>Latest Health News & Blogs</h3>
            <p>
              Stay updated with the latest healthcare news, research updates,
              and expert blogs to make informed health decisions.
            </p>
          </div>
        </div>
      </div>

      {/* Health Calculators Section */}
      <div id="health-calculators" className="calculators-section">
        {/* Health Calculators section */}
        <HealthCalculators />
      </div>

      {/* Report Analyzer Section */}
      <div id="report-analyzer" className="homepage-report-analyzer-section">
        <div className="homepage-analyzer-container">
          <div className="homepage-analyzer-content">
            <h2>Medical Report Analyzer</h2>
            <p>
              Upload your medical reports to get easy to understand reports and
              analysis. Understand your health better with detailed explanations
              and recommendations.
            </p>
            <Link to="/analyzer">
              <button className="homepage-analyzer-button">Analyze Now</button>
            </Link>
          </div>
          <div className="homepage-analyzer-image">
            <img src=".\assets\report-analysis.jpg" alt="Report Analysis" />
          </div>
        </div>
      </div>
      <Footer />
    </Layout>
  );
};

export default Homepage;

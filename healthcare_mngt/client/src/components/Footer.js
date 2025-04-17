// src/components/Footer.js

import React from 'react';
import '../styles/Footer.css'; // Make sure this CSS file exists

const Footer = () => {
    return (
        <footer id="footer" className="footer"> {/* Add an ID for scrolling */}
            <div className="footer-content">
                <div className="about-section">
                    <h3>About Us</h3>
                    <p>MEDSWIFT is dedicated to transforming healthcare with innovative solutions that enhance patient care and streamline operations for healthcare providers.</p>
                </div>
                <div className="quick-links-section">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><a href="#about-section">About</a></li>
                        <li><a href="#services-section">Services</a></li>
                        <li><a href="#health-calculators">BMI Calculator</a></li>
                        <li><a href="#footer">Contact Us</a></li> {/* Link to footer section */}
                    </ul>
                </div>
                <div className="footer-image">
                    <img src="/assets/doctors.jpg" alt="Footer" className="footer-img" />
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} MEDSWIFT. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;

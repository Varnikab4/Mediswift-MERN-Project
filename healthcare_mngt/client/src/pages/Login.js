import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import {
  FaHandHoldingMedical,
  FaEnvelope,
  FaLock,
  FaSignInAlt,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { MdHealthAndSafety } from "react-icons/md";
import axios from "axios";
import "../styles/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for show/hide password
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // validation state
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    validateField("email", event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    validateField("password", event.target.value);
  };

  const handleBlur = (field) => {
    setTouched({
      ...touched,
      [field]: true,
    });

    // Validate on blur
    validateField(field, field === "email" ? email : password);
  };

  // Validation function
  const validateField = (field, value) => {
    let error = "";

    switch (field) {
      case "email":
        if (!value) {
          error = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          error = "Email is invalid";
        }
        break;

      case "password":
        if (!value) {
          error = "Password is required";
        }
        break;

      default:
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));

    return error === "";
  };

  // Validate all fields
  const validateForm = () => {
    const emailValid = validateField("email", email);
    const passwordValid = validateField("password", password);

    // Mark all fields as touched
    setTouched({
      email: true,
      password: true,
    });

    return emailValid && passwordValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      dispatch(showLoading());
      const res = await axios.post("/api/v1/user/login", { email, password });
      dispatch(hideLoading());
      setLoading(false);

      if (res.data.success) {
        // Save token to localStorage and reload the page
        localStorage.setItem("token", res.data.token);
        window.location.reload(); // This will reload the page
      } else {
        alert(res.data.message); // Display error if login fails
      }
    } catch (error) {
      setLoading(false);
      dispatch(hideLoading());
      console.error("Error during login:", error);
      alert("Login failed, please try again.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-image-container">
          <div className="login-welcome">
            <h2>Welcome back to</h2>
            <div className="logo-container">
              <FaHandHoldingMedical className="logo-icon" />
              <h1>MediSwift</h1>
            </div>
            <p>Your comprehensive hospital management system</p>

            <div className="testimonials">
              <div className="testimonial">
                <div className="testimonial-quote">
                  "MediSwift has revolutionized our hospital operations"
                </div>
                <div className="testimonial-author">
                  - Dr. Johnson, Chief Medical Officer
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="login-form-container">
          <div className="login-form">
            <div className="form-paper-fold"></div>
            <div className="form-header">
              <MdHealthAndSafety className="form-header-icon" />
              <h2>Sign In</h2>
            </div>
            <p className="form-subtitle">Enter Your Credentials</p>

            <form onSubmit={handleSubmit} noValidate>
              <div
                className={`input-group ${
                  touched.email && errors.email ? "input-error" : ""
                }`}
              >
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={() => handleBlur("email")}
                  className={touched.email && errors.email ? "error" : ""}
                />
                {touched.email && errors.email && (
                  <div className="error-message">{errors.email}</div>
                )}
              </div>

              <div
                className={`input-group ${
                  touched.password && errors.password ? "input-error" : ""
                }`}
              >
                <FaLock className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"} // Toggle password visibility
                  placeholder="Password"
                  value={password}
                  onChange={handlePasswordChange}
                  onBlur={() => handleBlur("password")}
                  className={touched.password && errors.password ? "error" : ""}
                />
                <span
                  className="show-password-icon"
                  onClick={() => setShowPassword((prev) => !prev)} // Toggle visibility
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
                {touched.password && errors.password && (
                  <div className="error-message">{errors.password}</div>
                )}
              </div>

              <button className="login-button" type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
                {!loading && <FaSignInAlt className="button-icon" />}
              </button>

              <div className="register-link-container">
                <p>Don't have an account?</p>
                <Link to="/register" className="register-link">
                  Create Account
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

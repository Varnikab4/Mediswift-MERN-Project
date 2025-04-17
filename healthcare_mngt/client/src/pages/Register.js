import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import axios from "axios";
import {
  FaHandHoldingMedical,
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaUserPlus,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import "../styles/Register.css";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const nameRef = useRef();

  // form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  // validation state
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    phone: false,
  });

  // Show password state
  const [showPassword, setShowPassword] = useState(false);

  // form handlers
  const handleName = (event) => {
    setName(event.target.value);
    validateField("name", event.target.value);
  };

  const handleEmail = (event) => {
    setEmail(event.target.value);
    validateField("email", event.target.value);
  };

  const handlePassword = (event) => {
    setPassword(event.target.value);
    validateField("password", event.target.value);
  };

  const handlePhone = (event) => {
    const value = event.target.value.replace(/[^0-9]/g, ""); // Only allows numbers
    if (value.length <= 10) {
      // Restrict to 10 digits only
      setPhone(value);
      validateField("phone", value);
    }
  };

  const handleBlur = (field) => {
    setTouched({
      ...touched,
      [field]: true,
    });

    // Validate on blur
    validateField(
      field,
      field === "name"
        ? name
        : field === "email"
        ? email
        : field === "password"
        ? password
        : phone
    );
  };

  // Validation function
  const validateField = (field, value) => {
    let error = "";

    switch (field) {
      case "name":
        if (!value.trim()) {
          error = "Name is required";
        } else if (value.trim().length < 3) {
          error = "Name must be at least 3 characters";
        }
        break;

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
        } else if (value.length < 6) {
          error = "Password must be at least 6 characters";
        }
        break;

      case "phone":
        if (!value) {
          error = "Phone number is required";
        } else if (!/^[0-9]{10,15}$/.test(value.replace(/[^0-9]/g, ""))) {
          error = "Enter a valid phone number";
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
    const nameValid = validateField("name", name);
    const emailValid = validateField("email", email);
    const passwordValid = validateField("password", password);
    const phoneValid = validateField("phone", phone);

    // Mark all fields as touched
    setTouched({
      name: true,
      email: true,
      password: true,
      phone: true,
    });

    return nameValid && emailValid && passwordValid && phoneValid;
  };

  // Submit form with axios
  const onfinishHandler = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      dispatch(showLoading());
      const values = { name, email, password, phone };
      const res = await axios.post("/api/v1/user/register", values);
      dispatch(hideLoading());
      setLoading(false);

      if (res.data.success) {
        alert("Registered Successfully!");
        navigate("/login");
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      setLoading(false);
      dispatch(hideLoading());
      console.error(error);
      alert("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-image-container">
          <div className="register-welcome">
            <h2>Welcome to</h2>
            <div className="logo-container">
              <FaHandHoldingMedical className="logo-icon" />
              <h1>MediSwift</h1>
            </div>
            <p>Your comprehensive hospital management system</p>
            {/* Add creative image here */}
            <img
              src="../assets/Hospital-doc.jpg"
              alt="Hospital Management"
              className="creative-image"
            />
          </div>
        </div>

        <div className="register-form-container">
          <div className="register-form">
            <h2>Create an Account</h2>
            <p className="form-subtitle">Join our healthcare network today</p>

            <form onSubmit={onfinishHandler} noValidate>
              <div
                className={`input-group ${
                  touched.name && errors.name ? "input-error" : ""
                }`}
              >
                <FaUser className="input-icon" />
                <input
                  type="text"
                  placeholder="Full Name"
                  onChange={handleName}
                  onBlur={() => handleBlur("name")}
                  value={name}
                  ref={nameRef}
                  className={touched.name && errors.name ? "error" : ""}
                />
                {touched.name && errors.name && (
                  <div className="error-message">{errors.name}</div>
                )}
              </div>

              <div
                className={`input-group ${
                  touched.email && errors.email ? "input-error" : ""
                }`}
              >
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  placeholder="Email Address"
                  onChange={handleEmail}
                  onBlur={() => handleBlur("email")}
                  value={email}
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
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  onChange={handlePassword}
                  onBlur={() => handleBlur("password")}
                  value={password}
                  className={touched.password && errors.password ? "error" : ""}
                />
                <div
                  className="show-password-icon"
                  onClick={() => setShowPassword((prevState) => !prevState)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
                {touched.password && errors.password && (
                  <div className="error-message">{errors.password}</div>
                )}
              </div>

              <div
                className={`input-group ${
                  touched.phone && errors.phone ? "input-error" : ""
                }`}
              >
                <FaPhone className="input-icon" />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  onChange={handlePhone}
                  onBlur={() => handleBlur("phone")}
                  value={phone}
                  className={touched.phone && errors.phone ? "error" : ""}
                  maxLength={10} // Ensure no more than 10 digits
                />
                {touched.phone && errors.phone && (
                  <div className="error-message">{errors.phone}</div>
                )}
              </div>

              <button
                className="register-button"
                type="submit"
                disabled={loading}
              >
                {loading ? "Processing..." : "Register Now"}
                {!loading && <FaUserPlus className="button-icon" />}
              </button>

              <div className="login-link-container">
                <p>Already have an account?</p>
                <Link to="/login" className="login-link">
                  Sign in
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useParams } from "react-router-dom";
import axios from "axios";
import { DatePicker, message, TimePicker } from "antd";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import "../styles/BookingPage.css";

const BookingPage = () => {
  const { user } = useSelector((state) => state.user);
  const params = useParams();
  const [doctors, setDoctors] = useState([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [isAvailable, setIsAvailable] = useState(false);
  const [isValidTime, setIsValidTime] = useState(true);
  const [showBio, setShowBio] = useState(false);
  const dispatch = useDispatch();

  // login user data
  const getUserData = async () => {
    try {
      const res = await axios.post(
        "/api/v1/doctor/getDoctorById",
        { doctorId: params.doctorId },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.data.success) {
        setDoctors(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Debug function to log time values
  const logTimeValues = (selectedTime) => {
    if (!doctors.timings || doctors.timings.length < 2) return;
    
    console.log("Selected time:", selectedTime);
    console.log("Doctor start time:", doctors.timings[0]);
    console.log("Doctor end time:", doctors.timings[1]);
  };

  // check if time is within doctor's timings - FIXED version
  const isTimeWithinDoctorsTimings = (selectedTime) => {
    if (!doctors.timings || doctors.timings.length < 2) return false;
    if (!selectedTime) return false;

    // For debugging
    logTimeValues(selectedTime);
    
    // Use Moment's built-in comparison for more reliable results
    // Create moment objects with just the time part (no date)
    const today = moment().format("YYYY-MM-DD");
    const startTime = moment(`${today} ${doctors.timings[0]}`, "YYYY-MM-DD HH:mm");
    const endTime = moment(`${today} ${doctors.timings[1]}`, "YYYY-MM-DD HH:mm");
    const selected = moment(`${today} ${selectedTime}`, "YYYY-MM-DD HH:mm");
    
    // Check if selected time is between start and end time
    return selected.isSameOrAfter(startTime) && selected.isSameOrBefore(endTime);
  };

  // handle availability
  const handleAvailability = async () => {
    try {
      if (!date || !time) {
        return message.error("Please select both date and time");
      }

      // Check if selected time is within doctor's timings
      if (!isTimeWithinDoctorsTimings(time)) {
        setIsAvailable(false);
        setIsValidTime(false);
        return message.error(
          `Time must be between ${doctors.timings[0]} and ${doctors.timings[1]}`
        );
      }

      // Time is valid, proceed with availability check
      setIsValidTime(true);

      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/user/booking-availability",
        { doctorId: params.doctorId, date, time },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        setIsAvailable(true);
        message.success(res.data.message);
      } else {
        setIsAvailable(false);
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      setIsAvailable(false);
    }
  };

  // booking function
  const handleBooking = async () => {
    try {
      if (!date || !time) {
        return message.error("Date & Time Required");
      }

      // Check if time is within doctor's timings before proceeding
      if (!isTimeWithinDoctorsTimings(time)) {
        setIsValidTime(false);
        return message.error(
          `Time must be between ${doctors.timings[0]} and ${doctors.timings[1]}`
        );
      }

      // Time is valid, proceed with booking
      setIsValidTime(true);

      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/user/book-appointment",
        {
          doctorId: params.doctorId,
          userId: user._id,
          doctorInfo: doctors,
          userInfo: user,
          date: date,
          time: time,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
    }
  };

  // Check time validity when time changes
  useEffect(() => {
    if (time) {
      setIsValidTime(isTimeWithinDoctorsTimings(time));
    }
  }, [time]);

  useEffect(() => {
    getUserData();
    //eslint-disable-next-line
  }, []);

  return (
    <Layout>
      <div className="container">
        <h3>Book Your Appointment</h3>

        {doctors && (
          <div>
            <div className="doctor-info">
              <h4>
                Dr. {doctors.firstName} {doctors.lastName}
              </h4>
              <div className="doctor-bio-btn-container">
                <button
                  className="bio-btn"
                  onClick={() => setShowBio(!showBio)}
                >
                  <i className="fas fa-info-circle"></i>
                  {showBio ? "Hide Bio" : "View Bio"}
                </button>
              </div>
              <h4 className="doctor-fee">
                Fees: ₹{doctors.feesPerConsultation}
              </h4>
              <h4 className="doctor-timings">
                Timings:{" "}
                {doctors.timings?.length >= 2
                  ? `${doctors.timings[0]} - ${doctors.timings[1]}`
                  : "Not Available"}
              </h4>
            </div>

            {/* Bio Card */}
            <div className={`bio-card ${showBio ? "active" : ""}`}>
              <h5 className="bio-card-header">
                Dr. {doctors.firstName} {doctors.lastName}
              </h5>
              <div className="bio-card-content">
                <div className="bio-card-section">
                  <p>{doctors.bio || "Bio not available."}</p>
                </div>
              </div>
            </div>

            <div className="booking-form">
              <div className="picker-wrapper">
                <label className="picker-label">Select Date</label>
                <DatePicker
                  className="ant-picker"
                  format="DD-MM-YYYY"
                  onChange={(value) => {
                    setDate(value ? moment(value).format("DD-MM-YYYY") : "");
                    setIsAvailable(false); // Reset availability when date changes
                  }}
                />
              </div>

              <div className="picker-wrapper">
                <label className="picker-label">Select Time</label>
                <TimePicker
                  className="ant-picker"
                  format="HH:mm"
                  onChange={(value) => {
                    const timeValue = value ? value.format("HH:mm") : "";
                    setTime(timeValue);
                    setIsAvailable(false); // Reset availability when time changes
                    
                    // Check if time is valid when changed
                    if (timeValue) {
                      setIsValidTime(isTimeWithinDoctorsTimings(timeValue));
                    } else {
                      setIsValidTime(true); // No time selected means no error yet
                    }
                  }}
                />
              </div>

              <div className="buttons-container">
                <button
                  className="btn btn-primary"
                  onClick={handleAvailability}
                >
                  Check Availability
                </button>

                <button
                  className="btn btn-dark"
                  onClick={handleBooking}
                  disabled={!isValidTime || !date || !time}
                >
                  Book Appointment
                </button>
              </div>

              {!isValidTime && time && (
                <div
                  className="mt-3"
                  style={{ color: "#e74c3c", fontWeight: "500" }}
                >
                  <span className="availability-indicator unavailable"></span>
                  Please select time between {doctors.timings?.[0]} and {doctors.timings?.[1]}
                </div>
              )}

              {isAvailable && isValidTime && (
                <div
                  className="mt-3"
                  style={{ color: "#2ecc71", fontWeight: "500" }}
                >
                  <span className="availability-indicator available"></span>
                  Doctor is available at this time
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BookingPage;
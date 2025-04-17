import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUserMd, FaClock, FaMoneyBill, FaStethoscope } from "react-icons/fa";
import "../styles/DoctorsList.css";
import moment from "moment";

const AllDoctorList = ({ doctor }) => {
  const navigate = useNavigate();

  const formatTime = (timeString) => {
    if (!timeString) return "Not Available";
    return moment(timeString, "HH:mm").format("hh:mm A"); // Converts "17:50" to "05:50 PM"
  };

  return (
    <div
      className="card p-2 m-2"
      style={{ cursor: "pointer" }}
      onClick={() => navigate(`/doctor/book-appointment/${doctor?._id}`)}
    >
      {/* Display uploaded doctor image */}
      {doctor.profileImage && ( // Fixed condition to match profileImage
        <div style={{ textAlign: "center", marginBottom: "10px" }}>
          <img
            src={`http://localhost:5000/uploads/${doctor.profileImage}`} // Corrected URL
            alt="Doctor"
            style={{ width: "100px", height: "100px", borderRadius: "50%" }}
            onError={(e) => (e.target.src = "/default-profile.png")} // Fallback image
          />
        </div>
      )}

      <div className="card-header">
        Dr. {doctor?.firstName} {doctor?.lastName}
      </div>
      <div className="card-body">
        <p>
          <FaStethoscope className="icon" />
          <b>Specialization:</b> {doctor?.specialization || "Not Available"}
        </p>
        <p>
          <FaUserMd className="icon" />
          <b>Experience:</b>{" "}
          {doctor?.experience ? `${doctor.experience} years` : "Not Available"}
        </p>
        <p>
          <FaMoneyBill className="icon" />
          <b>Fees Per Consultation:</b> ₹
          {doctor?.feesPerConsultation ?? "Not Available"}
        </p>

        {/* {doctor?.bio && (
          <p>
            <b>Bio:</b>{" "}
            {doctor.bio.length > 100
              ? `${doctor.bio.substring(0, 100)}...`
              : doctor.bio}
          </p>
        )} */}
        <p>
          <FaClock /> <strong>Timings:</strong>{" "}
          {Array.isArray(doctor?.timings) && doctor.timings.length > 0
            ? doctor.timings.map((time) => formatTime(time)).join(" - ")
            : "Not Available"}
        </p>
      </div>
    </div>
  );
};

export default AllDoctorList;

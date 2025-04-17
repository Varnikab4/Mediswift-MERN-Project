import React, { useEffect, useState } from "react";
import { getUserProfile, updateUserProfile } from "../services/api";
import Layout from "../components/Layout";
import "../styles/UserProfile.css";

const Profile = () => {
  const [user, setUser] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    gender: "",
  });

  const token = localStorage.getItem("token"); // Get token from local storage

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await getUserProfile(token);
        if (response.data.success) {
          setUser(response.data.data);
          setFormData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchUserProfile();
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateUserProfile(token, formData);
      if (response.data.success) {
        alert("Profile Updated Successfully!");
        setUser(response.data.data);
        setFormData(response.data.data); // Update formData with new values
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <Layout>
    <div className="profile-container">
      <h2>User Profile</h2>
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />

        <label>Email:</label>
        <input type="email" name="email" value={formData.email} readOnly />

        <label>Phone:</label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />

        <label>Address:</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
        />

        <label>Gender:</label>
        <select name="gender" value={formData.gender} onChange={handleChange}>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <button type="submit">Update Profile</button>
      </form>
    </div>
    </Layout>
  );
};

export default Profile;

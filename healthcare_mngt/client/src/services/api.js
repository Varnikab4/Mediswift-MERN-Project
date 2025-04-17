import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:8080" });

export const getUserProfile = async (token) => {
  return API.get("/api/v1/profile/getProfile", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateUserProfile = async (token, userData) => {
  return API.put("/api/v1/profile/updateProfile", userData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

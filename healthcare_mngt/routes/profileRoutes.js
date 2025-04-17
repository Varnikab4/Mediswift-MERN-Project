const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { getUserProfileController, updateUserProfileController } = require("../controllers/profileController");

const router = express.Router();

// Get user profile
router.get("/getProfile", authMiddleware, getUserProfileController);

// Update user profile
router.put("/updateProfile", authMiddleware, updateUserProfileController);

module.exports = router;

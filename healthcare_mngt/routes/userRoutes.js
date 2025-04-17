const express = require("express");
const upload = require("../config/multer"); // Use the existing multer config

const {
  loginController,
  registerController,
  authController,
  applyDoctorController,
  getAllNotificationController,
  deleteAllNotificationController,
  getAllDoctorsController,
  bookAppointmentController,
  bookingAvailabilityController,
  userAppointmentsController,
  sendAppointmentReminder,
} = require("../controllers/userCtrl");

const authMiddleware = require("../middleware/authMiddleware");

// Router object
const router = express.Router();

// Routes

// Login || POST
router.post("/login", loginController);

// Register || POST
router.post("/register", registerController);

// Auth || POST
router.post("/getUserData", authMiddleware, authController);

// Apply Doctor || POST (✅ Image Upload Fixed)
router.post(
  "/apply-doctor",
  authMiddleware,
  upload.single("profileImage"),
  applyDoctorController
);

// Notification|| POST
router.post(
  "/get-all-notification",
  authMiddleware,
  getAllNotificationController
);

// Notification|| POST
router.post(
  "/delete-all-notification",
  authMiddleware,
  deleteAllNotificationController
);

// Route to send appointment reminder emails
router.post("/send-reminder", authMiddleware, sendAppointmentReminder);

// Get all doctors
router.get("/getAllDoctors", authMiddleware, getAllDoctorsController);

// Book appointment
router.post("/book-appointment", authMiddleware, bookAppointmentController);

// Booking availability
router.post(
  "/booking-availability",
  authMiddleware,
  bookingAvailabilityController
);

// Appointments List
router.get("/user-appointments", authMiddleware, userAppointmentsController);

module.exports = router;

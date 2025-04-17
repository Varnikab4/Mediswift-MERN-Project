// controllers/userCtrl.js
const userModel = require("../models/userModels");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const doctorModel = require("../models/doctorModel");
const appointmentModel = require("../models/appointmentModel");
const moment = require("moment");
const nodemailer = require("nodemailer");
const sendEmail = require("../email-services/mailService");

// Register callback
const registerController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await userModel.findOne({ email: req.body.email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User Already Exists", success: false });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;

    const newUser = new userModel(req.body);
    await newUser.save();
    res.status(201).json({ message: "Registered Successfully", success: true });
  } catch (error) {
    console.error(`Error in registerController: ${error.message}`);
    res.status(500).json({
      success: false,
      message: `Register Controller: ${error.message}`,
    });
  }
};

// Login callback (example)
// const loginController = async (req, res) => {
//   try {
//     // Find the user by email
//     const user = await userModel.findOne({ email: req.body.email });

//     // Check if user exists
//     if (!user) {
//       return res.status(400).json({ message: "Invalid Credentials", success: false });
//     }

//     // Compare the entered password with the stored hashed password
//     const isMatch = await bcrypt.compare(req.body.password, user.password);
//     console.log("Password comparison result:", isMatch); // Check if bcrypt is working as expected

//     // If password doesn't match, return error
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid Credentials", success: false });
//     }

//     // Password matched, login successful
//     res.status(200).json({ message: "Login Successful", success: true });
//   } catch (error) {
//     console.error(`Error in loginController: ${error.message}`);
//     res.status(500).json({ success: false, message: `Login Controller: ${error.message}` });
//   }
// };
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Check if the user exists in the database
    const user = await userModel.findOne({ email: req.body.email });

    if (!user) {
      return res
        .status(404)
        .send({ message: "User not found", success: false });
    }

    // Compare the entered password with the stored hashed password
    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if (!isMatch) {
      return res
        .status(401)
        .send({ message: "Invalid Email or Password", success: false });
    }

    // Generate a JWT token for the user
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h", // Token will expire in 1 hour
    });

    // Send success response with the generated token
    res.status(200).send({
      message: "Login Successful",
      success: true,
      token,
    });
  } catch (error) {
    console.error(`Error in loginController: ${error.message}`);
    res
      .status(500)
      .send({ message: `Error in Login Controller: ${error.message}` });
  }
};

const authController = async (req, res) => {
  try {
    const user = await userModel.findById({ _id: req.body.userId });
    user.password = undefined;

    if (!user) {
      return res.status(200).send({
        message: "user not found",
        success: false,
      });
    } else {
      res.status(200).send({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "auth error",
      success: false,
      error,
    });
  }
};

// apply doctor ctrl
const applyDoctorController = async (req, res) => {
  try {
    // Ensure file is uploaded
    const profileImage = req.file
      ? `/assets/uploads/${req.file.filename}`
      : null;
    const {
      firstName,
      lastName,
      phone,
      email,
      address,
      specialization,
      experience,
      feesPerConsultation,
      timings,
      bio,
    } = req.body;

    // Validate fields before saving
    if (
      !firstName ||
      !lastName ||
      !phone ||
      !email ||
      !address ||
      !specialization ||
      !experience ||
      !feesPerConsultation ||
      !timings ||
      !bio
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // Check if the user is already a doctor
    const existingDoctor = await doctorModel.findOne({
      userId: req.body.userId,
    });
    if (existingDoctor) {
      return res.status(400).send({
        success: false,
        message:
          "You have already applied for a doctor account or are already a doctor.",
      });
    }

    // Create new doctor entry
    const newDoctor = new doctorModel({ ...req.body, status: "pending" });
    await newDoctor.save();

    // Find an admin user
    const adminUser = await userModel.findOne({ isAdmin: true });
    if (!adminUser) {
      return res.status(500).send({
        success: false,
        message: "Admin user not found. Please contact support.",
      });
    }

    // Ensure notifications array exists
    if (!adminUser.notification) {
      adminUser.notification = [];
    }

    // Push notification for the admin
    adminUser.notification.push({
      type: "apply-doctor-request",
      message: `${newDoctor.firstName} ${newDoctor.lastName} has applied for a doctor account.`,
      data: {
        doctorId: newDoctor._id,
        name: `${newDoctor.firstName} ${newDoctor.lastName}`,
        onClickPath: "/admin/doctors",
      },
    });

    await adminUser.save();

    res.status(201).send({
      success: true,
      message: "Doctor account application submitted successfully.",
    });
  } catch (error) {
    console.error("Error in applyDoctorController:", error.message);
    res.status(500).send({
      success: false,
      message: "An error occurred while applying for a doctor account.",
      error: error.message,
    });
  }
};

// Get User Info
const getUserInfoController = async (req, res) => {
  try {
    const user = await userModel.findById(req.body.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error("Error in getUserInfoController:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//notification ctrl
const getAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    const seennotification = user.seennotification;
    const notification = user.notification;
    seennotification.push(...notification);
    user.notification = [];
    user.seennotification = notification;
    const updatedUser = await user.save();
    res.status(200).send({
      success: true,
      message: "All notifications marked as read",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error in notification",
      success: false,
      error,
    });
  }
};

// delete notification
const deleteAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    user.notification = [];
    user.seennotification = [];
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "Notifications Deleted successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "unable to delete all notifications",
      error,
    });
  }
};

// get all doc
const getAllDoctorsController = async (req, res) => {
  try {
    const doctors = await doctorModel.find({ status: "approved" });
    res.status(200).send({
      success: true,
      message: "Doctors List Fetched Successfully",
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While Fetching Doctor",
    });
  }
};
// Book appointment
const bookAppointmentController = async (req, res) => {
  try {
    // Convert date and time to strings to prevent timezone issues
    const dateString = req.body.date; // Should be in "DD-MM-YYYY" format
    const timeString = req.body.time; // Should be in "HH:mm" format

    // Create a new appointment
    const newAppointment = new appointmentModel({
      ...req.body,
      // Store as strings explicitly
      date: dateString,
      time: timeString,
      status: "pending"
    });
    
    await newAppointment.save();
    
    const user = await userModel.findOne({ _id: req.body.doctorInfo.userId });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Doctor not found",
      });
    }

    // Ensure notification array exists
    if (!user.notification) {
      user.notification = [];
    }

    user.notification.push({
      type: "New-appointment-request",
      message: `A New Appointment Request From ${req.body.userInfo.name}`,
      onClickPath: "/user/appointments",
    });

    await user.save();

    // Send Email Notification to User
    try {
      await sendEmail(
        req.body.userInfo.email,
        "Appointment Request Sent",
        `Dear ${req.body.userInfo.name},

        Your appointment request with Dr. ${req.body.doctorInfo.firstName} ${req.body.doctorInfo.lastName} has been sent for approval.
        
        Appointment Details:
        Date: ${dateString}
        Time: ${timeString}

        You will receive another email once the doctor approves or rejects your request.

        Thank you.`
      );
      console.log(`✅ Email sent to ${req.body.userInfo.email}`);
    } catch (emailError) {
      console.error("❌ Error sending appointment request email:", emailError);
    }

    res.status(200).send({
      success: true,
      message: "Appointment Booked Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While Booking Appointment",
    });
  }
};


// booking availability controller
const bookingAvailabilityController = async (req, res) => {
  try {
    const dateString = req.body.date; // "DD-MM-YYYY" format
    const timeString = req.body.time; // "HH:mm" format
    const doctorId = req.body.doctorId;
    
    // Convert time to hours and minutes for range comparison
    const [hours, minutes] = timeString.split(':').map(Number);
    
    // Calculate one hour before and after (in HH:mm format)
    const fromTime = `${String(hours - 1).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    const toTime = `${String(hours + 1).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    
    // Find conflicting appointments using string comparison
    const appointments = await appointmentModel.find({
      doctorId,
      date: dateString,
      time: {
        $gte: fromTime,
        $lte: toTime,
      },
    });
    
    if (appointments.length > 0) {
      return res.status(200).send({
        message: "Appointments not Available at this time",
        success: true,
      });
    } else {
      return res.status(200).send({
        success: true,
        message: "Appointments Available",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error In Booking",
    });
  }
};

// Send Appointment Reminder
const sendAppointmentReminder = async (req, res) => {
  try {
    res
      .status(200)
      .json({ success: true, message: "Reminder sent successfully" });
  } catch (error) {
    console.error("Error in sendAppointmentReminder:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const userAppointmentsController = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({
      userId: req.body.userId,
    });
    res.status(200).send({
      success: true,
      message: "Users Appointments Fetch Successfully",
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error In User Appointments",
    });
  }
};

module.exports = {
  registerController,
  loginController,
  authController,
  applyDoctorController,
  getAllNotificationController,
  deleteAllNotificationController,
  getAllDoctorsController,
  bookAppointmentController,
  bookingAvailabilityController,
  userAppointmentsController,
  sendAppointmentReminder,
  getUserInfoController,
};

const appointmentModel = require("../models/appointmentModel");
const doctorModel = require("../models/doctorModel");
const userModel = require("../models/userModels");
const sendEmail = require("../email-services/mailService");
const moment = require("moment");

const getDoctorInfoController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ userId: req.body.userId });
    res.status(200).send({
      success: true,
      message: "Doctor data fetched successfully",
      data: doctor,
    });
  } catch (error) {
    console.error("Error in getDoctorInfoController:", error);
    res.status(500).send({
      success: false,
      message: "Error in fetching doctor details",
      error,
    });
  }
};

// Update Doctor Profile
const updateProfileController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOneAndUpdate(
      { userId: req.body.userId },
      req.body,
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Doctor profile updated successfully",
      data: doctor,
    });
  } catch (error) {
    console.error("Error in updateProfileController:", error);
    res.status(500).send({
      success: false,
      message: "Error updating doctor profile",
      error,
    });
  }
};

// Get Single Doctor by ID
const getDoctorByIdController = async (req, res) => {
  try {
    const doctor = await doctorModel.findById(req.body.doctorId);
    res.status(200).send({
      success: true,
      message: "Single doctor info fetched successfully",
      data: doctor,
    });
  } catch (error) {
    console.error("Error in getDoctorByIdController:", error);
    res.status(500).send({
      success: false,
      message: "Error fetching doctor information",
      error,
    });
  }
};

// Get Doctor's Appointments
const doctorAppointmentsController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ userId: req.body.userId });
    const appointments = await appointmentModel.find({ doctorId: doctor._id });

    res.status(200).send({
      success: true,
      message: "Doctor appointments fetched successfully",
      data: appointments,
    });
  } catch (error) {
    console.error("Error in doctorAppointmentsController:", error);
    res.status(500).send({
      success: false,
      message: "Error fetching doctor appointments",
      error,
    });
  }
};

// Update Appointment Status
const updateStatusController = async (req, res) => {
  try {
    const { appointmentsId, status } = req.body;

    const appointment = await appointmentModel.findByIdAndUpdate(
      appointmentsId,
      { status },
      { new: true }
    );

    // ✅ Fetch user details
    const user = await userModel.findById(appointment.userId);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // ✅ Fetch doctor details
    const doctor = await doctorModel.findById(appointment.doctorId);
    if (!doctor) {
      return res.status(404).send({
        success: false,
        message: "Doctor not found",
      });
    }

    const notifcation = user.notification;
    notifcation.push({
      type: "status-updated",
      message: `your appointment has been updated ${status}`,
      onCLickPath: "/doctor-appointments",
    });
    await user.save();
    // res.status(200).send({
    //   success: true,
    //   message: "Appointment Status Updated",
    // });

    // ✅ Prepare email content
    let emailSubject = "";
    let emailText = "";

    if (status === "approved") {
      emailSubject = "Appointment Approved";
      emailText = `Dear ${user.name},

Your appointment with Dr. ${doctor.firstName} ${
        doctor.lastName
      } has been approved.

📅 Date: ${moment(appointment.date, "DD-MM-YYYY").format("DD-MM-YYYY")}
🕒 Time: ${moment(appointment.time, "HH:mm").format("hh:mm A")}
📍 Address: MediSwift, Wadala, Mumbai
📞 Doctor's Contact: ${doctor.phone}

Thank you!`;
    } else if (status === "reject" || status === "rejected") {
      emailSubject = "Appointment Rejected";
      emailText = `Dear ${user.name},

Unfortunately, your appointment with Dr. ${doctor.firstName} ${
        doctor.lastName
      } has been rejected.

📅 Date: ${moment(appointment.date, "DD-MM-YYYY").format("DD-MM-YYYY")}
🕒 Time: ${
        appointment.time
          ? moment(appointment.time, "HH:mm").format("hh:mm A")
          : "00:00"
      }

Please try booking another slot.

Thank you.`;
    } else {
      emailSubject = "Appointment Status Update";
      emailText = `Dear ${user.name},

Your appointment with Dr. ${doctor.firstName} ${doctor.lastName} has been updated to: ${status}.

Thank you.`;
    }

    console.log("📧 Email Subject:", emailSubject);
    console.log("📧 Email Text:", emailText);

    // ✅ Send email notification
    if (emailSubject) {
      await sendEmail(user.email, emailSubject, emailText);
    } else {
      console.log("❌ Email not sent: emailSubject is undefined.");
    }

    res.status(200).send({
      success: true,
      message: `Appointment ${status} successfully`,
    });
  } catch (error) {
    console.error("❌ Error in updateStatusController:", error);
    res.status(500).send({
      success: false,
      message: "Error updating appointment status",
      error,
    });
  }
};

module.exports = {
  getDoctorInfoController,
  updateProfileController,
  getDoctorByIdController,
  doctorAppointmentsController,
  updateStatusController,
};
